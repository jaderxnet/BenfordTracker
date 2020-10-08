
function configurarFusion(document){
  if (typeof(Storage) !== "undefined") {
    localStorage.clear();
  }
  //Implementação da Herança de BenfordTracker em relação a Traker da API tracking.js
  tracking.inherits(FusionTracker, tracking.Tracker);
  //Instanciando o construtor de Benford Trafcker
  FusionTracker.prototype.constructor = FusionTracker;

  // variavel para armazenar o elemento canvas
  var canvas = document.getElementById('canvasCam');
  // Variável para armazenar  o contexto 2D
  var context = canvas.getContext('2d');
  // Instancia da classe de Benford
  var myTracker = new FusionTracker();

  // Chamada da função principal que atualiza os dados do BenfordTracker pela API Tracking
  myTracker.on('track', function(event){
    //Preparação do canvas para ser desenhado e receber texto
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "#000";
    context.font = '10px Helvetica';
    context.fillStyle = "#000"

    //Verifica se existe dados válidos no evento recebido
    if(event.data){
      //Imprime no canvas texto com dados recebidos
      //context.fillText("Exemplo: " + event.data.get("exemplo"));
      //context.drawImage(event.data.get("exemplo"),0,0);
      var idata = context.createImageData(event.data.get("width"), event.data.get("height"));

      // set our buffer as source
      idata.data.set(event.data.get("exemplo"));

      // update canvas with new data
      context.putImageData(idata, 0, 0)
      // Check browser support
      if (typeof(Storage) !== "undefined") {
        // Storage
        //localStorage.setItem("exemplo", event.data.get("exemplo"));
      } 
    }
  });

  // Controes de Entrada --------------------------------------------------------
  //Exibir e processar o video da câmera  function capturaVideoWebCam

  //Exibir e processar video do armazenamento local a partir de janela de acesso a arquivos
  let inputElementVideo2 = document.getElementById('fileInputVideo');
  // A partir da seleção de um arquivo como entrada para inputElementVideo2 lança um evento
  inputElementVideo2.addEventListener('change', (e) => {
    // Elemento de vídeo é colocado em uma variavel
    let videoTag = document.getElementById('myVideo');
    //O evento chamado dá início do processamento do arquivo de vídeo selecionado
    videoTag.src=URL.createObjectURL(e.target.files[0]);
    // O vídeo é reproduzido no canvas
    videoTag.play();
    //Ativa interface 
    activeTracking('#myVideo', myTracker);
    //Fim do comando de disparo do evento
  }, false);

  activeTracking('#myCam', myTracker, { camera: true });
}

//Funcão para esconder uma div qualquer
function activeTracking(div, myTracker, camera) {
  //O evento chamado dá início do processamento do imágens a partir da arquivo selecionado
  tracking.track(div, myTracker, camera);
  //Exibe o bloco de video e gráfico
  //hideDiv("blocButtons");
  hideDiv("blocView", true);
  hideDiv("blocControllers", true);
}


//Funcão para esconder uma div qualquer
function hideDiv(div, force) {
  //Busca a div no documento Html
  var x = document.getElementById(div);
  //Se a div estiver desativada
  if (x.style.display === "none") {
    //Ativa a div
    x.style.display = "flex";
    //Se não 
  } else {
    if(force) return;
    //Desativa a div
    x.style.display = "none";
  }
}

// Classe principal do augorítimo de processamento de frame com base em Benford.
function FusionTracker() {
  // Implementação de Benford Tracker -----------------------------------------------------------
  // Quantidade de frames a serem contabilizados para os gradientes acumuldos
  var quantidadeFramesAmostra = 10;
  // Váriável que armazena a lista de valores padrões de benford
  var valoresBenford = [9];
  // Indice da fila que controla qual item da fila está sendo inserido para cada frame processado
  var indiceFila = 0;
  // Variável armazena o frame anterior para comparar com o atual
  var frameAnterior = null;
  /*Variável identifica quando a fila de frames processados enche pela primeira vez, a partir
  desse momento o algoritimo  deve substituir indices já existentes da fila*/
  var  filaCheia = false;

/*Função principal do processamento. Essa função vai ser chamada para processar cada pixel, dessa forma
é necessário criar estratégias de otimização para que não acumulasse volume muito grande de dados.
Responsável por sobrescrever a função track da api tracking.js
permitindo receber uma matriz de pixels RGB em formato de array, a largura e autura da imgagem
representada na matriz.*/
  this.track = function(pixels, width, height) {
    /* usamos uma função interna da api para transformar a matriz de pixel RGB recebida em uma matriz cinza ]
    esse processo basicamente torna a matriz 3 vezes menor e diminui a complexidade dos calculos*/
    //let gray = tracking.Image.grayscale(pixels, width, height, false);
    // Essa função zera a fila de ocorrencia permitindo o reuso das variáveis para otimizar o código
    //zerarFilaOcorrencia();
    // Essa função processa o frame de pixels em escala de cinza e arrmazena nas variáveis da fila de ocorrencias
    //processarFrame(pixels, width, height);
    /* Essa função calcula a ocorrencia acumulada e outros dados de cada numero na fila de ocorrencia e armzena
    tudo em um mapa de resultados  */

    for(var i = 3; i < pixels.length; i=i+4){
      pixels[i] = 50;
    }

    let results = new Map();
    results.set("exemplo", pixels);
    results.set("width", width);
    results.set("height", height);
    //Essa é uma chamada da API que envia os resultados para o métodos que estão ouvindo, no caso a API de exibição do gráfico do Google
    this.emit('track', {
      data: results
    });
  }

  function processarFrame(gray, width, height){
    console.log("Processando frame");
  }


}
