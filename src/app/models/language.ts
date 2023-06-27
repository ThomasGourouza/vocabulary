export enum Language {
  french = 'fr',
  english = 'en',
  russian = 'ru',
  danish = 'da',
  japanese = 'jp',
  portuguese = 'br'
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
    case 'portugues':
      return 'Portugês';
    default:
      return lang ?? '';
  }
}
