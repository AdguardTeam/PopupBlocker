import ITransaction, { Dict, DictTransformer } from "./ITransaction";

const enum TransactionTask {
    GET,
    SET,
    REMOVE
}

export default class Transaction implements ITransaction {
    constructor(private cb?:func) {
        this.onStorageOperation = this.onStorageOperation.bind(this);
    }
    private $register:Dict;
    private tasks:(TransactionTask|DictTransformer)[] = [];
    setRegister(dict:Dict) {
        return this.transformRegister(() => {
            return dict;
        });
    }
    transformRegister(transformer:DictTransformer) {
        this.tasks.push(transformer);
        return this;
    }
    getData() {
        this.tasks.push(TransactionTask.GET);
        return this;
    }
    setData() {
        this.tasks.push(TransactionTask.SET);
        return this;
    }
    removeData() {
        this.tasks.push(TransactionTask.REMOVE);
        return this;
    }
    commit() {
        // Start executing transaction
        this.executeTasks();
    }
    private executeTasks() {
        let task = this.tasks.shift();
        let type = typeof task;
        switch(type) {
            case 'undefined':
                // End of tasks
                this.endTransactionByInvokingCallback(this.$register);
                break;
            case 'function':
                // Transform register tasks
                this.$register = (<DictTransformer>task)(this.$register);
                this.executeTasks();
                break;
            case 'number':
                // Storage operation tasks
                switch (task) {
                    case TransactionTask.GET:
                        Transaction.localStorage.get(this.$register, this.onStorageOperation);
                        break;
                    case TransactionTask.SET:
                        Transaction.localStorage.set(this.$register, this.onStorageOperation);
                        break;
                    case TransactionTask.REMOVE:
                        Transaction.localStorage.remove(Object.keys(this.$register), this.onStorageOperation);
                        break;
                }
                break;
        }
    }
    private static localStorage = chrome.storage.local;
    private onStorageOperation(items?) {
        if (Transaction.checkError()) {
            this.endTransactionByInvokingCallback();
            return;
        }
        this.$register = items;
        this.executeTasks();
    }
    private endTransactionByInvokingCallback(arg?) {
        if (!this.cb) { return; }
        this.cb.call(null, arg)
    }
    /**
     * A returned value indicates whether there was an error or not.
     */
    private static checkError():boolean {
        let lastError = chrome.runtime.lastError;
        if (lastError) {
            console.error(lastError);
            return true;
        }
        return false;
    }
}
