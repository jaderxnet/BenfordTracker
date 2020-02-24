
function configurarBenfod(document){
  if (typeof(Storage) !== "undefined") {
    localStorage.clear(); 
  }
  //Implementação da Herança de BenfordTracker em relação a Traker da API tracking.js
  tracking.inherits(BenfordTracker, tracking.Tracker);
  //Instanciando o construtor de Benford Trafcker
  BenfordTracker.prototype.constructor = BenfordTracker;

  // variavel para armazenar o elemento canvas
  var canvas = document.getElementById('canvas');
  // Variável para armazenar  o contexto 2D
  var context = canvas.getContext('2d');
  // Instancia da classe de Benford
  var myTracker = new BenfordTracker();

  // Chamada da função principal que atualiza os dados do BenfordTracker pela API Tracking
  myTracker.on('track', function(event){
    //Preparação do canvas para ser desenhado e receber texto
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "#000";
    context.font = '10px Helvetica';
    context.fillStyle = "#000"

    //Verifica se existe dados válidos no evento recebido
    if(event.data){
      //Muda frequncia do som de acordo com dados recebidos
      mudarFrequencia(event.data.get("diferencaTriplo"));
      //Imprime no canvas texto com dados recebidos
      context.fillText("Espacial: " + event.data.get("direfencaEspacial"), 0 + 5, 10 + 22);
      context.fillText("Temporal: " + event.data.get("diferencaTemporal"), 0 + 5, 20 + 22);
      context.fillText("Triplo: " + event.data.get("diferencaTriplo"), 0 + 5, 30 + 22);
      // Check browser support
      if (typeof(Storage) !== "undefined") {
        // Storage
        localStorage.setItem("direfencaEspacial", event.data.get("direfencaEspacial"));
        localStorage.setItem("diferencaTemporal", event.data.get("diferencaTemporal"));
        localStorage.setItem("diferencaTriplo", event.data.get("diferencaTriplo"));
        localStorage.setItem("espacialPorFrame", event.data.get("espacialPorFrame"));
        localStorage.setItem("temporalPorFrame", event.data.get("temporalPorFrame"));
        localStorage.setItem("triploPorFrame", event.data.get("triploPorFrame"));
        localStorage.setItem("acumuladoEspacial", event.data.get("acumuladoEspacial"));
        localStorage.setItem("acumuladotemporal", event.data.get("acumuladotemporal"));
        localStorage.setItem("acumuladotriplo", event.data.get("acumuladotriplo"));
        localStorage.setItem("acumuladoEspacialPorNumero", event.data.get("acumuladoEspacialPorNumero"));
        localStorage.setItem("acumuladotemporalPorNumero", event.data.get("acumuladotemporalPorNumero"));
      } 
    }
  });

  // Controes de Entrada --------------------------------------------------------
  //Exibir e processar o video da câmera  function capturaVideoWebCam
  let inputElementVideo1 = document.getElementById('buttonCameraVideo');
  // A partir do click de um botão o elemento inputElementVideo1 lança um evento
  inputElementVideo1.addEventListener('click', (e) => {
    //O evento chamado dá início do processamento do imágens a partir da Web Cam
    activeTracking('#myVideo', myTracker, { camera: true });
    //Fim do comando de disparo do evento
  }, false);

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
}

