import { ComponentProps, forwardRef } from 'react';

import cx from 'classnames';

export type ButtonProps = ComponentProps<'button'> & {
  loading?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, disabled, loading, children, ...props }, ref) => (
    <button
      {...props}
      disabled={loading || disabled}
      className={cx('font-bold relative disabled:text-disabled', className)}
      ref={ref}
    >
      {children}
      {loading && <LoadingIndicator />}
    </button>
  ),
);

const LoadingIndicator: React.FC = () => (
  <div className="absolute bottom-0 right-0 border-b-2 border-grey animate-loading" />
);
