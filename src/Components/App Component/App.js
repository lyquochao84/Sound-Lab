import React, { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../Login Page/Login';
import Mainpage from '../pages/Dashboard Page/Mainpage';
import Liked from '../pages/Liked/Liked';
import Library from '../pages/Library/Library';

import Playlist from '../Playlist/Playlist';

const code = new URLSearchParams(window.location.search).get('code');

function App() {
  return (
    <Fragment>
      <Router>
        <Routes> 
          <Route path="/" element={code ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/dashboard" element={code ? <Mainpage code={code} /> : <Navigate to="/" />} />
          <Route path="/liked" element={<Liked/>} />
          <Route path="/library" element={<Library />} />
          <Route path="/playlist/:playlistId" element={<Playlist />} />
        </Routes>
      </Router>
    </Fragment>
  );
}

export default App;
