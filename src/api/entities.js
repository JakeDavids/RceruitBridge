// TEMPORARY: Use mock entities to prevent Base44 initialization
// This allows the app to load without Base44 authentication
// TO RE-ENABLE BASE44: Uncomment the line below and comment out the mock import
// import { base44, publicBase44 } from './base44Client';

// Import mock entities instead of real Base44 entities
export {
  User,
  PublicUser,
  Athlete,
  School,
  Coach,
  Outreach,
  TargetedSchool,
  CoachContact,
  QuestionnaireSubmission,
  SchoolConnection,
  Coaches,
  OutreachLogs,
  MailThreads,
  Mailbox,
  MailThread,
  Message,
  EmailIdentity,
  FeatureFlag,
  MailMessages,
  EmailAliases,
  Email,
  UserIdentity,
  InboundMessage,
} from './mockEntities';

// ORIGINAL CODE (commented out to prevent Base44 initialization):
// import { base44, publicBase44 } from './base44Client';
// export const Athlete = base44.entities.Athlete;
// export const School = base44.entities.School;
// export const Coach = base44.entities.Coach;
// export const Outreach = base44.entities.Outreach;
// export const TargetedSchool = base44.entities.TargetedSchool;
// export const CoachContact = base44.entities.CoachContact;
// export const QuestionnaireSubmission = base44.entities.QuestionnaireSubmission;
// export const SchoolConnection = base44.entities.SchoolConnection;
// export const Coaches = base44.entities.Coaches;
// export const OutreachLogs = base44.entities.OutreachLogs;
// export const MailThreads = base44.entities.MailThreads;
// export const Mailbox = base44.entities.Mailbox;
// export const MailThread = base44.entities.MailThread;
// export const Message = base44.entities.Message;
// export const EmailIdentity = base44.entities.EmailIdentity;
// export const FeatureFlag = base44.entities.FeatureFlag;
// export const MailMessages = base44.entities.MailMessages;
// export const EmailAliases = base44.entities.EmailAliases;
// export const Email = base44.entities.Email;
// export const UserIdentity = base44.entities.UserIdentity;
// export const InboundMessage = base44.entities.InboundMessage;
// export const User = base44.auth;
// export const PublicUser = publicBase44.auth;
