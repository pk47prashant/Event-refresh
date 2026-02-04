import { useState, useEffect } from 'react';
import { X, Save, Calendar, Clock, User, Lock, Unlock, Trash2, Edit2, Plus, Search, Copy } from 'lucide-react';
import { EventFormData } from '@/types/event';
import { format } from 'date-fns';

import { SelectSpeakerModal } from './SelectSpeakerModal';
export interface SessionData {
  id: string;
  name: string;
  description: string;
  speakers: string[];
  attendees?: string[];
  isPrivate: boolean;
  startTime: string;
  endTime: string;
}

interface SessionFormModalProps {
  isOpen: boolean;
  eventData: EventFormData | null;
  onSave: (sessions: SessionData[]) => void;
  onClose: () => void;
  onBack?: () => void;
}

export function SessionFormModal({ isOpen, eventData, onSave, onClose, onBack }: SessionFormModalProps) {
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [speakers, setSpeakers] = useState<string[]>(['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams']);
  const [attendees, setAttendees] = useState<string[]>(['Alice Green', 'Bob Brown']);
  const [isSelectSpeakerOpen, setIsSelectSpeakerOpen] = useState(false);
  const [isSelectAttendeeOpen, setIsSelectAttendeeOpen] = useState(false);

  const [formData, setFormData] = useState<Omit<SessionData, 'id'>>({
    name: '',
    description: '',
    speakers: [],
    attendees: [],
    isPrivate: false,
    startTime: '',
    endTime: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Set default times based on event data
  useEffect(() => {
    if (eventData?.startDate && eventData?.endDate) {
      setFormData(prev => ({
        ...prev,
        startTime: eventData.startDate,
        endTime: eventData.endDate,
      }));
    }
  }, [eventData]);

  const handleChange = (field: keyof Omit<SessionData, 'id'>, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAddSpeaker = (speaker: string) => {
    if (!formData.speakers.includes(speaker)) {
      handleChange('speakers', [...formData.speakers, speaker]);
    }
  };

  const handleRemoveSpeaker = (speaker: string) => {
    handleChange('speakers', formData.speakers.filter(s => s !== speaker));
  };

  const handleCreateSpeaker = () => {
    // Will be handled by SelectSpeakerModal
  };

  const handleAddNewSpeaker = (speaker: string) => {
    if (!speakers.includes(speaker)) {
      setSpeakers([...speakers, speaker]);
    }
  };

  const handleAddAttendee = (attendee: string) => {
    if (!formData.attendees?.includes(attendee)) {
      handleChange('attendees', [...(formData.attendees || []), attendee]);
    }
  };

  const handleRemoveAttendee = (attendee: string) => {
    handleChange('attendees', (formData.attendees || []).filter(a => a !== attendee));
  };

  const handleAddNewAttendee = (attendee: string) => {
    if (!attendees.includes(attendee)) {
      setAttendees([...attendees, attendee]);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Session name is required';
    }
    if (formData.speakers.length === 0) {
      newErrors.speakers = 'At least one speaker is required';
    }
    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }
    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    }
    if (formData.startTime && formData.endTime && new Date(formData.startTime) >= new Date(formData.endTime)) {
      newErrors.endTime = 'End time must be after start time';
    }

    // Validate within event date range
    if (eventData?.startDate && eventData?.endDate) {
      const eventStart = new Date(eventData.startDate);
      const eventEnd = new Date(eventData.endDate);
      const sessionStart = new Date(formData.startTime);
      const sessionEnd = new Date(formData.endTime);

      if (sessionStart < eventStart) {
        newErrors.startTime = 'Session must start after event start time';
      }
      if (sessionEnd > eventEnd) {
        newErrors.endTime = 'Session must end before event end time';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddOrUpdateSession = () => {
    if (!validateForm()) {
      return;
    }

    if (editingId) {
      // Update existing session
      setSessions(sessions.map(s => s.id === editingId ? { ...(formData as SessionData), id: editingId } : s));
      setEditingId(null);
    } else {
      // Add new session
      const newSession: SessionData = {
        id: Date.now().toString(),
        ...(formData as SessionData),
      };
      setSessions([...sessions, newSession]);
    }

    // Reset form
    setFormData({
      name: '',
      description: '',
      speakers: [],
      attendees: [],
      isPrivate: false,
      startTime: eventData?.startDate || '',
      endTime: eventData?.endDate || '',
    });
    setErrors({});
  };

  const handleEditSession = (session: SessionData) => {
    setFormData(session);
    setEditingId(session.id);
  };

  const handleDeleteSession = (sessionId: string) => {
    setSessions(sessions.filter(s => s.id !== sessionId));
    if (editingId === sessionId) {
      setEditingId(null);
      setFormData({
        name: '',
        description: '',
        speakers: [],
        attendees: [],
        isPrivate: false,
        startTime: eventData?.startDate || '',
        endTime: eventData?.endDate || '',
      });
    }
  };

  const handleCopySession = (session: SessionData) => {
    const copy: SessionData = { ...session, id: Date.now().toString(), name: `${session.name} (Copy)` };
    setSessions(prev => [...prev, copy]);
  };

  const handleSaveAndNext = () => {
    onSave(sessions);
  };

  const sortedSessions = [...sessions].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-foreground/40 z-50 animate-fade-in"
        onClick={onClose}
      />
      
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
        <div className="bg-card rounded-xl shadow-panel w-full max-w-5xl animate-scale-in max-h-[90vh] flex flex-col">
          <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-6 py-4 rounded-t-xl flex-shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Add Sessions</h2>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-primary-foreground/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6 flex-1 overflow-y-auto">
            <div className="grid grid-cols-3 gap-6">
              {/* Form Section */}
              <div className="col-span-2 space-y-4">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1.5">
                    Session Privacy
                  </label>
                  <div className="flex gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => handleChange('isPrivate', false)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                        !formData.isPrivate
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      <Unlock className="w-4 h-4" />
                      Public
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChange('isPrivate', true)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                        formData.isPrivate
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      <Lock className="w-4 h-4" />
                      Private
                    </button>
                  </div>

                  <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1.5">
                    Session Name
                    <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Enter session name"
                    className={`w-full px-3 py-2 text-sm border rounded-lg bg-card text-card-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none transition-colors ${
                      errors.name ? 'border-destructive' : 'border-border'
                    }`}
                  />
                  {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1.5">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Enter session description"
                    rows={2}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-card text-card-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none transition-colors resize-none"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1.5">
                    <User className="w-3.5 h-3.5" />
                    Speakers
                    <span className="text-destructive">*</span>
                  </label>
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => setIsSelectSpeakerOpen(true)}
                      className={`w-full px-3 py-2 text-sm border rounded-lg bg-card text-card-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors text-left flex items-center justify-between ${
                        errors.speakers ? 'border-destructive' : 'border-border'
                      }`}
                    >
                      <span className={formData.speakers.length > 0 ? 'text-card-foreground' : 'text-muted-foreground'}>
                        {formData.speakers.length > 0
                          ? `${formData.speakers.length} speaker${formData.speakers.length !== 1 ? 's' : ''} selected`
                          : 'Select speakers...'}
                      </span>
                      <User className="w-4 h-4" />
                    </button>

                    {/* If private, show attendee selector */}
                    {formData.isPrivate && (
                      <button
                        type="button"
                        onClick={() => setIsSelectAttendeeOpen(true)}
                        className="w-full px-3 py-2 text-sm border rounded-lg bg-card text-card-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors text-left flex items-center justify-between border-border"
                      >
                        <span className={formData.attendees && formData.attendees.length > 0 ? 'text-card-foreground' : 'text-muted-foreground'}>
                          {formData.attendees && formData.attendees.length > 0
                            ? `${formData.attendees.length} attendee${formData.attendees.length !== 1 ? 's' : ''} selected`
                            : 'Select attendees...'}
                        </span>
                        <User className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {errors.speakers && <p className="text-xs text-destructive mt-1">{errors.speakers}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      Start Time
                      <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.startTime}
                      onChange={(e) => handleChange('startTime', e.target.value)}
                      className={`w-full px-3 py-2 text-sm border rounded-lg bg-card text-card-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none transition-colors ${
                        errors.startTime ? 'border-destructive' : 'border-border'
                      }`}
                    />
                    {errors.startTime && <p className="text-xs text-destructive mt-1">{errors.startTime}</p>}
                  </div>

                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      End Time
                      <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.endTime}
                      onChange={(e) => handleChange('endTime', e.target.value)}
                      className={`w-full px-3 py-2 text-sm border rounded-lg bg-card text-card-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none transition-colors ${
                        errors.endTime ? 'border-destructive' : 'border-border'
                      }`}
                    />
                    {errors.endTime && <p className="text-xs text-destructive mt-1">{errors.endTime}</p>}
                  </div>
                </div>

                <div />

                <button
                  type="button"
                  onClick={handleAddOrUpdateSession}
                  className="w-full px-4 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingId ? 'Update Session' : 'Add Session'}
                </button>
              </div>

              {/* Sessions List */}
              <div className="col-span-1">
                <h3 className="text-sm font-bold text-card-foreground mb-3">Added Sessions ({sortedSessions.length})</h3>
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {sortedSessions.length === 0 ? (
                    <div className="text-xs text-muted-foreground text-center py-8 border border-dashed border-border rounded-lg">
                      No sessions added yet
                    </div>
                  ) : (
                    sortedSessions.map(session => (
                      <div 
                        key={session.id} 
                        className={`border rounded-lg p-3 transition-colors ${
                          editingId === session.id 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border bg-muted/30 hover:bg-muted/50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="text-xs font-medium text-card-foreground truncate flex-1">
                            {session.name}
                          </h4>
                            <div className="flex gap-1 flex-shrink-0">
                              <button
                                type="button"
                                onClick={() => handleCopySession(session)}
                                className="p-1 hover:bg-muted/20 rounded transition-colors"
                              >
                                <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleEditSession(session)}
                                className="p-1 hover:bg-primary/20 rounded transition-colors"
                              >
                                <Edit2 className="w-3.5 h-3.5 text-primary" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteSession(session.id)}
                                className="p-1 hover:bg-destructive/20 rounded transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-destructive" />
                              </button>
                            </div>
                        </div>
                        
                        <div className="text-xs text-muted-foreground mb-1.5">
                          <div className="flex items-center gap-1 mb-1">
                            <User className="w-3 h-3" />
                            {session.speakers.length} speaker{session.speakers.length !== 1 ? 's' : ''}
                          </div>
                          {session.speakers.join(', ')}
                        </div>

                        <div className="text-xs text-muted-foreground mb-1.5">
                          {format(new Date(session.startTime), 'MMM dd, HH:mm')} - {format(new Date(session.endTime), 'HH:mm')}
                        </div>

                        <div className="flex gap-1">
                          {session.isPrivate ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-muted text-muted-foreground text-xs">
                              <Lock className="w-3 h-3" />
                              Private
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-primary/20 text-primary text-xs">
                              <Unlock className="w-3 h-3" />
                              Public
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 p-5 border-t border-border flex-shrink-0">
            <button
              type="button"
              onClick={() => (typeof (onBack as any) === 'function' ? onBack!() : onClose())}
              className="px-4 py-2 text-sm font-medium border border-border text-muted-foreground rounded-lg hover:bg-muted transition-colors"
            >
              Back
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium border border-border text-muted-foreground rounded-lg hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveAndNext}
              className="px-6 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save & Next
            </button>
          </div>
        </div>
      </div>

      <SelectSpeakerModal
        isOpen={isSelectSpeakerOpen}
        availableSpeakers={speakers}
        selectedSpeakers={formData.speakers}
        onAddSpeaker={handleAddSpeaker}
        onRemoveSpeaker={handleRemoveSpeaker}
        onAddNewSpeaker={handleAddNewSpeaker}
        onClose={() => setIsSelectSpeakerOpen(false)}
      />
      <SelectSpeakerModal
        isOpen={isSelectAttendeeOpen}
        availableSpeakers={attendees}
        selectedSpeakers={formData.attendees || []}
        onAddSpeaker={handleAddAttendee}
        onRemoveSpeaker={handleRemoveAttendee}
        onAddNewSpeaker={handleAddNewAttendee}
        onClose={() => setIsSelectAttendeeOpen(false)}
      />
    </>
  );
}
