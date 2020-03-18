/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

export default function editorEventObserver( WrappedComponent ) {
	return class extends WrappedComponent {
		constructor( ...args ) {
			super( ...args );

			this._onEditorEventCallback = () => {
				this.forceUpdate();
			};
		}

		componentDidMount() {
			this.startListeningToEditor();
		}

		componentDidUpdate( prevProps ) {
			if ( prevProps && prevProps.editor && prevProps.editor !== this.props.editor ) {
				this.stopListeningToEditor( prevProps );
			}

			if ( this.props.editor ) {
				if ( !prevProps || !prevProps.editor || ( prevProps.editor !== this.props.editor ) ) {
					this.startListeningToEditor();
				}
			}
		}

		componentWillUnmount() {
			this.stopListeningToEditor( this.props );
		}

		startListeningToEditor() {
			const { target, event } = this.editorEventObserverConfig( this.props );

			target.on( event, this._onEditorEventCallback );

			this.forceUpdate();
		}

		stopListeningToEditor( props ) {
			const { target, event } = this.editorEventObserverConfig( props );

			target.off( event, this._onEditorEventCallback );
		}
	};
}
