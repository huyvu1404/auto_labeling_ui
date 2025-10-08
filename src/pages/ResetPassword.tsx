import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const BACKEND_ENDPOINT = import.meta.env.VITE_BACKEND_ENDPOINT;

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Xác thực token khi component mount
  useEffect(() => {
    const verifyToken = async () => {
      const params = new URLSearchParams(location.search);
      const emailParam = params.get("email");
      const tokenParam = params.get("token");

      setEmail(emailParam || "");
      setToken(tokenParam || "");

      try {
        const response = await fetch(
          `${BACKEND_ENDPOINT}/api/users/verify-reset-token?email=${emailParam}&token=${tokenParam}`
        );

        if (!response.ok) {
          alert("Invalid or expired URL!");
          navigate("/login");
          return;
        }

        setIsVerified(true);
      } catch (error) {
        alert("An error occurred. Please try again later.");
        navigate("/login");
      }
    };

    verifyToken();
  }, [location, navigate]);

  const handleReset = async () => {
    if (!newPassword) {
      alert("Please enter a new password.");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_ENDPOINT}/api/users/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          token,
          new_password: newPassword,
        }),
      });

      if (response.ok) {
        alert("Password reset successfully!");
        navigate("/login");
      } else {
        const err = await response.json();
        alert(err.message || "Failed to reset password.");
      }
    } catch (err) {
      alert("Error occured.");
      navigate("/login");
    }
  };

  return (
    isVerified && (
      <div className="max-w-sm mx-auto mt-20">
        <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
        <input
          type="password"
          placeholder="New password"
          className="border px-2 py-1 rounded w-full mb-2"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button
          onClick={handleReset}
          className="bg-blue-600 text-white py-2 rounded w-full hover:bg-blue-700"
        >
          Change password
        </button>
      </div>
    )
  );
}
