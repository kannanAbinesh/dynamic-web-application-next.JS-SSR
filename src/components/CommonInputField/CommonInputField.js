/* Style. */
import './commonInputField.css';

export default function CommonInputField(props) {

    /* Props. */
    const { field, fieldState, formState, label, ...customProps } = props;

    /* Variables. */
    const { error } = fieldState;

    return (
        <div className="common-input-container">
            {label && (<label className='common-input-form-label'>{label}</label>)}
            <input {...field} {...customProps} className={`common-input-form-input ${error ? 'common-input-error' : ''}`} />
            {error && (<span className="common-input-error-message">{error.message}</span>)}
        </div>
    );
};