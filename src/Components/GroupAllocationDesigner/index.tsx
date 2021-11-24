import { Button, Divider, Select } from 'antd';
import { useState } from 'react';

type Props = {
  selectableTypes: string[];
  selectableGroupTypes: string[];
  onAllocateGroups(allocations: any): void;
};

type AllocationSectionProps = {
  selectableTypes: string[];
  selectableGroupTypes: string[];
  selectedType: string | undefined;
  selectedGroupType: string | undefined;
  onTypeChanged(newType: string): void;
  onGroupTypeChanged(newType: string): void;
};

const AllocationSection = ({
  selectableTypes,
  selectableGroupTypes,
  selectedType,
  selectedGroupType,
  onTypeChanged,
  onGroupTypeChanged,
}: AllocationSectionProps) => {
  return (
    <div className='group-allocation-section--wrapper'>
      Type to allocate:{' '}
      <Select value={selectedType} onChange={onTypeChanged}>
        {selectableTypes.map((type) => (
          <Select.Option key={type} value={type}>
            {type}
          </Select.Option>
        ))}
      </Select>
      Allocate based on:{' '}
      <Select value={selectedGroupType} onChange={onGroupTypeChanged}>
        {selectableGroupTypes.map((type) => (
          <Select.Option key={type} value={type}>
            {type}
          </Select.Option>
        ))}
      </Select>
    </div>
  );
};

const SectionData = () => {
  return {
    selectedType: undefined,
    selectedGroupType: undefined,
  };
};

const GroupAllocationDesigner = ({
  selectableTypes,
  selectableGroupTypes,
  onAllocateGroups,
}: Props) => {
  const [allocationSections, setAllocationSections] = useState([SectionData()]);
  return (
    <div className='group-allocation-designer--wrapper'>
      Object allocation
      <Divider type='horizontal' />
      {allocationSections.map((section) => (
        <AllocationSection
          selectableTypes={selectableTypes}
          selectableGroupTypes={selectableGroupTypes}
          selectedType={section.selectedType}
          selectedGroupType={section.selectedGroupType}
          onTypeChanged={(newType) => {
            console.log(newType);
            section.selectedType = newType;
          }}
          onGroupTypeChanged={(newGroupType) => {
            console.log(newGroupType);
            section.selectedGroupType = newGroupType;
          }}
        />
      ))}
      <Divider type='horizontal' />
      <Button
        size='large'
        onClick={() => {
          let newSections = [...allocationSections, SectionData()];
          setAllocationSections(newSections);
        }}
        disabled={false}
      >
        Add allocation
      </Button>
      <Button
        size='large'
        onClick={() => onAllocateGroups(allocationSections)}
        disabled={false}
      >
        Allocate
      </Button>
    </div>
  );
};

export default GroupAllocationDesigner;
