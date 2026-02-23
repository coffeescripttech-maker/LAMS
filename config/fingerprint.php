<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Fingerprint API URL
    |--------------------------------------------------------------------------
    |
    | This is the URL of the Python fingerprint matching API service.
    | For local development, use http://127.0.0.1:7000
    | For production, use your Render.com deployment URL
    |
    */
    'api_url' => env('FINGERPRINT_API_URL', 'http://127.0.0.1:7000'),
];
