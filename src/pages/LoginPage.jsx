// pages/LoginPage.jsx
import React from "react";
import { OracynLogo } from "../components/ui/Icons";
import FormInput from "../components/common/FormInput";
import { UserIcon, LockIcon } from "../components/ui/Icons";

const LoginPage = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      {/* Background Grid */}
      <div className="illuminated-grid"></div>

      <div className="w-full max-w-md p-8 space-y-8 bg-gray-900/90 backdrop-blur-lg rounded-2xl border border-gray-700/30 shadow-2xl shadow-black/50">
        <div className="flex flex-col items-center text-center">
          <OracynLogo />
          <h2 className="mt-6 text-3xl font-bold text-white">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-400">
            Sign in to continue to Oracyn
          </p>
        </div>

        <form className="space-y-6">
          <FormInput
            id="email"
            type="email"
            placeholder="Email Address"
            icon={<UserIcon />}
          />
          <FormInput
            id="password"
            type="password"
            placeholder="Password"
            icon={<LockIcon />}
          />

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-white focus:ring-gray-500"
              />
              <label htmlFor="remember-me" className="ml-2 block text-gray-300">
                Remember me
              </label>
            </div>
            <a
              href="#"
              className="font-medium text-gray-300 hover:text-white transition-colors"
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="hero-button w-full bg-gray-700 hover:bg-gray-600 text-white font-bold text-base py-3 rounded-lg shadow-lg transition-all duration-300"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="font-medium text-gray-300 hover:text-white transition-colors"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
