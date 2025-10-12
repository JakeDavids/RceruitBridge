import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required for protected routes
export const base44 = createClient({
  appId: "6875a318a0b2d879d617363b",
  requiresAuth: true // Ensure authentication is required for all operations
});

// Create a public client for checking auth status without forcing login
export const publicBase44 = createClient({
  appId: "6875a318a0b2d879d617363b",
  requiresAuth: false // Allow checking auth status on public pages
});
