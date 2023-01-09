import { getUnprotectedData } from '../../lib/api/index';
import { getToken } from 'next-auth/jwt';

async function getData() {
    // const res = await fetch('http://localhost:3000/api/public');
    const res = await getUnprotectedData();
    console.log({ res });
    // return res.json();
    return res;
}

export default async function Page() {
    const data = await getData();

    return (
        <>
            <article>
                <h2 className="page-heading">
                    Test Page
                </h2>

                <p>
                    This page is getting data on the server-side, right in the component.
                </p>

                {/* {error && <p className="error">{error}</p>}

                {isLoading && <Loading />} */}

                {data?.length > 0 &&
                    <ul>
                        {data.map((item, index) => (
                            <li key={index}>
                                {item.name}
                            </li>
                        ))}
                    </ul>
                }
            </article>
        </>
    );
}
