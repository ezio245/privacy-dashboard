// encryption.js

const cryptoAPI = window.crypto || window.msCrypto;

async function generateKey() {
  return await cryptoAPI.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

async function encryptData(key, data) {
  const encoder = new TextEncoder();
  const encoded = encoder.encode(data);
  const iv = cryptoAPI.getRandomValues(new Uint8Array(12));
  const ciphertext = await cryptoAPI.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    key,
    encoded
  );
  const combined = new Uint8Array(iv.byteLength + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), iv.byteLength);
  return btoa(String.fromCharCode(...combined));
}

async function decryptData(key, encryptedData) {
  const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
  const iv = combined.slice(0, 12);
  const ciphertext = combined.slice(12);
  const decrypted = await cryptoAPI.subtle.decrypt(
    { name: "AES-GCM", iv: iv },
    key,
    ciphertext
  );
  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}

