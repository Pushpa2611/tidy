import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, Button, TextControl, TextareaControl, ToggleControl } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { arrowUp, arrowDown, trash } from '@wordpress/icons';

export default function Edit({ attributes, setAttributes }) {
    const { items, accordionId, flush } = attributes;
    const [expandedPanel, setExpandedPanel] = useState(null);

    // Generate random ID on first load if not set
    useEffect(() => {
        if (!accordionId) {
            setAttributes({
                accordionId: 'accordion-' + Math.random().toString(36).substring(2, 9)
            });
        }
    }, []);

    const updateItem = (index, property, value) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [property]: value };
        setAttributes({ items: newItems });
    };

    const addItem = () => {
        setAttributes({
            items: [
                ...items,
                {
                    title: `Item ${items.length + 1}`,
                    content: 'Content for this item',
                    isOpen: false
                }
            ]
        });
        setExpandedPanel(items.length); // Expand the new item
    };

    const removeItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setAttributes({ items: newItems });
        setExpandedPanel(null);
    };

    const moveItemUp = (index) => {
        if (index === 0) return;
        const newItems = [...items];
        [newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]];
        setAttributes({ items: newItems });
    };

    const moveItemDown = (index) => {
        if (index === items.length - 1) return;
        const newItems = [...items];
        [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
        setAttributes({ items: newItems });
    };

    const togglePanel = (index) => {
        setExpandedPanel(expandedPanel === index ? null : index);
    };

    const accordionClass = flush ? 'accordion accordion-flush' : 'accordion';

    return (
        <div {...useBlockProps()}>
            <InspectorControls>
                <PanelBody title="Accordion Settings">
                    <ToggleControl
                        label="Flush Style"
                        help="Remove the default background color and rounded borders"
                        checked={flush}
                        onChange={() => setAttributes({ flush: !flush })}
                    />

                    <Button
                        variant="primary"
                        onClick={addItem}
                        style={{ margin: '16px 0', width: '100%' }}
                    >
                        Add Accordion Item
                    </Button>

                    {items.map((item, index) => (
                        <PanelBody
                            key={index}
                            title={`Item ${index + 1}: ${item.title || 'Untitled'}`}
                            initialOpen={false}
                            opened={expandedPanel === index}
                            onToggle={() => togglePanel(index)}
                        >
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '12px'
                            }}>
                                <div>
                                    <Button
                                        icon={arrowUp}
                                        onClick={() => moveItemUp(index)}
                                        disabled={index === 0}
                                        label="Move up"
                                        showTooltip
                                    />
                                    <Button
                                        icon={arrowDown}
                                        onClick={() => moveItemDown(index)}
                                        disabled={index === items.length - 1}
                                        label="Move down"
                                        showTooltip
                                        style={{ marginLeft: '4px' }}
                                    />
                                </div>
                                <Button
                                    icon={trash}
                                    onClick={() => removeItem(index)}
                                    label="Remove item"
                                    showTooltip
                                    isDestructive
                                />
                            </div>

                            <TextControl
                                label="Item Title"
                                value={item.title}
                                onChange={(value) => updateItem(index, 'title', value)}
                            />
                            <TextareaControl
                                label="Item Content"
                                value={item.content}
                                onChange={(value) => updateItem(index, 'content', value)}
                            />
                            <ToggleControl
                                label="Open by default"
                                checked={item.isOpen}
                                onChange={(value) => updateItem(index, 'isOpen', value)}
                            />
                        </PanelBody>
                    ))}
                </PanelBody>
            </InspectorControls>

            <div className={accordionClass} id={accordionId}>
                {items.map((item, index) => (
                    <div key={index} className="accordion-item">
                        <h2 className="accordion-header">
                            <button
                                className={`accordion-button ${item.isOpen ? '' : 'collapsed'}`}
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target={`#collapse-${accordionId}-${index}`}
                            >
                                {item.title || 'Accordion Item'}
                            </button>
                        </h2>
                        <div
                            id={`collapse-${accordionId}-${index}`}
                            className={`accordion-collapse collapse ${item.isOpen ? 'show' : ''}`}
                            data-bs-parent={`#${accordionId}`}
                        >
                            <div className="accordion-body">
                                {item.content || 'Accordion content...'}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}