import React from "react";
import { OracynLogo } from "../ui/Icons";

const Header = () => (
  <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/50 backdrop-blur-lg">
    <div className="container mx-auto px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <OracynLogo />
        <span className="text-xl font-bold text-white">Oracyn</span>
      </div>
      <div className="flex items-center space-x-4">
        <button className="text-slate-300 hover:text-sky-400 transition-colors">
          Sign In
        </button>
        <button className="bg-white text-slate-900 px-4 py-2 rounded-lg font-semibold hover:bg-sky-400 hover:text-white transition-all duration-300 shadow-md">
          Get Started
        </button>
      </div>
    </div>
  </header>
);

export default Header;
