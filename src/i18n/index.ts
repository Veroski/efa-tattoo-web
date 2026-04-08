import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import es from "./es";
import en from "./en";

const STORAGE_KEY = "efa_lang";

const savedLang = localStorage.getItem(STORAGE_KEY);
const browserLang = navigator.language.slice(0, 2);
const defaultLang = savedLang || (browserLang === "es" ? "es" : "en");

i18next.use(initReactI18next).init({
  resources: {
    es: { translation: es },
    en: { translation: en },
  },
  lng: defaultLang,
  fallbackLng: "es",
  interpolation: { escapeValue: false },
  returnObjects: true,
});

export function setLanguage(lang: "es" | "en") {
  i18next.changeLanguage(lang);
  localStorage.setItem(STORAGE_KEY, lang);
}

export type Lang = "es" | "en";
export default i18next;
