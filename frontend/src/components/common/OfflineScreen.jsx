import React from 'react';
import { FaSync } from 'react-icons/fa';

export default function OfflineScreen({ onRetry, isRetrying }) {
  return (
    <div className="offline-screen-container">
      <div className="offline-card glass-panel">
        {/* Custom Robot + Disconnected Wi-Fi Vector SVG */}
        <div className="offline-illustration">
          <svg width="180" height="150" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Wi-Fi Waves */}
            <path d="M70 35 C85 20 115 20 130 35" stroke="#3b82f6" strokeWidth="4.5" strokeLinecap="round" opacity="0.85" />
            <path d="M78 47 C89 36 111 36 122 47" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
            <path d="M88 59 C94 53 106 53 112 59" stroke="#3b82f6" strokeWidth="3.5" strokeLinecap="round" />
            
            {/* Robot Head */}
            <rect x="75" y="70" width="50" height="42" rx="14" fill="#e2e8f0" stroke="#475569" strokeWidth="3" />
            
            {/* Robot Antenna */}
            <line x1="100" y1="70" x2="100" y2="62" stroke="#475569" strokeWidth="3" />
            <circle cx="100" cy="59" r="4.5" fill="#3b82f6" />
            
            {/* Robot Screen */}
            <rect x="83" y="78" width="34" height="24" rx="8" fill="#1e293b" />
            
            {/* Sad Eyes */}
            <ellipse cx="92" cy="88" rx="2.5" ry="3.5" fill="#94a3b8" />
            <ellipse cx="108" cy="88" rx="2.5" ry="3.5" fill="#94a3b8" />
            
            {/* Sad Mouth */}
            <path d="M94 97 Q100 93 106 97" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            
            {/* Ears */}
            <rect x="69" y="83" width="6" height="12" rx="3" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />
            <rect x="125" y="83" width="6" height="12" rx="3" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />

            {/* Robot Body */}
            <path d="M82 112 H118 V128 C118 133 114 137 109 137 H91 C86 137 82 133 82 128 V112 Z" fill="#cbd5e1" stroke="#475569" strokeWidth="3" />
            
            {/* Disconnected Cable */}
            <path d="M118 122 C135 122 140 110 152 110 C162 110 168 115 174 115" stroke="#475569" strokeWidth="3.5" strokeLinecap="round" fill="none" strokeDasharray="4 2" />
            {/* Plug Head */}
            <rect x="135" y="116" width="10" height="12" rx="2" fill="#475569" transform="rotate(-15 135 116)" />
            <line x1="145" y1="117" x2="152" y2="115" stroke="#334155" strokeWidth="2" />
            <line x1="144" y1="121" x2="151" y2="119" stroke="#334155" strokeWidth="2" />
          </svg>
        </div>

        {/* Text Details */}
        <h2 className="offline-title">Oops! You're Offline.</h2>
        <p className="offline-subtitle">
          It seems like you've lost your internet connection. Please check your network settings and try again.
        </p>

        {/* Action Button */}
        <button 
          onClick={onRetry} 
          disabled={isRetrying}
          className="offline-retry-btn"
        >
          <FaSync className={isRetrying ? 'spin-icon' : ''} size={14} />
          <span>{isRetrying ? 'Checking connection...' : 'Retry'}</span>
        </button>
      </div>
    </div>
  );
}
