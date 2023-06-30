// @ts-ignore
import prompts from "prompts";

export type PromptType =
	| 'text'
	| 'password'
	| 'invisible'
	| 'number'
	| 'confirm'
	| 'list'
	| 'toggle'
	| 'autocomplete'
	| 'date'
	| 'multiselect'
	| 'select';

export interface BasePrompt {
	type: PromptType;
	name: string;
	message: string;
}

export type PromptObject<T extends string = string> = BasePrompt & {
	[key: string]: any;
};

export type PromptResponseType<T extends PromptObject<string>[]> = {
	[P in T[number]['name']]: string;
};

export async function getPromptResponses<T extends PromptObject<string>[]>(
	promptObjects: T
): Promise<PromptResponseType<T>> {
	const response = await prompts(promptObjects);
	return response as PromptResponseType<T>;
}
