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
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  timezone: string;
  location: string;
  type: 'Simple' | 'Standard' | 'Advance';
  status: string;
  attendees: number;
  crew: number;
  organizers: number;
  delegates: number;
  sessions: number;
  speakers: number;
  analytics: EventAnalytics;
}

export interface EventFormData {
  name: string;
  category: string;
  websiteUrl: string;
  location: string;
  startDate: string;
  endDate: string;
  timezone: string;
  type: 'Simple' | 'Standard' | 'Advance';
}
