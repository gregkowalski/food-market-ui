import { Component } from 'react';
import debounce from 'lodash.debounce';
import isEqual from 'lodash.isequal';
import { connect } from 'formik';

const SAVE_DELAY = 16;

class FormikEffects extends Component {
    onChange = debounce(this.props.onChange, SAVE_DELAY);

    componentDidUpdate(prevProps) {
        const { formik } = this.props;
        const hasChanged = !isEqual(prevProps.formik.values, formik.values);
        if (hasChanged) {
            this.onChange(formik.values);
        }

        // const { isValid } = formik;
        // const shouldCallback = isValid && hasChanged;
        // if (shouldCallback) {
        //     this.onChange(formik.values);
        // }
    }

    render() {
        return null;
    }
}

export default connect(FormikEffects);