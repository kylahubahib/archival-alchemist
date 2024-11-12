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

class AdminRegistrationMail extends Mailable
{
    use Queueable, SerializesModels;

    protected $userType;
    protected $name;
    protected $email;
    protected $access;
    protected $registrationLink;

    /**
     * Create a new message instance.
     */
    public function __construct($userType, $name, $email, $access, $registrationLink)
    {
        $this->userType = $userType;
        $this->name = $name;
        $this->email = $email;
        $this->access = $access;
        $this->registrationLink = $registrationLink;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Admin Registration Mail',
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
            view: 'emails.admin-registration',
            with: [
                'userType' => $this->userType,
                'name' => $this->name,
                'email' => $this->email,
                'access' => $this->access,
                'registrationLink' => $this->registrationLink,
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
