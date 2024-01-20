import { Task, enableNotification, getAllTasks } from './utils.js';

const taskList = document.getElementById('tasklist');
const formElem = document.getElementById('form');
const error = document.getElementById('error');
const notifyBtn = document.getElementById('notify');
const taskInput = formElem.elements.task;
const dateInput = formElem.elements.date;

const defaultDate = new Date();
dateInput.min = defaultDate.toISOString().split(':')[0] + ':00';
defaultDate.setHours(defaultDate.getHours() + 5);
dateInput.value = defaultDate.toISOString().split(':')[0] + ':00';

(await getAllTasks()).map((task) => {
    task = new Task(task);
    task.render('li', taskList);
})
formElem.onsubmit = async function (e) {
    e.preventDefault();
    if (Task.exists(taskInput.value)) {
        error.innerText = 'Its already there, finish it!';
    } else {
        error.innerText = '';
        new Task({
            title: taskInput.value,
            date: dateInput.value
        }).render('li', taskList);
    }
    taskInput.value = "";
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(swReg => {
            console.log('Service Worker is registered', swReg);
        })
        .catch(err => {
            console.error('Service Worker Error', err);
        });
    if (Notification.permission != "granted") {
        notifyBtn.removeAttribute('hidden');
        notifyBtn.onclick = () => {
            enableNotification();
            notifyBtn.setAttribute('hidden', true);
        }
    }
} else {
    console.warn('serviceWorker is not supported');
}