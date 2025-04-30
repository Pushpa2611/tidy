import { useBlockProps, InspectorControls, InnerBlocks } from '@wordpress/block-editor';
import { PanelBody, Button, TextControl, SelectControl } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';

const VARIANTS = [
    { label: 'Tabs', value: 'tabs' },
    { label: 'Pills', value: 'pills' },
    { label: 'Underline', value: 'underline' }
];

const ALLOWED_BLOCKS = ['core/paragraph', 'core/heading', 'core/image', 'core/list'];

export default function Edit({ attributes, setAttributes, clientId }) {
    const { tabs, tabId, variant } = attributes;
    const [activeTab, setActiveTab] = useState(0);
    const [expandedPanel, setExpandedPanel] = useState(null);

    // Generate random ID on first load if not set
    useEffect(() => {
        if (!tabId) {
            const newTabId = 'tab-' + Math.random().toString(36).substring(2, 9);
            setAttributes({ tabId: newTabId });
        }
    }, []);

    const updateTab = (index, property, value) => {
        const newTabs = [...tabs];
        newTabs[index] = { ...newTabs[index], [property]: value };
        setAttributes({ tabs: newTabs });
    };

    const addTab = () => {
        const newTabNumber = tabs.length + 1;
        const newSlug = `tab-${newTabNumber}`;

        setAttributes({
            tabs: [
                ...tabs,
                {
                    title: `Tab ${newTabNumber}`,
                    slug: newSlug,
                    active: false
                }
            ]
        });
        setActiveTab(tabs.length);
    };

    const removeTab = (index) => {
        const newTabs = tabs.filter((_, i) => i !== index);
        setAttributes({ tabs: newTabs });
        if (activeTab >= index) {
            setActiveTab(Math.max(0, activeTab - 1));
        }
    };

    const togglePanel = (index) => {
        setExpandedPanel(expandedPanel === index ? null : index);
    };

    const template = [
        ['core/paragraph', { placeholder: 'Add tab content here...' }]
    ];

    return (
        <div {...useBlockProps()}>
            <InspectorControls>
                <PanelBody title="Tab Settings">
                    <SelectControl
                        label="Tab Style"
                        value={variant}
                        options={VARIANTS}
                        onChange={(value) => setAttributes({ variant: value })}
                    />

                    <Button
                        variant="primary"
                        onClick={addTab}
                        style={{ margin: '16px 0' }}
                    >
                        Add New Tab
                    </Button>

                    {tabs.map((tab, index) => (
                        <PanelBody
                            key={index}
                            title={`Tab ${index + 1}`}
                            initialOpen={false}
                            opened={expandedPanel === index}
                            onToggle={() => togglePanel(index)}
                        >
                            <TextControl
                                label="Tab Title"
                                value={tab.title}
                                onChange={(value) => updateTab(index, 'title', value)}
                            />
                            <TextControl
                                label="Tab Slug"
                                value={tab.slug}
                                onChange={(value) => updateTab(index, 'slug', value)}
                            />
                            <Button
                                isDestructive
                                onClick={() => removeTab(index)}
                                style={{ marginTop: '8px' }}
                            >
                                Remove Tab
                            </Button>
                        </PanelBody>
                    ))}
                </PanelBody>
            </InspectorControls>

            <div className="tabs-preview">
                <ul className={`nav nav-${variant}`} id={tabId} role="tablist">
                    {tabs.map((tab, index) => (
                        <li key={index} className="nav-item" role="presentation">
                            <button
                                className={`nav-link ${activeTab === index ? 'active' : ''}`}
                                onClick={() => setActiveTab(index)}
                                type="button"
                                role="tab"
                            >
                                {tab.title || `Tab ${index + 1}`}
                            </button>
                        </li>
                    ))}
                </ul>
                <div className="tab-content p-3 border border-top-0">
                    {tabs.map((tab, index) => (
                        <div
                            key={index}
                            className={`tab-pane ${activeTab === index ? 'active' : ''}`}
                            role="tabpanel"
                            style={{ display: activeTab === index ? 'block' : 'none' }}
                        >
                            <InnerBlocks
                                template={template}
                                templateLock={false}
                                allowedBlocks={ALLOWED_BLOCKS}
                                renderAppender={activeTab === index ? InnerBlocks.ButtonBlockAppender : false}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}