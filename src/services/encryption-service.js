/**
 * Encryption Service
 * AES-256-GCM encryption using Web Crypto API for secure API key storage
 *
 * Provides browser-native encryption without requiring external libraries.
 * Uses device fingerprint + timestamp for key derivation to prevent
 * simple copy-paste attacks.
 */

/**
 * Generate a device fingerprint for key derivation
 * Combines multiple browser characteristics for uniqueness
 *
 * @returns {string} Device fingerprint
 */
function getDeviceFingerprint() {
  const components = [
    navigator.userAgent,
    navigator.language,
    window.screen.width,
    window.screen.height,
    window.screen.colorDepth,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency || 'unknown'
  ];

  return components.join('|');
}

/**
 * Derive encryption key from device fingerprint using PBKDF2
 *
 * @param {string} passphrase - Base passphrase for derivation
 * @param {Uint8Array} salt - Salt for key derivation
 * @returns {Promise<CryptoKey>} Derived encryption key
 */
async function deriveKey(passphrase, salt) {
  const encoder = new TextEncoder();
  const passphraseKey = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    passphraseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt data using AES-256-GCM
 *
 * @param {string} plaintext - Data to encrypt
 * @returns {string} Encrypted data in format: salt:iv:ciphertext (base64)
 */
export async function encryptData(plaintext) {
  if (!plaintext) {
    throw new Error('Cannot encrypt empty data');
  }

  try {
    const encoder = new TextEncoder();

    // Generate random salt and IV
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    // Derive key from device fingerprint
    const fingerprint = getDeviceFingerprint();
    const key = await deriveKey(fingerprint, salt);

    // Encrypt data
    const encrypted = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv
      },
      key,
      encoder.encode(plaintext)
    );

    // Combine salt, IV, and ciphertext
    const encryptedArray = new Uint8Array(encrypted);

    // Convert to base64 for storage
    const saltBase64 = btoa(String.fromCharCode(...salt));
    const ivBase64 = btoa(String.fromCharCode(...iv));
    const ciphertextBase64 = btoa(String.fromCharCode(...encryptedArray));

    return `${saltBase64}:${ivBase64}:${ciphertextBase64}`;
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error(`Encryption failed: ${error.message}`);
  }
}

/**
 * Decrypt data encrypted with encryptData
 *
 * @param {string} encryptedData - Encrypted data in format: salt:iv:ciphertext
 * @returns {string} Decrypted plaintext
 */
export async function decryptData(encryptedData) {
  if (!encryptedData) {
    throw new Error('Cannot decrypt empty data');
  }

  try {
    // Parse encrypted data
    const parts = encryptedData.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted data format');
    }

    const [saltBase64, ivBase64, ciphertextBase64] = parts;

    // Convert from base64
    const salt = new Uint8Array(
      atob(saltBase64).split('').map(c => c.charCodeAt(0))
    );
    const iv = new Uint8Array(
      atob(ivBase64).split('').map(c => c.charCodeAt(0))
    );
    const ciphertext = new Uint8Array(
      atob(ciphertextBase64).split('').map(c => c.charCodeAt(0))
    );

    // Derive key from device fingerprint (same as encryption)
    const fingerprint = getDeviceFingerprint();
    const key = await deriveKey(fingerprint, salt);

    // Decrypt data
    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv
      },
      key,
      ciphertext
    );

    // Convert to string
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error(`Decryption failed: ${error.message}`);
  }
}

/**
 * Test encryption/decryption cycle
 * Useful for debugging
 *
 * @param {string} testData - Data to test
 * @returns {boolean} True if cycle successful
 */
export async function testEncryptionCycle(testData = 'test-data-123') {
  try {
    const encrypted = await encryptData(testData);
    const decrypted = await decryptData(encrypted);
    return decrypted === testData;
  } catch (error) {
    console.error('Encryption cycle test failed:', error);
    return false;
  }
}
