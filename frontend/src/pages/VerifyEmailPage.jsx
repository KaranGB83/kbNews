import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../lib/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const COOLDOWN_SECONDS = 60;

const VerifyEmailPage = () => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0); 
  const timerRef = useRef(null);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  // Countdown timer — ticks every second while cooldown > 0
  useEffect(() => {
    if (cooldown <= 0) return;

    timerRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [cooldown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!code.trim()) return toast.error("Please enter the verification code");
    setLoading(true);
    try {
      const { data } = await axios.post("/auth/verify-email", { code });
      setUser(data.user);
      toast.success("Email verified!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid or expired code");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || resending) return;
    setResending(true);
    try {
      await axios.post("/auth/resend-verification");
      toast.success("New code sent — check your inbox");
      setCode(""); // clear old input
      setCooldown(COOLDOWN_SECONDS); // start the 60s timer
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend code");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-bold mb-2">Verify your email</h1>
      <p className="text-base-content/60 mb-6">
        Enter the 6-digit code we sent to your email
      </p>

      <form onSubmit={handleVerify} className="flex flex-col gap-4">
        <input
          className="input input-bordered w-full text-center text-2xl tracking-[0.5em]"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} // digits only
          placeholder="000000"
        />
        <button className="btn btn-primary" disabled={loading || code.length !== 6}>
          {loading ? <span className="loading loading-spinner loading-sm" /> : "Verify"}
        </button>
      </form>

      {/* Resend section */}
      <div className="mt-6 flex flex-col items-center gap-2">
        <p className="text-sm text-base-content/50">Didn't receive a code?</p>
        <button
          onClick={handleResend}
          disabled={cooldown > 0 || resending}
          className="btn btn-ghost btn-sm"
        >
          {resending ? (
            <span className="loading loading-spinner loading-xs" />
          ) : cooldown > 0 ? (
            `Resend in ${cooldown}s`
          ) : (
            "Resend Code"
          )}
        </button>
      </div>
    </div>
  );
};

export default VerifyEmailPage;