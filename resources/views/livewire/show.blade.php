@extends('layouts.app')

@section('content')
    <h1>{{ $post->title }}</h1>
    <p>{{ $post->body }}</p>

    <h3>Comments</h3>
    @livewire('comment-manager')
@endsection
