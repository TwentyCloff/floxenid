import { useState } from 'react';

const Navbar = () => {
  return (
    <nav className="bg-[#0E0E10] text-white border-b border-gray-800 fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left section */}
          <div className="flex items-center space-x-8">
            <Logo />
            <ProductsMenu />
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-6">
            <DiscordIcon />
            <SignUpButton />
          </div>
        </div>
      </div>
    </nav>
  );
};

const Logo = () => {
  return (
    <div className="flex-shrink-0 flex items-center">
      <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
        once ui
      </span>
    </div>
  );
};

const ProductsMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative hidden md:block">
      <button
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
      >
        Products
      </button>

      {/* Mega Menu Dropdown */}
      {isOpen && (
        <div
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          className="absolute left-0 mt-2 w-[600px] rounded-lg shadow-lg bg-[#161618] border border-gray-800 overflow-hidden transition-all duration-300 ease-in-out"
        >
          <div className="p-6">
            <div className="grid grid-cols-2 gap-8">
              <OpenSourceSection />
              <ProSection />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const OpenSourceSection = () => {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
        Open-source
      </h3>
      <ul className="space-y-4">
        <MenuItem
          title="Once UI Core"
          description="Open-source NPM package"
        />
        <MenuItem
          title="Once UI Starter"
          description="Quick start from scratch"
        />
        <MenuItem
          title="Magic Portfolio"
          description="Free portfolio template"
        />
      </ul>
    </div>
  );
};

const ProSection = () => {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
        Pro
      </h3>
      <ul className="space-y-4">
        <MenuItem
          title="Magic Store"
          description="Store for selling merch on autopilot"
        />
        <MenuItem
          title="Magic Docs"
          description="Automatic MDX documentation"
        />
        <MenuItem
          title="Magic Bio"
          description="Link-in-bio site"
        />
        <MenuItem
          title="Once UI Blocks"
          description="Copy-paste sections"
        />
        <MenuItem
          title="Once UI for Figma"
          description="Comprehensive Figma design system"
        />
      </ul>
    </div>
  );
};

const MenuItem = ({ title, description }) => {
  return (
    <li>
      <a
        href="#"
        className="group block rounded-md p-2 transition-colors duration-200 hover:bg-gray-800"
      >
        <p className="text-base font-medium text-white group-hover:text-purple-400">
          {title}
        </p>
        <p className="mt-1 text-sm text-gray-400">{description}</p>
      </a>
    </li>
  );
};

const DiscordIcon = () => {
  return (
    <a
      href="#"
      className="text-gray-400 hover:text-white transition-colors duration-200"
    >
      <span className="sr-only">Discord</span>
      <svg
        className="h-6 w-6"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    </a>
  );
};

const SignUpButton = () => {
  return (
    <a
      href="#"
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-black bg-white hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
    >
      Sign up
    </a>
  );
};

export default Navbar;
