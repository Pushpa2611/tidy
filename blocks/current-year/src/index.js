import { registerBlockType } from '@wordpress/blocks';
import metadata from '../block.json';
import Edit from './edit';

registerBlockType(metadata.name, {
    edit: Edit,
    save: () => null // Dynamic block - saves no content
});