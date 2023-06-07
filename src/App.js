import {createHashRouter, Navigate} from "react-router-dom";
import Index from "./components/Index";
import Events from "./components/Events";
import Gallery from "./components/Gallery";
import News from "./components/News";
import New from "./components/New";
import Podcasts from "./components/Podcasts";
import Podcast from "./components/Podcast";
import Testimonies from "./components/Testimonies";
import Testimony from "./components/Testimony";
import Event from "./components/Event";
import Login from "./components/AuthPages/SignInSide";
import SignUp from "./components/AuthPages/SignUp";
import Dashboard from "./components/Dashboard";
import Users from "./components/Users";
import Sponsors from "./components/Sponsors";
import Chapters from "./components/Chapters";
import Landing from "./components/Landing";
import RequireAuth from './components/RequireAuth';
// import Redirect from './components/Redirect';

const ROLES = {
  'User': 'user',
  'Editor': 'editor',
  'Admin': 'admin'
}

const App = createHashRouter([
  {
    index: 'true',
    path:'login',
    element: <Login/>
  },
  {
    path:'register',
    element: <SignUp/>
  },
  {
    element: <RequireAuth/>,
    children: [
      {
        path: '/',
        children: [
          {
            path:'admin',
            element: <Index/>,
            children: [
              {
                index: true,
                path:'dashboard',
                element: <Dashboard/>
              },
              {
                path:'events',
                element: <Events/>
              },
              {
                path:'podcast',
                element: <Podcasts/>
              },
              {
                path:'podcast/:id',
                element: <Podcast/>
              },
              {
                path:'testimonies',
                element: <Testimonies/>
              },
              {
                path:'testimony/:id',
                element: <Testimony/>
              },
              {
                path:'gallery',
                element: <Gallery/>
              },
              {
                path:'news',
                element: <News/>
              },
              {
                path:'news/:id',
                element: <New/>
              },
              {
                path:'event/:event_name',
                element: <Event/>
              },
              {
                path:'users',
                element: <Users/>
              },
              {
                path:'sponsors',
                element: <Sponsors/>
              },
              {
                path:'chapters',
                element: <Chapters/>
              }
            ]
          }
        ]
      },
      {
        path: '*',
        element: <Landing/>
      }
    ]
  }
])

export default App;
