import React from 'react'
import Todo from './Todo'

const TodoList = ({ todos, deleteTodo, completeTodo }) => {
  const onClickDelete = (todo) => () => {
    deleteTodo(todo)
  }

  const onClickComplete = (todo) => () => {
    completeTodo(todo)
  }

  return (
    <>
      {todos.map((todo) => (
        <React.Fragment key={todo.id}>
          <Todo todo={todo} onClickDelete={onClickDelete} onClickComplete={onClickComplete} />
        </React.Fragment>
      )).reduce((acc, cur) => [...acc, <hr />, cur], [])}
    </>
  );
}

export default TodoList
