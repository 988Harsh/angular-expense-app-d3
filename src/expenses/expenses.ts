import { BehaviorSubject } from 'rxjs';
export class ExpensesProvider {

    expenses = [{
        id: 1,
        description: 'Shoes',
        type: 'shopping',
        amount: 123.02,
        created_at: '2020-09-12T05:55:05.000+00:00',
        updated_at: '2020-09-12T05:55:05.000+00:00'
    },
    {
        id: 2,
        description: 'Chips',
        type: 'food',
        amount: 232.0,
        created_at: '2020-10-12T05:58:59.000+00:00',
        updated_at: '2020-09-12T05:58:59.000+00:00'
    },
    {
        id: 3,
        description: 'Pizza',
        type: 'food',
        amount: 200.0,
        created_at: '2020-09-12T06:13:45.000+00:00',
        updated_at: '2020-09-12T06:13:45.000+00:00'
    },
    {
        id: 10,
        description: 'Pants',
        type: 'shopping',
        amount: 232.0,
        created_at: '2020-09-12T06:22:40.000+00:00',
        updated_at: '2020-09-12T06:22:40.000+00:00'
    },
    {
        id: 11,
        description: 'McDonalds!',
        type: 'food',
        amount: 200.0,
        created_at: '2020-09-12T09:09:23.000+00:00',
        updated_at: '2020-09-12T09:09:23.000+00:00'
    },
    {
        id: 12,
        description: 'Toothpaste',
        type: 'household and others',
        amount: 50.0,
        created_at: '2020-09-12T09:36:48.000+00:00',
        updated_at: '2020-09-27T09:36:48.000+00:00'
    },
    {
        id: 13,
        description: 'Maggi!',
        type: 'food',
        amount: 150.0,
        created_at: '2020-10-19T09:45:11.000+00:00',
        updated_at: '2020-09-27T09:45:11.000+00:00'
    },
    {
        id: 14,
        description: 't-shirt',
        type: 'shopping',
        amount: 50.0,
        created_at: '2020-09-12T09:52:41.000+00:00',
        updated_at: '2020-09-27T09:52:41.000+00:00'
    }];
    sendExpenses = new BehaviorSubject<any>(this.expenses);
    getExpensesAll() {
        return this.sendExpenses.asObservable();
    }

    update(exp = null) {
        if (exp) {
            this.expenses.push(exp);
        }
        this.sendExpenses.next(this.expenses);
    }
}
