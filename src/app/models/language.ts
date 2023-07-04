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
    case 'arabic':
      return 'العربية';
    case 'basque':
      return 'Euskara';
    case 'catalan':
      return 'Català';
    case 'chinese':
      return '中文';
    case 'czech':
      return 'Čeština';
    case 'danish':
      return 'Dansk';
    case 'dutch':
      return 'Nederlands';
    case 'english':
      return 'English';
    case 'finnish':
      return 'Suomi';
    case 'french':
      return 'Français';
    case 'galician':
      return 'Galego';
    case 'german':
      return 'Deutsch';
    case 'greek':
      return 'Ελληνικά';
    case 'hindi':
      return 'हिन्दी';
    case 'hungarian':
      return 'Magyar';
    case 'indonesian':
      return 'Bahasa Indonesia';
    case 'italian':
      return 'Italiano';
    case 'japanese':
      return '日本語';
    case 'korean':
      return '한국어';
    case 'norwegian':
      return 'Norsk';
    case 'polish':
      return 'Polski';
    case 'portuguese':
      return 'Português';
    case 'romanian':
      return 'Română';
    case 'russian':
      return 'Русский';
    case 'slovak':
      return 'Slovenčina';
    case 'spanish':
      return 'Español';
    case 'swedish':
      return 'Svenska';
    case 'turkish':
      return 'Türkçe';
    case 'ukrainian':
      return 'Українська';
    case 'vietnamese':
      return 'Tiếng Việt';
    default:
      return lang ?? '';
  }
}
