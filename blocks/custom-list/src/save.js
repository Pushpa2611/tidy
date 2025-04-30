import { useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }) {
    const { listItems } = attributes;
    const blockProps = useBlockProps.save();

    return (
        <div {...blockProps}>
            <ul className="list-group">
                {listItems.map((item, index) => (
                    <li
                        key={index}
                        className={`list-group-item ${item.className || ''}`}
                    >
                        {item.content}
                    </li>
                ))}
            </ul>
        </div>
    );
}