import { Component } from '@angular/core';
import {HttpClient } from '@angular/common/http';
import {Chart} from 'chart.js';
import {ReportingService} from './reporting.service'
import { mergeMap, groupBy, map, reduce} from 'rxjs/operators';
import {of} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'FrontEnd';

chart = [];
courses :Object = null;
options = [
{id: 1, text: "On Site Courses"},
{id: 2, text: "Online Courses"},
{id: 3, text: "All Courses"}

]

selection:Number = 3;
constructor(private reporting : ReportingService){}
random_rgba(){

  var o = Math.round,r = Math.random, s = 225;
  return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ','+o(r()*s)+',0.3)';
}


submitRequest(){

  this.reporting.getReportingData(this.selection).subscribe(response => {

    console.log(response);

    let keys = response["Departments"].map(d=>d.Name);
    let values = response["Departments"].map(d=>d.Average);

    this.courses = response['Courses'];

    this.chart = new Chart('canvas',{
      type: 'bar',
      data:{

        labels:keys,
        datasets:[

          {
            data: values,
            borderColor: "#cba9f",
            fill: false,
            backgroundColor:[
              this.random_rgba(),
              this.random_rgba(),
              this.random_rgba(),
              this.random_rgba()
            ]
          }
        ]

      },
      options: {
        legend:{
          display: false
                },
                title: {
                  display: true,
                  text: "Average grade by Department"
                },
                scales: {
                  xAxes:[{
                    display: true,
                    barPercentage: 0.40
                  }],
                  yAxes: [{
                    display: true,
                    ticks: {
                      min: 0,
                      max: 10
                    }
                  }],
                }
        }
      })

    });
}


downloadRequest(type){
  this.reporting.downloadReport(this.selection,type).subscribe(x =>{
    var filetype = type==1?"application/pdf":"application/word";
    var fileName = type==1?"report.pdf":"report.doc";
    var newBlob = new Blob([x],{type: filetype});

    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(newBlob);
      return;
    }

const data = window.URL.createObjectURL(newBlob);
var link = document.createElement('a');
link.href = data;
link.download = fileName;

link.dispatchEvent(new MouseEvent('click',{bubbles: true, cancelable: true, view: window}));

setTimeout(function () {
window.URL.revokeObjectURL(data);
link.remove();
    }, 100);
    
  })
}



}
