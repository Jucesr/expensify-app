import React, { useState, useEffect } from 'react'
import moment from 'moment';

const CategoryForm = (props) => {
  const { item, dictionary } = props;
  const [code, setCode] = useState(item ? (item.code ? item.code : '') : '')
  const [spanishDescription, setSpanishDescription] = useState(item ? (item.spanishDescription ? item.spanishDescription : '') : '')
  const [englishDescription, setEnglishDescription] = useState(item ? (item.englishDescription ? item.englishDescription : '') : '')
  const [error, setError] = useState('')

  const editMode = item != null

  const onSubmit = (e) => {
    e.preventDefault();
    if (code.length === 0 || spanishDescription.length === 0 || englishDescription.length === 0) {
      setError(dictionary.categoryForm.errorForm)
    } else {
      //Clear error
      setError('');
      props.onSubmit({
        code: code,
        spanishDescription,
        englishDescription,
        createdAt: moment().valueOf(),
      });
    }
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      {error.length > 0 && <p className="form__error">{error}</p>}

      <input
        className="text-input"
        type="text"
        placeholder={dictionary.categoryForm.codePlaceholder}
        autoFocus
        value={code}
        onChange={(e) => {
          const value = e.target.value;
          setCode(value)
        }}
      />
      <input
        className="text-input"
        type="text"
        placeholder={dictionary.categoryForm.spanishPlaceholder}
 
        value={spanishDescription}
        onChange={(e) => {
          const value = e.target.value;
          setSpanishDescription(value)
        }}
      />
      <input
        className="text-input"
        type="text"
        placeholder={dictionary.categoryForm.englishPlaceholder}
        value={englishDescription}
        onChange={(e) => {
          const value = e.target.value;
          setEnglishDescription(value)
        }}
      />
      <div>
        <button className="button">
          {dictionary.buttons.saveButton}
        </button>
        {editMode && <button className="button button-red" type="button" onClick={() => {
          props.onDelete()
        }}>
          {dictionary.buttons.removeButton}
        </button>}
      </div>
    </form>
  )
}

export default CategoryForm
