import axios, { AxiosError, AxiosResponse } from 'axios';
import { createClient } from './supabase/client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 second timeout
});

// Add interceptor to inject Supabase Token
api.interceptors.request.use(async (config) => {
    try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.access_token) {
            config.headers.Authorization = `Bearer ${session.access_token}`;
        }
    } catch (error) {
        console.warn('Failed to get auth session:', error);
    }
    return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        // Handle common error cases
        if (error.response) {
            const status = error.response.status;
            
            switch (status) {
                case 401:
                    // Unauthorized - redirect to login
                    if (typeof window !== 'undefined') {
                        console.warn('Unauthorized - redirecting to login');
                        // Don't redirect if already on login/signup page
                        if (!window.location.pathname.includes('/login') && 
                            !window.location.pathname.includes('/signup')) {
                            // window.location.href = '/login';
                        }
                    }
                    break;
                case 403:
                    console.warn('Forbidden - insufficient permissions');
                    break;
                case 404:
                    console.warn('Resource not found');
                    break;
                case 500:
                    console.error('Server error');
                    break;
            }
        } else if (error.request) {
            // Network error
            console.error('Network error - please check your connection');
        }
        
        return Promise.reject(error);
    }
);

// API helper functions
export const apiHelpers = {
    // Jobs
    getJobs: (params?: Record<string, string>) => 
        api.get('/jobs/', { params }),
    getJob: (id: number | string) => 
        api.get(`/jobs/${id}/`),
    createJob: (data: any) => 
        api.post('/jobs/', data),
    updateJob: (id: number | string, data: any) => 
        api.patch(`/jobs/${id}/`, data),
    deleteJob: (id: number | string) => 
        api.delete(`/jobs/${id}/`),

    // Companies
    getCompanies: (params?: Record<string, string>) => 
        api.get('/companies/', { params }),
    getCompany: (id: number | string) => 
        api.get(`/companies/${id}/`),
    createCompany: (data: any) => 
        api.post('/companies/', data),
    updateCompany: (id: number | string, data: any) => 
        api.patch(`/companies/${id}/`, data),

    // Applications
    getApplications: (params?: Record<string, string>) => 
        api.get('/applications/', { params }),
    getApplication: (id: number | string) => 
        api.get(`/applications/${id}/`),
    createApplication: (data: any) => 
        api.post('/applications/', data),
    updateApplication: (id: number | string, data: any) => 
        api.patch(`/applications/${id}/`, data),

    // Auth
    register: (data: any) => 
        api.post('/auth/register/', data),
    getProfile: () => 
        api.get('/auth/profile/'),
    updateProfile: (data: any) => 
        api.patch('/auth/profile/', data),

    // Analytics
    trackJobView: (jobId: number | string) => 
        api.post(`/analytics/track/job/${jobId}/`),
    trackSearch: (query: string, filters: any, resultsCount: number) => 
        api.post('/analytics/track/search/', { query, filters, results_count: resultsCount }),
    getEmployerAnalytics: (days?: number) => 
        api.get('/analytics/employer/', { params: { days } }),
    getSeekerAnalytics: (days?: number) => 
        api.get('/analytics/seeker/', { params: { days } }),

    // Health check
    healthCheck: () => 
        api.get('/health/'),
};

export default api;
