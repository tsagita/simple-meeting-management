'use client';

import { useForm } from 'react-hook-form';
import http from '@/helper/http';

type FormData = {
    topic: string;
    start_time: string;
};

const NewMeetingPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

    const onSubmit = async (data: FormData) => {
        try {
            const formattedData = {
                ...data,
                start_time: new Date(data.start_time).toISOString(),
            };
            await http.post('/meetings', formattedData);
            window.location.href = '/meetings';
        } catch (error) {
            console.error('Error creating meeting:', error);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <header className="bg-blue-600 text-white py-4 shadow-md">
                <div className="max-w-7xl mx-auto px-4">
                    <a href="/meetings">
                    <h1 className="text-2xl font-bold">Create New Meeting</h1>
                    </a>
                </div>
            </header>

            <main className="mt-6 max-w-2xl mx-auto px-4">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white shadow-lg rounded-lg p-6">
                    <div>
                        <label htmlFor="topic" className="block text-sm font-semibold text-gray-700">Meeting Topic</label>
                        <input
                            id="topic"
                            type="text"
                            {...register("topic", { required: "Topic is required" })}
                            className="w-full text-gray-900 mt-1 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.topic && <p className="text-red-600 text-sm">{errors.topic.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="start_time" className="block text-sm font-semibold text-gray-700">Start Time</label>
                        <input
                            id="start_time"
                            type="datetime-local"
                            {...register("start_time", { required: "Start time is required" })}
                            className="w-full text-gray-900  mt-1 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.start_time && <p className="text-red-600 text-sm">{errors.start_time.message}</p>}
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-all"
                        >
                            Create Meeting
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default NewMeetingPage;