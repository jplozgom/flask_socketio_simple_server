
#!/usr/bin/env python
from threading import Lock
from flask import Flask, render_template, session, request, copy_current_request_context
from flask_socketio import SocketIO, emit, disconnect
from datetime import datetime
from flask_cors import CORS, cross_origin



# Set this variable to "threading", "eventlet" or "gevent" to test the
# different async modes, or leave it set to None for the application to choose
# the best option based on installed packages.
async_mode = None

app = Flask(__name__)
app.config['SECRET_KEY'] = 'Mobbot93274asdA#2dd%$3dzA!'
# socketio = SocketIO(app, async_mode=async_mode)
socketio = SocketIO(app, async_mode=async_mode,  cors_allowed_origins="*")
notificationsThread = None
messagesThread = None
CORS(app)
thread_lock = Lock()


def backgroundMessaging():
    while True:
        socketio.sleep(8)
        now = datetime.now()
        current_time = now.strftime("%H:%M:%S")
        print("A new message to print - " + str(current_time))
        socketio.emit('mobbot_message',{'msg':"A new message to print - " + str(current_time)}, namespace='/mobbot', broadcast=True)


def backgroundNotifications():
    while True:
        socketio.sleep(8)
        now = datetime.now()
        current_time = now.strftime("%H:%M:%S")
        print("A new notification to print - " + str(current_time))
        socketio.emit('mobbot_notification',{'msg':"Change roles - " + str(current_time)},namespace='/mobbot', broadcast=True)


@app.route('/')
def index():
    return render_template('index.html', async_mode=socketio.async_mode)

@socketio.on('connect', namespace='/mobbot')
def socket_connected():
    print("user connected")
    global notificationsThread
    global messagesThread
    with thread_lock:
        if messagesThread is None:
            messagesThread = socketio.start_background_task(backgroundMessaging)
        if notificationsThread is None:
            notificationsThread = socketio.start_background_task(backgroundNotifications)


@socketio.on('disconnect', namespace='/mobbot')
def socket_disconnected():
    print('Disconnected', request.sid)


if __name__ == '__main__':
    socketio.run(app, debug=True)