const { getAsync, setAsync } = require('../redis');

const express = require('express');
const { Contact} = require('../mongo')
const router = express.Router();

/* GET contacts listing. */
router.get('/', async (_, res) => {
  const contacts = await Contact.find({})
  res.send(contacts);
});

/* POST contact to listing. */
router.post('/', async (req, res) => {
  let currentContacts = await getAsync('added_contacts');
  if(currentContacts === null) {
    await setAsync('added_contacts', 0);
    currentContacts = 0;
  }
  await setAsync('added_contacts', parseInt(currentContacts, 10) + 1);

  const contact= await Contact.create({
    name: req.body.name,
    number: req.body.number
  })
  res.send(contact);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.contact= await Contact.findById(id)
  if (!req.contact) return res.sendStatus(404)

  next()
}

/* DELETE contact. */
singleRouter.delete('/', async (req, res) => {
  const currentContacts = await getAsync('added_contacts');
  await setAsync('added_contacts', parseInt(currentContacts, 10) - 1);

  await req.contact.delete()  
  res.sendStatus(200);
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
