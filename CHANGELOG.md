Changelog
=========

## [4.1.0](https://github.com/ckeditor/ckeditor5-inspector/compare/v4.0.0...v4.1.0) (2022-05-26)

### Features

* Introduced the schema tab. Closes [#41](https://github.com/ckeditor/ckeditor5-inspector/issues/41). ([commit](https://github.com/ckeditor/ckeditor5-inspector/commit/4d82ee7eeacb8af9a9a3bfb732806a11de92c557))


## [4.0.0](https://github.com/ckeditor/ckeditor5-inspector/compare/v3.1.1...v4.0.0) (2022-04-12)

### BREAKING CHANGES

* Due to introducing the lock mechanism for the `Editor#isReadOnly` property, the inspector uses the new way of enabling the read-only mode in the editor. It requires an instance of CKEditor 5 in version 34 or higher. See [ckeditor/ckeditor5#10496](https://github.com/ckeditor/ckeditor5/issues/10496).

### Other changes

* Aligned the CKEditor 5 Inspector API to use the new lock mechanism when enabling/disabling the read-only mode. ([commit](https://github.com/ckeditor/ckeditor5-inspector/commit/55d72a3a8f708554d22341ce26a31f4448c39fc5))


## [3.1.1](https://github.com/ckeditor/ckeditor5-inspector/compare/v3.1.0...v3.1.1) (2022-03-29)

### Bug fixes

* Improved rendering of GHS attributes in the inspector. Closes [#129](https://github.com/ckeditor/ckeditor5-inspector/issues/129). ([commit](https://github.com/ckeditor/ckeditor5-inspector/commit/5874d2a971628b69000120519a82ba3dccb7651f))


## [3.1.0](https://github.com/ckeditor/ckeditor5-inspector/compare/v3.0.0...v3.1.0) (2022-02-17)

### Features

* Made it possible to set editor data using the UI. Closes [#138](https://github.com/ckeditor/ckeditor5-inspector/issues/138). ([commit](https://github.com/ckeditor/ckeditor5-inspector/commit/b5ea7c52a37477f11f4624499d1054604f0d95d8))


## [3.0.0](https://github.com/ckeditor/ckeditor5-inspector/compare/v2.3.0...v3.0.0) (2022-02-03)

### BREAKING CHANGES

* Upgraded the minimal versions of Node.js to `14.0.0` due to the end of LTS.

### Features

* Implemented the mini inspector (`MiniCKEditorInspector`) in a separate build. Closes [#143](https://github.com/ckeditor/ckeditor5-inspector/issues/143). ([commit](https://github.com/ckeditor/ckeditor5-inspector/commit/d81e841b8fa1096640e1efe402a5fb98820959c1))
* The "Log editor data" button should copy to the clipboard if clicked with the Shift key. Closes [#136](https://github.com/ckeditor/ckeditor5-inspector/issues/136). ([commit](https://github.com/ckeditor/ckeditor5-inspector/commit/1252b78e7d82944dd7828ca177c09af8878a48a2))

### Other changes

* Updated the required version of Node.js to 14. See [ckeditor/ckeditor5#10972](https://github.com/ckeditor/ckeditor5/issues/10972). ([commit](https://github.com/ckeditor/ckeditor5-inspector/commit/bb65d8830bc59c6474a4efcd2f404304cd586386))


## [2.3.0](https://github.com/ckeditor/ckeditor5-inspector/compare/v2.2.2...v2.3.0) (2021-11-30)

### Features

* Introduced editor quick actions toolbar (see [#38](https://github.com/ckeditor/ckeditor5-inspector/issues/38)) to log editor data, toggle editor read-only, and destroy editor. Closes [#121](https://github.com/ckeditor/ckeditor5-inspector/issues/121), [#104](https://github.com/ckeditor/ckeditor5-inspector/issues/104). ([commit](https://github.com/ckeditor/ckeditor5-inspector/commit/9417d9301e56b884a0db1353e091a3070b5175fa))

### Other changes

* Added the `margin-bottom` style to the `<body>` element when the inspector is collapsed to avoid covering the footer. Closes [#126](https://github.com/ckeditor/ckeditor5-inspector/issues/126). ([commit](https://github.com/ckeditor/ckeditor5-inspector/commit/0324c24c8c9a54fe4e9c5ce9cb5f57fc72de61b2))


## [2.2.2](https://github.com/ckeditor/ckeditor5-inspector/compare/v2.2.1...v2.2.2) (2021-01-20)

### Other changes

* Added the `data-cke-inspector=true` attribute to all `<style>` tags injected by the application. Closes [#106](https://github.com/ckeditor/ckeditor5-inspector/issues/106). ([commit](https://github.com/ckeditor/ckeditor5-inspector/commit/ee9cb3f3ce14523a7e5cc472f328b11aafc16b7a))

  Also:
  * Reduced the number of `<style>` tags injected by the application.
  * Used the `.ck-inspector` namespace for CSS custom properties used by the inspector to clean up the developer tools and improve DX.


## [2.2.1](https://github.com/ckeditor/ckeditor5-inspector/compare/v2.2.0...v2.2.1) (2020-11-04)

### Bug fixes

* Node attributes should be sorted in trees and node inspectors (both for the model and the view). Closes [#97](https://github.com/ckeditor/ckeditor5-inspector/issues/97). ([commit](https://github.com/ckeditor/ckeditor5-inspector/commit/d8c109dc4d23ec34f7209cc7d196dcfcb3a821dd))
* The inspector should not throw when attributes are objects with circular references. Closes [#98](https://github.com/ckeditor/ckeditor5-inspector/issues/98). ([commit](https://github.com/ckeditor/ckeditor5-inspector/commit/36bf877d6395af1ec22151b01034eda8e585e135))


## [2.2.0](https://github.com/ckeditor/ckeditor5-inspector/compare/v2.1.0...v2.2.0) (2020-08-05)

### Features

* Brought support for the editor view [`RawElement`](https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_view_rawelement-RawElement.html). Closes [#89](https://github.com/ckeditor/ckeditor5-inspector/issues/89). ([commit](https://github.com/ckeditor/ckeditor5-inspector/commit/f8d4c9f16a2a1a31aea133bf7e9253f3bd2e853c))
* Made it possible to toggle the inspector using the <kbd>Alt</kbd>+<kbd>F12</kbd> keyboard shortcut. Closes [#87](https://github.com/ckeditor/ckeditor5-inspector/issues/87). ([commit](https://github.com/ckeditor/ckeditor5-inspector/commit/8059d72599c8cbbae16b5e831485b10e57a29da9))

### Bug fixes

* Addressed the "react-fast-compare circular refs" warning by switching to Lodash `isEqual()`. Closes [#86](https://github.com/ckeditor/ckeditor5-inspector/issues/86). ([commit](https://github.com/ckeditor/ckeditor5-inspector/commit/a5b4e672df8c0f4261197aa2db1debe2f4f61699))

### Other changes

* The inspector should not update on editor events when the UI is collapsed. Closes [#80](https://github.com/ckeditor/ckeditor5-inspector/issues/80). ([commit](https://github.com/ckeditor/ckeditor5-inspector/commit/03b3ec662ffded9da0c18344261b328248a922d4))


## [2.1.0](https://github.com/ckeditor/ckeditor5-inspector/compare/v2.0.0...v2.1.0) (2020-06-01)

### Features

* Added the "Scroll to selection" buttons in the Model and View tabs. Closes [#77](https://github.com/ckeditor/ckeditor5-inspector/issues/77). ([699eab6](https://github.com/ckeditor/ckeditor5-inspector/commit/699eab6))

### Bug fixes

* Checkboxes in the inspector UI should be centered vertically. Closes [#84](https://github.com/ckeditor/ckeditor5-inspector/issues/84). ([65b8aca](https://github.com/ckeditor/ckeditor5-inspector/commit/65b8aca))
* Improved performance of the inspector by avoiding unnecessary React rendering. Closes [#79](https://github.com/ckeditor/ckeditor5-inspector/issues/79). ([44e7850](https://github.com/ckeditor/ckeditor5-inspector/commit/44e7850))
* User-agent styles of HTML select elements should not be overridden by the inspector. Closes [#65](https://github.com/ckeditor/ckeditor5-inspector/issues/65). ([396af59](https://github.com/ckeditor/ckeditor5-inspector/commit/396af59))


## [2.0.0](https://github.com/ckeditor/ckeditor5-inspector/compare/v1.5.0...v2.0.0) (2020-03-26)

### Features

* Implemented markers preview in the "Model" tree. Implemented the "Markers" tab. Implemented support for multiple model/view ranges both in the trees and "Selection" tabs. Improved selection rendering in trees for smooth UX. Closes [#12](https://github.com/ckeditor/ckeditor5-inspector/issues/12). Closes [#7](https://github.com/ckeditor/ckeditor5-inspector/issues/7). Closes [#68](https://github.com/ckeditor/ckeditor5-inspector/issues/68). Closes [#73](https://github.com/ckeditor/ckeditor5-inspector/issues/73). ([0d58db6](https://github.com/ckeditor/ckeditor5-inspector/commit/0d58db6))


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
