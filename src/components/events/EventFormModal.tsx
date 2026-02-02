import { useState, useEffect } from 'react';
import { X, Save, Calendar, MapPin, Globe, Clock, List } from 'lucide-react';
import { Event, EventFormData } from '@/types/event';
import { cn } from '@/lib/utils';

interface EventFormModalProps {
  event: Event | null;
  mode: 'add' | 'edit';
  isOpen: boolean;
  onSave: (data: EventFormData) => void;
  onClose: () => void;
}

const timezones = [
  'Australia/Melbourne',
  'Australia/Sydney',
  'Australia/Brisbane',
  'Australia/Perth',
  'Australia/Adelaide',
];

const categories = ['Other', 'Conference', 'Workshop', 'Seminar', 'Networking'];

export function EventFormModal({ event, mode, isOpen, onSave, onClose }: EventFormModalProps) {
  const [formData, setFormData] = useState<EventFormData>({
    name: '',
    category: 'Other',
    websiteUrl: '',
    location: '',
    startDate: '',
    endDate: '',
    timezone: 'Australia/Melbourne',
    type: 'Standard'
  });

  useEffect(() => {
    if (event) {
      setFormData({
        name: event.name,
        category: 'Other',
        websiteUrl: `events.example.com/${event.name.toLowerCase().replace(/\s+/g, '-')}/home`,
        location: event.location,
        startDate: event.startDate.substring(0, 16),
        endDate: event.endDate.substring(0, 16),
        timezone: event.timezone,
        type: event.type
      });
    } else {
      setFormData({
        name: '',
        category: 'Other',
        websiteUrl: '',
        location: '',
        startDate: '',
        endDate: '',
        timezone: 'Australia/Melbourne',
        type: 'Standard'
      });
    }
  }, [event, isOpen]);

  const handleChange = (field: keyof EventFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-foreground/40 z-50 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-8">
        <div className="bg-card rounded-xl shadow-panel w-full max-w-2xl animate-scale-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-5 py-4 rounded-t-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">
                {mode === 'edit' ? 'Edit Event' : 'Add New Event'}
              </h2>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-primary-foreground/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5">
            <div className="border border-primary/20 rounded-lg p-4 mb-4">
              <h3 className="text-sm font-bold text-card-foreground mb-4 flex items-center gap-2">
                <List className="w-4 h-4 text-primary" />
                Event Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  icon={Calendar}
                  label="Name"
                  required
                  value={formData.name}
                  onChange={(v) => handleChange('name', v)}
                  placeholder="Event name"
                />

                <FormSelect
                  icon={List}
                  label="Category"
                  required
                  value={formData.category}
                  onChange={(v) => handleChange('category', v)}
                  options={categories}
                />

                <FormField
                  icon={Globe}
                  label="Website URL"
                  value={formData.websiteUrl}
                  onChange={(v) => handleChange('websiteUrl', v)}
                  placeholder="events.example.com/event"
                />

                <FormField
                  icon={MapPin}
                  label="Location"
                  required
                  value={formData.location}
                  onChange={(v) => handleChange('location', v)}
                  placeholder="Venue address"
                />

                <FormField
                  icon={Calendar}
                  label="Start DateTime"
                  required
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(v) => handleChange('startDate', v)}
                />

                <FormField
                  icon={Calendar}
                  label="End DateTime"
                  required
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(v) => handleChange('endDate', v)}
                />

                <FormSelect
                  icon={Clock}
                  label="Time Zone"
                  value={formData.timezone}
                  onChange={(v) => handleChange('timezone', v)}
                  options={timezones}
                />

                <FormSelect
                  icon={List}
                  label="Event Type"
                  value={formData.type}
                  onChange={(v) => handleChange('type', v as EventFormData['type'])}
                  options={['Simple', 'Standard', 'Advance']}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium border border-border text-muted-foreground rounded-lg hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {mode === 'edit' ? 'Update Event' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

interface FormFieldProps {
  icon: React.ElementType;
  label: string;
  required?: boolean;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function FormField({ icon: Icon, label, required, type = 'text', value, onChange, placeholder }: FormFieldProps) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1.5">
        <Icon className="w-3.5 h-3.5" />
        {label}
        {required && <span className="text-destructive">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-card text-card-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none transition-colors"
      />
    </div>
  );
}

interface FormSelectProps {
  icon: React.ElementType;
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

function FormSelect({ icon: Icon, label, required, value, onChange, options }: FormSelectProps) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1.5">
        <Icon className="w-3.5 h-3.5" />
        {label}
        {required && <span className="text-destructive">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-card text-card-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none transition-colors appearance-none"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
