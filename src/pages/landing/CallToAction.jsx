// pages/landing/CallToAction.jsx
import React from "react";
import AnimatedWrapper from "../../components/common/AnimatedWrapper";

const CallToAction = () => (
  <section className="py-20 relative">
    <div className="container mx-auto px-6">
      <AnimatedWrapper>
        <div className="relative p-12 rounded-3xl text-center overflow-hidden bg-gray-900/90 border border-gray-700/30 shadow-2xl shadow-black/50">
          <div className="absolute inset-0 -z-10 [mask-image:radial-gradient(100%_100%_at_50%_20%,#000_20%,transparent_100%)]">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 via-gray-900 to-black"></div>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Documents?
          </h2>
          <p className="max-w-xl mx-auto text-gray-300 mb-8">
            Join thousands of users who are already unlocking insights from
            their documents.
          </p>
          <button className="hero-button bg-white text-black font-bold text-lg px-8 py-4 rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300">
            Get Started Free
          </button>
        </div>
      </AnimatedWrapper>
    </div>
  </section>
);

export default CallToAction;
