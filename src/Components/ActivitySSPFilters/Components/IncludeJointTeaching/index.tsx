import { Form, Radio } from "antd"
import { useFilters } from "Components/SSP/Utils/hooks";

// TYPES
import { EFilterInclusions } from "Types/SSP.type";

const CJointTeachingOpts = [
  { value: EFilterInclusions.INCLUDE, label: 'Include' },
  { value: EFilterInclusions.EXCLUDE, label: 'Exclude' },
  { value: EFilterInclusions.ONLY, label: 'Only' },
];

const IncludeJointTeaching = () => {
  const { inclusion, patchInclusion } = useFilters();

  return (
    <Form.Item label='Include joint teaching activities'>
      <Radio.Group value={inclusion.jointTeaching || EFilterInclusions.EXCLUDE} onChange={(e) => patchInclusion({ jointTeaching: e.target.value })}>
        {CJointTeachingOpts.map((el) => (
          <Radio key={el.value} value={el.value}>
            {el.label}
          </Radio>
        ))}
      </Radio.Group>
    </Form.Item>
  );
};

export default IncludeJointTeaching;