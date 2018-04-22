import React from 'react'
import { TextArea, Message } from 'semantic-ui-react'

const ValidatedTextArea = ({ input, type, meta, placeholder, autoComplete, rows }) => {
    const { touched, error } = meta;
    return (
        <div>
            <TextArea {...input} placeholder={placeholder} autoComplete={autoComplete} autoHeight rows={rows} />
            {touched && error &&
                <Message error header={error.header} content={error.message} icon='exclamation circle' />
            }
        </div>
    );
}

export default ValidatedTextArea;