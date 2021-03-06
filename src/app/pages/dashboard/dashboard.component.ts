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
  public diseasesLineChart;
  public diseasesPizzaChart;
  public stateLineChart;
  public statePizzaChart;
  public colorLineChart;
  public colorPizzaChart;
  public clicked: boolean = true;
  public clicked1: boolean = false;
  public clicked2: boolean = false;
  public myPizzaChartData: any;
  public monthFilterForm: FormGroup;
  public diseasesFilterForm: FormGroup;
  public stateFilterForm: FormGroup;
  public colorFilterForm: FormGroup;
  public monthGraphType: string = 'GraficoEixos';
  public prevMonthGraphType: string = 'GraficoEixos';
  public diseasesGraphType: string = 'GraficoPizza';
  public prevDiseasesGraphType: string = 'GraficoPizza';
  public stateGraphType: string = 'GraficoPizza';
  public prevStateGraphType: string = 'GraficoPizza';
  public colorGraphType: string = 'GraficoPizza';
  public prevColorGraphType: string = 'GraficoPizza';


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
      ],
      sex: [],
      color: [],
      school: [],
      state: [],
      chapter: [],
      age_inf: [],
      age_sup: []
    });
    this.diseasesFilterForm = this.fb.group({
      year: [
        '2019'
      ],
      graph: [
        'GraficoPizza'
      ],
      quantity: [
        "10"
      ],
      sex: [],
      color: [],
      school: [],
      state: [],
      chapter: [],
      age_inf: [],
      age_sup: [],
      month_inf: [],
      month_sup: []
    });
    this.stateFilterForm = this.fb.group({
      year: [
        '2019'
      ],
      graph: [
        'GraficoPizza'
      ],
      sex: [],
      color: [],
      school: [],
      chapter: [],
      age_inf: [],
      age_sup: [],
      month_inf: [],
      month_sup: []
    });
    this.colorFilterForm = this.fb.group({
      year: [
        '2019'
      ],
      graph: [
        'GraficoPizza'
      ],
      sex: [],
      school: [],
      state: [],
      chapter: [],
      age_inf: [],
      age_sup: [],
      month_inf: [],
      month_sup: []
    });
  }

  applyColorFilters(){
    const formValue = this.colorFilterForm.value
    this.colorGraphType = formValue.graph;
    let chart;
    if(this.colorGraphType === 'GraficoEixos'){
      if (this.prevColorGraphType !== this.colorGraphType) {
        this.prevColorGraphType = 'GraficoEixos';
        this.colorLineChart = this.createLineChart("chartLinesColor");
      }
      chart = this.colorLineChart
    }else if(this.colorGraphType === 'GraficoPizza'){
      if (this.prevColorGraphType !== this.colorGraphType) {
        this.prevColorGraphType = 'GraficoPizza';
        this.colorPizzaChart = this.createPizzaChart("chartColorPizza")
      }
      chart = this.colorPizzaChart;
    }
    this.doService.getDeathByColor(formValue.year, this.colorGraphType, formValue.sex, formValue.school, formValue.state, formValue.chapter, formValue.age_inf, formValue.age_sup, formValue.month_inf, formValue.month_sup).subscribe((res) => {
      this.updateOptions(chart, res["y"] || res[1], res["x"] || res[0]);
    })
  }

  applyStateFilters(){
    const formValue = this.stateFilterForm.value
    this.stateGraphType = formValue.graph;
    let chart;
    if(this.stateGraphType === 'GraficoEixos'){
      if (this.prevStateGraphType !== this.stateGraphType) {
        this.prevStateGraphType = 'GraficoEixos';
        this.stateLineChart = this.createLineChart("chartLinesState");
      }
      chart = this.stateLineChart
    }else if(this.stateGraphType === 'GraficoPizza'){
      if (this.prevStateGraphType !== this.stateGraphType) {
        this.prevStateGraphType = 'GraficoPizza';
        this.statePizzaChart = this.createPizzaChart("chartStatePizza")
      }
      chart = this.statePizzaChart;
    }
    this.doService.getDeathByState(formValue.year, this.stateGraphType, formValue.sex, formValue.color, formValue.school, formValue.chapter, formValue.age_inf, formValue.age_sup, formValue.month_inf, formValue.month_sup).subscribe((res) => {
      this.updateOptions(chart, res["y"] || res[1], res["x"] || res[0]);
    })
  }

  applyDiseasesFilters(){
    const formValue = this.diseasesFilterForm.value
    this.diseasesGraphType = formValue.graph;
    let chart;
    if(this.diseasesGraphType === 'GraficoEixos'){
      if (this.prevDiseasesGraphType !== this.diseasesGraphType) {
        this.prevDiseasesGraphType = 'GraficoEixos';
        this.diseasesLineChart = this.createLineChart("chartLinesDiseases");
      }
      chart = this.diseasesLineChart
    }else if(this.diseasesGraphType === 'GraficoPizza'){
      if (this.prevDiseasesGraphType !== this.diseasesGraphType) {
        this.prevDiseasesGraphType = 'GraficoPizza';
        this.diseasesPizzaChart = this.createPizzaChart("chartDiseasesPizza")
      }
      chart = this.diseasesPizzaChart;
    }
    this.doService.getDeathfulestsDiseases(formValue.year, formValue.quantity, this.diseasesGraphType, formValue.sex, formValue.color, formValue.school, formValue.state, formValue.chapter, formValue.age_inf, formValue.age_sup, formValue.month_inf, formValue.month_sup).subscribe((res) => {
      this.updateOptions(chart, res["y"] || res[1], res["x"] || res[0]);
    })
  }

  applyMonthFilters() {
    const formValue = this.monthFilterForm.value
    this.monthGraphType = formValue.graph;
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
    this.doService.getDeathByMonth(formValue.year, this.monthGraphType, formValue.sex, formValue.color, formValue.school, formValue.state, formValue.chapter, formValue.age_inf, formValue.age_sup).subscribe((res) => {
      this.updateOptions(chart, res["y"] || res[1], res["x"] || res[0]);
    })
  }

  ngAfterViewInit(){
    this.monthLineChart = this.createLineChart("chartLinesMonth")
    this.diseasesPizzaChart = this.createPizzaChart("chartDiseasesPizza");
    this.statePizzaChart = this.createPizzaChart("chartStatePizza");
    this.colorPizzaChart = this.createPizzaChart("chartColorPizza");
  }

  ngOnInit() {
    this.doService.getDeathByMonth('2019', 'GraficoEixos').subscribe((res) => {
      this.updateOptions(this.monthLineChart, res["y"] || res[1], res["x"] || res[0])
    })

    this.doService.getDeathDeclarations('2019', 10, 1).subscribe((res) => {
      this.tableHeader = Object.keys(res[0]) 
      this.tableHeader.splice(0, 1)
      this.tableData = res
    })

    this.doService.getDeathfulestsDiseases('2019', 10, 'GraficoPizza').subscribe((res) => {
      this.updateOptions(this.diseasesPizzaChart, res["y"] || res[1], res["x"] || res[0])
    })
    
    this.doService.getDeathByState('2019', 'GraficoPizza').subscribe((res) => {
      this.updateOptions(this.statePizzaChart, res["y"] || res[1], res["x"] || res[0])
    })

    this.doService.getDeathByColor('2019', 'GraficoPizza').subscribe((res) => {
      this.updateOptions(this.colorPizzaChart, res["y"] || res[1], res["x"] || res[0])
    })
  }

