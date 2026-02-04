import { Calendar, MapPin, Users, UserCheck, Crown, Briefcase, MessageSquare, Mic, Circle, Edit, Archive, ArchiveRestore } from 'lucide-react';
import { Event } from '@/types/event';
import { cn } from '@/lib/utils';

interface EventCardProps {
  event: Event;
  onViewDetails: (event: Event) => void;
  onEdit: (event: Event) => void;
  onArchive?: (eventId: string) => void;
  onUnarchive?: (eventId: string) => void;
}

const formatDate = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const dateOptions: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
  
  const startDateStr = start.toLocaleDateString('en-US', dateOptions);
  const endDateStr = end.toLocaleDateString('en-US', dateOptions);
  const startTimeStr = start.toLocaleTimeString('en-US', timeOptions);
  const endTimeStr = end.toLocaleTimeString('en-US', timeOptions);
  
  if (startDateStr === endDateStr) {
    return `${startDateStr} • ${startTimeStr} - ${endTimeStr}`;
  }
  return `${startDateStr} - ${endDateStr}`;
};

const getStatusClasses = (status: string) => {
  if (status === "Live") {
    return "bg-status-live text-status-live-foreground";
  } else if (status === "Completed") {
    return "bg-status-completed text-status-completed-foreground";
  } else if (status === "Draft") {
    return "bg-status-draft text-status-draft-foreground";
  } else if (status.includes("min")) {
    return "bg-status-urgent text-status-urgent-foreground animate-pulse-soft";
  }
  return "bg-status-countdown text-status-countdown-foreground";
};

const getTypeClasses = (type: Event['type']) => {
  const classes = {
    Simple: "bg-type-simple text-type-simple-foreground border-type-simple-border",
    Standard: "bg-type-standard text-type-standard-foreground border-type-standard-border",
    Advance: "bg-type-advance text-type-advance-foreground border-type-advance-border"
  };
  return classes[type];
};

const getProgressGradient = (status: string) => {
  if (status === "Live") return "from-green-400 to-green-600";
  if (status === "Completed") return "from-primary to-primary/80";
  if (status === "Draft") return "from-gray-300 to-gray-400";
  if (status.includes("min")) return "from-orange-400 to-orange-600";
  return "from-primary to-primary/80";
};

const isFutureEvent = (status: string) => !['Completed', 'Live'].includes(status);

export function EventCard({ event, onViewDetails, onEdit, onArchive, onUnarchive }: EventCardProps) {
  const stats = [
    { icon: Users, value: event.attendees, color: "text-stat-attendees", bg: "bg-primary/10" },
    { icon: UserCheck, value: event.crew, color: "text-stat-crew", bg: "bg-purple-500/10" },
    { icon: Crown, value: event.organizers, color: "text-stat-organizers", bg: "bg-amber-500/10" },
  ];

  const showArchiveButton = onArchive && !event.archived && event.status !== "Live";
  const showUnarchiveButton = onUnarchive && event.archived;

  return (
    <div className="group bg-card rounded-lg shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden border border-border">
      {/* Status Bar */}
      <div className="h-1 bg-muted">
        <div 
          className={cn("h-full bg-gradient-to-r transition-all", getProgressGradient(event.status))}
          style={{ width: event.status === "Completed" ? "100%" : "60%" }}
        />
      </div>

      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className={cn("px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1", getStatusClasses(event.status))}>
            {event.status === "Live" && <Circle className="w-1.5 h-1.5 fill-current" />}
            <span>{event.status}</span>
          </div>
          <div className={cn("px-2 py-0.5 rounded text-xs font-medium border", getTypeClasses(event.type))}>
            {event.type}
          </div>
        </div>

        {/* Event Name */}
        <h3 className="text-sm font-semibold text-card-foreground mb-3 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
          {event.name}
        </h3>

        {/* Date & Location */}
        <div className="space-y-1.5 mb-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{formatDate(event.startDate, event.endDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-3 py-2 border-t border-border">
          {stats.map(({ icon: Icon, value, color, bg }, index) => (
            <div key={index} className="flex items-center gap-1.5">
              <div className={cn("p-1 rounded", bg)}>
                <Icon className={cn("w-3 h-3", color)} />
              </div>
              <span className="text-xs font-medium text-card-foreground">{value}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5 ml-auto text-xs text-muted-foreground">
            <MessageSquare className="w-3 h-3" />
            <span>{event.sessions}</span>
            <Mic className="w-3 h-3 ml-1" />
            <span>{event.speakers}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 pt-3 border-t border-border">
          <div className="flex gap-2">
            {isFutureEvent(event.status) && !event.archived && (
              <button 
                onClick={() => onEdit(event)}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary border border-primary rounded-md hover:bg-primary/5 transition-colors"
              >
                <Edit className="w-3 h-3" />
                Edit
              </button>
            )}
            <button 
              onClick={() => onViewDetails(event)}
              className={cn(
                "flex items-center justify-center px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors",
                (isFutureEvent(event.status) && !event.archived) ? "flex-1" : "w-full"
              )}
            >
              View Details
            </button>
          </div>
          
          {/* Archive/Unarchive Button */}
          {showArchiveButton && (
            <button 
              onClick={() => onArchive(event.id)}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-orange-600 border border-orange-600 rounded-md hover:bg-orange-50 transition-colors"
            >
              <Archive className="w-3 h-3" />
              Archive
            </button>
          )}
          
          {showUnarchiveButton && (
            <button 
              onClick={() => onUnarchive(event.id)}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-600 border border-green-600 rounded-md hover:bg-green-50 transition-colors"
            >
              <ArchiveRestore className="w-3 h-3" />
              Unarchive
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
