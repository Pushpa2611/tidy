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

function create_form_submissions_table() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'form_submissions';
    
    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE $table_name (
        id mediumint(9) NOT NULL AUTO_INCREMENT,
        form_id varchar(100) NOT NULL,
        form_data longtext NOT NULL,
        submitted_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
        PRIMARY KEY  (id)
    ) $charset_collate;";

    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
}
register_activation_hook(__FILE__, 'create_form_submissions_table');

// add_action('wp_enqueue_scripts', 'enqueue_form_scripts');

// function enqueue_form_scripts() {
//     wp_enqueue_script(
//         'form-submission',
//         get_template_directory_uri() . '/blocks/bootstrap-form/src/form-submission.js',
//         array('jquery'),
//         filemtime(get_template_directory() . '/blocks/bootstrap-form/src/form-submission.js'),
//         true
//     );
    
//     wp_localize_script('form-submission', 'wpApiSettings', array(
//         'ajaxurl' => admin_url('admin-ajax.php'),
//         'nonce' => wp_create_nonce('wp_rest')
//     ));
// }

// Include form block files
function tidy_forms_include_block_files() {
    include_once get_template_directory() . '/blocks/bootstrap-form/submissions.php';
    include_once get_template_directory() . '/blocks/bootstrap-form/process-form.php';
}
add_action('init', 'tidy_forms_include_block_files');