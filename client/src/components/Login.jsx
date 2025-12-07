import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";

export default function Login() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    if (!form.username.trim() || !form.password.trim()) {
      alert("Please fill in all fields");
      return;
    }
    if (form.password.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert(errorText);
        return;
      }

      const result = await response.json();
      
      if (isLogin) {
        // Store user info in localStorage
        localStorage.setItem("userId", result._id);
        localStorage.setItem("username", result.username);
        navigate("/client-manager");
      } else {
        // Switch to login mode after successful registration
        setIsLogin(true);
        setForm({ username: "", password: "" });
        alert("Account created successfully! Please log in.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  }

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4 text-center">
          {isLogin ? "Login" : "Create Account"}
        </h2>
        
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
              placeholder="Enter username"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
              placeholder="Enter password (min 8 chars)"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
          >
            {isLogin ? "Login" : "Create Account"}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            {isLogin ? "Need an account? Create one" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
}
