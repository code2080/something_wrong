import { ReactChild, useMemo, useCallback, Fragment } from 'react';
import { capitalize, isEmpty, pick, startCase } from 'lodash';
import moment from 'moment';

// COMPONENTS
import { CloseCircleOutlined } from '@ant-design/icons';
import { Divider } from 'antd';

// CONSTANTS
import { DATE_FORMAT } from '../../../Constants/common.constants';
import { NESTED_FIELDS } from './FilterModal.constants';
import FilterItemLabel from './FilterItemLabel';
interface Props {
  values: any;
  onClear: (field: string[]) => void;
  onDeselect: (field: string, itemsToDeselect: string[]) => void;
  getOptionLabel: (field: string, id?: string) => string;
}

const ValueDisplay = ({
  label,
  content,
}: {
  label: string | ReactChild;
  content: string | ReactChild;
}) => {
  return (
    <div className='filter-modal__value-display'>
      <b>{typeof label === 'string' ? capitalize(startCase(label)) : label}:</b>
      <div>{content}</div>
    </div>
  );
};

const FilterSummary = ({
  values,
  onClear,
  onDeselect,
  getOptionLabel,
}: Props) => {
  const dateDisplay = useMemo(() => {
    const [startDate, endDate] = values.date || [];
    if (!startDate && !endDate) return null;
    const dateDisplay = `${
      startDate ? moment(startDate).format(DATE_FORMAT) : '---'
    } ~ ${endDate ? moment(endDate).format(DATE_FORMAT) : '---'}`;
    return (
      <ValueDisplay
        label='Date interval'
        content={
          <div>
            {dateDisplay}
            <CloseCircleOutlined onClick={() => onClear(['date'])} />
          </div>
        }
      />
    );
  }, [onClear, values.date]);

  const timeDisplay = useMemo(() => {
    const [startTime, endTime] = values.time || [];
    if (!startTime && !endTime) return null;
    const timeDisplay = `${
      startTime ? moment(startTime).format('HH:mm') : '---'
    } ~ ${endTime ? moment(endTime).format('HH:mm') : '---'}`;
    return (
      <ValueDisplay
        label='Time interval'
        content={
          <div>
            {timeDisplay}
            <CloseCircleOutlined onClick={() => onClear(['time'])} />
          </div>
        }
      />
    );
  }, [onClear, values.time]);

  const otherFieldsDisplays = useMemo(() => {
    const fields = ['submitter', 'tag', 'primaryObject'];
    return fields
      .filter((key) => !isEmpty(values[key]))
      .map((key) => {
        return (
          <ValueDisplay
            key={key}
            label={<FilterItemLabel label={key} render={getOptionLabel} />}
            content={
              <ul>
                {values[key].map((item) => (
                  <li key={item}>
                    {getOptionLabel(key, item)}
                    <CloseCircleOutlined
                      onClick={() => onDeselect(key, [item])}
                    />
                  </li>
                ))}
              </ul>
            }
          />
        );
      });
  }, [getOptionLabel, onDeselect, values]);

  const generateObjectsDisplay = useCallback(
    (field) => {
      const fieldValues = pick(
        values,
        Object.keys(values).filter((key) => key.startsWith(`${field}.`)),
      );
      if (
        isEmpty(fieldValues) ||
        !Object.values(fieldValues).some((item) => !isEmpty(item))
      )
        return null;
      return (
        <Fragment key={field}>
          <Divider />
          <ValueDisplay
            label={capitalize(field)}
            content={
              <div>
                {Object.keys(fieldValues)
                  .filter((key) => !isEmpty(fieldValues[key]))
                  .map((key) => (
                    <ul key={key}>
                      <li>
                        <FilterItemLabel label={key} render={getOptionLabel} />
                        <ul>
                          {values[key]?.map((item) => (
                            <li key={item}>
                              {getOptionLabel(field, item)}
                              <CloseCircleOutlined
                                onClick={() => onDeselect(key, [item])}
                              />
                            </li>
                          ))}
                        </ul>
                      </li>
                    </ul>
                  ))}
              </div>
            }
          />
        </Fragment>
      );
    },
    [getOptionLabel, onDeselect, values],
  );

  return (
    <div className='filter-modal__column' id='filterSummary'>
      <div>
        <b>Selected filters</b>
      </div>
      <div className='filter-modal__box'>
        {dateDisplay}
        {timeDisplay}
        {otherFieldsDisplays}
        {NESTED_FIELDS.map((field) => generateObjectsDisplay(field))}
      </div>
    </div>
  );
};

export default FilterSummary;
