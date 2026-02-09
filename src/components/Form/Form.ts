import { Block, BlockProps } from '@/core/Block';
import { TEvent } from '@/types/common';
import template from './Form.hbs?raw';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { ValidationType } from '@/utils/validation/types';
import { validateInput } from '@/utils/validation/validateInput';

interface FormProps extends BlockProps {
  title: string;
  formId: string;
  buttonText: string;
  linkText?: string;
  linkHref?: string;
  inputs: Input[];
}

export class Form extends Block<FormProps> {
  constructor(props: FormProps) {
    const validatedInputs = props.inputs.map((input, index) => {
      const inputName = input.getName();
      return new Input({
        ...input.getProps(),
        onBlur: () => {
          const currentInputs = this.children.inputs as Input[];
          const currentInput = currentInputs?.find(input => input.getName() === inputName)
            || currentInputs?.[index];
          if (currentInput) {
            this._handleInputBlur(currentInput);
          }
        },
      });
    });

    super({
      ...props,
      inputs: validatedInputs,
      submitButton: new Button({
        text: props.buttonText,
        type: 'submit',
      }),
      events: {
        submit: (e: TEvent) => this._handleFormSubmit(e),
      },
    });
  }

  private _handleInputBlur(input: Input) {
    const value = input.getValue();
    const { isValid, message } = validateInput(input.getName() as ValidationType, value);

    requestAnimationFrame(() => {
      if (!input.element?.isConnected) return;
      input.setProps({
        error: message,
        isError: !isValid,
        value
      });
    });
  }

  private _handleFormSubmit(e: TEvent) {
    const event = e as SubmitEvent;
    event.preventDefault();

    const inputs = (this.children.inputs || this.props.inputs) as Input[];
    if (!inputs || !Array.isArray(inputs)) return;

    let isFormValid = true;

    inputs.forEach(input => {
      const value = input.getValue();
      const { isValid, message } = validateInput(input.getName() as ValidationType, value);

      requestAnimationFrame(() => {
        if (!input.element?.isConnected) return;
        input.setProps({
          error: message,
          isError: !isValid,
          value: value,
        });
      });

      if (!isValid) isFormValid = false;
    });

    if (!isFormValid) return;

    const formData = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    console.log('Данные формы:', data);
  }


  render() {
    return this.compile(template, this.props);
  }
}
