import './App.css'
import {
  createHashRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  Outlet,
  redirect,
} from "react-router-dom";
import App from './views/Apps';

const router = createHashRouter(
  createRoutesFromElements(
    <Route
      path="/"
    >
      <Route
        path=""
        loader={() => {
          throw redirect("/apps");
        }}
      />
      <Route
        path="/apps"
        element={<Outlet />}
      >
        <Route path="" element={<App />} />
        <Route path=":appId" element={<App />} />
      </Route>
    </Route>
  )
);


function Entry() {
  return (
    <RouterProvider router={router} />
  )
}

export default Entry
