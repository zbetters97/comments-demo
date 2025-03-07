import Comments from "./pages/Comments";
import { AuthProvidor } from "./context/AuthContext";

export default function App() {

  return (
    // Authentication has access to AuthContext useContext
    <AuthProvidor>
      <Comments />
    </AuthProvidor>
  );
}
