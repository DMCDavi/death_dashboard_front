import { Component, OnInit } from "@angular/core";
import Chart from 'chart.js';
import { DoService } from "src/app/services/do.service";
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: "app-dashboard",
  templateUrl: "dashboard.component.html"
})
export class DashboardComponent implements OnInit {
  public canvas : any;
  public ctx;
  public datasets: any = [];
  public data: any;
  public tableHeader: any = [];
  public tableData: any = [];
  public monthLineChart;
  public monthPizzaChart;
  public clicked: boolean = true;
  public clicked1: boolean = false;
  public clicked2: boolean = false;
  public pizzaLabels: any = [];
  public pizzaData: any = [];
  public myPizzaChartData: any;
  public monthFilterForm: FormGroup;
  public monthGraphType: string = 'GraficoEixos';
  public prevMonthGraphType: string = 'GraficoEixos';


  constructor(public doService: DoService, private modalService: NgbModal, private fb: FormBuilder) {
    this.createForms();
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
  }


  createForms(){
    this.monthFilterForm = this.fb.group({
      year: [
        '2019'
      ],
      graph: [
        'GraficoEixos'
      ]
    });
  }

  applyMonthFilters() {
    this.monthGraphType = this.monthFilterForm.value.graph;
    let chart;
    if(this.monthGraphType === 'GraficoEixos'){
      if (this.prevMonthGraphType !== this.monthGraphType) {
        this.prevMonthGraphType = 'GraficoEixos';
        this.monthLineChart = this.createLineChart("chartLinesMonth");
      }
      chart = this.monthLineChart
    }else if(this.monthGraphType === 'GraficoPizza'){
      if (this.prevMonthGraphType !== this.monthGraphType) {
        this.prevMonthGraphType = 'GraficoPizza';
        this.monthPizzaChart = this.createPizzaChart("chartMonthPizza")
      }
      chart = this.monthPizzaChart;
    }
    this.doService.getDeathByMonth(this.monthFilterForm.value.year, this.monthGraphType).subscribe((res) => {
      this.updateOptions(chart, res[1]);
    })
  }

  ngAfterViewInit(){
    this.monthLineChart = this.createLineChart("chartLinesMonth")
  }

  ngOnInit() {
    this.doService.getDeathByMonth('2019', 'GraficoEixos').subscribe((res) => {
      this.monthLineChart.data.datasets[0].data = res[1]
      this.monthLineChart.update()
    })

    this.doService.getDeathDeclarations('2019', 10, 1).subscribe((res) => {
      this.tableHeader = Object.keys(res[0]) 
      this.tableHeader.splice(0, 1)
      this.tableData = res
    })

    this.doService.getDeathfulestsDiseases('2019', 10, 'GraficoEixos').subscribe((res) => {
      this.pizzaLabels = res[0];
      this.pizzaData = res[1];
      this.updatePizzaOptions();
    })
    
    var gradientChartOptionsConfigurationWithTooltipBlue: any = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },

