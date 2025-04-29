<?php
function customon_enqueue_styles() {
    wp_enqueue_style('customon-style', get_stylesheet_uri());
    wp_enqueue_style('customon-extra-style', get_template_directory_uri() . '/css/style.css');
    wp_enqueue_style('font-awesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');
}
add_action('wp_enqueue_scripts', 'customon_enqueue_styles');

function tidy_register_blocks() {
    register_block_type(__DIR__ . '/blocks/current-year');
    register_block_type(__DIR__ . '/blocks/copyright-date');
    register_block_type(__DIR__ . '/blocks/bootstrap-button');
    register_block_type(__DIR__ . '/blocks/custom-list');
    register_block_type(__DIR__ . '/blocks/accordion');
    register_block_type(__DIR__ . '/blocks/feature-list');
    register_block_type(__DIR__ . '/blocks/badge');
    register_block_type(__DIR__ . '/blocks/bootstrap-tabs');
    register_block_type(__DIR__ . '/blocks/bootstrap-form');
}
add_action('init', 'tidy_register_blocks');

function tidy_enqueue_block_assets() {
    // Frontend styles
    wp_enqueue_style(
        'bootstrap', 
        'https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/css/bootstrap.min.css',
        array(),
        '5.3.5'
    );
    
    // Frontend scripts (loaded in footer)
    wp_enqueue_script(
        'bootstrap-js',
        'https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/js/bootstrap.bundle.min.js',
        array(),
        '5.3.5',
        true
    );
}
add_action('enqueue_block_assets', 'tidy_enqueue_block_assets');

function tidy_enqueue_editor_assets() {
    // Editor styles
    add_editor_style('https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/css/bootstrap.min.css');
    add_editor_style('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');
    
    // Block-specific editor styles
    add_editor_style(get_template_directory_uri() . '/blocks/accordion/editor.css');
    
    // Load Bootstrap JS in editor for interactive previews
    wp_enqueue_script(
        'bootstrap-js-editor',
        'https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/js/bootstrap.bundle.min.js',
        array(),
        '5.3.5',
        true
    );
}
add_action('admin_init', 'tidy_enqueue_editor_assets');

function tidy_enqueue_form_validation() {
    wp_enqueue_script(
        'tidy-form-validation',
        get_template_directory_uri() . '/assets/js/form-validation.js',
        array(),
        filemtime(get_template_directory() . '/assets/js/form-validation.js'),
        true
    );
}
add_action('wp_enqueue_scripts', 'tidy_enqueue_form_validation');