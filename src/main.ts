class Instrutor {
  //atributos
  nome: string;
  email: string;

  //construtor
  constructor(nome: string, email: string) {
    this.nome = nome;
    this.email = email;
  }
  //metodos
  apresentar(): string {
    return `Instrutor: ${this.nome} (${this.email})`;
  }
}

class Participante {
  //atributos
  nome: string;
  email: string;
  idade: number;
  //construtor
  constructor(nome: string, email: string, idade: number) {
    this.nome = nome;
    this.email = email;
    this.idade = idade;
  }
  //metodos
  apresentar(): string {
    return `${this.nome} tem ${this.idade} anos e participa da oficina.`;
  }
}

class Oficina {
  //atributos
  nome: string;
  area: string;
  duracao: number;
  instrutor?: Instrutor;
  lista_participantes: Participante[];
  //construtor
  constructor(nome: string, area: string, duracao: number) {
    this.nome = nome;
    this.area = area;
    this.duracao = duracao;
    this.lista_participantes = [];
  }
  //metodos
  //metodo para adicionar participante
  adicionar_participante(participante: Participante): void {
    this.lista_participantes.push(participante);
  }

  //metodo para vincular um instrutor a oficina
  associar_instrutor(instrutor: Instrutor): void {
    this.instrutor = instrutor;
  }

  //monta uma mensagem com os dados da oficina para exibir na interface
  exibir_detalhes(): string {
    const instrutorInfo = this.instrutor
      ? this.instrutor.apresentar()
      : "Instrutor ainda não definido";
    const participantes =
      this.lista_participantes.length > 0
        ? this.lista_participantes
            .map((p) => `- ${p.nome} (${p.idade} anos)`)
            .join("<br>")
        : "Nenhum participante cadastrado ainda.";

    return `
      <strong>Oficina:</strong> ${this.nome}<br>
      <strong>Área:</strong> ${this.area}<br>
      <strong>Duração:</strong> ${this.duracao} horas<br>
      <strong>Instrutor:</strong> ${instrutorInfo}<br>
      <strong>Participantes:</strong><br>
      ${participantes}
    `;
  }
}

class SistemaFeira {
  //atributos
  oficinas: Oficina[];
  //construtor
  constructor() {
    this.oficinas = [];
  }
  //metodos
  //adiciona uma nova oficina ao sistema
  cadastrarOficina(oficina: Oficina): void {
    this.oficinas.push(oficina);
  }

  //procura uma oficina pelo nome informado
  buscarOficinaPorNome(nome: string): Oficina | undefined {
    return this.oficinas.find((oficina) => oficina.nome === nome);
  }

  //retorna todas as oficinas cadastradas
  listarOficinas(): Oficina[] {
    return this.oficinas;
  }
}

//instancia global do sistema da feira de oficinas
const sistema = new SistemaFeira();

//atualiza os selects com as oficinas cadastradas para manter a interface sincronizada
function atualizarOpcoesSelects(): void {
  const selectsOficina = [
    document.getElementById("oficinaInstrutor") as HTMLSelectElement,
    document.getElementById("oficinaParticipante") as HTMLSelectElement,
    document.getElementById("oficinaParticipanteLista") as HTMLSelectElement,
  ];

  selectsOficina.forEach((select) => {
    if (!select) return;

    const atual = select.value;
    select.innerHTML = '<option value="">Selecione uma oficina</option>';

    sistema.listarOficinas().forEach((oficina) => {
      const option = document.createElement("option");
      option.value = oficina.nome;
      option.textContent = oficina.nome;
      if (atual && atual === oficina.nome) {
        option.selected = true;
      }
      select.appendChild(option);
    });

    if (
      select.id === "oficinaParticipanteLista" &&
      sistema.listarOficinas().length > 0 &&
      !atual
    ) {
      select.value = sistema.listarOficinas()[0].nome;
    }
  });
}

//renderiza todas as oficinas na interface principal da pagina
function renderizarOficinas(): void {
  const container = document.getElementById("listaOficinas");
  if (!container) return;

  //mostra uma mensagem quando ainda nao existe nenhuma oficina cadastrada
  if (sistema.listarOficinas().length === 0) {
    container.innerHTML = "<p>Nenhuma oficina cadastrada.</p>";
    return;
  }

  container.innerHTML = sistema
    .listarOficinas()
    .map((oficina) => {
      const participantes =
        oficina.lista_participantes.length > 0
          ? oficina.lista_participantes
              .map((p) => `<li>${p.nome} - ${p.idade} anos</li>`)
              .join("")
          : "<li>Nenhum participante cadastrado.</li>";

      return `
        <article class="card-oficina">
          <h3>${oficina.nome}</h3>
          <p><strong>Área:</strong> ${oficina.area}</p>
          <p><strong>Duração:</strong> ${oficina.duracao} horas</p>
          <p><strong>Instrutor:</strong> ${oficina.instrutor ? oficina.instrutor.nome : "Não informado"}</p>
          <ul>${participantes}</ul>
        </article>
      `;
    })
    .join("");
}

