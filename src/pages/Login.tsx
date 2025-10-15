import { useAuth } from "@/hooks/use-auth";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const BACKEND_ENDPOINT = import.meta.env.VITE_BACKEND_ENDPOINT;

export default function Login() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);       // loading khi login
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showForgot, setShowForgot] = useState(false); // hiển thị form forgot password
  const [forgotEmail, setForgotEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);   // loading khi submit forgot password

  const handleForgetPassword = async (email: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${BACKEND_ENDPOINT}/api/users/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        alert("A reset link has been sent to your email!");
        setShowForgot(false);
        setForgotEmail("");
      } else {
        const err = await response.json();
        alert(err.message || "Failed to send reset link.");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isAuthenticated = localStorage.getItem("token");
  if (isAuthenticated) {
    return <Navigate to="/upload" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const loginSuccess = await login(username, password);
    if (loginSuccess) {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return <Navigate to="/upload" replace />;
    }
    setLoading(false);
  };

  return (
    <>
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-screen space-y-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="text-blue-600">Loading...</span>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded shadow-md w-80 space-y-4"
          >
            <h1 className="text-xl font-bold text-center">Login</h1>

            {/* Form login */}
            {!showForgot && (
              <>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  Login
                </button>
                <button
                  type="button"
                  className="w-full bg-gray-200 text-blue-600 py-2 rounded hover:bg-gray-300"
                  onClick={() => setShowForgot(true)}
                >
                  Forgot Password?
                </button>
              </>
            )}

            {/* Form forgot password */}
            {showForgot && (
              <>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />

                <button
                  type="button"
                  onClick={() => handleForgetPassword(forgotEmail)}
                  disabled={isLoading}
                  className={`w-full py-2 rounded text-white ${
                    isLoading
                      ? "bg-green-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Sending...</span>
                    </div>
                  ) : (
                    "Submit"
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowForgot(false)}
                  className="w-full bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </>
            )}
          </form>
        </div>
      )}
    </>
  );
}
