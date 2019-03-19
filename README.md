CKEditor 5 inspector
=====================================

[![Join the chat at https://gitter.im/ckeditor/ckeditor5](https://badges.gitter.im/ckeditor/ckeditor5.svg)](https://gitter.im/ckeditor/ckeditor5?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![npm version](https://badge.fury.io/js/%40ckeditor%2Fckeditor5-inspector.svg)](https://www.npmjs.com/package/@ckeditor/ckeditor5-inspector)
[![Build Status](https://travis-ci.org/ckeditor/ckeditor5-inspector.svg?branch=master)](https://travis-ci.org/ckeditor/ckeditor5-inspector)
[![BrowserStack Status](https://automate.browserstack.com/automate/badge.svg?badge_key=d3hvenZqQVZERFQ5d09FWXdyT0ozVXhLaVltRFRjTTUyZGpvQWNmWVhUUT0tLUZqNlJ1YWRUd0RvdEVOaEptM1B2Q0E9PQ==--c9d3dee40b9b4471ff3fb516d9ecf8d09292c7e0)](https://automate.browserstack.com/public-build/d3hvenZqQVZERFQ5d09FWXdyT0ozVXhLaVltRFRjTTUyZGpvQWNmWVhUUT0tLUZqNlJ1YWRUd0RvdEVOaEptM1B2Q0E9PQ==--c9d3dee40b9b4471ff3fb516d9ecf8d09292c7e0)
[![Coverage Status](https://coveralls.io/repos/github/ckeditor/ckeditor5-inspector/badge.svg?branch=master)](https://coveralls.io/github/ckeditor/ckeditor5-inspector?branch=master)
<br>
[![Dependency Status](https://david-dm.org/ckeditor/ckeditor5-inspector/status.svg)](https://david-dm.org/ckeditor/ckeditor5-inspector)
[![devDependency Status](https://david-dm.org/ckeditor/ckeditor5-inspector/dev-status.svg)](https://david-dm.org/ckeditor/ckeditor5-inspector?type=dev)

The official [CKEditor 5](https://ckeditor.com/ckeditor-5) rich text editor instance inspector for developers.

![The inspector panel attached to the editor instance.](/sample/screenshot.png)

## Usage

Include the script to load the inspector:

```html
<script src="path/to/inspector.js"></script>
```

Call `CKEditorInspector.attach( name, editor )` when editor instance is ready:

```js
ClassicEditor
    .create( ... )
    .then( editor => {
        CKEditorInspector.attach( 'editor-name', editor );
    } )
    .catch( error => {
        console.error( error );
    } );
```

**Note**: You can attach multiple editors to the inspector. Select the editor instance in the drop–down inside the inspector panel to switch context.

Call `CKEditorInspector.detach( name )` to detach an instance from the inspector.

## Compatibility

The inspector works with CKEditor 5 [v12.0.0](https://github.com/ckeditor/ckeditor5/releases/tag/v12.0.0)+.

## Development

To configure the environment:

```console
git clone git@github.com:ckeditor/ckeditor5-inspector.git
cd ckeditor5-inspector
yarn install
```

### Working with the code

Start the webpack file watcher:

```console
yarn dev
```

and open `http://path/to/ckeditor5-inspector/sample` in your web browser.

### Building

To build the production version of the inspector, run:

```console
yarn build
```

### Testing

To run tests, execute:

```console
yarn test
```

## Releasing

The release process is as follows (order matters):

**Note:** We recommend using `npm` for that.

```console
npm run changelog
npm run build
```

Run the sample and make sure global `CKEDITOR_INSPECTOR_VERSION` is right. Then:

```console
npm run release
```

## License

Licensed under the terms of [GNU General Public License Version 2 or later](http://www.gnu.org/licenses/gpl.html). For full details about the license, please check the `LICENSE.md` file.
