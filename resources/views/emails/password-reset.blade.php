<section style="width: 80%; max-width: 32rem; padding: 2rem; margin: 0 auto; background-color: #e9f1ff;">
    <header>
        <div style="margin-left: -2rem; padding: 0; font-family: 'Arial';">
            <img style="height: 7rem; display: block; vertical-align: middle;"
                src="{{ $message->embed('images/archival-alchemist-logo.png') }}" alt="Archival Alchemist Logo" />
        </div>
    </header>

    <main style="margin-top: 1.5rem; font-family:Arial, Helvetica, sans-serif">
        <h2 style="color: #898282;">Hello {{ $name }},</h2>

        <p style="margin-top: 0.5rem; line-height: 1.625; color: #718096;">
            We received a request to reset your password for your account at Archival Alchemist.
        </p>

        <p style="margin-top: 0.5rem; line-height: 1.625; color: #718096;">
            If you did not request a password reset, please ignore this email. Otherwise, click the link below to reset
            your password:
        </p>

        <a href="{{ $passwordResetLink }}"
            style="display: inline-block; padding: 0.5rem 1.5rem; margin-top: 1rem; font-size: 0.875rem; font-weight: bold; text-decoration: none; color: white; background-color: #045a8d; border-radius: 6px; cursor: pointer;">
            Reset Password
        </a>

        <div style="margin-top: 0.5rem; line-height: 1.625; color: #718096;">
            <b>Note:</b> <br>
            <p>
                For your security, please ensure your new password is strong and unique. If you have any questions or
                need assistance, contact our support team at archival.alchemist@gmail.com.
            </p>
        </div>

        <p style="margin-top: 2rem; color: #718096;">
            Thanks, <br>
            Archival Alchemist Team
        </p>
    </main>

    <footer style="margin-top: 2rem; font-family:Arial, Helvetica, sans-serif">
        <p style="color: #A0AEC0;">
            This email was sent to <strong>{{ $email }}</strong>. If you'd rather not receive this kind of email,
            you can
            <strong>unsubscribe</strong> or <strong>manage your email preferences</strong>.
        </p>

        <p style="margin-top: 0.75rem; color: #A0AEC0;">© Archival Alchemist. All Rights Reserved.</p>
    </footer>
</section>
