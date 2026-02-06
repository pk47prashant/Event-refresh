import { Event, EventUser } from '@/types/event';

// Sample first names and last names for generating mock users
const firstNames = [
  'James', 'Emma', 'Oliver', 'Ava', 'Noah', 'Sophia', 'Liam', 'Isabella',
  'Mason', 'Mia', 'Ethan', 'Charlotte', 'Alexander', 'Amelia', 'William',
  'Harper', 'Benjamin', 'Evelyn', 'Lucas', 'Abigail', 'Henry', 'Emily',
  'Sebastian', 'Elizabeth', 'Jack', 'Sofia', 'Aiden', 'Avery', 'Owen',
  'Ella', 'Samuel', 'Scarlett', 'Matthew', 'Grace', 'Joseph', 'Chloe',
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
  'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Wilson',
  'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee',
  'Perez', 'Thompson', 'White', 'Harris', 'Clark', 'Lewis', 'Robinson',
  'Walker', 'Young', 'Hall', 'Allen', 'King', 'Wright', 'Scott',
];

// Deterministic seed from string
function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function generateUsers(
  eventId: string,
  userType: EventUser['userType'],
  count: number
): EventUser[] {
  const users: EventUser[] = [];
  const seed = hash(`${eventId}-${userType}`);
  for (let i = 0; i < count; i++) {
    const fi = (seed + i * 7) % firstNames.length;
    const li = (seed + i * 11) % lastNames.length;
    const firstName = firstNames[fi];
    const lastName = lastNames[li];
    users.push({
      id: `user-${eventId}-${userType}-${i}`,
      eventId,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${i}@example.com`,
      userType,
      customFields: {},
    });
  }
  return users;
}

export function getEventUsers(event: Event): EventUser[] {
  const users: EventUser[] = [];
  // Map crew to manager for display
  const managerCount = Math.min(event.crew, 10); // Cap for display
  const organizerCount = Math.min(event.organizers, 10);
  const delegateCount = Math.min(event.delegates, 15);
  const speakerCount = Math.min(event.speakers, 15);
  const attendeeCount = Math.min(event.attendees, 20); // Sample of attendees

  users.push(...generateUsers(event.id, 'attendee', attendeeCount));
  users.push(...generateUsers(event.id, 'delegate', delegateCount));
  users.push(...generateUsers(event.id, 'organizer', organizerCount));
  users.push(...generateUsers(event.id, 'manager', managerCount));
  users.push(...generateUsers(event.id, 'speaker', speakerCount));

  return users;
}
