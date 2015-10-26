import React, {Component, PropTypes} from 'react';
import './index.sass';

class WelcomePage extends Component {
	static propTypes = {
		children: PropTypes.object
	}

	render() {
		return (
			<div className="welcome-page">
				{this.props.children}
				<div className="welcome-page__video">
				</div>
			</div>
		);
	}
}

export default WelcomePage;
