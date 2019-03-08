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
				this.getObserverTarget( prevProps.editor ).off( this.observerEventName, this.update );
			}

			if ( this.props.editor ) {
				if ( !prevProps || !prevProps.editor || ( prevProps.editor !== this.props.editor ) ) {
					this.startListeningToEditor();
				}
			}
		}

		componentWillUnmount() {
			if ( this.props.editor ) {
				this.getObserverTarget( this.props.editor ).off( this.observerEventName, this.update );
			}
		}

		startListeningToEditor() {
			if ( this.props.editor ) {
				this.getObserverTarget( this.props.editor ).on( this.observerEventName, this.update );
				this.update();
			}
		}

		render() {
			return super.render();
		}
	};
}
