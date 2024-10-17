<?php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'auth/google', 'auth/google/callback'],
    
    'allowed_methods' => ['*'], // Allow all methods, or specify what you need

    'allowed_origins' => ['http://127.0.0.1:8000'], // Adjust this to match your frontend's origin

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'], // Allow all headers

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true, // Change to true if you need to send cookies or HTTP auth info
];
