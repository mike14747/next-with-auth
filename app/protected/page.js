import { redirect } from 'next/navigation';
import { getProtectedData } from '../../lib/api/index';
// eslint-disable-next-line camelcase
import { unstable_getServerSession } from 'next-auth/next';

async function getData() {
    return await getProtectedData().catch(error => console.log(error.message));
}

export default async function Page() {
    // doing this will return the session in the form of a token... including the expiry date
    const session = await unstable_getServerSession({
        callbacks: { session: ({ token }) => token },
    });

    if (!session) {
        redirect('/login?callbackUrl=/protected');
    }
    const data = await getData().catch(error => console.log(error.message));

    return (
        <main id="main">
            <article>
                <h2 className="page-heading">
                    Protected Page
                </h2>

                <p>
                    This page is getting data on the server-side, right in the component.
                </p>

                {data?.length > 0 &&
                    <ul>
                        {data.map((item) => (
                            <li key={item._id}>
                                {item.name + ' - age: ' + item.age}
                            </li>
                        ))}
                    </ul>
                }
            </article>
        </main>
    );
}
