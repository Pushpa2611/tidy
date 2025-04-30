import { useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }) {
    const { label, buttonStyle, buttonType, href } = attributes;
    const blockProps = useBlockProps.save({
        className: `btn btn-${buttonStyle}`
    });

    switch (buttonType) {
        case 'anchor':
            return (
                <a {...blockProps} href={href} role="button">
                    {label}
                </a>
            );
        case 'input-button':
            return <input {...blockProps} type="button" value={label} />;
        case 'input-submit':
            return <input {...blockProps} type="submit" value={label} />;
        case 'input-reset':
            return <input {...blockProps} type="reset" value={label} />;
        default:
            return (
                <button {...blockProps} type={buttonType}>
                    {label}
                </button>
            );
    }
}