import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { ExpensesProvider } from 'src/expenses/expenses';
import { ChartsOptions } from '../helpers/chart.options';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'simple-crud-using-styles';

  expenses;
  constructor(private options: ChartsOptions, private expenseProvider: ExpensesProvider) {
    this.options.getOptions().subscribe(data => {
      Highcharts.chart('container', data);
    });
  }

  chartClicked($event) {
    if ($event.point) {
      this.removeExpense($event.point.index);
    } else {
      this.labelClickDelete($event.path[1]);
    }
  }

  labelClickDelete(t) {
    const temp = [];
    document.querySelector('.highcharts-xaxis-labels').childNodes.forEach(each => {
      temp.push(each);
    });
    const i = temp.indexOf(t);
    if (i !== -1) {
      this.removeExpense(i);
    }
  }

  ngOnInit(): void {
    this.getExpenses();
    this.options.Options();
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

}
