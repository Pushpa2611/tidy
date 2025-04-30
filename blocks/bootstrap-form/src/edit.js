import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, Button, TextControl, SelectControl, ToggleControl, TextareaControl } from '@wordpress/components';
import { useState } from '@wordpress/element';

const FIELD_TYPES = [
    { label: 'Text', value: 'text' },
    { label: 'Email', value: 'email' },
    { label: 'Password', value: 'password' },
    { label: 'Textarea', value: 'textarea' },
    { label: 'Select', value: 'select' },
    { label: 'Checkbox', value: 'checkbox' },
    { label: 'Radio', value: 'radio' },
    { label: 'Range', value: 'range' },
    { label: 'File Upload', value: 'file' }
];

export default function Edit({ attributes, setAttributes }) {
    const { formId, formClass, formMethod, fields, submitText } = attributes;
    const [activeFieldIndex, setActiveFieldIndex] = useState(null);

    const updateField = (index, property, value) => {
        const newFields = [...fields];
        newFields[index] = { ...newFields[index], [property]: value };
        setAttributes({ fields: newFields });
    };

    const addField = () => {
        const fieldNumber = fields.length + 1;
        const newField = {
            type: 'text',
            label: `Field ${fieldNumber}`,
            name: `field_${fieldNumber}`,
            id: `field-${fieldNumber}`,
            class: 'form-control',
            placeholder: '',
            required: false,
            options: ''
        };

        setAttributes({
            fields: [...fields, newField]
        });
        setActiveFieldIndex(fields.length);
    };

    const removeField = (index) => {
        const newFields = fields.filter((_, i) => i !== index);
        setAttributes({ fields: newFields });
        if (activeFieldIndex >= index) {
            setActiveFieldIndex(Math.max(0, activeFieldIndex - 1));
        }
    };

    const moveField = (fromIndex, toIndex) => {
        if (toIndex < 0 || toIndex >= fields.length) return;

        const newFields = [...fields];
        const [movedField] = newFields.splice(fromIndex, 1);
        newFields.splice(toIndex, 0, movedField);

        setAttributes({ fields: newFields });
        setActiveFieldIndex(toIndex);
    };

    const renderFieldPreview = (field, index) => {
        const baseClasses = field.type === 'checkbox' || field.type === 'radio'
            ? 'form-check-input'
            : field.type === 'file'
                ? 'form-control'
                : 'form-control';

        const fieldClasses = `${baseClasses} ${field.class || ''}`.trim();

        switch (field.type) {
            case 'textarea':
                return (
                    <textarea
                        className={fieldClasses}
                        id={field.id}
                        name={field.name}
                        placeholder={field.placeholder}
                        required={field.required}
                        disabled
                    />
                );
            case 'select':
                return (
                    <select
                        className={fieldClasses}
                        id={field.id}
                        name={field.name}
                        required={field.required}
                        disabled
                    >
                        {(field.options || '').split('\n').map((opt, idx) => {
                            const [val, label] = opt.includes(':') ? opt.split(':') : [opt, opt];
                            return <option key={idx} value={val}>{label}</option>;
                        })}
                    </select>
                );
            case 'radio':
            case 'checkbox':
                return (
                    <div>
                        {(field.options || field.label).split('\n').map((opt, idx) => {
                            const [val, label] = opt.includes(':') ? opt.split(':') : [opt, opt];
                            const fieldId = `${field.id}_${idx}`;
                            return (
                                <div className="form-check" key={idx}>
                                    <input
                                        type={field.type}
                                        className={fieldClasses}
                                        id={fieldId}
                                        name={field.name}
                                        value={val}
                                        disabled
                                    />
                                    <label className="form-check-label" htmlFor={fieldId}>
                                        {label}
                                    </label>
                                </div>
                            );
                        })}
                    </div>
                );
            case 'range':
                return (
                    <input
                        type="range"
                        className={`form-range ${field.class || ''}`.trim()}
                        id={field.id}
                        name={field.name}
                        required={field.required}
                        disabled
                    />
                );
            case 'file':
                return (
                    <input
                        type="file"
                        className={fieldClasses}
                        id={field.id}
                        name={field.name}
                        required={field.required}
                        disabled
                    />
                );
            default:
                return (
                    <input
                        type={field.type}
                        className={fieldClasses}
                        id={field.id}
                        name={field.name}
                        placeholder={field.placeholder}
                        required={field.required}
                        disabled
                    />
                );
        }
    };

    return (
        <div {...useBlockProps()}>
            <InspectorControls>
                <PanelBody title="Form Settings">
                    <TextControl
                        label="Form ID"
                        value={formId}
                        onChange={(value) => setAttributes({ formId: value })}
                    />
                    <TextControl
                        label="Form Classes"
                        value={formClass}
                        onChange={(value) => setAttributes({ formClass: value })}
                        placeholder="space-separated classes"
                    />
                    <SelectControl
                        label="Form Method"
                        value={formMethod}
                        options={[
                            { label: 'POST', value: 'post' }
                        ]}
                        onChange={(value) => setAttributes({ formMethod: value })}
                    />
                    <TextControl
                        label="Submit Button Text"
                        value={submitText}
                        onChange={(value) => setAttributes({ submitText: value })}
                    />
                </PanelBody>

                <PanelBody title="Form Fields">
                    <Button
                        variant="primary"
                        onClick={addField}
                        style={{ marginBottom: '16px' }}
                    >
                        Add New Field
                    </Button>

                    {fields.map((field, index) => (
                        <PanelBody
                            key={index}
                            title={field.label || `Field ${index + 1}`}
                            initialOpen={activeFieldIndex === index}
                            onToggle={() => setActiveFieldIndex(activeFieldIndex === index ? null : index)}
                        >
                            <SelectControl
                                label="Field Type"
                                value={field.type}
                                options={FIELD_TYPES}
                                onChange={(value) => updateField(index, 'type', value)}
                            />
                            <TextControl
                                label="Field Label"
                                value={field.label}
                                onChange={(value) => updateField(index, 'label', value)}
                            />
                            <TextControl
                                label="Field Name"
                                value={field.name}
                                onChange={(value) => updateField(index, 'name', value)}
                            />
                            <TextControl
                                label="Field ID"
                                value={field.id}
                                onChange={(value) => updateField(index, 'id', value)}
                            />
                            <TextControl
                                label="Field Classes"
                                value={field.class}
                                onChange={(value) => updateField(index, 'class', value)}
                                placeholder="form-control additional-class"
                            />
                            {field.type !== 'checkbox' && field.type !== 'radio' && field.type !== 'file' && (
                                <TextControl
                                    label="Placeholder"
                                    value={field.placeholder}
                                    onChange={(value) => updateField(index, 'placeholder', value)}
                                />
                            )}
                            {field.type === 'select' && (
                                <TextareaControl
                                    label="Options (one per line)"
                                    value={field.options}
                                    onChange={(value) => updateField(index, 'options', value)}
                                    help="Format: value:Label"
                                />
                            )}
                            <ToggleControl
                                label="Required Field"
                                checked={field.required}
                                onChange={(value) => updateField(index, 'required', value)}
                            />

                            {/* Field Controls */}
                            <div style={{
                                display: 'flex',
                                gap: '8px',
                                marginTop: '16px',
                                justifyContent: 'space-between'
                            }}>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <Button
                                        isSmall
                                        variant="secondary"
                                        disabled={index === 0}
                                        onClick={() => moveField(index, index - 1)}
                                        icon="arrow-up-alt2"
                                        label="Move Up"
                                    />
                                    <Button
                                        isSmall
                                        variant="secondary"
                                        disabled={index === fields.length - 1}
                                        onClick={() => moveField(index, index + 1)}
                                        icon="arrow-down-alt2"
                                        label="Move Down"
                                    />
                                </div>
                                <Button
                                    isSmall
                                    isDestructive
                                    variant="secondary"
                                    onClick={() => removeField(index)}
                                    icon="trash"
                                    label="Remove"
                                />
                            </div>
                        </PanelBody>
                    ))}
                </PanelBody>
            </InspectorControls>

            <form className={`${formClass}`.trim()} id={formId} encType="multipart/form-data">
                {fields.map((field, index) => (
                    <div key={index} className="mb-3">
                        {(field.type !== 'checkbox' && field.type !== 'radio') && (
                            <label htmlFor={field.id} className="form-label">
                                {field.label}
                                {field.required && <span className="text-danger">*</span>}
                            </label>
                        )}
                        {renderFieldPreview(field, index)}
                    </div>
                ))}
                <button type="submit" className="btn btn-primary">
                    {submitText}
                </button>
            </form>
        </div>
    );
}