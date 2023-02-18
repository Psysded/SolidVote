import { RouterProvider } from "react-router-dom";
import Routes from "./Routes";

const App = (): JSX.Element => {
    return (
        <RouterProvider router={Routes} />
    );
}

export default App;