import { useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }) {
    const { startingYear, showStartingYear, text } = attributes;
    const currentYear = new Date().getFullYear();
    const blockProps = useBlockProps.save();

    // Determine year output
    const yearOutput = showStartingYear && startingYear
        ? `${startingYear}-${currentYear}`
        : currentYear;

    return (
        <div {...blockProps}>
            <p className="copyright-date-block">
                © {yearOutput}
                {text && ` — ${text}`}
            </p>
        </div>
    );
}