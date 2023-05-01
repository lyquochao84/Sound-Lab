import React from "react";
import { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SpotifyWebApi from "spotify-web-api-node";
import Header from "../Layout/Header/Header";
import Sidebar from "../Layout/Sidebar/Sidebar";
import Logo from "../Layout/Header/Logo/Logo";
import Player from "../Player/Player";
import './Playlist.css';
import { faSquareCaretDown, faXmarkCircle } from "@fortawesome/free-regular-svg-icons";
import PlaylistSongs from "./PlaylistSongs/PlaylistSongs";

const spotifyApi = new SpotifyWebApi({
    clientId: "d96cbc9c41924effafdd99cb86e163b0"
});

// Get playlist track 
function Playlist() {
    const location = useLocation();
    const accessToken = location.state;
    const navigate = useNavigate();
    const { playlistId } = useParams();
    const [playlistTrack, setPlaylistTrack] = useState([]);
    const [playlistName, setPlaylistName] = useState([]);
    const [playingTrack, setPlayingTrack] = useState([]);
    const [showOptions, setShowOptions] = useState(false);
    const [showChangeName, setShowChangeName] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState([]);

    // Token
    useEffect(() => {
        if (!accessToken) {
            return;
        }
        spotifyApi.setAccessToken(accessToken)
    }, [accessToken])

    // Playlist Name
    useEffect(() => {
        if (!playlistName) { return; }

        spotifyApi.getPlaylist(playlistId)
            .then((data) => {
                setPlaylistName(data.body.name);
            })
            .catch((error) => {
                console.log(error);
            })
    }, [playlistName, accessToken])

    // Playlist Track
    useEffect(() => {
        spotifyApi.getPlaylistTracks(playlistId)
            .then((data) => {
                setPlaylistTrack(data.body.items);
            })
            .catch((error) => {
                console.log(error);
            })
    }, [accessToken, spotifyApi])

    // Show more options
    function showMoreOptions() {
        setShowOptions(!showOptions);
    }

    // Show change name modal
    function changeNameBox() {
        setShowChangeName(!showChangeName)
        setShowOptions(false);
    }

    // Change playlist's name
    function changeNewName() {
        spotifyApi.changePlaylistDetails(playlistId, { name: newPlaylistName })
            .then(() => {
                setNewPlaylistName(newPlaylistName);
            })
            .catch((error) => {
                console.log(error);
            })

        setShowChangeName(false);
    }

    // Delete Playlist
    function deletePlaylist() {
        spotifyApi.unfollowPlaylist(playlistId)
            .then(() => {
                navigate('/dashboard')
            })
            .catch((error) => {
                console.log(error);
            });
    }

    // Choose track to play
    function chooseTrack(track) {
        setPlayingTrack(track.track);
        spotifyApi.play({
            uris: [track.track.uri],
        })
        .then(() => {
            console.log('Song started playing!');
        })
        .catch((error) => {
            console.log(error);
        });
    }

    // Remove Track from playlist
    function removeTrack(track) {
        const trackId = track.track.id;
        spotifyApi.removeTracksFromPlaylist(playlistId, [{ uri: track.track.uri }])
            .then(() => {
                const newPlaylistTrack =  playlistTrack.filter((t) => t.track.id !== trackId);
                setPlaylistTrack(newPlaylistTrack);
            })
            .catch((error) => {
                console.log(error);
            })
    }
    return (
        <>
            <Header className='app-header'>
                <Logo />
                <div className="playlist-header">
                    <div className="playlist-title-wrapper">
                        <h1 className="playlist-title">
                            {`${playlistName}`}
                        </h1>
                        <div className="playlist-header-icon-container">
                            <FontAwesomeIcon 
                                className="playlist-header-icon" 
                                onClick={showMoreOptions} 
                                icon={faSquareCaretDown}
                            />
                            {showOptions && (<div className="playlist-options-container">
                                <h3 
                                    className="playlist-option-changename"
                                    onClick={changeNameBox}
                                >
                                    Change Name
                                </h3>
                                <h3 
                                    className="playlist-option-delete"
                                    onClick={deletePlaylist}
                                >
                                    Delete Playlist
                                </h3>
                            </div>)}
                        </div>
                    </div>
                    <h4 className="playlist-total">{`${playlistTrack.length} songs`}</h4>
                    {showChangeName && (<div className="playlist-changename-container">
                        <h2 className="playlist-changename-title">New Playlist Name</h2>
                        <input 
                            className="playlist-changename-input"
                            type="text"
                            placeholder="New Playlist Name"
                            value={newPlaylistName}
                            onChange={(e) => setNewPlaylistName(e.target.value)}
                        />
                        <button onClick={changeNewName} type="submit" className="playlist-changename-button">Submit</button>
                    </div>)}
                </div>
            </Header>

            <div className="playlist-wrapper">
                <Sidebar  accessToken={accessToken} spotifyApi={spotifyApi}/>
                
                <div className="playlist-content">
                    <div className="playlist-song">
                        <h3 className="playlist-song-container-title">Description</h3>
                        {playlistTrack.map((track) => (
                            <PlaylistSongs track={track} key={track.track.uri} chooseTrack={chooseTrack}/>
                        ))}
                    </div>

                    <div className="playlist-song-duration">
                        <h3 className="playlist-song-duration-title">Duration</h3>    
                        {playlistTrack.map((track) => {
                            const duration = Math.floor(track.track.duration_ms / 1000);
                            const minutes = Math.floor(duration / 60);
                            const seconds = duration % 60;
                            const result = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                            return (
                                <h3 className='playlist-song-duration-time'>{result}</h3>
                            )
                        })}
                    </div>

                    <div className="playlist-song-date-added-container">
                        <h3 className="playlist-song-date-title">Date Added</h3>
                        {playlistTrack.map((track) => {
                            const date = track.added_at;
                            const dateObj = new Date(date);
                            let month = dateObj.getMonth() + 1; 
                            if (month < 10) {
                                month = `0${month}`;
                            }
                            let day = dateObj.getDate();
                            if (day < 10) {
                                day = `0${day}`;
                            }
                            const year = dateObj.getFullYear();
                            const result = `${month} - ${day} - ${year}`;
                            
                            return (
                                <>
                                    <h3 className='playlist-song-date-added'>{result}</h3>
                                </>
                            )
                        })}
                    </div>

                    <div className="delete-btn-container">
                        {playlistTrack.map((track) => {
                            return (
                                <><FontAwesomeIcon onClick={() => {removeTrack(track)}} className="delete-btn-icon" icon={faXmarkCircle} /></>
                            )
                        })}
                    </div>
                </div>
            </div>

            <div className='player-container'>
                <Player spotifyApi={spotifyApi} accessToken={accessToken} trackUri={playingTrack?.uri}/>
            </div>  
        </>
    );
}

export default Playlist;