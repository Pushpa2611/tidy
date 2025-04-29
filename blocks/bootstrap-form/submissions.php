<?php
/**
 * Handles form submissions storage and admin display
 */

class Tidy_Forms_Handler {
    const DB_VERSION = '1.0';
    const DB_VERSION_OPTION = 'tidy_forms_db_version';

    public static function init() {
        add_action('after_setup_theme', [__CLASS__, 'create_db_table']);
        add_action('admin_menu', [__CLASS__, 'add_admin_menu']);
        add_action('wp_ajax_tidy_forms_submit', [__CLASS__, 'process_submission']);
        add_action('wp_ajax_nopriv_tidy_forms_submit', [__CLASS__, 'process_submission']);
        add_action('wp_enqueue_scripts', [__CLASS__, 'enqueue_scripts']);
        add_filter('wp_handle_upload_prefilter', [__CLASS__, 'handle_upload_prefilter']);
    }

    public static function create_db_table() {
        if (get_option(self::DB_VERSION_OPTION) !== self::DB_VERSION) {
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

            // Create upload directory
            self::create_upload_dir();

            update_option(self::DB_VERSION_OPTION, self::DB_VERSION);
        }
    }

    public static function create_upload_dir() {
        $upload_dir = wp_upload_dir();
        $tidy_forms_dir = $upload_dir['basedir'] . '/tidy-forms';
        
        if (!file_exists($tidy_forms_dir)) {
            wp_mkdir_p($tidy_forms_dir);
        }
        
        // Add .htaccess for security
        $htaccess = $tidy_forms_dir . '/.htaccess';
        if (!file_exists($htaccess)) {
            file_put_contents($htaccess, "Options -Indexes\nDeny from all");
        }
    }

    public static function enqueue_scripts() {
        wp_enqueue_script(
            'tidy-forms-handler',
            get_template_directory_uri() . '/blocks/bootstrap-form/process-form.js',
            ['jquery'],
            filemtime(get_template_directory() . '/blocks/bootstrap-form/process-form.js'),
            true
        );
        
        wp_localize_script(
            'tidy-forms-handler',
            'tidyForms',
            ['ajaxurl' => admin_url('admin-ajax.php')]
        );
    }

    public static function handle_upload_prefilter($file) {
        // Limit file size to 5MB
        $max_size = 5 * 1024 * 1024;
        if ($file['size'] > $max_size) {
            $file['error'] = __('File is too large. Maximum size is 5MB.', 'tidy-forms');
            return $file;
        }

        // Allow only specific file types
        $allowed_types = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'xls', 'xlsx'];
        $file_ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        
        if (!in_array($file_ext, $allowed_types)) {
            $file['error'] = __('Invalid file type. Allowed types: JPG, PNG, GIF, PDF, DOC, XLS', 'tidy-forms');
        }

