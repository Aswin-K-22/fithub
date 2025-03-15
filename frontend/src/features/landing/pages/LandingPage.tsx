import React from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import Hero from "../components/Hero";
import Services from "../components/Services";

const LandingPage: React.FC = () => (
  <div className="font-sans">
    <Navbar />
    <main className="pt-16">
      <Hero />
      <Services />
      {/* Add other sections later */}
    </main>
    <Footer />
  </div>
);

export default LandingPage;