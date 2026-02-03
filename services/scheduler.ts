
export interface ScheduledPost {
    id: string;
    title: string;
    date: Date;
    platforms: ('youtube' | 'facebook')[];
    status: 'scheduled' | 'posted' | 'failed';
    thumbnail?: string;
}

// Mock Data
let MOCK_POSTS: ScheduledPost[] = [
    {
        id: '1',
        title: 'Funny Cat Compilation #1',
        date: new Date(new Date().setHours(10, 0, 0, 0)), // Today 10 AM
        platforms: ['youtube', 'facebook'],
        status: 'posted',
    },
    {
        id: '2',
        title: 'Thai Food Review - Pad Thai',
        date: new Date(new Date().setDate(new Date().getDate() + 1)), // Tomorrow
        platforms: ['youtube'],
        status: 'scheduled',
    },
    {
        id: '3',
        title: 'Travel Vlog: Chiang Mai',
        date: new Date(new Date().setDate(new Date().getDate() + 3)), // +3 Days
        platforms: ['facebook'],
        status: 'scheduled',
    },
];

export const getScheduledPosts = async (): Promise<ScheduledPost[]> => {
    // Simulate API delay
    return new Promise((resolve) => {
        setTimeout(() => resolve(MOCK_POSTS), 500);
    });
};

export const scheduleNewPost = async (post: Omit<ScheduledPost, 'id' | 'status'>): Promise<ScheduledPost> => {
    return new Promise((resolve) => {
        const newPost: ScheduledPost = {
            ...post,
            id: Math.random().toString(36).substr(2, 9),
            status: 'scheduled'
        };
        MOCK_POSTS.push(newPost);
        setTimeout(() => resolve(newPost), 800);
    });
};
