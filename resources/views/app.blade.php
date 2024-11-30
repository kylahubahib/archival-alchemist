<!DOCTYPE html>

<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>

        <!-- Include the Pusher script just before the closing body tag -->
        <script src="https://js.pusher.com/8.4/pusher.min.js"></script>
        <script>
            // Initialize Pusher with your app's key and cluster
            var pusher = new Pusher('de9d8a76e8ee6c4a4d9a', {
                cluster: 'ap1',
                encrypted: true
            });

            // Subscribe to the desired channel
            var channel = pusher.subscribe('manuscript.123'); // replace with your actual channel name

            // Bind an event to the channel
            channel.bind('NewComment', function(data) {
                console.log(data);
            });
        </script>

        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <!-- CSRF Token -->
        <meta name="csrf-token" content="{{ csrf_token() }}">
        
        @livewireStyles

        <title inertia>{{ config('app.name', 'Archival Alchemist') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
        @yield('content')
        <!-- <div id="placeholder"></div>
        <script type="text/javascript" src="http://your-server-ip/web-apps/apps/api/documents/api.js"></script> -->
        @livewireScripts
    </body>
</html>
