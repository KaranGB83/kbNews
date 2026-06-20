import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../lib/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/auth/login", form);
      setUser(data.user);
      toast.success("Welcome back!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-3xl font-extrabold mb-8 text-center">
        Welcome <span className="text-primary">Back</span>
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          className="input input-bordered w-full"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="input input-bordered w-full"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <Link to="/forgot-password" className="text-sm text-primary self-end">
          Forgot password?
        </Link>
        <button className="btn btn-primary" disabled={loading}>
          {loading ? <span className="loading loading-spinner loading-sm" /> : "Log In"}
        </button>
      </form>
      <p className="text-center text-sm mt-4 text-base-content/60">
        Don't have an account? <Link to="/signup" className="text-primary">Sign up</Link>
      </p>
    </div>
  );
};

export default LoginPage;