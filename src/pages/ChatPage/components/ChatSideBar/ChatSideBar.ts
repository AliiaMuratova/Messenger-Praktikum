import { Block, BlockProps } from '@/core/Block';
import searchIcon from '@/assets/icons/search_icon.svg';
import template from './ChatSideBar.hbs?raw';
import { DialogItem, DialogData } from '../DialogItem/DialogItem';
import noImage from '@/assets/images/Image-not-found.png';

interface ChatSideBarProps extends BlockProps {
  searchIcon?: string;
  isEmpty: boolean;
  dialogs: DialogItem[];
}

interface ChatSideBarConstructorProps {
  dialogsData: DialogData[];
}

export class ChatSideBar extends Block<ChatSideBarProps> {
  constructor(props: ChatSideBarConstructorProps) {
    const dialogs = props.dialogsData.map((dialog) => new DialogItem(
      { ...dialog, avatar: noImage }
    )
    );

    super({
      searchIcon,
      isEmpty: dialogs.length === 0,
      dialogs,
    });
  }

  render() {
    return this.compile(template, this.props);
  }
}
