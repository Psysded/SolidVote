import {createBrowserRouter} from "react-router-dom";
import Home from '../pages/Home';
import Vote from '../pages/Vote';
import CreateAPoll from "../pages/CreateAPoll";
import PollsResults from "../pages/PollsResults";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home/>,
    },
    {
        path: "/vote",
        element: <Vote/>,
    },
    {
        path: "/vote/:id",
        element: <Vote/>
    },
    {
        path: "/create-a-poll",
        element: <CreateAPoll/>
    },
    {
        path: "/polls-results",
        element: <PollsResults/>
    }
]);

export default router;
