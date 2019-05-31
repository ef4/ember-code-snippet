import { helper } from '@ember/component/helper';
import getSnippet from '../-private/get-snippet';
import unindentSource from '../-private/unindent';

export default helper(function([name], { unindent = true }) {
  let snippet = getSnippet(name);
  return unindent
    ? { ...snippet, source: unindentSource(snippet.source) }
    : snippet;
});
