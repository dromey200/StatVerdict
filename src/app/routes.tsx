import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ScannerPage } from './components/ScannerPage';
import { TutorialPage } from './components/TutorialPage';
import { RatingGuide } from './components/RatingGuide';
import { HistoryPage } from './components/HistoryPage';
import { NotFound } from './components/NotFound';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      Component: Layout,
      children: [
        { index: true, Component: ScannerPage },
        { path: 'tutorial', Component: TutorialPage },
        { path: 'guide', Component: RatingGuide },
        { path: 'history', Component: HistoryPage },
        { path: '*', Component: NotFound },
      ],
    },
  ],
  {
    basename: '/diablo-4-scanner',
  },
);