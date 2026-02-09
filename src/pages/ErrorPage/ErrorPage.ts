import { Block, BlockProps } from '@/core/Block';
import template from './Error.hbs?raw';


interface ErrorPageProps extends BlockProps {
  errorCode: string;
  errorMessage: string;
}

export class ErrorPage extends Block<ErrorPageProps> {
  constructor(props: ErrorPageProps) {
    super({
      ...props,
    });
  }

  render() {
    return this.compile(template, this.props);
  }
}
