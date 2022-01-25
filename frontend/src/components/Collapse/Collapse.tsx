import ReactCollapse from '@kunukn/react-collapse';

export type CollapseProps = {
  open: boolean;
};

export const Collapse: React.FC<CollapseProps> = ({ open, ...props }) => {
  return <ReactCollapse className="transition-all" isOpen={open} {...props} />;
};
