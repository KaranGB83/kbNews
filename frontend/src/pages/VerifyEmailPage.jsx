import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../lib/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const VerifyEmailPage = () => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/auth/verify-email", { code });
      setUser(data.user);
      toast.success("Email verified!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-bold mb-2">Verify your email</h1>
      <p className="text-base-content/60 mb-6">Enter the 6-digit code we sent you</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          className="input input-bordered w-full text-center text-2xl tracking-[0.5em]"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button className="btn btn-primary" disabled={loading}>
          {loading ? <span className="loading loading-spinner loading-sm" /> : "Verify"}
        </button>
      </form>
    </div>
  );
};

export default VerifyEmailPage;