<div>
    <form wire:submit.prevent="addComment">
        <textarea wire:model="content" placeholder="Write a comment..." class="form-control"></textarea>
        <button type="submit" class="btn btn-primary mt-2">Post Comment</button>
    </form>

    <ul class="mt-4">
        @foreach($comments as $comment)
            <li>
                <strong>{{ $comment->user->name }}:</strong> {{ $comment->content }}
                <br>
                <small>{{ $comment->created_at->diffForHumans() }}</small>
            </li>
        @endforeach
    </ul>
</div>
