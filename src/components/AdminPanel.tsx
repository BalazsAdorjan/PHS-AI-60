import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AppUser } from '../types';
import { getSessions, deleteSession, addSession } from '../services/sessionService';

interface Props {
  currentUser: AppUser;
}

const emptyForm = {
  title: '',
  description: '',
  room: '',
  timeslot: '',
  capacity: 50,
};

export default function AdminPanel({ currentUser: _currentUser }: Props) {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const { data: sessions } = useQuery({
    queryKey: ['sessions'],
    queryFn: getSessions,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['sessions'] });

  const deleteMutation = useMutation({
    mutationFn: deleteSession,
    onSuccess: invalidate,
  });

  const addMutation = useMutation({
    mutationFn: addSession,
    onSuccess: () => {
      invalidate();
      setForm(emptyForm);
      setShowForm(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.room || !form.timeslot) return;
    addMutation.mutate({ ...form });
  };

  return (
    <div className="mb-8 bg-amber-50 border border-amber-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-amber-800">Admin Panel</h2>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="text-sm px-3 py-1 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
        >
          {showForm ? 'Cancel' : '+ Add Session'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-3 mb-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <input
              required
              placeholder="Title"
              className="border border-gray-300 rounded px-2 py-1.5 text-sm w-full"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <input
              required
              placeholder="Room"
              className="border border-gray-300 rounded px-2 py-1.5 text-sm w-full"
              value={form.room}
              onChange={(e) => setForm({ ...form, room: e.target.value })}
            />
            <input
              required
              placeholder="Timeslot (e.g. 09:00 – 10:00)"
              className="border border-gray-300 rounded px-2 py-1.5 text-sm w-full"
              value={form.timeslot}
              onChange={(e) => setForm({ ...form, timeslot: e.target.value })}
            />
            <input
              type="number"
              min={1}
              placeholder="Capacity"
              className="border border-gray-300 rounded px-2 py-1.5 text-sm w-full"
              value={form.capacity}
              onChange={(e) =>
                setForm({ ...form, capacity: Number(e.target.value) })
              }
            />
          </div>
          <textarea
            placeholder="Description"
            rows={2}
            className="border border-gray-300 rounded px-2 py-1.5 text-sm w-full"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <button
            type="submit"
            disabled={addMutation.isPending}
            className="text-sm px-4 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60 transition-colors"
          >
            {addMutation.isPending ? 'Saving...' : 'Save Session'}
          </button>
        </form>
      )}

      <div className="text-sm text-amber-700 font-medium mb-2">
        All Sessions ({sessions?.length ?? 0})
      </div>
      <div className="space-y-2">
        {sessions?.map((s) => (
          <div
            key={s.id}
            className="flex items-center justify-between bg-white border border-amber-100 rounded px-3 py-2 gap-2"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{s.title}</p>
              <p className="text-xs text-gray-500">
                {s.timeslot} · {s.room} · {s.registeredUsers.length}/{s.capacity} registered
              </p>
            </div>
            <button
              onClick={() => deleteMutation.mutate(s.id)}
              disabled={deleteMutation.isPending}
              className="shrink-0 text-xs text-red-600 hover:text-red-800 border border-red-200 rounded px-2 py-0.5 hover:bg-red-50 transition-colors"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
