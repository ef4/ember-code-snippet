import getExtension from './extension';

export default function getLanguage(name) {
  let ext = getExtension(name);
  if (ext) {
    switch (ext) {
      case 'js':
        return 'javascript';
      case 'coffee':
        return 'coffeescript';
      case 'hbs':
        return 'handlebars';
      case 'css':
        return 'css';
      case 'scss':
        return 'scss';
      case 'less':
        return 'less';
      case 'emblem':
        return 'emblem';
      case 'ts':
        return 'typescript';
      default:
        return ext;
    }
  }
}
