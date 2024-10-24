import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

// Log environment variables for debugging
console.log("Pusher Key:", import.meta.env.VITE_PUSHER_APP_KEY);
console.log("Pusher Cluster:", import.meta.env.VITE_PUSHER_APP_CLUSTER);

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY, // Loaded from .env
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER, // Loaded from .env
    forceTLS: true,
    encrypted: true,
    auth: {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
});
