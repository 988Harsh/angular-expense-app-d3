import { Component } from '@angular/core';
import * as Highcharts from "highcharts";
import { ExpensesProvider } from 'src/expenses/expenses';
import { ChartsOptions } from "../helpers/chart.options";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'simple-crud-using-styles';

  expenses;
  constructor(private options: ChartsOptions, private expenseProvider: ExpensesProvider) {
    this.options.getOptions().subscribe(data => {
      Highcharts.chart('container', data);
    })
  }

  ngOnInit(): void {
    this.getExpenses();
    this.options.Options();
  }

  getExpenses() {
    this.expenseProvider.getExpensesAll().subscribe(data => {
      this.expenses = data;
    })
  }

  removeExpense(i) {
    this.expenses.splice(i, 1);
    this.expenseProvider.expenses = this.expenses;
  }

}
