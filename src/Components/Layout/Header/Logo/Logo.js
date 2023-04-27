import React from 'react';
import logo from '../Logo/Logo.png';
import './Logo.css';

function Logo() {
    return (
        <div className='app-logo-wrapper'>
            <a href="/">
                <img className="app-logo" src={logo} alt='logo'></img>
            </a>
        </div>
    );
}

export default Logo;