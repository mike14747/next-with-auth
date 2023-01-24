import { redirect } from 'next/navigation';
import { getAdminData } from '../../lib/api/index';
// eslint-disable-next-line camelcase
import { unstable_getServerSession } from 'next-auth/next';

async function getData() {
    return await getAdminData().catch(error => console.log(error.message));
}

export default async function Page() {
    // doing this will return the session in the form of a token... including the expiry date
    const session = await unstable_getServerSession({
        callbacks: { session: ({ token }) => token },
    });

    if (!session) {
        redirect('/login?callbackUrl=/admin');
    }

    let data = null;
    if (session.role === 'admin') {
        data = await getData().catch(error => console.log(error.message));
    }

    return (
        <main id="main">
            <article>
                <h2 className="page-heading">
                    Admin Page
                </h2>

                {session?.role !== 'admin' && (
                    <>
                        <p className="error">
                            You are logged in, but do not have the proper credentials to view this page.
                        </p>

                        <p className="error">
                            Log out, then log back in as a user with the proper credentials to view this page.
                        </p>
                    </>
                )}

                {session?.role === 'admin' && (
                    <>
                        {data?.length > 0 && (
                            <ul>
                                {data.map((item) => (
                                    <li key={item._id}>
                                        {item.name + ' - age: ' + item.age + ' (salary: $' + item.salary + ')'}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </>
                )}
            </article>
        </main>
    );
}
