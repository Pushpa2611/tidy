import { useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }) {
    const { items, accordionId, flush } = attributes;
    const blockProps = useBlockProps.save();
    const accordionClass = flush ? 'accordion accordion-flush' : 'accordion';

    return (
        <div {...blockProps}>
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