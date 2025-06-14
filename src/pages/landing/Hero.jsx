// pages/landing/Hero.jsx
import React from "react";
import AnimatedWrapper from "../../components/common/AnimatedWrapper";
import LuminousText from "../../components/common/LuminousText";

const Hero = () => (
  <section className="relative pt-32 pb-20 text-center min-h-screen flex items-center justify-center overflow-hidden">
    <div className="container mx-auto px-6 relative z-10">
      <AnimatedWrapper>
        <div className="relative inline-block">
          <div
            className="sparkle"
            style={{ top: "10%", left: "-20%", animationDelay: "0s" }}
          ></div>
          <div
            className="sparkle"
            style={{ top: "80%", left: "0%", animationDelay: "1s" }}
          ></div>
          <div
            className="sparkle"
            style={{ top: "20%", left: "110%", animationDelay: "2s" }}
          ></div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4 leading-tight">
            <LuminousText text="Transform Documents" />
            <br />
            <LuminousText text="into Conversations" />
          </h1>
        </div>
      </AnimatedWrapper>
      <AnimatedWrapper customClass="delay-200">
        <p className="max-w-2xl mx-auto text-lg text-gray-400 mb-8">
          Upload any document and chat with it using AI. Generate insights,
          create charts, and unlock the hidden potential of your data.
        </p>
      </AnimatedWrapper>
      <AnimatedWrapper customClass="delay-400">
        <div className="flex justify-center">
          <button className="hero-button bg-gray-700 hover:bg-gray-600 text-white font-bold text-lg px-8 py-4 rounded-full shadow-lg transition-all duration-300">
            Start Chatting →
          </button>
        </div>
      </AnimatedWrapper>
    </div>
  </section>
);

export default Hero;
