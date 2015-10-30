import React, {Component} from 'react';
import './index.sass';

class Header extends Component {
	render() {
		return (
			<header className="header">
				<a className="header__logo" href="#">Vanilla js</a>
				<a className="header__logout-link" href="/logout">Logout</a>
				<a className="header__menu-link" href="#">
					<span className="header__menu-text">Menu</span>
					<span className="header__menu-icon fa fa-bars"/>
				</a>
			</header>
		);
	}
}

export default Header;