      tooltips: {
        backgroundColor: '#f5f5f5',
        titleFontColor: '#333',
        bodyFontColor: '#666',
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest"
      },
      responsive: true,
      scales: {
        yAxes: [{
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.0)',
            zeroLineColor: "transparent",
          },
          ticks: {
            suggestedMin: 60,
            suggestedMax: 125,
            padding: 20,
            fontColor: "#2380f7"
          }
        }],

        xAxes: [{
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.1)',
            zeroLineColor: "transparent",
          },
          ticks: {
            padding: 20,
            fontColor: "#2380f7"
          }
        }]
      }
    };

    var gradientChartOptionsConfigurationWithTooltipPurple: any = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },

      tooltips: {
        backgroundColor: '#f5f5f5',
        titleFontColor: '#333',
        bodyFontColor: '#666',
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest"
      },
      responsive: true,
      scales: {
        yAxes: [{
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.0)',
            zeroLineColor: "transparent",
          },
          ticks: {
            suggestedMin: 60,
            suggestedMax: 125,
            padding: 20,
            fontColor: "#9a9a9a"
          }
        }],

        xAxes: [{
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(225,78,202,0.1)',
            zeroLineColor: "transparent",
          },
          ticks: {
            padding: 20,
            fontColor: "#9a9a9a"
          }
        }]
      }
    };

    var gradientChartOptionsConfigurationWithTooltipOrange: any = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },

      tooltips: {
        backgroundColor: '#f5f5f5',
        titleFontColor: '#333',
        bodyFontColor: '#666',
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest"
      },
      responsive: true,
      scales: {
        yAxes: [{
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.0)',
            zeroLineColor: "transparent",
          },
          ticks: {
            suggestedMin: 50,
            suggestedMax: 110,
            padding: 20,
            fontColor: "#ff8a76"
          }
        }],

        xAxes: [{
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(220,53,69,0.1)',
            zeroLineColor: "transparent",
          },
          ticks: {
            padding: 20,
            fontColor: "#ff8a76"
          }
        }]
      }
    };

    var gradientChartOptionsConfigurationWithTooltipGreen: any = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },

      tooltips: {
        backgroundColor: '#f5f5f5',
        titleFontColor: '#333',
        bodyFontColor: '#666',
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest"
      },
      responsive: true,
      scales: {
        yAxes: [{
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.0)',
            zeroLineColor: "transparent",
          },
          ticks: {
            suggestedMin: 50,
            suggestedMax: 125,
            padding: 20,
            fontColor: "#9e9e9e"
          }
        }],

        xAxes: [{
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(0,242,195,0.1)',
            zeroLineColor: "transparent",
          },
          ticks: {
            padding: 20,
            fontColor: "#9e9e9e"
          }
        }]
      }
    };


    var gradientBarChartConfiguration: any = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },

      tooltips: {
        backgroundColor: '#f5f5f5',
        titleFontColor: '#333',
        bodyFontColor: '#666',
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest"
      },
      responsive: true,
      scales: {
        yAxes: [{

          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.1)',
            zeroLineColor: "transparent",
          },
          ticks: {
            suggestedMin: 60,
            suggestedMax: 120,
            padding: 20,
            fontColor: "#9e9e9e"
          }
        }],

        xAxes: [{

          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.1)',
            zeroLineColor: "transparent",
          },
          ticks: {
            padding: 20,
            fontColor: "#9e9e9e"
          }
        }]
      }
    };


    this.canvas = document.getElementById("chartLineGreen");
    this.ctx = this.canvas.getContext("2d");


    var gradientStroke = this.ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, 'rgba(66,134,121,0.15)');
    gradientStroke.addColorStop(0.4, 'rgba(66,134,121,0.0)'); //green colors
    gradientStroke.addColorStop(0, 'rgba(66,134,121,0)'); //green colors

    var data = {
      labels: ['JUL', 'AUG', 'SEP', 'OCT', 'NOV'],
      datasets: [{
        label: "Número de óbitos",
        fill: true,
        backgroundColor: gradientStroke,
        borderColor: '#00d6b4',
        borderWidth: 2,
        borderDash: [],
        borderDashOffset: 0.0,
        pointBackgroundColor: '#00d6b4',
        pointBorderColor: 'rgba(255,255,255,0)',
        pointHoverBackgroundColor: '#00d6b4',
        pointBorderWidth: 20,
        pointHoverRadius: 4,
        pointHoverBorderWidth: 15,
        pointRadius: 4,
        data: [90, 27, 60, 12, 80],
      }]
    };

    var myChart = new Chart(this.ctx, {
      type: 'line',
      data: data,
      options: gradientChartOptionsConfigurationWithTooltipGreen

    });

    this.myPizzaChartData = this.createPizzaChart("chartPizza");
  }

