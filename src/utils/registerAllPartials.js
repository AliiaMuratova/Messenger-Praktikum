import Handlebars from 'handlebars';

export function registerAllPartials() {
  const files = import.meta.glob('/src/**/*.hbs', {
    eager: true,
    query: '?raw',
    import: 'default',
  });

  Object.entries(files).forEach(([path, content]) => {
    const partialName = path
      .split('/')
      .pop()
      .replace('.hbs', '');

    Handlebars.registerPartial(partialName, content);
  });
}
