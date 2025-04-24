import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, TextControl } from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
    const { startingYear, showStartingYear } = attributes;
    const currentYear = new Date().getFullYear();

    return (
        <div {...useBlockProps()}>
            <InspectorControls>
                <PanelBody title="Copyright Settings">
                    <ToggleControl
                        label="Show starting year"
                        checked={showStartingYear}
                        onChange={() =>
                            setAttributes({ showStartingYear: !showStartingYear })
                        }
                    />
                    {showStartingYear && (
                        <TextControl
                            label="Starting Year"
                            value={startingYear}
                            onChange={(val) => setAttributes({ startingYear: val })}
                        />
                    )}
                </PanelBody>
            </InspectorControls>
            <p>
                {showStartingYear
                    ? `${startingYear}-${currentYear}`
                    : currentYear}
            </p>
        </div>
    );
}
