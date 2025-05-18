'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';

type Meeting = {
    id: number;
    topic: string;
    start_time: string;
    duration: number;
};

export default function MeetingDetailPage() {
    const { id } = useParams();
    const router = useRouter();

    const [meeting, setMeeting] = useState<Meeting | null>(null);

    useEffect(() => {
        async function fetchMeeting() {
            try {
                const res = await axios.get(`/api/meetings/${id}`);
                setMeeting(res.data);
            } catch (err) {
                console.error('Failed to fetch meeting:', err);
            }
        }

        if (id) fetchMeeting();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!meeting) return;
        const { name, value } = e.target;
        setMeeting({ ...meeting, [name]: name === 'duration' ? Number(value) : value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.put(`/api/meetings/${id}`, meeting);
            router.push('/meetings');
        } catch (err) {
            console.error('Failed to update meeting:', err);
        }
    };

    if (!meeting) return <div className="p-4">Loading...</div>;

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-xl font-bold mb-4">Edit Zoom Meeting</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-semibold mb-1">Topic</label>
                    <input
                        type="text"
                        name="topic"
                        value={meeting.topic}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div>
                    <label className="block font-semibold mb-1">Start Time</label>
                    <input
                        type="datetime-local"
                        name="start_time"
                        value={meeting.start_time.slice(0, 16)} // agar format sesuai input
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div>
                    <label className="block font-semibold mb-1">Duration (minutes)</label>
                    <input
                        type="number"
                        name="duration"
                        value={meeting.duration}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />
                </div>

                <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
}
