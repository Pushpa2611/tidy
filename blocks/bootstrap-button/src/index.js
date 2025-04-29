import { registerBlockType } from '@wordpress/blocks';
import block from '../block.json';
import edit from './edit';
import save from './save';

registerBlockType(block.name, {
    ...block,
    edit,
    save
});