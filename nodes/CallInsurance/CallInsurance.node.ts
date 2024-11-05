import { INodeType, INodeTypeDescription } from 'n8n-workflow';
import { aetnaOperations, aetnaFields } from './AetnaDescription';

export class CallInsurance implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'CallInsurance',
		name: 'callInsurance',
		icon: 'file:phone-call.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Operations for CallInsurance ',
		defaults: {
			name: 'CallInsurance',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'callInsuranceApi',
				required: false,
			},
		],
		requestDefaults: {
			// baseURL: 'https://httpbin.org',
			baseURL: 'https://b729-61-0-8-59.ngrok-free.app',
			url: '',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		/**
		 * In the properties array we have two mandatory options objects required
		 *
		 * [Resource & Operation]
		 *
		 * https://docs.n8n.io/integrations/creating-nodes/code/create-first-node/#resources-and-operations
		 *
		 * In our example, the operations are separated into their own file (HTTPVerbDescription.ts)
		 * to keep this class easy to read.
		 *
		 */
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Aetna',
						value: 'Aetna',
					},
					{
						name: 'CallInsurance',
						value: 'CallInsurance',
					},
					{
						name: 'UHC',
						value: 'UHC',
					},
				],
				default: 'CallInsurance',
			},

			...aetnaOperations,
			...aetnaFields,
		],
	};
}
