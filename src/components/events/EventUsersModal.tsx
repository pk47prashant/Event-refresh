import { useState } from 'react';
import { X, Upload, Plus, Search, Users, UserCheck, Briefcase, Building, Minimize2, Maximize2 } from 'lucide-react';
import { EventFormData, EventUser } from '@/types/event';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface EventUsersModalProps {
  isOpen: boolean;
  eventData: EventFormData | null;
  onBack: () => void;
  onComplete: (isDraft: boolean) => void;
  onClose: () => void;
}

type UserType = 'attendee' | 'delegate' | 'crew' | 'organizer';
type ActiveTab = UserType;

const userTypeConfig: Record<UserType, { label: string; icon: React.ElementType; pluralLabel: string }> = {
  attendee: { label: 'Attendee', icon: Users, pluralLabel: 'Attendees' },
  delegate: { label: 'Delegate/VIP', icon: UserCheck, pluralLabel: 'Delegates/VIP' },
  crew: { label: 'Event Crew', icon: Briefcase, pluralLabel: 'Event Crew' },
  organizer: { label: 'Organizer', icon: Building, pluralLabel: 'Organizers' },
};

export function EventUsersModal({ isOpen, eventData, onBack, onComplete, onClose }: EventUsersModalProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('attendee');
  const [users, setUsers] = useState<Record<UserType, EventUser[]>>({
    attendee: [],
    delegate: [],
    crew: [],
    organizer: [],
  });
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);

  // Mock existing users in system for selection
  const [existingUsers] = useState<EventUser[]>([
    { id: '1', eventId: '', firstName: 'John', lastName: 'Doe', email: 'john@example.com', userType: 'attendee', customFields: {} },
    { id: '2', eventId: '', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', userType: 'attendee', customFields: {} },
    { id: '3', eventId: '', firstName: 'Mike', lastName: 'Johnson', email: 'mike@example.com', userType: 'attendee', customFields: {} },
    { id: '4', eventId: '', firstName: 'Sarah', lastName: 'Williams', email: 'sarah@example.com', userType: 'attendee', customFields: {} },
  ]);

  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  const [isAddingNewUser, setIsAddingNewUser] = useState(false);

  const filteredExistingUsers = existingUsers.filter(user =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileUpload = () => {
    // Mock file upload - in real implementation, this would open a file picker
    console.log('Upload users file');
  };

  const handleAddUser = (user: EventUser) => {
    const userWithType: EventUser = { ...user, userType: activeTab };
    setUsers(prev => ({
      ...prev,
      [activeTab]: [...prev[activeTab], userWithType],
    }));
    setIsAddUserModalOpen(false);
    setIsAddingNewUser(false);
    setNewUser({ firstName: '', lastName: '', email: '' });
  };

  const handleCreateNewUser = () => {
    if (!newUser.firstName || !newUser.lastName || !newUser.email) return;
    
    const user: EventUser = {
      id: Date.now().toString(),
      eventId: '',
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      userType: activeTab,
      customFields: {},
    };
    handleAddUser(user);
  };

  const handleRemoveUser = (userId: string) => {
    setUsers(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].filter(u => u.id !== userId),
    }));
  };

  if (!isOpen) return null;

  return (
    <>
      {!isMinimized && (
        <div 
          className="fixed inset-0 bg-foreground/40 z-50 animate-fade-in"
          onClick={onClose}
        />
      )}
      
      <div className={`fixed z-50 flex ${isMinimized ? 'bottom-4 right-4 w-96 h-16' : 'inset-0 items-center justify-center overflow-y-auto p-4'}`}>
          <div className={`bg-card rounded-xl shadow-panel ${isMinimized ? 'w-full h-full rounded-xl' : 'w-full h-screen flex-1'} animate-scale-in flex flex-col`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-6 py-4 rounded-t-xl flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Event Users</h2>
                {!isMinimized && (
                  <p className="text-primary-foreground/80 text-sm mt-1">
                    Manage attendees, delegates, crew, and organizers
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(prev => !prev)}
                  className="p-1.5 hover:bg-primary-foreground/10 rounded-lg transition-colors"
                  title={isMinimized ? 'Maximize' : 'Minimize'}
                >
                  {isMinimized ? (
                    <Maximize2 className="w-5 h-5" />
                  ) : (
                    <Minimize2 className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-primary-foreground/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {!isMinimized && (
            <>
              <div className="p-6 flex-1 overflow-y-auto">
                {/* Global Upload Button */}
                <div className="flex justify-end mb-4">
                  <button 
                    onClick={handleFileUpload}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Users
                  </button>
                </div>

                {/* User Type Tabs */}
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                  {(Object.keys(userTypeConfig) as UserType[]).map((type) => {
                    const config = userTypeConfig[type];
                    const Icon = config.icon;
                    return (
                      <button
                        key={type}
                        onClick={() => setActiveTab(type)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                          activeTab === type
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {config.pluralLabel}
                        <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-background/20">
                          {users[type].length}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* User Table Section */}
                <div className="border border-border rounded-lg">
                  <div className="flex items-center justify-between p-4 border-b border-border">
                    <h3 className="font-medium text-card-foreground">
                      {userTypeConfig[activeTab].pluralLabel}
                    </h3>
                    <button
                      onClick={() => setIsAddUserModalOpen(true)}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Select or Add User
                    </button>
                  </div>

                  {users[activeTab].length === 0 ? (
                    <div className="p-8 text-center">
                      <Users className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                      <p className="text-muted-foreground text-sm">
                        No {userTypeConfig[activeTab].pluralLabel.toLowerCase()} added yet
                      </p>
                      <p className="text-muted-foreground text-xs mt-1">
                        Click "Select or Add User" to add {userTypeConfig[activeTab].pluralLabel.toLowerCase()}
                      </p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>First Name</TableHead>
                          <TableHead>Last Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users[activeTab].map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>{user.firstName}</TableCell>
                            <TableCell>{user.lastName}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <button
                                onClick={() => handleRemoveUser(user.id)}
                                className="text-destructive text-sm hover:underline"
                              >
                                Remove
                              </button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between gap-3 p-5 border-t border-border flex-shrink-0">
                <button
                  type="button"
                  onClick={onBack}
                  className="px-4 py-2 text-sm font-medium border border-border text-muted-foreground rounded-lg hover:bg-muted transition-colors"
                >
                  Back
                </button>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => onComplete(true)}
                    className="px-6 py-2 text-sm font-medium border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors"
                  >
                    Draft
                  </button>
                  <button
                    type="button"
                    onClick={() => onComplete(false)}
                    className="px-6 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Save & Publish
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add/Select User Modal */}
      {isAddUserModalOpen && (
        <>
          <div 
            className="fixed inset-0 bg-foreground/40 z-[60] animate-fade-in"
            onClick={() => {
              setIsAddUserModalOpen(false);
              setIsAddingNewUser(false);
            }}
          />
          
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="bg-card rounded-xl shadow-panel w-full max-w-lg animate-scale-in max-h-[80vh] flex flex-col">
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <h3 className="font-bold text-card-foreground">
                  {isAddingNewUser ? 'Add New User' : 'Select or Add User'}
                </h3>
                <button
                  onClick={() => {
                    setIsAddUserModalOpen(false);
                    setIsAddingNewUser(false);
                  }}
                  className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 flex-1 overflow-y-auto">
                {isAddingNewUser ? (
                  /* New User Form */
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                        First Name <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="text"
                        value={newUser.firstName}
                        onChange={(e) => setNewUser(prev => ({ ...prev, firstName: e.target.value }))}
                        className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-card focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none"
                        placeholder="Enter first name"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                        Last Name <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="text"
                        value={newUser.lastName}
                        onChange={(e) => setNewUser(prev => ({ ...prev, lastName: e.target.value }))}
                        className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-card focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none"
                        placeholder="Enter last name"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                        Email <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-card focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none"
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>
                ) : (
                  /* User Selection */
                  <>
                    {/* Search */}
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name or email..."
                        className="w-full pl-10 pr-3 py-2 text-sm border border-border rounded-lg bg-card focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none"
                      />
                    </div>

                    {/* Add New User Button */}
                    <button
                      onClick={() => setIsAddingNewUser(true)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 mb-4 border-2 border-dashed border-primary/30 text-primary rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add New User
                    </button>

                    {/* Existing Users List */}
                    <div className="space-y-2">
                      {filteredExistingUsers.map((user) => (
                        <button
                          key={user.id}
                          onClick={() => handleAddUser(user)}
                          className="w-full flex items-center gap-3 p-3 border border-border rounded-lg hover:border-primary/50 hover:bg-muted/50 transition-colors text-left"
                        >
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                            {user.firstName[0]}{user.lastName[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-card-foreground truncate">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {user.email}
                            </p>
                          </div>
                        </button>
                      ))}

                      {filteredExistingUsers.length === 0 && searchQuery && (
                        <div className="text-center py-6 text-muted-foreground text-sm">
                          No users found matching "{searchQuery}"
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-5 py-4 border-t border-border flex justify-end gap-2">
                <button
                  onClick={() => {
                    if (isAddingNewUser) {
                      setIsAddingNewUser(false);
                    } else {
                      setIsAddUserModalOpen(false);
                    }
                  }}
                  className="px-4 py-2 text-sm font-medium border border-border text-muted-foreground rounded-lg hover:bg-muted transition-colors"
                >
                  {isAddingNewUser ? 'Back' : 'Cancel'}
                </button>
                {isAddingNewUser && (
                  <button
                    onClick={handleCreateNewUser}
                    disabled={!newUser.firstName || !newUser.lastName || !newUser.email}
                    className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add User
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
