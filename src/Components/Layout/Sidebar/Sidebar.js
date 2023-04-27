import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouseUser, faPhotoFilm, faPlus, faHeart } from "@fortawesome/free-solid-svg-icons";
import './Sidebar.css';
import { Link, useNavigate } from "react-router-dom";
import SidebarPlaylist from './SidebarPlaylist/SidebarPlaylist';

function Sidebar({ accessToken, spotifyApi }) {
    const navigate = useNavigate();
    const [updatePlaylist, setUpdatePlaylist] = useState([]); 
    
    function sendAccessTokenToLib() {
      navigate('/library',
        {
          state: accessToken,
        }
      )
    }

    function sendAccessTokenToLiked() {
      navigate('/liked', 
        {
          state: accessToken
        }
      )
    }

    function createNewPlaylist() {
      const playlist =  spotifyApi.createPlaylist('My New Playlist', { public: true });
      setUpdatePlaylist([playlist, ...updatePlaylist]);
    }

    useEffect(() => {
      if (!accessToken) {
          return;
      }
      spotifyApi.setAccessToken(accessToken)
    }, [accessToken])
    
    useEffect(() => {
      if (!updatePlaylist) { return setUpdatePlaylist([]); }
      
      const storedPlaylists = localStorage.getItem('play');
      if (storedPlaylists) {
        setUpdatePlaylist(JSON.parse(storedPlaylists));
      }

      let cancelRequest = false;
      if(accessToken) {
        spotifyApi.getUserPlaylists()
          .then((data) => {
            localStorage.setItem('play', JSON.stringify(data.body.items));
            setUpdatePlaylist(data.body.items)
          })
          .catch((error) => {
            console.log(error);
          })
          return () => cancelRequest = true;
        }
      }, [accessToken, spotifyApi])

    return (  
        <div className="sidebar-wrapper">
            <div className="sidebar-link">
                <FontAwesomeIcon className="sidebar-link_icon" icon={faHouseUser}/>
                <Link to='/dashboard' style={ { textDecoration: 'none' }}>
                    <h3 className="sidebar-link_title">Home</h3>
                </Link>
            </div>
            <div className="sidebar-link">
                <FontAwesomeIcon className="sidebar-link_icon" icon={faPhotoFilm}/>
                <a onClick={() => {sendAccessTokenToLib()}} className="sidebar-link_title">My Library</a>
            </div>
            <div className="sidebar-link">
                <FontAwesomeIcon className="sidebar-link_icon" icon={faPlus}/>
                <h3 onClick={() => {createNewPlaylist()}} className="sidebar-link_title">Create Playlist</h3>
            </div>           
            <div className="sidebar-link">
                <FontAwesomeIcon className="sidebar-link_icon" icon={faHeart}/>
                <a onClick={() => {sendAccessTokenToLiked()}} className="sidebar-link_title">Liked Songs</a>
            </div>
            <span className="sidebar-link_separate-line"></span>   
            <div className='playlist-container'>
              {
                updatePlaylist.map((playlist) => (
                  <SidebarPlaylist accessToken={accessToken} playlist={playlist}/>
                ))
              }
            </div>
        </div>
    );
}

export default Sidebar;