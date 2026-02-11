import { EventBus, Listener } from './EventBus';
import { Nullable, TEvent } from '@/types/common';
import Handlebars from 'handlebars';

export enum BlockEvents {
  INIT = 'init',
  FLOW_CDM = 'flow:component-did-mount',
  FLOW_CDU = 'flow:component-did-update',
  FLOW_RENDER = 'flow:render'
}

export interface BlockProps {
  events?: Record<string, (e: TEvent) => void>;
  attr?: Record<string, string>;
  [key: string]: unknown;
}


export abstract class Block<P extends BlockProps = BlockProps> {
  static EVENTS = BlockEvents;

  protected _element: Nullable<HTMLElement> = null;
  public id: number = Math.floor(100000 + Math.random() * 900000);
  protected props: P;
  protected children: Record<string, Block | Block[]>;
  protected lists: Record<string, unknown[]>;
  protected eventBus: () => EventBus;
  private _isBatching = false;


  constructor(propsWithChildren = {} as P) {
    const eventBus = new EventBus();
    const { props, children, lists } = this._getChildrenPropsAndProps(propsWithChildren);
    this.props = this._makePropsProxy({ ...props } as P);
    this.children = children;
    this.lists = { ...lists };
    this.eventBus = () => eventBus;
    this._registerEvents(eventBus);
    eventBus.emit(BlockEvents.INIT);
  }

  private _registerEvents(eventBus: EventBus): void {
    eventBus.on(BlockEvents.INIT, this.init.bind(this) as Listener);
    eventBus.on(BlockEvents.FLOW_CDM, this._componentDidMount.bind(this) as Listener);
    eventBus.on(BlockEvents.FLOW_CDU, this._componentDidUpdate.bind(this) as Listener);
    eventBus.on(BlockEvents.FLOW_RENDER, this._render.bind(this) as Listener);
  }

  private _addEvents(): void {
    const { events = {} } = this.props;

    Object.keys(events).forEach(eventName => {
      if (this._element) {
        this._element.addEventListener(
          eventName,
          events[eventName],
          (eventName === 'blur')
        );
      }
    });
  }

  private _removeEvents(): void {
    const { events = {} } = this.props;

    Object.keys(events).forEach(eventName => {
      if (this._element) {
        this._element.removeEventListener(eventName, events[eventName]);
      }
    });
  }

  protected init(): void {
    this.eventBus().emit(BlockEvents.FLOW_RENDER);
  }

  private _componentDidMount(): void {
    this.componentDidMount();

    Object.values(this.children).forEach(child => {
      if (Array.isArray(child)) {
        child.forEach(ch => ch.dispatchComponentDidMount());
      } else {
        child.dispatchComponentDidMount();
      }
    });
  }

  protected componentDidMount(): void { }

  public dispatchComponentDidMount(): void {
    this.eventBus().emit(BlockEvents.FLOW_CDM);
  }

  private _componentDidUpdate(oldProps: P, newProps: P): void {
    const response = this.componentDidUpdate(oldProps, newProps);
    if (!response) {
      return;
    }
    this._render();
  }
  protected componentDidUpdate(_oldProps: P, _newProps: P): boolean {
    return true;
  }

  private _getChildrenPropsAndProps(propsAndChildren: P): {
    children: Record<string, Block | Block[]>,
    props: Partial<P>,
    lists: Record<string, unknown[]>
  } {
    const children: Record<string, Block | Block[]> = {};
    const props: Partial<P> = {};
    const lists: Record<string, unknown[]> = {};

    Object.entries(propsAndChildren).forEach(([key, value]) => {
      if (value instanceof Block) {
        children[key] = value;
      }
      else if (Array.isArray(value) && value.length > 0 && value[0] instanceof Block) {
        children[key] = value as Block[];
      }
      else if (Array.isArray(value)) {
        lists[key] = value;
      }
      else {
        (props as Record<string, unknown>)[key] = value;
      }
    });

    return { children, props: props as P, lists };
  }

  protected addAttributes(): void {
    const { attr = {} } = this.props;

    Object.entries(attr).forEach(([key, value]) => {
      if (this._element) {
        this._element.setAttribute(key, value as string);
      }
    });
  }


  get element(): HTMLElement | null {
    return this._element;
  }

  protected compile(template: string, props: Record<string, unknown>) {
    const propsAndStubs = { ...props };

    Object.entries(this.children).forEach(([key, child]) => {
      if (Array.isArray(child)) {
        propsAndStubs[key] = child.map(item => `<div data-id="${item.id}"></div>`).join('');
      } else {
        propsAndStubs[key] = `<div data-id="${child.id}"></div>`;
      }
    });

    Object.entries(this.lists).forEach(([key]) => {
      propsAndStubs[key] = `<div data-id="__l_${key}"></div>`;
    });

    const fragment = document.createElement('template');
    fragment.innerHTML = Handlebars.compile(template)(propsAndStubs);

    Object.values(this.children).forEach(child => {
      if (Array.isArray(child)) {
        child.forEach(item => {
          const stub = fragment.content.querySelector(`[data-id="${item.id}"]`);
          stub?.replaceWith(item.getContent());
        });
      } else {
        const stub = fragment.content.querySelector(`[data-id="${child.id}"]`);
        stub?.replaceWith(child.getContent());
      }
    });

    Object.entries(this.lists).forEach(([key, list]) => {
      const stub = fragment.content.querySelector(`[data-id="__l_${key}"]`);
      if (!stub) return;

      const listContent = document.createElement('template');
      list.forEach(item => {
        if (item instanceof Block) {
          listContent.content.append(item.getContent());
        } else {
          listContent.content.append(`${item}`);
        }
      });
      stub.replaceWith(listContent.content);
    });

    return fragment.content;
  }

  private _render(): void {
    this._removeEvents();

    const fragment = this.render();
    const newElement = fragment.firstElementChild;

    if (!(newElement instanceof HTMLElement)) {
      return;
    }

    if (this._element) {
      this._element.replaceWith(newElement);
    }

    this._element = newElement;
    this._addEvents();
    this.addAttributes();

    this.afterRender();
  }

  protected afterRender(): void { }

  protected abstract render(): DocumentFragment;

  public getContent(): HTMLElement {
    if (!this._element) {
      throw new Error('Element is not created');
    }
    return this._element;
  }


  private _makePropsProxy(props: P): P {
    return new Proxy(props, {
      get: (target: P, prop: string) => {
        const value = (target as Record<string, unknown>)[prop];
        return typeof value === 'function' ? value.bind(target) : value;
      },
      set: (target: P, prop: string, value: unknown) => {
        const oldProps = { ...target };
        (target as Record<string, unknown>)[prop] = value;

        if (!this._isBatching) {
          this.eventBus().emit(
            BlockEvents.FLOW_CDU,
            oldProps,
            target
          );
        }

        return true;
      },
      deleteProperty() {
        throw new Error('No access');
      },
    });
  }

  public setProps(nextProps: Partial<P>): void {
    if (!nextProps) return;
    
    const oldProps = { ...this.props };
    this._isBatching = true;
    Object.assign(this.props, nextProps);
    this._isBatching = false;
    
    this.eventBus().emit(BlockEvents.FLOW_CDU, oldProps, this.props);
  }

  public setChildrenProps(name: string, nextProps: Record<string, unknown>): void {
    const children = this.children[name];

    if (!children) {
      return;
    }

    if (Array.isArray(children)) {
      children.forEach((child) => {
        child.setProps(nextProps);
      });
    } else {
      children.setProps(nextProps);
    }
  }
}
