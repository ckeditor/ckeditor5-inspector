CKEditor 5 inspector
=====================================

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
