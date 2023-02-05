import { getUnprotectedData } from '../../lib/api/index';
// import { PublicData } from '../../types';

// export const revalidate = 60;

async function getData() {
    return await getUnprotectedData().catch(error => console.log(error.message));
}

export default async function Page() {
    const data = await getData().catch(error => console.log(error.message));

    return (
        <main id="main">
            <article>
                {/* had to add this nested fragment to get typescript to stop complaining about nested jsx elements */}
                <>
                    <h2 className="page-heading">
                        Public Page
                    </h2>

                    <p>
                        This page is getting data on the server-side, right in the component.
                    </p>

                    {data && data.length > 0 &&
                        <ul>
                            {data.map((item) => (
                                <li key={item._id}>
                                    {item.name}
                                </li>
                            ))}
                        </ul>
                    }
                </>
            </article>
        </main>
    );
}
