const { getAsync } = require('../redis');

const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  let addedTodos = await getAsync('added_todos');

  if(addedTodos === null) {
    addedTodos = 0;
  }

  res.json({
    added_todos: addedTodos,
  });
});

module.exports = router;
