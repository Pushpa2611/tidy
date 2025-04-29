import { useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }) {
    const { formId, formMethod, formAction, formLayout, formFields, submitText } = attributes;
    const blockProps = useBlockProps.save();

    const renderField = (field) => {
        const commonProps = {
            name: field.name,
            id: field.id,
            required: field.required,
            placeholder: field.placeholder || '',
            className: `form-control ${formLayout === 'floating' ? 'placeholder-transparent' : ''}`
        };

        switch (field.type) {
            case 'textarea':
                return <textarea {...commonProps} rows="3"></textarea>;
            case 'select':
                return (
                    <select {...commonProps}>
                        {field.options?.map((opt, i) => (
                            <option key={i} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                );
            case 'checkbox':
                return (
                    <div className="form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id={`${field.id}_1`}
                            name={field.name}
                        />
                        <label className="form-check-label" htmlFor={`${field.id}_1`}>
                            {field.options?.[0]?.label || 'Option 1'}
                        </label>
                    </div>
                );
            case 'radio':
                return (
                    <div>
                        {field.options?.map((opt, i) => (
                            <div key={i} className="form-check">
                                <input
                                    type="radio"
                                    className="form-check-input"
                                    id={`${field.id}_${i}`}
                                    name={field.name}
                                    value={opt.value}
                                />
                                <label className="form-check-label" htmlFor={`${field.id}_${i}`}>
                                    {opt.label}
                                </label>
                            </div>
                        ))}
                    </div>
                );
            case 'range':
                return <input type="range" className="form-range" id={field.id} name={field.name} />;
            case 'file':
                return <input type="file" className="form-control" id={field.id} name={field.name} />;
            default:
                return <input type={field.type} {...commonProps} />;
        }
    };

    return (
        <div {...blockProps}>
            <form
                id={formId}
                method={formMethod}
                action={formAction || '#'}
                className={`needs-validation ${formLayout === 'horizontal' ? 'row g-3' : ''}`}
                noValidate
            >
                {formFields.map((field) => (
                    <div key={field.id} className={`mb-3 ${formLayout === 'horizontal' ? 'col-md-6' : ''}`}>
                        {formLayout === 'floating' ? (
                            <div className="form-floating">
                                {renderField(field)}
                                <label htmlFor={field.id}>
                                    {field.label}{field.required && <span className="text-danger">*</span>}
                                </label>
                            </div>
                        ) : (
                            <>
                                <label htmlFor={field.id} className={`form-label ${formLayout === 'horizontal' ? 'col-form-label' : ''}`}>
                                    {field.label}{field.required && <span className="text-danger">*</span>}
                                </label>
                                {renderField(field)}
                            </>
                        )}
                        {field.helpText && (
                            <div className="form-text">{field.helpText}</div>
                        )}
                    </div>
                ))}

                <div className="mb-3">
                    <button type="submit" className="btn btn-primary">
                        {submitText}
                    </button>
                </div>
            </form>
        </div>
    );
}