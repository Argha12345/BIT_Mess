import React, { memo } from 'react';

const BitLogo = memo(function BitLogo({ width = 140, showText = true }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}>
      <img 
        src="/bit-logo.png" 
        alt="BIT Logo" 
        decoding="async"
        loading="lazy"
        style={{ 
          height: '38px', 
          width: 'auto', 
          objectFit: 'contain',
          filter: 'drop-shadow(0 2px 8px rgba(0, 82, 212, 0.3))' 
        }} 
      />
      {showText && (
        <span style={{ 
          fontFamily: 'var(--font-title)', 
          fontWeight: 800, 
          fontSize: '1.2rem', 
          letterSpacing: '-0.5px',
          color: 'var(--text-primary)'
        }}>
          BIT<span style={{ color: 'var(--primary)' }}>Mess</span>
        </span>
      )}
    </div>
  );
});

export default BitLogo;
