 ---
 type: Fix
 see:
   - ckeditor/ckeditor5-inspector#39
   - ckeditor/ckeditor5-inspector#100
 communityCredits:
   - marco-ms
 ---
 
 Added a `container` option to `CKEditorInspector.attach()` allowing the inspector to be mounted into a custom DOM element instead of `document.body`. 
 Useful in multi-window environments (Electron, WebView2, iframes) where the global `document` is not the document where the editor lives. 
 The wrapper element is created in `container.ownerDocument` so ReactDOM event delegation works in the target document.
