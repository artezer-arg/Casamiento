import React from 'react';

export default function EucalyptusCorner({ className, style }) {
  return (
    <svg 
      className={className} 
      style={style} 
      viewBox="0 0 160 160" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="leafGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4a5a3f" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#7a926e" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#a3b899" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="leafGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3c4c32" stopOpacity="0.95" />
          <stop offset="60%" stopColor="#677f59" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#93aa86" stopOpacity="0.75" />
        </linearGradient>
        <linearGradient id="leafGrad3" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#586c4d" stopOpacity="0.95" />
          <stop offset="70%" stopColor="#8da87e" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#b9cead" stopOpacity="0.8" />
        </linearGradient>
      </defs>

      {/* Main Sweeping Branch Stem */}
      <path 
        d="M160,0 C125,25 80,45 25,85" 
        stroke="#2c3a23" 
        strokeWidth="1.2" 
        strokeLinecap="round" 
      />
      
      {/* Side Branch 1 */}
      <path 
        d="M115,20 C95,50 85,85 75,125" 
        stroke="#2c3a23" 
        strokeWidth="0.9" 
        strokeLinecap="round" 
      />

      {/* Side Branch 2 */}
      <path 
        d="M75,45 C55,70 35,105 15,130" 
        stroke="#2c3a23" 
        strokeWidth="0.8" 
        strokeLinecap="round" 
      />

      {/* --- LEAVES ALONG MAIN STEM --- */}
      {/* Leaf 1 (near corner, small) */}
      <g transform="translate(145, 12) rotate(-45) scale(0.6)">
        <path d="M0,0 C-6,-15 -20,-15 -18,2 C-16,15 -4,10 0,0 Z" fill="url(#leafGrad1)" stroke="#2c3a23" strokeWidth="0.4" />
      </g>
      <g transform="translate(138, 16) rotate(60) scale(0.55)">
        <path d="M0,0 C6,-15 20,-15 18,2 C16,15 4,10 0,0 Z" fill="url(#leafGrad2)" stroke="#2c3a23" strokeWidth="0.4" />
      </g>

      {/* Leaf 2 */}
      <g transform="translate(122, 28) rotate(-25) scale(0.85)">
        <path d="M0,0 C-6,-15 -20,-15 -18,2 C-16,15 -4,10 0,0 Z" fill="url(#leafGrad3)" stroke="#2c3a23" strokeWidth="0.4" />
      </g>
      <g transform="translate(118, 32) rotate(80) scale(0.8)">
        <path d="M0,0 C6,-15 20,-15 18,2 C16,15 4,10 0,0 Z" fill="url(#leafGrad1)" stroke="#2c3a23" strokeWidth="0.4" />
      </g>

      {/* Leaf 3 */}
      <g transform="translate(95, 43) rotate(-15) scale(1.1)">
        <path d="M0,0 C-8,-18 -24,-18 -20,3 C-16,20 -4,12 0,0 Z" fill="url(#leafGrad2)" stroke="#2c3a23" strokeWidth="0.4" />
      </g>
      <g transform="translate(90, 48) rotate(95) scale(1)">
        <path d="M0,0 C8,-18 24,-18 20,3 C16,20 4,12 0,0 Z" fill="url(#leafGrad3)" stroke="#2c3a23" strokeWidth="0.4" />
      </g>

      {/* Leaf 4 */}
      <g transform="translate(68, 58) rotate(-10) scale(1.15)">
        <path d="M0,0 C-8,-18 -24,-18 -20,3 C-16,20 -4,12 0,0 Z" fill="url(#leafGrad1)" stroke="#2c3a23" strokeWidth="0.4" />
      </g>
      <g transform="translate(62, 63) rotate(105) scale(1.05)">
        <path d="M0,0 C8,-18 24,-18 20,3 C16,20 4,12 0,0 Z" fill="url(#leafGrad2)" stroke="#2c3a23" strokeWidth="0.4" />
      </g>

      {/* Leaf 5 (near tip) */}
      <g transform="translate(42, 73) rotate(-20) scale(0.95)">
        <path d="M0,0 C-8,-16 -22,-16 -18,2 C-14,18 -4,10 0,0 Z" fill="url(#leafGrad3)" stroke="#2c3a23" strokeWidth="0.4" />
      </g>
      <g transform="translate(38, 77) rotate(115) scale(0.85)">
        <path d="M0,0 C8,-16 22,-16 18,2 C14,18 4,10 0,0 Z" fill="url(#leafGrad1)" stroke="#2c3a23" strokeWidth="0.4" />
      </g>

      {/* Leaf 6 (Tip, single leaf) */}
      <g transform="translate(25, 85) rotate(-35) scale(0.7)">
        <path d="M0,0 C-8,-15 -20,-15 -18,2 C-16,15 -4,10 0,0 Z" fill="url(#leafGrad2)" stroke="#2c3a23" strokeWidth="0.4" />
      </g>

      {/* --- LEAVES ALONG SIDE BRANCH 1 --- */}
      {/* Branch 1 - Pair 1 */}
      <g transform="translate(105, 45) rotate(45) scale(0.85)">
        <path d="M0,0 C-8,-16 -22,-16 -18,2 C-14,18 -4,10 0,0 Z" fill="url(#leafGrad3)" stroke="#2c3a23" strokeWidth="0.4" />
      </g>
      <g transform="translate(101, 48) rotate(145) scale(0.8)">
        <path d="M0,0 C8,-16 22,-16 18,2 C14,18 4,10 0,0 Z" fill="url(#leafGrad1)" stroke="#2c3a23" strokeWidth="0.4" />
      </g>

      {/* Branch 1 - Pair 2 */}
      <g transform="translate(93, 72) rotate(35) scale(0.95)">
        <path d="M0,0 C-8,-16 -22,-16 -18,2 C-14,18 -4,10 0,0 Z" fill="url(#leafGrad2)" stroke="#2c3a23" strokeWidth="0.4" />
      </g>
      <g transform="translate(89, 76) rotate(135) scale(0.9)">
        <path d="M0,0 C8,-16 22,-16 18,2 C14,18 4,10 0,0 Z" fill="url(#leafGrad3)" stroke="#2c3a23" strokeWidth="0.4" />
      </g>

      {/* Branch 1 - Tip */}
      <g transform="translate(75, 125) rotate(55) scale(0.65)">
        <path d="M0,0 C-8,-15 -20,-15 -18,2 C-16,15 -4,10 0,0 Z" fill="url(#leafGrad1)" stroke="#2c3a23" strokeWidth="0.4" />
      </g>

      {/* --- LEAVES ALONG SIDE BRANCH 2 --- */}
      {/* Branch 2 - Pair 1 */}
      <g transform="translate(62, 64) rotate(25) scale(0.8)">
        <path d="M0,0 C-6,-15 -20,-15 -18,2 C-16,15 -4,10 0,0 Z" fill="url(#leafGrad2)" stroke="#2c3a23" strokeWidth="0.4" />
      </g>
      <g transform="translate(58, 68) rotate(125) scale(0.75)">
        <path d="M0,0 C6,-15 20,-15 18,2 C16,15 4,10 0,0 Z" fill="url(#leafGrad3)" stroke="#2c3a23" strokeWidth="0.4" />
      </g>

      {/* Branch 2 - Pair 2 */}
      <g transform="translate(42, 90) rotate(15) scale(0.85)">
        <path d="M0,0 C-8,-16 -22,-16 -18,2 C-14,18 -4,10 0,0 Z" fill="url(#leafGrad1)" stroke="#2c3a23" strokeWidth="0.4" />
      </g>
      <g transform="translate(38, 94) rotate(115) scale(0.8)">
        <path d="M0,0 C8,-16 22,-16 18,2 C14,18 4,10 0,0 Z" fill="url(#leafGrad2)" stroke="#2c3a23" strokeWidth="0.4" />
      </g>

      {/* Branch 2 - Tip */}
      <g transform="translate(15, 130) rotate(35) scale(0.6)">
        <path d="M0,0 C-8,-15 -20,-15 -18,2 C-16,15 -4,10 0,0 Z" fill="url(#leafGrad3)" stroke="#2c3a23" strokeWidth="0.4" />
      </g>
    </svg>
  );
}
