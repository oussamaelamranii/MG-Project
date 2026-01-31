
import * as OTPAuth from 'otpauth';

const STORAGE_KEY_SECRET = 'mgclub_smartpass_secret';

export class SecurityService {
  private static secret: OTPAuth.Secret;

  // Initialize or retrieve the secret
  static initialize() {
    let existingSecret = localStorage.getItem(STORAGE_KEY_SECRET);
    if (!existingSecret) {
      // Generate a new random secret (base32)
      const secret = new OTPAuth.Secret({ size: 20 });
      existingSecret = secret.base32;
      localStorage.setItem(STORAGE_KEY_SECRET, existingSecret);
    }
    this.secret = OTPAuth.Secret.fromBase32(existingSecret);
  }

  // Generate the current TOTP token
  static generateToken(): string {
    if (!this.secret) this.initialize();

    const totp = new OTPAuth.TOTP({
      issuer: 'MGCLUB',
      label: 'Member',
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: this.secret,
    });

    return totp.generate();
  }

  // Get seconds remaining until next rotation
  static getSecondsRemaining(): number {
    const period = 30;
    const epoch = Math.floor(Date.now() / 1000);
    return period - (epoch % period);
  }

  // Simulate Biometric Auth (Promise-based)
  static simulateBiometricAuth(): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 95% success rate simulation
        const isSuccess = Math.random() > 0.05; 
        resolve(isSuccess);
      }, 1500); // 1.5s delay for realistic feel
    });
  }

  // Debug: Get the secret for external verification
  static getSecretDebug(): string {
    if (!this.secret) this.initialize();
    return this.secret.base32;
  }
}
