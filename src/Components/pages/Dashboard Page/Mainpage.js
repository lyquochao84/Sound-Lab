// Dashboard Page
import React, { Fragment } from 'react';
import { useState, useEffect } from 'react';
import useAuth from '../../UserAuthorization/useAuth';
import SpotifyWebApi from 'spotify-web-api-node';
import TrackSearchDisplay from '../../Track Search Display/TrackSearchDisplay';
import './Mainpage.css';
import Logo from '../../Layout/Header/Logo/Logo';
import Header from '../../Layout/Header/Header';
import Sidebar from '../../Layout/Sidebar/Sidebar';
import Player from '../../Player/Player';
import User from '../../Layout/Header/User/User';
import PopperWrapper from '../../Popper/PopperWrapper';
import Content from '../../Layout/Content/Content';
import TrendingSongs from '../../Layout/Content/TrendingSongs/TrendingSongs';
import TopArtists from '../../Layout/Content/TopArtists/TopArtists';
import NewReleases from '../../Layout/Content/NewReleases/NewReleases';
import Lyrics from '../../Layout/Content/Lyrics/Lyrics';
import axios from 'axios';



const spotifyApi = new SpotifyWebApi({
    clientId: "d96cbc9c41924effafdd99cb86e163b0"
});

function Mainpage({ code }) {
    const accessToken = useAuth(code);
    const [search, setSearch]  = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [playingTrack, setPlayingTrack] = useState();
    const [songs, setSongs] = useState([]);
    const [artists, setArtists] = useState([]);
    const [newReleases, setNewReleases] = useState([]);
    const [lyrics, setLyrics] = useState("");
    const [showLyrics, setShowLyrics] = useState(false);

    // Choose Track to play in search
    function chooseTrack(track) {
        setPlayingTrack(track);
        setSearch('');
        setLyrics("");
    }

    // Token for main page 
    useEffect(() => {
        if (!accessToken) {
            return;
        }
        spotifyApi.setAccessToken(accessToken)
    }, [accessToken])

    // Search part function
    useEffect(() => {
        if (!search) {
            return setSearchResults([]);
        }
        if (!accessToken) {
            return;
        }

        let cancelRequest = false;
        spotifyApi.searchTracks(search)
            .then(res => {
                if (cancelRequest) {
                 return;
                }
                setSearchResults(res.body.tracks.items.map(track => {
                    const albumImage = track.album.images.reduce(
                        (smallest, image) => {
                            if (image.height < smallest.height) {
                                return image;
                            }
                            return smallest;
                        }
                    , track.album.images[0]);
                    return ({
                        artist: track.artists[0].name,
                        title: track.name,
                        uri: track.uri,
                        album: albumImage.url
                    })
            })
        )})
        return () => cancelRequest = true;
    }, [search, accessToken])

    // Render "Popular Songs" for Dashboard
    useEffect(() => {
        if (!songs) { return setSongs([]); }
        if (!accessToken) { return; }
        
        let cancelRequest = false;
        spotifyApi.getPlaylist('37i9dQZEVXbMDoHDwVN2tF')
            .then((data) => {
                setSongs(data.body.tracks.items.map(song => ({
                    artist: song.track.artists[0].name,
                    title: song.track.name,
                    uri: song.track.uri,
                    image: song.track.album.images[0].url,
                })));
            })
            .catch((error) => {
                console.error(error);
            });

            return () => cancelRequest = true;
    }, [songs, accessToken]);

    // Render "Top Artists" for Dashboard
    useEffect(() => {
        if (!artists) { return setArtists([]); }
        if (!accessToken) { return; }

        spotifyApi.getArtists([
            '06HL4z0CvFAxyc27GXpf02', 
            '3TVXtAsR1Inumwj472S9r4', 
            '5K4W6rqBFWDnAN6FQUkS6x', 
            '1Xyo4u8uXC1ZmMpatF05PJ',
            '7tYKF4w9nC0nq9CsPZTHyP',
            '41MozSoPIsD1dJM0CLPjZF',
        ])
            .then((res)=> { 
                setArtists(res.body.artists.map((artist) => ({
                    id: artist.id,
                    artist: artist.name,
                    image: artist.images[0].url
                })))
            })
            .catch(err => console.log(err))
    }, [artists, accessToken])

    // Render "New Releases" for Dashboard
    useEffect(() => {
        if (!newReleases) { return setNewReleases([]); }
        if (!accessToken) { return; }

        spotifyApi.getNewReleases({ limit: 10 }) 
            .then((res) => {
                setNewReleases(res.body.albums.items.map((song) => ({
                    id: song.id,
                    image: song.images[0].url,
                    title: song.name,
                    artist: song.artists[0].name,
                    uri: song.uri,
                })))
            })
            .catch((err) => console.log(err))

    }, [newReleases, accessToken])
    
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
            {/* Header Part */}
            <Header className="app-header">
                {/* Logo */}
                <Logo />

                {/* Search Part */}
                <div className='search-part-wrapper'>
                    <input 
                        type="search" 
                        placeholder="Search songs..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="search-song-bar"
                    />       
                    <PopperWrapper>
                        {searchResults.map(track => (
                            <TrackSearchDisplay track={track} key={track.uri} chooseTrack={chooseTrack}/>
                        ))}
                    </PopperWrapper>

                    {/* User */}
                    <User accessToken={accessToken} spotifyApi={spotifyApi}/>
                    
                    {/* Sign Out Part */}
                    <div className="sign-out-wrapper">
                        <a className="sign-out-button" href="/">Sign Out</a>
                    </div>
                </div>
            </Header>

            
            <div className='app-container'>
                {/* Sidebar Part */}
                <Sidebar accessToken={accessToken} spotifyApi={spotifyApi}/>
                
                {/* Content Part */}

               {showLyrics ? <Lyrics lyrics={lyrics}/> : <Content>
                    {/* Trending Songs */}
                    <div className="trending-song-wrapper">
                        <h1 className="trending-song-title">Trending Songs</h1>
                        <div className="trending-song-container">
                            {songs.map((song) => (
                                <TrendingSongs song={song} key={song.uri} chooseTrack={chooseTrack}/>
                            ))}
                        </div>
                    </div>

                    {/* Top Artists */}
                    <div className="top-artists-wrapper">
                        <h1 className="top-artists-title">Top Artists</h1>
                        <div className="top-artists-container">
                            {artists.map((artist) => (
                                <TopArtists artist={artist} key={artist.id}/>
                            ))}
                        </div>
                    </div>

                    {/* New Releases */}
                    <div className="new-releases-song-wrapper">
                        <h1 className="new-releases-song-title">New Releases</h1>
                        <div className="new-releases-song-container">
                            {newReleases.map((song) => (
                                <NewReleases song={song} key={song.uri} chooseTrack={chooseTrack}/>
                            ))}
                        </div>
                    </div>
                </Content> }
            </div>

            {/* Play Part */}
            <div className='player-container'>
                <Player showLyrics={showLyrics} setShowLyrics={setShowLyrics} spotifyApi={spotifyApi} accessToken={accessToken} trackUri={playingTrack?.uri}/>
            </div>
            
        </>
    )
}

export default Mainpage;