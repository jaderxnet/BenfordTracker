/*
Melhorias:
1 - Adicionae mais cores; OK 
2 - Relacionar vídeo a uma cor;
3 - Ocultar vídeos e continuar visualizando  fusion; OK
4 - Adicionar áudio; OK
5 - Redimensionar caixa virtual para a tela inteira;
6 - Ocultar vídeo durante a apresentação;
7 - Fazer transmissão;
8 - Adicionar Microfone;
9 - Adicionar Câmeras
10 - Deixar o espaço de identificação da cor proporcional a tela da câmera;
*/

var opacidade = [0,0,0,0];

function configurarFusion(document){
  if (typeof(Storage) !== "undefined") {
    localStorage.clear();
  }


  //Implementação da Herança de BenfordTracker em relação a Traker da API tracking.js
  tracking.inherits(FusionTracker, tracking.Tracker);
  //Instanciando o construtor de Benford Trafcker
  FusionTracker.prototype.constructor = FusionTracker;

  var slider = document.getElementById("slider");
  var slider1 = document.getElementById("slider1");
  var slider2 = document.getElementById("slider2");
  var slider3 = document.getElementById("slider3");
  
  
  slider.oninput = function() {
    output.innerHTML = "Camera: "+new Intl.NumberFormat('en-IN', { minimumSignificantDigits: 3 }).format(this.value);
    opacidade[0] = this.value;
  }
  slider1.oninput = function() {
    output1.innerHTML = "Video 1: "+new Intl.NumberFormat('en-IN', { minimumSignificantDigits: 3 }).format(this.value);
    opacidade[1] = this.value;
  }
  slider2.oninput = function() {
    output2.innerHTML = "Video 2: "+new Intl.NumberFormat('en-IN', { minimumSignificantDigits: 3 }).format(this.value);
    opacidade[2] = this.value;
  }
  slider3.oninput = function() {
    output3.innerHTML = "Video 3: "+new Intl.NumberFormat('en-IN', { minimumSignificantDigits: 3 }).format(this.value);
    opacidade[3] = this.value;
  }

  // variavel para armazenar o elemento canvas
  var canvas = document.getElementById('canvasCam');
  // Variável para armazenar  o contexto 2D
  var context = canvas.getContext('2d');
  // variavel para armazenar o elemento canvas
  var canvasVideo = document.getElementById('canvasVideo');
  // Variável para armazenar  o contexto 2D
  var contextVideo = canvasVideo.getContext('2d');

    // variavel para armazenar o elemento canvas
  var canvasVideo1 = document.getElementById('canvasVideo1');
    // Variável para armazenar  o contexto 2D
  var contextVideo1 = canvasVideo1.getContext('2d');

      // variavel para armazenar o elemento canvas
  var canvasVideo2 = document.getElementById('canvasVideo2');
  // Variável para armazenar  o contexto 2D
  var contextVideo2 = canvasVideo2.getContext('2d');



  // Instancia da classe de Benford
  // Instancia da classe de Benford
  var myTrackerCam = new FusionTracker("webcam");
  var myTrackerVideo = new FusionTracker("video");
  var myTrackerVideo1 = new FusionTracker("video1");
  var myTrackerVideo2 = new FusionTracker("video2");

  

  function traque(event){
    //Preparação do canvas para ser desenhado e receber texto
    //context.clearRect(0, 0, canvas.width, canvas.height);
    //context.strokeStyle = "#000";
    //context.font = '10px Helvetica';
    //context.fillStyle = "#000"

    //Verifica se existe dados válidos no evento recebido
    if(event.data){
      //Imprime no canvas texto com dados recebidos
      //context.fillText("Exemplo: " + event.data.get("exemplo"));
      //context.drawImage(event.data.get("exemplo"),0,0);
      var idata = context.createImageData(event.data.get("width"), event.data.get("height"));

      // set our buffer as source

      idata.data.set(event.data.get("exemplo"));
      //console.log(" Camera: " + event.data.get("desccamera"));
      // update canvas with new data
      switch (event.data.get("desccamera")) {
        case "webcam":
          context.putImageData(idata, 0, 0);
          break;
        case "video":
          contextVideo.putImageData(idata, 0, 0);
          break;
        case "video1":
          myCam.putImageData(idata, 0, 0);
          break;
        case "video2":
          contextVideo2.putImageData(idata, 0, 0);
          break;
        default:
          break;
      }
      
      // Check browser support
      if (typeof(Storage) !== "undefined") {
        // Storage
        //localStorage.setItem("exemplo", event.data.get("exemplo"));
      } 
    }
  }

  // Chamada da função principal que atualiza os dados do BenfordTracker pela API Tracking
  myTrackerCam.on('track', traque);
  myTrackerVideo.on('track', traque);
  myTrackerVideo1.on('track', traque);
  myTrackerVideo2.on('track', traque);
  // Controes de Entrada --------------------------------------------------------
  //Exibir e processar o video da câmera  function capturaVideoWebCam

  //Exibir e processar video do armazenamento local a partir de janela de acesso a arquivos
  let inputElementVideo = document.getElementById('fileInputVideo');
  let inputElementVideo1 = document.getElementById('fileInputVideo1');
  let inputElementVideo2 = document.getElementById('fileInputVideo2');
  // A partir da seleção de um arquivo como entrada para inputElementVideo2 lança um evento
function vidoePlay(e, video, myTracker){
  // Elemento de vídeo é colocado em uma variavel
  let videoTag = document.getElementById(video);
  //O evento chamado dá início do processamento do arquivo de vídeo selecionado
  videoTag.src=URL.createObjectURL(e.target.files[0]);
  // O vídeo é reproduzido no canvas
  videoTag.play();
  //Ativa interface 
  activeTracking(videoTag, myTracker);
  //Fim do comando de disparo do evento
}

  inputElementVideo.addEventListener('change', (e) => vidoePlay(e, 'myVideo', myTrackerVideo), false);
  inputElementVideo1.addEventListener('change', (e) => vidoePlay(e, 'myVideo1', myTrackerVideo1), false);
  inputElementVideo2.addEventListener('change', (e) => vidoePlay(e, 'myVideo2', myTrackerVideo2), false);

  activeTracking('#myCam', myTrackerCam, { camera: true });
  tracking.ColorTracker.registerColor('green', function(r, g, b) {
    if (r < 50 && g > 130 && b < 50) {
      return true;
    }
    return false;
  });
  tracking.ColorTracker.registerColor('blue', function(r, g, b) {
    if (r < 50 && b > 130 && g < 50) {
      return true;
    }
    return false;
  });

  tracking.ColorTracker.registerColor('red', function(r, g, b) {
    if (b < 50 && r > 130 && g < 50) {
      return true;
    }
    return false;
  });

  var trackerCor = new tracking.ColorTracker(['yellow','blue', 'red', 'green']);
  trackerCor.setMinDimension(10);

    
    trackerCor.on('track', function(event) {
      //context.clearRect(0, 0, canvas.width, canvas.height);

      event.data.forEach(function(rect) {
        if (rect.color === 'custom') {
          rect.color = tracker.customColor;
        }
       
        opacidade[0] = rect.x%100 + rect.y%100;
        opacidade[1] = rect.x%100 + (100-rect.y%100);
        opacidade[2] = (100-rect.x%100) + (rect.y%100);
        opacidade[3] = (100-rect.x%100) + (100- rect.y%100);

        context.strokeStyle = rect.color;
        context.strokeRect(rect.x, rect.y, rect.width, rect.height);
        context.font = '11px Helvetica';
        context.fillStyle = "#fff";
        context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
        context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
      });
    });

    tracking.track('#myCam', trackerCor, { camera: true });
}

