import { useState } from 'react';
import { X, BarChart3, TrendingUp, UserPlus, CheckCircle, Mail, MailOpen, MousePointerClick, AlertCircle, Users, Mic, MessageSquare, Briefcase, Maximize2, Minimize2, Crown, UserCheck } from 'lucide-react';
import { Event } from '@/types/event';
import { cn } from '@/lib/utils';

interface EventDetailPanelProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}
export function EventDetailPanel({ event, isOpen, onClose }: EventDetailPanelProps) {
  const [isFullView, setIsFullView] = useState(false);

  if (!event) return null;

  const checkInRate = event.analytics.registered > 0 
    ? Math.round((event.analytics.checkedIn / event.analytics.registered) * 100) 
    : 0;

  const openRate = event.analytics.mailAnalytics.sent > 0
    ? Math.round((event.analytics.mailAnalytics.opened / event.analytics.mailAnalytics.sent) * 100)
    : 0;

  const clickRate = event.analytics.mailAnalytics.sent > 0
    ? Math.round((event.analytics.mailAnalytics.clicked / event.analytics.mailAnalytics.sent) * 100)
    : 0;

  const bounceRate = event.analytics.mailAnalytics.sent > 0
    ? Math.round((event.analytics.mailAnalytics.bounced / event.analytics.mailAnalytics.sent) * 100)
    : 0;

  const handleClose = () => {
    setIsFullView(false);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-foreground/40 z-40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={handleClose}
      />
      
      {/* Panel */}
      <div className={cn(
        "fixed bg-card shadow-panel z-50 transition-all duration-300 ease-out flex flex-col",
        isFullView 
          ? "inset-4 rounded-xl" 
          : "top-0 right-0 h-full w-full max-w-md",
        isOpen ? (isFullView ? "opacity-100 scale-100" : "translate-x-0") : (isFullView ? "opacity-0 scale-95" : "translate-x-full")
      )}>
        {/* Header */}
        <div className={cn(
          "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 shrink-0",
          isFullView && "rounded-t-xl"
        )}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 className="w-5 h-5" />
                <h2 className="font-bold">Event Analytics</h2>
              </div>
              <p className={cn("text-sm opacity-90", isFullView ? "" : "line-clamp-2")}>{event.name}</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsFullView(!isFullView)}
                className="p-1.5 hover:bg-primary-foreground/10 rounded-lg transition-colors"
                title={isFullView ? "Exit full view" : "Full view"}
              >
                {isFullView ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>
              <button
                onClick={handleClose}
                className="p-1.5 hover:bg-primary-foreground/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className={cn(
          "flex-1 overflow-y-auto p-4",
          isFullView ? "p-6" : "p-4"
        )}>
          <div className={cn(
            isFullView ? "grid grid-cols-1 lg:grid-cols-2 gap-6" : "space-y-4"
          )}>
            {/* Left Column in Full View */}
            <div className="space-y-4">
              {/* Registration Overview */}
              <div>
                <h3 className={cn(
                  "font-bold text-card-foreground mb-3 flex items-center gap-2",
                  isFullView ? "text-base" : "text-sm"
                )}>
                  <TrendingUp className={cn(isFullView ? "w-5 h-5" : "w-4 h-4", "text-primary")} />
                  Registration Overview
                </h3>
                <div className={cn("grid gap-3", isFullView ? "grid-cols-2" : "grid-cols-2")}>
                  <div className={cn("bg-primary/5 rounded-lg border border-primary/20", isFullView ? "p-4" : "p-3")}>
                    <UserPlus className={cn("text-primary mb-2", isFullView ? "w-8 h-8" : "w-6 h-6")} />
                    <p className="text-xs text-muted-foreground">Total Registered</p>
                    <p className={cn("font-bold text-card-foreground", isFullView ? "text-3xl" : "text-2xl")}>{event.analytics.registered}</p>
                  </div>
                  <div className={cn("bg-status-live/5 rounded-lg border border-status-live/20", isFullView ? "p-4" : "p-3")}>
                    <div className="flex items-center justify-between mb-2">
                      <CheckCircle className={cn("text-status-live", isFullView ? "w-8 h-8" : "w-6 h-6")} />
                      <span className={cn("font-bold text-status-live", isFullView ? "text-sm" : "text-xs")}>{checkInRate}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Checked In</p>
                    <p className={cn("font-bold text-card-foreground", isFullView ? "text-3xl" : "text-2xl")}>{event.analytics.checkedIn}</p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className={cn("bg-muted rounded-lg", isFullView ? "p-4" : "p-3")}>
                <div className="flex items-center justify-between mb-2">
                  <p className={cn("font-medium text-muted-foreground", isFullView ? "text-sm" : "text-xs")}>Check-in Progress</p>
                  <p className={cn("font-bold text-card-foreground", isFullView ? "text-sm" : "text-xs")}>
                    {event.analytics.checkedIn} / {event.analytics.registered}
                  </p>
                </div>
                <div className={cn("bg-border rounded-full overflow-hidden", isFullView ? "h-3" : "h-2")}>
                  <div 
                    className="h-full bg-gradient-to-r from-status-live to-status-live/80 transition-all duration-500"
                    style={{ width: `${checkInRate}%` }}
                  />
                </div>
              </div>

              {/* Participation - Show in left column for full view */}
              {isFullView && (
                <div className="bg-muted rounded-lg p-4">
                  <h4 className="text-sm font-bold text-card-foreground mb-3">Event Participation</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <ParticipationCard icon={Users} label="Attendees" value={event.attendees} color="primary" />
                    <ParticipationCard icon={UserCheck} label="Crew" value={event.crew} color="purple" />
                    <ParticipationCard icon={Crown} label="Organizers" value={event.organizers} color="amber" />
                    <ParticipationCard icon={Briefcase} label="Delegates" value={event.delegates} color="green" />
                    <ParticipationCard icon={MessageSquare} label="Sessions" value={event.sessions} color="indigo" />
                    <ParticipationCard icon={Mic} label="Speakers" value={event.speakers} color="rose" />
                  </div>
                </div>
              )}
            </div>

            {/* Right Column / Mail Analytics */}
            <div className="space-y-4">
              {/* Mail Analytics */}
              <div>
                <h3 className={cn(
                  "font-bold text-card-foreground mb-3 flex items-center gap-2",
                  isFullView ? "text-base" : "text-sm"
                )}>
                  <Mail className={cn(isFullView ? "w-5 h-5" : "w-4 h-4", "text-stat-crew")} />
                  Email Campaign
                </h3>
                
                <div className={cn("grid gap-3 mb-3", isFullView ? "grid-cols-2" : "grid-cols-2")}>
                  <StatCard 
                    icon={Mail} 
                    label="Sent" 
                    value={event.analytics.mailAnalytics.sent}
                    color="blue"
                    isFullView={isFullView}
                  />
                  <StatCard 
                    icon={MailOpen} 
                    label="Opened" 
                    value={event.analytics.mailAnalytics.opened}
                    rate={openRate}
                    color="green"
                    isFullView={isFullView}
                  />
                  <StatCard 
                    icon={MousePointerClick} 
                    label="Clicked" 
                    value={event.analytics.mailAnalytics.clicked}
                    rate={clickRate}
                    color="purple"
                    isFullView={isFullView}
                  />
                  <StatCard 
                    icon={AlertCircle} 
                    label="Bounced" 
                    value={event.analytics.mailAnalytics.bounced}
                    rate={bounceRate}
                    color="orange"
                    isFullView={isFullView}
                  />
                </div>

                {/* Engagement Bars */}
                <div className={cn("bg-muted rounded-lg space-y-3", isFullView ? "p-4" : "p-3")}>
                  <p className={cn("font-medium text-muted-foreground", isFullView ? "text-sm" : "text-xs")}>Engagement Metrics</p>
                  <ProgressBar label="Open Rate" value={openRate} color="green" isFullView={isFullView} />
                  <ProgressBar label="Click Rate" value={clickRate} color="purple" isFullView={isFullView} />
                  <ProgressBar label="Bounce Rate" value={bounceRate} color="orange" isFullView={isFullView} />
                </div>
              </div>

              {/* Participation - Compact view only */}
              {!isFullView && (
                <div className="bg-muted rounded-lg p-3">
                  <h4 className="text-xs font-bold text-card-foreground mb-2">Participation</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <ParticipationRow icon={Users} label="Attendees" value={event.attendees} />
                    <ParticipationRow icon={Mic} label="Speakers" value={event.speakers} />
                    <ParticipationRow icon={MessageSquare} label="Sessions" value={event.sessions} />
                    <ParticipationRow icon={Briefcase} label="Delegates" value={event.delegates} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function StatCard({ icon: Icon, label, value, rate, color, isFullView }: { 
  icon: React.ElementType; 
  label: string; 
  value: number; 
  rate?: number;
  color: 'blue' | 'green' | 'purple' | 'orange';
  isFullView?: boolean;
}) {
  const colorClasses = {
    blue: 'bg-primary/10 text-primary border-primary/20',
    green: 'bg-status-live/10 text-status-live border-status-live/20',
    purple: 'bg-stat-crew/10 text-stat-crew border-stat-crew/20',
    orange: 'bg-status-urgent/10 text-status-urgent border-status-urgent/20',
  };

  return (
    <div className={cn("rounded-lg border", colorClasses[color], isFullView ? "p-4" : "p-3")}>
      <div className="flex items-center gap-2 mb-1">
        <Icon className={cn(isFullView ? "w-5 h-5" : "w-4 h-4")} />
        <span className={cn("text-muted-foreground", isFullView ? "text-sm" : "text-xs")}>{label}</span>
      </div>
      <p className={cn("font-bold text-card-foreground", isFullView ? "text-2xl" : "text-lg")}>{value}</p>
      {rate !== undefined && (
        <p className={cn("font-medium mt-1", isFullView ? "text-sm" : "text-xs")}>{rate}% rate</p>
      )}
    </div>
  );
}

function ProgressBar({ label, value, color, isFullView }: { label: string; value: number; color: 'green' | 'purple' | 'orange'; isFullView?: boolean }) {
  const gradients = {
    green: 'from-status-live to-status-live/80',
    purple: 'from-stat-crew to-stat-crew/80',
    orange: 'from-status-urgent to-status-urgent/80',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <p className={cn("text-muted-foreground", isFullView ? "text-sm" : "text-xs")}>{label}</p>
        <p className={cn("font-bold text-card-foreground", isFullView ? "text-sm" : "text-xs")}>{value}%</p>
      </div>
      <div className={cn("bg-border rounded-full overflow-hidden", isFullView ? "h-2" : "h-1.5")}>
        <div 
          className={cn("h-full bg-gradient-to-r", gradients[color])}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function ParticipationRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: number }) {
  return (
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-muted-foreground">{label}</span>
      </div>
      <span className="font-semibold text-card-foreground">{value}</span>
    </div>
  );
}

function ParticipationCard({ icon: Icon, label, value, color }: { 
  icon: React.ElementType; 
  label: string; 
  value: number;
  color: 'primary' | 'purple' | 'amber' | 'green' | 'indigo' | 'rose';
}) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    purple: 'bg-stat-crew/10 text-stat-crew',
    amber: 'bg-stat-organizers/10 text-stat-organizers',
    green: 'bg-stat-delegates/10 text-stat-delegates',
    indigo: 'bg-stat-sessions/10 text-stat-sessions',
    rose: 'bg-stat-speakers/10 text-stat-speakers',
  };

  return (
    <div className="flex items-center gap-3 p-2 rounded-lg bg-card">
      <div className={cn("p-2 rounded-lg", colorClasses[color])}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-lg font-bold text-card-foreground">{value}</p>
      </div>
    </div>
  );
}
