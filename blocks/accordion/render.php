<?php
$items = $attributes['items'] ?? [];
$accordionId = $attributes['accordionId'] ?? 'accordion-' . uniqid();
$flush = $attributes['flush'] ?? false;
$accordionClass = $flush ? 'accordion accordion-flush' : 'accordion';
?>

<div <?php echo get_block_wrapper_attributes(); ?>>
    <div class="<?php echo esc_attr($accordionClass); ?>" id="<?php echo esc_attr($accordionId); ?>">
        <?php foreach ($items as $index => $item) : ?>
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button 
                        class="accordion-button <?php echo !($item['isOpen'] ?? false) ? 'collapsed' : ''; ?>" 
                        type="button" 
                        data-bs-toggle="collapse" 
                        data-bs-target="#collapse-<?php echo esc_attr($accordionId . '-' . $index); ?>"
                    >
                        <?php echo esc_html($item['title'] ?? ''); ?>
                    </button>
                </h2>
                <div 
                    id="collapse-<?php echo esc_attr($accordionId . '-' . $index); ?>" 
                    class="accordion-collapse collapse <?php echo ($item['isOpen'] ?? false) ? 'show' : ''; ?>"
                    data-bs-parent="#<?php echo esc_attr($accordionId); ?>"
                >
                    <div class="accordion-body">
                        <?php echo wp_kses_post($item['content'] ?? ''); ?>
                    </div>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
</div>