createLineChart(chart_id) {
  this.canvas = document.getElementById(chart_id);
  this.ctx = this.canvas.getContext("2d");

  var gradientStroke = this.ctx.createLinearGradient(0, 230, 0, 50);

  gradientStroke.addColorStop(1, 'rgba(233,32,16,0.2)');
  gradientStroke.addColorStop(0.4, 'rgba(233,32,16,0.0)');
  gradientStroke.addColorStop(0, 'rgba(233,32,16,0)'); //red colors

  var chart_labels = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  var gradientChartOptionsConfigurationWithTooltipRed: any = {
    maintainAspectRatio: false,
    legend: {
      display: false
    },

    tooltips: {
      backgroundColor: '#f5f5f5',
      titleFontColor: '#333',
      bodyFontColor: '#666',
      bodySpacing: 4,
      xPadding: 12,
      mode: "nearest",
      intersect: 0,
      position: "nearest"
    },
    responsive: true,
    scales: {
      yAxes: [{
        barPercentage: 1.6,
        gridLines: {
          drawBorder: false,
          color: 'rgba(29,140,248,0.0)',
          zeroLineColor: "transparent",
        },
        ticks: {
          suggestedMin: 80000,
          suggestedMax: 120000,
          padding: 20,
          fontColor: "#9a9a9a"
        }
      }],

      xAxes: [{
        barPercentage: 1.6,
        gridLines: {
          drawBorder: false,
          color: 'rgba(233,32,16,0.1)',
          zeroLineColor: "transparent",
        },
        ticks: {
          padding: 20,
          fontColor: "#9a9a9a"
        }
      }]
    }
  };

  var config = {
    type: 'line',
    data: {
      labels: chart_labels,
      datasets: [{
        label: "Número de óbitos",
        fill: true,
        backgroundColor: gradientStroke,
        borderColor: '#ec250d',
        borderWidth: 2,
        borderDash: [],
        borderDashOffset: 0.0,
        pointBackgroundColor: '#ec250d',
        pointBorderColor: 'rgba(255,255,255,0)',
        pointHoverBackgroundColor: '#ec250d',
        pointBorderWidth: 20,
        pointHoverRadius: 4,
        pointHoverBorderWidth: 15,
        pointRadius: 4,
      }]
    },
    options: gradientChartOptionsConfigurationWithTooltipRed
  };
  return new Chart(this.ctx, config);
}

createPizzaChart(chart_id){
  this.canvas = document.getElementById(chart_id);
  this.ctx = this.canvas.getContext("2d");

  var pizzaChartConfig: any = {
    maintainAspectRatio: false,
    responsive: true,
    legend: {
      display: false
    },
    tooltips: {
      backgroundColor: '#f5f5f5',
      titleFontColor: '#333',
      bodyFontColor: '#666',
      bodySpacing: 4,
      xPadding: 12,
      mode: "nearest",
      intersect: 0,
      position: "nearest"
    },
    scales: {
      yAxes: [{
        ticks: {
          display: false
        },
        gridLines: {
          display: false
        },
      }],
      xAxes: [{
        gridLines: {
          display: false
        },
        ticks: {
          display: false,
        }
      }]
    },
  }

  var pizzaData = {
    labels: this.pizzaLabels,
    datasets: [{
      data: this.pizzaData,
      backgroundColor: [
        'rgba(0, 255, 0, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(47, 159, 255, 0.2)',
        'rgba(35, 255, 212, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 63, 41, 0.2)',
        'rgba(0, 255, 0, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(47, 159, 255, 0.2)',
        'rgba(35, 255, 212, 0.2)'
      ],
      borderColor: [
        'rgba(0, 255, 0, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(47, 159, 255, 1)',
        'rgba(35, 255, 212, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 63, 41, 1)',
        'rgba(0, 255, 0, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(47, 159, 255, 1)',
        'rgba(35, 255, 212, 1)'
      ],
      borderWidth: 1
    }]
  };

  return new Chart(this.ctx, {
    type: 'pie',
    data: pizzaData,
    options: pizzaChartConfig
  });
}

  public updateOptions(chart, data) {
      chart.data.datasets[0].data = data
      chart.update()
  }

  public updatePizzaOptions() {
    this.myPizzaChartData.data.datasets[0].data = this.pizzaData;
    this.myPizzaChartData.data.labels = this.pizzaLabels;
    this.myPizzaChartData.update();
  }
}
