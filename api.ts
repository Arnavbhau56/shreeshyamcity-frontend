import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Properties API
export const propertyAPI = {
    getAll: (params?: any) => api.get('/properties/', { params }),
    getById: (id: string) => api.get(`/properties/${id}/`),
    getFeatured: () => api.get('/properties/featured/'),
    getNewLaunches: () => api.get('/properties/new_launches/'),
    getCommercial: () => api.get('/properties/commercial/'),
    create: (data: any) => api.post('/properties/', data),
    update: (id: string, data: any) => api.put(`/properties/${id}/`, data),
    delete: (id: string) => api.delete(`/properties/${id}/`),
};

// Customers API
export const customerAPI = {
    getAll: () => api.get('/users/customers/'),
    getById: (id: string) => api.get(`/users/customers/${id}/`),
    create: (data: any) => api.post('/users/customers/', data),
    update: (id: string, data: any) => api.put(`/users/customers/${id}/`, data),
    delete: (id: string) => api.delete(`/users/customers/${id}/`),
    exportCSV: () => api.get('/users/customers/export_csv/', { responseType: 'blob' }),
};

// Leads API
export const leadAPI = {
    getAll: () => api.get('/leads/'),
    getById: (id: string) => api.get(`/leads/${id}/`),
    create: (data: any) => api.post('/leads/', data),
    update: (id: string, data: any) => api.put(`/leads/${id}/`, data),
    delete: (id: string) => api.delete(`/leads/${id}/`),
    exportCSV: () => api.get('/leads/export_csv/', { responseType: 'blob' }),
};

// Enquiries API
export const enquiryAPI = {
    getAll: () => api.get('/enquiries/'),
    getById: (id: string) => api.get(`/enquiries/${id}/`),
    create: (data: any) => api.post('/enquiries/', data),
    update: (id: string, data: any) => api.put(`/enquiries/${id}/`, data),
    delete: (id: string) => api.delete(`/enquiries/${id}/`),
    sendEmail: (id: string, body: string) => api.post(`/enquiries/${id}/send_email/`, { body }),
    resolve: (id: string) => api.post(`/enquiries/${id}/resolve/`),
};

// Agents API
export const agentAPI = {
    getAll: () => api.get('/agents/'),
    getById: (id: string) => api.get(`/agents/${id}/`),
    create: (data: any) => api.post('/agents/', data),
    update: (id: string, data: any) => api.put(`/agents/${id}/`, data),
    delete: (id: string) => api.delete(`/agents/${id}/`),
    exportCSV: () => api.get('/agents/export_csv/', { responseType: 'blob' }),
};

// Blogs API
export const blogAPI = {
    getAll: () => api.get('/blogs/'),
    getById: (id: string) => api.get(`/blogs/${id}/`),
    create: (data: any) => api.post('/blogs/', data),
    update: (id: string, data: any) => api.put(`/blogs/${id}/`, data),
    delete: (id: string) => api.delete(`/blogs/${id}/`),
};

// Admin Auth API
export const authAPI = {
    login: (email: string, password: string) => api.post('/users/admin/login/', { email, password }),
};

// Team API
export const teamAPI = {
    getAll: () => api.get('/users/team/'),
    getById: (id: string) => api.get(`/users/team/${id}/`),
    create: (data: any) => api.post('/users/team/', data),
    update: (id: string, data: any) => api.put(`/users/team/${id}/`, data),
    delete: (id: string) => api.delete(`/users/team/${id}/`),
};

// Analytics API
export const analyticsAPI = {
    getDashboard: () => api.get('/analytics/dashboard/'),
};

export default api;
