/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import Editor from '@ckeditor/ckeditor5-core/src/editor/editor';
import EditorUI from '@ckeditor/ckeditor5-core/src/editor/editorui';
import HtmlDataProcessor from '@ckeditor/ckeditor5-engine/src/dataprocessor/htmldataprocessor';
import BoxedEditorUIView from '@ckeditor/ckeditor5-ui/src/editorui/boxed/boxededitoruiview';
import ElementReplacer from '@ckeditor/ckeditor5-utils/src/elementreplacer';
import InlineEditableUIView from '@ckeditor/ckeditor5-ui/src/editableui/inline/inlineeditableuiview';
import getDataFromElement from '@ckeditor/ckeditor5-utils/src/dom/getdatafromelement';
import Command from '@ckeditor/ckeditor5-core/src/command';
import DataApiMixin from '@ckeditor/ckeditor5-core/src/editor/utils/dataapimixin';
import mix from '@ckeditor/ckeditor5-utils/src/mix';

export default class TestEditor extends Editor {
	/**
	 * @inheritDoc
	 */
	constructor( element, config ) {
		super( config );

		this.element = element;
		this.data.processor = new HtmlDataProcessor( this.data.viewDocument );
		this.ui = new ClassicTestEditorUI( this, new BoxedEditorUIView( this.locale ) );
		this.ui.view.editable = new InlineEditableUIView( this.ui.view.locale, this.editing.view );
		this.model.document.createRoot();
	}

	destroy() {
		this.ui.destroy();

		return super.destroy();
	}

	static create( element, config = {} ) {
		return new Promise( resolve => {
			const editor = new this( element, config );

			resolve(
				editor.initPlugins()
					.then( () => editor.ui.init( element ) )
					.then( () => editor.editing.view.attachDomRoot( editor.ui.getEditableElement() ) )
					.then( () => editor.data.init( config.initialData || getDataFromElement( element ) ) )
					.then( () => {
						editor.state = 'ready';
						editor.fire( 'ready' );
					} )
					.then( () => editor )
			);
		} );
	}
}

class ClassicTestEditorUI extends EditorUI {
	constructor( editor, view ) {
		super( editor );
		this._elementReplacer = new ElementReplacer();
		this._view = view;
	}

	get view() {
		return this._view;
	}

	init( element ) {
		const view = this.view;
		const editable = view.editable;
		const editingView = this.editor.editing.view;
		const editingRoot = editingView.document.getRoot();

		editable.name = editingRoot.rootName;
		view.render();
		view.main.add( view.editable );

		this.setEditableElement( 'main', view.editable.element );
		this._elementReplacer.replace( element, view.element );

		this.editor.commands.add( 'foo', new FooCommand( this.editor ) );
		this.editor.commands.add( 'bar', new FooCommand( this.editor ) );
		this.editor.commands.add( 'qux', new FooCommand( this.editor ) );

		this.fire( 'ready' );
	}

	destroy() {
		this._elementReplacer.restore();
		this._view.destroy();
		super.destroy();
	}
}

export class FooCommand extends Command {
	refresh() {
		this.isEnabled = true;
	}
}

mix( TestEditor, DataApiMixin );
