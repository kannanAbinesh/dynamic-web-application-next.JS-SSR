/* Style. */
import './commonInputField.css';

export default function CommonInputField(props) {

    /* Props. */
    const { field, fieldState, formState, label, ...customProps } = props;

    /* Variables. */
    const { error } = fieldState;

    return (
        <div className="input-container">
            {label && (<label className='form-input-label'>{label}</label>)}
            <input {...field} {...customProps} className="form-input" />
            {error && (<span className="error-message">{error.message}</span>)}
        </div>
    );
};