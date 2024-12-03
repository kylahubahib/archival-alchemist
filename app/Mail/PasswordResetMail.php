<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailable\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Auth;

class PasswordResetMail extends Mailable
{
    use Queueable, SerializesModels;

    protected $name;
    protected $email;
    protected $passwordResetLink;

    /**
     * Create a new message instance.
     */
    public function __construct($name, $email, $passwordResetLink)
    {
        $this->name = $name;
        $this->email = $email;
        $this->passwordResetLink = $passwordResetLink;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Reset Password Mail',
            to: [$this->email], // Just using the email address without a name
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        $user = Auth::user();

        return new Content(
            view: 'emails.password-reset',
            with: [
                'name' => $this->name,
                'email' => $this->email,
                'passwordResetLink' => $this->passwordResetLink,
            ],

        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
