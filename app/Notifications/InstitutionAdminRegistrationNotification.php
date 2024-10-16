<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class InstitutionAdminRegistrationNotification extends Notification
{
    use Queueable;

    protected $admin;


    /**
     * Create a new notification instance.
     */
    public function __construct($admin)
    {
        $this->admin = $admin;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        //If want to send to email, use return ['mail']
        return ['database'];
    }

    /**
     * Get the database representation of the notification.
     *
     * @return array<int, string>
     */
    public function toDatabase($notifiable)
    {
        return [
            'message' => 'A new institution admin ' . $this->admin->user->name . ' has registered and sent proof for validation.',
            'admin_id' => $this->admin->id,
            'proof_url' => $this->admin->ins_admin_proof,
        ];
    }

    /**
     * Get the mail representation of the notification.
     */
    // public function toMail(object $notifiable): MailMessage
    // {
    //     return (new MailMessage)
    //                 ->line('The introduction to the notification.')
    //                 ->action('Notification Action', url('/'))
    //                 ->line('Thank you for using our application!');
    // }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
