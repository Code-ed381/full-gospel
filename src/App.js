import {createHashRouter} from "react-router-dom";
import Index from "./components/Index";
import Events from "./components/Events";
import Login from "./components/AuthPages/SignInSide";
import SignUp from "./components/AuthPages/SignUp";
import Dashboard from "./components/Dashboard";
import Users from "./components/Users";
import Sponsors from "./components/Sponsors";
import Chapters from "./components/Chapters";
import Landing from "./components/Landing";

const App = createHashRouter([
  {
    path: '/',
    children: [
      {
        path:'',
        element: <Landing/>
      },
      {
        path:'login',
        element: <Login/>
      },
      {
        path:'register',
        element: <SignUp/>
      },
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
  }
])

export default App;
