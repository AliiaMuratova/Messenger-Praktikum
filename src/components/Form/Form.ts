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
    const inputName = input.getName();
    const inputs = this.children.inputs as Input[];

    let compareValue: string | undefined;
    if (inputName === 'confirmPassword') {
      const passwordInput = inputs.find(i => i.getName() === 'password');
      compareValue = passwordInput?.getValue();
    }

    const { isValid, message } = validateInput(inputName as ValidationType, value, compareValue);

    requestAnimationFrame(() => {
      if (!input.element?.isConnected) return;
      input.setProps({
        error: message,
        isError: !isValid,
        value
      });
    });

    if (inputName === 'password') {
      const confirmInput = inputs.find(i => i.getName() === 'confirmPassword');
      if (confirmInput?.getValue()) {
        this._handleInputBlur(confirmInput);
      }
    }
  }

  private _handleFormSubmit(e: TEvent) {
    const event = e as SubmitEvent;
    event.preventDefault();

    const inputs = (this.children.inputs || this.props.inputs) as Input[];
    if (!inputs || !Array.isArray(inputs)) return;

    const passwordInput = inputs.find(i => i.getName() === 'password');
    const passwordValue = passwordInput?.getValue();

    const validationResults = inputs.map(input => {
      const value = input.getValue();
      const inputName = input.getName();
      
      let compareValue: string | undefined;
      if (inputName === 'confirmPassword') {
        compareValue = passwordValue;
      }

      const { isValid, message } = validateInput(inputName as ValidationType, value, compareValue);

      requestAnimationFrame(() => {
        if (!input.element?.isConnected) return;
        input.setProps({
          error: message,
          isError: !isValid,
          value,
        });
      });

      return isValid;
    });

    const isFormValid = validationResults.every(Boolean);
    if (!isFormValid) return;

    if (!(event.target instanceof HTMLFormElement)) return;

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    console.log('Данные формы:', data);
  }


  render() {
    return this.compile(template, this.props);
  }
}
