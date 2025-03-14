import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useAuthContext } from "./context/AuthContext";
import CommentsPage from "./pages/CommentsPage";
import ErrorPage from "./pages/ErrorPage";

export default function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <CommentsPage />
    },
    {
      path: "*",
      element: <ErrorPage />
    }
  ]);

  return (
    <RouterProvider router={router} />
  );
}
