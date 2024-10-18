import './bootstrap';
import '../css/app.css';
import 'react-toastify/dist/ReactToastify.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { NextUIProvider } from '@nextui-org/react';
import Forum from './Pages/Users/Forum';
const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
        <NextUIProvider>
            <App {...props} />
        </NextUIProvider>
    );
    },
    progress: {
        color: '#4B5563',
    },
});
