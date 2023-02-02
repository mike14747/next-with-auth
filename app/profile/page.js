import { redirect } from 'next/navigation';
// eslint-disable-next-line camelcase
import { getServerSession } from 'next-auth/next';
import CurrentProfile from '../components/profile/CurrentProfile';
import { getUserProfile } from '../../lib/api/user';

async function getData(id) {
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
    user.id = session.id;

    return (
        <main id="main">
            <article className="mw-75ch">
                <h2 className="page-heading">
                    Profile
                </h2>

                <CurrentProfile userObj={user} />
            </article>
        </main>
    );
}
