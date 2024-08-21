var tela = 0;
var largura = 150;
var altura = 50;
var xmenu = 225;
var ymenu1 = 200;
var ymenu2 = 280;
var ymenu3 = 360;
var xvoltar = 450;
var yvoltar = 520;
var larguravoltar = 80;
var alturavoltar = 25;
var xsom = 20;
var ysom = 20;
var largurasom = 80;
var alturasom = 25;
var somLigado = true;
var venceu = false;
var tempoAcabou = false;

var imagemfundomenu,
  imagemcreditos,
  fonte,
  som,
  sommouse,
  cartavirada,
  gifganhou,
  gifperdeu;
var cartaLargura = 100; // Largura das cartas
var cartaAltura = 100; // Altura das cartas
var numColunas = 4; // Número de colunas no tabuleiro
var numLinhas = 4; // Número de linhas no tabuleiro
var espaco = 10; // Espaço entre as cartas
var cartasViradas = []; // Array de estado das cartas (viradas ou não)
var cartasFacil = []; // Array de cartas para nível fácil
var cartasMedio = [];
var cartasDificil = [];
var cartasPosicoes = []; // Posições das cartas
var cartasSelecionadas = []; // Cartas atualmente selecionadas
var cartasViradasFacil = []; // Cartas viradas para nível fácil
var cartasViradasMedio = [];
var cartasViradasDificil = [];
var indicesSelecionados = []; // Índices das cartas selecionadas
var paresEncontrados = 0; // Conta o número de pares encontrados
var totalPares; // Total de pares no jogo
var tempoFacil = 90; // 1 minuto e 30 segundos
var tempoMedio = 60; // 1 minuto
var tempoDificil = 30; // 30 segundos
var tempoRestante; // Tempo restante atual
var intervalo; // Intervalo do temporizador
var faseAtual; // Fase atual do jogo
var cartasEmbaralhadas = []; // Array de cartas embaralhadas

// Função para pré-carregar imagens e sons
function preload() {
  imagemfundomenu = loadImage("Tela_Inicial.png");
  imagemcreditos = loadImage("Imagem_Creditos.png");
  imagemfundofases = loadImage("Imagem_Fundo_Fases.png");
  cartavirada = loadImage(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLiFVWAaZF7B_72qfqQsLFifeExMxJtc5YQQ&s"
  );
  gifganhou = createImg(
    "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZWlhcjNlbnNlcWZ5MDh3OXkxemY3a3N4NjFjNnlpa3p1ZTEyNW8xdCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/cW64pEEZe0YZa/200w.webp",
    "imagem de gato feliz"
  );
  gifganhou.hide();
  gifperdeu = createImg(
    "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExYWN1azA4NGZ1b3llbGVkajdtcG5pdDEwdDljbGhycjZmMW5sdzZ2ayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/vrW1WOuLpWB8s/giphy.webp",
    "imagem de gato triste"
  );
  gifperdeu.hide(); // Oculta o GIF até ser necessário
  // Carrega as imagens das cartas para cada nível de dificuldade
  carregarImagensCartas();
  fonte = loadFont("Fuzzy_Bubbles_Regular.ttf");
  som = loadSound("30. The Mwaken Village.mp3");
  console.log(
    imagemfundomenu,
    imagemcreditos,
    cartavirada,
    gifganhou,
    gifperdeu,
    fonte,
    som
  ); // Exibe informações no console
}

function setup() {
  createCanvas(600, 600);
  textAlign(CENTER);
  noStroke();
  textFont(fonte);
  som.loop(); // Inicia o som em loop
  totalPares = (numColunas * numLinhas) / 2; // Calcula o total de pares
  iniciarTemporizador(); // Inicia o temporizador
}

