import { isEqual } from 'lodash';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchActivitiesForForm } from 'Redux/Activities/activities.actions';
import { usePrevious } from './usePrevious';

export const useActivitiesWatcher = ({ formId, filters, sorters, origin }) => {
  const dispatch = useDispatch();
  const prevFilters = usePrevious(filters);
  useEffect(() => {
    if (!isEqual(prevFilters, filters)) {
      console.log('DO FETCHING');
      dispatch(fetchActivitiesForForm(formId, filters, sorters, origin));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevFilters, filters, origin]);
};
