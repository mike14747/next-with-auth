import { redirect } from 'next/navigation';
// eslint-disable-next-line camelcase
import { unstable_getServerSession } from 'next-auth/next';
import CurrentProfile from '../components/profile/CurrentProfile';
import { getUserProfile } from '../../lib/api/user';

async function getData(_id) {
    return await getUserProfile(_id).catch(error => console.log(error.message));
}

export default async function Page() {
    const session = await unstable_getServerSession({
        callbacks: { session: ({ token }) => token },
    });

    if (!session) {
        redirect('/login?callbackUrl=/profile');
    }

    const user = await getData(session._id).catch(error => console.log(error.message));
    user._id = session._id;

    return (
        <>
            <article className="mw-75ch">
                <h2 className="page-heading">
                    Profile
                </h2>

                <CurrentProfile userObj={user} />
            </article>
        </>
    );
}
