const cluster = require('cluster')
const axios = require('axios')
const { firefox } = require('playwright')
const prompt = require('prompt-sync')({ sigint: true })
fs = require('fs');

var created = 0;
var accounts = fs.createWriteStream('accounts.txt', {
    flags: 'a'
  })

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

process.title = 'MoonStress | Accounts Created: ' + created;

intro = 
` 
███▄ ▄███▓ ▒█████   ▒█████   ███▄    █   ██████ ▄▄▄█████▓ ██▀███  ▓█████   ██████   ██████ 
▓██▒▀█▀ ██▒▒██▒  ██▒▒██▒  ██▒ ██ ▀█   █ ▒██    ▒ ▓  ██▒ ▓▒▓██ ▒ ██▒▓█   ▀ ▒██    ▒ ▒██    ▒ 
▓██    ▓██░▒██░  ██▒▒██░  ██▒▓██  ▀█ ██▒░ ▓██▄   ▒ ▓██░ ▒░▓██ ░▄█ ▒▒███   ░ ▓██▄   ░ ▓██▄   
▒██    ▒██ ▒██   ██░▒██   ██░▓██▒  ▐▌██▒  ▒   ██▒░ ▓██▓ ░ ▒██▀▀█▄  ▒▓█  ▄   ▒   ██▒  ▒   ██▒
▒██▒   ░██▒░ ████▓▒░░ ████▓▒░▒██░   ▓██░▒██████▒▒  ▒██▒ ░ ░██▓ ▒██▒░▒████▒▒██████▒▒▒██████▒▒
░ ▒░   ░  ░░ ▒░▒░▒░ ░ ▒░▒░▒░ ░ ▒░   ▒ ▒ ▒ ▒▓▒ ▒ ░  ▒ ░░   ░ ▒▓ ░▒▓░░░ ▒░ ░▒ ▒▓▒ ▒ ░▒ ▒▓▒ ▒ ░
░  ░      ░  ░ ▒ ▒░   ░ ▒ ▒░ ░ ░░   ░ ▒░░ ░▒  ░ ░    ░      ░▒ ░ ▒░ ░ ░  ░░ ░▒  ░ ░░ ░▒  ░ ░
░      ░   ░ ░ ░ ▒  ░ ░ ░ ▒     ░   ░ ░ ░  ░  ░    ░        ░░   ░    ░   ░  ░  ░  ░  ░  ░  
       ░       ░ ░      ░ ░           ░       ░              ░        ░  ░      ░        ░  
             https://github.com/marseille1337/moonstress-account-creator/

`

;(async () => {
    if(cluster.isMaster) {
        console.clear()
        console.log('\x1b[35m%s\x1b[0m', (intro));
        var threads = parseInt(prompt('\x1b[35mMoonStress | Threads -> \x1b[0m'))
        for (var i = 0; i < threads; i++) {
            cluster.fork()
        }
    } else {
        await generator()
    }

})()

async function generator() {

    const browser = await firefox.launch({ headless: false }) //You can set to "true", then it won't show the browser
    var page = await browser.newPage()

    var username = Math.random().toString(12).substring(2, 4);
    username += 'marseille'
    var password = Math.random().toString(12).substring(6, 12);
    await page.goto('https://moonstress.com/');
    await page.click('text=Register');
    await page.fill('[placeholder="enter your username"]', username);
    console.log('\x1b[35m%s\x1b[0m', 'MoonStress | Username: ' + username)
    await page.fill('[placeholder="enter your password"]', password);
    await page.fill('[placeholder="repeat your password"]', password);
    console.log('\x1b[35m%s\x1b[0m', 'MoonStress | Password: ' + password)
    await page.click('text=Sign Up');
    console.log('\x1b[35m%s\x1b[0m', 'MoonStress | Succesfully created, accounts.txt')
    accounts.write('\n' + username + ':' + password)
    process.send({ created: "+1" })
    await browser.close
        await generator()
}
