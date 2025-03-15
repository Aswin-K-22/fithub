import React from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import Hero from "../components/Hero";
import Services from "../components/Services";
import ExperiencePremium from "../components/ExperiencePremium";
import AITrainer from "../components/AITrainer";
import WhyChoose from "../components/WhyChoose";
import Testimonials from "../components/Testimonials";
import CTA from "../components/CTA";

const LandingPage: React.FC = () => (
  <div className="font-sans">
    <Navbar />
    <main className="pt-16">
      <Hero />
      <Services />
      <ExperiencePremium />
      <AITrainer />
      <WhyChoose />
      <Testimonials />
      <CTA />
    </main>
    <Footer />
  </div>
);

export default LandingPage;