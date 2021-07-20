import React, { ReactChild, useMemo, useCallback } from 'react';
import { capitalize, isEmpty, keyBy, pick, startCase } from 'lodash';
import moment from 'moment';

// COMPONENTS
import { CloseCircleOutlined} from '@ant-design/icons';
import { Divider, Typography } from 'antd';

// CONSTANTS
import { NESTED_FIELDS } from './FilterModal.constants';
import { DATE_FORMAT } from 'Constants/common.constants';
interface Props {
  values: any;
  filterOptions: any;
  validationError: any;
  onClear: (field: string[]) => void;
  onDeselect: (field: string, itemsToDeselect: string[]) => void;
};

const ValueDisplay = ({ label, content }: {label: string, content: string | ReactChild}) => {
  return (
    <div className="filter-modal__value-display">
      <b>{capitalize(startCase(label))}:</b>
      <div>
        {content}
      </div>
    </div>
  );
};

const FilterSummary = ({ values, filterOptions, onClear, onDeselect, validationError }: Props) => {

  const dateDisplay = useMemo(() => {
    const { startDate, endDate } = values;
    if (!startDate && !endDate) return null;
    const dateDisplay = `${startDate ? moment(startDate).format(DATE_FORMAT) : '---'} ~ ${endDate ? moment(endDate).format(DATE_FORMAT) : '---'}`;
    return (
      <ValueDisplay
        label="Date interval"
        content={(
          <>
            <div>
              {dateDisplay}
              <CloseCircleOutlined onClick={() => onClear(['startDate', 'endDate'])} />
            </div>
            <Typography.Text type="danger">{validationError.startDate}</Typography.Text>
          </>
        )}
      />
    );
  }, [values, validationError]);

  const timeDisplay = useMemo(() => {
    const {startTime, endTime} = values;
    if (!startTime && !endTime) return null;
    const timeDisplay = `${startTime ? moment(startTime).format('HH:mm') : '---'} ~ ${endTime ? moment(endTime).format('HH:mm') : '---'}`;
    return (
      <ValueDisplay
        label="Time interval"
        content={(
          <>
            <div>
              {timeDisplay}
              <CloseCircleOutlined onClick={() => onClear(['startTime', 'endTime'])} />
            </div>
            <Typography.Text type="danger">{validationError.startTime}</Typography.Text>
          </>
        )}
      />
    );
  }, [values, validationError]);

  const otherFieldsDisplays = useMemo(() => {
    const fields = ['submitter', 'tag', 'primaryObject'];
    return fields
      .filter(key => !isEmpty(values[key]))
      .map(key => {
        const indexedOptions = keyBy((filterOptions[key] || {}), 'value');
        return (
          <ValueDisplay
            key={key}
            label={key}
            content={(
              <ul>
                {values[key].map(item => (
                  <li key={item}>
                    {indexedOptions[item]?.label || item}
                    <CloseCircleOutlined onClick={() => onDeselect(key, [item])} />
                  </li>
                ))}
              </ul>
            )}
          />
        );
      });
  }, [values, filterOptions]);

  const generateObjectsDisplay = useCallback((field) => {
    const fieldValues = pick(values, Object.keys(values).filter(key => key.startsWith(`${field}.`)));
    if (isEmpty(fieldValues) || !Object.values(fieldValues).some(item => !isEmpty(item))) return null;
    return (
      <>
        <Divider />
        <ValueDisplay label={capitalize(field)} content={(
          <div>
            {Object.keys(fieldValues)
              .filter(key =>! isEmpty(fieldValues[key]))
              .map(key => (
                <ul key={key}>
                  <li>
                    {key}
                    <ul>
                      {values[key]?.map(item => (
                        <li key={item}>
                          {item}
                          <CloseCircleOutlined onClick={() => onDeselect(key, [item])} />
                        </li>
                      ))}
                    </ul>
                  </li>
                </ul>
              ))}
          </div>
        )} />
      </>
    )
  }, [values]);
  
  return (
    <div className="filter-modal__column">
      <div>
        <b>Selected filters</b>
      </div>
      <div className="filter-modal__box">
        {dateDisplay}
        {timeDisplay}
        {otherFieldsDisplays}
        {NESTED_FIELDS.map(field => generateObjectsDisplay(field))}
      </div>
    </div>
  )
};

export default FilterSummary;
