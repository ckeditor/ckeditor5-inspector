/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import {
	Editor,
	EditorUI,
	Command,
	HtmlDataProcessor,
	BoxedEditorUIView,
	InlineEditableUIView,
	ElementReplacer,
	getDataFromElement
} from 'ckeditor5';

export default class TestEditor extends Editor {
	/**
	 * @inheritDoc
	 */
	constructor( element, config ) {
		super( {
			...config,
			licenseKey: 'GPL'
		} );

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
