Changelog
=========

## [1.5.0](https://github.com/ckeditor/ckeditor5-inspector/compare/v1.4.0...v1.5.0) (2019-12-05)

### Features

* Allowed inspecting model attribute properties. Closes [#40](https://github.com/ckeditor/ckeditor5-inspector/issues/40). ([448ae71](https://github.com/ckeditor/ckeditor5-inspector/commit/448ae71))

### Bug fixes

* The inspector should render the RTL content in the trees properly. Closes [#64](https://github.com/ckeditor/ckeditor5-inspector/issues/64). ([40c3102](https://github.com/ckeditor/ckeditor5-inspector/commit/40c3102))


## [1.4.0](https://github.com/ckeditor/ckeditor5-inspector/compare/v1.3.0...v1.4.0) (2019-09-23)

### Features

* Allowed attaching the inspector collapsed using a configuration passed to `CKEditorInspector#attach()`. Implemented the `CKEditorInspector#destroy()` method. Unified `CKEditorInspector#attach()` arguments syntax and allowed attaching to multiple editor instances at a time. Closes [#44](https://github.com/ckeditor/ckeditor5-inspector/issues/44). Closes [#42](https://github.com/ckeditor/ckeditor5-inspector/issues/42). Closes [#48](https://github.com/ckeditor/ckeditor5-inspector/issues/48). ([69ad014](https://github.com/ckeditor/ckeditor5-inspector/commit/69ad014))
* Implemented the `CKEditorInspector#attachToAll()` method. Closes [#56](https://github.com/ckeditor/ckeditor5-inspector/issues/56). ([8a3c7ea](https://github.com/ckeditor/ckeditor5-inspector/commit/8a3c7ea))
* Introduced the `.ck-inspector-body-collapsed` class on `<body>` (next to `.ck-inspector-body-expanded`) to clearly distinguish expanded and collapsed inspector states. ([664b9cd](https://github.com/ckeditor/ckeditor5-inspector/commit/664b9cd))

  Thanks to [@skurfuerst](https://github.com/skurfuerst)!

### Bug fixes

* `EditableElement` should be recognized in the View node inspector. Closes [#49](https://github.com/ckeditor/ckeditor5-inspector/issues/49). ([729a922](https://github.com/ckeditor/ckeditor5-inspector/commit/729a922))

### BREAKING CHANGES

* The `CKEditorInspector.attach( 'editor-name', editor );` syntax was deprecated and replaced by an object literal `CKEditorInspector.attach( { 'editor-name': editor, ... } );`.

  **Note**: The old syntax works (backward compatibility) but it produces a warning in the console and will be removed in the future. We highly recommend using the new `attach()` method syntax ([learn more](https://github.com/ckeditor/ckeditor5-inspector/blob/master/README.md#quick-start)).


## [1.3.0](https://github.com/ckeditor/ckeditor5-inspector/compare/v1.2.0...v1.3.0) (2019-03-20)

### Features

* Added a comment to each UIElement in the view tree to make it more distinguishable. Closes [#13](https://github.com/ckeditor/ckeditor5-inspector/issues/13). ([aef8995](https://github.com/ckeditor/ckeditor5-inspector/commit/aef8995))
* Added Custom Properties lists to the editor view node inspector. Closes [#16](https://github.com/ckeditor/ckeditor5-inspector/issues/16). ([b44708f](https://github.com/ckeditor/ckeditor5-inspector/commit/b44708f))

### Bug fixes

* Long values should be truncated in the `Tree` and `PropertyList` to avoid performance issues. Closes [#31](https://github.com/ckeditor/ckeditor5-inspector/issues/31). ([16fa0e4](https://github.com/ckeditor/ckeditor5-inspector/commit/16fa0e4))
* The inspector should not scale beyond the height of the visible viewport. Closes [#34](https://github.com/ckeditor/ckeditor5-inspector/issues/34). ([86c287b](https://github.com/ckeditor/ckeditor5-inspector/commit/86c287b))


## [1.2.0](https://github.com/ckeditor/ckeditor5-inspector/compare/v1.1.0...v1.2.0) (2019-03-11)

### Features

* Implemented vertical inspector resizing. Closes [#4](https://github.com/ckeditor/ckeditor5-inspector/issues/4). ([97d56aa](https://github.com/ckeditor/ckeditor5-inspector/commit/97d56aa))


## [1.1.0](https://github.com/ckeditor/ckeditor5-inspector/compare/v1.0.0...v1.1.0) (2019-03-06)

### Features

* Allowed using the editor instance as the only argument of `CKEditorInspector.attach()`. Closes [#11](https://github.com/ckeditor/ckeditor5-inspector/issues/11). ([63ff58e](https://github.com/ckeditor/ckeditor5-inspector/commit/63ff58e))

### Bug fixes

* Command value should be displayed properly in the list when defined as an object. Related to [#9](https://github.com/ckeditor/ckeditor5-inspector/issues/9). ([3d36cfa](https://github.com/ckeditor/ckeditor5-inspector/commit/3d36cfa))
* The command inspector should not crash when command's value is `undefined`. ([10821a3](https://github.com/ckeditor/ckeditor5-inspector/commit/10821a3))
* The inspector should not crash when an attribute value is an object. Closes [#10](https://github.com/ckeditor/ckeditor5-inspector/issues/10). ([681f2e2](https://github.com/ckeditor/ckeditor5-inspector/commit/681f2e2))
* The view tree inspector should display all attributes of all elements. Closes [#9](https://github.com/ckeditor/ckeditor5-inspector/issues/9). ([705f3c4](https://github.com/ckeditor/ckeditor5-inspector/commit/705f3c4))
* View EmptyElement should not render with a closing tag. Added support for missing Empty and UI elements in the inspector and the tree. Closes [#5](https://github.com/ckeditor/ckeditor5-inspector/issues/5). ([e648ab4](https://github.com/ckeditor/ckeditor5-inspector/commit/e648ab4))

### Other changes

* Code refactoring. Minor improvements in rendering attributes and properties. ([ad65184](https://github.com/ckeditor/ckeditor5-inspector/commit/ad65184))


## [1.0.0](https://github.com/ckeditor/ckeditor5-inspector/tree/v1.0.0) (2019-02-28)

Initial release.
