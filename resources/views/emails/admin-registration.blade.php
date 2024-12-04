<section style="width: 80%; max-width: 32rem; padding: 2rem; margin: 0 auto; background-color: #e9f1ff;">
    <header>
        <div style="margin-left: -2rem; padding: 0; font-family: 'Arial';">
            {{-- <table style="width: auto; table-layout: fixed; border-collapse: collapse;">
                <tr>
                    <td style="padding: 0; margin: 0; vertical-align: middle;">
                        <img style="height: 7rem; display: block; vertical-align: middle;"
                            src="{{ $message->embed('images/archival-alchemist.png') }}" alt="Archival Alchemist Logo" />
                    </td>
                    <!-- Ensure this text is styled but doesn't get included in the MIME part -->
                    <td
                        style="color: #413839; text-shadow: 1px 1px 0 rgba(0,0,0,0.3); line-height: 1.9rem; letter-spacing: 0.15rem; font-family: 'Brush Script MT', cursive; padding: 0; margin: 0; vertical-align: middle;">
                        <p style="font-size: 2.2rem; margin: 0;">rchival</p>
                        <p style="font-size: 2.2rem; margin: 0;">lchemist</p>
                    </td>

                </tr>
            </table> --}}
            <img style="height: 7rem; display: block; vertical-align: middle;"
                src="{{ $message->embed('images/archival-alchemist-logo.png') }}" alt="Archival Alchemist Logo" />
        </div>
    </header>

    <main style="margin-top: 1.5rem; font-family:Arial, Helvetica, sans-serif">
        <h2 style="color: #898282;">Hello {{ $name }},</h2>

        <p style="margin-top: 0.5rem; line-height: 1.625; color: #718096;">
            We are excited to invite you to join our team as a
            <span style="font-weight: bold;">
                {{ $userType === 'admin' ? 'Co-Institution Admin' : 'Co-Super Admin' }}
            </span>
            on <span style="font-weight: bold;">Archival Alchemist</span>.
            Your role will be essential in shaping the platform and contributing to its success.
        </p>

        <a href={{ $registrationLink }}
            style="display: inline-block; padding: 0.5rem 1.5rem; margin-top: 1rem; font-size: 0.875rem; font-weight: bold; text-decoration: none; color: white; background-color: #045a8d; border-radius: 6px; cursor: pointer;">
            Accept the invite
        </a>

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
