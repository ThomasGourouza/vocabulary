export enum Language {
  french = 'fr',
  english = 'en',
  russian = 'ru',
  danish = 'da',
  japanese = 'jp',
  portuguese = 'br',
  italian = 'it',
  german = 'de',
  spanish = 'es'
}

export function translate(lang?: string): string {
  switch (lang) {
    case 'french':
      return 'Français';
    case 'english':
      return 'English';
    case 'russian':
      return 'Русский';
    case 'danish':
      return 'Dansk';
    case 'japanese':
      return '日本';
    case 'portuguese':
      return 'Portugês';
    case 'italian':
      return 'Italiano';
    case 'german':
      return 'Deutsch';
    case 'spanish':
      return 'Español';
    default:
      return lang ?? '';
  }
}
