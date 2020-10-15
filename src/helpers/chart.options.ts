import { Options } from "highcharts";
import { Injectable, OnInit } from '@angular/core';
import { ExpensesProvider } from "../expenses/expenses";
import dateformat from "dateformat";
import TimeAgo from "javascript-time-ago";
import en from 'javascript-time-ago/locale/en'
import { Subject } from 'rxjs';

@Injectable({ providedIn: "root" })
export class ChartsOptions implements OnInit {

    subject: Subject<Options>;
    expenses;
    chartOption: Options;
    constructor(private exApi: ExpensesProvider) {

        this.subject = new Subject<Options>();

    }

    Options() {
        TimeAgo.addLocale(en)
        const timeAgo = new TimeAgo('en-US')
        let dataAmount = [];
        let created_at = [];
        let start;
        let stop;
        let total = 0;
        const sub = this.exApi.getExpensesAll().subscribe((data: any[]) => {
            this.expenses = data;
            start = dateformat(data[0]['created_at'], "yyyy-mm-dd");
            stop = dateformat(data[data.length - 1]['created_at'], "yyyy-mm-dd");
            this.expenses.forEach(element => {
                dataAmount.push(+element['amount']);
                total += element['amount'];
                created_at.push(timeAgo.format(Date.parse(element['created_at'])));
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
                    categories: created_at
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
            }
            this.subject.next(this.chartOption);
            dataAmount = [];
            created_at = [];
            start = null;
            stop = null;
            total = 0;
        })
    }

    getOptions() {
        return this.subject.asObservable();
    }

    ngOnInit() {

    }

}

