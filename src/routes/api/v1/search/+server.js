import {json} from "@sveltejs/kit";

export const GET = async ({ url }) => {
    const query = url.searchParams.get('q') || url.searchParams.get('query');
    const filters = (url.searchParams.get('filter')?.split(',') || url.searchParams.get('filters')?.split(',')) ?? [];
    const sortBy = url.searchParams.get('sort') || url.searchParams.get('sortby');

    const req = await fetch(`https://dummyjson.com/products/search?q=${query}&sortBy=${sortBy ?? 'title'}&order=desc`)
    const data = await req.json();

    if (!data) return json({ error: 'No data found' }, { status: 404 });

    return json(data.products);
}