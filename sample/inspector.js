/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

/* global CKEditor5 */

import '../node_modules/ckeditor5/build/ckeditor5-dll.js';
import '../node_modules/@ckeditor/ckeditor5-editor-decoupled/build/editor-decoupled.js';
import '../node_modules/@ckeditor/ckeditor5-autoformat/build/autoformat.js';
import '../node_modules/@ckeditor/ckeditor5-basic-styles/build/basic-styles.js';
import '../node_modules/@ckeditor/ckeditor5-block-quote/build/block-quote.js';
import '../node_modules/@ckeditor/ckeditor5-essentials/build/essentials.js';
import '../node_modules/@ckeditor/ckeditor5-heading/build/heading.js';
import '../node_modules/@ckeditor/ckeditor5-html-support/build/html-support.js';
import '../node_modules/@ckeditor/ckeditor5-image/build/image.js';
import '../node_modules/@ckeditor/ckeditor5-indent/build/indent.js';
import '../node_modules/@ckeditor/ckeditor5-link/build/link.js';
import '../node_modules/@ckeditor/ckeditor5-list/build/list.js';
import '../node_modules/@ckeditor/ckeditor5-media-embed/build/media-embed.js';
import '../node_modules/@ckeditor/ckeditor5-paste-from-office/build/paste-from-office.js';
import '../node_modules/@ckeditor/ckeditor5-table/build/table.js';

import CKEditorInspector from '../src/ckeditorinspector.jsx';

window.CKEditorInspector = CKEditorInspector;

class DummyUploadAdapter {
	constructor( loader ) {
		this.loader = loader;
	}

	upload() {
		return this.loader.file
			.then( () => {
				return {
					default: 'umbrellas.jpg',
					160: 'umbrellas.jpg',
					500: 'umbrellas.jpg'
				};
			} );
	}

	abort() {
	}
}

function UploadAdapter( editor ) {
	editor.plugins.get( 'FileRepository' ).createUploadAdapter = loader => {
		return new DummyUploadAdapter( loader );
	};
}

function MarkerDemoPlugin( editor ) {
	const model = editor.model;
	const markerNames = [];

	editor.conversion.for( 'editingDowncast' ).markerToHighlight( {
		model: 'highlight',
		view: data => {
			const color = data.markerName.split( ':' )[ 1 ];

			return {
				classes: 'h-' + color,
				priority: 1
			};
		}
	} );

	editor.conversion.for( 'dataDowncast' ).markerToHighlight( {
		model: 'highlight',
		view: data => {
			const color = data.markerName.split( ':' )[ 1 ];

			return {
				classes: 'h-' + color,
				priority: 1
			};
		}
	} );

	editor.on( 'ready', () => {
		model.change( writer => {
			const root = model.document.getRoot();

			const nameA = 'highlight:yellow:123';
			const rangeA = model.createRange(
				model.createPositionFromPath( root, [ 0, 10 ] ),
				model.createPositionFromPath( root, [ 0, 16 ] )
			);

			const nameB = 'highlight:blue:456';
			const rangeB = model.createRange(
				model.createPositionFromPath( root, [ 0, 12 ] ),
				model.createPositionFromPath( root, [ 0, 22 ] )
			);

			markerNames.push( nameA, nameB );
			writer.addMarker( nameA, { range: rangeA, usingOperation: false, affectsData: true } );
			writer.addMarker( nameB, { range: rangeB, usingOperation: false, affectsData: true } );
		} );
	} );
}

let editorNames = [];

document.querySelector( '#destroy-inspector' ).addEventListener( 'click', () => {
	CKEditorInspector.destroy();
	editorNames = [];
} );

document.querySelector( '#attach-inspector' ).addEventListener( 'click', () => {
	const names = CKEditorInspector.attachToAll();

	editorNames.push( ...names );
} );

document.querySelector( '#detach-inspector-from-editors' ).addEventListener( 'click', () => {
	editorNames.forEach( name => CKEditorInspector.detach( name ) );
	editorNames = [];
} );

const config = {
	licenseKey: 'GPL',
	plugins: [
		CKEditor5.autoformat.Autoformat,
		CKEditor5.basicStyles.Bold,
		CKEditor5.basicStyles.Italic,
		CKEditor5.blockQuote.BlockQuote,
		CKEditor5.essentials.Essentials,
		CKEditor5.heading.Heading,
		CKEditor5.htmlSupport.GeneralHtmlSupport,
		CKEditor5.image.Image,
		CKEditor5.image.ImageCaption,
		CKEditor5.image.ImageStyle,
		CKEditor5.image.ImageToolbar,
		CKEditor5.image.ImageUpload,
		CKEditor5.indent.Indent,
		CKEditor5.link.Link,
		CKEditor5.list.List,
		CKEditor5.mediaEmbed.MediaEmbed,
		CKEditor5.paragraph.Paragraph,
		CKEditor5.pasteFromOffice.PasteFromOffice,
		CKEditor5.table.Table,
		CKEditor5.table.TableToolbar
	],
	htmlSupport: {
		allow: [
			{
				name: 'p',
				classes: [ 'foo', 'bar' ],
				attributes: {
					foo: 'true'
				},
				styles: { 'color': true }
			}
		]
	},
	toolbar: {
		items: [
			'heading',
			'|',
			'bold',
			'italic',
			'link',
			'bulletedList',
			'numberedList',
			'|',
			'outdent',
			'indent',
			'|',
			'uploadImage',
			'blockQuote',
			'insertTable',
			'mediaEmbed',
			'undo',
			'redo'
		]
	},
	image: {
		toolbar: [
			'imageStyle:inline',
			'imageStyle:block',
			'imageStyle:side',
			'|',
			'toggleImageCaption',
			'imageTextAlternative'
		]
	},
	table: {
		contentToolbar: [
			'tableColumn',
			'tableRow',
			'mergeTableCells'
		]
	}
};

CKEditor5.editorDecoupled.DecoupledEditor
	.create( document.querySelector( '#first-editor-content' ), {
		...config,
		extraPlugins: [ UploadAdapter, MarkerDemoPlugin ]
	} )
	.then( editor => {
		window.firstEditor = editor;
		document.body.insertBefore( editor.ui.view.toolbar.element, editor.ui.getEditableElement() );
		CKEditorInspector.attach( { 'first-editor': editor } );
		editorNames.push( 'first-editor' );
	} )
	.catch( error => {
		console.error( error );
	} );

CKEditor5.editorDecoupled.DecoupledEditor
	.create( document.querySelector( '#second-editor-content' ), {
		...config,
		extraPlugins: [ UploadAdapter ]
	} )
	.then( editor => {
		window.secondEditor = editor;
		document.body.insertBefore( editor.ui.view.toolbar.element, editor.ui.getEditableElement() );
		const [ name ] = CKEditorInspector.attach( editor );
		editorNames.push( name );
	} )
	.catch( error => {
		console.error( error );
	} );

CKEditor5.editorDecoupled.DecoupledEditor
	.create( document.querySelector( '#rtl-editor-content' ), {
		...config,
		extraPlugins: [ UploadAdapter ],
		language: 'ar'
	} )
	.then( editor => {
		window.thirdEditor = editor;
		document.body.insertBefore( editor.ui.view.toolbar.element, editor.ui.getEditableElement() );
		const [ name ] = CKEditorInspector.attach( { 'rtl': editor } );
		editorNames.push( name );
	} )
	.catch( error => {
		console.error( error );
	} );
