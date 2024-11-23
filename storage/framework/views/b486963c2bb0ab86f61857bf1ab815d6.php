<?php $__env->startSection('content'); ?>
    <h1><?php echo e($post->title); ?></h1>
    <p><?php echo e($post->body); ?></p>

    <h3>Comments</h3>
    <?php
$__split = function ($name, $params = []) {
    return [$name, $params];
};
[$__name, $__params] = $__split('comment-manager');

$__html = app('livewire')->mount($__name, $__params, 'lw-3200716898-0', $__slots ?? [], get_defined_vars());

echo $__html;

unset($__html);
unset($__name);
unset($__params);
unset($__split);
if (isset($__slots)) unset($__slots);
?>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.app', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH C:\xampp\htdocs\archival-alchemist-main\resources\views\livewire\show.blade.php ENDPATH**/ ?>