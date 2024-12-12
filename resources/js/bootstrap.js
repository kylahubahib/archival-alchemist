import { router } from '@inertiajs/react';
import axios from 'axios';
window.axios = axios;

// Enable credentials for cross-origin requests
window.axios.defaults.withCredentials = true;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

router.on('finish', (event) => {
    if (event.detail.visit.url === route('logout')) {
        delete axios.defaults.headers.common['X-CSRF-TOKEN']; // Clear the token
        axios.get('/sanctum/csrf-cookie') // Refresh the CSRF token
            .then(() => {
                console.log('CSRF token refreshed successfully after logout.');
            })
            .catch(err => {
                console.error('Error refreshing CSRF token:', err);
            });
    }
});


/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allow your team to quickly build robust real-time web applications.
 */

import './echo';
