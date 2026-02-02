import { X, BarChart3, TrendingUp, UserPlus, CheckCircle, Mail, MailOpen, MousePointerClick, AlertCircle, Users, Mic, MessageSquare, Briefcase } from 'lucide-react';
import { Event } from '@/types/event';
import { cn } from '@/lib/utils';

interface EventDetailPanelProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EventDetailPanel({ event, isOpen, onClose }: EventDetailPanelProps) {
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

  return (
    <>
      {/* Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-foreground/40 z-40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className={cn(
        "fixed top-0 right-0 h-full w-full max-w-md bg-card shadow-panel z-50 transition-transform duration-300 ease-out",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <BarChart3 className="w-5 h-5" />
                  <h2 className="font-bold">Event Analytics</h2>
                </div>
                <p className="text-sm opacity-90 line-clamp-2">{event.name}</p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-primary-foreground/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Registration Overview */}
            <div>
              <h3 className="text-sm font-bold text-card-foreground mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Registration Overview
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
                  <UserPlus className="w-6 h-6 text-primary mb-2" />
                  <p className="text-xs text-muted-foreground">Total Registered</p>
                  <p className="text-2xl font-bold text-card-foreground">{event.analytics.registered}</p>
                </div>
                <div className="bg-green-500/5 rounded-lg p-3 border border-green-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <span className="text-xs font-bold text-green-700">{checkInRate}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Checked In</p>
                  <p className="text-2xl font-bold text-card-foreground">{event.analytics.checkedIn}</p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-muted rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-muted-foreground">Check-in Progress</p>
                <p className="text-xs font-bold text-card-foreground">
                  {event.analytics.checkedIn} / {event.analytics.registered}
                </p>
              </div>
              <div className="h-2 bg-border rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
                  style={{ width: `${checkInRate}%` }}
                />
              </div>
            </div>

            {/* Mail Analytics */}
            <div>
              <h3 className="text-sm font-bold text-card-foreground mb-3 flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-600" />
                Email Campaign
              </h3>
              
              <div className="grid grid-cols-2 gap-3 mb-3">
                <StatCard 
                  icon={Mail} 
                  label="Sent" 
                  value={event.analytics.mailAnalytics.sent}
                  color="blue"
                />
                <StatCard 
                  icon={MailOpen} 
                  label="Opened" 
                  value={event.analytics.mailAnalytics.opened}
                  rate={openRate}
                  color="green"
                />
                <StatCard 
                  icon={MousePointerClick} 
                  label="Clicked" 
                  value={event.analytics.mailAnalytics.clicked}
                  rate={clickRate}
                  color="purple"
                />
                <StatCard 
                  icon={AlertCircle} 
                  label="Bounced" 
                  value={event.analytics.mailAnalytics.bounced}
                  rate={bounceRate}
                  color="orange"
                />
              </div>

              {/* Engagement Bars */}
              <div className="bg-muted rounded-lg p-3 space-y-3">
                <p className="text-xs font-medium text-muted-foreground">Engagement</p>
                <ProgressBar label="Open Rate" value={openRate} color="green" />
                <ProgressBar label="Click Rate" value={clickRate} color="purple" />
              </div>
            </div>

            {/* Participation */}
            <div className="bg-muted rounded-lg p-3">
              <h4 className="text-xs font-bold text-card-foreground mb-2">Participation</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <ParticipationRow icon={Users} label="Attendees" value={event.attendees} />
                <ParticipationRow icon={Mic} label="Speakers" value={event.speakers} />
                <ParticipationRow icon={MessageSquare} label="Sessions" value={event.sessions} />
                <ParticipationRow icon={Briefcase} label="Delegates" value={event.delegates} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function StatCard({ icon: Icon, label, value, rate, color }: { 
  icon: React.ElementType; 
  label: string; 
  value: number; 
  rate?: number;
  color: 'blue' | 'green' | 'purple' | 'orange';
}) {
  const colorClasses = {
    blue: 'bg-primary/10 text-primary border-primary/20',
    green: 'bg-green-500/10 text-green-600 border-green-500/20',
    purple: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    orange: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  };

  return (
    <div className={cn("rounded-lg p-3 border", colorClasses[color])}>
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-4 h-4" />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="text-lg font-bold text-card-foreground">{value}</p>
      {rate !== undefined && (
        <p className="text-xs font-medium mt-1">{rate}% rate</p>
      )}
    </div>
  );
}

function ProgressBar({ label, value, color }: { label: string; value: number; color: 'green' | 'purple' }) {
  const gradients = {
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-xs font-bold text-card-foreground">{value}%</p>
      </div>
      <div className="h-1.5 bg-border rounded-full overflow-hidden">
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
