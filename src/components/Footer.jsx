import { socials } from "../constants";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white font-sans">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 flex flex-col gap-12">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Info */}
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold text-white tracking-wide">Venera</h1>
            <p className="text-gray-400 leading-relaxed">
              Elevate your experience with modern solutions for web, gaming, and digital automation.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold mb-2">Explore</h2>
            <ul className="text-gray-400 space-y-1">
              <li><a href="#home" className="hover:text-white transition-all duration-300">Home</a></li>
              <li><a href="#about" className="hover:text-white transition-all duration-300">About</a></li>
              <li><a href="#products" className="hover:text-white transition-all duration-300">Products</a></li>
              <li><a href="#contact" className="hover:text-white transition-all duration-300">Contact</a></li>
            </ul>
          </div>

          {/* Socials */}
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold mb-2">Connect With Us</h2>
            <div className="flex gap-4 items-center">
              {socials.map((social, index) => (
                <a
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:scale-110 transition-transform duration-300"
                >
                  <img src={social.iconUrl} alt={social.name} className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">&copy; {currentYear} Qarvo Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
