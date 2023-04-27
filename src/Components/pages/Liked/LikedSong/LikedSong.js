import './LikedSong.css';

function LikedSong({ track, chooseTrack }) {
    function playSong() {
        chooseTrack(track);
    }

    return (
        <>
            <div 
                onClick={playSong}
                className='each-liked-song-description'
            >
                <img className='each-liked-song-image' src={track.track.album.images[0].url} />
                <div className='each-liked-song-info'>
                    <h3 className='each-liked-song-name'>{track.track.name}</h3>
                    <p className='each-liked-song-artist'>
                        {track.track.album.artists[0].name}
                    </p>
                </div>            
            </div>
        </>
    )
}

export default LikedSong;