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
        this.storageUrl = "https://jsonstorage.net/api/items/4da84b0a-2a30-4044-ab9a-2076b97d5d5f";
        this.todos = [];
        ;
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