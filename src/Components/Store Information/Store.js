// Contain our client Id, URL,.. information
var clientId = "d96cbc9c41924effafdd99cb86e163b0";
var redirectPage = "http://localhost:3000/";

export const AUTHORIZE = 
`https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectPage}&scope=streaming
    %20user-read-currently-playing
    %20user-read-email
    %20user-read-recently-played
    %20user-read-playback-state
    %20user-top-read
    %20user-modify-playback-state
    %20user-read-private
    %20user-library-read
    %20user-library-modify
    %20playlist-modify-public
    %20playlist-modify-private
    %20playlist-read-private
`;



                        