function PlaylistSongs({ track, chooseTrack }) {
    function playSong() {
        chooseTrack(track);
    }

    return (
        <>
            <div onClick={playSong} className="each-playlist-track-wrapper">
                <img className="each-playlist-track-image" src={track.track.album.images[0].url}/>
                <div className="each-playlist-track-info">
                    <h3 className="each-playlist-track-name">{track.track.name}</h3>
                    <p className="each-playlist-track-artist">{track.track.artists[0].name}</p>
                </div>
            </div>   
        </>
    );
}

export default PlaylistSongs;