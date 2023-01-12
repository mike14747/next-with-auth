import { redirect } from 'next/navigation';
// eslint-disable-next-line camelcase
import { unstable_getServerSession } from 'next-auth/next';
import UpdateProfile from '../components/UpdateProfile';
import { getUserProfile } from '../../lib/api/user';

import styles from '../../styles/profile.module.css';

async function getData(_id) {
    return await getUserProfile(_id).catch(error => console.log(error.message));
}

export default async function Page() {
    const session = await unstable_getServerSession({
        callbacks: { session: ({ token }) => token },
    });

    if (!session) {
        redirect('/login?callbackUrl=/profile2');
    }

    const user = await getData(session._id).catch(error => console.log(error.message));

    return (
        <>
            <article className="mw-75ch">
                <h2 className="page-heading">
                    Profile
                </h2>

                <div className={styles.currentContainer}>
                    <h3 className={styles.currentHeading}>Current profile information:</h3>

                    <p><span className={styles.description}>Username: </span>{user?.username}</p>

                    <p><span className={styles.description}>Password: </span>************</p>

                    <p><span className={styles.description}>Email: </span>{user?.email}</p>
                </div>

                <UpdateProfile userId={session._id} />
            </article>
        </>
    );
}
