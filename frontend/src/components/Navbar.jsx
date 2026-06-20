import { Link, useNavigate } from "react-router-dom";
import { Newspaper, PenLine, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="bg-base-200 border-b border-base-300 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-primary">
        <Newspaper size={28} />
        kbNews
      </Link>
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <Link to="/create" className="btn btn-primary btn-sm gap-2">
              <PenLine size={16} /> Write Article
            </Link>
            <span className="text-sm text-base-content/60 hidden sm:inline">Hi, {user.name}</span>
            <button onClick={handleLogout} className="btn btn-ghost btn-sm gap-2">
              <LogOut size={16} /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost btn-sm">Log In</Link>
            <Link to="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;