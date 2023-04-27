import React from 'react';
import './NewReleases.css';

function NewReleases({ song, chooseTrack }) {
    function playSong() {
        chooseTrack(song);
    }

    return (
        <div 
            key={song.id} 
            className='each-new-song-container'
            onClick={playSong}
        >
            <img 
                className='each-new-song-image'
                src={song.image} 
                alt={song.title} 
            />
            <h2 className='each-new-song-title'>{song.title}</h2>
            <p className='each-new-song-artist'>{song.artist}</p>
        </div>
    );
}

export default NewReleases;