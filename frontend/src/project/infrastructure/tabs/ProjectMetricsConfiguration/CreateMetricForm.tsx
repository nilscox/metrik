import { useRef } from 'react';

import AddIcon from '@material-design-icons/svg/round/add.svg';
import { useDispatch } from 'react-redux';

import { Collapse } from '~/components/Collapse/Collapse';
import { useAppSelector } from '~/hooks/useAppSelector';
import { useParam } from '~/hooks/useParam';
import {
  selectCreatingMetric,
  selectIsMetricCreationFormOpen,
  setMetricConfigurationFormOpen,
} from '~/project/domain';
import { createMetric } from '~/project/domain/usecases/createMetric/createMetric';

import { MetricForm, MetricFormRef } from './MetricForm';

export const CreateMetricForm: React.FC = () => {
  const projectId = useParam('projectId');

  const dispatch = useDispatch();

  const open = useAppSelector(selectIsMetricCreationFormOpen, projectId);
  const creating = useAppSelector(selectCreatingMetric, projectId);

  const formRef = useRef<MetricFormRef>(null);

  return (
    <div className="py-4">
      <button
        className="flex flex-row items-center gap-4"
        onClick={() => dispatch(setMetricConfigurationFormOpen(projectId, !open))}
      >
        <AddIcon />
        Add a new metric
      </button>
      <Collapse open={open}>
        <MetricForm
          ref={formRef}
          submitButtonText="Create"
          submitting={creating}
          onSubmit={(metric) => dispatch(createMetric(projectId, metric, formRef.current?.clear))}
        />
      </Collapse>
    </div>
  );
};
