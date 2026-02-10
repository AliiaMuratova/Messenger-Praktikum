import { Block, BlockProps } from '@/core/Block';
import { TEvent } from '@/types/common';
import template from './FileInput.hbs?raw';
import './FileInput.pcss';

interface FileInputProps extends BlockProps {
  name: string;
  accept?: string;
  fileName?: string;
  placeholder?: string;
  error?: string;
  onChange?: (file: File) => void;
}

export class FileInput extends Block<FileInputProps> {
  private _selectedFile: File | null = null;

  constructor(props: FileInputProps) {
    super({
      ...props,
      placeholder: props.placeholder,
      events: {
        change: (e: TEvent) => {
          if (!(e.target instanceof HTMLInputElement)) return;
          const input = e.target;
          const file = input.files?.[0];
          
          if (file) {
            const allowedTypes = props.accept?.split(',') || [];
            if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
              this._selectedFile = null;
              this.setProps({ 
                error: 'Нужно выбрать изображение',
                fileName: '' 
              });
              input.value = '';
              return;
            }
            
            this._selectedFile = file;
            this.setProps({ fileName: file.name, error: '' });
            props.onChange?.(file);
          }
        },
      },
    });
  }

  public getFile(): File | null {
    return this._selectedFile;
  }

  public reset() {
    this._selectedFile = null;
    this.setProps({ fileName: '', error: '' });
  }

  
  render() {
    return this.compile(template, this.props);
  }
}

