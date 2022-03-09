import { Modal, Table } from 'antd';
import { useSelector } from 'react-redux';

// COMPONENTS
import DateTime from '../Common/DateTime';
import OwnerCol from '../TableColumns/Components/OwnerCol';
import ObjectScopeCol from '../TableColumns/Components/ObjectScopeCol';

// REDUX
import { selectFormById } from 'Redux/Forms/forms.selectors';

// TYPES
import { TForm } from 'Types/Form.type';
import { useMemo } from 'react';

type Props = {
  formId: string;
  isVisible: boolean;
  onHide: () => void;
};

type TFormFieldInfoRow = { key: string; field: string; value: any };

const generateFormInfoData = (form: TForm | undefined) => {
  if (!form) return [];
  const formFieldMapping = [
    {
      key: 'name',
      label: 'Name',
      formatValueFn: (value) => value,
    },
    {
      key: 'description',
      label: 'Description',
      formatValueFn: (value) => value,
    },
    {
      key: 'ownerId',
      label: 'By',
      formatValueFn: (value) => <OwnerCol ownerId={value} />,
    },
    {
      key: 'createdAt',
      label: 'Created',
      formatValueFn: (value) => <DateTime value={value} />,
    },
    {
      key: 'updatedAt',
      label: 'Updated',
      formatValueFn: (value) => <DateTime value={value} />,
    },
    {
      key: 'dueDate',
      label: 'Due',
      formatValueFn: (value) => <DateTime value={value} />,
    },
    {
      key: 'allowLateResponses',
      label: 'Allow late responses',
      formatValueFn: (value) => (value ? 'Yes' : 'No'),
    },
    {
      key: 'formPeriod',
      label: 'Form period',
      formatValueFn: (value) => (
        <DateTime value={[value.startDate, value.endDate]} />
      ),
    },
    {
      key: 'objectScope',
      label: 'Primary object',
      formatValueFn: (value) => <ObjectScopeCol objectScope={value} />,
    },
    {
      key: 'reservationMode',
      label: 'Reservation mode',
      formatValueFn: (value) => value,
    },
    {
      key: 'allowLinkSharing',
      label: 'Public link',
      formatValueFn: (value) => (value ? 'Yes' : 'No'),
    },
  ];
  const mapping: TFormFieldInfoRow[] = formFieldMapping
    .map(({ key, label, formatValueFn }) => ({
      key,
      field: label,
      value: formatValueFn(form[key]),
    }))
    .filter((row) => row.value && row.value != null);

  return mapping;
};

const FormInfoModal = ({ formId, isVisible, onHide }: Props) => {
  const form = useSelector(selectFormById(formId));

  const datasource = useMemo(() => generateFormInfoData(form), [form]);

  return (
    <Modal
      title={form?.name || 'Unknown form'}
      visible={isVisible}
      onCancel={() => onHide()}
      cancelButtonProps={{ hidden: true }}
      okButtonProps={{ hidden: true }}
      footer={null}
    >
      <Table dataSource={datasource} pagination={false} showHeader={false}>
        <Table.Column
          title='Field'
          dataIndex='field'
          key='field'
          width='200px'
          render={(field) => <b>{field}:</b>}
        />
        <Table.Column title='Value' dataIndex='value' key='value' />
      </Table>
    </Modal>
  );
};

export default FormInfoModal;