createLineChart(chart_id) {
  this.canvas = document.getElementById(chart_id);
  this.ctx = this.canvas.getContext("2d");

  var gradientStroke = this.ctx.createLinearGradient(0, 230, 0, 50);

  gradientStroke.addColorStop(1, 'rgba(233,32,16,0.2)');
  gradientStroke.addColorStop(0.4, 'rgba(233,32,16,0.0)');
  gradientStroke.addColorStop(0, 'rgba(233,32,16,0)'); //red colors

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
      datasets: [{
        label: "N??mero de ??bitos",
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
    datasets: [{
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
        'rgba(35, 255, 212, 0.2)',
        'rgba(0, 255, 0, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(47, 159, 255, 0.2)',
        'rgba(35, 255, 212, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 63, 41, 0.2)',
        'rgba(0, 255, 0, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(47, 159, 255, 0.2)',
        'rgba(35, 255, 212, 0.2)',
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
        'rgba(35, 255, 212, 1)',
        'rgba(0, 255, 0, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(47, 159, 255, 1)',
        'rgba(35, 255, 212, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 63, 41, 1)',
        'rgba(0, 255, 0, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(47, 159, 255, 1)',
        'rgba(35, 255, 212, 1)',
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

  public updateOptions(chart, data, labels = null) {
      chart.data.datasets[0].data = data
      if(labels){
        chart.data.labels = labels;
      }
      chart.update()
  }
}
