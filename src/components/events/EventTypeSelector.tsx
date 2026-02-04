import { X, Zap, Star, Rocket, Check } from 'lucide-react';

interface EventTypeSelectorProps {
  isOpen: boolean;
  onSelect: (type: 'Simple' | 'Standard' | 'Advance') => void;
  onClose: () => void;
}

const eventTypes = [
  {
    type: 'Simple' as const,
    title: 'Simple',
    icon: Zap,
    description: 'Basic event setup',
    tagline: 'Quick & Easy',
    features: [
      'Event User upload, Select or Add',
      'Guest Check-in with fixed details provide in upload',
      'Comms (post event)',
      'Survey (post event)',
    ],
  },
  {
    type: 'Standard' as const,
    title: 'Standard',
    icon: Star,
    description: 'Most popular choice',
    tagline: 'Most Popular',
    features: [
      'Event User upload, Select or Add',
      'Simple Web form to collect user information with RSVP yes/no',
      'Approve or Reject for uninvited user',
      'Guest Check-in with fixed details provide in upload',
      'Comms (pre & post event)',
      'Survey (post event)',
    ],
  },
  {
    type: 'Advance' as const,
    title: 'Advance',
    icon: Rocket,
    description: 'Full-featured events',
    tagline: 'Enterprise Ready',
    features: [
      'All Standard features',
      'Unlimited sessions',
      'Advanced analytics',
      'API access',
      'Priority support',
      'Custom integrations',
    ],
  },
];

export function EventTypeSelector({ isOpen, onSelect, onClose }: EventTypeSelectorProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-foreground/40 z-50 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
        <div className="bg-card rounded-xl shadow-panel w-full max-w-4xl animate-scale-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-6 py-4 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Select Event Type</h2>
                <p className="text-primary-foreground/80 text-sm mt-1">
                  Choose the type that best fits your event needs
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-primary-foreground/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Type Cards */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {eventTypes.map((eventType) => (
                <div
                  key={eventType.type}
                  className="border border-border rounded-xl p-5 hover:border-primary/50 hover:shadow-md transition-all duration-200 flex flex-col"
                >
                  {/* Icon & Title */}
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-3">
                      <eventType.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-card-foreground">{eventType.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{eventType.description}</p>
                  </div>

                  {/* Tagline */}
                  <div className="text-center mb-4">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      eventType.type === 'Standard' 
                        ? 'bg-status-live/10 text-status-live' 
                        : eventType.type === 'Advance'
                        ? 'bg-status-urgent/10 text-status-urgent'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {eventType.tagline}
                    </span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 mb-5 flex-1">
                    {eventType.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-status-live flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Select Button */}
                  <button
                    onClick={() => onSelect(eventType.type)}
                    className={`w-full py-2.5 rounded-lg font-medium text-sm transition-colors ${
                      eventType.type === 'Standard'
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'bg-muted text-card-foreground hover:bg-muted/80'
                    }`}
                  >
                    Select {eventType.title}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
