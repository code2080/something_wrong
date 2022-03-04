import { Space, Button } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

// TYPES
type Props = {
  formName: string;
  onToggleModalState: () => void;
};

const FormDetailBreadcrumb = ({ formName, onToggleModalState }: Props) => {
  return (
    <Space direction="horizontal" size="small" align="center">
      {formName}
      <Button type="link" icon={<InfoCircleOutlined />} onClick={() => onToggleModalState()} size="small" />
    </Space>
  );
};

export default FormDetailBreadcrumb;