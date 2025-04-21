export const load = async ({ locals }) => {
    console.log('locals', locals)
    return {
        ...locals
    }
}