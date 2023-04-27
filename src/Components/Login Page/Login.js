// Login Page
import React, { useState } from 'react';
import logo from '../../img/Logo.png';
import image1 from '../../img/Login-Photo.jpg';
import { AUTHORIZE } from '../Store Information/Store';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowRight } from "@fortawesome/free-solid-svg-icons";
import './Login.css';

function Login() {
    const [currentSlide, setCurrentSlide] = useState(1);
    const [showWelcomePart, setShowWelcomePart] = useState(true);

    function handleNextSlide() {
        setCurrentSlide(currentSlide === 1 ? 2 : 1);
        setShowWelcomePart(false);
    }

    return (
        <div className='welcome-part-wrapper'>
            {showWelcomePart && (
                <div className='welcome-part-container'>
                    <div className='welcome-text'>
                        <h1 className='welcome-part-title'>Welcome</h1>
                        <p className='welcome-part-description'>Discover and listen to your music</p>
                    </div>
                    <div className='welcome-part-image-wrapper'>
                        <img src={image1} alt='image' className='welcome-part-image'/>
                        <FontAwesomeIcon className='welcome-part-next-button' icon={faCircleArrowRight} onClick={handleNextSlide}/>
                    </div>
                </div>
            )}
            {!showWelcomePart && (
                <form className='login-form'>
                    <h1 className='login-title'>Log In</h1>
                    <div className='login-input-container'>
                        <input className='login-email' type="email" placeholder='Email' />
                        <br/>
                        <input className='login-password' type="password" placeholder='Password' />
                    </div>
                    <div className='sign-up-container'>
                        <h4 className='sign-up-title'>Don't have an account?</h4>
                        <a href='https://www.spotify.com/za-en/signup?forward_url=https%3A%2F%2Fopen.spotify.com%2F' className='sign-up-button'>
                            <h4>Sign Up</h4>
                        </a>
                    </div>
                    <a href={AUTHORIZE} className="login__btn">LOGIN</a>
                </form>
            )}
        </div>
    )
}

export default Login;
