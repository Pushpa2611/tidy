<?php
$tabs = $attributes['tabs'] ?? [];
$variant = $attributes['variant'] ?? 'tabs';
$tab_id = 'tab-' . uniqid();
?>

<div <?php echo get_block_wrapper_attributes(); ?>>
    <ul class="nav nav-<?php echo esc_attr($variant); ?>" id="<?php echo esc_attr($tab_id); ?>" role="tablist">
        <?php foreach ($tabs as $index => $tab) : ?>
            <li class="nav-item" role="presentation">
                <button
                    class="nav-link <?php echo $tab['active'] ? 'active' : ''; ?>"
                    id="<?php echo esc_attr($tab_id . '-' . $index); ?>-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#<?php echo esc_attr($tab_id . '-' . $index); ?>"
                    type="button"
                    role="tab"
                    aria-controls="<?php echo esc_attr($tab_id . '-' . $index); ?>"
                    aria-selected="<?php echo $tab['active'] ? 'true' : 'false'; ?>"
                >
                    <?php echo esc_html($tab['title']); ?>
                </button>
            </li>
        <?php endforeach; ?>
    </ul>

    <div class="tab-content p-3 border border-top-0">
        <?php foreach ($tabs as $index => $tab) : ?>
            <div
                class="tab-pane fade <?php echo $tab['active'] ? 'show active' : ''; ?>"
                id="<?php echo esc_attr($tab_id . '-' . $index); ?>"
                role="tabpanel"
                aria-labelledby="<?php echo esc_attr($tab_id . '-' . $index); ?>-tab"
            >
                <?php echo apply_filters('the_content', $tab['content']); ?>
            </div>
        <?php endforeach; ?>
    </div>
</div>