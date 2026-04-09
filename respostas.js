// Guarda o estado de cada conversa (por número de telefone)
const estados = {};

// Horário de atendimento: seg-sex 8h-18h (fuso de Brasília)
function dentroDoHorario() {
  const agora = new Date();
  const options = { timeZone: 'America/Sao_Paulo', hour: 'numeric', minute: 'numeric', weekday: 'short' };
  const partes = new Intl.DateTimeFormat('pt-BR', options).formatToParts(agora);
  const dia = partes.find(p => p.type === 'weekday').value; // 'seg', 'ter'...
  const hora = parseInt(partes.find(p => p.type === 'hour').value);
  const fimDeSemana = dia === 'sáb' || dia === 'dom';
  return !fimDeSemana && hora >= 8 && hora < 18;
}

function saudacao() {
  return `Olá! Seja bem-vindo à *Pretex Engenharia e Construção*. 🏗️

Sou o assistente virtual da Pretex e estou aqui para agilizar seu atendimento. Como posso te ajudar hoje?

1️⃣ Solicitar um Orçamento
2️⃣ Conhecer nossos Serviços
3️⃣ Ver Obras Realizadas (Portfólio)
4️⃣ Falar com um Consultor`;
}

function foraDeHorario() {
  return `Olá! Você entrou em contato com a *Pretex Engenharia e Construção*. 👷‍♂️

No momento nosso time técnico não está online.
🕐 Atendemos de *segunda a sexta, das 08h às 18h*.

Deixe sua dúvida e seu e-mail abaixo que entraremos em contato assim que iniciarmos o expediente!`;
}

function processar(mensagem, de) {
  // Fora do horário: só aceita a primeira mensagem com aviso
  if (!dentroDoHorario() && !estados[de]) {
    estados[de] = 'fora_horario';
    return foraDeHorario();
  }

  // Inicializa estado se for novo contato
  if (!estados[de]) {
    estados[de] = 'menu';
    return saudacao();
  }

  const estado = estados[de];

  // --- MENU PRINCIPAL ---
  if (estado === 'menu' || mensagem.includes('menu') || mensagem.includes('voltar')) {
    if (mensagem === '1' || mensagem.includes('orçamento') || mensagem.includes('orcamento')) {
      estados[de] = 'orcamento_nome';
      return `Perfeito! Para que nosso engenheiro possa te dar um retorno preciso, preciso de algumas informações. 📋

*Qual o seu nome e cidade?*`;
    }

    if (mensagem === '2' || mensagem.includes('serviço') || mensagem.includes('servico') || mensagem.includes('serviços')) {
      estados[de] = 'menu';
      return `A *Pretex Engenharia* atua em:

🏠 *Reformas residenciais* — cozinha, banheiro, ambientes completos
🧱 *Alvenaria* — construção de muros, paredes, ampliações
🎨 *Acabamento* — pintura, revestimentos, pisos e tetos
🔧 *Hidráulica e elétrica* — instalações e manutenções
🏢 *Obras comerciais e industriais*

Quer solicitar um orçamento para algum desses serviços? Digite *1* para continuar.`;
    }

    if (mensagem === '3' || mensagem.includes('portfólio') || mensagem.includes('portfolio') || mensagem.includes('obras')) {
      estados[de] = 'portfolio';
      return `Trabalhamos com excelência em cada detalhe! ✨

Confira nossas obras em:
🌐 Site: pretex.com.br/portfolio
📸 Instagram: @pretex_engenharia

Gostaria de agendar uma visita em alguma obra nossa em andamento?

1️⃣ Sim, quero agendar uma visita
2️⃣ Voltar ao menu principal`;
    }

    if (mensagem === '4' || mensagem.includes('consultor') || mensagem.includes('humano') || mensagem.includes('atendente')) {
      estados[de] = 'menu';
      return `Entendido! Estou transferindo você para um de nossos especialistas. 👷

⏱️ O tempo médio de resposta é de *até 30 minutos* em horário comercial.

Enquanto isso, sinta-se à vontade para enviar *fotos ou plantas* do seu terreno/imóvel aqui no chat!`;
    }

    // Mensagem não reconhecida no menu
    estados[de] = 'menu';
    return saudacao();
  }

  // --- FLUXO DE ORÇAMENTO ---
  if (estado === 'orcamento_nome') {
    estados[de] = 'orcamento_tipo';
    return `Obrigado! 😊

*Qual o tipo de obra?*

1️⃣ Residencial
2️⃣ Comercial
3️⃣ Industrial`;
  }

  if (estado === 'orcamento_tipo') {
    estados[de] = 'orcamento_projeto';
    return `Entendido! Última pergunta:

*Você já possui o projeto em mãos ou precisa que a Pretex desenvolva?*

1️⃣ Já tenho o projeto
2️⃣ Preciso que a Pretex desenvolva
3️⃣ Ainda não sei`;
  }

  if (estado === 'orcamento_projeto') {
    estados[de] = 'menu';
    return `Perfeito! Suas informações foram registradas com sucesso. ✅

Um de nossos engenheiros entrará em contato em breve para dar sequência ao seu orçamento.

⏱️ Tempo médio de retorno: *até 1 dia útil*.

Posso te ajudar com mais alguma coisa?

1️⃣ Orçamento  2️⃣ Serviços  3️⃣ Portfólio  4️⃣ Consultor`;
  }

  // --- FLUXO DE PORTFÓLIO ---
  if (estado === 'portfolio') {
    if (mensagem === '1' || mensagem.includes('sim') || mensagem.includes('visita')) {
      estados[de] = 'menu';
      return `Ótimo! 🗓️ Um consultor vai entrar em contato para agendar a visita conforme sua disponibilidade.

Mais alguma coisa que posso ajudar?`;
    }
    estados[de] = 'menu';
    return saudacao();
  }

  // Fallback geral
  estados[de] = 'menu';
  return saudacao();
}

module.exports = { processar };