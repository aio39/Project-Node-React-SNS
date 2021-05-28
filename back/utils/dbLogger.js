const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');

const date = dayjs().format('YYYY[_]MM[_]DD');
const time = dayjs().format('H:mm:ss');

const logPath = path.join('./', `/log`);

if (!fs.existsSync(logPath)) fs.mkdirSync(logPath, { recursive: true });

console.log(`📂Query Log File : ./log/`);

const log = fs.createWriteStream(`${logPath}/${date}.log`, { flags: 'a' });
log.write(`\n\n[${time}]\n`);

module.exports = function dbLogger(msg) {
  log.write(`${msg}\n`);
};
