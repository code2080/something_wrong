import { Input } from 'antd';

// TYPES
type Props = {
  value: string;
  onChange: (value: string) => void;
};

const ObjectFieldParameter = ({ value, onChange }: Props) => {
  return (
    <Input
      size='small'
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default ObjectFieldParameter;
