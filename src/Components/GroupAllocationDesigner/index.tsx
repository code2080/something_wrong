import { Button, Select, Modal, ModalProps } from 'antd';
import { useMemo, useState } from 'react';

import './GroupAllocationDesigner.scss';

interface Props extends ModalProps {
  selectableTypes: any[];
  onAllocateGroups(allocations: any): void;
  activityDesign: any;
}

type AllocationSectionProps = {
  selectableTypes: any[];
  selectedType: string | undefined;
  selectedGroupType: string | undefined;
  onTypeChanged(newType: string): void;
  onGroupTypeChanged(newType: string): void;
  activityDesign: any;
};

const AllocationSection = ({
  selectableTypes,
  selectedType,
  selectedGroupType,
  onTypeChanged,
  onGroupTypeChanged,
  activityDesign,
}: AllocationSectionProps) => {
  const selectableGroupTypes = useMemo(() => {
    const activityDesignObjects = Object.keys(activityDesign.objects);
    return selectableTypes.filter(
      (field) =>
        field.extid !== selectedType &&
        activityDesignObjects.includes(field.extid),
    );
  }, [activityDesign, selectableTypes, selectedType]);

  return (
    <div className='group-allocation-section--wrapper'>
      <div>
        Select type to allocate:{' '}
        <Select
          showSearch
          value={selectedType}
          onChange={onTypeChanged}
          style={{ width: '100%' }}
        >
          {selectableTypes
            .filter(
              ({ extid }) =>
                !Object.keys(activityDesign.objects || {}).includes(extid),
            )
            .map((type) => (
              <Select.Option key={type.extid} value={type.extid}>
                {type.name}
              </Select.Option>
            ))}
        </Select>
      </div>
      <span>Allocate based on: </span>
      <div style={{ display: 'flex' }}>
        <span style={{ marginRight: 20 }}>Relation to:{'     '}</span>
        <Select
          value={selectedGroupType}
          onChange={onGroupTypeChanged}
          style={{ flex: 1 }}
        >
          {selectableGroupTypes.map((item) => (
            <Select.Option key={item.id} value={item.extid}>
              {item.name}
            </Select.Option>
          ))}
        </Select>
      </div>
    </div>
  );
};

type SectionData = {
  selectedType: string | undefined;
  selectedGroupType: string | undefined;
};

const createSectionData = (): SectionData => {
  return {
    selectedType: undefined,
    selectedGroupType: undefined,
  };
};

const GroupAllocationDesigner = ({
  selectableTypes,
  onAllocateGroups,
  visible,
  onCancel,
  activityDesign,
}: Props) => {
  const [allocationSections, setAllocationSections] = useState([
    createSectionData(),
  ]);

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      title='Object allocation'
      okText='Allocate'
      footer={
        <div style={{ width: '80%', margin: 'auto' }}>
          <Button
            type='primary'
            onClick={() => onAllocateGroups(allocationSections)}
            block
          >
            Allocate
          </Button>
        </div>
      }
    >
      <div className='group-allocation-designer--wrapper'>
        {allocationSections.map((section, sectionIdx) => (
          <>
            <AllocationSection
              key={sectionIdx}
              selectableTypes={selectableTypes}
              selectedType={section.selectedType}
              selectedGroupType={section.selectedGroupType}
              onTypeChanged={(newType) => {
                section.selectedType = newType;
                setAllocationSections([...allocationSections]);
              }}
              onGroupTypeChanged={(newGroupType) => {
                section.selectedGroupType = newGroupType;
                setAllocationSections([...allocationSections]);
              }}
              activityDesign={activityDesign}
            />
            {/* <Divider type='horizontal' /> */}
          </>
        ))}
        {/* <Button
          ghost
          type="primary"
          onClick={() => {
            const newSections = [...allocationSections, createSectionData()];
            setAllocationSections(newSections);
          }}
          disabled={false}
          size="small"
        >
          <PlusSquareOutlined />Add allocation
        </Button> */}
      </div>
    </Modal>
  );
};

export default GroupAllocationDesigner;
