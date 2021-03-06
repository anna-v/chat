import React, {Component, PropTypes} from 'react';
import Channel from '../channel';
import './index.sass';

class ChannelList extends Component {
	static propTypes = {
		changeChannel: PropTypes.func.isRequired,
		deleteChannel: PropTypes.func.isRequired,
		channels: PropTypes.object.isRequired,
		currentChannelId: PropTypes.string
	}

	render() {
		const {changeChannel, deleteChannel, channels} = this.props;
		return (
			<div className="channels__wrap">
				<ul className="channels__add">
					{Object.keys(channels).map(key => {
						return (
							<Channel
								key={channels[key]._id}
								online={channels[key].is_online === true}
								active={channels[key]._id === this.props.currentChannelId}
								channel={channels[key]}
								current={this.props.currentChannelId}
								lastMessage={channels[key].lastMessage}
								unread={parseInt(channels[key].message_count, 10)}
								changeChannel={changeChannel}
								deleteChannel={deleteChannel}/>
						);
					})}
				</ul>
				<div className="channels__shadow"></div>
			</div>
		);
	}
}

export default ChannelList;
