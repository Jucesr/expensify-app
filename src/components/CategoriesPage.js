import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import { addCategory, editCategory, removeCategory } from '../actions/categories';
import { Button, Modal } from 'semantic-ui-react'

import CategoryForm from "./CategoryForm";

const CategoriesPage = (props) => {
   const { dictionary, categories } = props;

   const [modal, setModal] = useState(false)
   const [item, setItem] = useState(null)

   const d = dictionary.categoryPage;

   return (
      <div className="content-container">
         <div style={{margin: '1rem 0'}}>
            <Button
               color="green"
               className="button button-red"
               onClick={() => {
                  setModal(true)
               }}
            >
               {dictionary.categoryPage.addCategoryButton}
            </Button>
         </div>
         <div>
            <div className="list-header">
               <div >{d.tableHeaderCode}</div>
               <div >{d.tableHeaderSpanish}</div>
               <div >{d.tableHeaderEnglish}</div>
            </div>
            <div className="list-body">
               <div className="list-item-message" style={{
                  display: 'flex',
                  flexDirection: 'column'
               }}>
                  {categories.map(c => <div
                     className="list-body-item"
                     key={c.code}
                     onClick={() => {
                        setModal(true)
                        setItem(c)
                     }}
                  >
                     <div>
                        {c.code}
                     </div>
                     <div>
                        {c.spanishDescription}
                     </div>
                     <div>
                        {c.englishDescription}
                     </div>
                  </div>)}
               </div>

            </div>
         </div>
         <Modal
            open={modal}
            onClose={() => setModal(false)}
         >
            <Modal.Header>Categoria</Modal.Header>
            <Modal.Content image>
               <Modal.Description>
                  <CategoryForm
                     dictionary={dictionary}
                     item={item}
                     onSubmit={(values) => {
                        if(item){
                           props.editCategory(item.id, values)
                        }else{
                           props.addCategory(values)

                        }
                        setItem(null)
                        setModal(false)
                     }}
                     onDelete={() => {
                        props.removeCategory(item.id)
                        setItem(null)
                        setModal(false)
                     }}
                  />
               </Modal.Description>
            </Modal.Content>
         </Modal>
      </div>
   )
}


const mapDispatchToProps = (dispatch) => ({
   addCategory: (item) => dispatch(addCategory(item)),
   editCategory: (id, item) => dispatch(editCategory(id, item)),
   removeCategory: (id) => dispatch(removeCategory(id)),
});

const mapStateToProps = (state) => ({
   dictionary: state.lang.dictionary,
   categories: state.categories,

});

export default connect(mapStateToProps, mapDispatchToProps)(CategoriesPage);