import { addTask, delTask, getAllTasks, updateTask } from './database.js';

const enableNotification = () => {
    Notification.requestPermission((status) => {
        console.log('Notification permission, ', status)
    })
}

const deadlineNotify = async (task) => {
    if (Notification.permission == 'granted') {
        const reg = await navigator.serviceWorker.ready
        reg.showNotification(task.title + " passed the deadline", {
            body: 'Tell me that you got it already',
            icon: '../assets/timer.png',
            actions: [
                { action: 'explore', title: 'show me' },
                { action: 'close', title: 'close' }//, icon: ''}
            ]
        })
        task.notified = true;
        task.update();
    }
}


const timerText = function (milliseconds) {
    if (milliseconds < 0) return '0';

    let seconds = Math.round(milliseconds / 1000);
    if (seconds < 60) return seconds + '';

    let minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ${seconds % 60}s`;

    let hours = Math.floor(seconds / (60 * 60));
    if (hours < 24) return `${hours}h ${Math.floor(seconds % (60 * 60)/60)}m`;

    let days = Math.floor(seconds / (60 * 60 * 24));
    if (days < 366) return `${days}d`;

    let years = Math.floor(seconds / (60 * 60 * 24 * 365.35));
    return `${years}y`
}

class Task
{
    static #allTitles = [];
    constructor({id, title, date, done, notified}) {
        if (id) this.id = id;
        else addTask(this);
        this.title = title;
        this.date = date;
        this.done = done || false;
        this.notified = notified || false;
        Task.#allTitles.push(title)
    }

    static exists(title) {
        return Task.#allTitles.includes(title)
    }
    delete() {
        delTask(this.id);
        const idx = Task.#allTitles.indexOf(this.title)
        Task.#allTitles.splice(idx, 1)
    }

    update(obj={}) {
        for (let prop in obj)
            this[prop] = obj[prop];

        updateTask(this);
    }

    timer(element) {
        clearInterval(this.interval);
        let deadline = new Date(this.date);
        let remaining = deadline - new Date();
        let text = timerText(remaining);
        let longTime = text.includes('y') || text.includes('d');

        element.innerText = text;
        this.interval = !longTime && setInterval(()=>{
            text = timerText(remaining);
            if (element.innerText != text)
                element.innerText = text;
            if (remaining < 0){
                clearInterval(this.interval); 
                element.parentElement.classList.add('dead');
                !this.done && !this.notified && deadlineNotify(this);
            }
            remaining = remaining - 500;
        }, 500)
    }

    render(tagName='li', parentElem=false) {
        let taskElem = document.createElement(tagName);
    
        //the checker
        let childElem = document.createElement('div');
        childElem.classList.add('check');
        childElem.innerText = '✔';
        childElem.onclick = () => {
            if (this.interval) {
                clearInterval(this.interval); 
                this.interval = 0;
            } else this.timer(taskElem.querySelector(".timer"))
            taskElem.classList.toggle('done');
            this.done = !this.done;
            this.update();
        }
        taskElem.append(childElem);

        //the task description
        childElem = document.createElement('p');
        childElem.innerText = this.title;
        taskElem.append(childElem);

        //the timer
        childElem = document.createElement('div');
        childElem.classList.add('timer');
        childElem.innerText = "--";
        !this.done && this.timer(childElem)
        taskElem.append(childElem);

        //the remove btn
        childElem = document.createElement('div');
        childElem.classList.add('delete');
        childElem.innerText = '✗';
        childElem.onclick = (e) => {
            this.delete()
            clearInterval(this.interval)
            e.target.parentElement.remove();
        }
        taskElem.append(childElem);
    
        // append it
        taskElem.classList.add('task', this.done && 'done');
        if (parentElem) parentElem.append(taskElem);
    }
}

export { timerText, Task, getAllTasks, addTask, enableNotification };