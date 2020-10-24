const {getDatabase} = require('../database/mongoDB');
const {ObjectID} = require('mongodb');

const collectionName = 'users';

const insertUser = async (user) => {
  const database = await getDatabase();
  const {insertedUser} = await database.collection(collectionName).insertOne(user);
  return insertedUser;
}

const getUsers = async () => {
  const database = await getDatabase();
  return await database.collection(collectionName).find({}).toArray();
}

const deleteUser = async (id) => {
  const database = await getDatabase();
  await database.collection(collectionName).deleteOne({
    _id: new ObjectID(id),
  });
}

const updateUser = async (id, user) => {
  const database = await getDatabase();
  delete user._id;
  await database.collection(collectionName).update(
    { _id: new ObjectID(id), },
    {
      $set: {
        ...user,
      },
    },
  );
}

module.exports = {
  insertUser,
  getUsers,
  deleteUser,
  updateUser
};