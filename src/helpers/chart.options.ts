import { Options } from 'highcharts';
import { Injectable } from '@angular/core';
import { ExpensesProvider } from '../expenses/expenses';
// import dateformat from 'dateformat';
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
            this.expenses = data;
            const dt1 = new Date(data[0].created_at);
            const dt2 = new Date(data[data.length - 1].created_at);
            const start = dt1.getDate()+'-'+dt1.getMonth()+'-'+dt1.getFullYear();
            const stop = dt2.getDate()+'-'+dt2.getMonth()+'-'+dt2.getFullYear();
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
            this.subject.next(this.chartOption);
        });
    }

    getOptions() {
        return this.subject.asObservable();
    }

    timeSince(date) {
        const ms = new Date().getTime() - date;
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(months / 12);
        if (seconds === 0) {
            return 'Just now';
        } if (seconds < 60) {
            return seconds + ' sec(s) Ago';
        } if (minutes < 60) {
            return minutes + ' min(s) Ago';
        } if (hours < 24) {
            return hours + ' hr(s) Ago';
        } if (days < 30) {
            return days + ' day(s) Ago';
        } if (months < 12) {
            return months + ' month(s) Ago';
        } else {
            return years + ' year(s) Ago';
        }
    }

}

