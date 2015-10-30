import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {requestVideoCall} from '../../actions/channels';
import './index.sass';

@connect(store => ({
	channels: store.channels
}))

class DialogDetails extends Component {
	static propTypes = {
		channels: PropTypes.object.isRequired,
		online: PropTypes.bool,
		dispatch: PropTypes.func.isRequired
	}

	constructor(props) {
		super(props);
	}

	_getChannelType() {
		const {channels: {current, contacts}} = this.props;
		return contacts[current].type;
	}

	_onCall() {
		const {channels: {current, contacts}, dispatch} = this.props;
		dispatch(requestVideoCall(contacts[current].user));
	}

	render() {
		const onlineModificator = this.props.online ? '--online' : '';
		let userName;
		let userPic;
		let color;
		if ((this.props.channels.contacts !== undefined) && (this.props.channels.contacts[this.props.channels.current] !== undefined)) {
			userName = this.props.channels.contacts[this.props.channels.current].name;
			userPic = this.props.channels.contacts[this.props.channels.current].avatar;
			color = this.props.channels.contacts[this.props.channels.current].color;
		}
		return (
			<div className="dialog-details">
				<div className="dialog-details__contact">
					<img className="dialog-details__userpic" style={{backgroundColor: `#${color}`}} src={userPic}></img>
					<p className="dialog-details__name">{userName}</p>
					<p className={'dialog-details__status ' + 'dialog-details__status' + onlineModificator}>{this.props.online ? 'online' : 'offline'}</p>
				</div>
				{userName && this._getChannelType() === 'user' && this.props.online ?
						<span onClick={::this._onCall} className="dialog-details__call"><i className="fa fa-video-camera"/></span> : ''}
			</div>
		);
	}
}

export default DialogDetails;
