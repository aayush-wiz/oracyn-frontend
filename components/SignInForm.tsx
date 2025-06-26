"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TextGenerateEffect } from "./ui/text-generate-effect";

const Signin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md ">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-4xl">
            <TextGenerateEffect duration={2} words="Join Oracyn Today" />
          </h1>

          <TextGenerateEffect
            filter={false}
            duration={1}
            words=" Start your journey right away"
          />
        </div>

        {/* Form */}
        <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-8 shadow-2xl">
          <div className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>

            {/* Submit button */}

            <button className="w-full bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6  text-white inline-block">
              <span className="absolute inset-0 overflow-hidden rounded-full">
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-400/0 via-sky-600/90 to-sky-600/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </span>
              <div
                onClick={handleSubmit}
                className="relative flex py-2 justify-center space-x-2 items-center z-10 rounded-full bg-zinc-950 px-4 ring-1 ring-white/10 "
              >
                <span className="text-lg">Login</span>
                <svg
                  fill="none"
                  height="16"
                  viewBox="0 0 24 24"
                  width="16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.75 8.75L14.25 12L10.75 15.25"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
              <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-blue-400/0 via-blue-600/90 to-blue-600/0 transition-opacity duration-500 group-hover:opacity-40" />
            </button>
          </div>

          {/* Divider */}
          <div className="mt-6 flex items-center">
            <div className="flex-1 border-t border-zinc-700"></div>
            <span className="px-4 text-sm text-gray-400">or</span>
            <div className="flex-1 border-t border-zinc-700"></div>
          </div>

          {/* Social login buttons */}
          <div className="mt-2 space-y-3">
            <button className="flex items-center justify-center cursor-pointer w-full shadow-[inset_0_0_0_2px_#616467]px-6 py-2 bg-transparent text-white rounded-lg font-bold transform hover:-translate-y-1 transition duration-400">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <div className="w-fit">Continue with Google</div>
            </button>
          </div>

          {/* Sign in link */}
          <p className="mt-6 text-center text-sm text-gray-400">
            Don&apos;t have an account?{" "}
            <button className="text-white rounded-lg font-bold transform hover:-translate-y-1 transition duration-400">
              <a
                href="/signup"
                className="text-blue-400 hover:text-blue-300 font-medium cursor-pointer"
              >
                Sign up here
              </a>
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;
