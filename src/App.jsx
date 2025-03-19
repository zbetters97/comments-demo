import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CommentsPage from "./pages/CommentsPage";
import ErrorPage from "./pages/ErrorPage";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <CommentsPage />,
      errorElement: <ErrorPage />,
    },
    {
      path: "*",
      element: <CommentsPage />,
    },
  ]);

  return <RouterProvider router={router} />;
}
