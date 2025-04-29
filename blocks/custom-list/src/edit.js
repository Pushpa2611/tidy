import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, Button, TextControl } from '@wordpress/components';
import { useState } from '@wordpress/element';

export default function Edit({ attributes, setAttributes }) {
    const { listItems } = attributes;
    const [expandedItems, setExpandedItems] = useState({});

    const handleEditItem = (index, property, value) => {
        const newListItems = [...listItems];
        newListItems[index] = {
            ...newListItems[index],
            [property]: value
        };
        setAttributes({ listItems: newListItems });
    };

    const handleRemoveItem = (index) => {
        const newListItems = listItems.filter((_, i) => i !== index);
        setAttributes({ listItems: newListItems });
    };

    const handleAddItem = () => {
        const newListItems = [
            ...listItems,
            { content: `New item ${listItems.length + 1}`, className: '' }
        ];
        setAttributes({ listItems: newListItems });
        // Expand the newly added item by default
        setExpandedItems({ ...expandedItems, [listItems.length]: true });
    };

    const toggleItemExpansion = (index) => {
        setExpandedItems({
            ...expandedItems,
            [index]: !expandedItems[index]
        });
    };

    return (
        <div {...useBlockProps()}>
            <InspectorControls>
                <PanelBody title="List Settings">
                    {listItems.map((item, index) => (
                        <PanelBody
                            key={index}
                            title={`Item ${index + 1}`}
                            initialOpen={false}
                            opened={expandedItems[index]}
                            onToggle={() => toggleItemExpansion(index)}
                        >
                            <TextControl
                                label="Content"
                                value={item.content}
                                onChange={(value) => handleEditItem(index, 'content', value)}
                            />
                            <TextControl
                                label="Custom Class"
                                value={item.className}
                                onChange={(value) => handleEditItem(index, 'className', value)}
                                placeholder="e.g., text-primary bg-light"
                            />
                            <Button
                                isDestructive
                                onClick={() => handleRemoveItem(index)}
                                style={{ marginTop: '8px' }}
                            >
                                Remove Item
                            </Button>
                        </PanelBody>
                    ))}
                    <Button
                        onClick={handleAddItem}
                        variant="primary"
                        style={{ marginTop: '16px' }}
                    >
                        Add New Item
                    </Button>
                </PanelBody>
            </InspectorControls>

            <ul className="list-group">
                {listItems.map((item, index) => (
                    <li key={index} className={`list-group-item ${item.className || ''}`}>
                        {item.content}
                    </li>
                ))}
            </ul>
        </div>
    );
}