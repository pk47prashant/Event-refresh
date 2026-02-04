import { Event } from '@/types/event';

export const sampleEvents: Event[] = [
  {
    id: 'evt-1',
    name: "Annual Tech Innovation Summit 2024: Exploring AI, Cloud Computing, and Digital Transformation",
    startDate: "2024-03-15T09:00:00",
    endDate: "2024-03-15T17:30:00",
    timezone: "Australia/Melbourne",
    location: "Melbourne Convention Centre, South Wharf VIC 3006",
    country: "Australia",
    address: "Melbourne Convention Centre, South Wharf VIC 3006",
    mode: "hybrid",
    type: "Standard",
    category: "Conference",
    websiteUrl: "events.example.com/tech-summit-2024/home",
    sessionRequired: true,
    commsRequired: true,
    surveyRequired: true,
    status: "5 days left",
    attendees: 450,
    crew: 25,
    organizers: 3,
    delegates: 120,
    sessions: 18,
    speakers: 32,
    analytics: {
      registered: 450,
      checkedIn: 387,
      mailAnalytics: {
        sent: 450,
        opened: 398,
        clicked: 245,
        bounced: 8
      }
    }
  },
  {
    id: 'evt-2',
    name: "Web Development Workshop: Modern React Patterns",
    startDate: "2024-03-10T14:00:00",
    endDate: "2024-03-10T16:00:00",
    timezone: "Australia/Sydney",
    location: "Tech Hub Sydney, 123 Pitt Street NSW 2000",
    country: "Australia",
    address: "123 Pitt Street NSW 2000",
    mode: "in-person",
    type: "Simple",
    category: "Workshop",
    websiteUrl: "events.example.com/web-workshop/home",
    sessionRequired: false,
    commsRequired: true,
    surveyRequired: true,
    status: "5 min left",
    attendees: 85,
    crew: 5,
    organizers: 1,
    delegates: 0,
    sessions: 3,
    speakers: 4,
    analytics: {
      registered: 85,
      checkedIn: 78,
      mailAnalytics: {
        sent: 85,
        opened: 72,
        clicked: 45,
        bounced: 2
      }
    }
  },
  {
    id: 'evt-3',
    name: "International Marketing Conference: Strategies for Global Growth",
    startDate: "2024-03-12T10:00:00",
    endDate: "2024-03-14T18:00:00",
    timezone: "Australia/Melbourne",
    location: "Crown Conference Centre, Southbank VIC 3006",
    country: "Australia",
    address: "Crown Conference Centre, Southbank VIC 3006",
    mode: "hybrid",
    type: "Advance",
    category: "Conference",
    websiteUrl: "events.example.com/marketing-conference/home",
    sessionRequired: true,
    commsRequired: true,
    surveyRequired: true,
    status: "Live",
    attendees: 680,
    crew: 42,
    organizers: 5,
    delegates: 215,
    sessions: 35,
    speakers: 58,
    analytics: {
      registered: 680,
      checkedIn: 612,
      mailAnalytics: {
        sent: 680,
        opened: 615,
        clicked: 423,
        bounced: 12
      }
    }
  },
  {
    id: 'evt-4',
    name: "Startup Pitch Night: Connect with Investors",
    startDate: "2024-02-28T18:00:00",
    endDate: "2024-02-28T21:00:00",
    timezone: "Australia/Brisbane",
    location: "Brisbane Startup Hub, Fortitude Valley QLD 4006",
    country: "Australia",
    address: "Brisbane Startup Hub, Fortitude Valley QLD 4006",
    mode: "in-person",
    type: "Standard",
    category: "Networking",
    websiteUrl: "events.example.com/startup-pitch/home",
    sessionRequired: true,
    commsRequired: true,
    surveyRequired: false,
    status: "Completed",
    attendees: 156,
    crew: 12,
    organizers: 2,
    delegates: 45,
    sessions: 8,
    speakers: 12,
    analytics: {
      registered: 156,
      checkedIn: 156,
      mailAnalytics: {
        sent: 156,
        opened: 142,
        clicked: 89,
        bounced: 3
      }
    }
  },
  {
    id: 'evt-5',
    name: "Design Thinking Masterclass: User-Centered Innovation",
    startDate: "2024-04-20T09:30:00",
    endDate: "2024-04-20T17:00:00",
    timezone: "Australia/Perth",
    location: "Perth Creative Space, 45 St Georges Terrace WA 6000",
    country: "Australia",
    address: "45 St Georges Terrace WA 6000",
    mode: "in-person",
    type: "Advance",
    category: "Workshop",
    websiteUrl: "events.example.com/design-masterclass/home",
    sessionRequired: true,
    commsRequired: false,
    surveyRequired: true,
    status: "Draft",
    attendees: 0,
    crew: 8,
    organizers: 2,
    delegates: 0,
    sessions: 6,
    speakers: 8,
    analytics: {
      registered: 0,
      checkedIn: 0,
      mailAnalytics: {
        sent: 0,
        opened: 0,
        clicked: 0,
        bounced: 0
      }
    }
  }
];
