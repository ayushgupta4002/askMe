import React from 'react';
import { Heart, Github, FileText, Scissors, CodeIcon } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black text-gray-300 ">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo Section */}
          <div className="flex items-center space-x-3 group">
          <div className="p-2 rounded-full bg-zinc-600/90 group-hover:bg-zinc-400/80 transition-all duration-300">
              <CodeIcon className="w-6 h-6 text-gray-200 group-hover:text-white transform rotate-12 group-hover:rotate-[-12] transition-all duration-300" />
            </div>
            <span className="text-xl font-bold font-display bg-gradient-to-r from-gray-100 to-gray-300 text-transparent bg-clip-text">
              IamYou
            </span>
          </div>
          
          {/* Navigation Links */}
          {/* <div className="flex items-center space-x-8">
            <a 
              href="integration/vscode" 
              className="flex items-center space-x-2 px-4 py-2 rounded-full bg-zinc-900/80 hover:bg-zinc-800 transition-all duration-300"
            >
              <FileText className="w-4 h-4 text-gray-300" />
              <span className="text-sm font-medium font-display tracking-wide">Documentation</span>
            </a>
            <a 
              href="https://github.com/ayushgupta4002" 
              className="flex items-center space-x-2 px-4 py-2 rounded-full bg-zinc-900/80 hover:bg-zinc-800 transition-all duration-300"
            >
              <Github className="w-4 h-4 text-gray-300" />
              <span className="text-sm font-medium font-display tracking-wide">GitHub</span>
            </a>
          </div> */}

          {/* Copyright and Credits */}
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm">
            <span className="text-zinc-400 font-display tracking-wide">© 2025 IamYou. All rights reserved.</span>
            <div className="flex items-center px-4 py-2 rounded-full bg-zinc-900/80">
              <span className="text-zinc-400">Made with</span>
              <Heart className="w-4 h-4 mx-1.5 text-red-400 hover:text-red-300 fill-current animate-pulse" />
              <span className="text-zinc-400">by</span>
              <a 
                href="https://x.com/Ayush3241" 
                className="ml-1.5 text-gray-300 hover:text-white transition-colors font-display font-medium tracking-wide"
              >
                crazysage
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;