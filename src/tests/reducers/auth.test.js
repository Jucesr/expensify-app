import authReducer from '../../reducers/auth';

test('should set default state', () => {
  const state = authReducer(undefined, {type: '@@INIT'});
  expect(state).toEqual({});
});

test('should dispatch LOGIN', () => {
  const uid = 123
  const action = {
    type: 'LOGIN',
    uid
  };

  const state = authReducer(undefined, action);

  expect(state).toEqual({uid});
});

test('should dispatch LOGOUT', () => {
  const action = {
    type: 'LOGOUT'
  };

  const state = authReducer(undefined, action);

  expect(state).toEqual({});
});
