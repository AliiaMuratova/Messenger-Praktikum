import { expect } from 'chai';
import sinon from 'sinon';
import { Block } from './Block.js';
import type { BlockProps } from './Block.js';

class TestBlock extends Block {
  constructor(props: BlockProps = {}) {
    super(props);
  }

  render(): DocumentFragment {
    const fragment = document.createElement('template');
    fragment.innerHTML = '<div class="test-block">Test Content</div>';
    return fragment.content;
  }
}

interface TestPropsBlockProps extends BlockProps {
  text?: string;
  count?: number;
}

class TestPropsBlock extends Block<TestPropsBlockProps> {
  render(): DocumentFragment {
    const fragment = document.createElement('template');
    fragment.innerHTML = `<div class="test-block">${this.props.text || ''}</div>`;
    return fragment.content;
  }
}


describe('Block', () => {
  describe('Создание экземпляра', () => {
    it('должен создавать экземпляр компонента', () => {
      const block = new TestBlock();
      
      expect(block).to.be.instanceOf(Block);
    });

    it('должен генерировать уникальный id', () => {
      const block1 = new TestBlock();
      const block2 = new TestBlock();
      
      expect(block1.id).to.be.a('number');
      expect(block2.id).to.be.a('number');
      expect(block1.id).to.not.equal(block2.id);
    });

    it('должен инициализировать props', () => {
      const props = { text: 'Hello', count: 5 };
      const block = new TestPropsBlock(props);
      
      expect(block.getContent()).to.be.instanceOf(HTMLElement);
    });
  });

  describe('Метод getContent', () => {
    it('должен возвращать элемент с правильным содержимым', () => {
      const block = new TestPropsBlock({ text: 'Привет' });
      const content = block.getContent();
      
      expect(content.textContent).to.equal('Привет');
    });
  });

  describe('Метод setProps', () => {
    it('должен обновлять контент и вызывать перерендер', () => {
      const block = new TestPropsBlock({ text: 'Old' });
      const renderSpy = sinon.spy(block, 'render');
      
      block.setProps({ text: 'New' });
      
      expect(block.getContent().textContent).to.equal('New');
      expect(renderSpy.called).to.equal(true);
    });
  });

  describe('События', () => {
    it('должен вызывать обработчик события и удалять старые обработчики при перерендере', () => {
      const onClick = sinon.spy();
      const block = new TestBlock({ events: { click: onClick } });
      
      block.setProps({});
      block.getContent().click();
      
      expect(onClick.calledOnce).to.equal(true); 
    });
  });

  describe('Атрибуты', () => {
    it('должен устанавливать атрибуты из props.attr', () => {
      const block = new TestBlock({
        attr: {
          'data-test': 'value',
          'id': 'my-block'
        }
      });
      
      const element = block.getContent();
      
      expect(element.getAttribute('data-test')).to.equal('value');
      expect(element.getAttribute('id')).to.equal('my-block');
    });
  });

  describe('Жизненный цикл', () => {
    it('должен корректно отрабатывать стадии mount и update', () => {
      const mountSpy = sinon.spy(TestPropsBlock.prototype, 'componentDidMount' as keyof TestPropsBlock);
      const updateSpy = sinon.spy(TestPropsBlock.prototype, 'componentDidUpdate' as keyof TestPropsBlock);
      const block = new TestPropsBlock({ text: '1' });

      block.dispatchComponentDidMount();
      expect(mountSpy.calledOnce).to.equal(true);

      block.setProps({ text: '2' });
      expect(updateSpy.calledOnce).to.equal(true);

      mountSpy.restore();
      updateSpy.restore();
    });
  });
});

