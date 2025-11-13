/**
 * Backend Integration for SecurePulse Identity Service
 * 
 * This module provides type-safe integration with the Identity Service API
 * for automated tenant onboarding, authentication, and provisioning.
 */

// Configuration - these should come from environment variables in production
const config = {
  // Identity Service URL - deployed Azure App Service
  identityServiceUrl: process.env.REACT_APP_IDENTITY_SERVICE_URL || 'https://securepulse-identity.azurewebsites.net',
  
  // For local development
  localDevUrl: 'http://localhost:3000',
  
  // Environment detection
  isDevelopment: process.env.NODE_ENV === 'development',
};

export const IDENTITY_SERVICE_URL = config.isDevelopment 
  ? config.localDevUrl 
  : config.identityServiceUrl;

// Type definitions
export interface OnboardingRequest {
  name?: string;
  adminEmail?: string;
  company?: string;
  plan?: 'essential' | 'professional' | 'enterprise';
  locale?: 'en-CA' | 'fr-CA';
}

export interface OnboardingResponse {
  success: boolean;
  adminConsentUrl?: string;
  tempTenantId?: string;
  error?: string;
}

export interface TenantStatus {
  id: string;
  azure_tenant_guid?: string;
  name?: string;
  status: 'pending' | 'provisioning' | 'active' | 'failed';
  admin_email?: string;
  created_at?: string;
  provisioned_at?: string;
}

export interface TenantsListResponse {
  tenants: TenantStatus[];
  total: number;
}

/**
 * Error types for better error handling
 */
export class BackendError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'BackendError';
  }
}

/**
 * Initiate onboarding process
 * 
 * POST /api/onboard
 * Returns admin consent URL for Entra ID authentication
 */
export async function initiateOnboarding(
  request: OnboardingRequest
): Promise<OnboardingResponse> {
  try {
    const response = await fetch(`${IDENTITY_SERVICE_URL}/api/onboard`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new BackendError(
        errorData.error || `Onboarding failed with status ${response.status}`,
        response.status,
        errorData
      );
    }

    const data = await response.json();
    
    // Validate response
    if (!data.adminConsentUrl) {
      throw new BackendError('Invalid response: missing adminConsentUrl');
    }

    return {
      success: true,
      adminConsentUrl: data.adminConsentUrl,
      tempTenantId: data.tempTenantId,
    };
  } catch (error) {
    if (error instanceof BackendError) {
      throw error;
    }
    
    // Network or other errors
    throw new BackendError(
      `Failed to connect to Identity Service: ${error instanceof Error ? error.message : 'Unknown error'}`,
      undefined,
      error
    );
  }
}

/**
 * Get tenant status by ID
 * 
 * GET /api/tenant/:id/status
 * Used to poll provisioning progress
 */
export async function getTenantStatus(tenantId: string): Promise<TenantStatus> {
  try {
    const response = await fetch(`${IDENTITY_SERVICE_URL}/api/tenant/${tenantId}/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new BackendError(
        `Failed to fetch tenant status: ${response.status}`,
        response.status
      );
    }

    const data = await response.json();
    return data as TenantStatus;
  } catch (error) {
    if (error instanceof BackendError) {
      throw error;
    }
    
    throw new BackendError(
      `Network error fetching tenant status: ${error instanceof Error ? error.message : 'Unknown error'}`,
      undefined,
      error
    );
  }
}

/**
 * Get list of tenants (for dashboard)
 * 
 * GET /api/tenants
 * Returns all tenants associated with the current user
 */
export async function getTenantsList(): Promise<TenantsListResponse> {
  try {
    const response = await fetch(`${IDENTITY_SERVICE_URL}/api/tenants`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // In production, include authentication token:
      // 'Authorization': `Bearer ${accessToken}`,
    });

    if (!response.ok) {
      throw new BackendError(
        `Failed to fetch tenants: ${response.status}`,
        response.status
      );
    }

    const data = await response.json();
    return {
      tenants: Array.isArray(data) ? data : [],
      total: Array.isArray(data) ? data.length : 0,
    };
  } catch (error) {
    if (error instanceof BackendError) {
      throw error;
    }
    
    throw new BackendError(
      `Network error fetching tenants: ${error instanceof Error ? error.message : 'Unknown error'}`,
      undefined,
      error
    );
  }
}

/**
 * Poll tenant status with automatic retry
 * 
 * Useful for waiting for provisioning to complete
 */
export async function pollTenantStatus(
  tenantId: string,
  options: {
    maxAttempts?: number;
    intervalMs?: number;
    onProgress?: (status: TenantStatus) => void;
  } = {}
): Promise<TenantStatus> {
  const {
    maxAttempts = 60, // 5 minutes at 5s intervals
    intervalMs = 5000,
    onProgress,
  } = options;

  let attempts = 0;

  while (attempts < maxAttempts) {
    const status = await getTenantStatus(tenantId);
    
    if (onProgress) {
      onProgress(status);
    }

    // Terminal states
    if (status.status === 'active' || status.status === 'failed') {
      return status;
    }

    // Wait before next poll
    await new Promise(resolve => setTimeout(resolve, intervalMs));
    attempts++;
  }

  throw new BackendError('Polling timeout: provisioning did not complete in expected time');
}

/**
 * Redirect to Entra ID admin consent
 * 
 * Opens the admin consent URL in the current window or popup
 */
export function redirectToAdminConsent(
  adminConsentUrl: string,
  mode: 'redirect' | 'popup' = 'redirect'
): void {
  if (mode === 'popup') {
    const width = 600;
    const height = 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    
    window.open(
      adminConsentUrl,
      'entra-admin-consent',
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );
  } else {
    window.location.href = adminConsentUrl;
  }
}

/**
 * Handle the full onboarding flow
 * 
 * Convenience function that combines initiation and redirect
 */
export async function startOnboardingFlow(
  request: OnboardingRequest,
  mode: 'redirect' | 'popup' = 'redirect'
): Promise<void> {
  const response = await initiateOnboarding(request);
  
  if (response.adminConsentUrl) {
    // Store tenant ID for later status checking
    if (response.tempTenantId) {
      sessionStorage.setItem('pending-tenant-id', response.tempTenantId);
    }
    
    redirectToAdminConsent(response.adminConsentUrl, mode);
  } else {
    throw new BackendError('No admin consent URL received from server');
  }
}

/**
 * Check if we're returning from admin consent
 * 
 * Call this on app initialization to check if user is returning from consent flow
 */
export function checkConsentCallback(): {
  isCallback: boolean;
  tenantId?: string;
  error?: string;
} {
  const params = new URLSearchParams(window.location.search);
  const tenantId = params.get('tenantId') || sessionStorage.getItem('pending-tenant-id') || undefined;
  const error = params.get('error') || undefined;
  
  const isCallback = params.has('code') || params.has('admin_consent') || !!tenantId;
  
  return {
    isCallback,
    tenantId,
    error,
  };
}

/**
 * Clear onboarding state
 */
export function clearOnboardingState(): void {
  sessionStorage.removeItem('pending-tenant-id');
}

// Export all for convenience
export default {
  IDENTITY_SERVICE_URL,
  initiateOnboarding,
  getTenantStatus,
  getTenantsList,
  pollTenantStatus,
  redirectToAdminConsent,
  startOnboardingFlow,
  checkConsentCallback,
  clearOnboardingState,
};
