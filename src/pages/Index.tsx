import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Event, EventFormData } from '@/types/event';
import { sampleEvents } from '@/data/events';
import { EventCard } from '@/components/events/EventCard';
import { EventDetailPanel } from '@/components/events/EventDetailPanel';
import { EventFormModal } from '@/components/events/EventFormModal';

const Index = () => {
  const [events] = useState<Event[]>(sampleEvents);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formEvent, setFormEvent] = useState<Event | null>(null);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');

  const handleViewDetails = (event: Event) => {
    setSelectedEvent(event);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setTimeout(() => setSelectedEvent(null), 300);
  };

  const handleEditEvent = (event: Event) => {
    setFormEvent(event);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleAddEvent = () => {
    setFormEvent(null);
    setFormMode('add');
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setTimeout(() => {
      setFormEvent(null);
      setFormMode('add');
    }, 300);
  };

  const handleSaveEvent = (eventData: EventFormData) => {
    console.log('Saving event:', eventData);
    handleCloseForm();
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
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
        
        {/* Event Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onViewDetails={handleViewDetails}
              onEdit={handleEditEvent}
            />
          ))}
        </div>
      </div>

      {/* Detail Panel */}
      <EventDetailPanel
        event={selectedEvent}
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
      />

      {/* Form Modal */}
      <EventFormModal
        event={formEvent}
        mode={formMode}
        isOpen={isFormOpen}
        onSave={handleSaveEvent}
        onClose={handleCloseForm}
      />
    </div>
  );
};

export default Index;
