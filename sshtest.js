var SSH = require('simple-ssh');

var ssh = new SSH({
    host: 'localhost',
    user: 'jeevan',
    pass: ''
});

ssh.exec('echo $PATH', {
    out: function(stdout) {
        console.log(stdout);
    }
}).start();