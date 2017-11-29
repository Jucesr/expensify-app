import {login, logout} from '../../actions/auth';

test('should set up LOGIN action object', () => {
  const uid = 123;
  const action = login(id);

  expect(action).toEqual({
    type: 'LOGIN',
    uid
  });
});

test('should set up LOGOUT action object', () => {
  const action = logout();

  expect(action).toEqual({
    type: 'LOGOUT'
  });
});
