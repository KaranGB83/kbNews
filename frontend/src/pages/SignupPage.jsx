import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../lib/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const SignupPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/auth/signup", form);
      setUser(data.user);
      toast.success("Check your email for the verification code");
      navigate("/verify-email");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-3xl font-extrabold mb-8 text-center">
        Join <span className="text-primary">kbNews</span>
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          className="input input-bordered w-full"
          placeholder="Full name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
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
        <button className="btn btn-primary" disabled={loading}>
          {loading ? <span className="loading loading-spinner loading-sm" /> : "Sign Up"}
        </button>
      </form>
      <p className="text-center text-sm mt-4 text-base-content/60">
        Already have an account? <Link to="/login" className="text-primary">Log in</Link>
      </p>
    </div>
  );
};

export default SignupPage;