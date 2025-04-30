<?php
$current_year = date('Y');
$attributes = $block->attributes;
$starting_year = isset($attributes['startingYear']) ? esc_html($attributes['startingYear']) : '';
$show_starting_year = isset($attributes['showStartingYear']) ? $attributes['showStartingYear'] : false;
?>

<div <?php echo get_block_wrapper_attributes(); ?>>
    <p class="copyright-date-block">
        <?php if ( $show_starting_year && $starting_year ) : ?>
            <?php echo $starting_year . '-' . esc_html($current_year); ?>
        <?php else : ?>
            <?php echo esc_html($current_year); ?>
        <?php endif; ?>
    </p>
</div>
