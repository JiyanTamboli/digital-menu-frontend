import { useLocation } from "react-router-dom"; // Import hook to get current route location
import './Footer.css'; // Import custom styles for the footer

// Footer component for the website
export default function Footer() {
  const location = useLocation(); // Gets current route path

  // Do not display footer on the admin login page
  if(location.pathname === '/adminlogin'){
    return null;
  }

  // Render the footer with copyright, navigation links, and Made with ❤️ note
  return (
    <footer className="site-footer">
      <div className="footer-content">
        {/* Copyright statement */}
        <p>© 2025 Digital Menu Card. All Rights Reserved.</p>
        {/* Navigation links for footer */}
        <nav className="footer-nav">
          <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
          <span className="separator">|</span>
          <a href="/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a>
          <span className="separator">|</span>
          <a href="/contact" target="_blank" rel="noopener noreferrer">Contact Us</a>
        </nav>
        {/* Footer signature note */}
        <p className="footer-made">Made with ❤️</p>
      </div>
    </footer>
  );
}
