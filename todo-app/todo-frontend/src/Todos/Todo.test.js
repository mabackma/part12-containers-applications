import React from 'react';
import { render } from '@testing-library/react';
import Todo from './Todo';

describe('Todo component', () => {
  const todo = { id: 1, text: 'Example Todo', done: false };
  const onClickDelete = jest.fn();
  const onClickComplete = jest.fn();

  it('renders correctly', () => {
    const { getByText } = render(
      <Todo todo={todo} onClickDelete={onClickDelete} onClickComplete={onClickComplete} />
    );

    expect(getByText('Example Todo')).toBeInTheDocument();
  });
});