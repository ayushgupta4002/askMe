import React from 'react';

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center p-4 h-screen w-screen">
      <div className="relative w-32 h-32 animate-bounce" style={{ animationDuration: '2s' }}>
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Body Base */}
          <path
            d="M100 40 C40 40 30 120 30 160 C30 180 60 190 100 190 C140 190 170 180 170 160 C170 120 160 40 100 40"
            fill="#1a1a1a"
          />
          
          {/* White Belly */}
          <path
            d="M100 70 C60 70 50 120 50 160 C50 175 70 180 100 180 C130 180 150 175 150 160 C150 120 140 70 100 70"
            fill="#f8fafc"
          />
          
          {/* Head */}
          <ellipse
            cx="100"
            cy="50"
            rx="35"
            ry="30"
            fill="#1a1a1a"
          />
          
          {/* Eyes */}
          <g className="animate-[blink_4s_ease-in-out_infinite]">
            <circle cx="85" cy="45" r="4" fill="white" />
            <circle cx="85" cy="45" r="2" fill="#1a1a1a" />
            <circle cx="115" cy="45" r="4" fill="white" />
            <circle cx="115" cy="45" r="2" fill="#1a1a1a" />
          </g>
          
          {/* Beak */}
          <path
            d="M95 50 C100 50 100 55 100 55 C100 55 100 50 105 50 C110 50 115 53 115 58 C115 63 108 65 100 65 C92 65 85 63 85 58 C85 53 90 50 95 50"
            fill="#ff9800"
          />
          
          {/* Left Flipper */}
          <g className="origin-center animate-[wave_1s_ease-in-out_infinite]">
            <path
              d="M40 90 C30 100 25 120 30 140 C32 150 38 155 45 150 C55 140 60 110 55 95 C52 88 45 85 40 90"
              fill="#1a1a1a"
            />
            <path
              d="M42 92 C34 100 30 120 34 138 C35 145 40 148 44 145 C52 138 56 112 52 97 C50 92 45 89 42 92"
              fill="#2a2a2a"
            />
          </g>
          
          {/* Right Flipper */}
          <g className="origin-center animate-[wave_1s_ease-in-out_infinite]">
            <path
              d="M160 90 C170 100 175 120 170 140 C168 150 162 155 155 150 C145 140 140 110 145 95 C148 88 155 85 160 90"
              fill="#1a1a1a"
              transform="scale(-1, 1) translate(-200, 0)"
            />
            <path
              d="M158 92 C166 100 170 120 166 138 C165 145 160 148 156 145 C148 138 144 112 148 97 C150 92 155 89 158 92"
              fill="#2a2a2a"
              transform="scale(-1, 1) translate(-200, 0)"
            />
          </g>
          
          {/* Feet */}
          <g className="animate-[waddle_1s_ease-in-out_infinite]">
            <path
              d="M80 180 C75 180 70 185 70 190 C70 195 90 195 90 190 C90 185 85 180 80 180"
              fill="#ff9800"
            />
            <path
              d="M120 180 C115 180 110 185 110 190 C110 195 130 195 130 190 C130 185 125 180 120 180"
              fill="#ff9800"
            />
          </g>
        </svg>
      </div>

      {/* Loading dots */}
      <div className="flex space-x-2 mt-4">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
      </div>

      <style jsx>{`
        @keyframes blink {
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }
        
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(20deg); }
        }
        
        @keyframes waddle {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(3px); }
        }
      `}</style>
    </div>
  );
};

export default Loader;