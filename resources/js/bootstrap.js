import axios from 'axios';
window.axios = axios;

// Ensure credentials (cookies) are included in requests
window.axios.defaults.withCredentials = true;

// Set X-Requested-With header for Laravel
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';


/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allow your team to quickly build robust real-time web applications.
 */

import './echo';
