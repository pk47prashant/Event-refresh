import { Event } from '@/types/event';

const now = new Date();
const tomorrow = new Date(now);
tomorrow.setDate(now.getDate() + 1);

const nextWeek = new Date(now);
nextWeek.setDate(now.getDate() + 7);

const lastWeek = new Date(now);
lastWeek.setDate(now.getDate() - 7);

const lastMonth = new Date(now);
lastMonth.setMonth(now.getMonth() - 1);

export const sampleEvents: Event[] = [
  // Live Events
  {
    id: '1',
    name: 'Global Tech Summit 2026',
    category: 'Conference',
    websiteUrl: 'techsummit.com',
    mode: 'hybrid',
    country: 'United States',
    address: 'San Francisco Convention Center',
    timezone: 'PST',
    startDate: new Date(now.getTime() - 3600000).toISOString(), // Started 1 hour ago
    endDate: new Date(now.getTime() + 7200000).toISOString(), // Ends in 2 hours
    type: 'Advance',
    status: 'Live',
    attendees: 1250,
    crew: 45,
    organizers: 12,
    delegates: 85,
    sessions: 24,
    speakers: 32,
    analytics: {
      registered: 1500,
      checkedIn: 1100,
      mailAnalytics: { sent: 4500, opened: 3200, clicked: 1800, bounced: 45 }
    }
  },
  // Scheduled Events
  {
    id: '2',
    name: 'Product Design Workshop',
    category: 'Workshop',
    websiteUrl: 'designworkshop.io',
    mode: 'in-person',
    country: 'United Kingdom',
    address: 'London Design Studio',
    timezone: 'GMT',
    startDate: tomorrow.toISOString(),
    endDate: new Date(tomorrow.getTime() + 14400000).toISOString(),
    type: 'Standard',
    status: '24 hours left',
    attendees: 45,
    crew: 4,
    organizers: 2,
    delegates: 0,
    sessions: 4,
    speakers: 2,
    analytics: {
      registered: 50,
      checkedIn: 0,
      mailAnalytics: { sent: 200, opened: 150, clicked: 85, bounced: 2 }
    }
  },
  {
    id: '3',
    name: 'Marketing Strategy Seminar',
    category: 'Seminar',
    websiteUrl: 'marketing2026.com',
    mode: 'in-person',
    country: 'Australia',
    address: 'Sydney Business Hub',
    timezone: 'AEST',
    startDate: nextWeek.toISOString(),
    endDate: new Date(nextWeek.getTime() + 7200000).toISOString(),
    type: 'Simple',
    status: '7 days left',
    attendees: 120,
    crew: 6,
    organizers: 3,
    delegates: 10,
    sessions: 1,
    speakers: 1,
    analytics: {
      registered: 135,
      checkedIn: 0,
      mailAnalytics: { sent: 400, opened: 280, clicked: 120, bounced: 5 }
    }
  },
  // Draft Events
  {
    id: '4',
    name: 'Annual Partners Meeting',
    category: 'Networking',
    websiteUrl: 'partners2026.com',
    mode: 'in-person',
    country: 'Singapore',
    address: 'Marina Bay Sands',
    timezone: 'SGT',
    startDate: new Date(now.getTime() + 2592000000).toISOString(), // 30 days later
    endDate: new Date(now.getTime() + 2599200000).toISOString(),
    type: 'Standard',
    status: 'Draft',
    attendees: 0,
    crew: 0,
    organizers: 5,
    delegates: 0,
    sessions: 0,
    speakers: 0,
    analytics: {
      registered: 0,
      checkedIn: 0,
      mailAnalytics: { sent: 0, opened: 0, clicked: 0, bounced: 0 }
    }
  },
  {
    id: '5',
    name: 'AI Ethics Roundtable',
    category: 'Workshop',
    websiteUrl: 'aiethics.org',
    mode: 'hybrid',
    country: 'Germany',
    address: 'Berlin Tech Center',
    timezone: 'CET',
    startDate: new Date(now.getTime() + 1296000000).toISOString(), // 15 days later
    endDate: new Date(now.getTime() + 1303200000).toISOString(),
    type: 'Advance',
    status: 'Draft',
    attendees: 0,
    crew: 0,
    organizers: 2,
    delegates: 0,
    sessions: 0,
    speakers: 0,
    analytics: {
      registered: 0,
      checkedIn: 0,
      mailAnalytics: { sent: 0, opened: 0, clicked: 0, bounced: 0 }
    }
  },
  // Past Events
  {
    id: '6',
    name: 'Winter Developer Expo 2025',
    category: 'Conference',
    websiteUrl: 'devexpo2025.com',
    mode: 'in-person',
    country: 'Canada',
    address: 'Toronto Expo Center',
    timezone: 'EST',
    startDate: lastMonth.toISOString(),
    endDate: new Date(lastMonth.getTime() + 172800000).toISOString(),
    type: 'Advance',
    status: 'Completed',
    attendees: 2100,
    crew: 60,
    organizers: 15,
    delegates: 120,
    sessions: 48,
    speakers: 55,
    analytics: {
      registered: 2400,
      checkedIn: 2100,
      mailAnalytics: { sent: 12000, opened: 8500, clicked: 4200, bounced: 150 }
    }
  },
  {
    id: '7',
    name: 'Startup Pitch Night',
    category: 'Networking',
    websiteUrl: 'pitchnight.io',
    mode: 'in-person',
    country: 'United States',
    address: 'Austin Innovation Lab',
    timezone: 'CST',
    startDate: lastWeek.toISOString(),
    endDate: new Date(lastWeek.getTime() + 14400000).toISOString(),
    type: 'Simple',
    status: 'Completed',
    attendees: 85,
    crew: 4,
    organizers: 2,
    delegates: 5,
    sessions: 1,
    speakers: 8,
    analytics: {
      registered: 110,
      checkedIn: 85,
      mailAnalytics: { sent: 500, opened: 350, clicked: 180, bounced: 12 }
    }
  },
  // Archived Events
  {
    id: '8',
    name: 'Old Project Kickoff',
    category: 'Seminar',
    websiteUrl: 'oldproject.com',
    mode: 'in-person',
    country: 'France',
    address: 'Paris Office',
    timezone: 'CET',
    startDate: new Date(now.getTime() - 31536000000).toISOString(), // 1 year ago
    endDate: new Date(now.getTime() - 31528800000).toISOString(),
    type: 'Standard',
    status: 'Completed',
    archived: true,
    attendees: 25,
    crew: 2,
    organizers: 1,
    delegates: 0,
    sessions: 1,
    speakers: 2,
    analytics: {
      registered: 30,
      checkedIn: 25,
      mailAnalytics: { sent: 100, opened: 80, clicked: 45, bounced: 1 }
    }
  }
];
