var print = function(msg) {
    console.log('Parallel: ' + msg);
}

function Parallel() {
    this.tasks = {};
    this.counter = 0;
    print('Create done.')
}
Parallel.prototype.task = function(name, task) {
    this.tasks[name] = task;
    print('Add task: ' + name)
    return this;
}
Parallel.prototype.run = function() {
    for (var name in this.tasks) {
        var task = this.tasks[name];
        task(iter(name).bind(this));
    }

    function iter(name) {
        return function(err, result) {
            print('One task done: ' + name)
            if (err) return this._done(err);
            this.tasks[name] = result;
            this.counter++;
            if (this.counter == Object.keys(this.tasks).length) {
                print('All tasks done.')
                this._done(null, this.tasks);
            }
        }
    }
    return this;
}

// register done callback.
Parallel.prototype.done = function(done) {
    var isDone = false;
    // wrap done callback
    this._done = function(err, results) {
        if (isDone) return;
        isDone = true;
        done(err, results);
    };
    print('Add done task.')
    return this;
}
module.exports = Parallel;