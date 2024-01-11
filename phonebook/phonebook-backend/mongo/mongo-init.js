db.createUser({
  user: 'the_username',
  pwd: 'the_password',
  roles: [
    {
      role: 'dbOwner',
      db: 'the_database',
    },
  ],
});

db.createCollection('contacts');

db.todos.insert({ name: 'Mary Poppendieck', number: '39-23-6423122' });
db.todos.insert({ name: 'Dan Abramov', number: '12-43-234345' });
db.todos.insert({ name: 'iuiuiuiiu', number: '22-22222222' });