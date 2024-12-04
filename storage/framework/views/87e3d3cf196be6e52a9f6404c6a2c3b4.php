<section style="width: 80%; max-width: 32rem; padding: 2rem; margin: 0 auto; background-color: #e9f1ff;">
    <header>
        <div style="margin-left: -2rem; padding: 0; font-family: 'Arial';">
            
            <img style="height: 7rem; display: block; vertical-align: middle;"
                src="<?php echo e($message->embed('images/archival-alchemist-logo.png')); ?>" alt="Archival Alchemist Logo" />
        </div>
    </header>

    <main style="margin-top: 1.5rem; font-family:Arial, Helvetica, sans-serif">
        <h2 style="color: #898282;">Hello <?php echo e($name); ?>,</h2>

        <p style="margin-top: 0.5rem; line-height: 1.625; color: #718096;">
            We are excited to invite you to join our team as a
            <span style="font-weight: bold;">
                <?php echo e($userType === 'admin' ? 'Co-Institution Admin' : 'Co-Super Admin'); ?>

            </span>
            on <span style="font-weight: bold;">Archival Alchemist</span>.
            Your role will be essential in shaping the platform and contributing to its success.
        </p>

        <a href=<?php echo e($registrationLink); ?>

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
            This email was sent to <strong><?php echo e($email); ?></strong>. If you'd rather not receive this kind of email,
            you can
            <strong>unsubscribe</strong> or <strong>manage your email preferences</strong>.
        </p>

        <p style="margin-top: 0.75rem; color: #A0AEC0;">© Archival Alchemist. All Rights Reserved.</p>
    </footer>
</section>
<?php /**PATH D:\Programming Projects\PHP\archival-alchemist-main\archival-alchemist-main\resources\views/emails/admin-registration.blade.php ENDPATH**/ ?>