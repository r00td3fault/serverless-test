import type { Context } from "@netlify/functions"


const notify = async (message: string) => {

    const body = { content: message };

    const webHookUrl = process.env.DISCORD_WEBHOOK_URL!;

    const resp = await fetch(webHookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    if (!resp.ok) {
        console.log(' Erros sending message to Discord');
        return false;
    }

}

const onStart = (payload: any): string => {

    const { action, sender, repository } = payload;

    return `User ${sender.login} ${action} star on ${repository.full_name}`;
}

const onIssue = (payload: any): string => {

    const { action, repository, issue } = payload;

    if (action === 'opened') {
        return `An issue was opened by ${issue.user.login} with this title ${issue.title} `;
    }
    if (action === 'closed') {
        return `An issue was closed by ${issue.user.login} with this title ${issue.title} `;
    }
    if (action === 'reopened') {
        return `An issue was reopened by ${issue.user.login} on ${repository.full_name} `;
    }

    return `Unhandled action for the issue event ${action}`;

}

export default async (req: Request, context: Context) => {

    const gtihubEvent = req.headers.get('x-github-event') ?? 'unknown';
    const payload = await req.json();

    let message: string;


    switch (gtihubEvent) {
        case 'star':
            message = onStart(payload);
            break;
        case 'issues':
            message = onIssue(payload);
            break;
        default:
            message = `Unknown event ${gtihubEvent}`
            console.log(`Unknown event ${gtihubEvent}`);
            break;
    }

    await notify(message);


    return new Response(JSON.stringify({ message: 'Done' }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}