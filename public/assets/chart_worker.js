/* Função que carrega os dados no gráfico após o retorno da API do Google
TODO Colocar isso em um work para quan a atualização seja instantânea e não dependa de atualização da tela*/

// Configurar as opções de gráfico

//Função Responsável por desenhar o gráfico
function drawChart() {
  
  var dps = []; // dataPoints
  var chart = new CanvasJS.Chart("triplo", {
    title :{
      text: "Benford"
    },
    axisY: {
      includeZero: false,
      maximum: 100,
      minimum: 0
    },      
    data: [{
      type: "column",
      dataPoints: dps
    }]
  });
  
//Avalia se há resultados no retorno da API Tracker
if(typeof(Storage) !== "undefined"){
  //Recupera principal valor para usar no gráfico
  var principal =localStorage.getItem("diferencaTriplo")
  console.log("Principal: " + principal)
  //Normaliza o principal para a escala de 100%
  principal *= 100;
  var acumuladotriplo = localStorage.getItem("acumuladotriplo");
  var listaAcumuladoTriploPorNumero = localStorage.getItem("acumuladotriploPorNumero");
  
  if(principal && 
    listaAcumuladoTriploPorNumero != null && 
    listaAcumuladoTriploPorNumero != "undefined" && 
    acumuladotriplo != null && 
    acumuladotriplo != "undefined"){
    
    console.log("listaAcumuladoTriplo: " + listaAcumuladoTriploPorNumero);
    var acumuladotriploPorNumero = listaAcumuladoTriploPorNumero.split(',').map(function(item) {
      return parseInt(item, 10);
    });
    dps.shift();
		dps.push({label: "Triplo", color: "red", x: 0, y: localStorage.getItem("diferencaTriplo")*100});
    dps.push({label: "Espacial", color: "green", x: 1, y: localStorage.getItem("diferencaEspacial")*100});
    dps.push(  {label: "Temporal", color: "pink", x: 2, y: localStorage.getItem("diferencaTemporal")*100});
    dps.push(  {label: "1", color: "blue", x: 3, y: 30.1});
    dps.push( {label: "1", color: "red", x: 4, y: acumuladotriploPorNumero[0]/acumuladotriplo*100});
    dps.push(  {label: "2", color: "blue", x: 5, y: 17.6});
    dps.push(  {label: "2", color: "red", x: 6, y: acumuladotriploPorNumero[1]/acumuladotriplo*100});
    dps.push(  {label: "3", color: "blue", x: 7, y: 12.5});
      dps.push(  {label: "3", color: "red", x: 8, y: acumuladotriploPorNumero[2]/acumuladotriplo*100});
      dps.push(  {label: "4", color: "blue", x: 9, y: 9.7});
      dps.push(  {label: "4", color: "red", x: 10, y: acumuladotriploPorNumero[3]/acumuladotriplo*100});
      dps.push(  {label: "5", color: "blue", x: 11, y: 7.9});
      dps.push( {label: "5", color: "red", x: 12, y: acumuladotriploPorNumero[4]/acumuladotriplo*100});
      dps.push( {label: "6", color: "blue", x: 13, y: 6.7});
      dps.push(  {label: "6", color: "red", x: 14, y: acumuladotriploPorNumero[5]/acumuladotriplo*100});
      dps.push(  {label: "7", color: "blue", x: 15, y: 5.8});
      dps.push(  {label: "7", color: "red", x: 16, y: acumuladotriploPorNumero[6]/acumuladotriplo*100});
      dps.push(  {label: "8", color: "blue", x: 17, y: 5.1});
      dps.push(  {label: "8", color: "red", x: 18, y: acumuladotriploPorNumero[7]/acumuladotriplo*100});
      dps.push(  {label: "9", color: "blue", x: 19, y: 4.6});
      dps.push(  {label: "9", color: "red", x: 20, y: acumuladotriploPorNumero[8]/acumuladotriplo*100});
      chart.render();
  } 
}
};
if (typeof(Storage) !== "undefined") {
  localStorage.clear(); 
}
drawChart();
  //google.visualization.events.addListener(chart, 'ready', loadDataChart);
//loadDataChart();
//Função que atualiza o gráfico a cada 1 segundo.
//TODO retirar isso quando implementar o worder
window.setInterval('drawChart()', 1000);
