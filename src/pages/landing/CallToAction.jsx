import React from "react";
import AnimatedWrapper from "../../components/common/AnimatedWrapper";

const CallToAction = () => (
  <section className="py-20 relative">
    <div className="container mx-auto px-6">
      <AnimatedWrapper>
        <div className="relative p-12 rounded-3xl text-center overflow-hidden bg-slate-900/50 border border-sky-500/20 shadow-2xl shadow-sky-900/20">
          <div className="absolute inset-0 -z-10 [mask-image:radial-gradient(100%_100%_at_50%_20%,#000_20%,transparent_100%)]">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-900/50 via-slate-900 to-slate-900"></div>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Documents?
          </h2>
          <p className="max-w-xl mx-auto text-sky-200 mb-8">
            Join thousands of users who are already unlocking insights from
            their documents.
          </p>
          <button className="hero-button bg-white text-sky-600 font-bold text-lg px-8 py-4 rounded-full shadow-lg">
            Get Started Free
          </button>
        </div>
      </AnimatedWrapper>
    </div>
  </section>
);

export default CallToAction;
