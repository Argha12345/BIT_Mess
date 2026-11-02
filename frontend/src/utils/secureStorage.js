// Resilient Local Storage Utility with Dual-Key Fallback & Safe Decoding
const SECRET_SALT = 'BIT_MESS_SECURE_STORAGE_SALT_2026';

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
    if (value === undefined || value === null) {
      secureStorage.removeItem(key);
      return;
    }
    try {
      const targetKey = KEY_MAP[key] || key;
      const encodedValue = encode(value);
      if (encodedValue !== null) {
        localStorage.setItem(targetKey, encodedValue);
      }
      // Dual-write standard key as safety fallback
      if (typeof value === 'string') {
        localStorage.setItem(key, value);
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (e) {
      console.warn('secureStorage setItem warning:', e);
    }
  },

  getItem: (key) => {
    try {
      const targetKey = KEY_MAP[key] || key;
      const rawVal = localStorage.getItem(targetKey);
      if (rawVal) {
        const decoded = decode(rawVal);
        if (decoded !== null && decoded !== undefined) return decoded;
      }

      // Fallback to standard key if obfuscated value is missing or decoding fails
      const plainVal = localStorage.getItem(key);
      if (plainVal) {
        try {
          return JSON.parse(plainVal);
        } catch {
          return plainVal;
        }
      }
      return null;
    } catch (e) {
      return null;
    }
  },

  removeItem: (key) => {
    try {
      const targetKey = KEY_MAP[key] || key;
      localStorage.removeItem(targetKey);
      localStorage.removeItem(key);
    } catch (e) {}
  },

  clear: () => {
    try {
      localStorage.clear();
    } catch (e) {}
  }
};

export default secureStorage;
