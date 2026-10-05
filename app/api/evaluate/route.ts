import { isRefund } from '@/lib/refund';

export async function POST(request: Request) {
	const { phrase } = await request.json();

	if (typeof phrase !== 'string' || phrase.trim() === '') {
		return Response.json({ error: 'Missing "phrase" in request body.' }, { status: 400 });
	}

	const answers = await isRefund(phrase);

	return Response.json({ phrase, answers });
}
