import { createBrowserRouter } from "react-router-dom";
import Story from "./src/Story";
import App from "./src/App";

export const router = createBrowserRouter([
  { path: "/", element: <Story /> },
  { path: "/:category", element: <Story /> },
]);
