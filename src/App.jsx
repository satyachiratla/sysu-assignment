import { Toaster } from "react-hot-toast";
import Navbar from "./Navbar";
import Popular from "./Popular";
import Story from "./Story";
import { RouterProvider } from "react-router-dom";
import { router } from "../routes";

function App() {
  return (
    <div className="header">
      <Navbar />
      <Toaster />
      <RouterProvider router={router} />
      {/* <Popular /> */}
      <Story />
    </div>
  );
}

export default App;
