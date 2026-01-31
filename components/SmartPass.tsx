
import React, { useState, useEffect, useRef } from 'react';
import { X, ShieldCheck, RefreshCw, Lock, ScanFace } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { SecurityService } from '../utils/security';

interface SmartPassProps {
  onClose: () => void;
}

const SmartPass: React.FC<SmartPassProps> = ({ onClose }) => {
  const [timeLeft, setTimeLeft] = useState(30);
  const [token, setToken] = useState<string>('');
  const [valideSecret, setValideSecret] = useState<string>(''); // Used for QR value
  const [isLocked, setIsLocked] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showScreenshotWarning, setShowScreenshotWarning] = useState(false);

  // Initialize Security and Rotation Timer
  useEffect(() => {
    // Initial fetch
    setToken(SecurityService.generateToken());
    setValideSecret(SecurityService.getSecretDebug());
    setTimeLeft(SecurityService.getSecondsRemaining());

    const timer = setInterval(() => {
      const remaining = SecurityService.getSecondsRemaining();
      setTimeLeft(remaining);

      // If we hit the 30s mark (or close to it), regenerate
      if (remaining === 30 || remaining === 29) {
        setToken(SecurityService.generateToken());
      }
    }, 1000);

    // Anti-screenshot detection (Best effort)
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen') {
        setShowScreenshotWarning(true);
        setTimeout(() => setShowScreenshotWarning(false), 3000);
      }
    };

    window.addEventListener('keyup', handleKeyUp);

    return () => {
      clearInterval(timer);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleUnlock = async () => {
    setIsAuthenticating(true);
    const success = await SecurityService.simulateBiometricAuth();
    setIsAuthenticating(false);
    if (success) {
      setIsLocked(false);
    }
  };

  // QR Value payload: JSON with token and timestamp for validation
  const qrValue = JSON.stringify({
    t: token,
    ts: Date.now(),
    u: 'MG-9921-X'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
      <div className="w-full max-w-sm bg-zinc-900 border border-punchy-yellow/30 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(255,215,0,0.15)] relative">

        {/* Anti-screenshot Warning Overlay */}
        {showScreenshotWarning && (
          <div className="absolute inset-0 z-50 bg-red-600/90 flex flex-col items-center justify-center text-center p-6 animate-pulse">
            <ShieldCheck size={64} className="text-white mb-4" />
            <h3 className="text-2xl font-black text-white uppercase italic">Security Alert</h3>
            <p className="text-white font-medium mt-2">Screenshots are disabled for security.</p>
          </div>
        )}

        <div className="relative p-8 flex flex-col items-center select-none">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors"
          >
            <X size={20} />
          </button>

          <div className="mt-4 flex items-center gap-2 text-punchy-yellow font-black italic text-xl">
            <ShieldCheck size={24} />
            SMART PASS
          </div>

          <p className="mt-2 text-gray-400 text-xs text-center">
            Dynamic access code for MGCLUB Entry
          </p>

          <div className="mt-10 relative group">
            <div className={`transition-all duration-700 ${isLocked ? 'blur-2xl opacity-10 scale-95' : 'opacity-100 scale-100'}`}>
              <div className="bg-white p-4 rounded-3xl shadow-inner relative overflow-hidden">
                {/* Holographic effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent z-10 opacity-30 pointer-events-none animate-pulse" />

                <QRCodeSVG
                  value={qrValue}
                  size={180}
                  level={"H"}
                  includeMargin={true}
                  imageSettings={{
                    src: "https://lucide.dev/logo.svg", // Placeholder icon, ideally would be MG logo
                    x: undefined,
                    y: undefined,
                    height: 24,
                    width: 24,
                    excavate: true,
                  }}
                />
              </div>
            </div>

            {isLocked && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                <button
                  onClick={handleUnlock}
                  disabled={isAuthenticating}
                  className="group relative flex flex-col items-center"
                >
                  <div className={`p-6 ${isAuthenticating ? 'bg-royal-blue' : 'bg-punchy-yellow'} text-black rounded-full shadow-[0_0_30px_rgba(255,215,0,0.4)] transition-all duration-300 transform group-hover:scale-105 active:scale-95`}>
                    {isAuthenticating ? (
                      <ScanFace size={36} className="animate-pulse text-white" />
                    ) : (
                      <Lock size={36} />
                    )}
                  </div>
                  <span className="mt-6 text-punchy-yellow font-bold text-sm tracking-widest uppercase animate-pulse">
                    {isAuthenticating ? 'Verifying...' : 'Tap to Reveal'}
                  </span>
                </button>
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-col items-center gap-4 w-full">
            {/* Progress Bar */}
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full bg-punchy-yellow transition-all duration-1000 ease-linear shadow-[0_0_10px_#FFD700]`}
                style={{ width: `${(timeLeft / 30) * 100}%` }}
              />
            </div>

            <div className="flex items-center gap-2 text-gray-400 text-xs font-mono uppercase tracking-tighter">
              <RefreshCw size={12} className={timeLeft > 28 ? 'animate-spin' : ''} />
              Refreshes in {timeLeft}s
            </div>

            <div className="mt-6 w-full p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
              <div className="text-left">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Pass ID</p>
                <p className="text-xs font-mono text-gray-300">MG-{valideSecret.substring(0, 4)}-X</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Status</p>
                <div className="flex items-center gap-1 justify-end">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <p className="text-xs font-bold text-green-500">Active</p>
                </div>
              </div>
            </div>

            <p className="text-[9px] text-gray-600 mt-2 text-center max-w-[200px]">
              Do not share this code. It is linked to your physical device ID [UUID-V4].
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartPass;
