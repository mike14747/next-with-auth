'use client';

/* eslint-disable react/no-unknown-property */
import { useState, useEffect } from 'react';

export default function ScrollTop() {
    const [showTop, setShowTop] = useState(false);

    const checkScrollTop = () => window.pageYOffset > 600 ? setShowTop(true) : setShowTop(false);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    useEffect(() => {
        window.addEventListener('scroll', checkScrollTop);

        return () => window.removeEventListener('scroll', checkScrollTop);
    }, []);

    return (
        <>
            <button title="Scroll to Top" aria-label="Scroll to Top" className={'scrollBtn ' + (showTop && 'slideIn')} onClick={scrollToTop}>
                {/* eslint-disable-next-line react/no-unknown-property */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="#ffffff" viewBox="0 0 16 16">
                    {/* eslint-disable-next-line react/no-unknown-property */}
                    <path fillRule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z" />
                </svg>
            </button>

            <style jsx>{`
                    .scrollBtn {
                        position: fixed;
                        left: auto;
                        right: -65px;
                        top: auto;
                        bottom: 2rem;
                        width: 3rem;
                        width: clamp(3rem, 1.1vw + 2.67rem, 4rem);
                        background-color: rgba(23, 23, 23, 0);
                        margin: 0;
                        padding: 0 0.50rem 1rem 0.50rem;
                        padding-top: 0;
                        padding-bottom: 1rem;
                        padding-left: 0.50rem;
                        padding-left: clamp(0.5rem, 0.15vw + 0.45rem, 0.63rem);
                        padding-right: 0.50rem;
                        padding-right: clamp(0.5rem, 0.15vw + 0.45rem, 0.63rem);
                        cursor: pointer;
                        outline: 2px rgba(23, 23, 23, 0) solid;
                        border: 2px #ffffff solid;
                        border-right: 0;
                        border-top-left-radius: 0.50rem;
                        border-bottom-left-radius: 0.50rem;
                        z-index: 100;
                        transition: .8s;
                        font-size: 3rem;
                        font-weight: bold;
                        white-space: pre;
                    }

                    .slideIn {
                        transform: translateX(-65px);
                        background-color: rgba(23, 23, 23, 0.70);
                        outline: 2px rgba(23, 23, 23, 0.25) solid;
                    }

                    .scrollBtn:hover {
                        background-color: rgba(23, 23, 23, 0.90);
                        outline: 2px rgba(23, 23, 23, 0.35) solid;
                        transition: .3s;
                    }
            `}</style>
        </>
    );
}
