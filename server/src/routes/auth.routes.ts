// Auth routes file with .js extensions added to imports

import { register } from './register.js';
import { login } from './login.js';
import { logout } from './logout.js';
import { getUserProfile } from './userProfile.js';

// Define your routes here

export default function authRoutes(app) {
    app.post('/auth/register', register);
    app.post('/auth/login', login);
    app.post('/auth/logout', logout);
    app.get('/auth/user_profile', getUserProfile);
}