import { helper } from '@ember/component/helper';
import { getCodeSnippet } from 'ember-code-snippet';

export default helper(function([name], { unindent = true }) {
  return getCodeSnippet(name, unindent);
});
