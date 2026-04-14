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
  return `Olá! Bem-vindo à *Pretex Estruturas*. 🏗️

Sou o *PretexBot*, seu assistente para soluções em engenharia. Como posso te ajudar hoje?

1️⃣ Catálogo de Soluções
2️⃣ Status da Obra
3️⃣ Galeria de Projetos
4️⃣ Solicitar Orçamento
5️⃣ Falar com Consultor`;
}

function foraDeHorario() {
  return `Olá! Você entrou em contato com a *Pretex Estruturas*. 👷

No momento nosso time não está online.
🕐 Atendemos de *segunda a sexta, das 08h às 18h*.

Deixe sua dúvida e e-mail que retornamos assim que iniciarmos o expediente!`;
}

function processar(mensagem, de) {
  if (!dentroDoHorario() && !estados[de]) {
    estados[de] = 'fora_horario';
    return foraDeHorario();
  }

  if (!estados[de] ||
      mensagem === 'menu' ||
      mensagem === 'voltar' ||
      mensagem === 'início' ||
      mensagem === 'inicio') {
    estados[de] = 'menu';
    return menu();
  }

  const estado = estados[de];

  // ==================== MENU PRINCIPAL ====================
  if (estado === 'menu') {

    // OPÇÃO 1 — Catálogo
    if (mensagem === '1' || mensagem.includes('catálogo') || mensagem.includes('catalogo') || mensagem.includes('serviço') || mensagem.includes('servico')) {
      estados[de] = 'menu';
      return `Na *Pretex*, unimos estruturas de concreto e metálicas para entregar obras rápidas e de alta performance. 💪

🌾 *Obras Rurais*
Barracões de grãos, garagens de maquinário, salas de ordenha, aviários e confinamentos.

🏢 *Comercial e Residencial*
Barracões comerciais e projetos de uso misto (comércio + residência).

🏭 *Obras Industriais*
Projetos personalizados e execução ágil para todos os setores da indústria.

Deseja ver fotos ou falar com um consultor?

3️⃣ Ver Galeria de Projetos
5️⃣ Falar com Consultor
0️⃣ Voltar ao menu`;
    }

    // OPÇÃO 2 — Status da obra
    if (mensagem === '2' || mensagem.includes('status') || mensagem.includes('obra')) {
      estados[de] = 'status_cpf';
      return `Legal! Vamos verificar o andamento da sua estrutura. 🏗️

Para localizar seu projeto, digite o *CPF ou CNPJ* do titular do contrato (apenas números):`;
    }

    // OPÇÃO 3 — Galeria
    if (mensagem === '3' || mensagem.includes('galeria') || mensagem.includes('portfólio') || mensagem.includes('portfolio') || mensagem.includes('foto')) {
      estados[de] = 'galeria';
      return `Orgulhamo-nos de entregar estruturas que unem força e inovação. 📸

O que você gostaria de visualizar?

1️⃣ Obras Rurais (Barracões e Silos)
2️⃣ Obras Industriais (Plantas e Logística)
3️⃣ Comercial e Misto (Lojas e Residências)
4️⃣ Ver tudo no Instagram`;
    }

    // OPÇÃO 4 — Orçamento
    if (mensagem === '4' || mensagem.includes('orçamento') || mensagem.includes('orcamento') || mensagem.includes('preço') || mensagem.includes('preco')) {
      estados[de] = 'orcamento_finalidade';
      return `Inicie seu orçamento sem compromisso! Em menos de 2 minutos coletamos os dados e encaminhamos para nossos engenheiros. 📝

*Qual a finalidade da obra?*
Ex: Barracão rural, galpão industrial, loja comercial...`;
    }

    // OPÇÃO 5 — Consultor
    if (mensagem === '5' || mensagem.includes('consultor') || mensagem.includes('humano') || mensagem.includes('atendente')) {
      estados[de] = 'consultor_nome';
      return `Com certeza! Vou te conectar com um de nossos consultores. 🤝

Antes, qual o seu *nome* e sobre qual *assunto* você gostaria de falar?`;
    }

    // Não reconhecido
    estados[de] = 'menu';
    return menu();
  }

  // ==================== STATUS DA OBRA ====================
  if (estado === 'status_cpf') {
    estados[de] = 'menu';
    return `Obrigado! Vamos verificar seu projeto com o documento informado. 🔍

Nossa equipe vai confirmar os dados e te retornar em breve com o status atualizado da sua obra.

Digite *menu* para voltar ao início.`;
  }

  // ==================== GALERIA ====================
  if (estado === 'galeria') {
    if (mensagem === '1' || mensagem.includes('rural') || mensagem.includes('barracão') || mensagem.includes('silo')) {
      estados[de] = 'menu';
      return `🌾 *Obras Rurais — Pretex*

Barracões de alto vão livre, otimizados para maquinário e armazenamento de grãos. Rapidez na montagem e durabilidade máxima.

📸 Veja mais projetos rurais:
- Instagram: instagram.com/pretexestruturas
- Site: pretex.com.br

Gostaria de solicitar um orçamento para uma obra rural?

4️⃣ Solicitar Orçamento
0️⃣ Voltar ao menu`;
    }

    if (mensagem === '2' || mensagem.includes('industrial') || mensagem.includes('indústria') || mensagem.includes('industria')) {
      estados[de] = 'menu';
      return `🏭 *Obras Industriais — Pretex*

Estruturas de alta capacidade para os mais diversos setores da indústria. Projetos personalizados com execução ágil.

📸 Veja mais projetos industriais:
- Instagram: instagram.com/pretexestruturas
- Site: pretex.com.br

Gostaria de solicitar um orçamento?

4️⃣ Solicitar Orçamento
0️⃣ Voltar ao menu`;
    }

    if (mensagem === '3' || mensagem.includes('comercial') || mensagem.includes('misto') || mensagem.includes('loja')) {
      estados[de] = 'menu';
      return `🏢 *Obras Comerciais e Mistas — Pretex*

Barracões comerciais e projetos que unem o melhor do comercial e residencial. Soluções completas para o seu negócio.

📸 Veja mais projetos:
- Instagram: instagram.com/pretexestruturas
- Site: pretex.com.br

Gostaria de solicitar um orçamento?

4️⃣ Solicitar Orçamento
0️⃣ Voltar ao menu`;
    }

    if (mensagem === '4' || mensagem.includes('instagram')) {
      estados[de] = 'menu';
      return `📸 Confira todos os nossos projetos no Instagram:

👉 instagram.com/pretexestruturas

E também no nosso site:
🌐 pretex.com.br

Digite *menu* para voltar ao início.`;
    }

    estados[de] = 'menu';
    return menu();
  }

  // ==================== ORÇAMENTO ====================
  if (estado === 'orcamento_finalidade') {
    estados[de] = 'orcamento_cidade';
    return `Ótimo! 

*Qual a cidade e estado da construção?*
Ex: Cascavel/PR, Londrina/PR...

_(Isso define logística e normas de vento da região)_`;
  }

  if (estado === 'orcamento_cidade') {
    estados[de] = 'orcamento_area';
    return `Perfeito!

*Qual a área aproximada da obra?*
Ex: 20x50m, 600m², 1000m²...

_Não sabe ao certo? Coloque uma estimativa que nossos consultores te ajudam a definir o tamanho ideal._`;
  }

  if (estado === 'orcamento_area') {
    estados[de] = 'orcamento_projeto';
    return `Anotado! 

*Você já possui o projeto arquitetônico?*

1️⃣ Sim, já tenho o projeto
2️⃣ Não, preciso desenvolver
3️⃣ Ainda não sei`;
  }

  if (estado === 'orcamento_projeto') {
    estados[de] = 'orcamento_arquivo';
    return `Quase lá! 📎

Se você tiver um *esboço, planta ou foto do terreno*, pode enviar agora. Isso ajuda muito nossa equipe a preparar uma estimativa mais precisa!

Ou se preferir, digite *pular* para finalizar.`;
  }

  if (estado === 'orcamento_arquivo') {
    estados[de] = 'menu';
    return `Dados enviados com sucesso! 🚀

Um de nossos especialistas entrará em contato em breve.
⏱️ Tempo médio de retorno: *até 2 horas* em horário comercial.

Digite *menu* para voltar ao início.`;
  }

  // ==================== CONSULTOR ====================
  if (estado === 'consultor_nome') {
    const nome = mensagem.split(' ')[0];
    estados[de] = 'menu';
    return `Perfeito, *${nome}*! Já avisei a equipe. ⏳

Um consultor assumirá esta conversa em instantes.

🕐 Atendimento humano: *segunda a sexta, das 08h às 18h*

Se precisar de algo mais, digite *menu*.`;
  }

  // Fallback
  estados[de] = 'menu';
  return menu();
}

module.exports = { processar };