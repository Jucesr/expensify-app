import React from 'react';
import {Link} from 'react-router-dom';
import {startLogout} from '../actions/auth';
import {connect} from 'react-redux';

export const Header = ({startLogout, photoURL, displayName}) => (
  <header className="header">
    <div className="content-container">
      <div className="header__content">
        <Link className="header__title" to="/dashboard" ><h1>Expensify</h1></Link>
        <div className="header-user">
          <div><img src={`${photoURL}?sz=50`}></img></div>
          <span className="header-user__info">
            <span className="header-user__displayname">{displayName}</span>
            <button className="button button-link" onClick={startLogout}>Log out</button>
          </span>
        </div>
      </div>
    </div>
  </header>
);

const mapDispatchToProps = (dispatch) => ({
  startLogout: () => dispatch(startLogout())
});

const mapStateToProps = (state) => ({
  photoURL: state.auth.photoURL,
  displayName: state.auth.displayName
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