// Função para embaralhar as cartas com base na dificuldade
function embaralharCartas(dificuldade) {
  var cartas;

  // Seleciona o array de cartas baseado na dificuldade
  if (dificuldade === "facil") {
    totalPares = 8;
    cartas = cartasFacil;
  } else if (dificuldade === "medio") {
    totalPares = 8; // 4 colunas x 4 linhas / 2 = 8 pares
    cartas = cartasMedio;
  } else if (dificuldade === "dificil") {
    totalPares = 8;
    cartas = cartasDificil;
  } else {
    console.error("Dificuldade inválida");
    return;
  }

  // Embaralha as cartas e cria um array de cartas embaralhadas
  cartasEmbaralhadas = shuffle(cartas.concat(cartas));

  // Verifique se as cartas foram carregadas corretamente
  for (let i = 0; i < cartasEmbaralhadas.length; i++) {
    if (!cartasEmbaralhadas[i]) {
      console.error(`Carta não carregada para o índice ${i}`);
    }
  }

  // Inicializa o array de cartas viradas
  cartasViradas = new Array(cartasEmbaralhadas.length).fill(false);
}

// Função para desenhar a tela do menu
function telaMenu() {
  background(imagemfundomenu);
  textFont(fonte);
  textSize(50);
  fill(0);
  textAlign(CENTER);
  text("JOGO DA MEMÓRIA", width / 2, 130);
  textSize(20);
  desenhaBotao("Jogar", xmenu, ymenu1, largura, altura, 1);
  desenhaBotao("Créditos", xmenu, ymenu2, largura, altura, 2);
  desenhaBotao("Informações", xmenu, ymenu3, largura, altura, 3);
  desenhaBotaoSom();
}

// Função para desenhar a tela de seleção de dificuldade
function telaJogar() {
  background(imagemfundomenu);
  textFont(fonte);
  textSize(40);
  fill(0);
  textAlign(CENTER);
  text("SELECIONAR DIFICULDADE", width / 2, 100);
  textSize(20);
  desenhaBotao("Fácil", xmenu, ymenu1, largura, altura, 4);
  desenhaBotao("Médio", xmenu, ymenu2, largura, altura, 5);
  desenhaBotao("Difícil", xmenu, ymenu3, largura, altura, 6);
  desenhaBotaoVoltar(
    "Voltar",
    xvoltar,
    yvoltar,
    larguravoltar,
    alturavoltar,
    0
  );
  desenhaBotaoSom();
}

// Função para desenhar a tela de créditos
function telaCreditos() {
  background(imagemcreditos);
  textSize(50);
  text("CRÉDITOS", width / 2, 100);
  textSize(20);
  desenhaBotaoVoltar(
    "Voltar",
    xvoltar,
    yvoltar,
    larguravoltar,
    alturavoltar,
    0
  );
}

// Função para desenhar a tela de informações
function telaInformacoes() {
  background(imagemfundomenu);
  textSize(18);
  text("Teste sua memória e rapidez para vencer!", width / 2, 150);
  text("Memorize as imagens e selecione as combinações,", width / 2, 170);
  textSize(15);
  text(
    " e encontre todos os pares de cartas iguais no menor tempo possível,",
    width / 2,
    190
  );
  textSize(18);
  text("Boa sorte e divirta-se!!!!", width / 2, 210);
  textSize(40);
  text("INFORMAÇÕES", width / 2, 100);
  desenhaBotaoVoltar(
    "Voltar",
    xvoltar,
    yvoltar,
    larguravoltar,
    alturavoltar,
    0
  );
}

//Desenha o botão voltar
function desenhaBotaoVoltar(texto, x, y, largura, altura, proxTela) {
  if (mouseX > x && mouseX < x + largura && mouseY > y && mouseY < y + altura) {
    stroke(0);
    fill(245, 245, 220);
    if (mouseIsPressed) {
      tela = proxTela;
    }
  } else {
    stroke(0);
    fill(173, 216, 230);
  }
  rect(x, y, largura, altura, 20);
  fill(0);
  textSize(20);
  text(texto, x + largura / 2, y + altura - 7);
}

//Desenho de cada carta
function desenhaCartaIndividual(x, y, imagem) {
  image(imagem, x, y, cartaLargura, cartaAltura);
}

