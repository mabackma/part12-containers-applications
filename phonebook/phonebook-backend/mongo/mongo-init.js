db.createUser({
  user: 'the_phonebook_username',
  pwd: 'the_phonebook_password',
  roles: [
    {
      role: 'dbOwner',
      db: 'the_phonebook_database',
    },
  ],
});

db.createCollection('contacts');

db.contacts.insert({ name: 'Dan Abramov', number: '12-43-234345' });
db.contacts.insert({ name: 'Mary Poppendieck', number: '39-23-6423122' });
db.contacts.insert({ name: 'iuiuiuiiu', number: '22-22222222' });