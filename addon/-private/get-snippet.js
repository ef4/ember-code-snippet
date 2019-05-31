import snippets from 'ember-code-snippet/snippets';
import getLanguage from './language';
import getExtension from './extension';
import { assert } from '@ember/debug';

export default function getSnippet(name) {
  let source = name
    .split('/')
    .reduce((dir, name) => dir && dir[name], snippets);
  assert(`Code snippet with name "${name}" not found.`, source);

  source = source
    .replace(/^(\s*\n)*/, '')
    .replace(/\s*$/, '');

  let language = getLanguage(name);
  let extension = getExtension(name);

  return {
    source,
    language,
    extension
  };
}