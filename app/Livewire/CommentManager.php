<?php
namespace App\Http\Livewire;

use Livewire\Component;
use App\Models\Comment;
use App\Models\DocComment;

use Illuminate\Support\Facades\Auth;

class CommentManager extends Component
{
    public $comments;
    public $content;

    public function mount()
    {
        $this->comments = DocComment::latest()->get();
    }

    public function addComment()
    {
        $validatedData = $this->validate([
            'content' => 'required|string|max:255',
        ]);

        DocComment::create([
            'user_id' => Auth::id() ,
            'content' => $validatedData['content'],
        ]);

        $this->comments = DocComment::latest()->get();
        $this->content = '';
    }

    public function render()
    {
        return view('livewire.comment-manager');
    }
}
