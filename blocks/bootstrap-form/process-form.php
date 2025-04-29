<?php
/**
 * Handles form processing for the frontend
 */

function tidy_forms_enqueue_scripts() {
    wp_enqueue_script(
        'tidy-forms-handler',
        get_template_directory_uri() . '/blocks/bootstrap-form/process-form.js',
        array('jquery'),
        filemtime(get_template_directory() . '/blocks/bootstrap-form/process-form.js'),
        true
    );
    
    wp_localize_script(
        'tidy-forms-handler',
        'tidyForms',
        array(
            'ajaxurl' => admin_url('admin-ajax.php')
        )
    );
}
add_action('wp_enqueue_scripts', 'tidy_forms_enqueue_scripts');