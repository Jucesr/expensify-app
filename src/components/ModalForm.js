import React, { useState } from 'react'
import { Field, Form, Formik } from "formik";
import Input from "../components/InputForm";
import { Button, Dimmer, Segment, Popup, Modal, Confirm, Loader } from "semantic-ui-react";
import PropTypes from 'prop-types'

const ModalForm = (props) => {
   const {
      fields,
      initialValues = {},
      onSubmitBottonText = "Guardar",
      onSubmitBottonColor = "green",
      title,
      open = false,
      onClose,
      shouldConfirm = false,
   } = props;
   const [confirm, setConfirm] = useState({
      open: false,
      onConfirm: undefined,
   })
   return (
      <React.Fragment>
         <Confirm
            cancelButton="Cancelar"
            content="¿Estás seguro?"
            open={confirm.open}
            onCancel={confirm.onCancel}
            onConfirm={confirm.onConfirm}
         />
         <Modal
            className="ModalForm"
            open={open}
            closeIcon={true}
            onClose={onClose}>
            <Modal.Header>{title}</Modal.Header>
            <Modal.Content>
               <Formik
                  initialValues={initialValues}
                  onSubmit={(values, { setSubmitting }) => {
                     if (shouldConfirm) {
                        setConfirm({
                           open: true,
                           onCancel: () => {
                              setConfirm({
                                 open: false
                              })
                              setSubmitting(false)
                           },
                           onConfirm: () => {
                              setConfirm({
                                 open: false
                              })
                              props.onSubmit(values, setSubmitting);
                           }
                        })
                     } else {

                        props.onSubmit(values, setSubmitting);
                     }
                  }}
               >
                  {({ isSubmitting, values }) => (
                     <Form className="ui form">
                        <Dimmer active={isSubmitting} inverted>
                           <Loader inverted>Cargando</Loader>
                        </Dimmer>
                        {fields.map(e => {
                           if (e.pop_up) {
                              return <div>
                                 <Popup
                                    trigger={<Field key={e.name} component={Input} {...e} />}
                                    content={e.pop_up.content}
                                    on={e.pop_up.on}
                                    position={e.pop_up.position}
                                    size={e.pop_up.size}
                                    wide={e.pop_up.wide}
                                 />
                              </div>;
                           } else if (e.fields) {
                              if (e.visible_condition && !e.visible_condition(values)) {
                                 return null;
                              }
                              return <Segment style={{ backgroundColor: '#f9f9f9' }} >
                                 <h5 style={{ color: '#0000ff' }}>{e.label}</h5>
                                 {e.fields.map(field => {
                                    if (Array.isArray(field)) {
                                       return <div style={{ display: 'flex' }}>
                                          {field.map(f => <Field key={f.name} component={Input} {...f} style={{ flex: '1' }} />)}
                                       </div>
                                    } else {
                                       return <Field key={field.name} component={Input} {...field} />
                                    }
                                 })}
                              </Segment>
                           }
                           return <Field key={e.name} component={Input} {...e} />;
                        })}
                        {props.renderBody && props.renderBody(values)}
                        <div className='ActionButton'>
                           <Button color={onSubmitBottonColor} type="submit">{onSubmitBottonText}</Button>
                        </div>
                     </Form>
                  )}
               </Formik>
            </Modal.Content>
         </Modal>
      </React.Fragment>



   )
}

ModalForm.propTypes = {
   fields: PropTypes.array.isRequired,
   title: PropTypes.string.isRequired,
   open: PropTypes.bool.isRequired,
   onClose: PropTypes.func.isRequired,
   onSubmit: PropTypes.func.isRequired,
}

export default ModalForm