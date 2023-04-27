import Mainpage from "../Components/Dashboard Page/Mainpage";
import Liked from '../pages/Liked/index';
import Playlist from '../pages/Playlist/index'

const publicRoutes = [];

const privateRoutes = [
    {
        path: '/dashboard',
        component: Mainpage,
    },
    {
        path: '/liked',
        component: Liked,
    },
    {
        path: './playlist',
        component: Playlist,
    },
];

export { publicRoutes, privateRoutes };

