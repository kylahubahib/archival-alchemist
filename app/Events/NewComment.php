<?php
namespace App\Events;

use App\Models\DocComment;
use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class NewComment implements ShouldBroadcast
{
    public $comment;

    /**
     * Create a new event instance.
     *
     * @param  \App\Models\DocComment  $comment
     * @return void
     */
    public function __construct(DocComment $comment)
    {
        $this->comment = $comment;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel
     */
    public function broadcastOn()
    {
        return new Channel('manuscript.' . $this->comment->man_doc_id);
    }

    /**
     * Get the data to broadcast.
     *
     * @return array
     */
    public function broadcastWith()
    {
        return [
            'comment' => $this->comment,
        ];
    }
}
