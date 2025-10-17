// MOCK MODE: Completely disable Base44 client to prevent authentication redirects
// This file now returns mock objects instead of real Base44 clients

console.log('[MOCK] base44Client.js loaded - returning mock clients');

// Mock base44 client that returns mock objects for all properties
export const base44 = new Proxy({}, {
  get(target, prop) {
    console.log(`[MOCK] base44.${String(prop)} accessed - returning mock`);

    // Return mock auth object
    if (prop === 'auth') {
      return {
        async me() {
          console.log('[MOCK] base44.auth.me() called - returning mock user');
          return {
            id: 'mock-user-id',
            email: 'athlete@mock.com',
            plan: 'free',
            emailUsername: null,
            emailDomain: null,
            gmailLinked: false,
            profile_picture_url: null
          };
        },
        async login() {
          console.log('[MOCK] base44.auth.login() called - no-op');
          return null;
        },
        async logout() {
          console.log('[MOCK] base44.auth.logout() called - redirecting home');
          window.location.href = '/';
        }
      };
    }

    // Return mock entities object
    if (prop === 'entities') {
      return new Proxy({}, {
        get(target, entityName) {
          console.log(`[MOCK] base44.entities.${String(entityName)} accessed - returning mock entity`);
          return {
            async all() {
              console.log(`[MOCK] ${String(entityName)}.all() - returning []`);
              return [];
            },
            async list() {
              console.log(`[MOCK] ${String(entityName)}.list() - returning []`);
              return [];
            },
            async filter(params) {
              console.log(`[MOCK] ${String(entityName)}.filter() - returning []`, params);
              return [];
            },
            async get(id) {
              console.log(`[MOCK] ${String(entityName)}.get(${id}) - returning null`);
              return null;
            },
            async create(data) {
              console.log(`[MOCK] ${String(entityName)}.create() - returning mock`, data);
              return { id: `mock-${Date.now()}`, ...data };
            },
            async update(id, data) {
              console.log(`[MOCK] ${String(entityName)}.update(${id}) - returning mock`, data);
              return { id, ...data };
            },
            async delete(id) {
              console.log(`[MOCK] ${String(entityName)}.delete(${id}) - no-op`);
              return { success: true };
            }
          };
        }
      });
    }

    // Return mock integrations object
    if (prop === 'integrations') {
      return new Proxy({}, {
        get(target, integrationName) {
          console.log(`[MOCK] base44.integrations.${String(integrationName)} accessed - returning mock integration`);
          return new Proxy({}, {
            get(target, methodName) {
              return async (params) => {
                console.log(`[MOCK] base44.integrations.${String(integrationName)}.${String(methodName)}() called`, params);

                // Special handling for InvokeLLM
                if (methodName === 'InvokeLLM') {
                  return "This is a mock AI-generated response. In production, this would call Claude API to generate email content.";
                }

                return { success: true, data: null };
              };
            }
          });
        }
      });
    }

    // Return mock functions object
    if (prop === 'functions') {
      return new Proxy({}, {
        get(target, functionName) {
          return async (params) => {
            console.log(`[MOCK] base44.functions.${String(functionName)}() called`, params);
            return { success: true, data: null };
          };
        }
      });
    }

    // Default: return empty object
    return {};
  }
});

// Mock publicBase44 client (same as base44 in mock mode)
export const publicBase44 = base44;

// ORIGINAL CODE (commented out to prevent Base44 initialization):
/*
import { createClient } from '@base44/sdk';

let _base44Instance = null;
let _publicBase44Instance = null;

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
*/
