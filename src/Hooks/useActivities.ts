import { isEqual } from 'lodash';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchActivitiesForForm } from 'Redux/Activities/activities.actions';
import { usePrevious } from './usePrevious';

export const useActivitiesWatcher = ({
  formId,
  filters,
  origin /* sorters */,
}) => {
  const dispatch = useDispatch();
  const prevFilters = usePrevious(filters);
  useEffect(() => {
    if (!isEqual(prevFilters, filters))
      dispatch(fetchActivitiesForForm(formId, filters, undefined, origin));
    console.log('DO FETCHING');
  }, [prevFilters, filters]);
};
