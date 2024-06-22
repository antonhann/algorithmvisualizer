import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { Home } from "../Pages/HomePage/Home";
export const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children:[
            {path: "", element: <Home/>}
        ],
    },
]);