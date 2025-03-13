CKEditor 5 inspector
=====================================

[![npm version](https://badge.fury.io/js/%40ckeditor%2Fckeditor5-inspector.svg)](https://www.npmjs.com/package/@ckeditor/ckeditor5-inspector)
[![CircleCI](https://circleci.com/gh/ckeditor/ckeditor5-inspector.svg?style=shield)](https://app.circleci.com/pipelines/github/ckeditor/ckeditor5-inspector?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/ckeditor/ckeditor5-inspector/badge.svg?branch=master)](https://coveralls.io/github/ckeditor/ckeditor5-inspector?branch=master)

The official [CKEditor 5](https://ckeditor.com/ckeditor-5) rich text editor instance inspector for developers.

![The inspector panel attached to the editor instance.](/sample/screenshot.png)

## Documentation 📖

Learn how to use the inspector and see it live in the [Development tools](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/development-tools.html) guide.

## Quick start

Include the script to load the inspector:

```html
<script src="path/to/inspector.js"></script>
```

Call `CKEditorInspector.attach( editor )` when the editor instance is ready:

```js
ClassicEditor
	.create( ... )
	.then( editor => {
		CKEditorInspector.attach( editor );
	} )
	.catch( error => {
		console.error( error );
	} );
```

**Note**: You can attach to multiple editors under unique names at a time. Then you can select the editor instance in the drop–down inside the inspector panel to switch context.

```js
CKEditorInspector.attach( {
	'header-editor': editor1,
	'footer-editor': editor2,
	// ...
} );
```

Call `CKEditorInspector.detach( name )` to detach the inspector from an editor instance.

**Tip**: `CKEditorInspector.attach()` returns the generated name of the editor if it was not provided.

```js
// Attach the inspector to two editor instances:
const generatedName = CKEditorInspector.attach( editor1 );
CKEditorInspector.attach( { arbitraryName: editor2 } );

// ...

// Detach from the instances:
CKEditorInspector.detach( generatedName );
CKEditorInspector.detach( 'arbitraryName' );
```

### Attaching to all editor instances

When multiple CKEditor 5 instances are running in DOM, you can call `CKEditorInspector.attachToAll( [ options ] )` to attach the inspector to all of them at the same time. A shorthand for `CKEditorInspector.attach( editor, [ options ] )` called individually for each instance.

```js
// Discover all editor instances in DOM and inspect them all.
CKEditorInspector.attachToAll();
```

You can also pass the optional [configuration object](#configuration) to this method.

**Note**: This method works with CKEditor v12.3.0 or later. Earlier editor versions will not be discovered.

### Toggling the inspector visibility

Click the button in the upper-right corner of the inspector to quickly show or hide it. You can also use the <kbd>Alt</kbd>+<kbd>F12</kbd> (<kbd>⌥</kbd>+<kbd>F12</kbd> on Mac) keyboard shortcut.

![The button that toggles the inspector visibility.](/sample/toggle.png)

### Configuration

You can pass configuration options to `CKEditorInspector.attach()` and `CKEditorInspector.attachToAll()` methods as the last argument:

```js
CKEditorInspector.attach( editor, {
	// configuration options
} );

CKEditorInspector.attach( { 'editor-name': editor }, {
	// configuration options
} );

CKEditorInspector.attachToAll( {
	// configuration options
} );
```

#### `isCollapsed`

To attach the inspector with a collapsed UI, use the `options.isCollapsed` option.

**Note**: This option works when `CKEditorInspector.attach()` is called for the first time only.

```js
CKEditorInspector.attach( { 'editor-name': editor }, {
	// Attach the inspector to the "editor" but the UI will be collapsed.
	isCollapsed: true
} );
```

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

and open `http://path/to/ckeditor5-inspector/sample/inspector.html` in your web browser.

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

## Releasing the package

CircleCI automates the release process and can release both channels: stable (`X.Y.Z`) and pre-releases (`X.Y.Z-alpha.X`, etc.).

Before you start, you need to prepare the changelog entries.

1. Make sure the `#master` branch is up-to-date: `git fetch && git checkout master && git pull`.
1. Prepare a release branch: `git checkout -b release-[YYYYMMDD]` where `YYYYMMDD` is the current day.
1. Generate the changelog entries: `yarn run changelog --branch release-[YYYYMMDD] [--from [GIT_TAG]]`.
	* By default, the changelog generator uses the latest published tag as a starting point for collecting commits to process.

	  The `--from` modifier option allows overriding the default behavior. It is required when preparing the changelog entries for the next stable release while the previous one was marked as a prerelease, e.g., `@alpha`.

	  **Example**: Let's assume that the `v5.0.0-alpha.0` tag is our latest and that we want to release it on a stable channel. The `--from` modifier should be equal to `--from v4.0.0`.
	* This task checks what changed in each package and bumps the version accordingly. It won't create a new changelog entry if nothing changes at all. If changes were irrelevant (e.g., only dependencies), it would make an "_internal changes_" entry.
	* Scan the logs printed by the tool to search for errors (incorrect changelog entries). Incorrect entries (e.g., ones without the type) should be addressed. You may need to create entries for them manually. This is done directly in CHANGELOG.md (in the root directory). Make sure to verify the proposed version after you modify the changelog.
1. Commit all changes and prepare a new pull request targeting the `#master` branch.
1. Ping the `@ckeditor/ckeditor-5-devops` team to review the pull request and trigger the release process.

## License

Licensed under a dual-license model, this software is available under:

* the [GNU General Public License Version 2 or later](http://www.gnu.org/licenses/gpl.html),
* or commercial license terms from CKSource Holding sp. z o.o.

For more information, see: [https://ckeditor.com/legal/ckeditor-licensing-options](https://ckeditor.com/legal/ckeditor-licensing-options).
