import { Form, Radio } from "antd"
import { useFilters } from "Components/SSP/Utils/hooks";

// TYPES
import { CFilterTypeArr } from "Types/SSP.type";

const MatchType = () => {
  const { matchType, setMatchType } = useFilters();
  
  return (
    <Form.Item label='Match criteria'>
      <Radio.Group value={matchType} onChange={(e) => setMatchType(e.target.value)}>
        {CFilterTypeArr.map((opt) => (
          <Radio key={opt.value} value={opt.value}>
            {opt.label}
          </Radio>
        ))}
      </Radio.Group>
    </Form.Item>
  );
};

export default MatchType;