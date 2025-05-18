'use client';

import { useEffect, useState } from 'react';
import http from '@/helper/http';
import { useRouter } from 'next/navigation';

type Meeting = {
  id: string;
  topic: string;
  start_time: string;
  join_url: string;
};

const MeetingsPage = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const router = useRouter();

  const fetchMeetings = async () => {
    try {
      const response = await http.get('/meetings');
      setMeetings(response.data);
    } catch (error) {
      console.error('Error fetching meetings:', error);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleDelete = async (meetingId: string) => {
    if (!confirm('Are you sure you want to delete this meeting?')) {
      return;
    }

    setLoadingId(meetingId);
    try {
      await http.delete(`/meetings/${meetingId}`);
      window.location.href = '/meetings';
    } catch (error) {
      console.error('Error deleting meeting:', error);
      alert('Failed to delete meeting');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-blue-600 text-white py-4 shadow-md">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Zoom Meetings</h1>
          <a href="/meetings/new" className="text-blue-200 hover:text-white">
            + Create New Meeting
          </a>
        </div>
      </header>

      <main className="mt-6 max-w-3xl mx-auto px-4">
        {meetings.length > 0 ? (
          <ul className="space-y-4">
            {meetings.map((meeting) => (
              <li key={meeting.id} className="bg-white shadow-md rounded-lg p-4 hover:bg-blue-50 transition-all">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{meeting.topic}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(meeting.start_time).toLocaleString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                      })}
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => router.push(`/meetings/edit/${meeting.id}`)}
                      className="text-blue-600 hover:text-blue-900"
                      disabled={loadingId === meeting.id}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(meeting.id)}
                      className="text-red-600 hover:text-red-900"
                      disabled={loadingId === meeting.id}
                    >
                      {loadingId === meeting.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">No meetings scheduled.</p>
        )}
      </main>
    </div>
  );
};

export default MeetingsPage;
