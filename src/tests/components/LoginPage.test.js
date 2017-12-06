import React from 'react';
import {shallow} from 'enzyme';
import {LoginPage} from '../../components/LoginPage';
import en from '../../locale/en';

test('should render LoginPage', () => {
  const wrapper = shallow(
    <LoginPage
      startLogin = {() => {}}
      locale = "en"
      dictionary = {en}
    />);
  expect(wrapper).toMatchSnapshot();
});

test('should call startLogin', () => {
  const startLogin = jest.fn();
  const wrapper = shallow(
    <LoginPage
      startLogin = {startLogin}
      locale = "en"
      dictionary = {en}
    />);
  wrapper.find('button').simulate('click');
  expect(startLogin).toHaveBeenCalled();
});
