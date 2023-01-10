import { redirect } from 'next/navigation';
import { getProtectedData } from '../../lib/api/index';
// eslint-disable-next-line camelcase
import { unstable_getServerSession } from 'next-auth/next';
// import { authOptions } from '../../pages/api/auth/[...nextauth]';

async function getData() {
    return await getProtectedData().catch(error => console.log(error.message));
}

export default async function Page() {
    // doing this will return the session in the form of a token... including the expiry date
    const session = await unstable_getServerSession({
        callbacks: { session: ({ token }) => token },
    });
    console.log({ session });
    // doing this will get the session, but with the expiry date stripped out
    // const session = await unstable_getServerSession(authOptions);
    if (!session) {
        redirect('/login?callbackUrl=/protected');
    }
    const data = await getData().catch(error => console.log(error.message));

    return (
        <>
            <article>
                <h2 className="page-heading">
                    Protected Page
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
                                {item.name + ' - age: ' + item.age}
                            </li>
                        ))}
                    </ul>
                }
            </article>
        </>
    );
}
