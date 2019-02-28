CKEditor 5 inspector
=====================================

[![Join the chat at https://gitter.im/ckeditor/ckeditor5](https://badges.gitter.im/ckeditor/ckeditor5.svg)](https://gitter.im/ckeditor/ckeditor5?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![npm version](https://badge.fury.io/js/%40ckeditor%2Fckeditor5-inspector.svg)](https://badge.fury.io/js/%40ckeditor%2Fckeditor5-inspector)
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

## License

Licensed under the terms of [GNU General Public License Version 2 or later](http://www.gnu.org/licenses/gpl.html). For full details about the license, please check the `LICENSE.md` file.
