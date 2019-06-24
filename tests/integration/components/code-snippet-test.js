import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | code-snippet', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders snippet', async function(assert) {
    await render(hbs`
      // BEGIN-SNIPPET render-test1
      function sample(){
        return 42;
      };
      // END-SNIPPET

      {{code-snippet id="snippet-1" name="render-test1.js"}}
    `);

    assert.dom('pre#snippet-1').exists();
    assert.dom('pre#snippet-1').hasText(
      'function sample(){\n  return 42;\n};'
    );
  });

  test('Unindents snippet on Windows with multiple empty lines', async function(assert) {
    await render(hbs`
      {{code-snippet id="snippet-2" name="windows-line-endings.js"}}
    `);

    assert.dom('pre#snippet-2').exists();
    assert.dom('pre#snippet-2').hasText(/^function sample/); // no spacing in front
    assert.dom('pre#snippet-2').hasText(/\{[\r\n]{3}/); // has three new lines after bracket
  });

  test('Unindents snippet on Linux with multiple empty lines', async function(assert) {
    await render(hbs`
      {{code-snippet id="snippet-3" name="linux-line-endings.js"}}
    `);

    assert.dom('pre#snippet-3').exists();
    assert.dom('pre#snippet-3').hasText(/^function sample/) // no spacing in front
    assert.dom('pre#snippet-3').hasText(/\{[\r\n]{3}/); // has three new lines after bracket
  });
});
