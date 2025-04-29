import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, SelectControl, ToggleControl, Button } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { v4 as uuidv4 } from 'uuid';

const FIELD_TYPES = [
    { label: 'Text', value: 'text' },
    { label: 'Email', value: 'email' },
    { label: 'Password', value: 'password' },
    { label: 'Textarea', value: 'textarea' },
    { label: 'Select', value: 'select' },
    { label: 'Checkbox', value: 'checkbox' },
    { label: 'Radio', value: 'radio' },
    { label: 'Range', value: 'range' },
    { label: 'File', value: 'file' }
];

const LAYOUT_OPTIONS = [
    { label: 'Vertical', value: 'vertical' },
    { label: 'Horizontal', value: 'horizontal' },
    { label: 'Floating Labels', value: 'floating' }
];

export default function Edit({ attributes, setAttributes }) {
    const { formId, formMethod, formAction, formLayout, formFields, submitText } = attributes;
    const [selectedField, setSelectedField] = useState(null);
    const [expandedPanel, setExpandedPanel] = useState('form-settings');

    // Generate form ID if not set
    if (!formId) {
        setAttributes({ formId: 'form-' + uuidv4().substring(0, 8) });
    }

    const addField = () => {
        const newField = {
            id: uuidv4(),
            type: 'text',
            label: 'New Field',
            name: 'field_' + (formFields.length + 1),
            required: false,
            placeholder: '',
            helpText: '',
            options: []
        };
        setAttributes({ formFields: [...formFields, newField] });
        setSelectedField(formFields.length);
    };

    const updateField = (index, property, value) => {
        const newFields = [...formFields];
        newFields[index] = { ...newFields[index], [property]: value };
        setAttributes({ formFields: newFields });
    };

    const removeField = (index) => {
        const newFields = formFields.filter((_, i) => i !== index);
        setAttributes({ formFields: newFields });
        if (selectedField >= index) {
            setSelectedField(Math.max(0, selectedField - 1));
        }
    };

    const moveField = (index, direction) => {
        if ((direction === 'up' && index === 0) || (direction === 'down' && index === formFields.length - 1)) {
            return;
        }
        const newFields = [...formFields];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        [newFields[index], newFields[newIndex]] = [newFields[newIndex], newFields[index]];
        setAttributes({ formFields: newFields });
        setSelectedField(newIndex);
    };

    const renderFieldInput = (field, index) => {
        const commonProps = {
            className: `form-control ${formLayout === 'floating' ? 'placeholder-transparent' : ''}`,
            placeholder: field.placeholder || '',
            required: field.required,
            disabled: true // Disable actual interaction in editor
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
            case 'radio':
                return (
                    <div className="form-check">
                        <input
                            type={field.type}
                            className="form-check-input"
                            disabled={true}
                        />
                        <label className="form-check-label">Option 1</label>
                    </div>
                );
            case 'range':
                return <input type="range" className="form-range" disabled={true} />;
            default:
                return <input type={field.type} {...commonProps} />;
        }
    };

    return (
        <div {...useBlockProps()}>
            <InspectorControls>
                <PanelBody title="Form Settings" initialOpen={expandedPanel === 'form-settings'} onToggle={() => setExpandedPanel(expandedPanel === 'form-settings' ? null : 'form-settings')}>
                    <TextControl
                        label="Form ID"
                        value={formId}
                        onChange={(value) => setAttributes({ formId: value })}
                    />
                    <SelectControl
                        label="Form Method"
                        value={formMethod}
                        options={[
                            { label: 'POST', value: 'post' },
                            { label: 'GET', value: 'get' }
                        ]}
                        onChange={(value) => setAttributes({ formMethod: value })}
                    />
                    <TextControl
                        label="Form Action (URL)"
                        value={formAction}
                        onChange={(value) => setAttributes({ formAction: value })}
                        placeholder="Leave empty for current page"
                    />
                    <SelectControl
                        label="Form Layout"
                        value={formLayout}
                        options={LAYOUT_OPTIONS}
                        onChange={(value) => setAttributes({ formLayout: value })}
                    />
                    <TextControl
                        label="Submit Button Text"
                        value={submitText}
                        onChange={(value) => setAttributes({ submitText: value })}
                    />
                </PanelBody>

                <PanelBody title="Form Fields" initialOpen={expandedPanel === 'form-fields'} onToggle={() => setExpandedPanel(expandedPanel === 'form-fields' ? null : 'form-fields')}>
                    <Button
                        variant="primary"
                        onClick={addField}
                        style={{ marginBottom: '16px' }}
                    >
                        Add New Field
                    </Button>

                    {formFields.map((field, index) => (
                        <PanelBody
                            key={field.id}
                            title={field.label || `Field ${index + 1}`}
                            initialOpen={selectedField === index}
                            onToggle={() => setSelectedField(selectedField === index ? null : index)}
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
                                label="Placeholder"
                                value={field.placeholder}
                                onChange={(value) => updateField(index, 'placeholder', value)}
                            />
                            <TextControl
                                label="Help Text"
                                value={field.helpText}
                                onChange={(value) => updateField(index, 'helpText', value)}
                            />
                            <ToggleControl
                                label="Required Field"
                                checked={field.required}
                                onChange={(value) => updateField(index, 'required', value)}
                            />

                            {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
                                <div style={{ marginTop: '16px' }}>
                                    <Button
                                        variant="secondary"
                                        onClick={() => {
                                            const newOptions = [...(field.options || []), { label: `Option ${(field.options?.length || 0) + 1}`, value: `option_${(field.options?.length || 0) + 1}` }];
                                            updateField(index, 'options', newOptions);
                                        }}
                                    >
                                        Add Option
                                    </Button>
                                    {field.options?.map((opt, optIndex) => (
                                        <div key={optIndex} style={{ display: 'flex', marginTop: '8px' }}>
                                            <TextControl
                                                value={opt.label}
                                                onChange={(value) => {
                                                    const newOptions = [...field.options];
                                                    newOptions[optIndex].label = value;
                                                    updateField(index, 'options', newOptions);
                                                }}
                                            />
                                            <Button
                                                isDestructive
                                                onClick={() => {
                                                    const newOptions = field.options.filter((_, i) => i !== optIndex);
                                                    updateField(index, 'options', newOptions);
                                                }}
                                                style={{ marginLeft: '8px' }}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div style={{ display: 'flex', marginTop: '16px' }}>
                                <Button
                                    variant="secondary"
                                    onClick={() => moveField(index, 'up')}
                                    disabled={index === 0}
                                >
                                    Move Up
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={() => moveField(index, 'down')}
                                    disabled={index === formFields.length - 1}
                                    style={{ marginLeft: '8px' }}
                                >
                                    Move Down
                                </Button>
                                <Button
                                    isDestructive
                                    onClick={() => removeField(index)}
                                    style={{ marginLeft: '8px' }}
                                >
                                    Remove
                                </Button>
                            </div>
                        </PanelBody>
                    ))}
                </PanelBody>
            </InspectorControls>

            <form className={`needs-validation ${formLayout === 'horizontal' ? 'row g-3' : ''}`} noValidate>
                {formFields.map((field, index) => (
                    <div key={field.id} className={`mb-3 ${formLayout === 'horizontal' ? 'col-md-6' : ''}`}>
                        {formLayout === 'floating' ? (
                            <div className="form-floating">
                                {renderFieldInput(field, index)}
                                <label>{field.label}{field.required && '*'}</label>
                            </div>
                        ) : (
                            <>
                                <label className={`form-label ${formLayout === 'horizontal' ? 'col-form-label' : ''}`}>
                                    {field.label}{field.required && '*'}
                                </label>
                                {renderFieldInput(field, index)}
                            </>
                        )}
                        {field.helpText && (
                            <div className="form-text">{field.helpText}</div>
                        )}
                    </div>
                ))}

                <button type="submit" className="btn btn-primary">
                    {submitText}
                </button>
            </form>
        </div>
    );
}