import { INodeType, INodeTypeDescription } from 'n8n-workflow';
import { ecwRpaOperations, ecwRpaFields } from './EClinicalWorksDescription';

export class EClinicalWorks implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'EClinicalWorks',
		name: 'eClinicalWorks',
		icon: 'file:eCW_converted.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'RPA for EClinicalWorks ',
		defaults: {
			name: 'EClinicalWorks',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'eClinicalWorksApi',
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
						name: 'EHR',
						value: 'EHR',
					},
				],
				default: 'EHR',
			},

			...ecwRpaOperations,
			...ecwRpaFields,
		],
	};
}
