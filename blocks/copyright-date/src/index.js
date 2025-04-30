import { registerBlockType } from '@wordpress/blocks';
import block from '../block.json';
import edit from './edit';
import save from './save'; // ADD THIS

registerBlockType(block.name, {
    ...block,
    edit,
    save, // INCLUDE SAVE
});
