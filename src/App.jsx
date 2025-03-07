import Comments from "./pages/Comments";
import { AuthProvidor } from "./context/AuthContext";

export default function App() {

  return (
    // Authentication HAS ACCESS TO AuthContext useContext
    <AuthProvidor>
      <Comments />
    </AuthProvidor>
  );
}
