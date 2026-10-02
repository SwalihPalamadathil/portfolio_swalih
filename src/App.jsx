import React from 'react';
import SmoothScroll from './components/SmoothScroll';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './sections/Hero';
import About from './sections/About';
import Skills from './sections/Skills';
import Work from './sections/Work';
import Experience from './sections/Experience';
import OffTheClock from './components/OffTheClock/OffTheClock';
import Contact from './sections/Contact';

export default function App() {
  return (
    <SmoothScroll>
      <div className="app-layout">
        <Navbar />
        <main id="main-content">
          <Hero />
          <About />
          <Skills />
          <Work />
          <Experience />
          <OffTheClock />
          <Contact />
        </main>
        <Footer />
      </div>
    </SmoothScroll>
  );
}