//Define a posição de cada carta(Analisa cada indice)
function calcularPosicaoCarta(indice) {
  // Calcula a coluna onde a carta deve ser posicionada
  var col = indice % numColunas;
  // Calcula a linha
  var linha = Math.floor(indice / numColunas);
  // Calcula a posição horizontal (x) da carta // Adiciona o deslocamento horizontal baseado na coluna // centraliza o tabuleiro horizontalmente
  var x =
    (width - (numColunas * cartaLargura + (numColunas - 1) * espaco)) / 2 +
    col * (cartaLargura + espaco);
  // Calcula a posição vertical (y) da carta
  var y =
    (height - (numLinhas * cartaAltura + (numLinhas - 1) * espaco)) / 2 +
    linha * (cartaAltura + espaco);
  // Retorna as coordenadas x e y da carta
  return { x: x, y: y };
}

//desenho das cartas no tabuleiro,  analisando sua posiçaõ e indice para virar e desvirar
function desenhaCartas(cartas, cartasViradas) {
  for (var i = 0; i < cartas.length; i++) {
    var posicao = calcularPosicaoCarta(i);
    var x = posicao.x;
    var y = posicao.y;

    if (cartasViradas[i]) {
      // Desenha a carta virada para cima
      desenhaCartaIndividual(x, y, cartas[i]);
    } else {
      // Desenha a carta virada para baixo
      desenhaCartaIndividual(x, y, cartavirada); // cartaDeFundo é a imagem da carta virada para baixo
    }
  }
}
// Funçaõ para a tela de seleção de dificuldade
function telaDificuldade() {
  background(255, 228, 225);
  desenhaBotaoVoltar(
    "Voltar",
    xvoltar,
    yvoltar,
    larguravoltar,
    alturavoltar,
    1
  );
  desenhaCartas(cartasEmbaralhadas, cartasViradas);
  verificarSelecaoCarta();
  desenharTemporizador();
}

function TelaFacil() {
  telaDificuldade();
}

function TelaMedio() {
  telaDificuldade();
}

function TelaDificil() {
  telaDificuldade();
}

// Função para verificar a seleção de uma carta pelo usuário
function verificarSelecaoCarta() {
  // Loop para percorrer todas as colunas
  for (var i = 0; i < numColunas; i++) {
    // Loop para percorrer todas as linhas
    for (var j = 0; j < numLinhas; j++) {
      // Calcula o índice da carta com base na coluna e linha
      var index = i + j * numColunas;
      // Obtém a posição (x, y) da carta usando a função calcularPosicaoCarta
      var pos = calcularPosicaoCarta(index);
      var x = pos.x;
      var y = pos.y;
      // Verifica se a posição do mouse está dentro da área da carta e se o mouse está pressionado
      if (
        mouseX > x &&
        mouseX < x + cartaLargura &&
        mouseY > y &&
        mouseY < y + cartaAltura &&
        mouseIsPressed
      ) {
        // Verifica se a carta ainda não foi virada e se há menos de 2 cartas selecionadas
        if (!cartasViradas[index] && cartasSelecionadas.length < 2) {
          // Marca a carta como virada
          cartasViradas[index] = true;
          // Adiciona o índice da carta ao array de cartas selecionadas
          cartasSelecionadas.push(index);
          // Se houver 2 cartas selecionadas, verifica se formam um par após um breve atraso
          if (cartasSelecionadas.length === 2) {
            setTimeout(() => verificarPar(), 500);
          }
        }
        // Retorna da função após processar a seleção
        return;
      }
    }
  }
}

// Função para verificar se as duas cartas selecionadas formam um par
function verificarPar() {
  // verifica as duas cartas selecionadas
  var [primeiraCarta, segundaCarta] = cartasSelecionadas;
  // Verifica se as cartas selecionadas são iguais
  if (cartasEmbaralhadas[primeiraCarta] === cartasEmbaralhadas[segundaCarta]) {
    // Se forem iguais, incrementa o contador de pares encontrados
    paresEncontrados++;
    // Verifica se todos os pares foram encontrados
    if (paresEncontrados === totalPares) {
      // Se todos os pares foram encontrados, aguarda 500ms e exibe a tela de vitórias
      setTimeout(() => {
        tela = 7; // Exibir tela de vitória
      }, 500);
    }
  } else {
    // Se as cartas não formam um par, desvira as cartas
    cartasViradas[primeiraCarta] = false;
    cartasViradas[segundaCarta] = false;
  }
  // Limpa a lista de cartas selecionadas
  cartasSelecionadas = [];
}

