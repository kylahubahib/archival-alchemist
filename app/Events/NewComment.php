<?php

namespace App\Events;

use App\Models\DocComment;
use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class NewComment implements ShouldBroadcast
{
    public $comment;
    public $manuscriptId; // Property to store the manuscript ID

    /**
     * Create a new event instance.
     *
     * @param  \App\Models\DocComment  $comment
     * @param  int  $manuscriptId
     * @return void
     */
    public function __construct(DocComment $comment, $manuscriptId)
    {
        $this->comment = $comment;
        $this->manuscriptId = $manuscriptId; // Store the manuscript_id (man_doc_id in your case)
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel
     */
    public function broadcastOn()
    {
        // Broadcasting to channel 'manuscript.{man_doc_id}'
        return new Channel('manuscript.' . $this->manuscriptId);
    }

    /**
     * Get the data to broadcast.
     *
     * @return array
     */
    public function broadcastWith()
    {
        // Broadcasting the comment data
        return [
            'comment' => $this->comment,
        ];
    }
}
