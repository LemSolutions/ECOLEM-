/**
 * Servizio di traduzione automatica
 * Supporta traduzione tramite API esterne con fallback multipli
 */

export type SupportedLanguage = 'it' | 'en' | 'es' | 'fr' | 'pt' | 'cn' | 'rs';

const languageCodes: Record<SupportedLanguage, string> = {
  it: 'it',
  en: 'en',
  es: 'es',
  fr: 'fr',
  pt: 'pt',
  cn: 'zh',
  rs: 'ru',
};

// Funzione per normalizzare gli spazi nel testo prima della traduzione
function normalizeTextForTranslation(text: string): string {
  if (!text) return text;
  // Assicura che ci siano spazi tra lettere e numeri
  text = text.replace(/([a-zA-ZÀ-ÿ])(\d)/g, '$1 $2');
  text = text.replace(/(\d)([a-zA-ZÀ-ÿ])/g, '$1 $2');
  // Normalizza spazi multipli
  text = text.replace(/\s+/g, ' ');
  return text.trim();
}

/**
 * Traduce usando Google Translate pubblico (senza API key)
 */
async function translateWithGoogle(
  text: string,
  targetLang: SupportedLanguage,
  sourceLang: SupportedLanguage
): Promise<string | null> {
  try {
    // Usa l'API pubblica di Google Translate
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${languageCodes[sourceLang]}&tl=${languageCodes[targetLang]}&dt=t&q=${encodeURIComponent(text)}`;
    
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      if (data && data[0] && Array.isArray(data[0])) {
        const translated = data[0]
          .map((item: any[]) => item[0])
          .filter(Boolean)
          .join('');
        return translated || null;
      }
    }
  } catch (error) {
    console.warn('Errore traduzione Google Translate:', error);
  }
  return null;
}

/**
 * Traduce usando LibreTranslate
 */
async function translateWithLibreTranslate(
  text: string,
  targetLang: SupportedLanguage,
  sourceLang: SupportedLanguage
): Promise<string | null> {
  try {
    const response = await fetch('https://libretranslate.de/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: languageCodes[sourceLang],
        target: languageCodes[targetLang],
        format: 'text',
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.translatedText) {
        return data.translatedText;
      }
    }
  } catch (error) {
    console.warn('Errore traduzione LibreTranslate:', error);
  }
  return null;
}

/**
 * Traduce un testo usando servizi multipli con fallback
 * Prova prima Google Translate, poi LibreTranslate
 */
export async function translateText(
  text: string,
  targetLang: SupportedLanguage,
  sourceLang: SupportedLanguage = 'it'
): Promise<string> {
  if (targetLang === sourceLang || !text) {
    return normalizeTextForTranslation(text);
  }

  // Normalizza il testo prima della traduzione
  const normalizedText = normalizeTextForTranslation(text);
  
  if (!normalizedText) {
    return text;
  }

  // Prova prima con Google Translate (più affidabile)
  let translated = await translateWithGoogle(normalizedText, targetLang, sourceLang);
  
  // Se Google Translate fallisce, prova con LibreTranslate
  if (!translated) {
    translated = await translateWithLibreTranslate(normalizedText, targetLang, sourceLang);
  }

  // Se entrambi falliscono, restituisci il testo originale normalizzato
  if (!translated) {
    console.warn(`Impossibile tradurre il testo: "${normalizedText}" da ${sourceLang} a ${targetLang}`);
    return normalizedText;
  }

  // Normalizza anche il testo tradotto
  return normalizeTextForTranslation(translated);
}

/**
 * Traduce un array di testi
 */
export async function translateTexts(
  texts: string[],
  targetLang: SupportedLanguage,
  sourceLang: SupportedLanguage = 'it'
): Promise<string[]> {
  if (targetLang === sourceLang) {
    return texts;
  }

  // Traduci tutti i testi in parallelo
  const translations = await Promise.all(
    texts.map(text => translateText(text, targetLang, sourceLang))
  );

  return translations;
}

/**
 * Traduce un oggetto con campi di testo
 */
export async function translateObject<T extends Record<string, string | null | undefined>>(
  obj: T,
  fields: (keyof T)[],
  targetLang: SupportedLanguage,
  sourceLang: SupportedLanguage = 'it'
): Promise<T> {
  if (targetLang === sourceLang) {
    return obj;
  }

  const translated = { ...obj };
  
  for (const field of fields) {
    const value = obj[field];
    if (value && typeof value === 'string') {
      translated[field] = await translateText(value, targetLang, sourceLang) as T[keyof T];
    }
  }

  return translated;
}
