import { useState, useEffect } from 'react';

const ScrollTop = () => {
    const [showTop, setShowTop] = useState(false);

    const checkScrollTop = () => window.pageYOffset > 800 ? setShowTop(true) : setShowTop(false);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    useEffect(() => {
        window.addEventListener('scroll', checkScrollTop);
    }, []);

    return (
        <>
            <button className={'scrollBtn ' + (showTop && 'slideIn')} onClick={scrollToTop}>
                <div aria-hidden="true" className="arrow">&#8593;</div>
                TOP
            </button>

            <style jsx>{`
                    .scrollBtn {
                        position: fixed;
                        left: auto;
                        right: -60px;
                        top: auto;
                        bottom: 1rem;
                        height: 100px;
                        color: #ffffff;
                        background-color: rgba(35, 35, 35, 0.75);
                        font-size: 1rem;
                        text-align: center;
                        margin: 0;
                        padding: 0 0.5rem 0.5rem 0.5rem;
                        cursor: pointer;
                        border: 1px #ffffff solid;
                        border-right: 0;
                        border-top-left-radius: 0.50rem;
                        border-bottom-left-radius: 0.50rem;
                        z-index: 100;
                        transition: .8s;
                    }

                    .slideIn {
                        transform: translateX(-60px);
                    }

                    .arrow {
                        font-size: 2rem;
                        font-weight: bold;
                        white-space: pre;
                    }

                    .scrollBtn:hover {
                        color: #ff7518;
                        border: 1px #ff7518 solid;
                        border-right: 0;
                        transition: .3s;
                    }
            `}</style>
        </>
    );
};

export default ScrollTop;
