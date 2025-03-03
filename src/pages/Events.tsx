import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { cn } from '../lib/utils';

const Events = () => {
  const { events, results, fetchEvents, fetchResults } = useStore();
  const [selectedStage, setSelectedStage] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    fetchEvents();
    fetchResults();
  }, []);

  const formatDateFilter = (date: string) => {
    const d = new Date(date);
    return `${d.getDate()}-${d.toLocaleString('en-US', { month: 'long' })}`;
  };

  const hasResults = (eventId: string) => results.some(result => result.event_id === eventId);

  const filteredEvents = events.filter(event => {
    const eventDate = formatDateFilter(event.start_time);
    return (
      !hasResults(event.id) && // Remove events with published results
      (selectedStage === 'all' || event.stage === selectedStage) &&
      (searchQuery === '' || event.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedDate === '' || eventDate === selectedDate)
    );
  });

  const formatDateTime = (time: string) => {
    const date = new Date(time);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }) + ' at ' + date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Upcoming Events</h1>
        <p className="text-lg opacity-75">Stay updated with live events</p>
      </div>

      {/* Search, Date, and Stage Filters */}
      <div className="flex flex-wrap gap-4 justify-center">
        <input
          type="text"
          placeholder="Search event..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        />
        <select
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="">All Dates</option>
          {[...new Set(events.map(event => formatDateFilter(event.start_time)))].map(date => (
            <option key={date} value={date}>{date}</option>
          ))}
        </select>
        <select
          value={selectedStage}
          onChange={(e) => setSelectedStage(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">All Stages</option>
          {[...new Set(events.map(event => event.stage).filter(Boolean))].map(stage => (
            <option key={stage} value={stage}>{stage}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {filteredEvents.map(event => (
          <div
            key={event.id}
            className={cn(
              "rounded-lg border p-6 backdrop-blur-sm",
              "bg-gradient-to-br from-primary-50/10 to-primary-100/10"
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-semibold">{event.name}</h3>
              </div>
              <span className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary">
                {event.type}
              </span>
            </div>

            {/* Event Details */}
            <div className="mb-4 space-y-2 text-sm text-gray-800 dark:text-gray-200">
              {event.stage && (
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-500">{event.stage}</span>
                </div>
              )}
              {event.start_time && (
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-500">{formatDateTime(event.start_time)}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;
