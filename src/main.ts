import { DON_Node } from './node';
(async () => {
  const node = new DON_Node(Number(process.argv[2]), process.argv[3] === 'bootstrap');

  await node.start();
})();