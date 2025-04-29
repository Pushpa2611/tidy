import { useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }) {
    const { content, style, pill, link } = attributes;
    const blockProps = useBlockProps.save({
        className: `badge bg-${style}${pill ? ' rounded-pill' : ''}`
    });

    if (link) {
        return (
            <a {...blockProps} href={link}>
                {content}
            </a>
        );
    }

    return (
        <span {...blockProps}>
            {content}
        </span>
    );
}