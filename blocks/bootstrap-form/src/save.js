import { useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }) {
    const { formId, formClass, formMethod, fields, submitText, successMessage } = attributes;
    const blockProps = useBlockProps.save();

    const renderField = (field) => {
        const baseClasses = field.type === 'checkbox' || field.type === 'radio'
            ? 'form-check-input'
            : field.type === 'range'
                ? 'form-range'
                : 'form-control';

        const fieldClasses = `${baseClasses} ${field.class || ''}`.trim();

        switch (field.type) {
            case 'textarea':
                return <textarea className={fieldClasses} id={field.id} name={field.name} placeholder={field.placeholder || ''} required={field.required} />;
            case 'select':
                const options = field.options ? field.options.split('\n').map(option => {
                    const [value, label] = option.includes(':') ? option.split(':') : [option.trim(), option.trim()];
                    return { value: value.trim(), label: label.trim() };
                }) : [];

                return (
                    <select className={fieldClasses} id={field.id} name={field.name} required={field.required}>
                        <option value="">{field.placeholder || 'Select an option'}</option>
                        {options.map((opt, i) => (
                            <option key={i} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                );
            case 'checkbox':
            case 'radio':
                return (
                    <div className="form-check">
                        <label className="form-check-label">
                            <input type={field.type} className={fieldClasses} id={field.id} name={field.name} required={field.required} />
                            {field.label}
                        </label>
                    </div>
                );
            case 'range':
                return <input type="range" className={fieldClasses} id={field.id} name={field.name} required={field.required} />;
            case 'file':
                return <input type="file" className={fieldClasses} id={field.id} name={field.name} required={field.required} />;
            default:
                return <input type={field.type} className={fieldClasses} id={field.id} name={field.name} placeholder={field.placeholder || ''} required={field.required} />;
        }
    };

    return (
        <div {...blockProps}>
            <form
                className={`tidy-form ${formClass || ''}`.trim()}
                id={formId}
                method={formMethod}
                encType="multipart/form-data"
                data-success-message={successMessage}
            >
                <input type="hidden" name="tidy_form_id" value={formId} />
                <input type="hidden" name="success_message" value={successMessage} />

                {fields.map((field, index) => (
                    <div key={index} className="mb-3">
                        {(field.type !== 'checkbox' && field.type !== 'radio') && (
                            <label htmlFor={field.id} className="form-label">
                                {field.label}
                                {field.required && <span className="text-danger">*</span>}
                            </label>
                        )}
                        {renderField(field)}
                    </div>
                ))}

                <div className="form-message" style={{ display: 'none' }}></div>

                <button type="submit" className="btn btn-primary">
                    {submitText}
                </button>
            </form>
        </div>
    );
}