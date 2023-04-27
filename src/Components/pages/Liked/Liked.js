import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SpotifyWebApi from 'spotify-web-api-node';
import Logo from '../../Layout/Header/Logo/Logo';
import Header from '../../Layout/Header/Header';
import Sidebar from '../../Layout/Sidebar/Sidebar';
import Player from '../../Player/Player';
import LikedSong from './LikedSong/LikedSong';
import './Liked.css';
import axios from 'axios';
import Lyrics from '../../Layout/Content/Lyrics/Lyrics';


const spotifyApi = new SpotifyWebApi({
    clientId: "d96cbc9c41924effafdd99cb86e163b0"
});

function Liked() {
    const location = useLocation();
    const accessToken = location.state;
    const [savedTracks, setSavedTracks] = useState([]);
    const [playingTrack, setPlayingTrack] = useState();
    const [lyrics, setLyrics] = useState("");
    const [showLyrics, setShowLyrics] = useState(false);

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

    // Token for Liked Page and also get user's saved tracks
    useEffect(() => {
        if (!accessToken) {
          return;
        }
        spotifyApi.setAccessToken(accessToken);
        
        spotifyApi.getMySavedTracks()
            .then((data) => {
                setSavedTracks(data.body.items);
            })
            .catch((error) => {
                console.log(error);
            })

    }, [accessToken, spotifyApi]);

    // Lyrics Part
    useEffect(() => {
        if (!playingTrack) {
            return;
        }
        axios.get('http://localhost:3001/lyrics', {
            params: {
                track: playingTrack.title,
                artist: playingTrack.artist,
            }
        })
            .then((response) => {
                setLyrics(response.data.lyrics)
            })

    }, [playingTrack])

    return (
        <>  
            <Header className='app-header'> 
                <Logo />
                <h1 className="liked-song-page-title">Favorite Songs</h1>
            </Header>
            
            <div className='liked-page-wrapper'>
                <Sidebar  accessToken={accessToken} spotifyApi={spotifyApi}/>
                
                {showLyrics ? <Lyrics lyrics={lyrics}/> : (<div className='liked-page-content-wrapper'>
                   <div className='liked-song-description'>
                        <h3 className='liked-song-description-title'>Description</h3>
                        {savedTracks.map((track) => (
                            <LikedSong track={track} key={track.track.uri} chooseTrack={chooseTrack}/>
                       ))}
                   </div>
                   <div className='liked-song-name'>
                        <h3 className='liked-song-name-title'>Name</h3>
                        {savedTracks.map((track) => (
                            <h3 className='liked-song-songname'>{track.track.name}</h3>
                        ))}
                   </div>
                   <div className='liked-song-artist'>
                        <h3 className='liked-song-artist-title'>Artist</h3>
                        {savedTracks.map((track) => (
                            <h3 className='liked-song-artist-name'>{track.track.album.artists[0].name}</h3>
                        ))}
                   </div>
                   <div className='liked-song-duration'>
                        <h3 className='liked-song-duration-title'>Duration</h3>
                        {savedTracks.map((track) => {
                            const duration = Math.floor(track.track.duration_ms / 1000);
                            const minutes = Math.floor(duration / 60);
                            const seconds = duration % 60;
                            const result = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                            return (
                                <h3 className='liked-song-duration-time'>{result}</h3>
                            )
                        })}
                   </div>
                   <div className='liked-song-date'>
                        <h3 className='liked-song-date-title'>Date Added</h3>
                        {savedTracks.map((track) => {
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
                                <h3 className='liked-song-date-added'>{result}</h3>
                            )
                        })}
                   </div>
                </div>)}
            </div>

            <div className='player-container'>
                <Player showLyrics={showLyrics} setShowLyrics={setShowLyrics} spotifyApi={spotifyApi} accessToken={accessToken} trackUri={playingTrack?.uri}/>
            </div>  
        </>
    );
}

export default Liked;