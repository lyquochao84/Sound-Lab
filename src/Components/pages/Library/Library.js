import React, { useState, useEffect } from "react";
import Header from "../../Layout/Header/Header";
import Logo from "../../Layout/Header/Logo/Logo";
import Sidebar from "../../Layout/Sidebar/Sidebar";
import SpotifyWebApi from "spotify-web-api-node";
import {useNavigate, useLocation} from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './Library.css';
import { faCirclePlay } from "@fortawesome/free-solid-svg-icons";

const spotifyApi = new SpotifyWebApi({
    clientId: "d96cbc9c41924effafdd99cb86e163b0"
});

function Library() {
    const navigate = useNavigate();
    const location = useLocation();
    const accessToken = location.state;
    const [playlists, setPlaylists] = useState([]); 

    function sendAccessTokenToLiked() {
        navigate('/liked', 
            {
                state: accessToken,
            }
        )
    }

    function sendAccessTokenToPlaylist() {
        navigate('/liked')
    }

    // Token for Library Page
    useEffect(() => {
        if (!accessToken) {
            return;
        }
        spotifyApi.setAccessToken(accessToken);
    },[accessToken])

    useEffect(() => {
        if (!playlists) {
            return setPlaylists([]);
        }

        const storedPlaylists = localStorage.getItem('play');
        if (storedPlaylists) {
            setPlaylists(JSON.parse(storedPlaylists));
        }
        
        let cancelRequest = false;
        if (accessToken) {
            spotifyApi.getUserPlaylists()
                .then((data) => {
                    setPlaylists(data.body.items);
                })
                .catch((error) => {
                    console.log(error);
                })
            return () => cancelRequest = true;
        }
    }, [accessToken, spotifyApi])

    return (
        <>
            <Header className='app-header'>
                <Logo />

                <h1 className="library-song-page-title">Music Library</h1>
            </Header>

            <div className='library-page-wrapper'>
                <Sidebar accessToken={accessToken} spotifyApi={spotifyApi}/>
                
                <div className='library-page-content-wrapper'>
                    <a onClick={() => {sendAccessTokenToLiked()}}>
                        <div className="library-liked-songs-container">
                            <h1 className="library-liked-songs-title">Favorite Songs</h1>
                            <FontAwesomeIcon className="library-liked-songs-icon" icon={faCirclePlay}/>
                        </div>
                    </a>

                    <div className="library-playlist-content-container">
                        <h1 className="library-playlist-title">Playlists</h1>
                        <div className="library-playlists-wrapper">
                            {playlists.map((playlist) => {
                                return (
                                    <ul className='library-playlist-container'>
                                        <li className="library-playlist-key" key={playlist.id} 
                                            onClick={() => {
                                                navigate(`/playlist/${playlist.id}`,
                                                    { 
                                                        state: accessToken,
                                                        playlistId: playlist.id
                                                    }
                                                )
                                            }}
                                        >
                                            <h3 className="library-playlist-name">{playlist.name}</h3>
                                        </li>
                                    </ul>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>  
        </>
    );
}

export default Library;