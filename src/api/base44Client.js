import { createClient } from '@base44/sdk';

// Lazy initialization to prevent Base44 from loading in landing mode
let _base44Instance = null;
let _publicBase44Instance = null;

// Create a client with authentication required for protected routes (lazy)
export const base44 = new Proxy({}, {
  get(target, prop) {
    if (!_base44Instance) {
      _base44Instance = createClient({
        appId: "6875a318a0b2d879d617363b",
        requiresAuth: true
      });
    }
    return _base44Instance[prop];
  }
});

// Create a public client for checking auth status without forcing login (lazy)
export const publicBase44 = new Proxy({}, {
  get(target, prop) {
    if (!_publicBase44Instance) {
      _publicBase44Instance = createClient({
        appId: "6875a318a0b2d879d617363b",
        requiresAuth: false
      });
    }
    return _publicBase44Instance[prop];
  }
});
