import React from "react";
import { useNavigate } from "react-router-dom";
import './SidebarPlaylist.css';

function SidebarPlaylist({ accessToken, playlist }) {
    const navigate = useNavigate();
    const newPlaylistId = playlist.id;

    function accessCodePlaylist() {
        navigate(`/playlist/${newPlaylistId}`, 
            {
                state: accessToken,
                playlistId: newPlaylistId,
            }
        )
    }

    return (
        <ul className='each-playlist-wrapper'>
            <li className='each-playlist-children' key={playlist.id}>
                <a onClick={() => {accessCodePlaylist()}} className='each-playlist-name'>{playlist.name}</a>
            </li>
        </ul>
    );
}

export default SidebarPlaylist;