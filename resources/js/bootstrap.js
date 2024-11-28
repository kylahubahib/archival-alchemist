import axios from 'axios';
window.axios = axios;

// Set default headers
//window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Add the CSRF token from the meta tag
const csrfToken = document.querySelector('meta[name="csrf-token"]');

if (csrfToken) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken.getAttribute('content');
} else {
    console.warn('CSRF token not found in the document meta tags.');
}

/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allow your team to quickly build robust real-time web applications.
 */

import './echo';
