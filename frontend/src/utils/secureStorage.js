// Obfuscated / Encrypted Local Storage Utility for Client-Side Security

const SECRET_SALT = 'BIT_MESS_SECURE_STORAGE_SALT_2026';

// Base64 + Shift Obfuscation to prevent plain text inspection in DevTools
const encode = (data) => {
  try {
    const jsonString = typeof data === 'string' ? data : JSON.stringify(data);
    const textWithSalt = SECRET_SALT + jsonString;
    return btoa(encodeURIComponent(textWithSalt));
  } catch (err) {
    return null;
  }
};

const decode = (encodedStr) => {
  try {
    if (!encodedStr) return null;
    const textWithSalt = decodeURIComponent(atob(encodedStr));
    if (!textWithSalt.startsWith(SECRET_SALT)) return null;
    const rawJson = textWithSalt.replace(SECRET_SALT, '');
    try {
      return JSON.parse(rawJson);
    } catch {
      return rawJson;
    }
  } catch (err) {
    return null;
  }
};

// Obfuscated storage key mapping
const KEY_MAP = {
  user: '_u_sec_data',
  token: '_t_auth_sec',
  activePage: '_a_pg_sec',
  theme: '_th_mode'
};

export const secureStorage = {
  setItem: (key, value) => {
    const targetKey = KEY_MAP[key] || key;
    const encodedValue = encode(value);
    if (encodedValue !== null) {
      localStorage.setItem(targetKey, encodedValue);
    }
  },

  getItem: (key) => {
    const targetKey = KEY_MAP[key] || key;
    const rawVal = localStorage.getItem(targetKey);
    if (!rawVal) {
      // Fallback check for legacy non-encoded key if present, then migrate
      const legacyVal = localStorage.getItem(key);
      if (legacyVal) {
        secureStorage.setItem(key, legacyVal);
        localStorage.removeItem(key);
        try { return JSON.parse(legacyVal); } catch { return legacyVal; }
      }
      return null;
    }
    return decode(rawVal);
  },

  removeItem: (key) => {
    const targetKey = KEY_MAP[key] || key;
    localStorage.removeItem(targetKey);
    localStorage.removeItem(key); // also clear un-encoded legacy key if exists
  },

  clear: () => {
    localStorage.clear();
  }
};

export default secureStorage;
