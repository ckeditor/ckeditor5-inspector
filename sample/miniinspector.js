/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import {
	Autoformat,
	BlockQuote,
	Bold,
	DecoupledEditor,
	Essentials,
	Heading,
	Image,
	ImageCaption,
	ImageStyle,
	ImageToolbar,
	ImageUpload,
	Indent,
	Italic,
	Link,
	List,
	MediaEmbed,
	Paragraph,
	PasteFromOffice,
	Table,
	TableToolbar
} from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';

import MiniCKEditorInspector from '../src/minickeditorinspector.jsx';

window.MiniCKEditorInspector = MiniCKEditorInspector;

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

const config = {
	licenseKey: 'GPL',
	plugins: [
		Autoformat,
		Bold,
		Italic,
		BlockQuote,
		Essentials,
		Heading,
		Image,
		ImageCaption,
		ImageStyle,
		ImageToolbar,
		ImageUpload,
		Indent,
		Link,
		List,
		MediaEmbed,
		Paragraph,
		PasteFromOffice,
		Table,
		TableToolbar,

		UploadAdapter,
		MarkerDemoPlugin
	],
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

DecoupledEditor
	.create( document.querySelector( '#editor-content' ), config )
	.then( editor => {
		window.firstEditor = editor;
		document.body.insertBefore( editor.ui.view.toolbar.element, editor.ui.getEditableElement() );

		MiniCKEditorInspector.attach( editor, document.querySelector( '#inspector-container' ) );
	} )
	.catch( error => {
		console.error( error );
	} );
