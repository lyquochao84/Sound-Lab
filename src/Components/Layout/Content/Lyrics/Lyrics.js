import './Lyrics.css';

function Lyrics({ lyrics }) {
    return (
        <div className='lyrics-container'>
            <pre className='lyrics-text'>{lyrics || 'No Lyrics Found'}</pre>
        </div>
    );
}

export default Lyrics;