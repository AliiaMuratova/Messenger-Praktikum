import Handlebars from 'handlebars';
import template from './Error.hbs?raw';

const renderError = Handlebars.compile(template);

export const Error404Page = {
  render: () => {
    return renderError({ errorCode: '404', errorMessage: 'Не туда попали' });;
  }
};

export const Error500Page = {
  render: () => {
    return renderError({ errorCode: '500', errorMessage: 'Мы уже фиксим' });;
  }
};
