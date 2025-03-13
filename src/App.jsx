import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvidor } from "./context/AuthContext";
import CommentsPage from "./pages/CommentsPage";
import ErrorPage from "./pages/ErrorPage";

export default function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element:
        // CommentsPage has access to AuthContext useContext
        <AuthProvidor>
          <CommentsPage />
        </AuthProvidor>
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
