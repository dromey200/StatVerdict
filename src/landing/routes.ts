import { createBrowserRouter } from 'react-router';
import Landing from './components/Landing.tsx';
import BlogPost from './components/BlogPost.tsx';

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