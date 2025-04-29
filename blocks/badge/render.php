<?php
$content = $attributes['content'] ?? '';
$style = $attributes['style'] ?? 'primary';
$pill = $attributes['pill'] ?? false;
$link = $attributes['link'] ?? '';

// Base classes
$class = 'badge bg-' . esc_attr($style);
if ($pill) {
    $class .= ' rounded-pill';
}

// Output
if ($link) {
    printf(
        '<a %s href="%s">%s</a>',
        get_block_wrapper_attributes(['class' => $class]),
        esc_url($link),
        esc_html($content)
    );
} else {
    printf(
        '<span %s>%s</span>',
        get_block_wrapper_attributes(['class' => $class]),
        esc_html($content)
    );
}
?>