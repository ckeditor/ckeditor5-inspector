Changelog
=========

## Unreleased

### Bug fixes

* Fixed the `container` option of `CKEditorInspector.attach()` to actually work in multi-window / multi-document environments (Electron, WebView2, iframes). Previously, even when a container in a different document was passed, the inspector's UI still read and wrote the module-realm `document` and `window` (event listeners, `body` class toggles, viewport sizing, `Modal` app element, `scrollIntoView` targets), so it appeared broken in the host document. See [ckeditor/ckeditor5-inspector#39](https://github.com/ckeditor/ckeditor5-inspector/issues/39), [ckeditor/ckeditor5-inspector#100](https://github.com/ckeditor/ckeditor5-inspector/issues/100).

  The inspector now derives the host `document` / `window` from `container.ownerDocument` and exposes them via a React `HostContext` consumed by every component that touches the DOM. Inspector-related `<style>` tags are also cloned into the host document's `<head>` so its CSS is available there.

  Thanks to [Marco Cimmino (@marco-ms)](https://github.com/marco-ms).


## [5.0.2](https://github.com/ckeditor/ckeditor5-inspector/compare/v5.0.1...v5.0.2) (June 10, 2026)

### Other changes

* Readme simplification.


## [5.0.1](https://github.com/ckeditor/ckeditor5-inspector/compare/v5.0.0...v5.0.1) (May 27, 2026)

### Bug fixes

* Fixed a bug where only the first quote character were converted during stringification. See [ckeditor/ckeditor5-inspector#190](https://github.com/ckeditor/ckeditor5-inspector/issues/190).
* Added a `container` option to `CKEditorInspector.attach()` allowing the inspector to be mounted into a custom DOM element instead of `document.body`. See [ckeditor/ckeditor5-inspector#39](https://github.com/ckeditor/ckeditor5-inspector/issues/39), [ckeditor/ckeditor5-inspector#100](https://github.com/ckeditor/ckeditor5-inspector/issues/100).

  Useful in multi-window environments (Electron, WebView2, iframes) where the global `document` is not the document where the editor lives.
  The wrapper element is created in `container.ownerDocument` so ReactDOM event delegation works in the target document.

  Thanks to [@marco-ms](https://github.com/marco-ms).

### Other changes

* Upgrade to Node v24.11.


## [5.0.0](https://github.com/ckeditor/ckeditor5-inspector/compare/v4.1.0...v5.0.0) (July 9, 2025)

### BREAKING CHANGES

* Due to changes in type definitions and package structure in CKEditor 5 v46.0.0, the inspector now requires this version or newer. Earlier versions are no longer compatible. See [ckeditor/ckeditor5#18583](https://github.com/ckeditor/ckeditor5/issues/18583).


## [4.1.0](https://github.com/ckeditor/ckeditor5-inspector/compare/v4.0.0...v4.1.0) (2022-05-26)

### Features

* Introduced the schema tab. Closes [#41](https://github.com/ckeditor/ckeditor5-inspector/issues/41). ([commit](https://github.com/ckeditor/ckeditor5-inspector/commit/4d82ee7eeacb8af9a9a3bfb732806a11de92c557))


## [4.0.0](https://github.com/ckeditor/ckeditor5-inspector/compare/v3.1.1...v4.0.0) (2022-04-12)

### BREAKING CHANGES

* Due to introducing the lock mechanism for the `Editor#isReadOnly` property, the inspector uses the new way of enabling the read-only mode in the editor. It requires an instance of CKEditor 5 in version 34 or higher. See [ckeditor/ckeditor5#10496](https://github.com/ckeditor/ckeditor5/issues/10496).

### Other changes

* Aligned the CKEditor 5 Inspector API to use the new lock mechanism when enabling/disabling the read-only mode. ([commit](https://github.com/ckeditor/ckeditor5-inspector/commit/55d72a3a8f708554d22341ce26a31f4448c39fc5))

---

To see all releases, visit the [release page](https://github.com/ckeditor/ckeditor5-inspector/releases).
