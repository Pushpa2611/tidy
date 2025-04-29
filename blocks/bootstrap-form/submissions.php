<?php
/**
 * Handles form submissions storage and admin display
 */

// Create custom database table on plugin activation
function tidy_forms_create_db_table() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'tidy_form_submissions';
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
function tidy_forms_create_db_table_on_theme_load() {
    if (get_option('tidy_forms_db_version') !== '1.0') {
        tidy_forms_create_db_table();
        update_option('tidy_forms_db_version', '1.0');
    }
}
add_action('after_setup_theme', 'tidy_forms_create_db_table_on_theme_load');


// Save form submission
function tidy_forms_process_submission() {
    if (isset($_POST['tidy_form_id'])) {
        global $wpdb;
        $table_name = $wpdb->prefix . 'tidy_form_submissions';
        
        $form_id = sanitize_text_field($_POST['tidy_form_id']);
        unset($_POST['tidy_form_id']);
        
        $form_data = array();
        foreach ($_POST as $key => $value) {
            $form_data[sanitize_text_field($key)] = sanitize_text_field($value);
        }
        
        $wpdb->insert(
            $table_name,
            array(
                'form_id' => $form_id,
                'form_data' => maybe_serialize($form_data)
            )
        );
        
        wp_send_json_success(array('message' => sanitize_text_field($_POST['success_message'] ?? 'Thank you for your submission.')));
    }
}

add_action('wp_ajax_tidy_forms_submit', 'tidy_forms_process_submission');
add_action('wp_ajax_nopriv_tidy_forms_submit', 'tidy_forms_process_submission');

// Add admin menu
function tidy_forms_admin_menu() {
    add_menu_page(
        'Form Submissions',
        'Form Submissions',
        'manage_options',
        'tidy-form-submissions',
        'tidy_forms_submissions_page',
        'dashicons-feedback',
        30
    );
}
add_action('admin_menu', 'tidy_forms_admin_menu');

// Admin submissions page
// Admin submissions page
function tidy_forms_submissions_page() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'tidy_form_submissions';
    $submissions = $wpdb->get_results("SELECT * FROM $table_name ORDER BY submitted_at DESC");
    
    ?>
    <div class="wrap">
        <h1>Form Submissions</h1>
        <table class="wp-list-table widefat fixed striped">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Form ID</th>
                    <th>Submission Data</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($submissions as $submission): 
                    $form_data = maybe_unserialize($submission->form_data);
                    // Remove technical fields
                    unset($form_data['action']);
                    unset($form_data['tidy_form_id']);
                    unset($form_data['success_message']);
                ?>
                <tr>
                    <td><?php echo $submission->id; ?></td>
                    <td><?php echo $submission->form_id; ?></td>
                    <td>
                        <pre><?php 
                            if (!empty($form_data)) {
                                foreach ($form_data as $key => $value) {
                                    echo esc_html($key) . ': ' . esc_html($value) . "\n";
                                }
                            } else {
                                echo 'No form data';
                            }
                        ?></pre>
                    </td>
                    <td><?php echo $submission->submitted_at; ?></td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
    <?php
}