import Section from "./Section";

const Footer = () => {
  return (
    <Section crosses className="!px-0 !py-0">
      <footer className="bg-black text-white py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="footer-about">
            <div className="text-2xl font-bold text-color-1 mb-4">Qarvo</div>
            <p className="text-white mb-6">Creating innovative products for you.</p>
            {/* Social icons removed */}
          </div>

          {/* Quick Links */}
          <div className="footer-links">
            <h3 className="text-lg font-semibold text-color-1 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#hero" className="text-white hover:text-color-1 transition-colors">Home</a></li>
              <li><a href="#how-to-use" className="text-white hover:text-color-1 transition-colors">How to use</a></li>
              <li><a href="#pricing" className="text-white hover:text-color-1 transition-colors">Pricing</a></li>
              <li><a href="#roadmap" className="text-white hover:text-color-1 transition-colors">RoadMap</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="footer-links">
            <h3 className="text-lg font-semibold text-color-1 mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-white hover:text-color-1 transition-colors">Blog</a></li>
              <li><a href="#" className="text-white hover:text-color-1 transition-colors">Documentation</a></li>
              <li><a href="#" className="text-white hover:text-color-1 transition-colors">Support</a></li>
              <li><a href="#" className="text-white hover:text-color-1 transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-links">
            <h3 className="text-lg font-semibold text-color-1 mb-4">Contact</h3>
            <ul className="space-y-2">
              <li>
                <a href="mailto:Qarvo@gmail.com" className="text-white hover:text-color-1 transition-colors">
                  Qarvo@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+62082155789956" className="text-white hover:text-color-1 transition-colors">
                  +62-0821-5578-9956
                </a>
              </li>
              <li className="text-white">Asia</li>
              <li className="text-white">Jakarta, Indonesia</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-gray-800 text-center text-white">
          <p>
            <span className="font-semibold">&copy; {new Date().getFullYear()} Qarvo</span>. All rights reserved.
            <span className="block md:inline-block md:ml-4 mt-2 md:mt-0">
              <a href="#" className="hover:text-color-1 transition-colors">Privacy Policy</a> | 
              <a href="#" className="hover:text-color-1 transition-colors ml-2">Terms of Service</a> | 
              <a href="#" className="hover:text-color-1 transition-colors ml-2">Cookie Policy</a>
            </span>
          </p>
        </div>
      </footer>
    </Section>
  );
};

export default Footer;