//exibe os participantes da oficina selecionada na lista de participantes
function renderizarParticipantes(): void {
  const select = document.getElementById(
    "oficinaParticipanteLista",
  ) as HTMLSelectElement;
  const container = document.getElementById("listaParticipantes");

  if (!select || !container) return;

  const nomeSelecionado = select.value;
  const oficina = sistema.buscarOficinaPorNome(nomeSelecionado);

  if (!oficina) {
    container.innerHTML =
      "<p>Selecione uma oficina para visualizar os participantes.</p>";
    return;
  }

  if (oficina.lista_participantes.length === 0) {
    container.innerHTML = `<p>A oficina ${oficina.nome} ainda não possui participantes.</p>`;
    return;
  }

  container.innerHTML = `
    <h3>${oficina.nome}</h3>
    <ul>
      ${oficina.lista_participantes
        .map((p) => `<li>${p.nome} - ${p.email} - ${p.idade} anos</li>`)
        .join("")}
    </ul>
  `;
}

//função central que atualiza a interface após qualquer alteração no sistema
function renderizarTudo(): void {
  atualizarOpcoesSelects();
  renderizarOficinas();
  renderizarParticipantes();
}

//formulario para cadastrar uma nova oficina
const formOficina = document.getElementById(
  "formOficina",
) as HTMLFormElement | null;
if (formOficina) {
  formOficina.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const nome = (
      document.getElementById("nomeOficina") as HTMLInputElement
    ).value.trim();
    const area = (
      document.getElementById("areaOficina") as HTMLInputElement
    ).value.trim();
    const duracao = Number(
      (document.getElementById("duracaoOficina") as HTMLInputElement).value,
    );

    if (!nome || !area || !duracao) return;

    //cria a oficina e salva no sistema
    const oficina = new Oficina(nome, area, duracao);
    sistema.cadastrarOficina(oficina);
    formOficina.reset();
    renderizarTudo();
  });
}

//formulario para associar um instrutor a uma oficina
const formInstrutor = document.getElementById(
  "formInstrutor",
) as HTMLFormElement | null;
if (formInstrutor) {
  formInstrutor.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const nome = (
      document.getElementById("nomeInstrutor") as HTMLInputElement
    ).value.trim();
    const email = (
      document.getElementById("emailInstrutor") as HTMLInputElement
    ).value.trim();
    const oficinaSelecionada = (
      document.getElementById("oficinaInstrutor") as HTMLSelectElement
    ).value;

    if (!nome || !email || !oficinaSelecionada) return;

    const oficina = sistema.buscarOficinaPorNome(oficinaSelecionada);
    if (!oficina) return;

    //cria o instrutor e vincula a oficina escolhida
    const instrutor = new Instrutor(nome, email);
    oficina.associar_instrutor(instrutor);
    formInstrutor.reset();
    renderizarTudo();
  });
}

//formulario para cadastrar um participante em uma oficina
const formParticipante = document.getElementById(
  "formParticipante",
) as HTMLFormElement | null;
if (formParticipante) {
  formParticipante.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const nome = (
      document.getElementById("nomeParticipante") as HTMLInputElement
    ).value.trim();
    const email = (
      document.getElementById("emailParticipante") as HTMLInputElement
    ).value.trim();
    const idade = Number(
      (document.getElementById("idadeParticipante") as HTMLInputElement).value,
    );
    const oficinaSelecionada = (
      document.getElementById("oficinaParticipante") as HTMLSelectElement
    ).value;

    if (!nome || !email || !idade || !oficinaSelecionada) return;

    const oficina = sistema.buscarOficinaPorNome(oficinaSelecionada);
    if (!oficina) return;

    //cria o participante e adiciona na oficina selecionada
    const participante = new Participante(nome, email, idade);
    oficina.adicionar_participante(participante);
    formParticipante.reset();
    renderizarTudo();
  });
}

//quando o usuario trocar a oficina na lista, atualiza os participantes exibidos
const selectLista = document.getElementById(
  "oficinaParticipanteLista",
) as HTMLSelectElement | null;
if (selectLista) {
  selectLista.addEventListener("change", renderizarParticipantes);
}

renderizarTudo();
