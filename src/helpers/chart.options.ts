import { Options } from 'highcharts';
import { Injectable } from '@angular/core';
import { ExpensesProvider } from '../expenses/expenses';
import dateformat from 'dateformat';
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
            let start;
            let stop;
            let total = 0;
            this.expenses = data;
            start = dateformat(data[0].created_at, 'yyyy-mm-dd');
            stop = dateformat(data[data.length - 1].created_at, 'yyyy-mm-dd');
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
        const seconds = Math.floor((new Date().getTime() - date) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) {
            if (Math.floor(interval) === 1) {
                return Math.floor(interval) + ' year ago';
            } else {
                return Math.floor(interval) + ' years ago';
            }
        }
        interval = seconds / 2592000;
        if (interval > 1) {
            if (Math.floor(interval) === 1) {
                return Math.floor(interval) + ' month ago';
            } else {
                return Math.floor(interval) + ' months ago';
            }
        }
        interval = seconds / 86400;
        if (interval > 1) {
            if (Math.floor(interval) === 1) {
                return Math.floor(interval) + ' day ago';
            } else {
                return Math.floor(interval) + ' days ago';
            }
        }
        interval = seconds / 3600;
        if (interval > 1) {
            if (Math.floor(interval) === 1) {
                return Math.floor(interval) + ' hour ago';
            } else {
                return Math.floor(interval) + ' hours ago';
            }
        }
        interval = seconds / 60;
        if (interval > 1) {
            if (Math.floor(interval) === 1) {
                return Math.floor(interval) + ' minute ago';
            } else {
                return Math.floor(interval) + ' minutes ago';
            }
        }
        if (Math.floor(seconds) === 1) {
            return Math.floor(seconds) + ' second ago';
        } else {
            return Math.floor(seconds) + ' seconds ago';
        }
    }


}

