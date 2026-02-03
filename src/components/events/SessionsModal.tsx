import { useState } from 'react';
import { X, Calendar, List, Plus, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { EventFormData } from '@/types/event';

interface SessionsModalProps {
  isOpen: boolean;
  eventData: EventFormData | null;
  onBack: () => void;
  onComplete: () => void;
  onClose: () => void;
}

type ViewMode = 'calendar' | 'list';

const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const timeSlots = ['12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM'];

export function SessionsModal({ isOpen, eventData, onBack, onComplete, onClose }: SessionsModalProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());

  if (!isOpen) return null;

  const getWeekDates = () => {
    const dates = [];
    const start = new Date(currentWeekStart);
    start.setDate(start.getDate() - start.getDay());
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates();
  const today = new Date();

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeekStart(newDate);
  };

  const goToToday = () => {
    setCurrentWeekStart(new Date());
  };

  const formatDateRange = () => {
    const start = weekDates[0];
    const end = weekDates[6];
    const monthStart = start.toLocaleString('default', { month: 'short' });
    const monthEnd = end.toLocaleString('default', { month: 'short' });
    const year = end.getFullYear();
    
    if (monthStart === monthEnd) {
      return `${monthStart} ${start.getDate()} - ${end.getDate()}, ${year}`;
    }
    return `${monthStart} ${start.getDate()} - ${monthEnd} ${end.getDate()}, ${year}`;
  };

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  // Format event date range for display
  const getEventDateRange = () => {
    if (!eventData?.startDate || !eventData?.endDate) {
      return 'No dates set';
    }
    const start = new Date(eventData.startDate);
    const end = new Date(eventData.endDate);
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    };
    return `${start.toLocaleString('default', options)} - ${end.toLocaleString('default', options)} (${eventData.timezone})`;
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-foreground/40 z-50 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
        <div className="bg-card rounded-xl shadow-panel w-full max-w-5xl animate-scale-in max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-6 py-4 rounded-t-xl flex-shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Sessions</h2>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-primary-foreground/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 flex-1 overflow-y-auto">
            {/* Event Date Info & Add Session */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{getEventDateRange()}</span>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary/80 text-primary-foreground rounded-lg hover:bg-primary transition-colors">
                <Plus className="w-4 h-4" />
                Add Session
              </button>
            </div>

            {/* View Toggle */}
            <div className="grid grid-cols-2 gap-2 mb-5">
              <button
                onClick={() => setViewMode('calendar')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                  viewMode === 'calendar'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                <Calendar className="w-4 h-4" />
                Calendar View
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                  viewMode === 'list'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                <List className="w-4 h-4" />
                List View
              </button>
            </div>

            {/* Calendar Navigation */}
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={goToToday}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium border border-border rounded-lg hover:bg-muted transition-colors"
              >
                <Calendar className="w-4 h-4" />
                Today
              </button>
              <button
                onClick={() => navigateWeek('prev')}
                className="p-1.5 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigateWeek('next')}
                className="p-1.5 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <h3 className="text-lg font-semibold text-card-foreground ml-2">
                {formatDateRange()}
              </h3>
            </div>

            {viewMode === 'calendar' ? (
              /* Calendar Grid */
              <div className="border border-border rounded-lg overflow-hidden">
                {/* Day Headers */}
                <div className="grid grid-cols-8 border-b border-border">
                  <div className="p-2 bg-muted"></div>
                  {weekDates.map((date, idx) => (
                    <div 
                      key={idx} 
                      className={`p-2 text-center border-l border-border ${
                        isToday(date) ? 'bg-status-live/5' : ''
                      }`}
                    >
                      <div className="text-xs font-medium text-muted-foreground">
                        {weekDays[idx]}
                      </div>
                      <div className={`text-sm font-semibold ${
                        isToday(date) ? 'text-status-live' : 'text-card-foreground'
                      }`}>
                        {date.toLocaleString('default', { month: 'short' })} {date.getDate()}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Time Slots */}
                {timeSlots.map((time, timeIdx) => (
                  <div key={timeIdx} className="grid grid-cols-8 border-b border-border last:border-b-0">
                    <div className="p-2 text-xs font-medium text-muted-foreground bg-muted">
                      {time}
                    </div>
                    {weekDates.map((date, dayIdx) => (
                      <div 
                        key={dayIdx} 
                        className={`p-2 min-h-[48px] border-l border-border hover:bg-muted/50 cursor-pointer transition-colors ${
                          isToday(date) ? 'bg-status-live/5' : ''
                        }`}
                      >
                        {/* Sessions would be rendered here */}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              /* List View */
              <div className="border border-border rounded-lg p-6 text-center">
                <div className="text-muted-foreground text-sm">
                  No sessions scheduled yet. Click "Add Session" to create your first session.
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between gap-3 p-5 border-t border-border flex-shrink-0">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 text-sm font-medium border border-border text-muted-foreground rounded-lg hover:bg-muted transition-colors"
            >
              Back to Details
            </button>
            <button
              type="button"
              onClick={onComplete}
              className="px-6 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Complete Setup
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
