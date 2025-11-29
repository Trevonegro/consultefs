import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  variant?: 'light' | 'dark'; // kept for backward compatibility, but CSS classes preferred
}

const Logo: React.FC<LogoProps> = ({ className = "", size = 'md', showText = true, variant = 'dark' }) => {
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-24 h-24",
    xl: "w-32 h-32"
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-3xl",
    xl: "text-4xl"
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`relative flex items-center justify-center ${sizeClasses[size]} filter drop-shadow-lg`}>
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* Metallic Silver Gradient for Resplendor */}
            <linearGradient id="silverGrad" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#f1f5f9" /> {/* lighter */}
              <stop offset="50%" stopColor="#94a3b8" /> {/* mid */}
              <stop offset="100%" stopColor="#64748b" /> {/* darker */}
            </linearGradient>

            {/* Darker Silver for depth details */}
            <linearGradient id="silverDarkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
            
            {/* Gold Gradient for Rank */}
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fcd34d" />
              <stop offset="50%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>

            {/* Shadow filter for 3D effect */}
            <filter id="insetShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feComponentTransfer in="SourceAlpha">
                <feFuncA type="table" tableValues="1 0" />
              </feComponentTransfer>
              <feGaussianBlur stdDeviation="1"/>
              <feOffset dx="0" dy="1" result="offsetblur"/>
              <feFlood floodColor="rgba(0,0,0,0.5)" result="color"/>
              <feComposite in2="offsetblur" operator="in"/>
              <feComposite in2="SourceAlpha" operator="in" />
              <feMerge>
                <feMergeNode in="SourceGraphic" />
                <feMergeNode />
              </feMerge>
            </filter>
          </defs>

          {/* 1. SABRE DE CAXIAS (Hilt at bottom, tip at top) */}
          {/* Tip (barely visible at top) */}
          <path d="M48 5 L50 2 L52 5 L52 15 L48 15 Z" fill="#94a3b8" />
          
          {/* 2. RESPLENDOR (The Starburst) */}
          <path 
            d="M50 2 
               L55 12 L64 8 L64 19 L74 19 L71 30 L81 33 L75 43 L85 50 L75 57 
               L81 67 L71 70 L74 81 L64 81 L64 92 L55 88 
               L50 98 
               L45 88 L36 92 L36 81 L26 81 L29 70 L19 67 L25 57 L15 50 L25 43 L19 33 L29 30 L26 19 L36 19 L36 8 L45 12 Z"
            fill="url(#silverGrad)" 
            stroke="#2f3e2f" 
            strokeWidth="0.5"
          />
          {/* Inner definition lines for the blades to give 3D effect */}
          <path 
            d="M50 20 L50 80 M20 50 L80 50 M29 29 L71 71 M29 71 L71 29" 
            stroke="#4a5e4a" 
            strokeWidth="0.5" 
            opacity="0.5"
          />

          {/* 3. SABRE HILT (Bottom Guard) */}
          <g transform="translate(50, 84)">
             {/* Cross Guard */}
             <path d="M-12 -2 L12 -2 L14 2 L-14 2 Z" fill="url(#silverDarkGrad)" stroke="#1a261a" strokeWidth="0.5" />
             {/* Grip */}
             <rect x="-2" y="2" width="4" height="8" rx="1" fill="#475569" />
             <line x1="-2" y1="4" x2="2" y2="4" stroke="#94a3b8" strokeWidth="0.5" />
             <line x1="-2" y1="6" x2="2" y2="6" stroke="#94a3b8" strokeWidth="0.5" />
             <line x1="-2" y1="8" x2="2" y2="8" stroke="#94a3b8" strokeWidth="0.5" />
             {/* Pommel */}
             <circle cx="0" cy="11" r="2.5" fill="url(#silverGrad)" stroke="#1a261a" strokeWidth="0.5" />
          </g>

          {/* 4. THE SHIELD (Escudo) */}
          {/* Outer Green */}
          <ellipse cx="50" cy="50" rx="28" ry="38" fill="#009B3A" stroke="#005c23" strokeWidth="0.5" />
          {/* Middle Yellow */}
          <ellipse cx="50" cy="50" rx="21" ry="30" fill="#FEDF00" stroke="#eab308" strokeWidth="0.5" />
          {/* Inner Blue */}
          <ellipse cx="50" cy="50" rx="15" ry="22" fill="#002776" stroke="#172554" strokeWidth="0.5" />

          {/* 5. DIVISA (Rank Insignia) - Centered */}
          <g transform="translate(50, 52) scale(1.2)">
             {/* Golden Chevrons */}
             <path d="M-9 -7 L0 -15 L9 -7 L9 -3 L0 -11 L-9 -3 Z" fill="url(#goldGrad)" stroke="#78350f" strokeWidth="0.3" />
             <path d="M-9 1 L0 -7 L9 1 L9 5 L0 -3 L-9 5 Z" fill="url(#goldGrad)" stroke="#78350f" strokeWidth="0.3" />
          </g>
        </svg>
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <h1 className={`font-black tracking-tight leading-none ${textSizes[size]} text-gray-900 dark:text-military-100`}>
            CONSULTE <span className="text-red-600 dark:text-red-700">FS</span>
          </h1>
          <span className={`text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 dark:text-military-300`}>
            Exército Brasileiro
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;