// função global para o desenho do botão
function desenhaBotao(texto, x, y, largura, altura, proxTela) {
  if (mouseX > x && mouseX < x + largura && mouseY > y && mouseY < y + altura) {
    stroke(0);
    fill(245, 245, 220);
  } else {
    stroke(0);
    fill(173, 216, 230);
  }
  rect(x, y, largura, altura, 20);
  fill(0);
  text(texto, x + largura / 2, y + altura - 15);
}
//função para carregar as imagens das cartas
function carregarImagensCartas() {
  // Carrega as imagens para cada nível de dificuldade

  cartasFacil = [
    loadImage(
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqL3fayyxk3kWajxJMQu25mfCag_d_mzMo-krH1A4WQpEdiEPm6BeVLTT8N4nts7H53-g&usqp=CAU"
    ),
    loadImage(
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoYg55rCVKVJz1op9qnBejYy8nUsVnk8ExakR8_UrtuPdAZov_AT0XIanhayh0tP1QjLg&usqp=CAU"
    ),
    loadImage(
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-a-l2qZ54I_jBv8IOGTAbRGBJLGHofxPxd9Tq8yveqjBAiT1AibGsiimhVezmWhRwEQM&usqp=CAU"
    ),
    loadImage(
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShAnKNcqynQkupBtf6UGELaXJdnP_DpV_RRQ&s"
    ),
    loadImage(
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQl08BAB9CDp813O4XZxR8yBbsQD3_CNvRwieqD-4hKIUQ1kIn1C4OPoThANU4SeiPgz4Q&usqp=CAU"
    ),
    loadImage(
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQja8FSovYVWRVT6KJEtybwRYRrBEyxNmciFg&s"
    ),
    loadImage(
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHV9TVqTdLkhyIfrskWl3mv3BfaS3DGYlaUD9sYU8VJfuDdRsMbGc6Uo738ITQY4_mr_E&usqp=CAU"
    ),
    loadImage(
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTNw_eCS3jF1_QWDbLtNuHdG1l9Yea-r71LgK3cp3zy9Mt_g0g_9EC983Z5hOwJGS6yYo&usqp=CAU"
    ),
  ];

  cartasMedio = [
    loadImage(
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBcUkhNZnZI0XnN3hWxxnhnP2lbo3FfJYxUon2Tl3M6fTVjt03mF6vfOb04lyRs-5rD-g&usqp=CAU"
    ),
    loadImage(
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-quG8vFX7BkSGB5FzhQH5foylg0w43GphhNUS0gm4wA2l52EtzajPP7cqGqGfAtxSBG8&usqp=CAU"
    ),
    loadImage(
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbHWEQYPiWqEcKpJz_FQ12aSzyL0QkMB80ID2oAyU_1M6hLTQonFTIlyvzUms7516xKcE&usqp=CAU"
    ),
    loadImage(
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAjRlhRbN97rzrrWf_Ruj5cQQ1a55Xh_jFZ8JOoV-7JgJ7Yj8OJGrQppj8DCLDkGUCvPY&usqp=CAU"
    ),
    loadImage(
      "https://i0.wp.com/techwek.com/wp-content/uploads/2020/12/Gato-assustado..jpg?resize=700%2C933&ssl=1"
    ),
    loadImage(
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlEmpr9Mny1qDQl9U6jkFax7sh9fqVGLcmPA&s"
    ),
    loadImage(
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFURlZ21jNcssNyMG7hEGOG_CRbq3je0xKBQ&s"
    ),
    loadImage(
      "https://thumbs.dreamstime.com/b/gato-peludo-liso-saindo-pela-l%C3%ADngua-crescendo-pelo-fazendo-cara-engra%C3%A7ado-retrato-de-est%C3%BAdio-um-que-se-enfia-engra%C3%A7ada-213730750.jpg"
    ),
  ];

  cartasDificil = [
    loadImage(
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAjRlhRbN97rzrrWf_Ruj5cQQ1a55Xh_jFZ8JOoV-7JgJ7Yj8OJGrQppj8DCLDkGUCvPY&usqp=CAU"
    ),
    loadImage(
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGbrdzpFQzLGCi-2XyaTS7VKySwJQikNCCsA&s"
    ),
    loadImage(
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTNw_eCS3jF1_QWDbLtNuHdG1l9Yea-r71LgK3cp3zy9Mt_g0g_9EC983Z5hOwJGS6yYo&usqp=CAU"
    ),
    loadImage(
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-quG8vFX7BkSGB5FzhQH5foylg0w43GphhNUS0gm4wA2l52EtzajPP7cqGqGfAtxSBG8&usqp=CAU"
    ),
    loadImage(
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrHYkika4bVoh9lN91OXAtvFablL9-2U9EjA&s"
    ),
    loadImage(
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBcUkhNZnZI0XnN3hWxxnhnP2lbo3FfJYxUon2Tl3M6fTVjt03mF6vfOb04lyRs-5rD-g&usqp=CAU"
    ),
    loadImage(
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQl08BAB9CDp813O4XZxR8yBbsQD3_CNvRwieqD-4hKIUQ1kIn1C4OPoThANU4SeiPgz4Q&usqp=CAU"
    ),
    loadImage(
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShAnKNcqynQkupBtf6UGELaXJdnP_DpV_RRQ&s"
    ),
  ];
}

