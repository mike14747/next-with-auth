import { getUnprotectedData } from '../../lib/api/index';

async function getData() {
    return await getUnprotectedData().catch(error => console.log(error.message));
}

export default async function Page() {
    const data = await getData().catch(error => console.log(error.message));

    return (
        <main id="main">
            <article>
                <h2 className="page-heading">
                    Public Page
                </h2>

                <p>
                    This page is getting data on the server-side, right in the component.
                </p>

                {data?.length > 0 &&
                    <ul>
                        {data.map((item: { _id: string, name: string }) => (
                            <li key={item._id}>
                                {item.name}
                            </li>
                        ))}
                    </ul>
                }
            </article>
        </main>
    );
}
