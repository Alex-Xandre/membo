import { useAuth } from '@/stores/AuthContext';
import { useEvent } from '@/stores/EventContext';
// import { useCourse } from '@/stores/CourseContext';

import { useEffect } from 'react';

type GetDataFn = () => Promise<any>;

export const useFetchAndDispatch = (getDataFn: GetDataFn, actionType: string) => {
  const { dispatch: authDispatch } = useAuth();
  const { dispatch: eventDispatch } = useEvent();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDataFn();

        // Dispatch to both contexts
        authDispatch({ type: actionType, payload: data });
        eventDispatch({ type: actionType, payload: data });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [getDataFn, actionType, authDispatch]);
};

// }, [getDataFn, actionType, authDispatch, coursesDispatch]);