function mouseClicked() {
  if (tela === 0) {
    verificaSelecaoMenu();
  } else if (tela === 1) {
    verificaSelecaoDificuldade();
  }
  if (
    mouseX > xsom &&
    mouseX < xsom + largurasom &&
    mouseY > ysom &&
    mouseY < ysom + alturasom
  ) {
    somLigado = !somLigado;
    if (somLigado) {
      som.play();
    } else {
      som.stop();
    }
  }
}

function verificaSelecaoMenu() {
  if (
    mouseX > xmenu &&
    mouseX < xmenu + largura &&
    mouseY > ymenu1 &&
    mouseY < ymenu1 + altura
  ) {
    tela = 1; // Tela de seleção de dificuldade
  } else if (
    mouseX > xmenu &&
    mouseX < xmenu + largura &&
    mouseY > ymenu2 &&
    mouseY < ymenu2 + altura
  ) {
    tela = 2; // Tela de Créditos
  } else if (
    mouseX > xmenu &&
    mouseX < xmenu + largura &&
    mouseY > ymenu3 &&
    mouseY < ymenu3 + altura
  ) {
    tela = 3; // Tela de Informações
  }
}

function verificaSelecaoDificuldade() {
  if (
    mouseX > xmenu &&
    mouseX < xmenu + largura &&
    mouseY > ymenu1 &&
    mouseY < ymenu1 + altura
  ) {
    tela = 4; // tela dificuldade facil
    embaralharCartas("facil");
    tempoRestante = tempoFacil;
    iniciarTemporizador();
  } else if (
    mouseX > xmenu &&
    mouseX < xmenu + largura &&
    mouseY > ymenu2 &&
    mouseY < ymenu2 + altura
  ) {
    tela = 5; //tela dificuldade medio
    embaralharCartas("medio");
    tempoRestante = tempoMedio;
    iniciarTemporizador();
  } else if (
    mouseX > xmenu &&
    mouseX < xmenu + largura &&
    mouseY > ymenu3 &&
    mouseY < ymenu3 + altura
  ) {
    tela = 6; // tela dificuldade dificil
    embaralharCartas("dificil");
    tempoRestante = tempoDificil;
    iniciarTemporizador();
  } else if (
    mouseX > xvoltar &&
    mouseX < xvoltar + larguravoltar &&
    mouseY > yvoltar &&
    mouseY < yvoltar + alturavoltar
  ) {
    tela = 1; //volta para seleção de dificuldade
  }
}

