import { Form, Radio } from 'antd';
import { useFilters } from 'Components/SSP/Utils/hooks';

const IncludeSubmission = () => {
  const { inclusion, patchInclusion } = useFilters();

  const onChange = (stringBoolean: string) => {
    if (stringBoolean === 'true') {
      patchInclusion({ fullSubmission: true });
    } else {
      patchInclusion({ fullSubmission: false });
    }
  };

  return (
    <Form.Item label='Include full submission on match'>
      <Radio.Group
        value={inclusion.fullSubmission?.toString() || 'false'}
        onChange={(e) => onChange(e.target.value)}
      >
        <Radio key='true' value='true'>
          Yes
        </Radio>
        <Radio key='false' value='false'>
          No
        </Radio>
      </Radio.Group>
    </Form.Item>
  );
};

export default IncludeSubmission;
