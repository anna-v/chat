import React, {Component, PropTypes} from 'react';
import './index.sass';
require('../../img/avatar-1.png');
require('../../img/avatar-2.png');
require('../../img/avatar-3.png');
require('../../img/avatar-4.png');
require('../../img/avatar-5.png');
require('../../img/avatar-6.png');
require('../../img/avatar-7.png');
require('../../img/avatar-8.png');

class UserPic extends Component {
	static propTypes = {
		online: PropTypes.bool,
		avatar: PropTypes.string,
		color: PropTypes.string
	}
	constructor(props) {
		super(props);
	}

	render() {
		let online;
		const {avatar, color} = this.props;
		if (this.props.online) {
			online = <span className="user-status user-status--online">Online</span>;
		}

		return (
			<div className="userpic">
				<img className="userpic__image" src={avatar} style={{backgroundColor: `#${color}`}} height="50" alt=""></img>
				{online}
			</div>
		);
	}
}

export default UserPic;

