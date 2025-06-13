import React from "react";
import AnimatedWrapper from "../../components/common/AnimatedWrapper";
import {
  MultiFormatIcon,
  AIPoweredIcon,
  LightningFastIcon,
  SecurePrivateIcon,
} from "../../components/ui/Icons";
import LuminousText from "../../components/common/LuminousText";


const Features = () => {
  const features = [
    {
      icon: <MultiFormatIcon />,
      title: "Multi-Format Support",
      description: "Upload PDFs, Word docs, images, and more.",
    },
    {
      icon: <AIPoweredIcon />,
      title: "AI-Powered Analysis",
      description: "Advanced understanding of your document content.",
    },
    {
      icon: <LightningFastIcon />,
      title: "Lightning Fast",
      description: "Process documents in seconds, not minutes.",
    },
    {
      icon: <SecurePrivateIcon />,
      title: "Secure & Private",
      description: "Your data is encrypted and never stored.",
    },
  ];
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-6">
        <AnimatedWrapper>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white">Powerful Features</h2>
            <p className="text-lg text-slate-400 mt-2">
              Everything you need to make your documents intelligent and
              interactive
            </p>
          </div>
        </AnimatedWrapper>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((f) => (
            <AnimatedWrapper key={f.title}>
              <div className="bg-slate-800/20 backdrop-blur-lg p-8 rounded-2xl border border-slate-700/50 transition-all duration-300 h-full">
                <div className="inline-block p-4 bg-slate-700/50 rounded-xl mb-4">
                  {f.icon}
                </div>
                <h3 className="text-2xl font-semibold text-white mb-2">
                  <LuminousText text={f.title} />
                </h3>
                <p className="text-slate-400">{f.description}</p>
              </div>
            </AnimatedWrapper>
          ))}
        </div>
      </div>
    </section>
  );
};


export default Features;