// import { ApiService } from '../services/api.service';

const API_BASE = 'api/v1';

export const apiAuth = {
    login: () => `${API_BASE}/users/login`,
    register: () => `${API_BASE}/users/register`,
    profile: () => `${API_BASE}/users/profile`,
    logout: () => `${API_BASE}/users/logout`,
}
