import React from "react";
import './TrackSearchDisplay.css';

function TrackSearchDisplay({ track, chooseTrack }) {
    function playSong() {
        chooseTrack(track);
    }

    return (
        <div className="each-song-container" onClick={playSong}>
            <img src={track.album} alt={track.title} />
            <div className="search-song-info">
                <h3 className="search-song-title">{track.title}</h3>
                <p className="search-song-artist">{track.artist}</p>
            </div>
        </div>
    );
}

export default TrackSearchDisplay;