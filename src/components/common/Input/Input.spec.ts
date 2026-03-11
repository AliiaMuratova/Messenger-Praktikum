import { expect } from 'chai';
import sinon from 'sinon';
import { Input } from './Input.js';

describe('Input', () => {
  it('должен создавать экземпляр компонента', () => {
    const input = new Input({ name: 'test' });
    expect(input).to.be.instanceOf(Input);
  });

  it('должен рендерить поле ввода', () => {
    const input = new Input({ name: 'email', label: 'Email' });
    const element = input.getContent();
    
    const inputEl = element.querySelector('input');
    expect(inputEl !== null).to.equal(true);
    expect(inputEl?.getAttribute('name')).to.equal('email');
  });

  it('должен устанавливать тип поля', () => {
    const input = new Input({ name: 'password', type: 'password' });
    const element = input.getContent();
    
    const inputEl = element.querySelector('input');
    expect(inputEl?.getAttribute('type')).to.equal('password');
  });

  it('должен устанавливать placeholder', () => {
    const input = new Input({ name: 'search', placeholder: 'Поиск...' });
    const element = input.getContent();
    
    const inputEl = element.querySelector('input');
    expect(inputEl?.getAttribute('placeholder')).to.equal('Поиск...');
  });

  it('должен возвращать имя через getName', () => {
    const input = new Input({ name: 'username' });
    
    expect(input.getName()).to.equal('username');
  });

  it('должен возвращать значение через getValue', () => {
    const input = new Input({ name: 'test', value: 'initial value' });
    
    const value = input.getValue();
    expect(typeof value).to.equal('string');
  });

  it('должен отображать ошибку', () => {
    const input = new Input({ 
      name: 'email', 
      isError: true, 
      error: 'Неверный email' 
    });
    const element = input.getContent();
    
    const errorEl = element.querySelector('.field__error');
    expect(errorEl !== null).to.equal(true);
    expect(errorEl?.textContent).to.include('Неверный email');
  });

  it('должен вызывать onInput при вводе', () => {
    const onInput = sinon.spy();
    const input = new Input({ name: 'test', onInput });
    const element = input.getContent();
    
    const inputEl = element.querySelector('input');
    if (inputEl) {
      inputEl.value = 'test value';
      const event = document.createEvent('Event');
      event.initEvent('input', true, true);
      inputEl.dispatchEvent(event);
    }
    
    expect(onInput.called).to.equal(true);
  });

  it('должен вызывать onBlur при потере фокуса', () => {
    const onBlur = sinon.spy();
    const input = new Input({ name: 'test', onBlur });
    const element = input.getContent();
    
    const event = document.createEvent('Event');
    event.initEvent('blur', true, true);
    element.dispatchEvent(event);
    
    expect(onBlur.called).to.equal(true);
  });

  it('должен отображать label', () => {
    const input = new Input({ name: 'name', label: 'Имя пользователя' });
    const element = input.getContent();
    
    const label = element.querySelector('label');
    expect(label !== null).to.equal(true);
    expect(label?.textContent).to.include('Имя пользователя');
  });

  it('должен показывать кнопку переключения пароля для isPassword', () => {
    const input = new Input({ name: 'password', isPassword: true, type: 'password' });
    const element = input.getContent();
    
    const toggleBtn = element.querySelector('.password-control');
    expect(toggleBtn !== null).to.equal(true);
  });
});

