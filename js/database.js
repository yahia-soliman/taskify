import { openDB } from "./idb.js";//'https://cdn.jsdelivr.net/npm/idb@8/+esm';

const dbPromise = openDB('Tasks', 1,{
    upgrade(db, oldversion) {
        console.log('calling upgrade');
        if (oldversion == 0) {
            console.log('upgrading from 0');
            const store = db.createObjectStore('tasks', {
                keyPath: 'id',
                autoIncrement: true
            });
            store.createIndex('title', 'title', {unique: true})
        }
    }
});

const getTask = async (title) => {
    const db = await dbPromise;
    return db.getFromIndex('tasks', 'title', title)
}
const addTask = async (task) => {
    const db = await dbPromise;
    task.id = await db.put('tasks', task);
}
const delTask = async function(id) {
    (await dbPromise).delete('tasks', id)
}
const updateTask = async (task) => {
    await delTask(task.id);
    await addTask(task);
}
const getAllTasks = async function() {
    const db = await dbPromise;
    const tx = db.transaction('tasks', 'readonly');
    const store = tx.objectStore('tasks');
    return await store.getAll();
}

export { addTask, delTask, getAllTasks, updateTask, getTask };