import { FormEventHandler, forwardRef, useImperativeHandle, useState } from 'react';

import { MetricTypeEnum } from '@shared/enums/MetricTypeEnum';
import { Button } from '~/components/Button/Button';
import { Metric } from '~/project/domain';

export type MetricFormProps = {
  metric?: Metric;
  submitButtonText: string;
  submitting: boolean;
  onSubmit: (metric: Omit<Metric, 'id'>) => void;
};

export type MetricFormRef = {
  clear: () => void;
};

export const MetricForm = forwardRef<MetricFormRef, MetricFormProps>(
  ({ metric, submitButtonText, submitting, onSubmit }, ref) => {
    const [label, setLabel] = useState(metric?.label ?? '');
    const [type, setType] = useState(metric?.type ?? MetricTypeEnum.number);

    useImperativeHandle(ref, () => ({
      clear() {
        setLabel('');
        setType(MetricTypeEnum.number);
      },
    }));

    const handleSubmit: FormEventHandler = (event) => {
      event.preventDefault();
      onSubmit({ label, type });
    };

    return (
      <form className="max-w-xl py-4 pl-8 grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
        {metric && (
          <>
            <div>Metric ID</div>
            <div>
              <input disabled type="text" value={metric.id} />
            </div>
          </>
        )}

        <div>Metric label</div>
        <div>
          <input type="text" value={label} onChange={(event) => setLabel(event.target.value)} />
        </div>

        <div>Type</div>
        <MetricTypeSelect value={type} onChange={setType} />

        <Button
          type="submit"
          className="col-span-2 justify-self-end"
          disabled={label === ''}
          loading={submitting}
        >
          {submitButtonText}
        </Button>
      </form>
    );
  },
);

type MetricTypeSelectProps = {
  value?: MetricTypeEnum;
  onChange: (type: MetricTypeEnum) => void;
};

const MetricTypeSelect: React.FC<MetricTypeSelectProps> = ({ value, onChange }) => (
  <select value={value} onChange={(e) => onChange(e.target.value as MetricTypeEnum)}>
    {Object.values(MetricTypeEnum).map((type) => (
      <option key={type} value={type}>
        {type}
      </option>
    ))}
  </select>
);
