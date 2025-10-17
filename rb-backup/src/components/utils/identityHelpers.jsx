import { base44 } from "@/api/base44Client";

/**
 * Check if a username is available
 * @param {string} username - The username to check
 * @returns {Promise<{available: boolean, valid: boolean, reason?: string}>}
 */
export async function checkUsernameAvailability(username) {
  try {
    const response = await base44.functions.invoke('identity/public', {
      op: 'check',
      username: username
    });

    if (response.data?.ok) {
      return {
        available: response.data.available,
        valid: true,
        username: response.data.username
      };
    } else {
      return {
        available: false,
        valid: false,
        reason: response.data?.detail || 'Invalid username format'
      };
    }
  } catch (error) {
    console.error('Username check failed:', error);
    return {
      available: false,
      valid: false,
      reason: 'Network error - please try again'
    };
  }
}

/**
 * Create a new email identity for the user
 * @param {string} username - The desired username (e.g., 'john' for john@recruitbridge.net)
 * @param {string} displayName - The user's display name for emails
 * @returns {Promise<{ok: boolean, identity?: object, error?: string}>}
 */
export async function createEmailIdentity(username, displayName) {
  try {
    const response = await base44.functions.invoke('identity/public', {
      op: 'create',
      username: username.trim().toLowerCase(),
      displayName: displayName.trim()
    });

    if (response.data?.ok && response.data?.identity) {
      return {
        ok: true,
        identity: response.data.identity,
        mailbox: response.data.mailbox
      };
    } else {
      return {
        ok: false,
        error: response.data?.detail || 'Failed to create email identity'
      };
    }
  } catch (error) {
    console.error('Identity creation failed:', error);
    return {
      ok: false,
      error: error.message || 'Network error - please try again'
    };
  }
}

/**
 * Get the current user's email identity
 * @returns {Promise<{ok: boolean, identity?: object, error?: string}>}
 */
export async function getMyIdentity() {
  try {
    const response = await base44.functions.invoke('identity/public', {
      op: 'me'
    });

    if (response.data?.ok) {
      return {
        ok: true,
        identity: response.data.identity,
        mailbox: response.data.mailbox
      };
    } else {
      return {
        ok: false,
        error: response.data?.detail || 'Failed to fetch identity'
      };
    }
  } catch (error) {
    console.error('Identity fetch failed:', error);
    return {
      ok: false,
      error: error.message || 'Network error - please try again'
    };
  }
}

/**
 * Send an email through the user's identity
 * @param {object} params - Email parameters
 * @param {string} params.to - Recipient email address
 * @param {string} params.subject - Email subject
 * @param {string} params.text - Plain text body
 * @param {string} params.html - HTML body (optional)
 * @returns {Promise<{ok: boolean, messageId?: string, error?: string}>}
 */
export async function sendEmail({ to, subject, text, html }) {
  try {
    const response = await base44.functions.invoke('email/send', {
      to,
      subject,
      text,
      html
    });

    if (response.data?.ok) {
      return {
        ok: true,
        messageId: response.data.messageId,
        from: response.data.from
      };
    } else {
      return {
        ok: false,
        error: response.data?.detail || 'Failed to send email'
      };
    }
  } catch (error) {
    console.error('Email send failed:', error);
    return {
      ok: false,
      error: error.message || 'Network error - please try again'
    };
  }
}

/**
 * Cleanup duplicate identities (admin operation)
 * @returns {Promise<{ok: boolean, kept?: string, deleted?: number, error?: string}>}
 */
export async function cleanupDuplicateIdentities() {
  try {
    const response = await base44.functions.invoke('identity/public', {
      op: 'cleanup'
    });

    if (response.data?.ok) {
      return {
        ok: true,
        kept: response.data.kept,
        deleted: response.data.deleted,
        message: response.data.message
      };
    } else {
      return {
        ok: false,
        error: response.data?.detail || 'Cleanup failed'
      };
    }
  } catch (error) {
    console.error('Cleanup failed:', error);
    return {
      ok: false,
      error: error.message || 'Network error - please try again'
    };
  }
}

/**
 * Inspect all identities and mailboxes for the current user (debugging)
 * @returns {Promise<{ok: boolean, data?: object, error?: string}>}
 */
export async function inspectMyIdentities() {
  try {
    const response = await base44.functions.invoke('identity/public', {
      op: 'inspect'
    });

    if (response.data?.ok) {
      return {
        ok: true,
        data: response.data
      };
    } else {
      return {
        ok: false,
        error: response.data?.detail || 'Inspection failed'
      };
    }
  } catch (error) {
    console.error('Inspection failed:', error);
    return {
      ok: false,
      error: error.message || 'Network error - please try again'
    };
  }
}

/**
 * Validate username format (client-side check before API call)
 * @param {string} username - The username to validate
 * @returns {{valid: boolean, reason?: string}}
 */
export function validateUsernameFormat(username) {
  const u = (username || "").trim().toLowerCase();
  
  if (!u) {
    return { valid: false, reason: "Username cannot be empty" };
  }
  
  if (u.length < 3 || u.length > 64) {
    return { valid: false, reason: "Username must be 3-64 characters" };
  }
  
  if (!/^[a-z0-9._-]+$/.test(u)) {
    return { valid: false, reason: "Use only lowercase letters, numbers, dots, dashes, underscores" };
  }
  
  if (/^[._-]/.test(u) || /[._-]$/.test(u)) {
    return { valid: false, reason: "Cannot start or end with special characters" };
  }
  
  if (/\.\./.test(u)) {
    return { valid: false, reason: "Cannot have consecutive dots" };
  }
  
  const reserved = ["postmaster", "abuse", "admin", "support", "help", "no-reply", "noreply", "mailer-daemon", "root", "system", "api", "mg", "in"];
  if (reserved.includes(u)) {
    return { valid: false, reason: "This username is reserved" };
  }
  
  return { valid: true };
}