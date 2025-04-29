import { registerBlockType } from '@wordpress/blocks';
import block from '../block.json';
import Edit from './edit';
import Save from './save';

registerBlockType(block.name, {
    ...block,
    edit: Edit,
    save: Save
});