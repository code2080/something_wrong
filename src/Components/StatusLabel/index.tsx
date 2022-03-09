/* eslint-disable react/prop-types */
// STYLES
import './StatusLabel.scss';

// TYPES
type Props = {
  label?: string;
  color: string;
  className?: string;
  [x: string]: any;
};

const StatusLabel: React.FC<Props> = ({
  label,
  color,
  className,
  children,
  ...rest
}) => {
  const statusLabel = (
    <div
      className={`status-label--wrapper ${color} ${className} ${
        typeof rest.onClick === 'function' ? 'clickable' : ''
      }`}
      {...rest}
    >
      {children}
    </div>
  );

  if (label) {
    return (
      <div className='status-label--outer'>
        <span className='status-label--label'>{label}</span>
        {statusLabel}
      </div>
    );
  }
  return statusLabel;
};

export default StatusLabel;
