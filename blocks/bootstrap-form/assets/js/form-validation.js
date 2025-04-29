document.addEventListener('DOMContentLoaded', function () {
    // Select all forms with needs-validation class
    const forms = document.querySelectorAll('.needs-validation');

    // Loop through each form
    forms.forEach(form => {
        form.addEventListener('submit', function (event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }

            // Add custom validation
            const fields = form.querySelectorAll('[data-validation-pattern]');
            fields.forEach(field => {
                const pattern = field.getAttribute('data-validation-pattern');
                if (pattern) {
                    const regex = new RegExp(pattern);
                    if (!regex.test(field.value)) {
                        field.setCustomValidity(field.getAttribute('data-validation-message') || 'Invalid format');
                        field.classList.add('is-invalid');
                    } else {
                        field.setCustomValidity('');
                        field.classList.remove('is-invalid');
                    }
                }
            });

            form.classList.add('was-validated');
        }, false);

        // Add live validation on input
        form.querySelectorAll('input, select, textarea').forEach(input => {
            input.addEventListener('input', function () {
                if (form.classList.contains('was-validated')) {
                    const pattern = input.getAttribute('data-validation-pattern');
                    if (pattern) {
                        const regex = new RegExp(pattern);
                        if (!regex.test(input.value)) {
                            input.classList.add('is-invalid');
                        } else {
                            input.classList.remove('is-invalid');
                        }
                    } else if (input.checkValidity()) {
                        input.classList.remove('is-invalid');
                    }
                }
            });
        });
    });
});