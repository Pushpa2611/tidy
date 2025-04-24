<?php

function customon_enqueue_styles() {
    wp_enqueue_style('customon-style', get_stylesheet_uri());
    wp_enqueue_style('customon-extra-style', get_template_directory_uri() . '/css/style.css');
}
add_action('wp_enqueue_scripts', 'customon_enqueue_styles');

function tidy_register_blocks() {
    register_block_type(__DIR__ . '/blocks/current-year');
    // Copyright Date Block
    register_block_type(
        __DIR__ . '/blocks/copyright-date',
        array(
          'render_callback' => 'tidy_render_copyright_date',
        )
      );
}
add_action('init', 'tidy_register_blocks');

function tidy_render_copyright_date($attributes) {
    $current_year = date('Y');
    ob_start(); ?>
    
    <p class="copyright-date-block">
      <?php if ($attributes['showStartingYear']) : ?>
        <?php echo esc_html($attributes['startingYear']) . '-' . esc_html($current_year); ?>
      <?php else : ?>
        <?php echo esc_html($current_year); ?>
      <?php endif; ?>
    </p>
  
    <?php return ob_get_clean();
  }
  add_action('init', 'tidy_register_blocks');