import { v4 } from 'https://deno.land/std/uuid/mod.ts';
// interfaces
import Todo from '../interfaces/Todo.ts';
import Params from '../interfaces/Params.ts';
import { FailureResponse, SuccessResponse } from '../interfaces/Responses.ts';
// stubs
import todos from '../stubs/todos.ts';

const findTodo = (id: string, response: any) => {
  const todo: Todo | undefined = todos.find((t) => {
    return t.id === id;
  });
  if (!todo) {
    response.status = 404;
    const failureResponse: FailureResponse = {
      success: false,
      message: 'No todo found',
    };
    response.body = failureResponse;
    return;
  }
  return todo;
};

export default {
  /**
   * @description Get all todos
   * @route GET /todos
   */
  getAllTodos: ({ response }: { response: any }) => {
    response.status = 200;
    const successResponse: SuccessResponse = {
      success: true,
      data: todos,
    };
    response.body = successResponse;
  },
  createTodo: async ({
    request,
    response,
  }: {
    request: any;
    response: any;
  }) => {
    // must resolve request body promise
    const body = await request.body();
    if (!request.hasBody) {
      response.status = 400;
      const failureResponse: FailureResponse = {
        success: false,
        message: 'No data provided',
      };
      response.body = failureResponse;
      return;
    }

    // must resolve request body values promise
    const bodyValues = await body.value;
    // if everything is fine then perform
    // operation and return todos with the
    // new data added.
    const newTodo: Todo = {
      id: v4.generate(),
      todo: bodyValues.todo,
      isCompleted: false,
    };
    const data = [...todos, newTodo];
    const successResponse: SuccessResponse = {
      success: true,
      data,
    };
    response.body = successResponse;
  },
  getTodoById: ({ params, response }: { params: Params; response: any }) => {
    const todo = findTodo(params.id, response);

    // If todo is found
    response.status = 200;
    const successResponse: SuccessResponse = {
      success: true,
      data: todo,
    };
    response.body = successResponse;
  },
  updateTodoById: async ({
    params,
    request,
    response,
  }: {
    params: Params;
    request: any;
    response: any;
  }) => {
    findTodo(params.id, response);

    // if todo found then update todo
    const bodyValues = await request.body().value;
    const updatedData: { todo?: string; isCompleted?: boolean } = bodyValues;
    const newTodos = todos.map((t) => {
      return t.id === params.id ? { ...t, ...updatedData } : t;
    });
    response.status = 200;
    const successResponse: SuccessResponse = {
      success: true,
      data: newTodos,
    };
    response.body = successResponse;
  },
  deleteTodoById: ({ params, response }: { params: Params; response: any }) => {
    const filteredTodos = todos.filter((t) => t.id !== params.id);

    // remove the todo w.r.t id and return
    // remaining todos
    response.status = 200;
    const successResponse : SuccessResponse = {
      success: true,
      data: filteredTodos,
    };
    response.body = successResponse;
  },
};
