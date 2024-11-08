<?php

namespace App\Events;

use App\Models\ForumPost; // Or your specific Post model path
use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;

class NewPostCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $post;

    public function __construct(ForumPost $post)
    {
        $this->post = $post;
    }

    public function broadcastOn()
    {
        return new Channel('forum-posts'); // Public channel for forum posts
    }
}
