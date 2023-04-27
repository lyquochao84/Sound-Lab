import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
import SpotifyPlayer from 'react-spotify-web-playback';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faNoteSticky } from "@fortawesome/free-regular-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import './Player.css';


function Player({ spotifyApi, accessToken, trackUri, showLyrics, setShowLyrics }) {
    const [play, setPlay] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [addButton, setAddButton] = useState(false);
    const [showAddOptions, setShowAddOptions] = useState(false);
    const [playlists, setPlaylists] = useState([]); 

    const handleSave = async () => {
        const currentTrack = await spotifyApi.getMyCurrentPlayingTrack();
        const trackId = currentTrack.body.item.id;
        await spotifyApi.addToMySavedTracks([trackId]);
    }

    const handleChangeColor = () => {
        setIsActive(!isActive);
    }

    const showAddPlaylist = () => {
        setShowAddOptions(!showAddOptions);
    }

    const handleChangeAddColor = () => {
        setAddButton(!addButton);
    }

    const addPlaylist = async (id) => {
        const currentTrack = await spotifyApi.getMyCurrentPlayingTrack();
        const  trackUri = currentTrack.body.item.uri;
        await spotifyApi.addTracksToPlaylist(id, [trackUri]);
        setShowAddOptions(false);
    }

    useEffect(() => {
        setPlay(true);
    }, [trackUri])

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
            {showAddOptions && 
                (<div className="playlist-options-add-container">
                    {playlists.map((playlist) => (
                        <div key={playlist.id} className="each-playlist-options">
                            <h3 className="each-playlist-name">{playlist.name}</h3>
                            <button onClick={() => addPlaylist(playlist.id)} className="each-playlist-button">ADD</button>
                        </div>
                    ))}
                </div>
            )}

            <div className="player-icon-container">
                {isPlaying && 
                (   
                    <>
                        <a onClick={() => {handleSave()}}>
                            <FontAwesomeIcon onClick={() => {handleChangeColor()}}
                                className={isActive ? 'player-icon' : 'other-btn-color'}
                                icon={faHeart} 
                            /> 
                        </a>

                        <a onClick={showAddPlaylist}>
                            <FontAwesomeIcon onClick={handleChangeAddColor}
                                className={addButton ? 'player-add-active' : 'player-add'}
                                icon={faPlus}
                            />
                        </a>
                    </>
                )}
            </div>

            <>
                {isPlaying && (
                    <FontAwesomeIcon className="show-lyrics-btn" onClick={() => setShowLyrics(!showLyrics)} icon={faNoteSticky}/>                       
                )}
            </>
    
            <SpotifyPlayer
                token={accessToken}
                callback={state => {
                    setIsPlaying(state.isPlaying);
                    if (!state.isPlaying) setPlay(false)    
                }}
                play={play} 
                uris={trackUri ? trackUri : []}
                styles={{
                    activeColor: "#000",
                    bgColor: "#fff",
                    color: "#000",
                    loaderColor: "#000",
                    sliderColor: "#000",
                    trackArtistColor: "#000",
                    trackNameColor: "#000",
                    height: "55px",
                }}
            />
        </>
    );
}

export default Player;