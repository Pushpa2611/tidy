import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, Button, TextControl, SelectControl, RangeControl } from '@wordpress/components';
import { Dashicon } from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
    const { features, columns } = attributes;

    const updateFeature = (index, property, value) => {
        const newFeatures = [...features];
        newFeatures[index] = {
            ...newFeatures[index],
            [property]: value
        };
        setAttributes({ features: newFeatures });
    };

    const addFeature = () => {
        setAttributes({
            features: [
                ...features,
                {
                    icon: 'star-filled',
                    title: 'New Feature',
                    content: 'Feature description',
                    className: '',
                    customIcon: ''
                }
            ]
        });
    };

    const removeFeature = (index) => {
        const newFeatures = features.filter((_, i) => i !== index);
        setAttributes({ features: newFeatures });
    };

    const iconOptions = [
        { value: 'star-filled', label: 'Star' },
        { value: 'admin-site', label: 'Site' },
        { value: 'shield', label: 'Shield' },
        { value: 'awards', label: 'Award' },
        { value: 'performance', label: 'Performance' },
        { value: 'lock', label: 'Lock' },
        { value: 'money', label: 'Money' },
        { value: 'megaphone', label: 'Megaphone' },
        { value: 'custom', label: 'Custom Icon (Font Awesome)' }
    ];

    return (
        <div {...useBlockProps()}>
            <InspectorControls>
                <PanelBody title="Layout Settings">
                    <RangeControl
                        label="Columns"
                        value={columns}
                        onChange={(value) => setAttributes({ columns: value })}
                        min={1}
                        max={4}
                    />
                </PanelBody>

                <PanelBody title="Features">
                    {features.map((feature, index) => (
                        <div key={index} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ddd' }}>
                            <SelectControl
                                label="Icon"
                                value={feature.icon}
                                options={iconOptions}
                                onChange={(value) => updateFeature(index, 'icon', value)}
                            />
                            {feature.icon === 'custom' && (
                                <TextControl
                                    label="Custom Icon Class (e.g., fas fa-rocket)"
                                    value={feature.customIcon || ''}
                                    onChange={(value) => updateFeature(index, 'customIcon', value)}
                                />
                            )}
                            <TextControl
                                label="Title"
                                value={feature.title}
                                onChange={(value) => updateFeature(index, 'title', value)}
                            />
                            <TextControl
                                label="Content"
                                value={feature.content}
                                onChange={(value) => updateFeature(index, 'content', value)}
                                multiline
                            />
                            <TextControl
                                label="Custom Class"
                                value={feature.className}
                                onChange={(value) => updateFeature(index, 'className', value)}
                            />
                            <Button
                                isDestructive
                                onClick={() => removeFeature(index)}
                                style={{ marginTop: '10px' }}
                            >
                                Remove Feature
                            </Button>
                        </div>
                    ))}
                    <Button onClick={addFeature} variant="primary" style={{ marginTop: '20px' }}>
                        Add Feature
                    </Button>
                </PanelBody>
            </InspectorControls>

            <div className={`feature-list columns-${columns}`}>
                {features.map((feature, index) => (
                    <div key={index} className={`feature-item ${feature.className || ''}`}>
                        <div className="feature-icon">
                            {feature.icon === 'custom' ? (
                                <i className={feature.customIcon || 'fas fa-star'}></i>
                            ) : (
                                <Dashicon icon={feature.icon} size={40} />
                            )}
                        </div>
                        <div className="feature-content">
                            <h3 className="feature-title">{feature.title}</h3>
                            <p className="feature-text">{feature.content}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
