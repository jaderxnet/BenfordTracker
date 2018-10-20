// É criado um contexto de audio de acordo com a tecnologia disponível no Browser
var audioContext = new (window.AudioContext || window.webkitAudioContext)();
//Controle de play do audio
var isPlaing = false;
//Elementos criados para ser a semente do som criado
var real = new Float32Array(2);
var imag = new Float32Array(2);

//A semente do som gerado é o valor 1 e 0, uma base binária
real[0] = 0;
imag[0] = 0;
real[1] = 1;
imag[1] = 0;

//Seta o ocilador para o tipo sino
let tipo = 'sine';
//cria um array de osciladores, essa é melhor mandeira de o som ficar agradável
var osciladors = [5]
// Cria e configura cada oscilador com uma frequencia diferente podendo ter também tipos diferentes
osciladors[0] = audioContext.createOscillator();
osciladors[0].frequency.setValueAtTime(220, audioContext.currentTime);
//osciladors[0].type = 'square';
osciladors[0].type = tipo;
osciladors[1] = audioContext.createOscillator();
osciladors[1].frequency.setValueAtTime(176, audioContext.currentTime);
//osciladors[1].type = 'triangle';
osciladors[1].type = tipo;
osciladors[2] = audioContext.createOscillator();
osciladors[2].frequency.setValueAtTime(132, audioContext.currentTime);
//osciladors[2].type = 'sine';
osciladors[2].type = tipo;
osciladors[3] = audioContext.createOscillator();
osciladors[3].frequency.setValueAtTime(88, audioContext.currentTime);
//osciladors[3].type = 'sawtooth';
osciladors[3].type = tipo;
osciladors[4] = audioContext.createOscillator();
osciladors[4].frequency.setValueAtTime(44, audioContext.currentTime);
osciladors[4].type = tipo;

//Cria a onda a partir dos valores sementes
var wave = audioContext.createPeriodicWave(real, imag);
//Usa a onda para definir o período da onda do último scilador
osciladors[4].setPeriodicWave(wave);

//Ganho determina o volume de saída do audio
var ganho = audioContext.createGain();
//O volume maximo é definido
ganho.gain = 10;
//Interconectamos os osciladores
osciladors[0].connect(ganho);
osciladors[1].connect(ganho);
osciladors[2].connect(ganho);
osciladors[3].connect(ganho);
osciladors[4].connect(ganho);
//Inicializamos todos os osciladores
for (var i = 0; i < osciladors.length; i++) {
  osciladors[i].start();
}

//Função que controla o som conectando ou disconectando o ganho ao contexto
function playSound() {
  if(isPlaing){
    //oscilador.connect(biguad);
    ganho.disconnect(audioContext.destination);
    isPlaing = false;
  } else {
    //oscilador.disconnect(biguad);
    isPlaing = true;
    ganho.connect(audioContext.destination);
  }
}

// Função que muda a frequencia de acordo com o valor recebido
function mudarFrequencia(valor) {
    for (var i =osciladors.length-1; i >= 0 ; i--) {
      osciladors[i].frequency.setValueAtTime(2*valor*(1+i)*44, audioContext.currentTime);
    }
    //output.innerHTML = volume*10;
}

//Função que muda o ganho de acordo com valor recebido
function mudarVolume(volume) {
  if(volume>10.0){
    ganho.gain.value = volume/10;
    //output.innerHTML = volume/10;
  }
  if(volume<1.0){
    ganho.gain.value = volume*10;
    //output.innerHTML = volume*10;
  }
}
