import noticeReducer, {
  increment,
  decrement,
  incrementByAmount,
} from './suggestionsSlice';

describe('counter reducer', () => {
  const initialState = {
    value: 3,
    status: 'idle',
  };
  it('should handle initial state', () => {
    expect(noticeReducer(undefined, { type: 'unknown' })).toEqual({
      value: 0,
      status: 'idle',
    });
  });

  it('should handle increment', () => {
    const actual = noticeReducer(initialState, increment());
    expect(actual.value).toEqual(4);
  });

  it('should handle decrement', () => {
    const actual = noticeReducer(initialState, decrement());
    expect(actual.value).toEqual(2);
  });

  it('should handle incrementByAmount', () => {
    const actual = noticeReducer(initialState, incrementByAmount(2));
    expect(actual.value).toEqual(5);
  });
});
