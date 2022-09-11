import React from 'react';
import {Link} from 'react-router-dom';
import {startLogout} from '../actions/auth';
import {setLanguage} from '../actions/lang';
import {connect} from 'react-redux';

export const Header = ({startLogout, setLanguage,  photoURL, displayName, dictionary, locale}) => (
  <header className="header_wrapper">
    <div className="content-container">
      <div className="header__content">
        <Link className="header__title" to="/dashboard" ><h1>Expensify</h1></Link>
        <div className="header__user">
          <div className="header__language">
            <button className="button button-lang" onClick={() => {
              if(locale == 'en')
                setLanguage('es')
              else
                setLanguage('en');
            }}>{locale == 'es' ? 'ES' : 'EN'}</button>
          </div>

          <div style={{maxHeight: '50px'}}><img style={{height: '50px'}} src={`${photoURL}?sz=50`}></img></div>
          <span className="header__user__info">
            <span className="header__user__displayname">{displayName}</span>
            <button className="button button-link" onClick={startLogout}>{dictionary.logoutButton}</button>
          </span>
        </div>
      </div>
    </div>
  </header>
);

const mapDispatchToProps = (dispatch) => ({
  startLogout: () => dispatch(startLogout()),
  setLanguage: (language) => dispatch(setLanguage(language))
});

const mapStateToProps = (state) => ({
  photoURL: state.auth.photoURL,
  displayName: state.auth.displayName,
  locale: state.lang.locale,
  dictionary: state.lang.dictionary
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
