import { redirect } from '@sveltejs/kit'

export const load = async ({ locals }) => {
    if (locals && locals.user) redirect(302, '/')
}