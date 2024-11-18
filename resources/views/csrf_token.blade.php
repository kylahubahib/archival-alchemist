<html>
    <head>
        <!-- Include CSRF token in a meta tag -->
        <meta name="csrf-token" content="{{ csrf_token() }}">
    </head>
    <body>
        <!-- You can leave the body empty if just fetching the CSRF token -->
    </body>
</html>
