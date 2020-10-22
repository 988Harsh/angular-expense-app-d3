import { Component, OnInit } from '@angular/core';
import { ExpensesProvider } from 'src/expenses/expenses';
import * as d3 from 'd3';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'simple-crud-using-styles';

  expenses;
  svg;
  private margin = 50;
  private width = 550 - (this.margin * 2);
  private height = 400 - (this.margin * 2);
  constructor(private expenseProvider: ExpensesProvider) {

  }

  ngOnInit(): void {
    this.getExpenses();
    this.createSvg();
    this.drawBars(this.expenses);
  }

  getExpenses() {
    this.expenses = this.expenseProvider.expenses;
  }

  removeExpense(i) {
    this.expenses.splice(i, 1);
    this.expenseProvider.expenses = this.expenses;
    this.expenseProvider.update();
  }

  addExpense($event) {
    $event.preventDefault();
    const exp = {
      description: $event.target.description.value,
      amount: $event.target.amount.value,
      created_at: new Date(),
      updated_at: new Date()
    };
    this.expenseProvider.update(exp);
    $event.target.description.value = '';
    $event.target.amount.value = 0;
  }

  private createSvg(): void {
    this.svg = d3.select("#container")
      .append("svg")
      .attr("width", this.width + this.margin + this.margin)
      .attr("height", this.height + this.margin + this.margin)
      .append("g")
      .attr("transform",
        "translate(" + this.margin + "," + this.margin + ")");
  }

  private drawBars(data: any[]): void {
    console.log(data);

    const dataAmount = [];
    const createdAt = [];
    let total = 0;
    data.forEach(element => {
      dataAmount.push(+element.amount);
      total += +element.amount;
      createdAt.push(this.timeSince(Date.parse(element.created_at)));
    });

    // console.log(" extent map data created_at ", d3.extent(data.map(d => d.created_at)));
    // console.log("extent function d created_at", d3.extent(data, function (d) { return d.created_at; }));
    // console.log("map", data.map(d => this.timeSince(Date.parse(d.created_at))));

    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }
    console.log(data.map(d => this.timeSince(Date.parse(d.created_at))).filter(onlyUnique));

    let x = d3.scaleOrdinal()
      .domain(data.map((d, i) => i + ' ' + this.timeSince(Date.parse(d.created_at))))
      .range(data.map((d, i) => this.width / data.length * i))
    this.svg.append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(x));

    // console.log("start map x()");
    // data.forEach(d => {
    //   console.log(x(d.created_at));
    // })

    let y = d3.scaleLinear()
      .domain([0, d3.max(data, (d) => d.amount)])
      .range([this.height, 0]);
    this.svg.append("g")
      .call(d3.axisLeft(y));

    // console.log("start map y()");
    // data.forEach(d => {
    //   console.log(y(d.amount));
    // });

    this.svg.append("path")
      .datum(data)
      .attr('d', d3.line()
        .x((d) => { return x(d.created_at) })
        .y((d) => { return y(d.amount) })
      )
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5);
  }

  timeSince(date) {
    const minute = 60;
    const hour = minute * 60;
    const day = hour * 24;
    const month = day * 30;
    const year = day * 365;

    const elapsed = Math.floor((Date.now() - date) / 1000);

    if (elapsed === 0) {
      return 'Just now';
    }

    // get an array in the form of [time ago number, time ago metric]
    const a = elapsed < minute && [elapsed, 'seconds'] ||
      elapsed < hour && [Math.floor(elapsed / minute), 'min'] ||
      elapsed < day && [Math.floor(elapsed / hour), 'hr'] ||
      elapsed < month && [Math.floor(elapsed / day), 'day'] ||
      elapsed < year && [Math.floor(elapsed / month), 'month'] ||
      [Math.floor(elapsed / year), 'year'];

    // pluralise and append 'ago'
    return a[0] + ' ' + a[1] + (a[0] === 1 ? '' : 's') + ' ago';
  }


}
