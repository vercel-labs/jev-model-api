# Jev Model on Vercel AI Gateway

A small Next.js example that calls the Jev classification model through [Vercel AI Gateway](https://vercel.com/docs/ai-gateway).

It asks one question about a piece of text: is the customer asking for a refund? Jev returns the probability that the answer is yes.

## How it works

There are two files that matter:

- `lib/refund.ts` holds the model call. It uses `experimental_evaluate` from the AI SDK with the model `typesafe-ai/jev`, so the request goes through AI Gateway.
- `app/api/evaluate/route.ts` is an API endpoint. It takes a phrase from the request body, passes it to `isRefund()`, and returns the result.

```ts
// lib/refund.ts
import { experimental_evaluate as evaluate } from 'ai';

export async function isRefund(text: string) {
	const result = await evaluate({
		model: 'typesafe-ai/jev',
		state: text,
		questions: {
			refund_request: {
				type: 'boolean',
				instructions: 'Is the customer requesting a refund?',
				criteria: {
					true: 'Yes, the customer is looking to get a refund.',
					false: 'No, the customer is looking for other support or simply to say thank you for the refund support.',
				},
			},
		},
	});

	return result.answers;
}
```

To ask a different question, change the `questions` object in `lib/refund.ts`.

## Requirements

- Node.js 20.9 or later
- A [Vercel account](https://vercel.com/signup)
- The Vercel CLI

```bash
npm i -g vercel
```

## Setup

### 1. Clone and install

```bash
git clone <this-repo-url>
cd jev-model-test
npm install
```

### 2. Connect to your AI Gateway

This project uses the Vercel CLI to authenticate with AI Gateway. No API key is needed.

Log in to Vercel:

```bash
vercel login
```

Link the folder to a Vercel project. Follow the prompts to pick your team and create or select a project.

```bash
vercel link
```

Pull the environment variables. This writes a `VERCEL_OIDC_TOKEN` to `.env.local`, which the AI SDK uses to call AI Gateway.

```bash
vercel env pull
```

The token expires after about 12 hours. If requests start failing with an auth error, run `vercel env pull` again.

`.env.local` is already in `.gitignore`, so the token will not be committed.

### 3. Start the dev server

```bash
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

### 4. Call the endpoint

Send a POST request to `/api/evaluate` with a `phrase`:

```bash
curl -X POST http://localhost:3000/api/evaluate -H "Content-Type: application/json" -d '{"phrase": "I was charged twice and want my money back."}'
```

The response looks like this:

```json
{
  "phrase": "I was charged twice and want my money back.",
  "answers": {
    "refund_request": {
      "type": "boolean",
      "probability": 0.98
    }
  }
}
```

`probability` is the model's estimate that the answer is true. The exact number will vary.

Try a phrase that is not a refund request to compare:

```bash
curl -X POST http://localhost:3000/api/evaluate -H "Content-Type: application/json" -d '{"phrase": "Thanks for processing my refund so quickly!"}'
```

If `phrase` is missing or empty, the endpoint returns a `400` error.

## Deploy to Vercel

```bash
vercel deploy
```

On Vercel, the token is handled for you, so there is nothing else to set up.

## Troubleshooting

- **Authentication error:** Check that `.env.local` exists and has `VERCEL_OIDC_TOKEN`. Run `vercel env pull` to refresh the token, then restart `npm run dev`.
- **Model not found:** Make sure the model ID in `lib/refund.ts` is `typesafe-ai/jev`.

## Learn more

- [Vercel AI Gateway docs](https://vercel.com/docs/ai-gateway)
- [AI SDK docs](https://ai-sdk.dev/docs)
- [Next.js docs](https://nextjs.org/docs)
