const { getAsync, setAsync } = require('../redis');

const express = require('express');
const { Todo } = require('../mongo')
const router = express.Router();

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  let currentTodos = await getAsync('added_todos');
  if(currentTodos === null) {
    await setAsync('added_todos', 0);
    currentTodos = 0;
  }
  await setAsync('added_todos', parseInt(currentTodos, 10) + 1);

  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })
  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  const currentTodos = await getAsync('added_todos');
  await setAsync('added_todos', parseInt(currentTodos, 10) - 1);

  await req.todo.delete()  
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  res.send(req.todo); // req.todo is set by findByIdMiddleware
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  const { text, done } = req.body;

  req.todo.text = text
  req.todo.done = done
  await req.todo.save();
  
  res.sendStatus(200); // Implement this
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
