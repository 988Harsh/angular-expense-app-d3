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
  private width = 485 - (this.margin * 2);
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

    console.log(new Date(data[0].created_at));


    let x = d3.scaleTime()
      .domain(data.map(d => { return d.created_at; }))
      .range([0, this.width]);
    this.svg.append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(x));

    let y = d3.scaleLinear()
      .domain([0, d3.max(data, function (d) { return +d.amount; })])
      .range([this.height, 0]);
    this.svg.append("g")
      .call(d3.axisLeft(y));

    this.svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function (d) { return x(d.created_at) })
        .y(function (d) { return y(d.amount) })
      )


  }
}
