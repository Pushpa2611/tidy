import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { TextControl, SelectControl, PanelBody } from '@wordpress/components';

const BUTTON_STYLES = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark', 'link'];
const BUTTON_TYPES = [
    { label: 'Button', value: 'button' },
    { label: 'Submit', value: 'submit' },
    { label: 'Reset', value: 'reset' },
    { label: 'Input (Button)', value: 'input-button' },
    { label: 'Input (Submit)', value: 'input-submit' },
    { label: 'Input (Reset)', value: 'input-reset' },
    { label: 'Anchor Link', value: 'anchor' }
];

export default function Edit({ attributes, setAttributes }) {
    const { label, buttonStyle, buttonType } = attributes;

    const renderPreview = () => {
        const className = `btn btn-${buttonStyle}`;

        switch (buttonType) {
            case 'anchor':
                return <a className={className} href="#" role="button">{label}</a>;
            case 'input-button':
                return <input className={className} type="button" value={label} />;
            case 'input-submit':
                return <input className={className} type="submit" value={label} />;
            case 'input-reset':
                return <input className={className} type="reset" value={label} />;
            default:
                return <button type={buttonType} className={className}>{label}</button>;
        }
    };

    return (
        <>
            <InspectorControls>
                <PanelBody title="Button Settings">
                    <TextControl
                        label="Button Label"
                        value={label}
                        onChange={(val) => setAttributes({ label: val })}
                    />
                    <SelectControl
                        label="Bootstrap Button Style"
                        value={buttonStyle}
                        options={BUTTON_STYLES.map(style => ({
                            label: style.charAt(0).toUpperCase() + style.slice(1),
                            value: style
                        }))}
                        onChange={(val) => setAttributes({ buttonStyle: val })}
                    />
                    <SelectControl
                        label="Button Type"
                        value={buttonType}
                        options={BUTTON_TYPES}
                        onChange={(val) => setAttributes({ buttonType: val })}
                    />
                    {buttonType === 'anchor' && (
                        <TextControl
                            label="Link URL"
                            value={attributes.href}
                            onChange={(val) => setAttributes({ href: val })}
                        />
                    )}

                </PanelBody>
            </InspectorControls>

            <div {...useBlockProps()}>
                {renderPreview()}
            </div>
        </>
    );
}