        return $file;
    }

    public static function process_submission() {
        if (!isset($_POST['tidy_form_id'])) {
            wp_send_json_error(['message' => 'Invalid form submission']);
            return;
        }

        global $wpdb;
        $table_name = $wpdb->prefix . 'tidy_form_submissions';
        
        $form_id = sanitize_text_field($_POST['tidy_form_id']);
        $success_message = sanitize_text_field($_POST['success_message'] ?? 'Thank you for your submission.');
        
        // Handle file uploads
        $uploaded_files = [];
        if (!empty($_FILES)) {
            require_once(ABSPATH . 'wp-admin/includes/file.php');
            
            foreach ($_FILES as $field_name => $file) {
                if ($file['error'] === UPLOAD_ERR_OK) {
                    $upload_overrides = ['test_form' => false];
                    $movefile = wp_handle_upload($file, $upload_overrides);
                    
                    if ($movefile && !isset($movefile['error'])) {
                        $uploaded_files[$field_name] = [
                            'url' => $movefile['url'],
                            'path' => $movefile['file']
                        ];
                    }
                }
            }
        }

        // Prepare form data
        $form_data = [];
        foreach ($_POST as $key => $value) {
            if (!in_array($key, ['tidy_form_id', 'action', 'success_message'])) {
                $form_data[sanitize_text_field($key)] = sanitize_text_field($value);
            }
        }
        
        // Merge file data with form data
        foreach ($uploaded_files as $field_name => $file_data) {
            $form_data[$field_name] = $file_data['url'];
        }

        $result = $wpdb->insert(
            $table_name,
            [
                'form_id' => $form_id,
                'form_data' => maybe_serialize($form_data)
            ],
            ['%s', '%s']
        );

        if ($result === false) {
            // Clean up uploaded files if DB insert failed
            foreach ($uploaded_files as $file_data) {
                if (file_exists($file_data['path'])) {
                    unlink($file_data['path']);
                }
            }
            wp_send_json_error(['message' => 'Failed to save submission']);
            return;
        }

        wp_send_json_success(['message' => $success_message]);
    }

    public static function add_admin_menu() {
        add_menu_page(
            __('Form Submissions', 'tidy-forms'),
            __('Form Submissions', 'tidy-forms'),
            'manage_options',
            'tidy-form-submissions',
            [__CLASS__, 'render_submissions_page'],
            'dashicons-feedback',
            30
        );
    }

    public static function render_submissions_page() {
        global $wpdb;
        $table_name = $wpdb->prefix . 'tidy_form_submissions';
        $submissions = $wpdb->get_results("SELECT * FROM $table_name ORDER BY submitted_at DESC");
        
        ?>
        <div class="wrap">
            <h1><?php esc_html_e('Form Submissions', 'tidy-forms'); ?></h1>
            
            <?php if (empty($submissions)): ?>
                <div class="notice notice-info">
                    <p><?php esc_html_e('No form submissions yet.', 'tidy-forms'); ?></p>
                </div>
            <?php else: ?>
                <table class="wp-list-table widefat fixed striped">
                    <thead>
                        <tr>
                            <th><?php esc_html_e('ID', 'tidy-forms'); ?></th>
                            <th><?php esc_html_e('Form ID', 'tidy-forms'); ?></th>
                            <th><?php esc_html_e('Submission Data', 'tidy-forms'); ?></th>
                            <th><?php esc_html_e('Date', 'tidy-forms'); ?></th>
                            <th><?php esc_html_e('Actions', 'tidy-forms'); ?></th>
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
                            <td><?php echo (int) $submission->id; ?></td>
                            <td><?php echo esc_html($submission->form_id); ?></td>
                            <td>
                                <?php if (!empty($form_data)): ?>
                                    <ul style="margin:0; padding-left:20px;">
                                        <?php foreach ($form_data as $key => $value): ?>
                                            <li>
                                                <strong><?php echo esc_html($key); ?>:</strong>
                                                <?php if (filter_var($value, FILTER_VALIDATE_URL) && preg_match('/\.(jpg|jpeg|png|gif|pdf|doc|docx|xls|xlsx)$/i', $value)): ?>
                                                    <a href="<?php echo esc_url($value); ?>" target="_blank" class="button button-small">View File</a>
                                                <?php else: ?>
                                                    <?php echo esc_html($value); ?>
                                                <?php endif; ?>
                                            </li>
                                        <?php endforeach; ?>
                                    </ul>
                                <?php else: ?>
                                    <?php esc_html_e('No data', 'tidy-forms'); ?>
                                <?php endif; ?>
                            </td>
                            <td><?php echo esc_html(date_i18n(get_option('date_format') . ' ' . get_option('time_format'), strtotime($submission->submitted_at))); ?></td>
                            <td>
                                <form method="post" style="display:inline;">
                                    <input type="hidden" name="submission_id" value="<?php echo (int) $submission->id; ?>">
                                    <?php wp_nonce_field('tidy_delete_submission_' . $submission->id); ?>
                                    <button type="submit" name="delete_submission" class="button button-small button-danger" onclick="return confirm('Are you sure you want to delete this submission?');">
                                        Delete
                                    </button>
                                </form>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            <?php endif; ?>
        </div>
        <?php

        // Handle submission deletion
        if (isset($_POST['delete_submission']) && check_admin_referer('tidy_delete_submission_' . $_POST['submission_id'])) {
            self::delete_submission((int) $_POST['submission_id']);
            wp_redirect(admin_url('admin.php?page=tidy-form-submissions'));
            exit;
        }
    }

    public static function delete_submission($submission_id) {
        global $wpdb;
        $table_name = $wpdb->prefix . 'tidy_form_submissions';
        
        // Get submission data first to delete associated files
        $submission = $wpdb->get_row($wpdb->prepare(
            "SELECT form_data FROM $table_name WHERE id = %d",
            $submission_id
        ));
        
        if ($submission) {
            $form_data = maybe_unserialize($submission->form_data);
            $upload_dir = wp_upload_dir();
            
            // Delete any uploaded files
            foreach ($form_data as $value) {
                if (filter_var($value, FILTER_VALIDATE_URL)) {
                    $file_path = str_replace($upload_dir['baseurl'], $upload_dir['basedir'], $value);
                    if (file_exists($file_path)) {
                        unlink($file_path);
                    }
                }
            }
            
            // Delete the submission record
            $wpdb->delete($table_name, ['id' => $submission_id], ['%d']);
        }
    }
}

// Initialize the form handler
Tidy_Forms_Handler::init();