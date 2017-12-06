import React from 'react';
import {shallow} from 'enzyme';
import {Header} from '../../components/Header';
import en from '../../locale/en';


test('should render Header', () => {
  const wrapper = shallow(
    <Header
      startLogout = {() => {}}
      setLanguage = {() => {}}
      photoURL = "http"
      displayName = "Julio"
      dictionary = {en}
      locale = "en"
    />);
  expect(wrapper).toMatchSnapshot();
});

test('should call startLogout', () => {
  const startLogout = jest.fn();
  const wrapper = shallow(
    <Header
      startLogout = {startLogout}
      setLanguage = {() => {}}
      photoURL = "http"
      displayName = "Julio"
      dictionary = {en}
      locale = "en"
    />);
  wrapper.find('button').at(1).simulate('click');
  expect(startLogout).toHaveBeenCalled();
});
