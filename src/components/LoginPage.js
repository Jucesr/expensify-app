import React from 'react';
import {connect} from 'react-redux';
import {startLogin} from '../actions/auth';
import {setLanguage} from '../actions/lang';

export class LoginPage extends React.Component{

  changeLanguage = (e) => {
    const lan = e.target.value;
    this.props.setLanguage(lan);
  };

  render(){
    const {locale, dictionary} = this.props;
    return(
      <div className="box-layout">
        <div className="box-layout__box">
          <h1 className="box-layout__title">Expensify</h1>
          <p>{dictionary.loginMessage}</p>
          <button className="button" onClick={this.props.startLogin}>{dictionary.loginButton}</button>
          <select className="select" value={locale} onChange={this.changeLanguage}>
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </div>
      </div>
    )
  };
}

const mapDispatchToProps = (dispatch) => ({
  startLogin: () => dispatch(startLogin()),
  setLanguage: (language) => dispatch(setLanguage(language))
});

const mapStateToProps = (state) => ({
  locale: state.lang.locale,
  dictionary: state.lang.dictionary
});

export default connect(mapStateToProps, mapDispatchToProps)( LoginPage);
