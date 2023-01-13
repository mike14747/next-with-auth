'use client';

import PropTypes from 'prop-types';

export default function Page({ params }) {
    return (
        <>
            <p>
                This is the homepage in the app folder.
            </p>

            <p>
                This is prop1: {params.prop1}
            </p>
        </>
    );
}

Page.propTypes = {
    params: PropTypes.object,
};
