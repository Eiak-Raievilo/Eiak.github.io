
const mesAno = document.getElementById("mesAno");
const dias = document.getElementById("dias");

const botaoAnterior = document.getElementById("mesAnterior");
const botaoProximo = document.getElementById("proximoMes");

const formEvento = document.getElementById("formEvento");
const nomeEvento = document.getElementById("nomeEvento");
const listaEventos = document.getElementById("listaEventos");
const tituloEventos = document.getElementById("tituloEventos");

// Data atual
const hoje = new Date();

let mesAtual = hoje.getMonth();
let anoAtual = hoje.getFullYear();

let diaSelecionado = hoje.getDate();

// Eventos salvos no navegador
let eventos = JSON.parse(
    localStorage.getItem("eventosCalendario")
) || {};

// Cria uma chave para cada data
function criarChave(ano, mes, dia) {
    return `${ano}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
}

// Salva os eventos
function salvarEventos() {
    localStorage.setItem(
        "eventosCalendario",
        JSON.stringify(eventos)
    );
}

// Gera o calendário
function gerarCalendario() {

    dias.innerHTML = "";

    const nomeMes = new Date(
        anoAtual,
        mesAtual
    ).toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric"
    });

    mesAno.textContent =
        nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1);

    // Primeiro dia do mês
    const primeiroDia = new Date(
        anoAtual,
        mesAtual,
        1
    ).getDay();

    // Quantidade de dias do mês
    const quantidadeDias = new Date(
        anoAtual,
        mesAtual + 1,
        0
    ).getDate();

    // Espaços antes do primeiro dia
    for (let i = 0; i < primeiroDia; i++) {
        const vazio = document.createElement("div");
        vazio.classList.add("dia", "vazio");
        dias.appendChild(vazio);
    }

    // Cria os dias do mês
    for (let dia = 1; dia <= quantidadeDias; dia++) {

        const elementoDia = document.createElement("div");
        elementoDia.classList.add("dia");

        elementoDia.textContent = dia;

        const chave = criarChave(
            anoAtual,
            mesAtual,
            dia
        );

        // Marca o dia atual
        if (
            dia === hoje.getDate() &&
            mesAtual === hoje.getMonth() &&
            anoAtual === hoje.getFullYear()
        ) {
            elementoDia.classList.add("hoje");
        }

        // Marca o dia selecionado
        if (dia === diaSelecionado) {
            elementoDia.classList.add("selecionado");
        }

        // Mostra um ponto se houver evento
        if (eventos[chave] && eventos[chave].length > 0) {

            const ponto = document.createElement("span");
            ponto.classList.add("ponto-evento");

            elementoDia.appendChild(ponto);
        }

        // Seleciona o dia ao clicar
        elementoDia.addEventListener("click", function() {

            diaSelecionado = dia;

            gerarCalendario();
            mostrarEventos();
        });

        dias.appendChild(elementoDia);
    }
}

// Avança para o próximo mês
botaoProximo.addEventListener("click", function() {

    mesAtual++;

    if (mesAtual > 11) {
        mesAtual = 0;
        anoAtual++;
    }

    diaSelecionado = 1;

    gerarCalendario();
    mostrarEventos();
});

// Volta para o mês anterior
botaoAnterior.addEventListener("click", function() {

    mesAtual--;

    if (mesAtual < 0) {
        mesAtual = 11;
        anoAtual--;
    }

    diaSelecionado = 1;

    gerarCalendario();
    mostrarEventos();
});

// Adiciona um evento
formEvento.addEventListener("submit", function(e) {

    e.preventDefault();

    const texto = nomeEvento.value.trim();

    if (texto === "") {
        return;
    }

    const chave = criarChave(
        anoAtual,
        mesAtual,
        diaSelecionado
    );

    if (!eventos[chave]) {
        eventos[chave] = [];
    }

    eventos[chave].push(texto);

    salvarEventos();

    nomeEvento.value = "";

    gerarCalendario();
    mostrarEventos();
});

// Exibe os eventos do dia selecionado
function mostrarEventos() {

    const chave = criarChave(
        anoAtual,
        mesAtual,
        diaSelecionado
    );

    tituloEventos.textContent =
        `Eventos do dia ${diaSelecionado}`;

    listaEventos.innerHTML = "";

    const eventosDoDia = eventos[chave] || [];

    if (eventosDoDia.length === 0) {

        const mensagem = document.createElement("li");
        mensagem.textContent = "Nenhum evento cadastrado.";

        listaEventos.appendChild(mensagem);

        return;
    }

    eventosDoDia.forEach(function(evento, indice) {

        const item = document.createElement("li");

        const texto = document.createElement("span");
        texto.textContent = evento;

        const botaoExcluir = document.createElement("button");
        botaoExcluir.textContent = "Excluir";

        botaoExcluir.addEventListener("click", function() {

            eventos[chave].splice(indice, 1);

            if (eventos[chave].length === 0) {
                delete eventos[chave];
            }

            salvarEventos();

            gerarCalendario();
            mostrarEventos();
        });

        item.appendChild(texto);
        item.appendChild(botaoExcluir);

        listaEventos.appendChild(item);
    });
}

// Inicializa o site
gerarCalendario();
mostrarEventos();
