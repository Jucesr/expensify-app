import React from 'react';
import CardForm from './CardForm';
import { connect } from 'react-redux';
import { addCard } from '../../actions/cards';

export class AddCardPage extends React.Component {
  onSubmit = (card) => {
    this.props.addCard(card);
    this.props.history.push('/cards');
  };

  render() {
    const { dictionary } = this.props;
    return (
      <div>
        <div className="page-header">
          <div className="content-container">
            <h1 className="page-header__title">Agregar tarjeta</h1>
          </div>
        </div>
        <div className="content-container">
          <CardForm
            onSubmit={this.onSubmit}
          />
        </div>
      </div>
    );
  };
}

const mapDispatchToProps = (dispatch) => ({
   addCard: (income) => dispatch(addCard(income))
});

const mapStateToProps = (state) => ({
  dictionary: state.lang.dictionary
});

export default connect(mapStateToProps, mapDispatchToProps)(AddCardPage);
