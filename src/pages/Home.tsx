import React, { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Trophy, Medal } from 'lucide-react';
import { cn } from '../lib/utils';

const Home = () => {
  const { groups, results, fetchGroups, fetchResults } = useStore();

  useEffect(() => {
    fetchGroups();
    fetchResults();
  }, []);

  const sortedGroups = [...groups].sort((a, b) => b.total_points - a.total_points);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">DAKSHA Arts Fest</h1>
        <p className="text-lg opacity-75">Live Leaderboard & Results</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedGroups.map((group, index) => (
          <div
            key={group.id}
            className="relative overflow-hidden rounded-lg border p-6 backdrop-blur-sm"
            style={{
              background: index === 0 ? 'linear-gradient(135deg, rgba(250,204,21,0.1) 0%, rgba(234,179,8,0.1) 100%)' :
                       index === 1 ? 'linear-gradient(135deg, rgba(226,232,240,0.1) 0%, rgba(148,163,184,0.1) 100%)' :
                       index === 2 ? 'linear-gradient(135deg, rgba(234,88,12,0.1) 0%, rgba(194,65,12,0.1) 100%)' :
                       undefined
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">{group.name}</h3>
              {index < 3 && (
                <Medal className={cn(
                  "h-6 w-6",
                  index === 0 ? "text-yellow-500" :
                  index === 1 ? "text-gray-400" :
                  "text-orange-600"
                )} />
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{group.total_points}</span>
              <span className="text-sm opacity-75">points</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;