import createDataContext from './createDataContext';
import { getFirst, updateDoc } from '../api/firebase';
import GLOBALS from '../Globals';

const consumerGroupReducer = (state, action) => {
  switch (action.type) {
    case 'fetch_group':
      return { loading: false, consumerGroup: action.payload };
    case 'update_group':
      return { ...state, loading: false };
    case 'loading':
      return { ...state, loading: true };
    default:
      return state;
  }
};

const getConsumerGroupName = (dispatch) => async () => {
  console.log('Getting consumer group name...');
  dispatch({ type: 'loading' });

  const group = await getFirst(GLOBALS.COLLECTION.GROUPS);

  dispatch({ type: 'fetch_group', payload: null });
  return group.name;
};

const fetchConsumerGroup = (dispatch) => async () => {
  console.log('Fetching consumer group...');
  dispatch({ type: 'loading' });

  const group = await getFirst(GLOBALS.COLLECTION.GROUPS);

  dispatch({ type: 'fetch_group', payload: group });
};

const updateConsumerGroup = (dispatch) => async (consumerGroup) => {
  dispatch({ type: 'loading' });

  console.log('Updating group: ' + consumerGroup.id);

  updateDoc(GLOBALS.COLLECTION.GROUPS, consumerGroup.id, consumerGroup).then(
    () => {
      dispatch({ type: 'update_group' });
    }
  );
};

export const { Provider, Context } = createDataContext(
  consumerGroupReducer,
  {
    getConsumerGroupName,
    fetchConsumerGroup,
    updateConsumerGroup,
  },
  { consumerGroup: null, loading: false }
);
