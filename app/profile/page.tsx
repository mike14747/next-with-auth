import { redirect } from 'next/navigation';
// eslint-disable-next-line camelcase
import { getServerSession } from 'next-auth/next';
import CurrentProfile from '../components/profile/CurrentProfile';
import { getUserProfile } from '../../lib/api/user';

async function getData(id: string) {
    return await getUserProfile(id).catch(error => console.log(error.message));
}

export default async function Page() {
    const session = await getServerSession({
        callbacks: { session: ({ token }) => token },
    });

    if (!session) {
        redirect('/login?callbackUrl=/profile');
    }

    const user = await getData(session.id).catch(error => console.log(error.message));
    if (user?.username && user?.email) user.id = session.id;

    return (
        <main id="main">
            <article className="mw-75ch">
                {/* had to add this nested fragment to get typescript to stop complaining about multiple children */}
                <>
                    <h2 className="page-heading">
                        Profile
                    </h2>

                    {user &&
                        <CurrentProfile userObj={user} />
                    }

                    {!user &&
                        <p className="error">
                            An error occurred fetching user profile info.
                        </p>
                    }
                </>
            </article>
        </main>
    );
}
