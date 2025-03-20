import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CommentsPage from "./pages/CommentsPage";
import ErrorPage from "./pages/ErrorPage";
import { AuthProvider } from "./context/AuthProvider";
import { CommentsProvider } from "./context/CommentsProvider";

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
