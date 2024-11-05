// import {
// 	IExecuteFunctions,
// 	INodeExecutionData,
// 	INodeType,
// 	INodeTypeDescription,
// 	NodeOperationError,
// } from 'n8n-workflow';

// export class EditOutputs implements INodeType {
// 	description: INodeTypeDescription = {
// 			displayName: 'Edit Outputs',
// 			name: 'editOutputs',
// 			icon: 'fa:edit',
// 			group: ['transform'],
// 			version: 1,
// 			description: 'Allows editing of previous node outputs before continuing execution',
// 			defaults: {
// 					name: 'Edit Outputs',
// 			},
// 			inputs: ['main'],
// 			outputs: ['main'],
// 			properties: [
// 					{
// 							displayName: 'Mode',
// 							name: 'mode',
// 							type: 'options',
// 							options: [
// 									{
// 											name: 'All Items',
// 											value: 'allItems'
// 									},
// 									{
// 											name: 'Selected Items',
// 											value: 'selectedItems'
// 									}
// 							],
// 							default: 'allItems',
// 							description: 'Whether to edit all items or only selected ones',
// 					},
// 					{
// 							displayName: 'Items to Edit',
// 							name: 'itemsToEdit',
// 							type: 'string',
// 							displayOptions: {
// 									show: {
// 											mode: ['selectedItems'],
// 									},
// 							},
// 							default: '',
// 							description: 'Comma-separated list of item indices to edit (0-based)',
// 					}
// 			],
// 			// Add manual execution mode
// 			// executionMode: 'manual',
// 	};

// 	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
// 			const items = this.getInputData();
// 			const mode = this.getNodeParameter('mode', 0) as string;

// 			let itemsToProcess: INodeExecutionData[] = items;

// 			if (mode === 'selectedItems') {
// 					const itemIndices = this.getNodeParameter('itemsToEdit', 0) as string;
// 					const indices = itemIndices.split(',').map(i => parseInt(i.trim()));

// 					itemsToProcess = indices.map(index => {
// 							if (index >= items.length) {
// 									throw new NodeOperationError(this.getNode(), `Invalid item index: ${index}`);
// 							}
// 							return items[index];
// 					});
// 			}

// 			// Create dynamic properties for each item that needs to be edited
// 			const dynamicProperties = itemsToProcess.map((item, index) => ({
// 					displayName: `Item ${index + 1}`,
// 					name: `item_${index}`,
// 					type: 'json',
// 					default: item.json,
// 					required: true,
// 					description: `Edit values for item ${index + 1}`,
// 			}));

// 			// Add dynamic properties to node description
// 			this.description.properties.push(...dynamicProperties);

// 			// Get edited values from manual input
// 			const editedItems = itemsToProcess.map((item, index) => {
// 					const editedJson = this.getNodeParameter(`item_${index}`, 0);
// 					return {
// 							...item,
// 							json: editedJson,
// 					};
// 			});

// 			// If in selectedItems mode, merge edited items back into original array
// 			if (mode === 'selectedItems') {
// 					const itemIndices = this.getNodeParameter('itemsToEdit', 0) as string;
// 					const indices = itemIndices.split(',').map(i => parseInt(i.trim()));

// 					indices.forEach((originalIndex, arrayIndex) => {
// 							items[originalIndex] = editedItems[arrayIndex];
// 					});

// 					return [items];
// 			}

// 			return [editedItems];
// 	}
// }

import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

export class EditOutputs implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Edit Outputs',
		name: 'editOutputs',
		group: ['transform'],
		version: 1,
		description: 'Allows editing of previous node outputs before continuing execution',
		defaults: {
			name: 'Example Node',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			// Node properties which the user gets displayed and
			// can change on the node.
			{
				displayName: 'My String',
				name: 'myString',
				type: 'string',
				default: '',
				placeholder: 'Placeholder value',
				description: 'The description text',
			},
		],
	};

	// The function below is responsible for actually doing whatever this node
	// is supposed to do. In this case, we're just appending the `myString` property
	// with whatever the user has entered.
	// You can make async calls and use `await`.
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		let item: INodeExecutionData;
		let myString: string;

		// Iterates over all input items and add the key "myString" with the
		// value the parameter "myString" resolves to.
		// (This could be a different value for each item in case it contains an expression)
		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				myString = this.getNodeParameter('myString', itemIndex, '') as string;
				item = items[itemIndex];

				item.json.myString = myString;
			} catch (error) {
				// This node should never fail but we want to showcase how
				// to handle errors.
				if (this.continueOnFail()) {
					items.push({ json: this.getInputData(itemIndex)[0].json, error, pairedItem: itemIndex });
				} else {
					// Adding `itemIndex` allows other workflows to handle this error
					if (error.context) {
						// If the error thrown already contains the context property,
						// only append the itemIndex
						error.context.itemIndex = itemIndex;
						throw error;
					}
					throw new NodeOperationError(this.getNode(), error, {
						itemIndex,
					});
				}
			}
		}

		return [items];
	}
}
