self.addEventListener('notificationclick', event=>{
    console.log(event)
    event.notification.close()
    const action= event.action
    if (action == 'explore') clients.openWindow('/');
    if (action == 'close') console.log('close');
})