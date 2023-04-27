import React, { Fragment, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import './User.css';

function User({ accessToken, spotifyApi }) {
    const [userData, setUserData] = useState({});

    useEffect(() => {
        if (!accessToken) {
            return;
        }
        spotifyApi.setAccessToken(accessToken)
    }, [accessToken])

    useEffect(() => {
        if (!userData) { return setUserData({}); }
        if (!accessToken) { return; }

        spotifyApi.getMe() 
            .then((data) => {
                setUserData(data.body);
            })
            .catch((error) => {
                console.log(error);
            })
    }, [accessToken, spotifyApi])


    return (
        <Fragment>
            <div className='user-info-wrapper'>
                <FontAwesomeIcon className='user-info-icon' icon={faUser} />
                <p className='user-info-name'>
                    {userData.display_name}
                </p>
            </div>
        </Fragment>
    );
}

export default User;