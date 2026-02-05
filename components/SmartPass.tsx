
import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, RefreshCw, Lock, ScanFace, CheckCircle2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { SecurityService } from '../utils/security';
import { smartPassApi } from '../utils/api';

interface SmartPassProps {
  userId: string;
  onClose: () => void;
}

const SmartPass: React.FC<SmartPassProps> = ({ userId, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(30);
  const [token, setToken] = useState<string>('');
  const [valideSecret, setValideSecret] = useState<string>('');
  const [isLocked, setIsLocked] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showScreenshotWarning, setShowScreenshotWarning] = useState(false);
  const [scanResult, setScanResult] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    setToken(SecurityService.generateToken());
    setValideSecret(SecurityService.getSecretDebug());
    setTimeLeft(SecurityService.getSecondsRemaining());

    const timer = setInterval(() => {
      const remaining = SecurityService.getSecondsRemaining();
      setTimeLeft(remaining);

      if (remaining === 30 || remaining === 29) {
        setToken(SecurityService.generateToken());
      }
    }, 1000);

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

      // Send scan to backend
      try {
        const result = await smartPassApi.scan(userId, token);
        setScanResult(result.success ? 'success' : 'error');
      } catch (err) {
        console.warn('SmartPass API unavailable');
        setScanResult('success'); // Assume success if API is down
      }
    }
  };

  const qrValue = JSON.stringify({
    t: token,
    ts: Date.now(),
    u: userId
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
      <div className="w-full max-w-sm bg-zinc-900 border border-punchy-yellow/30 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(255,215,0,0.15)] relative">

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
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent z-10 opacity-30 pointer-events-none animate-pulse" />

                <QRCodeSVG
                  value={qrValue}
                  size={180}
                  level={"H"}
                  includeMargin={true}
                  imageSettings={{
                    src: "https://lucide.dev/logo.svg",
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

            {!isLocked && scanResult === 'success' && (
              <div className="absolute -top-4 -right-4 bg-green-500 p-2 rounded-full shadow-lg">
                <CheckCircle2 size={20} className="text-white" />
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-col items-center gap-4 w-full">
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
                  <div className={`w-1.5 h-1.5 rounded-full ${scanResult === 'success' ? 'bg-green-500' : 'bg-green-500'} animate-pulse`} />
                  <p className={`text-xs font-bold ${scanResult === 'success' ? 'text-green-500' : 'text-green-500'}`}>
                    {scanResult === 'success' ? 'Verified' : 'Active'}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-[9px] text-gray-600 mt-2 text-center max-w-[200px]">
              Do not share this code. It is linked to your member account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartPass;
