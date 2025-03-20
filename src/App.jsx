import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CommentsPage from "./pages/CommentsPage";
import ErrorPage from "./pages/ErrorPage";
import { AuthProvider } from "./context/Auth/AuthProvider";
import { CommentsProvider } from "./context/Comments/CommentsProvider";

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

  return (
    <AuthProvider>
      <CommentsProvider>
        <RouterProvider router={router} />
      </CommentsProvider>
    </AuthProvider>
  );
}
