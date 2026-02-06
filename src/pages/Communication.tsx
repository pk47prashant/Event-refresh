import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, UserCheck, Crown, Briefcase, Mic, Mail, Search } from 'lucide-react';
import { useState } from 'react';
import { Event, EventUser } from '@/types/event';
import { getEventUsers } from '@/data/eventUsers';
import { sampleEvents } from '@/data/events';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type UserRole = 'attendee' | 'delegate' | 'organizer' | 'manager' | 'speaker' | 'crew';

const roleConfig: Record<UserRole, { label: string; pluralLabel: string; icon: React.ElementType; color: string }> = {
  attendee: {
    label: 'Attendee',
    pluralLabel: 'Attendees',
    icon: Users,
    color: 'bg-primary/10 text-primary border-primary/20',
  },
  delegate: {
    label: 'Delegate',
    pluralLabel: 'Delegates',
    icon: UserCheck,
    color: 'bg-stat-delegates/10 text-stat-delegates border-stat-delegates/20',
  },
  organizer: {
    label: 'Organizer',
    pluralLabel: 'Organizers',
    icon: Crown,
    color: 'bg-stat-organizers/10 text-stat-organizers border-stat-organizers/20',
  },
  manager: {
    label: 'Manager',
    pluralLabel: 'Managers',
    icon: Briefcase,
    color: 'bg-stat-crew/10 text-stat-crew border-stat-crew/20',
  },
  speaker: {
    label: 'Speaker',
    pluralLabel: 'Speakers',
    icon: Mic,
    color: 'bg-stat-speakers/10 text-stat-speakers border-stat-speakers/20',
  },
  crew: {
    label: 'Event Crew',
    pluralLabel: 'Event Crew',
    icon: Briefcase,
    color: 'bg-stat-crew/10 text-stat-crew border-stat-crew/20',
  },
};

function UserRow({ user }: { user: EventUser }) {
  const config = roleConfig[user.userType as UserRole] ?? roleConfig.attendee;
  const Icon = config.icon;

  return (
    <div className="flex items-center justify-between gap-4 py-3 px-4 rounded-lg hover:bg-muted/50 transition-colors group">
      <div className="flex items-center gap-4 min-w-0">
        <div className={cn('p-2 rounded-lg shrink-0', config.color)}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <p className="font-medium text-card-foreground truncate">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-sm text-muted-foreground truncate">{user.email}</p>
        </div>
      </div>
      <Badge variant="secondary" className="shrink-0 text-xs">
        {config.label}
      </Badge>
      <button
        className="shrink-0 p-2 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
        title="Send email"
      >
        <Mail className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function Communication() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Get events from localStorage (same source as Index page)
  const events: Event[] = (() => {
    try {
      const saved = localStorage.getItem('events');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return sampleEvents.map((e) => ({ ...e, archived: false }));
  })();

  const event = events.find((e) => e.id === eventId);

  if (!event) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" onClick={() => navigate('/')} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="text-center py-12">
            <p className="text-muted-foreground">Event not found</p>
            <Button onClick={() => navigate('/')} className="mt-4">
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const allUsers = getEventUsers(event);

  // Filter users by search
  const filteredUsers = searchQuery.trim()
    ? allUsers.filter(
        (u) =>
          `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allUsers;

  // Group by role
  const roles: UserRole[] = ['attendee', 'delegate', 'organizer', 'manager', 'speaker', 'crew'];

  const usersByRole = roles.reduce(
    (acc, role) => {
      acc[role] = filteredUsers.filter((u) => u.userType === role);
      return acc;
    },
    {} as Record<UserRole, EventUser[]>
  );

  // Only show roles that have users (or all when no search filter)
  const rolesToShow = searchQuery.trim()
    ? roles
    : roles.filter((r) => usersByRole[r].length > 0);

  const totalFiltered = filteredUsers.length;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate('/')} className="mb-4 -ml-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Communication</h1>
              <p className="text-muted-foreground mt-1">{event.name}</p>
              <p className="text-sm text-muted-foreground">
                View and communicate with all users in this event
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-sm">
                {totalFiltered} total users
              </Badge>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* User groups by role */}
        <Accordion type="multiple" defaultValue={rolesToShow} className="space-y-2">
          {rolesToShow.map((role) => {
            const users = usersByRole[role];
            const config = roleConfig[role];
            const Icon = config.icon;

            return (
              <AccordionItem
                key={role}
                value={role}
                className="border border-border rounded-lg bg-card shadow-sm overflow-hidden"
              >
                <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className={cn('p-2 rounded-lg', config.color)}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <span className="font-semibold text-card-foreground">
                        {config.pluralLabel}
                      </span>
                      <Badge variant="outline" className="ml-2">
                        {users.length}
                      </Badge>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="border-t border-border divide-y divide-border">
                    {users.length === 0 ? (
                      <div className="py-8 text-center text-muted-foreground text-sm">
                        No {config.pluralLabel.toLowerCase()} found
                        {searchQuery && ' matching your search'}
                      </div>
                    ) : (
                      users.map((user) => <UserRow key={user.id} user={user} />)
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        {totalFiltered === 0 && (
          <div className="text-center py-12 border border-dashed border-border rounded-lg">
            <Users className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">
              No users found{searchQuery ? ' matching your search' : ' in this event yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
