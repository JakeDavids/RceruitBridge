import { base44, publicBase44 } from './base44Client';

// CRITICAL FIX: Export getters instead of direct references
// This prevents Base44 from initializing on import
// Base44 only initializes when these entities are actually USED

// Entity getters - these don't trigger Base44 until called
export const getAthlete = () => base44.entities.Athlete;
export const getSchool = () => base44.entities.School;
export const getCoach = () => base44.entities.Coach;
export const getOutreach = () => base44.entities.Outreach;
export const getTargetedSchool = () => base44.entities.TargetedSchool;
export const getCoachContact = () => base44.entities.CoachContact;
export const getQuestionnaireSubmission = () => base44.entities.QuestionnaireSubmission;
export const getSchoolConnection = () => base44.entities.SchoolConnection;
export const getCoaches = () => base44.entities.Coaches;
export const getOutreachLogs = () => base44.entities.OutreachLogs;
export const getMailThreads = () => base44.entities.MailThreads;
export const getMailbox = () => base44.entities.Mailbox;
export const getMailThread = () => base44.entities.MailThread;
export const getMessage = () => base44.entities.Message;
export const getEmailIdentity = () => base44.entities.EmailIdentity;
export const getFeatureFlag = () => base44.entities.FeatureFlag;
export const getMailMessages = () => base44.entities.MailMessages;
export const getEmailAliases = () => base44.entities.EmailAliases;
export const getEmail = () => base44.entities.Email;
export const getUserIdentity = () => base44.entities.UserIdentity;
export const getInboundMessage = () => base44.entities.InboundMessage;

// Auth getters - these don't trigger Base44 until called
export const getUser = () => base44.auth;
export const getPublicUser = () => publicBase44.auth;

// Backward compatibility exports - these still work but trigger Base44 immediately
// TODO: Remove these once all code is updated to use getters
export const Athlete = base44.entities.Athlete;
export const School = base44.entities.School;
export const Coach = base44.entities.Coach;
export const Outreach = base44.entities.Outreach;
export const TargetedSchool = base44.entities.TargetedSchool;
export const CoachContact = base44.entities.CoachContact;
export const QuestionnaireSubmission = base44.entities.QuestionnaireSubmission;
export const SchoolConnection = base44.entities.SchoolConnection;
export const Coaches = base44.entities.Coaches;
export const OutreachLogs = base44.entities.OutreachLogs;
export const MailThreads = base44.entities.MailThreads;
export const Mailbox = base44.entities.Mailbox;
export const MailThread = base44.entities.MailThread;
export const Message = base44.entities.Message;
export const EmailIdentity = base44.entities.EmailIdentity;
export const FeatureFlag = base44.entities.FeatureFlag;
export const MailMessages = base44.entities.MailMessages;
export const EmailAliases = base44.entities.EmailAliases;
export const Email = base44.entities.Email;
export const UserIdentity = base44.entities.UserIdentity;
export const InboundMessage = base44.entities.InboundMessage;
export const User = base44.auth;
export const PublicUser = publicBase44.auth;
