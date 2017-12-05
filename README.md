Code Snippet Ember Component
============================

This is an Ember component (and ember-cli addon) that lets you render
code snippets within your app. The code snippets can live in their own
dedicated files or you can extract blocks of code from your
application itself.

- Syntax highlighting thanks to [highlight.js](http://highlightjs.org/). To see how it looks, [view the highlightjs previews](https://highlightjs.org/).
- ember-cli's auto-reload will pick up changes to any of the snippet files.
- the component uses file extensions to help highlight.js guess the
  right language. See below for details on choosing the supported languages.

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
application or addon, and place the code snippets you'd like to render in their
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

You can also define your own regex to find snippets. Just use the `snippetRegexes` option:

```js
var app = new EmberAddon({
 snippetRegexes: {
   begin: /{{#element-example\sname=\"(\S+)\"/,
   end: /{{\/element-example}}/,
 }
});
```

In the regex above everything in the `element-example` component block will be a snippet! Just make sure the first regex capture group is the name of the snippet.

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

# Syntax Highlighting Language Support

We depend on [highlight.js](http://highlightjs.org/) for syntax highlighting. It supports 176 languages. But you probably don't want to build all of those into your app.

Out of the box, we only enable:

 - css
 - coffeescript
 - html/xml
 - json
 - javascript
 - markdown
 - handlebars
 - htmlbars
 
If you want a different set, you can:

1. Tell ember-code-snippet not to include highlight.js automatically for you:

```js
  // in ember-cli-build.js
  var app = new EmberApp(defaults, {
    includeHighlightJS: false
  });
```

2. Go to https://highlightjs.org/download/ and generate your own build of highlight.js using the languages you want.

3. Place the resulting highlight.pack.js in your `vendor` directory.

4. Import it directly from your ember-cli-build.js file:

```js
app.import('vendor/highlight.pack.js', { 
  using: [ { transformation: 'amd', as: 'highlight.js' } ]
});
```

# Line Numbering Support

Line numbering support is provided by a highlight addon [code-highlight-linenums](https://github.com/OverZealous/code-highlight-linenums). To enable call with `lineNumbers=true`.

```hbs
{{code-snippet name="my-nice-example.js" lineNumbers=true}}
```

For not including the code-highlight-linenums library, specify on the config like this:

```js
  // in ember-cli-build.js
  var app = new EmberApp(defaults, {
    includeCodeHighlightLinenums: false
  });
```

# Theming Support

We include a basic syntax-highlighting theme by default, but highlight.js has 79 different themes to choose from and it's possible to make your own just by writing a stylesheet.

To use a different theme:

1. Tell ember-code-snippet not to include its own theme:

```js
  // in ember-cli-build.js
  var app = new EmberApp(defaults, {
    includeHighlightStyle: false
  });
```

2. Place your chosen style in `vendor`.

3. Import it directly from your ember-cli-build.js:

```js
app.import('vendor/my-highlight-style.css');
```
