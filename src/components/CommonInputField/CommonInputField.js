/* Style. */
import './commonInputField.css';

export default function CommonInputField(props) {

    /* Props. */
    const { field, fieldState, formState, ...customProps } = props;

    /* Variables. */
    const { error } = fieldState;

    return (
        <div className="input-container">
            <input {...field} {...customProps} className="form-input" />
            {error && (<span className="error-message">{error.message}</span>)}
        </div>
    );
};