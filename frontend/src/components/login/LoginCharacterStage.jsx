import React, { memo } from 'react';

const LoginCharacterStage = memo(function LoginCharacterStage({ mousePos, showPassword }) {
  const lookX = showPassword ? -0.8 : mousePos.x;
  const lookY = showPassword ? -0.8 : mousePos.y;

  return (
    <div className="character-stage">
      {/* 1. Purple Tall Character */}
      <div className="char-wrapper purple-wrapper">
        <div 
          className="char-shadow purple-shadow"
          style={{
            transform: `translateX(-50%) translate(${lookX * -6}px, ${lookY * -2}px) scale(${1 - lookY * 0.1})`
          }}
        />
        <div 
          className={`cute-character purple-char ${showPassword ? 'looking-away' : ''}`}
          style={{
            transform: `perspective(1000px) rotateY(${lookX * 12}deg) rotateX(${-lookY * 12}deg)`
          }}
        >
          <div className="char-face">
            <div className="eyes-row">
              <div className="eyeball">
                <div className="pupil" style={{ transform: `translate(${lookX * 5}px, ${lookY * 5}px)` }} />
              </div>
              <div className="eyeball">
                <div className="pupil" style={{ transform: `translate(${lookX * 5}px, ${lookY * 5}px)` }} />
              </div>
            </div>
            <div className="blush-row">
              <div className="blush" />
              <div className="blush" />
            </div>
            <div className="char-mouth" />
          </div>
        </div>
      </div>

      {/* 2. Pink Middle Character */}
      <div className="char-wrapper pink-wrapper">
        <div 
          className="char-shadow pink-shadow"
          style={{
            transform: `translateX(-50%) translate(${lookX * -5}px, ${lookY * -2}px)`
          }}
        />
        <div 
          className="cute-character pink-char"
          style={{
            transform: `perspective(1000px) rotateY(${lookX * 14}deg) rotateX(${-lookY * 14}deg)`
          }}
        >
          <div className="char-face">
            <div className="eyes-row">
              <div className="eyeball small-eye">
                <div className="pupil" style={{ transform: `translate(${lookX * 4}px, ${lookY * 4}px)` }} />
              </div>
              <div className="eyeball small-eye">
                <div className="pupil" style={{ transform: `translate(${lookX * 4}px, ${lookY * 4}px)` }} />
              </div>
            </div>
            <div className="char-mouth" style={{ width: '8px', height: '4px' }} />
          </div>
        </div>
      </div>

      {/* 3. Yellow Right Character */}
      <div className="char-wrapper yellow-wrapper">
        <div 
          className="char-shadow yellow-shadow"
          style={{
            transform: `translateX(-50%) translate(${lookX * -4}px, ${lookY * -2}px)`
          }}
        />
        <div 
          className="cute-character yellow-char"
          style={{
            transform: `perspective(1000px) rotateY(${lookX * 10}deg) rotateX(${-lookY * 10}deg)`
          }}
        >
          <div className="char-face yellow-face">
            <div className="eyes-row">
              <div className="dot-eye">
                <div style={{ transform: `translate(${lookX * 3}px, ${lookY * 3}px)` }} />
              </div>
              <div className="dot-eye">
                <div style={{ transform: `translate(${lookX * 3}px, ${lookY * 3}px)` }} />
              </div>
            </div>
            <div className="yellow-beak" />
          </div>
        </div>
      </div>

      {/* 4. Orange Wide Character (Front Left) */}
      <div className="char-wrapper orange-wrapper">
        <div 
          className="char-shadow orange-shadow"
          style={{
            transform: `translateX(-50%) translate(${lookX * -5}px, ${lookY * -2}px)`
          }}
        />
        <div 
          className="cute-character orange-char"
          style={{
            transform: `perspective(1000px) rotateY(${lookX * 15}deg) rotateX(${-lookY * 15}deg)`
          }}
        >
          <div className="char-face orange-face">
            <div className="eyes-row">
              <div className="dot-eye">
                <div style={{ transform: `translate(${lookX * 4}px, ${lookY * 4}px)` }} />
              </div>
              <div className="dot-eye">
                <div style={{ transform: `translate(${lookX * 4}px, ${lookY * 4}px)` }} />
              </div>
            </div>
            <div className="char-mouth" style={{ marginTop: '4px' }} />
          </div>
        </div>
      </div>
    </div>
  );
});

export default LoginCharacterStage;
