import React from 'react'
import capitalize from "lodash/capitalize";
import { replaceAll } from '../utils/index'
import { Checkbox, Dropdown } from "semantic-ui-react";
// import Select from "react-select";
import Cleave from 'cleave.js/react';

export default ({
   field, // { name, value, onChange, onBlur }
   type = 'text',
   withLabel = true,
   options,
   label,
   fileExtensions,
   includeEmptyOption = false,
   readOnly = false,
   checkLabel,
   fileStyle,
   forceError,
   form: { touched, errors, setFieldValue, setFieldError, setFieldTouched, submitCount }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
   style: divStyle,
   ...props
}) => (
   <div style={divStyle}>
      {
         withLabel ? (
            <div className="Modal_form_field_label"
               htmlFor={field.name}>{label ? label : replaceAll(capitalize(field.name), '_', ' ')}
            </div>
         ) :
            <div className="Modal_form_field_label"></div>
      }


      {(() => {
         let style = (touched[field.name] && errors[field.name]) ? { ...props.inputStyle, border: 'solid 1px red' } : { ...props.inputStyle }
         if (readOnly) {
            style = {
               backgroundColor: '#eeeeee',
               ...style
            }
         }
         switch (type) {

            case 'select':
               return (
                  <select
                     className="Modal_form_field_input"
                     {...field}
                     {...props}
                     onChange={(e) => {
                        const value = e.target.value;
                        if (props.onChange)
                           props.onChange(value);

                        setFieldValue(field.name, value);
                        setFieldTouched(field.name, true);
                     }}
                     disabled={readOnly}
                  >
                     {includeEmptyOption && <option key={undefined} value={undefined} />}
                     {options &&
                        options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)
                     }
                  </select>
               );
            case 'select-multiple':
               return (
                  <Dropdown
                     {...field}
                     {...props}
                     validate={(value) => {
                        const { validate } = props;
                        if (validate)
                           validate(value);
                     }}
                     fluid multiple selection options={options}
                     onChange={(_, data) => {
                        const { onChange } = props;
                        if (onChange)
                           onChange(data.value);
                        setFieldValue(field.name, data.value);
                     }}
                     onBlur={(_, data) => {
                        const { onBlur } = props;
                        if (onBlur)
                           onBlur(data.value);
                        setFieldValue(field.name, data.value);
                     }} />
               );

            case 'textarea':
               return (
                  <div>
                     <textarea
                        className="Modal_form_field_input"
                        style={(touched[field.name] && errors[field.name]) ? { border: 'solid 1px red' } : null}
                        {...field}
                        value={field.value || undefined}
                        {...props} />
                  </div>
               );
            case 'check':
               return (
                  <div>
                     <Checkbox
                        {...field}
                        {...props}
                        label={checkLabel ? checkLabel : label}
                        defaultChecked={field.value}
                        onChange={(_, data) => {
                           const { onChange } = props;
                           if (onChange)
                              onChange(data.checked);
                           setFieldValue(field.name, data.checked);
                        }}
                     />
                  </div>
               );
            case 'file':
               return (
                  <div style={{ display: 'flex', ...fileStyle }}>
                     <input
                        {...field}
                        {...props}
                        className="Modal_form_field_input"
                        style={(touched[field.name] && errors[field.name]) ? { border: 'solid 1px red' } : null}
                        value={field.value ? field.value.filename : ''}
                        readOnly

                     />

                     <input
                        type="file"
                        style={{ display: 'none' }}
                        className="inputfile"
                        id="embedpollfileinput"
                        accept={fileExtensions ? fileExtensions.join(',') : undefined}
                        onChange={event => {
                           const filename = event.target.files[0].name;
                           const content = event.target.files[0];
                           setFieldValue(field.name, {
                              filename,
                              content
                           });
                        }} />
                     <label htmlFor="embedpollfileinput" className="Form_field_label ui icon button">
                        <i className="ui search icon"></i>

                     </label>
                  </div>
               );
            case "currency": {
               return (
                  <Cleave
                     style={{
                        textAlign: 'left',
                        ...style,
                     }}
                     className="Modal_form_field_input"
                     value={field.value}
                     // htmlRef={(input) => {
                     //    this.input = input
                     // }}
                     onChange={e => {
                        const value = e.target.rawValue ? e.target.rawValue.length > 0 ? e.target.rawValue : 0 : 0
                        let isValid = true;
                        if (props.maxValue != null) {
                           const floatValue = parseFloat(value);
                           isValid = floatValue <= props.maxValue
                        }

                        let newValue;
                        if (isValid) {
                           newValue = value
                        } else {
                           newValue = props.maxValue
                        }

                        if (props.onChange)
                           props.onChange(newValue)
                        setFieldValue(field.name, newValue);
                        setFieldTouched(field.name, true);

                     }}
                     readOnly={readOnly}
                     options={{
                        numeral: true,
                        rawValueTrimPrefix: true,
                        numeralDecimalScale: 2,
                        prefix: '$'
                     }
                     }
                  />
               )
            }
            case "numerical": {
               return (
                  <div>
                     <input
                        className="Modal_form_field_input"
                        type={type}
                        style={{
                           ...style,
                           borderColor: errors[field.name] && (submitCount > 0 || forceError) && 'red',
                        }}
                        {...field}

                        value={field.value || ''}
                        readOnly={readOnly}
                        {...props}
                        onChange={(e) => {
                           let value = e.target.value;

                           const regex = /^[0-9]{0,2}$/;


                           if (regex.exec(value)) {
                              setFieldValue(field.name, value);
                              if (props.onChange)
                                 props.onChange(value)
                              setFieldTouched(field.name, true);
                           }


                        }}
                     />
                  </div>
               )
            }
            case "card": {
               return (
                  <Cleave
                     style={{
                        textAlign: 'left',
                        ...style,
                     }}
                     className="Modal_form_field_input"
                     value={field.value}
                     onChange={e => {
                        const value = e.target.rawValue ? e.target.rawValue.length > 0 ? e.target.rawValue : 0 : 0
                        let isValid = true;
                        if (props.maxValue != null) {
                           const floatValue = parseFloat(value);
                           isValid = floatValue <= props.maxValue
                        }

                        let newValue;
                        if (isValid) {
                           newValue = value
                        } else {
                           newValue = props.maxValue
                        }

                        if (props.onChange)
                           props.onChange(newValue)
                        setFieldValue(field.name, newValue);
                        setFieldTouched(field.name, true);

                     }}
                     readOnly={readOnly}
                     options={{
                        creditCard: true,
                     }
                     }
                  />
               )
            }
            case "cleave": {
               return (
                  <Cleave
                     style={{
                        textAlign: 'left',
                        ...style,
                     }}
                     className="Modal_form_field_input"
                     value={field.value}
                     onChange={e => {
                        const value = e.target.rawValue ? e.target.rawValue.length > 0 ? e.target.rawValue : 0 : 0
                        let isValid = true;
                        if (props.maxValue != null) {
                           const floatValue = parseFloat(value);
                           isValid = floatValue <= props.maxValue
                        }

                        let newValue;
                        if (isValid) {
                           newValue = value
                        } else {
                           newValue = props.maxValue
                        }

                        if (props.onChange)
                           props.onChange(newValue)
                        setFieldValue(field.name, newValue);
                        setFieldTouched(field.name, true);

                     }}
                     placeholder={props.placeholder}
                     readOnly={readOnly}
                     options={props.coptions}
                  />
               )
            }
            default:


               return (
                  <div>
                     <input
                        className="Modal_form_field_input"
                        type={type}
                        style={{
                           ...style,
                           borderColor: errors[field.name] && (submitCount > 0 || forceError) && 'red',
                        }}
                        {...field}

                        value={field.value != null ? field.value : ''}
                        readOnly={readOnly}
                        {...props}
                        onChange={(e) => {
                           let value = e.target.value;

                           if (type === "number") {
                              value = parseInt(value)
                           }
                           if (props.onChange)
                              props.onChange(value)
                           setFieldTouched(field.name, true);
                           setFieldValue(field.name, value);
                        }}
                        onBlur={(e) => {
                           let value = e.target.value;
                           if (props.onBlur)
                              props.onBlur(value)
                        }}
                     />
                  </div>
               );
         }
      })()}
      {
         (errors[field.name] && (submitCount > 0 || forceError)) &&
         < div style={{ color: 'red' }}>{errors[field.name]}</div>
      }
   </div >
);
