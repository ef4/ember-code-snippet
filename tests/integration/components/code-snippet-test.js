import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | code-snippet', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders snippet', async function(assert) {
    await render(hbs`
      // BEGIN-SNIPPET render-test
      function sample(){
        return 42;
      };
      // END-SNIPPET
      
      {{code-snippet id="snippet" name="render-test.js"}}
    `);



    assert.dom('pre#snippet').exists();
    assert.dom('pre#snippet').hasText(
      'function sample(){\n  return 42;\n};'
    );
  });
});
