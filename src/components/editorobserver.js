/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

export default function editorEventObserver( WrappedComponent ) {
	return class extends WrappedComponent {
		componentDidMount() {
			this.startListeningToEditor();
		}

		componentDidUpdate( prevProps ) {
			if ( prevProps && prevProps.editor && prevProps.editor !== this.props.editor ) {
				this.stopListeningToEditor();
			}

			if ( this.props.editor ) {
				if ( !prevProps || !prevProps.editor || ( prevProps.editor !== this.props.editor ) ) {
					this.startListeningToEditor();
				}
			}
		}

		componentWillUnmount() {
			if ( this.props.editor ) {
				this.stopListeningToEditor();
			}
		}

		startListeningToEditor() {
			if ( this.props.editor ) {
				this._onEditorEventCallback = () => {
					this.forceUpdate();
				};

				const { target, event } = this.editorEventObserverConfig;

				target.on( event, this._onEditorEventCallback );

				this.forceUpdate();
			}
		}

		stopListeningToEditor() {
			const { target, event } = this.editorEventObserverConfig;

			target.off( event, this._onEditorEventCallback );
		}

		render() {
			return super.render();
		}
	};
}