//Funcão para esconder uma div qualquer
function activeTracking(div, myTracker, camera) {
  //O evento chamado dá início do processamento do imágens a partir da arquivo selecionado
  tracking.track(div, myTracker, camera);
  //Exibe o bloco de video e gráfico
  //hideDiv("blocButtons");
  //hideDiv("blocView");
  //hideDiv("blocControllers");
}


//Funcão para esconder uma div qualquer
function hideDiv(div) {
  //Busca a div no documento Html
  console.log(div);
  var x = document.getElementById(div);
  //Se a div estiver desativada
  if (x.style.display === "none") {
    //Ativa a div
    x.style.display = "block";
    //Se não 
  } else {
    //Desativa a div
    x.style.display = "none";
  }
}

// Classe principal do augorítimo de processamento de frame com base em Benford.
function FusionTracker(desccamera) {
  var desccamera = desccamera;
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
    //console.log(desccamera);
    for(var i = 3; i < pixels.length; i=i+4){
        // update canvas with new data
        switch (desccamera) {
          case "webcam":
            pixels[i] = (255 - (2.55*opacidade[0]));
            break;
          case "video":
            pixels[i] = (255 - (2.55*opacidade[1]));
            break;
          case "video1":
            pixels[i] = (255 - (2.55*opacidade[2]));
            //console.log(" CAM: " + desccamera);
          break;
          case "video2":
            pixels[i] = (255 - (2.55*opacidade[3]));
          break;
          default:
            break;
        }


        /*
        if(desccamera=="webcam"){
          opa = (255 - (2.55*opacidade));
          pixels[i] = opa;
        } else {
          opa = (2.55*opacidade);
          pixels[i] = opa;
        }*/
        //console.log("Opacidade: " + opacidade + " Desccamera: " + desccamera + " OPA: " + opa);
    }

    let results = new Map();
    results.set("desccamera", desccamera);
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


