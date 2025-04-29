import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function Save({ attributes }) {
    const { tabs, tabId, variant } = attributes;
    const blockProps = useBlockProps.save();

    const innerBlocksProps = useInnerBlocksProps.save({
        className: 'tab-content'
    });

    return (
        <div {...blockProps}>
            <ul className={`nav nav-${variant}`} id={tabId} role="tablist">
                {tabs.map((tab, index) => (
                    <li key={index} className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${tab.active ? 'active' : ''}`}
                            data-bs-toggle="tab"
                            data-bs-target={`#${tab.slug}`}
                            type="button"
                            role="tab"
                        >
                            {tab.title}
                        </button>
                    </li>
                ))}
            </ul>
            <div {...innerBlocksProps}>
                {/* InnerBlocks content will be automatically rendered here */}
            </div>
        </div>
    );
}