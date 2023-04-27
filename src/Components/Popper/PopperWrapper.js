import React from "react";
import './PopperWrapper.css';

function PopperWrapper({ children }) {
    return (
        <div className="search-song-wrapper">
            {children}
        </div>
    );
}

export default PopperWrapper;