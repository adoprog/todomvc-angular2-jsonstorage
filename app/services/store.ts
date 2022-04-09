export class Todo {
	completed: Boolean;
	editing: Boolean;

	private _title: String;
	get title() {
		return this._title;
	}
	set title(value: String) {
		this._title = value.trim();
	}

	constructor(title: String) {
		this.completed = false;
		this.editing = false;
		this.title = title.trim();
	}
}

export class TodoStore {
	todos: Array<Todo>;
	storageUrl = "https://api.jsonstorage.net/v1/json/5725bb31-8a05-4754-ba35-8f12024e78e4/4f7ea1ad-95a4-4e1e-8af1-dbc8f5914b4f?apiKey=6b8ac90e-9382-4a0c-b076-7e413d425d46";

	constructor() {
		this.todos = [];
		
		let xhr = new XMLHttpRequest();
		xhr.onload = () => {
			let persistedTodos = JSON.parse(xhr.response || '[]');
			this.todos = persistedTodos.map((todo: { _title: String, completed: Boolean }) => {
				let ret = new Todo(todo._title);
				ret.completed = todo.completed;
				return ret;
			});
		}
		xhr.open("GET", this.storageUrl);
		xhr.send();
	}

	private updateStore() {
		let xhr = new XMLHttpRequest();
		xhr.open("PUT", this.storageUrl, true);
		xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
		xhr.send(JSON.stringify(this.todos));
	}

	private getWithCompleted(completed: Boolean) {
		return this.todos.filter((todo: Todo) => todo.completed === completed);
	}

	allCompleted() {
		return this.todos.length === this.getCompleted().length;
	}

	setAllTo(completed: Boolean) {
		this.todos.forEach((t: Todo) => t.completed = completed);
		this.updateStore();
	}

	removeCompleted() {
		this.todos = this.getWithCompleted(false);
		this.updateStore();
	}

	getRemaining() {
		return this.getWithCompleted(false);
	}

	getCompleted() {
		return this.getWithCompleted(true);
	}

	toggleCompletion(todo: Todo) {
		todo.completed = !todo.completed;
		this.updateStore();
	}

	remove(todo: Todo) {
		this.todos.splice(this.todos.indexOf(todo), 1);
		this.updateStore();
	}

	add(title: String) {
		this.todos.push(new Todo(title));
		this.updateStore();
	}
}
