'use client';

import PropTypes from 'prop-types';

export default function Page({ params }) {
    return (
        <>
            <p>
                This is the homepage in the app folder.
            </p>

            <p>
                <small>
                    Items passed from the RootLayout to children (the pages) via props: <strong>{params?.numInitialNewsItems || ''}</strong> and <strong>{params?.newsItemIncrement || ''}</strong>
                </small>
            </p>
        </>
    );
}

Page.propTypes = {
    params: PropTypes.object,
};
