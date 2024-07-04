import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { Home } from "../Pages/HomePage/Home";
import { Sort } from "../Pages/SortPage/Sort";
import { Tree } from "../Pages/TreePage/Tree";
import { Searching } from "../Pages/Searching/Searching";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children:[
            {path: "/", element: <Home/>},
            {path: "/sorting", element: <Sort/>},
            {path: "/tree", element: <Tree/>},
            {path: "/searching", element: <Searching/>},
        ],
    },
]);