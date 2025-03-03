import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { supabase } from '../lib/supabase';
import { calculatePoints } from '../lib/utils';
import { Plus, Save, LogIn } from 'lucide-react';
import { cn } from '../lib/utils';

const AdminDashboard = () => {
  const { events, groups, fetchEvents, fetchGroups } = useStore();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [newEvent, setNewEvent] = useState({
    name: '',
    type: 'individual' as const,
    max_winners: 3,
    stage: '',
    start_time: ''
  });
  const [newGroup, setNewGroup] = useState({
    name: '',
    team_code: ''
  });
  const [newResult, setNewResult] = useState({
    event_id: '',
    group_id: '',
    position: 1,
    participant_name: ''
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (session) {
        fetchEvents();
        fetchGroups();
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (error: any) {
      setError(error.message || 'An error occurred during sign in');
    }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('events')
        .insert([newEvent]);
      
      if (error) throw error;
      
      fetchEvents();
      setNewEvent({ name: '', type: 'individual', max_winners: 3, stage: '', start_time: '' });
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const handleAddGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('groups')
        .insert([newGroup]);
      
      if (error) throw error;
      
      fetchGroups();
      setNewGroup({ name: '', team_code: '' });
    } catch (error) {
      console.error('Error adding group:', error);
    }
  };

  const handleAddResult = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const event = events.find(e => e.id === newResult.event_id);
      if (!event) return;

      const points = calculatePoints(newResult.position, event.type);
      
      const { error } = await supabase
        .from('results')
        .insert([{
          ...newResult,
          points
        }]);
      
      if (error) throw error;
      
      setNewResult({ event_id: '', group_id: '', position: 1, participant_name: '' });
    } catch (error) {
      console.error('Error adding result:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Login</h1>
            <p className="text-gray-600 dark:text-gray-300">Sign in to access the dashboard</p>
          </div>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-200 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={cn(
                  "w-full p-2 rounded border bg-white dark:bg-gray-700",
                  "border-gray-300 dark:border-gray-600",
                  "focus:ring-2 focus:ring-primary focus:border-transparent",
                  "dark:text-white"
                )}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={cn(
                  "w-full p-2 rounded border bg-white dark:bg-gray-700",
                  "border-gray-300 dark:border-gray-600",
                  "focus:ring-2 focus:ring-primary focus:border-transparent",
                  "dark:text-white"
                )}
                required
              />
            </div>
            <button
              type="submit"
              className={cn(
                "w-full flex items-center justify-center space-x-2",
                "bg-primary text-white p-2 rounded",
                "hover:bg-primary-600 transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              )}
            >
              <LogIn className="h-4 w-4" />
              <span>Sign In</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-lg opacity-75">Manage events, groups, and results</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Add Event Form */}
        <div className="p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Add New Event</h2>
          <form onSubmit={handleAddEvent} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Event Name</label>
              <input
                type="text"
                value={newEvent.name}
                onChange={e => setNewEvent(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-2 rounded border"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Event Type</label>
              <select
                value={newEvent.type}
                onChange={e => setNewEvent(prev => ({ ...prev, type: e.target.value as 'individual' | 'dual' | 'group' }))}
                className="w-full p-2 rounded border"
              >
                <option value="individual">Individual</option>
                <option value="dual">Dual</option>
                <option value="group">Group</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stage</label>
              <input
                type="text"
                value={newEvent.stage}
                onChange={e => setNewEvent(prev => ({ ...prev, stage: e.target.value }))}
                className="w-full p-2 rounded border"
                placeholder="e.g., Main Stage"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Start Time</label>
              <input
                type="datetime-local"
                value={newEvent.start_time}
                onChange={e => setNewEvent(prev => ({ ...prev, start_time: e.target.value }))}
                className="w-full p-2 rounded border"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 bg-primary text-white p-2 rounded hover:bg-primary-600"
            >
              <Plus className="h-4 w-4" />
              <span>Add Event</span>
            </button>
          </form>
        </div>

        {/* Add Group Form */}
        <div className="p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Add New Group</h2>
          <form onSubmit={handleAddGroup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Group Name</label>
              <input
                type="text"
                value={newGroup.name}
                onChange={e => setNewGroup(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-2 rounded border"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Team Code</label>
              <input
                type="text"
                value={newGroup.team_code}
                onChange={e => setNewGroup(prev => ({ ...prev, team_code: e.target.value }))}
                className="w-full p-2 rounded border"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 bg-primary text-white p-2 rounded hover:bg-primary-600"
            >
              <Plus className="h-4 w-4" />
              <span>Add Group</span>
            </button>
          </form>
        </div>

        {/* Add Result Form */}
        <div className="p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Add Result</h2>
          <form onSubmit={handleAddResult} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Event</label>
              <select
                value={newResult.event_id}
                onChange={e => setNewResult(prev => ({ ...prev, event_id: e.target.value }))}
                className="w-full p-2 rounded border"
                required
              >
                <option value="">Select Event</option>
                {events.map(event => (
                  <option key={event.id} value={event.id}>{event.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Group</label>
              <select
                value={newResult.group_id}
                onChange={e => setNewResult(prev => ({ ...prev, group_id: e.target.value }))}
                className="w-full p-2 rounded border"
                required
              >
                <option value="">Select Group</option>
                {groups.map(group => (
                  <option key={group.id} value={group.id}>{group.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Participant Name</label>
              <input
                type="text"
                value={newResult.participant_name}
                onChange={e => setNewResult(prev => ({ ...prev, participant_name: e.target.value }))}
                className="w-full p-2 rounded border"
                placeholder="Name of participant/team member"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Position</label>
              <select
                value={newResult.position}
                onChange={e => setNewResult(prev => ({ ...prev, position: Number(e.target.value) }))}
                className="w-full p-2 rounded border"
                required
              >
                <option value={1}>1st Place</option>
                <option value={2}>2nd Place</option>
                <option value={3}>3rd Place</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 bg-primary text-white p-2 rounded hover:bg-primary-600"
            >
              <Save className="h-4 w-4" />
              <span>Add Result</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;