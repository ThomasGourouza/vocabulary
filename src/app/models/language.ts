export enum Language {
  french = 'fr-FR',
  italian = 'it-IT',
  spanish = 'es-ES',
  portuguese = 'pt-BR',
  english = 'en-GB',
  german = 'de-DE',
  danish = 'da-DK',
  russian = 'ru-RU',
  japanese = 'ja-JP'
}

export function translate(lang?: string): string {
  switch (lang?.toLowerCase()) {
    case 'french':
      return 'Français';
    case 'italian':
      return 'Italiano';
    case 'spanish':
      return 'Español';
    case 'portuguese':
      return 'Português';
    case 'english':
      return 'English';
    case 'german':
      return 'Deutsch';
    case 'danish':
      return 'Dansk';
    case 'russian':
      return 'Русский';
    case 'japanese':
      return '日本語';
    default:
      return lang ?? '';
  }
}
