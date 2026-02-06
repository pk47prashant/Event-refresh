export interface EventAnalytics {
  registered: number;
  checkedIn: number;
  mailAnalytics: {
    sent: number;
    opened: number;
    clicked: number;
    bounced: number;
  };
}

export interface Event {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  timezone: string;
  location: string;
  country: string;
  address: string;
  mode: 'in-person' | 'hybrid';
  type: 'Simple' | 'Standard' | 'Advance';
  status: string;
  category: string;
  websiteUrl: string;
  sessionRequired: boolean;
  commsRequired: boolean;
  surveyRequired: boolean;
  attendees: number;
  crew: number;
  organizers: number;
  delegates: number;
  sessions: number;
  speakers: number;
  analytics: EventAnalytics;
  archived?: boolean;
}

export interface EventFormData {
  name: string;
  category: string;
  websiteUrl: string;
  mode: 'in-person' | 'hybrid';
  country: string;
  address: string;
  timezone: string;
  startDate: string;
  endDate: string;
  type: 'Simple' | 'Standard' | 'Advance';
  sessionRequired: boolean;
  commsRequired: boolean;
  surveyRequired: boolean;
}

export interface EventUser {
  id: string;
  eventId: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: 'attendee' | 'delegate' | 'crew' | 'organizer' | 'manager' | 'speaker';
  customFields: Record<string, string>;
}

export interface EventSession {
  id: string;
  eventId: string;
  name: string;
  startTime: string;
  endTime: string;
  location?: string;
  description?: string;
}
