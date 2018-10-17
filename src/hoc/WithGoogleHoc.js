import React from 'react'
import { GoogleApiWrapper } from 'google-maps-react';
import Config from '../Config'
import LoadingHeader from '../components/LoadingHeader'

const LoadingContainer = () => (
    <LoadingHeader />
);

export default function (ComposedClass) {

    class WithGoogleComponent extends React.Component {

        render() {
            const { google, ...props } = this.props;
            if (!google) {
                return null;
            }
            return <ComposedClass {...props} google={google} />
        }
    }

    return GoogleApiWrapper({
        version: '3.34',
        apiKey: Config.Google.ApiKey,
        libraries: ['places', 'geometry'],
        LoadingContainer: LoadingContainer
    })(WithGoogleComponent);
}
