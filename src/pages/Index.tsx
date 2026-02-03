import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Event, EventFormData } from '@/types/event';
import { sampleEvents } from '@/data/events';
import { EventCard } from '@/components/events/EventCard';
import { EventDetailPanel } from '@/components/events/EventDetailPanel';
import { EventTypeSelector } from '@/components/events/EventTypeSelector';
import { EventFormModal } from '@/components/events/EventFormModal';
import { SessionsModal } from '@/components/events/SessionsModal';

type WizardStep = 'type' | 'details' | 'sessions' | null;

const Index = () => {
  const [events] = useState<Event[]>(sampleEvents);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  
  // Wizard state
  const [wizardStep, setWizardStep] = useState<WizardStep>(null);
  const [selectedType, setSelectedType] = useState<'Simple' | 'Standard' | 'Advance'>('Standard');
  const [formData, setFormData] = useState<EventFormData | null>(null);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [formEvent, setFormEvent] = useState<Event | null>(null);

  const handleViewDetails = (event: Event) => {
    setSelectedEvent(event);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setTimeout(() => setSelectedEvent(null), 300);
  };

  // Add Event Flow: Type → Details → Sessions
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
    setWizardStep('sessions');
  };

  const handleDetailsSave = (data: EventFormData) => {
    console.log('Saving event:', data);
    handleCloseWizard();
  };

  // Edit Event Flow: Details → Sessions
  const handleEditEvent = (event: Event) => {
    setFormEvent(event);
    setSelectedType(event.type);
    setFormMode('edit');
    setWizardStep('details');
  };

  const handleEditNext = (data: EventFormData) => {
    setFormData(data);
    setWizardStep('sessions');
  };

  const handleSessionsBack = () => {
    setWizardStep('details');
  };

  const handleSessionsComplete = () => {
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
        onSave={formMode === 'add' ? handleDetailsSave : handleDetailsSave}
        onNext={formMode === 'add' ? handleDetailsNext : handleEditNext}
        onClose={handleCloseWizard}
      />

      {/* Step 3: Sessions */}
      <SessionsModal
        isOpen={wizardStep === 'sessions'}
        eventData={formData}
        onBack={handleSessionsBack}
        onComplete={handleSessionsComplete}
        onClose={handleCloseWizard}
      />
    </div>
  );
};

export default Index;
