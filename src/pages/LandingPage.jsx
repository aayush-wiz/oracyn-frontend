import React, { useEffect } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Hero from "./landing/Hero";
import Features from "./landing/Features";
import ChartsSlider from "./landing/ChartsSlider";
import CallToAction from "./landing/CallToAction";


const LandingPage = () => {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <React.Fragment>
      <div className="illuminated-grid"></div>
      <Header />
      <main>
        <Hero />
        <Features />
        <ChartsSlider />
        <CallToAction />
      </main>
      <Footer />
    </React.Fragment>
  );
};

export default LandingPage;