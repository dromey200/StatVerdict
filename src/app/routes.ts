import { createBrowserRouter } from 'react-router';
import Landing from './components/Landing';
import BlogPost from './components/BlogPost';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Landing,
  },
  {
    path: '/updates/:slug',
    Component: BlogPost,
  },
]);
