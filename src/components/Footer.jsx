import { socials } from "../constants";
import Section from "./Section";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Section crosses className="!px-0 !py-16 bg-[#111] text-white font-sans">
      <div className="container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-screen-xl mx-auto px-4">
        {/* Logo & About */}
        <div>
          <div className="text-2xl font-semibold text-purple-500 mb-3">Qarvo</div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Creating products for you.
          </p>
          {/* Social Icons */}
          <div className="flex gap-4 mt-5">
            {socials.map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={social.title}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-[#222] hover:bg-[#333] transition-colors"
              >
                <img
                  src={social.iconUrl}
                  alt={social.title}
                  className="w-5 h-5"
                />
              </a>
            ))}
          </div>
        </div>

        {/* Links Section Example (Optional) */}
        <div className="footer-links">
          <h3 className="text-purple-500 text-base font-semibold mb-3">
            Company
          </h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><a href="#" className="hover:text-purple-500 transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-purple-500 transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-purple-500 transition-colors">Blog</a></li>
          </ul>
        </div>

        <div className="footer-links">
          <h3 className="text-purple-500 text-base font-semibold mb-3">
            Support
          </h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><a href="#" className="hover:text-purple-500 transition-colors">Help Center</a></li>
            <li><a href="#" className="hover:text-purple-500 transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-purple-500 transition-colors">Terms of Service</a></li>
          </ul>
        </div>

        <div className="footer-links">
          <h3 className="text-purple-500 text-base font-semibold mb-3">
            Contact
          </h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>Email: <a href="mailto:info@qarvo.com" className="hover:text-purple-500">info@qarvo.com</a></li>
            <li>Phone: +1 234 567 890</li>
            <li>Location: Pontianak, Indonesia</li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800 mt-12 pt-6 text-center text-sm text-gray-500">
        &copy; <span className="text-purple-500 font-medium">Qarvo</span> {currentYear}. All rights reserved.
      </div>
    </Section>
  );
};

export default Footer;
