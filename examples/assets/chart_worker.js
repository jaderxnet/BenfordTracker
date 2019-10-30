
// Carrega API do Google para visualização de graficos
google.charts.load('current', {'packages':['bar']});
// Seleciona qual a função de retorno quando a API de visualização do Google for chamada
google.charts.setOnLoadCallback(drawStuff);
// O retorno cria o grafico e popula a tabela de dados,
// É necessário instanciar o grafico e popular os dados na configuração do gráfico em options do google chart
var chart = null;
var data = null;

/* Função que carrega os dados no gráfico após o retorno da API do Google
TODO Colocar isso em um work para quan a atualização seja instantânea e não dependa de atualização da tela*/
function loadDataChart(){
  //Variável para armazenar resultado
  let resultado =  0;
  //Avalia se há resultados no retorno da API Tracker
  resumo = document.getElementById('resumo').dataset.resumo;
  if(resumo){
    //Copia o resultado que será usado para gerar o gráfico
    resultado = resumo;
    //Normaliza o resultado para a escala de 100%
    resultado *= 100;
  }

  //Verifica se existe configuração valida de dados para o gráfico
  if(data){
    //Verifica se há informações anteriores na tabela
    if(data.getNumberOfRows()>0){
      //Remove as linhas atuais para atualizar o gráfico
      data.removeRows(0,1);
    }
    //Adiciona uma nova linha com os dados novos
    data.addRow([resultado,resultado]);
  } else {
    //Caso não haja dados previamente configurados cria as colunas necessárias
    data = new google.visualization.DataTable();
    data.addColumn('number', 'Difereça Tripla');
    data.addColumn('number', 'Difereça Tripla');
  }
}

//Função Responsável por desenhar o gráfico
function drawStuff() {
  // Criar a tabela de dados
  loadDataChart();
  // Configurar as opções de gráfico
  var options = {
    //title: 'Gradiente Triplo de Benford',
    width: 100,
    legend: { position: 'none' },
    chart: { //title: 'Gradiente Triplo de Benford',
    //subtitle: 'Ocorrencia primeiro dígito por número' 
  },
    bars: 'vertical', // Required for Material Bar Charts.
    axes: {
      x: {
        0: { side: 'down', label: 'Números'} // Top x-axis.
      },
      y: {
        0: { side: 'left', label: 'Porcentágem'} // Top x-axis.
      }
    },
    bar: { groupWidth: "90%" }
  };
  // Instanciar o gráfico no elemento da interface
  chart = new google.charts.Bar(document.getElementById('triplo'));
  //Desenhar gráfico de acordo com dados e opções
  chart.draw(data, options);
};

//Função que atualiza o gráfico a cada 1 segundo.
//TODO retirar isso quando implementar o worder
window.setInterval('drawStuff()', 1000);
