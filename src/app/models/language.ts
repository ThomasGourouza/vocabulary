export enum Language {
  danish = 'da-DK',
  english = 'en-GB',
  french = 'fr-FR',
  german = 'de-DE',
  italian = 'it-IT',
  japanese = 'ja-JP',
  portuguese = 'pt-BR',
  russian = 'ru-RU',
  spanish = 'es-ES'
}

export function translate(lang?: string): string {
  switch (lang) {
    case 'danish':
      return 'Dansk';
    case 'english':
      return 'English';
    case 'french':
      return 'Français';
    case 'german':
      return 'Deutsch';
    case 'italian':
      return 'Italiano';
    case 'japanese':
      return '日本語';
    case 'portuguese':
      return 'Português';
    case 'russian':
      return 'Русский';
    case 'spanish':
      return 'Español';
    default:
      return lang ?? '';
  }
}
