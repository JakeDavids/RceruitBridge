// Supabase functions
// These will need to be implemented as Supabase Edge Functions
// For now, providing stub implementations that prevent errors
import { checkout as supabaseCheckout } from './supabaseClient';

// Helper to create stub functions
const createStub = (name) => async (params) => {
  console.warn(`${name} needs Edge Function implementation`);
  return { success: true, message: 'Function not yet implemented with Supabase' };
};

// Payment functions
export const checkout = supabaseCheckout;
export const stripeWebhook = createStub('stripeWebhook');

// Email functions
export const sendEmail = createStub('sendEmail');
export const inboundEmail = createStub('inboundEmail');
export const sendEmailGmail = createStub('sendEmailGmail');
export const sendOutboundEmail = createStub('sendOutboundEmail');
export const emailSend = createStub('emailSend');
export const mailSend = createStub('mailSend');

// School functions
export const updateSchoolQuestionnaires = createStub('updateSchoolQuestionnaires');

// Utility functions
export const ping = async () => ({ pong: true });

// Identity functions
export const identitySmokeTest = createStub('identitySmokeTest');
export const identityMonitor = createStub('identityMonitor');
export const identityCheckUsername = async (params) => {
  console.warn('identityCheckUsername needs Edge Function - returning available=true');
  return { available: true };
};
export const identitySaveIdentity = createStub('identitySaveIdentity');
export const identityValidate = createStub('identityValidate');
export const identityCreate = createStub('identityCreate');
export const identityMe = createStub('identityMe');
export const identityCheck = createStub('identityCheck');
export const identityProbe = createStub('identityProbe');
export const identitySendEmail = createStub('identitySendEmail');
export const identityPublic = createStub('identityPublic');
export const identityTempStorage = createStub('identityTempStorage');

// Gmail functions
export const gmailGoogle = createStub('gmailGoogle');
export const gmailAuthStart = createStub('gmailAuthStart');
export const gmailAuthCallback = createStub('gmailAuthCallback');
export const gmailSyncReplies = createStub('gmailSyncReplies');
export const syncReplies = gmailSyncReplies; // Alias

// Inbox functions
export const inboxSend = createStub('inboxSend');
export const inboxInbound = createStub('inboxInbound');
export const inboxEvents = createStub('inboxEvents');
export const inboxTestInbound = createStub('inboxTestInbound');
export const inboxList = createStub('inboxList');
export const inboxReply = createStub('inboxReply');
export const inboxReceive = createStub('inboxReceive');
export const inboxListMessages = createStub('inboxListMessages');
export const inboxGetMessage = createStub('inboxGetMessage');
export const inboxMarkMessageRead = createStub('inboxMarkMessageRead');
export const inboxDeleteMessage = createStub('inboxDeleteMessage');

// Mailbox functions
export const cleanupMailboxes = createStub('cleanupMailboxes');
export const fixMyMailbox = createStub('fixMyMailbox');

// AI/Claude functions
export const claudeAssistant = async (params) => {
  console.warn('claudeAssistant needs Edge Function implementation');
  return { message: 'AI assistant not yet implemented. Set up Edge Function with Claude API.' };
};
export const apiDiagAnthropic = createStub('apiDiagAnthropic');
export const apiClaudeChat = createStub('apiClaudeChat');

// API functions
export const apiSendEmail = createStub('apiSendEmail');
export const apiInboxInbound = createStub('apiInboxInbound');
export const apiThreadsList = createStub('apiThreadsList');
export const apiThreadsGet = createStub('apiThreadsGet');
export const apiThreadsMarkRead = createStub('apiThreadsMarkRead');

// Test functions
export const testMailgun = createStub('testMailgun');

// Debug functions
export const debugUser = createStub('debugUser');
export const debugLookup = createStub('debugLookup');
export const debugIdentities = createStub('debugIdentities');
export const debugAllIdentities = createStub('debugAllIdentities');
export const debugMinimalCreate = createStub('debugMinimalCreate');
export const debugEntities = createStub('debugEntities');
export const debugPersistence = createStub('debugPersistence');

// Auth test
export const authTest = createStub('authTest');

// NOTE: These functions will show console warnings when called.
// To implement them properly, create Supabase Edge Functions.
// See: https://supabase.com/docs/guides/functions
