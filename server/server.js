// The Application Part 
// Server will handle everything like request authorization to access data, refresh token,...

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const lyricsFinder = require("lyrics-finder");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Refresh Process
app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken;
    const spotifyApi = new SpotifyWebApi({
        redirectUri: 'https://lyquochao84.github.io/MusicStreamingPlatform/',
        clientId: 'd96cbc9c41924effafdd99cb86e163b0',
        clientSecret: '44f7a85bbac4425c9f5509a36845e1cc',
        refreshToken,
    });

    spotifyApi.refreshAccessToken()
        .then((data) => {
            res.json({
                accessToken: data.body.accessToken,
                expiresIn: data.body.expiresIn
            })
        })
        .catch(() => {
            res.sendStatus(400);
        })
});

// Login Process
app.post('/login', (req, res) => {
    const code = req.body.code;

    const spotifyApi = new SpotifyWebApi({
        redirectUri: 'https://lyquochao84.github.io/MusicStreamingPlatform/',
        clientId: 'd96cbc9c41924effafdd99cb86e163b0',
        clientSecret: '44f7a85bbac4425c9f5509a36845e1cc'
    });

    spotifyApi.authorizationCodeGrant(code)
    .then((data) => {
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in,
        })
    })
    .catch((err) => {
        res.sendStatus(400);
    })
});

app.get('/lyrics', async(req, res) => {
    const lyrics = await lyricsFinder((req.query.artist, req.query.track) || "No Lyrics Found")
    res.json({ lyrics });
})

app.listen(3001);