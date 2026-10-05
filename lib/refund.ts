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
				}
			}
		}
	})

	return result.answers;
}