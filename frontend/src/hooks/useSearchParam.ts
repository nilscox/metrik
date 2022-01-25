import { useSearchParams } from 'react-router-dom';

export const useSearchParam = (key: string) => {
  const [searchParams] = useSearchParams();

  return searchParams.get(key);
};
