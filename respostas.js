const estados = {};

function dentroDoHorario() {
  const agora = new Date();
  const options = { timeZone: 'America/Sao_Paulo', hour: 'numeric', weekday: 'short' };
  const partes = new Intl.DateTimeFormat('pt-BR', options).formatToParts(agora);
  const dia = partes.find(p => p.type === 'weekday').value;
  const hora = parseInt(partes.find(p => p.type === 'hour').value);
  const fimDeSemana = dia === 'sáb' || dia === 'dom';
  return !fimDeSemana && hora >= 8 && hora < 18;
}

function menu() {
  return `Olá! Seja bem-vindo à *Pretex Estruturas*. 🏗️

Sou o *PretexBot*, assistente virtual da Pretex. Para agilizar seu atendimento, escolha uma opção:

1️⃣ Novo Cliente
2️⃣ Já sou Cliente
3️⃣ Catálogo de Obras`;
}

function foraDeHorario() {
  return `Olá! Obrigado por entrar em contato com a *Pretex Estruturas*.

Nosso horário de atendimento é de segunda a sexta, das 08h às 18h.

Deixe sua dúvida aqui que retornamos no próximo expediente.`;
}

function processar(mensagem, de) {
  if (!dentroDoHorario() && !estados[de]) {
    estados[de] = 'fora_horario';
    return foraDeHorario();
  }

  if (!estados[de] ||
      mensagem === 'menu' ||
      mensagem === 'voltar' ||
      mensagem === 'inicio' ||
      mensagem === 'início') {
    estados[de] = 'menu';
    return menu();
  }

  const estado = estados[de];

  // MENU PRINCIPAL
  if (estado === 'menu') {

    // OPÇÃO 1 — Novo Cliente
    if (mensagem === '1' || mensagem.includes('novo') || mensagem.includes('orçamento') || mensagem.includes('orcamento') || mensagem.includes('informação')) {
      estados[de] = 'novo_cliente';
      return `Excelente! Nossa engenharia está pronta para analisar o seu projeto. 📝

Para agilizar o atendimento, me informe:

👤 Seu nome:
📍 Cidade e estado da obra:
🏗️ O que você busca? (Ex: galpão rural, comercial, industrial ou apenas informações)

Assim que enviar, um consultor assume a conversa com você!`;
    }

    // OPÇÃO 2 — Já sou Cliente
    if (mensagem === '2' || mensagem.includes('cliente') || mensagem.includes('suporte') || mensagem.includes('status')) {
      estados[de] = 'menu';
      return `Perfeito! Sua obra é nossa prioridade. 👷

Estou notificando nossa equipe técnica agora mesmo. Um especialista entrará em contato em breve para tratar do seu projeto.

Aguarde um instante!`;
    }

    // OPÇÃO 3 — Catálogo
    if (mensagem === '3' || mensagem.includes('catálogo') || mensagem.includes('catalogo') || mensagem.includes('projeto') || mensagem.includes('portfólio') || mensagem.includes('obra')) {
      estados[de] = 'menu';
      return `É um prazer compartilhar nossa trajetória com você! 📸

Confira nosso portfólio completo:
🔗 pretex.com.br
📷 instagram.com/pretexestruturas

Ficou com alguma dúvida sobre nossos projetos? É só digitar aqui que te ajudo!`;
    }

    // Mensagem livre — trata como dúvida
    estados[de] = 'menu';
    return `Entendi! Vou direcionar sua mensagem para um de nossos consultores.

Enquanto isso, escolha uma opção se preferir:

1️⃣ Novo Cliente
2️⃣ Já sou Cliente
3️⃣ Catálogo de Obras`;
  }

  // NOVO CLIENTE — coleta os dados
  if (estado === 'novo_cliente') {
    estados[de] = 'menu';
    return `Dados recebidos! ✅

Um consultor da Pretex assumirá esta conversa em breve.
⏱️ Tempo médio de resposta: até 2 horas em horário comercial.

Qualquer dúvida é só digitar aqui. Digite *menu* para voltar ao início.`;
  }

  // Fallback
  estados[de] = 'menu';
  return menu();
}

module.exports = { processar };