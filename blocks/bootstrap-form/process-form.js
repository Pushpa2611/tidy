jQuery(document).ready(function ($) {
    $(document).on('submit', '.tidy-form', function (e) {
        e.preventDefault();
        const $form = $(this);
        const $message = $form.find('.form-message');
        const formData = new FormData($form[0]);

        $message.hide().removeClass('alert-danger alert-success');

        // Add the action parameter
        formData.append('action', 'tidy_forms_submit');

        // Show loading state
        $form.find('button[type="submit"]').prop('disabled', true).html('<span class="spinner is-active"></span> Processing...');

        $.ajax({
            type: $form.attr('method'),
            url: tidyForms.ajaxurl,
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                if (response.success) {
                    $form.trigger('reset');
                    $message.addClass('alert alert-success')
                        .text(response.data.message)
                        .fadeIn();
                } else {
                    $message.addClass('alert alert-danger')
                        .text(response.data.message || 'Submission failed')
                        .fadeIn();
                }
            },
            error: function (xhr) {
                let errorMessage = 'An error occurred. Please try again.';
                if (xhr.responseJSON && xhr.responseJSON.data && xhr.responseJSON.data.message) {
                    errorMessage = xhr.responseJSON.data.message;
                }
                $message.addClass('alert alert-danger')
                    .text(errorMessage)
                    .fadeIn();
            },
            complete: function () {
                $form.find('button[type="submit"]').prop('disabled', false).text($form.data('submit-text') || 'Submit');
            }
        });
    });
});