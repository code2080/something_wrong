import { Col, Row, Select } from 'antd';
import { CascaderValueType } from 'antd/lib/cascader';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

// REDUX
import { selectMultipleExtIdLabels } from 'Redux/TE/te.selectors';

// COMPONENTS
import OperatorRenderer from './Parameters/OperatorRenderer';
import CascaderWithTooltip from 'Components/CascaderWithTooltip/CascaderWithTooltip';

// STYLES
import './index.scss';

// TYPES
import { TConstraintInstance } from 'Types/ConstraintProfile.type';

type ParameterType = {
  firstParam: CascaderValueType | undefined;
  lastParam: CascaderValueType | undefined;
};

type Props = {
  paramFields: any;
  paramFormElements: any;
  availableOperators: string[];
  activityDesignObj: any;
  oldParameters: ParameterType | undefined;
  operator: string;
  onUpdate: (
    prop: keyof TConstraintInstance,
    value: ParameterType[] | string,
  ) => void;
};

const transformParameters = (
  oldParameters: ParameterType | undefined,
  key: string,
): CascaderValueType | undefined => {
  return Array.isArray(oldParameters)
    ? oldParameters.flatMap((param) => param?.[key])
    : oldParameters?.[key];
};

const ParameterCascader = ({
  paramFields,
  availableOperators,
  activityDesignObj,
  paramFormElements,
  oldParameters,
  operator,
  onUpdate,
}: Props) => {
  const labels = useSelector(selectMultipleExtIdLabels)(
    Object.keys(activityDesignObj).map((extId) => ({
      field: 'types',
      extId,
    })),
  );

  const [parameters, setParameters] = useState<{
    firstParam?: CascaderValueType;
    lastParam?: CascaderValueType;
  }>({});

  useEffect(() => {
    setParameters({
      firstParam: transformParameters(oldParameters, 'firstParam'),
      lastParam: transformParameters(oldParameters, 'lastParam'),
    });
  }, [oldParameters]);

  const fieldOptions = activityDesignObj
    ? [
        ...Object.keys(activityDesignObj).map((objField) => ({
          value: objField,
          label: labels[objField],
          children: Object.entries(
            paramFields[objField] ?? { [objField]: objField },
          ).map(([value, label]) => ({
            value,
            label,
          })),
        })),
      ]
    : [];
  const MissingOptionsMessage = 'Missing Activity Design';

  const options = _.isEmpty(activityDesignObj)
    ? []
    : [
        _.isEmpty(paramFormElements)
          ? {}
          : {
              value: 'Form',
              label: 'Form',
              children: paramFormElements,
            },
        {
          value: 'Objects',
          label: 'Objects',
          children: fieldOptions,
        },
      ];

  return (
    <div className='constraint-instance-parameter-cascader--wrapper'>
      <Row gutter={8}>
        <Col span={9}>Element</Col>
        <Col span={6}>Operator</Col>
        <Col span={9}>Field</Col>
      </Row>
      <Row gutter={8}>
        <Col span={9}>
          <CascaderWithTooltip
            notFoundContent={MissingOptionsMessage}
            placeholder='Element'
            value={
              parameters?.firstParam && parameters?.firstParam[0]
                ? parameters.firstParam
                : undefined
            }
            options={options.filter(({ value }) => value === 'Form')}
            size='small'
            getPopupContainer={() =>
              document.getElementById('te-prefs-lib') as HTMLElement
            }
            onChange={(selected) => {
              setParameters({
                firstParam: selected,
                lastParam: parameters.lastParam,
              });
              onUpdate('parameters', [
                {
                  firstParam: selected,
                  lastParam: parameters.lastParam,
                },
              ]);
            }}
          />
        </Col>
        <Col span={6}>
          <Select
            value={OperatorRenderer(operator)}
            size='small'
            getPopupContainer={() =>
              document.getElementById('te-prefs-lib') as HTMLElement
            }
            onChange={(selected) => onUpdate('operator', selected)}
            style={{ width: '100%' }}
            options={availableOperators.map((o) => ({
              value: o,
              label: OperatorRenderer(o),
            }))}
          />
        </Col>
        <Col span={9}>
          <CascaderWithTooltip
            placeholder='Field'
            notFoundContent={MissingOptionsMessage}
            value={
              parameters?.lastParam && parameters?.lastParam[0]
                ? parameters.lastParam
                : undefined
            }
            options={options.filter(({ value }) => value === 'Objects')}
            size='small'
            getPopupContainer={() =>
              document.getElementById('te-prefs-lib') as HTMLElement
            }
            onChange={(selected) => {
              setParameters({
                firstParam: parameters.firstParam,
                lastParam: selected,
              });
              onUpdate('parameters', [
                {
                  firstParam: parameters.firstParam,
                  lastParam: selected,
                },
              ]);
            }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default ParameterCascader;
