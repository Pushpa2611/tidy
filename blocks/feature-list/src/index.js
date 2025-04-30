import { registerBlockType } from '@wordpress/blocks';
import block from '../block.json';
import Edit from './edit';

registerBlockType(block.name, {
    ...block,
    edit: Edit,
});
