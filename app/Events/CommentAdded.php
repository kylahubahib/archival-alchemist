<?php

namespace App\Events;

use App\Models\DocComment;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class CommentAdded implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $comment;
    public $manuscriptId;

    /**
     * Create a new event instance.
     *
     * @param  \App\Models\DocComment  $comment
     * @param  int  $manuscriptId
     * @return void
     */
    public function __construct(DocComment $comment, int $manuscriptId)
    {
        $this->comment = $comment;
        $this->manuscriptId = $manuscriptId;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new Channel('manuscript.' . $this->manuscriptId);
    }

    /**
     * Broadcast with additional data.
     *
     * @return array
     */
    public function broadcastWith()
    {
        return [
            'comment' => $this->comment->load('replies'),
            'manuscript_id' => $this->manuscriptId,
        ];
    }
}
