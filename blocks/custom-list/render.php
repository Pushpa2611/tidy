<?php
$list_items = $attributes['listItems'] ?? [];
?>

<div <?php echo get_block_wrapper_attributes(); ?>>
    <ul class="list-group">
        <?php foreach ($list_items as $item) : ?>
            <li class="list-group-item <?php echo esc_attr($item['className'] ?? ''); ?>">
                <?php echo esc_html($item['content'] ?? ''); ?>
            </li>
        <?php endforeach; ?>
    </ul>
</div>