import { Globe } from "lucide-react";
import { Button } from "./ui/button";
import { type Locale } from "../lib/i18n";

interface LanguageSwitcherProps {
  currentLocale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

export function LanguageSwitcher({ currentLocale, onLocaleChange }: LanguageSwitcherProps) {
  const toggle = () => {
    onLocaleChange(currentLocale === 'en-CA' ? 'fr-CA' : 'en-CA');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      className="gap-2"
    >
      <Globe className="w-4 h-4" />
      {currentLocale === 'en-CA' ? 'FR' : 'EN'}
    </Button>
  );
}