function desenhaBotaoSom() {
  // Verifica se o mouse está dentro da área do botão
  let dentroDoBotao =
    mouseX > xsom &&
    mouseX < xsom + largurasom &&
    mouseY > ysom &&
    mouseY < ysom + alturasom;

  if (dentroDoBotao) {
    stroke(0);
    fill(245, 245, 220);

    // Se o mouse foi clicado e está dentro da área do botão, alterna o estado do som
    if (mouseIsPressed && !somLigado) {
      somLigado = true;
      som.play();
    } else if (mouseIsPressed && somLigado) {
      somLigado = false;
      som.stop();
    }
  } else {
    stroke(0);
    fill(173, 216, 230);
  }

  rect(xsom, ysom, largurasom, alturasom, 20);
  fill(0);
  textSize(19);
  text(somLigado ? "Som ON" : "Som OFF", xsom + largurasom / 2, ysom + 20);
}
//função para tela de derrota ao não achar os pares no tempo
function exibirTelaDerrota() {
  background(255, 228, 225);

  // Exibir mensagem de derrota
  fill(0);
  textSize(20);
  textAlign(CENTER);
  text("Tempo esgotado! Você perdeu! Tente novamente", width / 2, 180);
  gifperdeu.position(width / 2 - 100, 200); // Centraliza o GIF abaixo da mensagem
  gifperdeu.size(200, 200);
  gifperdeu.show(); // Exibe o GIF
  desenhaBotaoVoltar(
    "Voltar",
    xvoltar,
    yvoltar,
    larguravoltar,
    alturavoltar,
    1
  );
}
// tela de vitoria ao achar todos os pares
function exibirMensagemVitoria() {
  background(255, 228, 225);
  // Exibe a mensagem de vitória em cima do gato
  fill(0);
  textSize(25);
  textAlign(CENTER);
  text("Parabéns! Você encontrou todos os pares!", width / 2, 180);
  gifganhou.position(width / 2 - 100, 200); // Centraliza o GIF abaixo da mensagem
  gifganhou.size(200, 200);
  gifganhou.show(); // Exibe o GIF
  desenhaBotaoVoltar(
    "Voltar",
    xvoltar,
    yvoltar,
    larguravoltar,
    alturavoltar,
    1
  );
}

// Função para iniciar o temporizador
function iniciarTemporizador() {
  // Limpa o temporizador anterior para evitar múltiplos temporizadores ativos
  clearInterval(intervalo);

  // Define um novo temporizador que decrementa o tempo restante a cada segundo
  intervalo = setInterval(() => {
    // Decrementa o tempo restante
    tempoRestante--;

    // Verifica se todos os pares foram encontrados antes de verificar o tempo
    if (paresEncontrados === totalPares) {
      clearInterval(intervalo); // Para o temporizador
      tela = 7; // Exibir tela de vitória
      return; // Interrompe a execução para evitar a tela de derrota
    }

    // Verifica se o tempo restante chegou a zero ou abaixo
    if (tempoRestante <= 0) {
      clearInterval(intervalo); // Para o temporizador
      tela = 8; // Exibir tela de derrota
    }
  }, 1000); // Intervalo de 1 segundo
}

// Função para desenhar o temporizador na tela
function desenharTemporizador() {
  fill(173, 216, 230);
  stroke(0);
  rect(50, 30, 100, 40, 10); // Retângulo para o temporizador
  fill(0);
  textSize(20);
  textAlign(CENTER, CENTER);
  text(tempoRestante, 100, 50); // Exibe o tempo restante
}
function draw() {
  if (tela === 0) {
    telaMenu();
    gifganhou.hide();
    gifperdeu.hide();
  } else if (tela === 1) {
    telaJogar();
  } else if (tela === 2) {
    telaCreditos();
  } else if (tela === 3) {
    telaInformacoes();
  } else if (tela === 4) {
    TelaFacil();
  } else if (tela === 5) {
    TelaMedio();
  } else if (tela === 6) {
    TelaDificil();
  } else if (tela === 7) {
    exibirMensagemVitoria();
  } else if (tela === 8) {
    exibirTelaDerrota();
  }
}
