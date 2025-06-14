// pages/SignupPage.jsx
import React from "react";
import { OracynLogo } from "../components/ui/Icons";
import FormInput from "../components/common/FormInput";
import { UserIcon, MailIcon, LockIcon } from "../components/ui/Icons";

const SignupPage = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      {/* Background Grid */}
      <div className="illuminated-grid"></div>

      <div className="w-full max-w-md p-8 space-y-8 bg-gray-900/90 backdrop-blur-lg rounded-2xl border border-gray-700/30 shadow-2xl shadow-black/50">
        <div className="flex flex-col items-center text-center">
          <OracynLogo />
          <h2 className="mt-6 text-3xl font-bold text-white">
            Create an Account
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Start your journey with Oracyn
          </p>
        </div>

        <form className="space-y-6">
          <FormInput
            id="fullname"
            type="text"
            placeholder="Full Name"
            icon={<UserIcon />}
          />
          <FormInput
            id="email"
            type="email"
            placeholder="Email Address"
            icon={<MailIcon />}
          />
          <FormInput
            id="password"
            type="password"
            placeholder="Password"
            icon={<LockIcon />}
          />

          <button
            type="submit"
            className="hero-button w-full bg-gray-700 hover:bg-gray-600 text-white font-bold text-base py-3 rounded-lg shadow-lg transition-all duration-300"
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-medium text-gray-300 hover:text-white transition-colors"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
