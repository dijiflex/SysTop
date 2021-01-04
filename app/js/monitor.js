
const path = require('path');
const osu = require('node-os-utils');
const { mem } = require('node-os-utils');
const cpu = osu.cpu;
const men = osu.mem;
const os = osu.os;

let cpuOverload = 10;

notifyUser({
    title: 'CPU OVELOAD',
    body: `CPU is over ${cpuOverload}%`,
    icon: path.join(__dirname, 'img', 'icon.png' )
})

//Run Every 2 Seconds
setInterval(() => {
    //CPU USAGE
    cpu.usage().then(info => {
        document.getElementById('cpu-usage').innerText = info + '%';

        document.getElementById('cpu-progress').style.width = info + '%';

        //Make progress bar red if overload
        if(info > cpuOverload) {
            document.getElementById('cpu-progress').style.background = 'red';
        } else{
            document.getElementById('cpu-progress').style.background = '#30c88b';
        }
    });

    //CPU Free
    cpu.free().then(info => {
        document.getElementById('cpu-free').innerText = info + '%';
    })

    //Uptime
    document.getElementById('sys-uptime').innerText = secondsToDHMS(os.uptime())
     
}, 2000);

//show days , hours , mins and secs
function secondsToDHMS(seconds) {
    seconds = +seconds;
    console.log(seconds);
    const d = Math.floor(seconds / (3600 *24))
    const h = Math.floor((seconds % (3600 * 24)) / 3600 );
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    return `${d}d, ${h}h, ${m}m, ${s}s`
}

//Set Model
document.getElementById('cpu-model').innerText = cpu.model();

//Computer Name
document.getElementById('comp-name').innerText = os.hostname();

//OS
document.getElementById('os').innerText = `${os.type()} ${os.arch()}`;

//total Mem
mem.info().then(info => {
    document.getElementById('mem-total').innerText = info.totalMemMb;
})

//Send notificaiton
function notifyUser(options) {
    new Notification(options.title, options)
}