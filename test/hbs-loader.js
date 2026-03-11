import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';

export async function load(url, context, nextLoad) {
  if (url.endsWith('.hbs') || url.includes('.hbs?')) {
    const filePath = fileURLToPath(url.replace('?raw', ''));
    const source = readFileSync(filePath, 'utf-8');
    return {
      format: 'module',
      source: `export default ${JSON.stringify(source)};`,
      shortCircuit: true,
    };
  }
  
  if (url.endsWith('.pcss') || url.endsWith('.css')) {
    return {
      format: 'module',
      source: 'export default {};',
      shortCircuit: true,
    };
  }
  
  return nextLoad(url, context);
}

