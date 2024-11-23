<div>
    <form wire:submit.prevent="addComment">
        <textarea wire:model="content" placeholder="Write a comment..." class="form-control"></textarea>
        <button type="submit" class="btn btn-primary mt-2">Post Comment</button>
    </form>

    <ul class="mt-4">
        <?php $__currentLoopData = $comments; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $comment): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <li>
                <strong><?php echo e($comment->user->name); ?>:</strong> <?php echo e($comment->content); ?>

                <br>
                <small><?php echo e($comment->created_at->diffForHumans()); ?></small>
            </li>
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
    </ul>
</div>
<?php /**PATH C:\xampp\htdocs\archival-alchemist-main\resources\views\livewire\comment-manager.blade.php ENDPATH**/ ?>