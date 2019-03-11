Changelog
=========

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
