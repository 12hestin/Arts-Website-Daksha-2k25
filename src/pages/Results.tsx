import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { Trophy, Calendar, MapPin, Clock } from 'lucide-react';
import { cn } from '../lib/utils';

const Results = () => {
  const { events, results, groups, fetchEvents, fetchResults, fetchGroups } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStage, setSelectedStage] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    fetchEvents();
    fetchResults();
    fetchGroups();
  }, []);

  const getEventResults = (eventId) => {
    return results
      .filter(result => result.event_id === eventId)
      .sort((a, b) => a.position - b.position)
      .map(result => ({
        ...result,
        group: groups.find(g => g.id === result.group_id)
      }));
  };

  const formatDateTime = (time) => {
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

  const formatDateFilter = (time) => {
    const date = new Date(time);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredEvents = events.filter(event => 
    event.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedDate === '' || formatDateFilter(event.start_time) === selectedDate) &&
    (selectedStage === 'all' || event.stage === selectedStage) &&
    (selectedType === 'all' || event.type === selectedType)
  );

  const eventsWithResults = filteredEvents.filter(event => results.some(result => result.event_id === event.id));
  const stages = [...new Set(events.map(event => event.stage))];
  const eventTypes = [...new Set(events.map(event => event.type))];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Results</h1>
        <p className="text-lg opacity-75">Final standings for completed events</p>
      </div>

      {/* Search, Date, Stage, and Type Filters */}
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
          {stages.map(stage => (
            <option key={stage} value={stage}>{stage}</option>
          ))}
        </select>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">All Types</option>
          {eventTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {eventsWithResults.map(event => {
          const eventResults = getEventResults(event.id);
          return (
            <div key={event.id} className="rounded-lg border p-6 backdrop-blur-sm bg-gradient-to-br from-primary-50/10 to-primary-100/10">
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

              <div className="space-y-3">
                {eventResults.map(result => (
                  <div key={result.id} className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
                    <div className="flex items-center space-x-3">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center",
                        result.position === 1 ? "bg-yellow-100 text-yellow-700" :
                        result.position === 2 ? "bg-gray-100 text-gray-700" :
                        "bg-orange-100 text-orange-700"
                      )}>
                        {result.position}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">{result.group?.name}</span>
                        {result.participant_name && (
                            <span className="font-small">
                                {result.participant_name}
                            </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Trophy className="h-4 w-4 text-primary" />
                      <span>{result.points} pts</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Results;
