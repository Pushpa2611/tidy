jQuery(document).ready(function ($) {
    $(document).on('submit', '.tidy-form', function (e) {
        e.preventDefault();
        const $form = $(this);
        const $message = $form.find('.form-message');
        const formData = new FormData($form[0]);

        $message.hide().removeClass('alert-danger alert-success');

        // Add the action parameter
        formData.append('action', 'tidy_forms_submit');

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
                }
            },
            error: function () {
                $message.addClass('alert alert-danger')
                    .text('An error occurred. Please try again.')
                    .fadeIn();
            }
        });
    });
});