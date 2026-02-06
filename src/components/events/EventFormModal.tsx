import { useState, useEffect, useMemo } from 'react';
import { X, Save, Calendar, MapPin, Globe, Clock, List, Building, Search, ChevronDown } from 'lucide-react';
import { EventFormData } from '@/types/event';
import { countries, categories } from '@/data/countries';
import { format, parse, isPast } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface EventFormModalProps {
  event: { name: string; type: 'Simple' | 'Standard' | 'Advance' } | null;
  mode: 'add' | 'edit';
  isOpen: boolean;
  selectedType?: 'Simple' | 'Standard' | 'Advance';
  onSave: (data: EventFormData) => void;
  onNext?: (data: EventFormData) => void;
  onClose: () => void;
}

interface FormErrors {
  name?: string;
  category?: string;
  country?: string;
  address?: string;
  timezone?: string;
  startDate?: string;
  endDate?: string;
  mode?: string;
  sessionRequired?: string;
  commsRequired?: string;
  surveyRequired?: string;
}

export function EventFormModal({ event, mode, isOpen, selectedType, onSave, onNext, onClose }: EventFormModalProps) {
  const [formData, setFormData] = useState<EventFormData>({
    name: '',
    category: 'Other',
    websiteUrl: '',
    mode: 'in-person',
    country: '',
    address: '',
    timezone: '',
    startDate: '',
    endDate: '',
    type: 'Standard',
    sessionRequired: false,
    commsRequired: false,
    surveyRequired: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [countrySearch, setCountrySearch] = useState('');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [startDateObj, setStartDateObj] = useState<Date | undefined>(undefined);
  const [endDateObj, setEndDateObj] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // Get available timezones based on selected country
  const availableTimezones = useMemo(() => {
    const country = countries.find(c => c.name === formData.country);
    return country?.timezones || [];
  }, [formData.country]);

  // Generate website URL based on event name
  const generatedWebsiteUrl = useMemo(() => {
    if (!formData.name) return '';
    return `events.example.com/${formData.name.toLowerCase().replace(/\s+/g, '-')}/home`;
  }, [formData.name]);

  // Filter countries based on search
  const filteredCountries = useMemo(() => {
    if (!countrySearch) return countries;
    return countries.filter(c => 
      c.name.toLowerCase().includes(countrySearch.toLowerCase())
    );
  }, [countrySearch]);

  useEffect(() => {
    if (event) {
      setFormData(prev => ({
        ...prev,
        name: event.name,
        type: event.type,
      }));
    } else {
      setFormData({
        name: '',
        category: 'Other',
        websiteUrl: '',
        mode: 'in-person',
        country: '',
        address: '',
        timezone: '',
        startDate: '',
        endDate: '',
        type: selectedType || 'Standard',
        sessionRequired: false,
        commsRequired: false,
        surveyRequired: false,
      });
    }
    setErrors({});
    setStartDateObj(undefined);
    setEndDateObj(undefined);
    setStartTime('');
    setEndTime('');
  }, [event, isOpen, selectedType]);

  // Update timezone when country changes
  useEffect(() => {
    if (formData.country && availableTimezones.length > 0 && !availableTimezones.includes(formData.timezone)) {
      setFormData(prev => ({ ...prev, timezone: availableTimezones[0] }));
    }
  }, [formData.country, availableTimezones, formData.timezone]);

  // Update website URL when name changes
  useEffect(() => {
    setFormData(prev => ({ ...prev, websiteUrl: generatedWebsiteUrl }));
  }, [generatedWebsiteUrl]);

  const handleChange = (field: keyof EventFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCountrySelect = (countryName: string) => {
    handleChange('country', countryName);
    setCountrySearch('');
    setIsCountryDropdownOpen(false);
  };

  const handleStartDateChange = (date: Date | undefined) => {
    if (!date) return;
    setStartDateObj(date);
    if (startTime) {
      const dateStr = format(date, 'yyyy-MM-dd');
      const datetimeStr = `${dateStr}T${startTime}`;
      handleChange('startDate', datetimeStr);
    }
  };

  const handleEndDateChange = (date: Date | undefined) => {
    if (!date) return;
    setEndDateObj(date);
    if (endTime) {
      const dateStr = format(date, 'yyyy-MM-dd');
      const datetimeStr = `${dateStr}T${endTime}`;
      handleChange('endDate', datetimeStr);
    }
  };

  const handleDateRangeSelect = (range: { from?: Date; to?: Date } | undefined) => {
    if (range?.from) {
      setStartDateObj(range.from);
      if (range.to) {
        setEndDateObj(range.to);
        if (startTime) {
          const startDateStr = format(range.from, 'yyyy-MM-dd');
          const startDatetime = `${startDateStr}T${startTime}`;
          handleChange('startDate', startDatetime);
        }
        if (endTime) {
          const endDateStr = format(range.to, 'yyyy-MM-dd');
          const endDatetime = `${endDateStr}T${endTime}`;
          handleChange('endDate', endDatetime);
        }
      } else {
        setEndDateObj(range.from);
        if (startTime) {
          const dateStr = format(range.from, 'yyyy-MM-dd');
          const datetimeStr = `${dateStr}T${startTime}`;
          handleChange('startDate', datetimeStr);
          handleChange('endDate', datetimeStr);
        }
      }
    }
  };

  const handleStartTimeChange = (time: string) => {
    setStartTime(time);
    if (startDateObj) {
      const dateStr = format(startDateObj, 'yyyy-MM-dd');
      const datetimeStr = `${dateStr}T${time}`;
      handleChange('startDate', datetimeStr);
    }
  };

  const handleEndTimeChange = (time: string) => {
    setEndTime(time);
    if (endDateObj) {
      const dateStr = format(endDateObj, 'yyyy-MM-dd');
      const datetimeStr = `${dateStr}T${time}`;
      handleChange('endDate', datetimeStr);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Event name is required';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (!formData.country) {
      newErrors.country = 'Country is required';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.timezone) {
      newErrors.timezone = 'Time zone is required';
    }
    if (!formData.startDate || !formData.endDate) {
      newErrors.startDate = 'Start and end date with time are required';
    } else if (!startTime || !endTime) {
      newErrors.startDate = 'Start and end time are required';
    } else if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    // Check if start date/time is in the past
    if (formData.startDate) {
      const startDateTime = new Date(formData.startDate);
      if (isPast(startDateTime)) {
        newErrors.startDate = 'Start date and time cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (onNext) {
      onNext(formData);
    } else {
      onSave(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-foreground/40 z-50 animate-fade-in"
        onClick={onClose}
      />
      
      <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-8">
        <div className="bg-card rounded-xl shadow-panel w-full max-w-2xl animate-scale-in max-h-[90vh] flex flex-col">
          <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-5 py-4 rounded-t-xl flex-shrink-0">
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

          <form onSubmit={handleSubmit} className="p-5 flex-1 overflow-y-auto">
            {/* Event Details Section */}
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
                  error={errors.name}
                />

                <FormSelect
                  icon={List}
                  label="Category"
                  required
                  value={formData.category}
                  onChange={(v) => handleChange('category', v)}
                  options={categories}
                  error={errors.category}
                />

                {formData.type !== 'Simple' && (
                  <>
                    <FormField
                      icon={Globe}
                      label="Website URL"
                      value={formData.websiteUrl}
                      onChange={() => {}}
                      placeholder="Auto-generated"
                      disabled
                    />

                    <FormSelect
                      icon={Building}
                      label="Mode"
                      required
                      value={formData.mode}
                      onChange={(v) => handleChange('mode', v)}
                      options={['in-person', 'hybrid']}
                      optionLabels={['In-Person', 'Hybrid']}
                    />
                  </>
                )}

                {/* Country with Search */}
                <div className="relative">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    Country
                    <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={isCountryDropdownOpen ? countrySearch : formData.country}
                      onChange={(e) => {
                        setCountrySearch(e.target.value);
                        setIsCountryDropdownOpen(true);
                      }}
                      onFocus={() => setIsCountryDropdownOpen(true)}
                      placeholder="Search country..."
                      className={`w-full px-3 py-2 text-sm border rounded-lg bg-card text-card-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none transition-colors ${
                        errors.country ? 'border-destructive' : 'border-border'
                      }`}
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    
                    {isCountryDropdownOpen && (
                      <div className="absolute z-10 w-full mt-1 max-h-48 overflow-y-auto bg-card border border-border rounded-lg shadow-lg">
                        {filteredCountries.map((country) => (
                          <button
                            key={country.code}
                            type="button"
                            onClick={() => handleCountrySelect(country.name)}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors"
                          >
                            {country.name}
                          </button>
                        ))}
                        {filteredCountries.length === 0 && (
                          <div className="px-3 py-2 text-sm text-muted-foreground">
                            No countries found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {errors.country && (
                    <p className="text-xs text-destructive mt-1">{errors.country}</p>
                  )}
                </div>

                <FormField
                  icon={MapPin}
                  label="Address"
                  required
                  value={formData.address}
                  onChange={(v) => handleChange('address', v)}
                  placeholder="Venue address"
                  error={errors.address}
                />

                <FormSelect
                  icon={Clock}
                  label="Time Zone"
                  required
                  value={formData.timezone}
                  onChange={(v) => handleChange('timezone', v)}
                  options={availableTimezones}
                  disabled={!formData.country}
                  placeholder={formData.country ? 'Select timezone' : 'Select country first'}
                  error={errors.timezone}
                />

                {/* Event Date & Time */}
                <div className="md:col-span-2">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    Event Date & Time
                    <span className="text-destructive">*</span>
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className={`w-full px-3 py-2 text-sm border rounded-lg bg-card text-left transition-colors ${
                          errors.startDate || errors.endDate ? 'border-destructive' : 'border-border hover:border-primary/50'
                        }`}
                      >
                        {startDateObj && endDateObj && startTime && endTime ? (
                          `${format(startDateObj, 'MMM dd, yyyy')} ${startTime} → ${format(endDateObj, 'MMM dd, yyyy')} ${endTime}`
                        ) : startDateObj && endDateObj ? (
                          <>
                            {format(startDateObj, 'MMM dd, yyyy')} <span className="text-destructive">(select time)</span> → {format(endDateObj, 'MMM dd, yyyy')} <span className="text-destructive">(select time)</span>
                          </>
                        ) : startDateObj && startTime ? (
                          `${format(startDateObj, 'MMM dd, yyyy')} ${startTime}`
                        ) : startDateObj ? (
                          <>
                            {format(startDateObj, 'MMM dd, yyyy')} <span className="text-destructive">(select time)</span>
                          </>
                        ) : (
                          'Pick date & time range'
                        )}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start" side="bottom" avoidCollisions={false}>
                      <div className="p-4">
                        <CalendarComponent
                          initialFocus
                          mode="range"
                          defaultMonth={startDateObj}
                          selected={{ from: startDateObj, to: endDateObj }}
                          onSelect={(range) => handleDateRangeSelect(range)}
                          numberOfMonths={2}
                        />
                      </div>

                      {/* Time Inputs Inside Popover */}
                      <div className="border-t border-border p-3 bg-muted/30">
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div>
                            <label className="text-xs font-medium text-card-foreground mb-1 block">Start Time</label>
                            <input
                              type="time"
                              value={startTime}
                              onChange={(e) => handleStartTimeChange(e.target.value)}
                              disabled={!startDateObj}
                              className={`w-full px-3 py-2 text-sm border rounded-lg bg-card text-card-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                errors.startDate ? 'border-destructive' : 'border-border'
                              }`}
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-card-foreground mb-1 block">End Time</label>
                            <input
                              type="time"
                              value={endTime}
                              onChange={(e) => handleEndTimeChange(e.target.value)}
                              disabled={!endDateObj}
                              className={`w-full px-3 py-2 text-sm border rounded-lg bg-card text-card-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                errors.endDate ? 'border-destructive' : 'border-border'
                              }`}
                            />
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              setStartDateObj(undefined);
                              setEndDateObj(undefined);
                              setStartTime('');
                              setEndTime('');
                              handleChange('startDate', '');
                              handleChange('endDate', '');
                            }}
                            className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-card-foreground rounded-lg hover:bg-muted transition-colors"
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  {(errors.startDate || errors.endDate) && (
                    <div className="space-y-1 mt-1">
                      {errors.startDate && <p className="text-xs text-destructive">{errors.startDate}</p>}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Details Section */}
            <div className="border border-primary/20 rounded-lg p-4 mb-4">
              <h3 className="text-sm font-bold text-card-foreground mb-4 flex items-center gap-2">
                <List className="w-4 h-4 text-primary" />
                Additional Details
              </h3>

              <div className="space-y-4">
                <ToggleField
                  label="Session Required"
                  description="Do you need to manage multiple sessions for this event?"
                  value={formData.sessionRequired}
                  onChange={(v) => handleChange('sessionRequired', v)}
                  required
                />

                <ToggleField
                  label="Comms (post event)"
                  description="Enable post-event communication features"
                  value={formData.commsRequired}
                  onChange={(v) => handleChange('commsRequired', v)}
                  required
                />

                <ToggleField
                  label="Survey (post event)"
                  description="Send post-event surveys to attendees"
                  value={formData.surveyRequired}
                  onChange={(v) => handleChange('surveyRequired', v)}
                  required
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
                Save & Next
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Click outside to close country dropdown */}
      {isCountryDropdownOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsCountryDropdownOpen(false)}
        />
      )}
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
  disabled?: boolean;
  error?: string;
}

function FormField({ icon: Icon, label, required, type = 'text', value, onChange, placeholder, disabled, error }: FormFieldProps) {
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
        disabled={disabled}
        className={`w-full px-3 py-2 text-sm border rounded-lg bg-card text-card-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
          error ? 'border-destructive' : 'border-border'
        }`}
      />
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
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
  optionLabels?: string[];
  disabled?: boolean;
  placeholder?: string;
  error?: string;
}

function FormSelect({ icon: Icon, label, required, value, onChange, options, optionLabels, disabled, placeholder, error }: FormSelectProps) {
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
        disabled={disabled}
        className={`w-full px-3 py-2 text-sm border rounded-lg bg-card text-card-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none transition-colors appearance-none disabled:opacity-50 disabled:cursor-not-allowed ${
          error ? 'border-destructive' : 'border-border'
        }`}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt, idx) => (
          <option key={opt} value={opt}>
            {optionLabels?.[idx] || opt}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}

interface ToggleFieldProps {
  label: string;
  description: string;
  value: boolean;
  onChange: (value: boolean) => void;
  required?: boolean;
}

function ToggleField({ label, description, value, onChange, required }: ToggleFieldProps) {
  return (
    <div className="flex items-center justify-between p-3 border border-border rounded-lg">
      <div className="flex-1">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium text-card-foreground">{label}</span>
          {required && <span className="text-destructive text-xs">*</span>}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <div className="flex gap-2 ml-4">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            value
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          Yes
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            !value
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          No
        </button>
      </div>
    </div>
  );
}
