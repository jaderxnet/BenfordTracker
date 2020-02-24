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
  
  var resumo;
  var resultado;
//Avalia se há resultados no retorno da API Tracker
if (typeof(Storage) !== "undefined") {
  resumo = localStorage.getItem("diferencaTriplo");
}
console.log("Reumo: " + resumo)
if(resumo){
  //Copia o resultado que será usado para gerar o gráfico
  resultado = resumo;
  //Normaliza o resultado para a escala de 100%
  resultado *= 100;
  

		if(resultado){
      dps.shift();
		dps.push({label: "Triplo", color: "green", x: 0, y: resultado});
    dps.push({label: "Escalar Vertical", color: "green", x: 0, y: resultado});
    dps.push(  {label: "Escalar Horizontal", color: "green", x: 0, y: resultado});
    dps.push(  {label: "Temporal", color: "green", x: 0, y: resultado});
    dps.push(  {label: "1", color: "blue", x: 1, y: 30.1});
    dps.push( {label: "1", color: "red", x: 2, y: resultado/3});
    dps.push(  {label: "2", color: "blue", x: 3, y: 17.6});
    dps.push(  {label: "2", color: "red", x: 4, y: resultado/4});
    dps.push(  {label: "3", color: "blue", x: 5, y: 12.5});
      dps.push(  {label: "3", color: "red", x: 6, y: resultado/5});
      dps.push(  {label: "4", color: "blue", x: 7, y: 9.7});
      dps.push(  {label: "4", color: "red", x: 8, y: resultado/6});
      dps.push(  {label: "5", color: "blue", x: 9, y: 7.9});
      dps.push( {label: "5", color: "red", x: 10, y: resultado/7});
      dps.push( {label: "6", color: "blue", x: 11, y: 6.7});
      dps.push(  {label: "6", color: "red", x: 12, y: resultado/8});
      dps.push(  {label: "7", color: "blue", x: 13, y: 5.8});
      dps.push(  {label: "7", color: "red", x: 14, y: resultado/9});
      dps.push(  {label: "8", color: "blue", x: 15, y: 5.1});
      dps.push(  {label: "8", color: "red", x: 16, y: resultado/10});
      dps.push(  {label: "9", color: "blue", x: 17, y: 4.6});
      dps.push(  {label: "9", color: "red", x: 18, y: resultado/11});
  } else {
    dps.push({
      label: "Triplo",
			x: 50,
			y: 0
    });
  }
  chart.render();
}
};

drawChart();
  //google.visualization.events.addListener(chart, 'ready', loadDataChart);
//loadDataChart();
//Função que atualiza o gráfico a cada 1 segundo.
//TODO retirar isso quando implementar o worder
window.setInterval('drawChart()', 1000);
