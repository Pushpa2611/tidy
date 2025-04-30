<?php
$features = $attributes['features'] ?? [];
$columns = $attributes['columns'] ?? 3; // Default to 3 columns if no value is set
$wrapper_attributes = get_block_wrapper_attributes([
  'class' => 'feature-list columns-' . $columns
]);
?>

<div <?php echo $wrapper_attributes; ?>>
  <?php foreach ($features as $feature) : ?>
    <div class="feature-item <?php echo esc_attr($feature['className'] ?? ''); ?>">
      <div class="feature-icon">
        <?php if (($feature['icon'] ?? '') === 'custom' && !empty($feature['customIcon'])) : ?>
          <i class="<?php echo esc_attr($feature['customIcon']); ?>"></i>
        <?php else : ?>
          <span class="dashicons dashicons-<?php echo esc_attr($feature['icon'] ?? 'star-filled'); ?>"></span>
        <?php endif; ?>
      </div>
      <div class="feature-content">
        <h3 class="feature-title"><?php echo esc_html($feature['title'] ?? ''); ?></h3>
        <p class="feature-text"><?php echo esc_html($feature['content'] ?? ''); ?></p>
      </div>
    </div>
  <?php endforeach; ?>
</div>
