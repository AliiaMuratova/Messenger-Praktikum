import { Block, BlockProps } from '@/core/Block';
import searchIcon from '@/assets/icons/search_icon.svg';
import template from './ChatSideBar.hbs?raw';
import { DialogItem, DialogData } from '../DialogItem/DialogItem';
import noImage from '@/assets/images/image-not-found.png';

interface ChatSideBarProps extends BlockProps {
  searchIcon?: string;
  isEmpty: boolean;
  dialogs?: DialogItem[];
  searchValue?: string;
}

interface ChatSideBarConstructorProps {
  dialogsData?: DialogData[];
  onSearch?: (title: string) => void;
  onSelectChat?: (chatId: number) => void;
  onAddChat?: () => void;
}

export class ChatSideBar extends Block<ChatSideBarProps> {
  private onSearch?: (title: string) => void;
  private onSelectChat?: (chatId: number) => void;
  private onAddChat?: () => void;
  private searchTimeout?: ReturnType<typeof setTimeout>;
  private currentSearchValue: string = '';
  private activeChatId: number | null = null;

  constructor(props: ChatSideBarConstructorProps = {}) {
    const dialogs = (props.dialogsData || []).map((dialog) => new DialogItem(
      { ...dialog, avatar: dialog.avatar || noImage, onClick: (id) => this.handleSelectChat(id) }
    ));

    super({
      searchIcon,
      isEmpty: dialogs.length === 0,
      searchValue: '',
    });

    this.children.dialogs = dialogs;
    this.onSearch = props.onSearch;
    this.onSelectChat = props.onSelectChat;
    this.onAddChat = props.onAddChat;
  }

  protected afterRender(): void {
    const searchInput = this.element?.querySelector('.sidebar__search-input');
    if (searchInput instanceof HTMLInputElement) {
      searchInput.value = this.currentSearchValue;
      searchInput.addEventListener('input', (e) => this.handleSearchInput(e));
    }

    const addChatButton = this.element?.querySelector('.sidebar__add-chat-button');
    if (addChatButton) {
      addChatButton.addEventListener('click', () => this.onAddChat?.());
    }
  }

  private handleSearchInput(e: Event): void {
    if (!(e.target instanceof HTMLInputElement)) return;
    
    const value = e.target.value;
    this.currentSearchValue = value;

    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = setTimeout(() => {
      this.onSearch?.(value.trim());
    }, 500);
  }

  public setDialogs(dialogsData: DialogData[]): void {
    const dialogs = dialogsData.map((dialog) => new DialogItem({
      ...dialog,
      avatar: dialog.avatar || noImage,
      active: dialog.id === this.activeChatId,
      onClick: (id) => this.handleSelectChat(id),
    }));

    this.children.dialogs = dialogs;
    this.setProps({ isEmpty: dialogs.length === 0 });
  }

  private handleSelectChat(chatId: number): void {
    this.setActiveChat(chatId);
    this.onSelectChat?.(chatId);
  }

  private setActiveChat(chatId: number): void {
    this.activeChatId = chatId;

    const dialogs = this.children.dialogs as DialogItem[];
    dialogs.forEach((dialog) => {
      const isActive = dialog.getChatId() === chatId;
      dialog.setProps({ active: isActive });
    });
  }

  render() {
    return this.compile(template, this.props);
  }
}
