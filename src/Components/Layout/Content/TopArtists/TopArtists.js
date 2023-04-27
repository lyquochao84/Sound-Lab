import React from 'react';
import './TopArtists.css';

function TopArtists({ artist }) {
    return (
        <div key={artist.id} className='each-artist-container'>
            <img 
                src={artist.image}
                alt={artist.artist}
                className='each-artist-image'
            />
            <p className='each-artist-name'>{artist.artist}</p>
        </div>
    );
}

export default TopArtists;