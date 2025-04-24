import { registerBlockType } from '@wordpress/blocks';
import block from '../block.json';
import edit from './edit';

registerBlockType(block.name, {
    ...block,
    edit,
});
