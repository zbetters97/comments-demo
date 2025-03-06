import { AuthProvidor } from "../context/AuthContext";
import Authentication from "./Authentication";
import Comments from "./Comments";

export default function Layout() {

  return (
    // Authentication HAS ACCESS TO AuthContext useContext
    <AuthProvidor>
      <Comments />
    </AuthProvidor>
  );
}