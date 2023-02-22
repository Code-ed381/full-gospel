import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import Index from "./components/Index";
import Events from "./components/Events";
import Dashboard from "./components/Dashboard";

const App = createBrowserRouter([
  {
    path: '/',
    element: <Index/>,
    children: [
      {
        path:'/events',
        element: <Events/>
      },
      {
        path:'/dashboard',
        element: <Dashboard/>
      }
    ]
  }
  //   children: [
  //     { 
  //       element: <RequireAuth allowedRoles={[2001]}/>,
  //       children:[
  //         { 
  //           path: '/dashboard',
  //           element: <Dashboard/>
  //         }
  //       ]
  //     },
  //     { 
  //       element: <RequireAuth allowedRoles={[1984]}/>,
  //       children:[
  //         { 
  //           path: 'profile',
  //           element: <Profile/>,
  //         },
  //         {
  //           path: 'students',
  //           element: <Students/>, 
  //         }
  //       ]
  //     },
  //     { 
  //       element: <RequireAuth allowedRoles={[5150]}/>,
  //       children:[
  //         {
  //           path: 'admin',
  //           element: <Admin/>, 
  //         }
  //       ]
  //     }
  //   ]
  // },
  // {
  //   path: 'login',
  //   element: <Login/>
  // },
  // {
  //   path: 'signup',
  //   element: <SignUp/>
  // },
  // {
  //   path: 'recover-password',
  //   element: <Recover/>
  // },
  // {
  //   path: 'unauthorized',
  //   element: <Unauthorized/>
  // }
])

export default App;
