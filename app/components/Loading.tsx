export default function Loading() {
    return (
        <div id="loading">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/loading.gif" alt="Loading" />
            <style jsx>{`
                #loading {
                    text-align: center;
                    margin: 1rem;
                }
            `}</style>
        </div>
    );
}
