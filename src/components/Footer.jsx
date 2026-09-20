import React from 'react';
import { personalInfo } from '../data/portfolioData';

export default function Footer() {
  return (
    <footer className="editorial-footer" role="contentinfo">
      <div className="container footer-content">
        <span className="footer-mark">{personalInfo.shortName}.</span>
        <span className="footer-year">© {personalInfo.editionYear}</span>
      </div>
    </footer>
  );
}
