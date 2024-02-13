import './App.css'
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
  Outlet
} from "react-router-dom";
import App from './views/Apps';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/apps"
      element={<Outlet />}
    >
      <Route path="" element={<App />} />
      <Route path=":appId" element={<App />} />
    </Route>
  )
);


function Entry() {
  return (
    <RouterProvider router={router} />
  )
}

export default Entry