//Funcão para esconder uma div qualquer
function activeTracking(div, myTracker, camera) {
  //O evento chamado dá início do processamento do imágens a partir da arquivo selecionado
  tracking.track('#myVideo', myTracker, camera);
  //inicia o monitoramento do som
  playSound();
  //Exibe o bloco de video e gráfico
  hideDiv("blocButtons");
  hideDiv("blocView", true);
  hideDiv("blocControllers", true);
  hideDiv("textRefresh");
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
function BenfordTracker() {
  // Implementação de Benford Tracker -----------------------------------------------------------
  // Quantidade de frames a serem contabilizados para os gradientes acumuldos
  var quantidadeFramesAmostra = 10;
  // Váriável que armazena a lista de valores padrões de benford
  var valoresBenford = [9];
  // Indice da fila que controla qual item da fila está sendo inserido para cada frame processado
  var indiceFila = 0;
  console.log("ZERAR: O que está nas ocorrências?:");
  console.log(ocorrenciaEspacialPorFrame);
  /* Variáveis que armazenam acorrencia de valores de primeiro dídigo para cada frame processado,
  os acumulados temporais fundem dados de dois frames, por isso são menores que o espacial*/
  var ocorrenciaEspacialPorFrame = [quantidadeFramesAmostra-1];
  var ocorrenciaTriploPorFrame = [quantidadeFramesAmostra-1];
  var ocorrenciaTemporalPorFrame = [quantidadeFramesAmostra-1];
  zerarFilaOcorrencia();
  console.log("ZERAR: O que está nas ocorrências?:");
  console.log(ocorrenciaEspacialPorFrame);
  // Variável armazena o frame anterior para comparar com o atual
  var frameAnterior = null;
  /*Variável identifica quando a fila de frames processados enche pela primeira vez, a partir
  desse momento o algoritimo  deve substituir indices já existentes da fila*/
  var  filaCheia = false;

  //Inicização dos valores padrões de Benford
  valoresBenford[0] = Math.log10(1.0+1.0/1.0);
  valoresBenford[1] = Math.log10(1.0+1.0/2.0);
  valoresBenford[2] = Math.log10(1.0+1.0/3.0);
  valoresBenford[3] = Math.log10(1.0+1.0/4.0);
  valoresBenford[4] = Math.log10(1.0+1.0/5.0);
  valoresBenford[5] = Math.log10(1.0+1.0/6.0);
  valoresBenford[6] = Math.log10(1.0+1.0/7.0);
  valoresBenford[7] = Math.log10(1.0+1.0/8.0);
  valoresBenford[8] = Math.log10(1.0+1.0/9.0);
/*Função principal do processamento. Essa função vai ser chamada para processar cada pixel, dessa forma
é necessário criar estratégias de otimização para que não acumulasse volume muito grande de dados.
Responsável por sobrescrever a função track da api tracking.js
permitindo receber uma matriz de pixels RGB em formato de array, a largura e autura da imgagem
representada na matriz.*/
  this.track = function(pixels, width, height) {
    /* usamos uma função interna da api para transformar a matriz de pixel RGB recebida em uma matriz cinza ]
    esse processo basicamente torna a matriz 3 vezes menor e diminui a complexidade dos calculos*/
    let gray = tracking.Image.grayscale(pixels, width, height, false);
    // Essa função zera a fila de ocorrencia permitindo o reuso das variáveis para otimizar o código
    //zerarFilaOcorrencia();
    // Essa função processa o frame de pixels em escala de cinza e arrmazena nas variáveis da fila de ocorrencias
    processarFrame(gray, width, height);
    /* Essa função calcula a ocorrencia acumulada e outros dados de cada numero na fila de ocorrencia e armzena
    tudo em um mapa de resultados  */
    let results = calcularTotalOcorrencia();

    //Essa é uma chamada da API que envia os resultados para o métodos que estão ouvindo, no caso a API de exibição do gráfico do Google
    this.emit('track', {
      data: results
    });
  }

// Essa função zera a fila de ocorrencia permitindo o reuso das variáveis para otimizar o código
  function zerarFilaOcorrencia(){
    //Percorre a fila de ocorrencia
    for(let x = 0; x < quantidadeFramesAmostra-1; ++x) {
      //Inicializa um array para cada numero de 1 a 9
      ocorrenciaTriploPorFrame[x] = [9];
      ocorrenciaTemporalPorFrame[x] = [9];
      ocorrenciaEspacialPorFrame[x] = [9];
      //Inicializa todas as ocorrencias com 0.0
      for(let y = 0; y < quantidadeFramesAmostra; ++y) {
        ocorrenciaEspacialPorFrame[x][y] = 0.0;
        ocorrenciaTemporalPorFrame[x][y] = 0.0;
        ocorrenciaTriploPorFrame[x][y] = 0.0;
      }
    }
  };


  function calcularOcorrenciaGradiente(gradiente){
    //Essa variavel armazena a ocorrencia do primeiro dígido na análise pixel a pixel
    let contaOcorrenciaNumeroPrimeiroDigito = 0 ;
    /*Com  o valor do gradiente temporal vamos contar as ocorrencias caso elas tenham valores relevante
    Elas podem ter entre 0 e 255 correspondente ao tom de cinza do gradiente correspondente
    Queremos contar aqui a quantidade de vezes que os dígitos de 1 a 9 se repetem na primeira posição do gradiente de cada pixel
    a iniciar pelo gradiente espacial*/
      //Se o gradiente for maior que 100 estará entre 101 e 255 logo o digito poderá ser 1 ou 2
      if(gradiente >= 100) {
        /*Caso o gradiente seja maior que 99 é extraida a parte menor que 100 e dividida por 100 para que de valor 1 ou 2 */
        contaOcorrenciaNumeroPrimeiroDigito = (gradiente-(gradiente%100))/100;
          //Se o gradiente for maior que 9 e menor que 101 estará entre 11 e 100 logo o digito poderá ser 1 e 9
      } else if (gradiente >= 10) {
        /*Caso o gradiente seja maior que 9 é extraida a parte menor que 10 e dividida por 10 para obter o primeiro dígito entre 1 e 9 */
        contaOcorrenciaNumeroPrimeiroDigito = (gradiente-(gradiente%10))/10;
      } else {
        /*Caso o gradiente seja menor que 10 será usada a operação MOD para retornar o resto da divisão por 1 para evitar
        um comportamento inesperado do javascript e garantir que o valo fique entre 1 e 9 */
        contaOcorrenciaNumeroPrimeiroDigito = (gradiente-gradiente%1);
      }
      /*A ocorrencia é retornada */
    return contaOcorrenciaNumeroPrimeiroDigito;
  };

/**
// Essa função processa o frame de pixels em escala de cinza e arrmazena nas variáveis da fila de ocorrencias
TODO:Criar classe ProcessadorFrame posteriormente*/
  function processarFrame( frame, width, height ) {
    //Inicializa uma variável para calcular cada gradiente
    let gradienteEspacial = 0;
    let gradienteTemporal = 0;
    let gradienteTriplo = 0;

    /* Para processar o primeiro frame é necessário existir frame anterior pois as análises temporais usam frame frameAnterior,
    portanto não procesa o primeiro frame, apenas a partir do segundo
    TODO Verificar se o não processamento do gradiente temporal do primeiro frame prejudica o algorítimo, até onde olhei não
    pois no código original também se pulava o primeiro frame*/
    if(frame && frameAnterior){
      /*Para calcular os gradientes fazemos uso de alguns cálculos que foram divididos em partes aqui para que os valores fossem
      reusados. no caso dos qaudrado temporal e espacial são usados para armazenar uma potencia de 2*/
      let quadradoTemporal = 0;
      let quadradoEspacialHorizontal = 0;
      let quadradoEspacialVertical = 0;
      //Essa variavel armazena a ocorrencia do primeiro dígido na análise pixel a pixel

      /*Usamos o index para percorrer todos os pixels da imagem exceto o primeiro e a última coluna por conta do gradiente espacial que usa o
      primeiro pixel como peixel anterior e não tem com quem comparar a última coluna
      TODO Vericicar se realmente não se deve percorrer a última colua, apesar de estar igual ao algoritimo original*/
      for (var index = 1; index < height*width-width; ++index) {
        //Para calcular o gradiente temporal subitraimos o frame anterior do frame atual
        gradienteTemporal = frame[index] - frameAnterior[index];
        //Para calcular o gradiente espacial primeiro tenho que calcular o gradiente espacial no eixo horizontal e vertical
        //Pra calcular o gradiente espacial horizontal eu faço a difrença entre o pixel atual e o próximo
        let gradienteEspacialHorizontal = frame[index+1] - frame[index];
        //Pra calcular o gradiente espacial vertical eu faço a difrença entre o pixel atual e o equivalente na próxima coluna
        let gradienteEspacialVertical = frame[index+width] - frame[index];
        //É necessário calcular o quadrdo espacial horizontal e vertical para usar no cálculo do gradiente espacial e triplo
        quadradoEspacialHorizontal = Math.pow(gradienteEspacialHorizontal, 2);
        quadradoEspacialVertical = Math.pow(gradienteEspacialVertical, 2);
        //O gradiente espacial é obtido calculando a raiz quadrada da soma do quadrado espacial vertical e horizontal
        gradienteEspacial = Math.sqrt( quadradoEspacialHorizontal + quadradoEspacialVertical);
        //Para obter o gradiente Triplo é necessário calcular o quadrado do gradiente temporal
        quadradoTemporal = Math.pow(gradienteTemporal, 2);
        //O gradiente Tripo é obtido calculando a raiz quadrada da soma do quadrado temporal, espacial vertical e horizontal
        gradienteTriplo = Math.sqrt( quadradoEspacialHorizontal + quadradoEspacialVertical + quadradoTemporal);


        /*Com  o valor do gradiente temporal vamos contar as ocorrencias caso elas tenham valores relevante
        Elas podem ter entre 0 e 255 correspondente ao tom de cinza do gradiente correspondente
        Queremos contar aqui a quantidade de vezes que os dígitos de 1 a 9 se repetem na primeira posição do gradiente de cada pixel
        a iniciar pelo gradiente espacial*/
        //se a norma espacial for significativa conta o primeiro digito encontrado
        if (gradienteEspacial > 0.001) {
          /*As ocorrencias  são armazenadas no contador de acordo com o primeiro digito do valor do pixel do gradiente no indice
          atual da fila que está sendo atualizado crescenta +1 na ocorrencia do número no frame */
          ocorrenciaEspacialPorFrame[indiceFila][calcularOcorrenciaGradiente(gradienteEspacial)-1]++;
        }

        if (gradienteTemporal > 0.001) {//se a norma espacial for significativa
          /*As ocorrencias  são armazenadas no contador de acordo com o primeiro digito do valor do pixel do gradiente no indice
          atual da fila que está sendo atualizado crescenta +1 na ocorrencia do número no frame */
          ocorrenciaTemporalPorFrame[indiceFila][calcularOcorrenciaGradiente(gradienteTemporal)-1]++;
        }

        if (gradienteTriplo > 0.001) {//se a norma espacial for significativa
          /*As ocorrencias  são armazenadas no contador de acordo com o primeiro digito do valor do pixel do gradiente no indice
          atual da fila que está sendo atualizado crescenta +1 na ocorrencia do número no frame */
          ocorrenciaTriploPorFrame[indiceFila][calcularOcorrenciaGradiente(gradienteTriplo)-1]++;
        }
      }
      //Se a fila não estiver cheia e o indice da fila chegar ao final marque a fila como cheia, isso define quando começar calcular valores
      if(!filaCheia && (indiceFila >= quantidadeFramesAmostra-2)){
        filaCheia = true;
      }
    }
    //Atualiza o indice da fila
    indiceFila++;
    //Quando o indice da fila chega ao final reinicia o indice para manter a fila circular
    indiceFila = indiceFila%(quantidadeFramesAmostra-1);
    //Atualiza o frame anterior
    frameAnterior = frame;
    frame = null;
    zerarOcorrenciaIndice(indiceFila);
  };
// Essa função zera um determinado indice da fila de ocorrencia permitindo acumular novamente
  function zerarOcorrenciaIndice(x){
    //Percorre a fila de ocorrencia
      for(let y = 0; y < quantidadeFramesAmostra; ++y) {
        ocorrenciaEspacialPorFrame[x][y] = 0.0;
        ocorrenciaTemporalPorFrame[x][y] = 0.0;
        ocorrenciaTriploPorFrame[x][y] = 0.0;
      }
    }

//Inicializamos as variáveis globais que serão usadas para exibir os valores principais e os gráficos gerais
//TODO PROBLEMA AQUI
  diferencaTripla = 0.0;
  diferencaEspacial = 0.0;
  diferencaTemporal = 0.0;

function inserirDadosFakeNasOcorrencias(){

  /* Percorre o a fila usando a variavel indice Frame para ir do início ao fim da fila */

  //for(let indiceframe = 0; indiceframe < quantidadeFramesAmostra-1; indiceframe++) {
    /* Para cada indice da fila percorre os valores dos indices de digitos acumulados
    usando a variavel indice Digito para ir do indice 0 ao 8 que corresponde aos dígitos 1 ao 9 */
    //for(let indiceDigito = 0; indiceDigito < 9; ++indiceDigito) {
    //  ocorrenciaEspacialPorFrame[indiceframe][indiceDigito];
      //ocorrenciaTemporalPorFrame[indiceframe][indiceDigito];
      //ocorrenciaTriploPorFrame[indiceframe][indiceDigito];
    //}
  //}
}



/*Este método calcula a ococrrência total dos valores e outras estatísticas sobre os pixels analisados */
  function calcularTotalOcorrencia(){
    //Só começa a fazer os calculos quando a fila está cheia e portanto foram processados frames mínimos
    if(filaCheia){
      //Variávelresponsável por armazenar no contexto do método os valores acumulados;
      let acumuladoTriplo = 0;
      let acumuladoEspacial = 0;
      let acumuladoTemporal = 0;
      let acumuladoTriploPorNumero = [9];
      let acumuladoEspacialPorNumero = [9];
      let acumuladoTemporalPorNumero = [9];
      for(let x = 0; x < 9; ++x) {
        //Inicializa todas as ocorrencias com 0.0
          acumuladoTriploPorNumero[x] = 0.0;
          acumuladoEspacialPorNumero[x] = 0.0;
          acumuladoTemporalPorNumero[x] = 0.0;
      }

      //TODO PROBLEMA AQUI
      diferencaTripla = 0.0;
      diferencaEspacial = 0.0;
      diferencaTemporal = 0.0;

      /* Percorre o a fila usando a variavel indice Frame para ir do início ao fim da fila */
      for(let indiceframe = 0; indiceframe < quantidadeFramesAmostra-1; indiceframe++) {
        /* Para cada indice da fila percorre os valores dos indices de digitos acumulados
        usando a variavel indice Digito para ir do indice 0 ao 8 que corresponde aos dígitos 1 ao 9 */
        for(let indiceDigito = 0; indiceDigito < 9; ++indiceDigito) {
          //Verifica se existe valor válido na ocorrência armazenada para evitar erro de variável nula no javascript
          if(ocorrenciaEspacialPorFrame[indiceframe][indiceDigito]){
            //Acumula valor da ocorrencia espacial para todos os  digitos de otodos os frames
            acumuladoEspacial += ocorrenciaEspacialPorFrame[indiceframe][indiceDigito];
            //Acumula valor da ocorrencia espacial para cada  digito em todos os frames
            acumuladoEspacialPorNumero[indiceDigito] += ocorrenciaEspacialPorFrame[indiceframe][indiceDigito];
          }
          //Verifica se existe valor válido na ocorrência armazenada para evitar erro de variável nula no javascript
          if(ocorrenciaTemporalPorFrame[indiceframe][indiceDigito]){
            //Acumula valor da ocorrencia temporal para todos os  digitos de otodos os frames
            acumuladoTemporal += ocorrenciaTemporalPorFrame[indiceframe][indiceDigito];
            //Acumula valor da ocorrencia temporal para cada  digito em todos os frames
            acumuladoTemporalPorNumero[indiceDigito] += ocorrenciaTemporalPorFrame[indiceframe][indiceDigito];
          }
          //Verifica se existe valor válido na ocorrência armazenada para evitar erro de variável nula no javascript
          if(ocorrenciaTriploPorFrame[indiceframe][indiceDigito]){
            //Acumula valor da ocorrencia espacial para todos os  digitos de otodos os frames
            acumuladoTriplo += ocorrenciaTriploPorFrame[indiceframe][indiceDigito];
            //Acumula valor da ocorrencia espacial para cada  digito em todos os frames
            acumuladoTriploPorNumero[indiceDigito] += ocorrenciaTriploPorFrame[indiceframe][indiceDigito];
          }
        }
      }

      // Percorre os nove níveis para calcular a diferença triplo
      for(let nivel = 0; nivel < 9; nivel++) {
        //Verifica se existe valor válido no acumulado para evitar erro de variável nula no javascript
        if (acumuladoTriploPorNumero[nivel]){
            //Verofica se acumulado por numero dividido pelo somatório total subtraido o valor esperado de Benford para esse dígito é positivo
            if (((acumuladoTriploPorNumero[nivel]/acumuladoTriplo)-valoresBenford[nivel]) > 0) {
              //calcula a diferença Tripla caso ela seja positiva
              diferencaTripla += (acumuladoTriploPorNumero[nivel]/acumuladoTriplo)-valoresBenford[nivel];
            } else {
              //calcula a diferença Tripla caso ela seja negativa
              diferencaTripla -= (acumuladoTriploPorNumero[nivel]/acumuladoTriplo)-valoresBenford[nivel];
            }
        }
      }
      //TODO Não sei o motivo de dividir a diferença tripla por dois, fiz isso pois estava no projeto horiginal
      diferencaTripla /= 2;
      //TODO Aqui subtrai de 1 o valor da diferença Tripla o que daria a porcentagem de conformidade, mas não tenho certeza que está no local correto
      diferencaTripla = 1 - diferencaTripla;
      // Percorre os nove níveis para calcular a diferença Espacial
      for(let nivel = 0; nivel < 9; nivel++) {
          //Verifica se existe valor válido no acumulado para evitar erro de variável nula no javascript
          if (acumuladoEspacialPorNumero[nivel]){
            //Verofica se acumulado por numero dividido pelo somatório total subtraido o valor esperado de Benford para esse dígito é positivo
            if (((acumuladoEspacialPorNumero[nivel]/acumuladoEspacial)-valoresBenford[nivel]) > 0) {
              //calcula a diferença Espacial caso ela seja positiva
              diferencaEspacial += (acumuladoEspacialPorNumero[nivel]/acumuladoEspacial)-valoresBenford[nivel];
            } else {
              //calcula a diferença Espacial caso ela seja negativa
              diferencaEspacial -= (acumuladoEspacialPorNumero[nivel]/acumuladoEspacial)-valoresBenford[nivel];
            }
          }
      }
      //TODO Não sei o motivo de dividir a diferença tripla por dois, fiz isso pois estava no projeto horiginal
      diferencaEspacial /= 2;
      //TODO Aqui subtrai de 1 o valor da diferença Tripla o que daria a porcentagem de conformidade, mas não tenho certeza que está no local correto
      diferencaEspacial = 1 - diferencaEspacial;
      // Percorre os nove níveis para calcular a diferença Temporal
      for(let nivel = 0; nivel < 9; nivel++) {
          //Verifica se existe valor válido no acumulado para evitar erro de variável nula no javascript
          if (acumuladoTemporalPorNumero[nivel]){
            //Verofica se acumulado por numero dividido pelo somatório total subtraido o valor esperado de Benford para esse dígito é positivo
            if (((acumuladoTemporalPorNumero[nivel]/acumuladoTemporal)-valoresBenford[nivel]) > 0) {
              //calcula a diferença Temporal caso ela seja positiva
              diferencaTemporal += (acumuladoTemporalPorNumero[nivel]/acumuladoTemporal)-valoresBenford[nivel];
            } else {
              //calcula a diferença Temporal caso ela seja negativa
              diferencaTemporal -= (acumuladoTemporalPorNumero[nivel]/acumuladoTemporal)-valoresBenford[nivel];
            }
          }
      }
      //TODO Não sei o motivo de dividir a diferença tripla por dois, fiz isso pois estava no projeto horiginal
      diferencaTemporal /= 2;
      //TODO Aqui subtrai de 1 o valor da diferença Tripla o que daria a porcentagem de conformidade, mas não tenho certeza que está no local correto
      diferencaTemporal = 1 - diferencaTemporal;

      //Armazena vários dados em um mapa de ocorrências
      let mapaOcorrencia = new Map();
      mapaOcorrencia.set("direfencaEspacial", diferencaEspacial.toFixed(2));
      mapaOcorrencia.set("diferencaTemporal", diferencaTemporal.toFixed(2));
      mapaOcorrencia.set("diferencaTriplo", diferencaTripla.toFixed(2));
      mapaOcorrencia.set("espacialPorFrame", ocorrenciaEspacialPorFrame);
      mapaOcorrencia.set("temporalPorFrame", ocorrenciaTemporalPorFrame);
      mapaOcorrencia.set("triploPorFrame", ocorrenciaTriploPorFrame);
      mapaOcorrencia.set("acumuladoEspacial", acumuladoEspacial);
      mapaOcorrencia.set("acumuladotemporal", acumuladoTemporal);
      mapaOcorrencia.set("acumuladotriplo", acumuladoTriplo);
      mapaOcorrencia.set("acumuladoEspacialPorNumero", acumuladoEspacialPorNumero);
      mapaOcorrencia.set("acumuladotemporalPorNumero", acumuladoTemporalPorNumero);
      mapaOcorrencia.set("acumuladotriploPorNumero", acumuladoTriploPorNumero);
      return mapaOcorrencia;
    }
  }

}
