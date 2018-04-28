
export interface TodoList {
  name: string
  todos: Todo[]
}

export interface Todo {
  text: string
  completed: boolean
}