import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { Home } from "../Pages/Home";
import { Sort } from "../Pages/Algs/Sort";
import { Tree } from "../Pages/Algs/Tree";
import { Searching } from "../Pages/Algs/Searching";
import { Matrix } from "../Pages/Algs/Matrix";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children:[
            {path: "/", element: <Home/>},
            {path: "/sorting", element: <Sort/>},
            {path: "/tree", element: <Tree/>},
            {path: "/searching", element: <Searching/>},
            {path: "/matrix", element: <Matrix/>},
        ],
    },
]);