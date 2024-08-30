import { DON_Node } from './node';

const node = new DON_Node(3000, process.argv[2] === 'bootstrap');

node.start();