<!DOCTYPE html>
<html lang="<?php echo e(str_replace('_', '-', app()->getLocale())); ?>">
    <head>

        <!-- Include the Pusher script just before the closing body tag -->
<script src="https://js.pusher.com/8.4/pusher.min.js"></script>
<script>
    // Initialize Pusher with your app's key and cluster
    var pusher = new Pusher('de9d8a76e8ee6c4a4d9a', {
        cluster: 'ap1',
        encrypted: true
    });

    // Subscribe to the desired channel
    var channel = pusher.subscribe('manuscript.123'); // replace with your actual channel name

    // Bind an event to the channel
    channel.bind('NewComment', function(data) {
        console.log(data);
    });
</script>



        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <!-- CSRF Token -->
        <meta name="csrf-token" content="<?php echo e(csrf_token()); ?>">
        <?php echo \Livewire\Mechanisms\FrontendAssets\FrontendAssets::styles(); ?>


        <title inertia><?php echo e(config('app.name', 'Archival Alchemist')); ?></title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        <?php echo app('Tighten\Ziggy\BladeRouteGenerator')->generate(); ?>
        <?php echo app('Illuminate\Foundation\Vite')->reactRefresh(); ?>
        <?php echo app('Illuminate\Foundation\Vite')(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"]); ?>
        <?php if (!isset($__inertiaSsrDispatched)) { $__inertiaSsrDispatched = true; $__inertiaSsrResponse = app(\Inertia\Ssr\Gateway::class)->dispatch($page); }  if ($__inertiaSsrResponse) { echo $__inertiaSsrResponse->head; } ?>
    </head>
    <body class="font-sans antialiased">
        <?php if (!isset($__inertiaSsrDispatched)) { $__inertiaSsrDispatched = true; $__inertiaSsrResponse = app(\Inertia\Ssr\Gateway::class)->dispatch($page); }  if ($__inertiaSsrResponse) { echo $__inertiaSsrResponse->body; } else { ?><div id="app" data-page="<?php echo e(json_encode($page)); ?>"></div><?php } ?>
        <?php echo $__env->yieldContent('content'); ?>
        <!-- <div id="placeholder"></div>
        <script type="text/javascript" src="http://your-server-ip/web-apps/apps/api/documents/api.js"></script> -->
        <?php echo \Livewire\Mechanisms\FrontendAssets\FrontendAssets::scripts(); ?>

    </body>
</html>
<?php /**PATH C:\xampp\htdocs\archival-alchemist-main\resources\views/app.blade.php ENDPATH**/ ?>