export enum Language {
  arabic = 'ar',
  basque = 'eu',
  catalan = 'ca',
  chinese = 'zh-CN',
  czech = 'cs',
  danish = 'da',
  dutch = 'nl',
  english = 'en-GB',
  finnish = 'fi',
  french = 'fr',
  galician = 'gl',
  german = 'de',
  greek = 'el',
  hindi = 'hi',
  hungarian = 'hu',
  indonesian = 'id',
  italian = 'it',
  japanese = 'ja',
  korean = 'ko',
  norwegian = 'no',
  polish = 'pl',
  portuguese = 'pt-BR',
  romanian = 'ro',
  russian = 'ru',
  slovak = 'sk',
  spanish = 'es-ES',
  swedish = 'sv',
  turkish = 'tr',
  ukrainian = 'uk',
  vietnamese = 'vi'
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
