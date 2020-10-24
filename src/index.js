const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const {startDatabase} = require('./database/mongoDB');
const {insertUser, getUsers, deleteUser, updateUser} = require('./controllers/users');
const stage = require('./config')[environment];

// declarando o Express app
const app = express();

// habilitando CORS para as requisições
app.use(cors());
// bodyParser para transformar JSON em objetos JS.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
// morgan para logar as requisições HTTP.
app.use(morgan('combined'));
// adicionando Helmet para segurança do app
app.use(helmet());

// definindo endpoint para retornar as requisições
app.get('/', async (req, res) => {
  res.send(await getUsers());
});

// endpoint para inserir novo usuário
app.post('/', async (req, res) => {
  const newUser = req.body;
  await insertUser(newUser);
  res.send({ message: 'New user inserted.' });
});

// endpoint para deletar usuário
app.delete('/:id', async (req, res) => {
  await deleteUser(req.params.id);
  res.send({ message: 'User removed.' });
});

// endpoint para atualizar usuário
app.put('/:id', async (req, res) => {
  const updatedUser = req.body;
  await updateUser(req.params.id, updatedUser);
  res.send({ message: 'User updated.' });
});


// Inicia a instância do MongoDB in-memory
startDatabase().then(async () => {
  // Primeira inserção 
  // Novas inserções chamar localhost:3001 com o seguinte body abaixo no postman ou insomnia
  await insertUser(
    {
      "login": "paulo-raoni",
      "password": "abc123@",
      "name": "Paulo Raoni",
      "email": "raoni_jkd@hotmail.com"
    }
  );

  // Iniciando o servidor
  app.listen(`${stage.port}`, () => {
    console.log(`Listening on port ${stage.port}`);
  });
});
