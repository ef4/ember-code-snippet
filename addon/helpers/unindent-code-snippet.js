import { helper } from '@ember/component/helper';
import unindent from '../-private/unindent';

export default helper(function([source]) {
  return unindent(source);
});
