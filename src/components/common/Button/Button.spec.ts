import { expect } from 'chai';
import sinon from 'sinon';
import { Button } from './Button.js';

describe('Button', () => {
  it('должен создавать экземпляр компонента', () => {
    const button = new Button({ text: 'Нажми меня' });
    expect(button).to.be.instanceOf(Button);
  });

  it('должен рендерить кнопку с текстом', () => {
    const button = new Button({ text: 'Отправить' });
    const element = button.getContent();
    
    expect(element.tagName).to.equal('BUTTON');
    expect(element.textContent?.trim()).to.include('Отправить');
  });

  it('должен устанавливать тип кнопки', () => {
    const button = new Button({ text: 'Submit', type: 'submit' });
    const element = button.getContent();
    
    expect(element.getAttribute('type')).to.equal('submit');
  });

  it('должен добавлять CSS класс', () => {
    const button = new Button({ text: 'Test', class: 'custom-class' });
    const element = button.getContent();
    
    expect(element.classList.contains('custom-class')).to.equal(true);
  });

  it('должен устанавливать id', () => {
    const button = new Button({ text: 'Test', id: 'my-button' });
    const element = button.getContent();
    
    expect(element.id).to.equal('my-button');
  });

  it('должен вызывать обработчик клика', () => {
    const onClick = sinon.spy();
    const button = new Button({ 
      text: 'Click me',
      events: { click: onClick }
    });
    const element = button.getContent();
    
    element.click();
    
    expect(onClick.calledOnce).to.equal(true);
  });

  it('должен обновлять текст при setProps', () => {
    const button = new Button({ text: 'Старый текст' });
    
    button.setProps({ text: 'Новый текст' });
    
    const element = button.getContent();
    expect(element.textContent?.trim()).to.include('Новый текст');
  });
});

