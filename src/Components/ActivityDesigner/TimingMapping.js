import { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Select, Tooltip } from 'antd';
import CascaderWithTooltip from 'Components/CascaderWithTooltip/CascaderWithTooltip';

// HELPERS
import { getElementsForTimingMapping } from '../../Redux/ActivityDesigner/activityDesigner.helpers';
import { determineSectionType } from '../../Utils/determineSectionType.helpers';

// CONSTANTS
import {
  activityTimeModes,
  activityTimeModeProps,
} from '../../Constants/activityTimeModes.constants';

// STYLES
import './Mapping.scss';
import { getElementTypeFromId } from '../../Utils/elements.helpers';
import { elementTypes } from '../../Constants/elementTypes.constants';
import { SECTION_CONNECTED } from '../../Constants/sectionTypes.constants';
import MultiRowParameter from './MultiRowParameter';

const TimingMapping = ({ onChange, formSections, mapping, disabled }) => {
  const timingMode = useMemo(
    () => _.get(mapping, 'timing.mode', null),
    [mapping],
  );

  const onSequenceModeTimingParameterUpdateValue = (idx, value) => {
    const currValue = _.get(mapping, 'timing.dateRanges', []);
    onChange('dateRanges', [
      ...currValue.slice(0, idx),
      value,
      ...currValue.slice(idx + 1),
    ]);
  };

  const onSequenceModeTimingParameterAdd = () => {
    const value = _.get(mapping, 'timing.dateRanges', []);
    onChange('dateRanges', [...value, undefined]);
  };

  const onSequenceModeTimingParameterDelete = (idx) => {
    const value = _.get(mapping, 'timing.dateRanges', []);
    if (!value || !value.length) return;
    onChange('dateRanges', [...value.slice(0, idx), ...value.slice(idx + 1)]);
  };
  const calendarSections = useMemo(() => {
    return getElementsForTimingMapping[timingMode](
      formSections.filter(
        (section) => determineSectionType(section) === SECTION_CONNECTED,
      ),
      mapping,
    );
  }, [formSections, mapping, timingMode]);

  const timingIsDisabled = useCallback(
    (mode) => {
      // TODO: Add more conditions if there is DateTime element in future
      return !mapping?.timing?.hasTiming && mode !== activityTimeModes.SEQUENCE;
    },
    [mapping],
  );

  const sections = useMemo(() => {
    return getElementsForTimingMapping[timingMode](formSections, mapping);
  }, [formSections, mapping, timingMode]);

  const filterOnElementTypes = ({ types = [], sections }) => {
    if (_.isEmpty(types) || _.isEmpty(sections)) return sections;
    return sections
      .reduce(
        (filteredSections, section) => [
          ...filteredSections,
          {
            ...section,
            children: section.children.filter(({ elementId }) => {
              const elementType = getElementTypeFromId(elementId);
              return types.includes(elementType);
            }),
          },
        ],
        [],
      )
      .filter((s) => !_.isEmpty(s.children));
  };

  return (
    <>
      <div className='timing-mapping__row--wrapper'>
        <div className='label'>
          Mode
          <span className='is-required'>(required)</span>
        </div>
        <Select
          value={_.get(mapping, 'timing.mode', null)}
          onChange={(val) => onChange('mode', val)}
          size='small'
          getPopupContainer={() => document.getElementById('te-prefs-lib')}
          disabled={disabled}
        >
          {Object.keys(activityTimeModeProps).map((mode) => {
            const isDisabled = timingIsDisabled(mode);
            return (
              <Select.Option disabled={isDisabled} key={mode} value={mode}>
                <Tooltip
                  title={
                    isDisabled
                      ? 'No calendar section available on the form'
                      : null
                  }
                >
                  {activityTimeModeProps[mode].label}
                </Tooltip>
              </Select.Option>
            );
          })}
        </Select>
      </div>
      {timingMode === activityTimeModes.EXACT && (
        <>
          <div className='timing-mapping__row--wrapper'>
            <div className='label'>
              Start time
              <span className='is-required'>(required)</span>
            </div>
            <CascaderWithTooltip
              options={calendarSections}
              value={_.get(mapping, 'timing.startTime', null)}
              onChange={(val) => onChange('startTime', val)}
              placeholder='Select an element'
              getPopupContainer={() => document.getElementById('te-prefs-lib')}
              size='small'
              disabled={disabled}
            />
          </div>
          <div className='timing-mapping__row--wrapper'>
            <div className='label'>
              End time
              <span className='is-required'>(required)</span>
            </div>
            <CascaderWithTooltip
              options={calendarSections}
              value={_.get(mapping, 'timing.endTime', null)}
              onChange={(val) => onChange('endTime', val)}
              placeholder='Select an element'
              getPopupContainer={() => document.getElementById('te-prefs-lib')}
              size='small'
              disabled={disabled}
            />
          </div>
        </>
      )}
      {timingMode === activityTimeModes.TIMESLOTS && (
        <>
          <div className='timing-mapping__row--wrapper'>
            <div className='label'>
              Start on or after:
              <span className='is-required'>(required)</span>
            </div>
            <CascaderWithTooltip
              options={calendarSections}
              value={_.get(mapping, 'timing.startTime', null)}
              onChange={(val) => onChange('startTime', val)}
              placeholder='Select an element'
              getPopupContainer={() => document.getElementById('te-prefs-lib')}
              size='small'
              disabled={disabled}
            />
          </div>
          <div className='timing-mapping__row--wrapper'>
            <div className='label'>
              End on or before:
              <span className='is-required'>(required)</span>
            </div>
            <CascaderWithTooltip
              options={calendarSections}
              value={_.get(mapping, 'timing.endTime', null)}
              onChange={(val) => onChange('endTime', val)}
              placeholder='Select an element'
              getPopupContainer={() => document.getElementById('te-prefs-lib')}
              size='small'
              disabled={disabled}
            />
          </div>
          <div className='timing-mapping__row--wrapper'>
            <div className='label'>
              Length
              <span className='is-required'>(required)</span>
            </div>
            <CascaderWithTooltip
              options={sections}
              value={_.get(mapping, 'timing.length', null)}
              onChange={(val) => onChange('length', val)}
              placeholder='Select an element'
              getPopupContainer={() => document.getElementById('te-prefs-lib')}
              size='small'
              disabled={disabled}
            />
          </div>
        </>
      )}
      {timingMode === activityTimeModes.SEQUENCE && (
        <>
          <div className='timing-mapping__row--wrapper'>
            <div className='label'>
              Length
              <span className='is-required'>(required)</span>
            </div>
            <CascaderWithTooltip
              options={sections}
              value={_.get(mapping, 'timing.length', null)}
              onChange={(val) => onChange('length', val)}
              placeholder='Select an element'
              getPopupContainer={() => document.getElementById('te-prefs-lib')}
              size='small'
              disabled={disabled}
            />
          </div>
          <div className='timing-mapping__row--wrapper'>
            <div className='label'>Padding</div>
            <CascaderWithTooltip
              options={filterOnElementTypes({
                types: [elementTypes.ELEMENT_TYPE_PADDING],
                sections,
              })}
              value={_.get(mapping, 'timing.padding', null)}
              onChange={(val) => onChange('padding', val)}
              placeholder='Select an element'
              getPopupContainer={() => document.getElementById('te-prefs-lib')}
              size='small'
              disabled={disabled}
            />
          </div>
          <div className='timing-mapping__row--wrapper'>
            <div className='label'>Weekday</div>
            <CascaderWithTooltip
              options={filterOnElementTypes({
                types: [elementTypes.ELEMENT_TYPE_DAY_PICKER],
                sections,
              })}
              value={_.get(mapping, 'timing.weekday', null)}
              onChange={(val) => onChange('weekday', val)}
              placeholder='Select an element'
              getPopupContainer={() => document.getElementById('te-prefs-lib')}
              size='small'
              disabled={disabled}
            />
          </div>
          <div className='timing-mapping__row--wrapper'>
            <div className='label'>Exact time</div>
            <CascaderWithTooltip
              options={filterOnElementTypes({
                types: [elementTypes.ELEMENT_TYPE_INPUT_TIME],
                sections,
              })}
              value={_.get(mapping, 'timing.time', null)}
              onChange={(val) => onChange('time', val)}
              placeholder='Select an element'
              getPopupContainer={() => document.getElementById('te-prefs-lib')}
              size='small'
              disabled={disabled}
            />
          </div>
          <MultiRowParameter
            values={_.get(mapping, 'timing.dateRanges', [])}
            options={filterOnElementTypes({
              types: [
                elementTypes.ELEMENT_TYPE_WEEK_PICKER,
                elementTypes.ELEMENT_TYPE_INPUT_DATE_RANGE,
                elementTypes.ELEMENT_TYPE_INPUT_DATE,
              ],
              sections,
            })}
            onUpdateValue={onSequenceModeTimingParameterUpdateValue}
            onAddParameter={onSequenceModeTimingParameterAdd}
            onRemoveParameter={onSequenceModeTimingParameterDelete}
            disabled={disabled}
          />
        </>
      )}
    </>
  );
};

TimingMapping.propTypes = {
  onChange: PropTypes.func.isRequired,
  formSections: PropTypes.array.isRequired,
  mapping: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
};

TimingMapping.defaultProps = {
  disabled: false,
};

export default TimingMapping;
