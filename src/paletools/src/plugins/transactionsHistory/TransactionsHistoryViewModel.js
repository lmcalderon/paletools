/// #if process.env.TRANSACTIONS_HISTORY
export default class TransactionsHistoryViewModel {
    constructor() {
        this.transactions = {
            range: {
                from: null,
                to: null,
            },
            buy: [],
            sell: []
        };
        this.counts = {
            buy: 0,
            sell: 0,
            month: {}
        };
    }
};
/// #endif