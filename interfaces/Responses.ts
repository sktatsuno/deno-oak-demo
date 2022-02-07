import Todo from "../interfaces/Todo.ts";

export interface SuccessResponse {
	success: boolean,
	//Todo or array of objects fitting Todo interface 
	data: Todo | Todo[] | undefined,
}

export interface FailureResponse {
	success: boolean,
	message: string,
}