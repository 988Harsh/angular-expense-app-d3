import { Options } from 'highcharts';
import { Injectable } from '@angular/core';
import { ExpensesProvider } from '../expenses/expenses';
import dateformat from 'dateformat';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChartsOptions {

    subject: Subject<Options>;
    expenses;
    chartOption: Options;
    constructor(private exApi: ExpensesProvider) {
        this.subject = new Subject<Options>();
    }

    Options() {
        TimeAgo.addLocale(en);
        this.exApi.getExpensesAll().subscribe((data: any[]) => {
            const timeAgo = new TimeAgo('en-US');
            const dataAmount = [];
            const createdAt = [];
            let start;
            let stop;
            let total = 0;
            this.expenses = data;
            start = dateformat(data[0].created_at, 'yyyy-mm-dd');
            stop = dateformat(data[data.length - 1].created_at, 'yyyy-mm-dd');
            this.expenses.forEach(element => {
                dataAmount.push(+element.amount);
                total += element.amount;
                createdAt.push(timeAgo.format(Date.parse(element.created_at)));
            });
            this.chartOption = {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Each Expense Change Rate (From ' + start + ' To ' + stop + ') Total expense = ' + total
                },
                xAxis: {
                    type: 'datetime',
                    categories: createdAt
                },

                yAxis: {
                    title: {
                        text: ''
                    },
                    labels: {
                        format: 'Rs.{value}'
                    }
                },

                series: [{
                    name: 'amount for expenses',
                    type: 'line',
                    data: dataAmount
                }],
            };
            this.subject.next(this.chartOption);
        });
    }

    getOptions() {
        return this.subject.asObservable();
    }

}

