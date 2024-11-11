import React, { useState, useEffect } from "react";
import { Lock, Mail, Check, RefreshCw } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    email: "",
    verificationCode: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [verifyCode, setVerifyCode] = useState(null);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (step === 2 && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }

    return () => clearInterval(timer);
  }, [step, countdown]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const sendVerificationCode = async (email) => {
    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/forgot-password`;

    try {
      const response = await axios.post(URL, { email });

      if (response.data.error === false) {
        toast.success(response.data.message);
        setVerifyCode(response.data.verifyCode);
        setCountdown(30);
        setCanResend(false);
        return true;
      } else {
        toast.error(response.data.message);
        return false;
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return false;
    }
  };

  const handleEmailVerification = async (e) => {
    e.preventDefault();
    const success = await sendVerificationCode(data.email);
    if (success) {
      setStep(2);
    }
  };

  const handleResendCode = async () => {
    if (canResend) {
      await sendVerificationCode(data.email);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    // Validasi password
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/reset-password`;

    try {
      const response = await axios.post(URL, {
        email: data.email,
        verificationCode: data.verificationCode,
        newPassword: data.newPassword,
      });

      if (response.data.error === false) {
        toast.success(response.data.message);
        navigate("/email");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-primary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-primary-900">
              {step === 1 ? "Forgot Password" : "Reset Password"}
            </h2>
            <p className="text-primary-600">
              {step === 1
                ? "Enter your email to reset password"
                : "Create a new secure password"}
            </p>
          </div>

          {step === 2 && verifyCode && (
            <div className="bg-blue-50 p-4 rounded-lg text-center mb-4">
              <p className="text-blue-800 font-semibold mb-2">
                Verification Code
              </p>
              <div className="flex justify-center items-center space-x-2">
                <span className="text-2xl font-bold text-blue-900 tracking-widest">
                  {verifyCode}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(verifyCode);
                    toast.success("Code copied to clipboard");
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Check size={20} />
                </button>
              </div>
              <p className="text-sm text-blue-600 mt-2">
                Code will expire in {countdown} seconds
              </p>
            </div>
          )}

          <form
            className="space-y-6"
            onSubmit={
              step === 1 ? handleEmailVerification : handlePasswordReset
            }
          >
            <div className="space-y-5">
              {step === 1 ? (
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-primary-800 mb-2"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400"
                      size={20}
                    />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter your email"
                      value={data.email}
                      onChange={handleOnChange}
                      required
                      className="w-full px-4 pl-12 py-2.5 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder:text-primary-300"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <label
                      htmlFor="verificationCode"
                      className="block text-sm font-medium text-primary-800 mb-2"
                    >
                      Verification Code
                    </label>
                    <div className="relative">
                      <Check
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400"
                        size={20}
                      />
                      <input
                        type="text"
                        id="verificationCode"
                        name="verificationCode"
                        placeholder="Enter verification code"
                        value={data.verificationCode}
                        onChange={handleOnChange}
                        required
                        className="w-full px-4 pl-12 py-2.5 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder:text-primary-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="newPassword"
                      className="block text-sm font-medium text-primary-800 mb-2"
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400"
                        size={20}
                      />
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        placeholder="Enter new password"
                        value={data.newPassword}
                        onChange={handleOnChange}
                        required
                        className="w-full px-4 pl-12 py-2.5 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder:text-primary-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-primary-800 mb-2"
                    >
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400"
                        size={20}
                      />
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Confirm new password"
                        value={data.confirmPassword}
                        onChange={handleOnChange}
                        required
                        className="w-full px-4 pl-12 py-2.5 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder:text-primary-300"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="space-y-4">
              <button
                type="submit"
                className="w-full bg-primary-900 text-white py-3 px-4 rounded-lg hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all text-sm font-medium shadow-sm hover:shadow-md"
              >
                {step === 1 ? "Send Verification Code" : "Reset Password"}
              </button>
              {step === 2 && (
                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={!canResend}
                    className={`w-full py-3 px-4 rounded-lg transition-all text-sm font-medium ${
                      canResend
                        ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Resend Code
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="ml-2 w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-all text-sm font-medium"
                  >
                    Back
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;