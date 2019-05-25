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

  test('it supports dynamic properties [js]', async function(assert) {
    this.set('value', 42);
    await render(hbs`
      // BEGIN-SNIPPET dynamic-js-test
      function sample(){
        return {{value}};
      };
      // END-SNIPPET
      
      {{code-snippet id="snippet" name="dynamic-js-test.js" dynamicProperties=(hash value=value)}}
    `);

    assert.dom('pre#snippet').hasText(
      'function sample(){\n  return 42;\n};'
    );

    this.set('value', "foo");
    assert.dom('pre#snippet').hasText(
      'function sample(){\n  return \'foo\';\n};'
    );

    this.set('value', true);
    assert.dom('pre#snippet').hasText(
      'function sample(){\n  return true;\n};'
    );
  });

  test('it supports dynamic properties [hbs]', async function(assert) {
    this.set('value', 42);
    await render(hbs`
      // BEGIN-SNIPPET dynamic-hbs-test
      {{input value=value}}
      Value: {{value}}
      // END-SNIPPET
      
      {{code-snippet id="snippet" name="dynamic-hbs-test.js" language="htmlbars" dynamicProperties=(hash value=value)}}
    `);

    assert.dom('pre#snippet').hasText(
      '{{input value=42}}\nValue: 42'
    );

    this.set('value', "foo");
    assert.dom('pre#snippet').hasText(
      '{{input value="foo"}}\nValue: foo'
    );

    this.set('value', true);
    assert.dom('pre#snippet').hasText(
      '{{input value=true}}\nValue: true'
    );
  });

  test('it supports dynamic properties [hbs, angle-brackets]', async function(assert) {
    this.owner.register('template:components/foo', hbs`{{yield}}`);
    this.set('value', 42);
    await render(hbs`
      // BEGIN-SNIPPET dynamic-hbs-angle-test
      <Foo
        @value={{value}}
      />
      Value: {{value}}
      // END-SNIPPET
      
      {{code-snippet id="snippet" name="dynamic-hbs-angle-test.js" language="htmlbars" dynamicProperties=(hash value=value)}}
    `);

    assert.dom('pre#snippet').hasText(
      '<Foo @value={{42}} />\nValue: 42'
    );

    this.set('value', "foo");
    assert.dom('pre#snippet').hasText(
      '<Foo @value="foo" />\nValue: foo'
    );

    this.set('value', true);
    assert.dom('pre#snippet').hasText(
      '<Foo @value={{true}} />\nValue: true'
    );
  });
});
