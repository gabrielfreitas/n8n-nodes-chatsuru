import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ChatsuruApi implements ICredentialType {
	name = 'chatsuruApi';
	displayName = 'Chatsuru API';
	documentationUrl = 'https://docs.chatsuru.com';
	properties: INodeProperties[] = [
		{
			displayName: 'Token',
			name: 'token',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Token de autenticação da API Chatsuru',
		},
	];
}