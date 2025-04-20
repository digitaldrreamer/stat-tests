const testEndpoint = async ({ fetch }) => {
    const req = await fetch('http://localhost:5173/api/v1/status')
    const res = await req.json()
    console.log('server', res)
}

export const load = async ({ fetch }) => {
    // testEndpoint({ fetch })
    return {}
}