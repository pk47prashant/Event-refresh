import { useState, useEffect, useMemo } from 'react';
import { Plus, Search, ArrowUpDown } from 'lucide-react';
import { Event, EventFormData } from '@/types/event';
import { sampleEvents } from '@/data/events';
import { EventCard } from '@/components/events/EventCard';
import { EventDetailPanel } from '@/components/events/EventDetailPanel';
import { EventTypeSelector } from '@/components/events/EventTypeSelector';
import { EventFormModal } from '@/components/events/EventFormModal';
import { SessionsModal } from '@/components/events/SessionsModal';
import { EventUsersModal } from '@/components/events/EventUsersModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type WizardStep = 'type' | 'details' | 'sessions' | 'users' | null;
type TabType = 'live' | 'upcoming' | 'past' | 'archived';
type SortOption = 'startDate' | 'name';

const Index = () => {
  const [events, setEvents] = useState<Event[]>(sampleEvents.map(e => ({ ...e, archived: false })));
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('live');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('startDate');
  
  // Wizard state
  const [wizardStep, setWizardStep] = useState<WizardStep>(null);
  const [selectedType, setSelectedType] = useState<'Simple' | 'Standard' | 'Advance'>('Standard');
  const [formData, setFormData] = useState<EventFormData | null>(null);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [formEvent, setFormEvent] = useState<{ name: string; type: 'Simple' | 'Standard' | 'Advance' } | null>(null);

  // Update event statuses based on current time
  useEffect(() => {
    const updateEventStatuses = () => {
      const now = new Date();
      setEvents(prevEvents => 
        prevEvents.map(event => {
          if (event.archived) return event;
          
          const startDate = new Date(event.startDate);
          const endDate = new Date(event.endDate);
          
          // Skip Draft status events
          if (event.status === 'Draft') {
            return event;
          }
          
          // Check if event should be Live
          if (now >= startDate && now <= endDate) {
            return { ...event, status: 'Live' };
          }
          
          // Check if event should be Past
          if (now > endDate) {
            return { ...event, status: 'Completed' };
          }
          
          // Event is Upcoming - calculate time left
          const timeDiff = startDate.getTime() - now.getTime();
          const daysLeft = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
          const hoursLeft = Math.floor(timeDiff / (1000 * 60 * 60));
          const minutesLeft = Math.floor(timeDiff / (1000 * 60));
          
          if (minutesLeft < 60) {
            return { ...event, status: `${minutesLeft} min left` };
          } else if (hoursLeft < 24) {
            return { ...event, status: `${hoursLeft} hours left` };
          } else {
            return { ...event, status: `${daysLeft} days left` };
          }
        })
      );
    };

    // Update immediately
    updateEventStatuses();
    
    // Update every minute
    const interval = setInterval(updateEventStatuses, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Filter and sort events
  const filteredAndSortedEvents = useMemo(() => {
    const now = new Date();
    
    // Filter by tab
    let filtered = events.filter(event => {
      if (event.archived) {
        return activeTab === 'archived';
      }
      
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);
      
      switch (activeTab) {
        case 'live':
          return event.status === 'Live';
        case 'upcoming':
          return event.status !== 'Live' && event.status !== 'Completed' && now < startDate;
        case 'past':
          return event.status === 'Completed';
        case 'archived':
          return false; // Already handled above
        default:
          return true;
      }
    });
    
    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(event => 
        event.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Sort events
    filtered.sort((a, b) => {
      if (sortBy === 'startDate') {
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      } else {
        return a.name.localeCompare(b.name);
      }
    });
    
    return filtered;
  }, [events, activeTab, searchQuery, sortBy]);

  // Get draft events for upcoming tab
  const draftEvents = useMemo(() => {
    if (activeTab !== 'upcoming') return [];
    
    let drafts = events.filter(event => 
      !event.archived && event.status === 'Draft'
    );
    
    // Filter by search query
    if (searchQuery.trim()) {
      drafts = drafts.filter(event => 
        event.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Sort drafts
    drafts.sort((a, b) => {
      if (sortBy === 'startDate') {
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      } else {
        return a.name.localeCompare(b.name);
      }
    });
    
    return drafts;
  }, [events, activeTab, searchQuery, sortBy]);

  const handleViewDetails = (event: Event) => {
    setSelectedEvent(event);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setTimeout(() => setSelectedEvent(null), 300);
  };

  const handleArchive = (eventId: string) => {
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === eventId ? { ...event, archived: true } : event
      )
    );
  };

  const handleUnarchive = (eventId: string) => {
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === eventId ? { ...event, archived: false } : event
      )
    );
  };

  // Add Event Flow: Type → Details → Sessions (if required) → Users
  const handleAddEvent = () => {
    setFormEvent(null);
    setFormMode('add');
    setWizardStep('type');
  };

  const handleTypeSelect = (type: 'Simple' | 'Standard' | 'Advance') => {
    setSelectedType(type);
    setWizardStep('details');
  };

  const handleDetailsNext = (data: EventFormData) => {
    setFormData(data);
    // If session required, go to sessions; otherwise go directly to users
    if (data.sessionRequired) {
      setWizardStep('sessions');
    } else {
      setWizardStep('users');
    }
  };

  // Edit Event Flow: Details → Sessions (if required) → Users
  const handleEditEvent = (event: Event) => {
    setFormEvent({ name: event.name, type: event.type });
    setSelectedType(event.type);
    setFormMode('edit');
    setWizardStep('details');
  };

  const handleSessionsBack = () => {
    setWizardStep('details');
  };

  const handleSessionsNext = () => {
    setWizardStep('users');
  };

  const handleUsersBack = () => {
    if (formData?.sessionRequired) {
      setWizardStep('sessions');
    } else {
      setWizardStep('details');
    }
  };

  const handleComplete = () => {
    console.log('Event setup complete:', formData);
    handleCloseWizard();
  };

  const handleCloseWizard = () => {
    setWizardStep(null);
    setTimeout(() => {
      setFormEvent(null);
      setFormData(null);
      setFormMode('add');
      setSelectedType('Standard');
    }, 300);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">Event Dashboard</h1>
            <p className="text-sm text-muted-foreground">Manage and track your events</p>
          </div>
          <button 
            onClick={handleAddEvent}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Event</span>
          </button>
        </div>
        
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabType)} className="w-full">
          <TabsList className="w-full justify-start mb-6">
            <TabsTrigger value="live">Live</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>

          {/* Search and Sort Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search events by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="startDate">Start Date</SelectItem>
                  <SelectItem value="name">Event Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Live Tab */}
          <TabsContent value="live">
            {filteredAndSortedEvents.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No live events at the moment</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAndSortedEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onViewDetails={handleViewDetails}
                    onEdit={handleEditEvent}
                    onArchive={handleArchive}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Upcoming Tab */}
          <TabsContent value="upcoming">
            {/* Draft Events Section */}
            {draftEvents.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">Draft Events</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {draftEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onViewDetails={handleViewDetails}
                      onEdit={handleEditEvent}
                      onArchive={handleArchive}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {draftEvents.length === 0 && filteredAndSortedEvents.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No upcoming events or drafts</p>
                <button 
                  onClick={handleAddEvent}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Create New Event
                </button>
              </div>
            )}

            {/* Upcoming Events Section */}
            {filteredAndSortedEvents.length > 0 && (
              <div>
                {draftEvents.length > 0 && <h2 className="text-lg font-semibold mb-4">Scheduled Events</h2>}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredAndSortedEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onViewDetails={handleViewDetails}
                      onEdit={handleEditEvent}
                      onArchive={handleArchive}
                    />
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Past Tab */}
          <TabsContent value="past">
            {filteredAndSortedEvents.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No past events</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAndSortedEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onViewDetails={handleViewDetails}
                    onEdit={handleEditEvent}
                    onArchive={handleArchive}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Archived Tab */}
          <TabsContent value="archived">
            {filteredAndSortedEvents.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No archived events</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAndSortedEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onViewDetails={handleViewDetails}
                    onEdit={handleEditEvent}
                    onUnarchive={handleUnarchive}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Detail Panel */}
      <EventDetailPanel
        event={selectedEvent}
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
      />

      {/* Step 1: Type Selector (Add flow only) */}
      <EventTypeSelector
        isOpen={wizardStep === 'type'}
        onSelect={handleTypeSelect}
        onClose={handleCloseWizard}
      />

      {/* Step 2: Event Details Form */}
      <EventFormModal
        event={formEvent}
        mode={formMode}
        isOpen={wizardStep === 'details'}
        selectedType={selectedType}
        onSave={handleDetailsNext}
        onNext={handleDetailsNext}
        onClose={handleCloseWizard}
      />

      {/* Step 3: Sessions (only if sessionRequired) */}
      <SessionsModal
        isOpen={wizardStep === 'sessions'}
        eventData={formData}
        onBack={handleSessionsBack}
        onComplete={handleSessionsNext}
        onClose={handleCloseWizard}
      />

      {/* Step 4: Event Users */}
      <EventUsersModal
        isOpen={wizardStep === 'users'}
        eventData={formData}
        onBack={handleUsersBack}
        onComplete={handleComplete}
        onClose={handleCloseWizard}
      />
    </div>
  );
};

export default Index;
