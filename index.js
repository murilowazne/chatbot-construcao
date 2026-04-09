require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const respostas = require('./respostas');

app.post('/webhook', (req, res) => {
  const mensagem = req.body.Body?.toLowerCase().trim();
  const de = req.body.From;

  console.log(`Mensagem de ${de}: ${mensagem}`);

  const resposta = respostas.processar(mensagem, de);

  res.set('Content-Type', 'text/xml');
  res.send(`
    <Response>
      <Message>${resposta}</Message>
    </Response>
  `);
});

app.get('/', (req, res) => res.send('Bot de construção civil rodando!'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));