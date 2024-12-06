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
        <h2 style="color: #898282;">Hello {{$data['name']}},</h2>

        <p>Your adviser has finished reviewing your manuscript titled <strong>{{ $data['manuscriptTitle'] }}</strong>.</p>

        <p>The current status of your manuscript is <strong>{{ $data['feedbackStatus'] }}</strong>.</p>

        <p>Feedback Comment:</p>
        <blockquote>{{ $data['feedbackComment'] }}</blockquote>

        <p>Thank you for your hard work, and we wish you the best with your manuscript!</p>

    </main>

    <footer style="margin-top: 2rem; font-family:Arial, Helvetica, sans-serif">
        <p style="margin-top: 0.75rem; color: #A0AEC0;">© Archival Alchemist. All Rights Reserved.</p>
    </footer>
</section>
