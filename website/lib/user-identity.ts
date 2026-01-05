import FingerprintJS from '@fingerprintjs/fingerprintjs';

let fpPromise: Promise<any> | null = null;

/**
 * Initialize FingerprintJS library
 */
export async function initFingerprint() {
    if (!fpPromise) {
        fpPromise = FingerprintJS.load();
    }
    return fpPromise;
}

/**
 * Get unique browser fingerprint for anonymous user identification
 */
export async function getUserFingerprint(): Promise<string> {
    try {
        const fp = await initFingerprint();
        const result = await fp.get();
        return result.visitorId;
    } catch (error) {
        console.error('Failed to get fingerprint:', error);
        // Fallback to random ID stored in localStorage
        const fallbackId = localStorage.getItem('pumpkin_user_id');
        if (fallbackId) return fallbackId;

        const newId = crypto.randomUUID();
        localStorage.setItem('pumpkin_user_id', newId);
        return newId;
    }
}

/**
 * Get stored username from localStorage
 */
export function getStoredUsername(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('pumpkin_username');
}

/**
 * Store username in localStorage
 */
export function setStoredUsername(username: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('pumpkin_username', username);
}

/**
 * Check if user has set a username
 */
export function hasUsername(): boolean {
    return getStoredUsername() !== null;
}
