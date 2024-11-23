<?php $__env->startSection('content'); ?>
    <div id="manuscript-container">
        <!-- Your manuscript content goes here -->
    </div>
<?php $__env->stopSection(); ?>

<?php $__env->startSection('scripts'); ?>
    <!-- Pusher Script -->
    <script src="https://js.pusher.com/8.4/pusher.min.js"></script>
    <script>
        // Initialize Pusher with your app's key and cluster
        var pusher = new Pusher('de9d8a76e8ee6c4a4d9a', {
            cluster: 'ap1',
            encrypted: true
        });

        // Subscribe to the desired channel
        var channel = pusher.subscribe('manuscript.<?php echo e($manuscriptId); ?>'); // replace with your actual channel name

        // Bind an event to the channel
        channel.bind('NewComment', function(data) {
            console.log(data);
        });
    </script>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.app', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH C:\xampp\htdocs\archival-alchemist-main\resources\views\livewire\show.blade.php ENDPATH**/ ?>