$(document).ready(function () {
    url = '';
    namespace = '/mobbot';
    var socket = io(url + namespace);

    //connected to server event
    socket.on('connect', function () {
        console.log('connected to server');
    });

    //listen for mobbot message
    socket.on('mobbot_message', (data) => {
        console.log('new message --- ' + data.msg);
        printData('message', data.msg);
    });

    //listen for mobbot notification
    socket.on('mobbot_notification', (data) => {
        console.log('new message --- ' + data.msg);
        printData('notification', data.msg);
    });

    function printData(type, msg) {
        const template = document.getElementById(type + '_template');
        let copy = template.content.cloneNode(true);
        let container = document.getElementById(type + '_container');
        copy.querySelector('.' + type + '_mobbot').innerHTML =
            msg + ' - ' + Date.now().toString();
        container.appendChild(copy);
    }
});
