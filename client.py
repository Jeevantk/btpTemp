from datetime import datetime
from socketIO_client import SocketIO, LoggingNamespace
import sys

while True:
    with SocketIO( 'http://34.212.83.92', 4000, LoggingNamespace ) as socketIO:
        now = datetime.now()
        socketIO.emit( 'python-message', now.strftime( "%-d %b %Y %H:%M:%S.%f" ) )
        socketIO.wait( seconds=1 )