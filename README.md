Code Snippet Ember Component
============================

This is an Ember component (and ember-cli addon) that lets you render
code snippets within your app. The code snippets can live in their own
dedicated files or you can extract blocks of code from your
application itself.

- Syntax highlighting thanks to [highlight.js](http://highlightjs.org/). To see how it looks, [view the highlightjs previews](https://highlightjs.org/).
- ember-cli's auto-reload will pick up changes to any of the snippet files.
- the component uses file extensions to help highlight.js guess the
  right language.

Install
-------

``` sh
ember install ember-code-snippet
```

Usage
-----

There are two ways to store your code snippets. You can use either or
both together.

### With separate snippet files

Create a new "snippets" directory at the top level of your ember-cli
application, and place the code snippets you'd like to render in their
own files inside it. They will be identified by filename. So if you
create the file `snippets/sample-template.hbs`, you can embed it in a
template with:

```hbs
{{code-snippet name="sample-template.hbs"}}
```

You can choose to load snippet files from different paths by passing
an option to `new EmberApp` in your `ember-cli-build.js`:

```js
var app = new EmberApp({
  snippetPaths: ['snippets']
});
```

If you want to use snippets located in an addon's dummy application,
add the dummy app path to `snippetPaths`:

```js
var app = new EmberAddon({
  snippetPaths: ['tests/dummy/app']
});
```

### From within your application source

In any file under your `app` tree, annotate the start and end of a
code snippet block by placing comments like this:

```js
// BEGIN-SNIPPET my-nice-example
function sample(){
  return 42;
};
// END-SNIPPET
```

The above is a Javascript example, but you can use any language's
comment format. We're just looking for lines that match
`/\bBEGIN-SNIPPET\s+(\S+)\b/` and `/\bEND-SNIPPET\b/`.

The opening comment must include a name. The component will identify
these snippets using the names you specified plus the file extension
of the file in which they appeared (which helps us detect languages
for better highlighting). So the above example could be included in a
template like this:

```hbs
{{code-snippet name="my-nice-example.js"}}
```

By default, the component will try to unindent the code block by
removing whitespace characters from the start of each line until the
code bumps up against the edge. You can disable this with:

```hbs
{{code-snippet name="my-nice-example.js" unindent=false}}
```


You can choose which paths will be searched for inline snippets by
settings the snippetSearchPaths option when creating your application
in ember-cli-build.js:

```js
var app = new EmberApp({
  snippetSearchPaths: ['app', 'other']
});
```
