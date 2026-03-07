import { Block } from '@/core/Block';


export function renderDOM(query: string, block: Block): HTMLElement {
  const root = document.querySelector<HTMLElement>(query);

  if (!root) {
    throw new Error(`Root element not found for selector: ${query}`);
  }

  root.innerHTML = '';
  root.appendChild(block.getContent());
  block.dispatchComponentDidMount();
  
  return root;
}
