var Todo = (function () {
    function Todo(title) {
        this.completed = false;
        this.editing = false;
        this.title = title.trim();
    }
    Object.defineProperty(Todo.prototype, "title", {
        get: function () {
            return this._title;
        },
        set: function (value) {
            this._title = value.trim();
        },
        enumerable: true,
        configurable: true
    });
    return Todo;
})();
exports.Todo = Todo;
var TodoStore = (function () {
    function TodoStore() {
        var _this = this;
        this.storageUrl = "https://api.jsonstorage.net/v1/json/5725bb31-8a05-4754-ba35-8f12024e78e4/4f7ea1ad-95a4-4e1e-8af1-dbc8f5914b4f?apiKey=6b8ac90e-9382-4a0c-b076-7e413d425d46";
        this.todos = [];
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            var persistedTodos = JSON.parse(xhr.response || '[]');
            _this.todos = persistedTodos.map(function (todo) {
                var ret = new Todo(todo._title);
                ret.completed = todo.completed;
                return ret;
            });
        };
        xhr.open("GET", this.storageUrl);
        xhr.send();
    }
    TodoStore.prototype.updateStore = function () {
        var xhr = new XMLHttpRequest();
        xhr.open("PUT", this.storageUrl, true);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        xhr.send(JSON.stringify(this.todos));
    };
    TodoStore.prototype.getWithCompleted = function (completed) {
        return this.todos.filter(function (todo) { return todo.completed === completed; });
    };
    TodoStore.prototype.allCompleted = function () {
        return this.todos.length === this.getCompleted().length;
    };
    TodoStore.prototype.setAllTo = function (completed) {
        this.todos.forEach(function (t) { return t.completed = completed; });
        this.updateStore();
    };
    TodoStore.prototype.removeCompleted = function () {
        this.todos = this.getWithCompleted(false);
        this.updateStore();
    };
    TodoStore.prototype.getRemaining = function () {
        return this.getWithCompleted(false);
    };
    TodoStore.prototype.getCompleted = function () {
        return this.getWithCompleted(true);
    };
    TodoStore.prototype.toggleCompletion = function (todo) {
        todo.completed = !todo.completed;
        this.updateStore();
    };
    TodoStore.prototype.remove = function (todo) {
        this.todos.splice(this.todos.indexOf(todo), 1);
        this.updateStore();
    };
    TodoStore.prototype.add = function (title) {
        this.todos.push(new Todo(title));
        this.updateStore();
    };
    return TodoStore;
})();
exports.TodoStore = TodoStore;
//# sourceMappingURL=store.js.map