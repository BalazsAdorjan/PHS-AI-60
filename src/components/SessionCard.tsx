import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Session, AppUser } from '../types';
import { registerUser, unregisterUser } from '../services/sessionService';

interface Props {
  session: Session;
  currentUser: AppUser;
}

export default function SessionCard({ session, currentUser }: Props) {
  const queryClient = useQueryClient();
  const userId = currentUser.id;

  const isRegistered = session.registeredUsers.includes(userId);
  const isWaitlisted = session.waitlist.includes(userId);
  const isFull = session.registeredUsers.length >= session.capacity;
  const spotsLeft = session.capacity - session.registeredUsers.length;

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['sessions'] });

  const registerMutation = useMutation({
    mutationFn: () => registerUser(session.id, userId),
    onSuccess: invalidate,
  });

  const unregisterMutation = useMutation({
    mutationFn: () => unregisterUser(session.id, userId),
    onSuccess: invalidate,
  });

  const isBusy = registerMutation.isPending || unregisterMutation.isPending;

  // Capacity bar fill percentage
  const fillPct = Math.min(
    (session.registeredUsers.length / session.capacity) * 100,
    100
  );

  return (
    <div
      className={`bg-white rounded-lg border shadow-sm p-4 flex flex-col gap-3 transition-opacity ${
        isBusy ? 'opacity-70' : ''
      }`}
    >
      {/* Title + room */}
      <div>
        <h3 className="font-semibold text-gray-900 leading-snug">
          {session.title}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-500 bg-gray-100 rounded px-1.5 py-0.5">
            {session.room}
          </span>
          {isFull && !isWaitlisted && !isRegistered && (
            <span className="text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded px-1.5 py-0.5">
              Full
            </span>
          )}
          {isRegistered && (
            <span className="text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded px-1.5 py-0.5">
              Registered
            </span>
          )}
          {isWaitlisted && (
            <span className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5">
              Waitlisted
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 leading-relaxed">
        {session.description}
      </p>

      {/* Capacity bar */}
      <div>
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>
            {session.registeredUsers.length} / {session.capacity} registered
          </span>
          <span>
            {isFull
              ? `${session.waitlist.length} on waitlist`
              : `${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} left`}
          </span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              fillPct >= 100 ? 'bg-red-400' : fillPct >= 75 ? 'bg-amber-400' : 'bg-green-400'
            }`}
            style={{ width: `${fillPct}%` }}
          />
        </div>
      </div>

      {/* Action button */}
      <div className="mt-auto pt-1">
        {isRegistered || isWaitlisted ? (
          <button
            onClick={() => unregisterMutation.mutate()}
            disabled={isBusy}
            className="w-full text-sm py-1.5 px-3 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed transition-colors"
          >
            {isBusy
              ? 'Processing...'
              : isWaitlisted
              ? 'Leave Waitlist'
              : 'Unregister'}
          </button>
        ) : isFull ? (
          <button
            onClick={() => registerMutation.mutate()}
            disabled={isBusy}
            className="w-full text-sm py-1.5 px-3 rounded border border-amber-400 text-amber-700 bg-amber-50 hover:bg-amber-100 disabled:cursor-not-allowed transition-colors"
          >
            {isBusy ? 'Processing...' : 'Join Waitlist'}
          </button>
        ) : (
          <button
            onClick={() => registerMutation.mutate()}
            disabled={isBusy}
            className="w-full text-sm py-1.5 px-3 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:cursor-not-allowed transition-colors"
          >
            {isBusy ? 'Processing...' : 'Register'}
          </button>
        )}

        {(registerMutation.isError || unregisterMutation.isError) && (
          <p className="text-xs text-red-500 mt-1 text-center">
            {(registerMutation.error || unregisterMutation.error) instanceof Error
              ? (registerMutation.error || unregisterMutation.error)!.message
              : 'Something went wrong'}
          </p>
        )}
      </div>
    </div>
  );
}
