import React, { useRef } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useMousePosition, useAuth } from '@/hooks';
import { LoginScenery, LoginCharacterStage, AuthForm } from '@/components/features/login';


export default function Login({ setUser, setActivePage, onClose }) {
  const containerRef = useRef(null);
  const { mousePos } = useMousePosition(containerRef);
  const authHook = useAuth({ setUser, setActivePage, onClose });

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "1088888888888-abcd1234efgh5678ijkl9012mnop3456.apps.googleusercontent.com";

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="login-page-wrapper">
        <div className="login-card-container">
          
          {/* Left Side: Interactive 3D Cute Characters Panel */}
          <div className="login-left-pane" ref={containerRef}>
            <button 
              className="login-back-btn" 
              onClick={onClose}
              title="Go back to Dashboard"
            >
              <FaArrowLeft />
            </button>

            <LoginScenery />
            <LoginCharacterStage mousePos={mousePos} showPassword={authHook.showPassword} />
          </div>

          {/* Right Side: Auth Form */}
          <AuthForm authHook={authHook} onClose={onClose} />
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
