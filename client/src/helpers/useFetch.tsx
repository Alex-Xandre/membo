/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from '@/stores/AuthContext';
import { useEffect } from 'react';

type GetDataFn = () => Promise<any>;

export const useFetchAndDispatch = (getDataFn: GetDataFn, actionType: string) => {
  const { dispatch } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDataFn();

        dispatch({ type: actionType, payload: data });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [getDataFn, actionType, dispatch]);
};
