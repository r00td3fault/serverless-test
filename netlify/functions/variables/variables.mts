import type { Context } from "@netlify/functions"

export default async (req: Request, context: Context) => {

    const myVariable = process.env.MY_TEST_VARIABLE;

    if (!myVariable) {
        throw "Missing env variable";
    }


    return new Response(JSON.stringify({ "Variables": "Env variables!", "myVar": myVariable }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}