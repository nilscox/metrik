import { useParams } from 'react-router-dom';

export const useParam = (key: string) => {
  const params = useParams();
  const param = params[key];

  if (!param) {
    throw new Error(`expected param "${key}" to exist`);
  }

  return param;
};
