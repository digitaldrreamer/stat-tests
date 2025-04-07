import {json} from "@sveltejs/kit";

export const POST = async ({ request }) => {
    const body = await request.json()
    if (!body || !body?.email || !body?.password) return json({
        status: false,
        message: "PASS REQUIRED PARAMS"
    }, {
        status: 401
    })

    // Check if email is already in use

    // Create user
}