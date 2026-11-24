import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../../lib/axios";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { ShieldAlert, Lock, ArrowLeft, Newspaper } from "lucide-react";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      return toast.error("Please enter email and password");
    }

    setLoading(true);
    try {
      const { data } = await axios.post("/auth/login", form);

      // Verify that the user has admin role or isAdmin flag
      if (data.user.role !== "admin" && !data.user.isAdmin) {
        // Immediately revoke session
        await axios.post("/auth/logout");
        setUser(null);
        toast.error("Access denied: You do not have administrator permissions.");
        return;
      }

      setUser(data.user);
      toast.success(`Welcome to Admin Console, ${data.user.name}!`);
      navigate("/admin");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid admin credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-base-200 border border-base-300 rounded-2xl p-8 shadow-xl">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-3">
            <ShieldAlert size={34} />
          </div>
          <span className="badge badge-warning badge-outline text-xs font-semibold uppercase tracking-wider mb-2">
            Restricted Area
          </span>
          <h1 className="text-2xl font-black tracking-tight">kbNews Admin Console</h1>
          <p className="text-sm text-base-content/60 mt-1">
            Sign in with authorized administrator credentials
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text font-medium text-xs">Admin Email</span>
            </label>
            <input
              type="email"
              className="input input-bordered w-full"
              placeholder="admin@kbnews.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              autoFocus
            />
          </div>

          <div className="form-control">
            <label className="label py-1">
              <span className="label-text font-medium text-xs">Password</span>
            </label>
            <input
              type="password"
              className="input input-bordered w-full"
              placeholder="••••••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full mt-2 gap-2"
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              <>
                <Lock size={16} /> Enter Admin Console
              </>
            )}
          </button>
        </form>

        <div className="divider my-6 text-xs text-base-content/40">OR</div>

        <div className="flex items-center justify-between text-xs text-base-content/60">
          <Link to="/" className="flex items-center gap-1 hover:text-primary transition-colors">
            <ArrowLeft size={14} /> Back to kbNews
          </Link>
          <span className="text-base-content/40">v1.0 Admin</span>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
