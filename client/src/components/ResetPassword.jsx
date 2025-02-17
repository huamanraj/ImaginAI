import React, { useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

const ResetPassword = () => {
  const { backendUrl } = useContext(AppContext);
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!token) {
      toast.error("Reset token is missing!");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long!");
      return;
    }

    setIsSubmitting(true);
    console.log("Attempting password reset with token:", token);

    try {
      const response = await axios.post(
        `${backendUrl}/api/user/reset-password`,
        {
          token,
          newPassword,
        }
      );

      console.log("Reset password response:", response.data);
      toast.success("Password reset successful!");
      navigate("/login");
    } catch (error) {
      console.error("Reset password error details:", {
        status: error.response?.status,
        data: error.response?.data,
        token: token
      });
      toast.error(error.response?.data?.message || "Password reset failed!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-center text-2xl font-semibold text-gray-700">
          Reset Password
        </h2>
        <form onSubmit={handleResetPassword}>
          <input
            type="password"
            placeholder="New Password"
            className="w-full p-2 border rounded mt-4"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full p-2 border rounded mt-4"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full ${isSubmitting ? "bg-gray-400" : "bg-blue-600"} text-white p-2 rounded mt-4`}
          >
            {isSubmitting ? (
              <span>
                <span className="inline-block w-4 h-4 mr-2 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                Resetting...
              </span>
            ) : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
