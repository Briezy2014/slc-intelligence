export type CommunicationLanguage = {
  code: string;
  name: string;
  nativeName: string;
};

/** Twenty family-communication languages for template + translate picker. */
export const COMMUNICATION_LANGUAGES: CommunicationLanguage[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "ar", name: "Arabic", nativeName: "العربية" },
  { code: "zh", name: "Chinese (Simplified)", nativeName: "简体中文" },
  { code: "zh-Hant", name: "Chinese (Traditional)", nativeName: "繁體中文" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "ht", name: "Haitian Creole", nativeName: "Kreyòl ayisyen" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "ko", name: "Korean", nativeName: "한국어" },
  { code: "pt", name: "Portuguese", nativeName: "Português" },
  { code: "ru", name: "Russian", nativeName: "Русский" },
  { code: "so", name: "Somali", nativeName: "Soomaali" },
  { code: "sw", name: "Swahili", nativeName: "Kiswahili" },
  { code: "tl", name: "Tagalog", nativeName: "Tagalog" },
  { code: "uk", name: "Ukrainian", nativeName: "Українська" },
  { code: "ur", name: "Urdu", nativeName: "اردو" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt" },
  { code: "am", name: "Amharic", nativeName: "አማርኛ" },
  { code: "ne", name: "Nepali", nativeName: "नेपाली" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
];

export function getCommunicationLanguage(code: string): CommunicationLanguage | undefined {
  return COMMUNICATION_LANGUAGES.find((language) => language.code === code);
}

export function communicationLanguageLabel(code: string): string {
  const language = getCommunicationLanguage(code);
  if (!language) return code;
  return `${language.name} (${language.nativeName})`;
}
