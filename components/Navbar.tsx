"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { user, signout, isSigningOut } = useAuth();
  const router = useRouter();

  const handleSignOut = () => {
    signout(undefined, {
      onSuccess: () => {
        router.push("/signin");
      },
    });
  };

  return (
    <nav className="w-full flex justify-between items-center p-4 border-b border-zinc-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
      <Link href="/" className="text-2xl font-bold text-white">
        ORACYN
      </Link>
      <div className="flex items-center gap-4">
        {user && (
          <span className="text-zinc-400 hidden sm:block">
            Welcome, {user.username}
          </span>
        )}
        <button
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-semibold hover:bg-slate-700 transition-colors disabled:opacity-50"
        >
          {isSigningOut ? "Signing Out..." : "Sign Out"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
