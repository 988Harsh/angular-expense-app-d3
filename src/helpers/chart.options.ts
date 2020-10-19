import { Options } from 'highcharts';
import { Injectable } from '@angular/core';
import { ExpensesProvider } from '../expenses/expenses';
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
        this.exApi.getExpensesAll().subscribe((data: any[]) => {
            const dataAmount = [];
            const createdAt = [];
            let total = 0;
            if (data.length !== 0) {
                this.expenses = data;
                const dt1 = new Date(data[0].created_at);
                const dt2 = new Date(data[data.length - 1].created_at);
                const start = dt1.getDate() + '-' + dt1.getMonth() + '-' + dt1.getFullYear();
                const stop = dt2.getDate() + '-' + dt2.getMonth() + '-' + dt2.getFullYear();
                this.expenses.forEach(element => {
                    dataAmount.push(+element.amount);
                    total += +element.amount;
                    createdAt.push(this.timeSince(Date.parse(element.created_at)));
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
                        categories: createdAt,
                        labels: {
                            format: '{value}',
                        },
                    },
                    yAxis: {
                        title: {
                            text: ''
                        },
                        labels: {
                            format: 'Rs.{value}',
                            enabled: true
                        }
                    },
                    series: [{
                        name: 'amount for expense',
                        type: 'line',
                        data: dataAmount
                    }],
                };
            } else {
                this.chartOption = {
                    title: {
                        text: 'No Expenses Left',
                        style: { color: '#ff0000' }
                    },
                    yAxis: {
                        title: {
                            text: ''
                        }
                    },
                    series: [{
                        name: '',
                        type: 'line',
                        data: []
                    }],
                };
            }
            this.subject.next(this.chartOption);
        });
    }

    getOptions() {
        return this.subject.asObservable();
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

