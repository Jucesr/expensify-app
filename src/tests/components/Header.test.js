import React from 'react';
import {shallow} from 'enzyme';
import {Header} from '../../components/Header';


test('should render Header', () => {
  const wrapper = shallow(
    <Header
      startLogout = {() => {}}
      setLanguage = {() => {}}
      photoURL = "http"
      displayName = "Julio"
      tran = {{logoutButton: {es: 'iniciar', en: 'login'}}}
      locale = "es"
    />);
  expect(wrapper).toMatchSnapshot();
});

test('should call startLogout', () => {
  const startLogout = jest.fn();
  const wrapper = shallow(<Header startLogout = {startLogout}/>);
  wrapper.find('button').simulate('click');
  expect(startLogout).toHaveBeenCalled();
});
