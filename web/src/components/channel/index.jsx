import React, {Component, PropTypes} from 'react';
import UserPic from '../user-pic';
import './index.sass';
require('../../sound/message.mp3');

class Channel extends Component {
	static propTypes = {
		channel: PropTypes.object.isRequired,
		changeChannel: PropTypes.func.isRequired,
		deleteChannel: PropTypes.func.isRequired,
		active: PropTypes.bool,
		unread: PropTypes.number,
		lastMessage: PropTypes.string,
		current: PropTypes.string
	}
	constructor(props) {
		super(props);
	}

	componentDidUpdate(prevProps) {
		const oldCount = prevProps.unread;
		const messageSound = new Audio('../../sound/message.mp3');
		messageSound.load();
		if ((!this.props.active && (this.props.unread > oldCount))) {
			messageSound.play();
		}
	}

	changeChannel(event) {
		event.preventDefault();
		if (this.props.channel._id !== this.props.current) {
			this.props.changeChannel(this.props.channel._id);
		}
	}

	deleteChannel(event) {
		event.preventDefault();
		event.stopPropagation();
		if (this.props.channel._id !== '1bd3b5a8a7a560e168b3890a') {
			this.props.deleteChannel(this.props.channel._id);
		}
	}

	render() {
		const {channel: {avatar, color, name, is_online: isOnline}, unread, active, lastMessage} = this.props;
		const activeModificator = active ? '--active' : '';
		const defaultChannelId = '1bd3b5a8a7a560e168b3890a';

		return (
			<li className={'channel-wrap' + activeModificator} onClick={this.changeChannel.bind(this)}>
				<a className="channel">
					<div className="channel__image-wrap">
						<UserPic
							online={isOnline}
							avatar={avatar}
							color={color}/>
					</div>
					<div className="channel__message">
						<div className="channel__message-header"><span>{name}</span></div>
						{(() => {
							if (lastMessage) {
								return (
									<div className="channel__message-content">
										<span className="channel__message-preview">{lastMessage.substring(0, 60)}</span>
									</div>
								);
							}
							return '';
						})()
						}
					</div>
					{this.props.channel._id === defaultChannelId ? '' : <span className="channel__delete" href="#" onClick={this.deleteChannel.bind(this)}>Delete</span>}
					{unread && unread > 0 ? <span className="channel__message-unread">{unread}</span> : ''}
				</a>
			</li>
		);
	}
}

export default Channel;
