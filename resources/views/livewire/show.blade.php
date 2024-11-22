{{-- @extends('layouts.app')

@section('content')
    <h1>{{ $post->title }}</h1>
    <p>{{ $post->body }}</p>

    <h3>Comments</h3>
    @livewire('comment-manager')
@endsection --}}


@extends('layouts.app')

@section('content')
    <div id="manuscript-container">
        <!-- Your manuscript content goes here -->
    </div>
@endsection

@section('scripts')
    <!-- Pusher Script -->
    <script src="https://js.pusher.com/8.4/pusher.min.js"></script>
    <script>
        // Initialize Pusher with your app's key and cluster
        var pusher = new Pusher('de9d8a76e8ee6c4a4d9a', {
            cluster: 'ap1',
            encrypted: true
        });

        // Subscribe to the desired channel
        var channel = pusher.subscribe('manuscript.{{ $manuscriptId }}'); // replace with your actual channel name

        // Bind an event to the channel
        channel.bind('NewComment', function(data) {
            console.log(data);
        });
    </script>
@endsection
