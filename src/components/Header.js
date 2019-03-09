import React from 'react'
import { StaticQuery, graphql } from 'gatsby'
import Image from 'gatsby-image'
import MediaQuery from 'react-responsive';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };
    }

    handleClick = () => {
        console.log('e');
        this.setState({
            visible: !this.state.visible
        });
    }
    
    render() {
        return (
            <header className="m-header">
            <div className="m-header-title">
                <a href="/" target="_self">
                    <img className="logo" width="36" src="/img/1x.png" srcSet="/img/2x.png 2x" />
                    <h6 className="name">dwb - blog</h6>
                </a>
                {/* <Logo distPath={props.distPath} nav={props.nav} /> */}
            </div>
            <nav className={`m-header-nav ${this.state.visible ? 'visible' : ''}`}>
                <ul className="m-header-items">
                    <li className="item "><a className="href" href="/about">About</a></li>
                </ul>
            </nav>
            <div id="js-nav-btn" className="m-header-btn ui-font-ydoc" onClick={this.handleClick}>&#xf020;</div>
            </header>
        );
    }
}



export default Header;
