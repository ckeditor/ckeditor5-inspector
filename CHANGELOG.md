Changelog
=========

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
