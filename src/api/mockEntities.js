// MOCK ENTITIES - Replace Base44 entities with no-op versions
// This prevents Base44 initialization while we're testing without auth

// Mock user object
const mockUser = {
  id: 'mock-user-1',
  email: 'test@recruitbridge.app',
  profile_picture_url: null,
  plan: 'free',
  created_at: new Date().toISOString(),
};

// Mock athlete object
const mockAthlete = {
  id: 'mock-athlete-1',
  first_name: 'Test',
  last_name: 'Athlete',
  email: 'test@recruitbridge.app',
  created_by: 'test@recruitbridge.app',
  sport: 'Football',
  position: 'QB',
  grad_year: 2025,
  height: '6\'2"',
  weight: 185,
  gpa: 3.8,
};

// Create mock entity class
class MockEntity {
  constructor(name) {
    this.name = name;
  }

  async all() {
    console.log(`[MOCK] ${this.name}.all() called - returning empty array`);
    return [];
  }

  async filter(params) {
    console.log(`[MOCK] ${this.name}.filter() called with:`, params);
    return [];
  }

  async get(id) {
    console.log(`[MOCK] ${this.name}.get() called with id:`, id);
    return null;
  }

  async create(data) {
    console.log(`[MOCK] ${this.name}.create() called with:`, data);
    return { id: 'mock-id', ...data };
  }

  async update(id, data) {
    console.log(`[MOCK] ${this.name}.update() called with:`, id, data);
    return { id, ...data };
  }

  async delete(id) {
    console.log(`[MOCK] ${this.name}.delete() called with id:`, id);
    return true;
  }
}

// Mock User auth object
export const User = {
  async me() {
    console.log('[MOCK] User.me() called - returning mock user');
    return mockUser;
  },

  async login() {
    console.log('[MOCK] User.login() called - no-op');
    return mockUser;
  },

  async logout() {
    console.log('[MOCK] User.logout() called - redirecting to home');
    window.location.href = '/';
  },

  async signup(data) {
    console.log('[MOCK] User.signup() called with:', data);
    return mockUser;
  },
};

// Mock PublicUser (same as User for now)
export const PublicUser = {
  async me() {
    console.log('[MOCK] PublicUser.me() called - returning null (not authenticated)');
    return null;
  },
};

// Export mock entities
export const Athlete = new MockEntity('Athlete');
export const School = new MockEntity('School');
export const Coach = new MockEntity('Coach');
export const Outreach = new MockEntity('Outreach');
export const TargetedSchool = new MockEntity('TargetedSchool');
export const CoachContact = new MockEntity('CoachContact');
export const QuestionnaireSubmission = new MockEntity('QuestionnaireSubmission');
export const SchoolConnection = new MockEntity('SchoolConnection');
export const Coaches = new MockEntity('Coaches');
export const OutreachLogs = new MockEntity('OutreachLogs');
export const MailThreads = new MockEntity('MailThreads');
export const Mailbox = new MockEntity('Mailbox');
export const MailThread = new MockEntity('MailThread');
export const Message = new MockEntity('Message');
export const EmailIdentity = new MockEntity('EmailIdentity');
export const FeatureFlag = new MockEntity('FeatureFlag');
export const MailMessages = new MockEntity('MailMessages');
export const EmailAliases = new MockEntity('EmailAliases');
export const Email = new MockEntity('Email');
export const UserIdentity = new MockEntity('UserIdentity');
export const InboundMessage = new MockEntity('InboundMessage');

// Override Athlete.filter to return mock athlete when querying by email
const originalAthleteFilter = Athlete.filter.bind(Athlete);
Athlete.filter = async function(params) {
  if (params.created_by) {
    console.log('[MOCK] Athlete.filter() - returning mock athlete');
    return [mockAthlete];
  }
  return originalAthleteFilter(params);
};

console.log('[MOCK ENTITIES] All Base44 entities replaced with mocks. No Base44 calls will be made.');
