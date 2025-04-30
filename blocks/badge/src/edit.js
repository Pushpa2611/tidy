import { useBlockProps } from '@wordpress/block-editor';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, SelectControl, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const styleOptions = [
    { value: 'primary', label: __('Primary', 'tidy') },
    { value: 'secondary', label: __('Secondary', 'tidy') },
    { value: 'success', label: __('Success', 'tidy') },
    { value: 'danger', label: __('Danger', 'tidy') },
    { value: 'warning', label: __('Warning', 'tidy') },
    { value: 'info', label: __('Info', 'tidy') },
    { value: 'light', label: __('Light', 'tidy') },
    { value: 'dark', label: __('Dark', 'tidy') },
];

export default function Edit({ attributes, setAttributes }) {
    const { content, style, pill, link } = attributes;
    const blockProps = useBlockProps({
        className: 'tidy-badge-container' // Added container class for better preview display
    });

    return (
        <div {...blockProps}>
            {/* Inspector Controls (sidebar) */}
            <InspectorControls>
                <PanelBody title={__('Badge Settings', 'tidy')}>
                    <TextControl
                        label={__('Badge Text', 'tidy')}
                        value={content}
                        onChange={(value) => setAttributes({ content: value })}
                        placeholder={__('Enter badge text...', 'tidy')}
                    />

                    <SelectControl
                        label={__('Badge Style', 'tidy')}
                        value={style}
                        options={styleOptions}
                        onChange={(value) => setAttributes({ style: value })}
                    />

                    <ToggleControl
                        label={__('Pill Style', 'tidy')}
                        checked={pill}
                        onChange={(value) => setAttributes({ pill: value })}
                        help={__('Enable rounded pill style', 'tidy')}
                    />

                    <TextControl
                        label={__('Link URL', 'tidy')}
                        value={link}
                        onChange={(value) => setAttributes({ link: value })}
                        placeholder="https://example.com"
                        help={__('Optional - makes badge clickable', 'tidy')}
                    />
                </PanelBody>
            </InspectorControls>

            {/* Editor Preview (main canvas) */}
            <div className="tidy-badge-preview">
                {link ? (
                    <a
                        href={link}
                        className={`badge bg-${style}${pill ? ' rounded-pill' : ''}`}
                        style={{ pointerEvents: 'none' }} // Disable actual clicking in editor
                    >
                        {content || __('Badge Preview', 'tidy')}
                    </a>
                ) : (
                    <span className={`badge bg-${style}${pill ? ' rounded-pill' : ''}`}>
                        {content || __('Badge Preview', 'tidy')}
                    </span>
                )}
            </div>
        </div>
    );
}