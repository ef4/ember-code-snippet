import { helper } from '@ember/component/helper';
import getSnippet from '../-private/get-snippet';

export default helper(function([name]) {
  return getSnippet(name);
});
