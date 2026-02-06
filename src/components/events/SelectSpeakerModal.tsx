import { useState, useMemo } from 'react';
import { X, Plus, Search } from 'lucide-react';

interface SelectSpeakerModalProps {
  isOpen: boolean;
  availableSpeakers: string[];
  selectedSpeakers: string[];
  onAddSpeaker: (speaker: string) => void;
  onRemoveSpeaker: (speaker: string) => void;
  onAddNewSpeaker: (speaker: string) => void;
  onClose: () => void;
}

export function SelectSpeakerModal({
  isOpen,
  availableSpeakers,
  selectedSpeakers,
  onAddSpeaker,
  onRemoveSpeaker,
  onAddNewSpeaker,
  onClose,
}: SelectSpeakerModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [newSpeakerName, setNewSpeakerName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const filteredSpeakers = useMemo(() => {
    return availableSpeakers.filter(speaker =>
      speaker.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [availableSpeakers, searchQuery]);

  const handleAddNewSpeaker = () => {
    if (newSpeakerName.trim()) {
      onAddNewSpeaker(newSpeakerName);
      onAddSpeaker(newSpeakerName);
      setNewSpeakerName('');
      setShowAddForm(false);
    }
  };

  const handleSelectSpeaker = (speaker: string) => {
    if (selectedSpeakers.includes(speaker)) {
      onRemoveSpeaker(speaker);
    } else {
      onAddSpeaker(speaker);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-foreground/40 z-50 animate-fade-in"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
        <div className="bg-card rounded-xl shadow-panel w-full max-w-md animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="text-lg font-bold text-card-foreground">Select or Add Speaker</h2>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[calc(100vh-300px)] overflow-y-auto">
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 pl-9 text-sm border border-border rounded-lg bg-card text-card-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none transition-colors"
              />
            </div>

            {/* Add New Speaker Button */}
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full mb-4 px-4 py-3 border-2 border-dashed border-primary/50 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors flex items-center justify-center gap-2 text-primary font-medium text-sm"
              >
                <Plus className="w-4 h-4" />
                Add New Speaker
              </button>
            )}

            {/* Add New Speaker Form */}
            {showAddForm && (
              <div className="mb-4 p-3 border border-primary/20 rounded-lg bg-primary/5">
                <input
                  type="text"
                  placeholder="Enter speaker name..."
                  value={newSpeakerName}
                  onChange={(e) => setNewSpeakerName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-card text-card-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none transition-colors mb-2"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAddNewSpeaker}
                    disabled={!newSpeakerName.trim()}
                    className="flex-1 px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setNewSpeakerName('');
                    }}
                    className="flex-1 px-3 py-1.5 text-xs font-medium border border-border text-muted-foreground rounded-lg hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Speakers List */}
            <div className="space-y-2">
              {filteredSpeakers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No speakers found
                </div>
              ) : (
                filteredSpeakers.map(speaker => (
                  <button
                    key={speaker}
                    onClick={() => handleSelectSpeaker(speaker)}
                    className={`w-full p-3 rounded-lg border text-left transition-colors flex items-center gap-3 ${
                      selectedSpeakers.includes(speaker)
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-card hover:border-primary/50 hover:bg-muted/50'
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${
                        selectedSpeakers.includes(speaker)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-primary/10 text-primary'
                      }`}
                    >
                      {speaker
                        .split(' ')
                        .map(n => n[0])
                        .join('')
                        .toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-card-foreground text-sm">{speaker}</div>
                    </div>

                    {/* Checkbox */}
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        selectedSpeakers.includes(speaker)
                          ? 'border-primary bg-primary'
                          : 'border-border bg-card'
                      }`}
                    >
                      {selectedSpeakers.includes(speaker) && (
                        <svg className="w-3 h-3 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-4 border-t border-border">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium border border-border text-muted-foreground rounded-lg hover:bg-muted transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
