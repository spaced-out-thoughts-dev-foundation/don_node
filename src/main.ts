import { DON_Node } from './node';
(async () => {
  const node = new DON_Node(3000, process.argv[2] === 'bootstrap');

  await node.start();
})();