import { Field, TextInput } from '@strapi/design-system';
import * as React from 'react';
import { useIntl } from 'react-intl';

interface RankingFieldProps {
  attribute: {
    type: string;
  };
  disabled?: boolean;
  intlLabel: {
    id: string;
    defaultMessage: string;
  };
  name: string;
  onChange: (event: {
    target: { name: string; type: string; value: string };
  }) => void;
  required?: boolean;
  value?: string;
}

const Input = React.forwardRef<HTMLInputElement, RankingFieldProps>(
  (props, ref) => {
    const { attribute, disabled, intlLabel, name, onChange, required, value } =
      props;

    const { formatMessage } = useIntl();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({
        target: { name, type: attribute.type, value: e.currentTarget.value },
      });
    };

    return (
      <Field.Root>
        <Field.Label>
          {formatMessage({
            id: intlLabel?.id || 'crm-fields.ranking.label',
            defaultMessage: intlLabel?.defaultMessage || 'Ranking',
          })}
        </Field.Label>
        <TextInput
          type='number'
          min={0}
          max={5}
          ref={ref}
          name={name}
          disabled={disabled}
          value={value || ''}
          required={required}
          onChange={handleChange}
        />
      </Field.Root>
    );
  }
);

export default Input;
