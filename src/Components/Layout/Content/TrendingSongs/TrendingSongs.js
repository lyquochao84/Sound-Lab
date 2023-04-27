import './TrendingSongs.css';

function TrendingSongs({ song, chooseTrack }) {
    function playSong() {
        chooseTrack(song);
    }

    return (
        <div className='each-trending-song-container' 
            key={song.uri} 
            onClick={playSong}
        >
            <img 
                className='each-trending-song-image' 
                src={song.image} 
                alt={song.title}
            />
            <h2 className="each-trending-song-name">{song.title}</h2>
            <p className="each-trending-song-artist">{song.artist}</p>
        </div>
    );
}

export default TrendingSongs;