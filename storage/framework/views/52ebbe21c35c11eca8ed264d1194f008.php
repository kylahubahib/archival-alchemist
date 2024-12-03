<section style="width: 80%; max-width: 32rem; padding: 2rem; margin: 0 auto; background-color: #e9f1ff;">
    <!-- Static Header -->
    <header>
        
        
        <div style="margin-left: -2rem; padding: 0; font-family: 'Arial';">
            <?php if(isset($message)): ?>
                <!-- Embed image if in email context -->
                <img style="height: 7rem; display: block; vertical-align: middle;"
                    src="<?php echo e($message->embed(public_path('/images/archival-alchemist-logo.png'))); ?>"
                    alt="Archival Alchemist Logo" />
            <?php else: ?>
                <!-- Use regular asset URL if outside email context -->
                <img style="height: 7rem; display: block; vertical-align: middle;"
                    src="<?php echo e(asset('images/archival-alchemist-logo.png')); ?>" alt="Archival Alchemist Logo" />
            <?php endif; ?>
        </div>
    </header>

    <!-- Dynamic Main Content (Slot) -->
    <main style="margin-top: 1.5rem; font-family: Arial, Helvetica, sans-serif;">
        <?php echo e($slot); ?>

    </main>

    <!-- Static Footer -->
    <footer style="margin-top: 2rem; font-family: Arial, Helvetica, sans-serif">
        <p style="color: #A0AEC0;">
            This email was sent to <strong><?php echo e($email); ?></strong>. If you'd rather not receive this kind of email,
            you can <strong>unsubscribe</strong> or <strong>manage your email preferences</strong>.
        </p>

        <p style="margin-top: 0.75rem; color: #A0AEC0;">© Archival Alchemist. All Rights Reserved.</p>
    </footer>
</section>
<?php /**PATH D:\Programming Projects\PHP\archival-alchemist-main\archival-alchemist-main\resources\views/components/email-layout.blade.php ENDPATH**/ ?>