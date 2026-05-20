import { useQuery } from '@tanstack/react-query';
import { getSessions } from '../services/sessionService';
import { AppUser } from '../types';
import SessionCard from './SessionCard';

interface Props {
  currentUser: AppUser;
}

export default function SessionList({ currentUser }: Props) {
  const { data: sessions, isLoading, isError } = useQuery({
    queryKey: ['sessions'],
    queryFn: getSessions,
  });

  if (isLoading) {
    return (
      <div className="text-center py-16 text-gray-500">
        Loading sessions...
      </div>
    );
  }

  if (isError || !sessions) {
    return (
      <div className="text-center py-16 text-red-500">
        Failed to load sessions. Please refresh.
      </div>
    );
  }

  // Group sessions by timeslot
  const grouped = sessions.reduce<Record<string, typeof sessions>>(
    (acc, session) => {
      const slot = session.timeslot;
      if (!acc[slot]) acc[slot] = [];
      acc[slot].push(session);
      return acc;
    },
    {}
  );

  const sortedSlots = Object.keys(grouped).sort();

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-6">
        Programme — {sessions.length} session{sessions.length !== 1 ? 's' : ''}
      </h2>
      <div className="space-y-8">
        {sortedSlots.map((slot) => (
          <div key={slot}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded px-2 py-0.5">
                {slot}
              </span>
              <div className="flex-1 border-t border-gray-200" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {grouped[slot].map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  currentUser={currentUser}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
