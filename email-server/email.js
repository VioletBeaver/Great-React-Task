const { SMTPServer } = require('smtp-server');
const path = require('path');
const fs = require('fs');
const { simpleParser } = require('mailparser');


const LAST_EMAIL = path.join(__dirname, 'last-email');

const emailServer = new SMTPServer({
  allowInsecureAuth: true,
  authOptional: true,

  onConnect: (session, callback) => callback(),
  onAuth: (auth, session, callback) => callback(),
  onMailFrom: (address, session, callback) => callback(),
  onRcptTo: (address, session, callback) => callback(),
  onData: (stream, session, callback) => fs.mkdir(LAST_EMAIL, { recursive: true }, () =>
    simpleParser(stream, {}, (_, parsed) =>
      fs.writeFile(path.join(LAST_EMAIL, 'index.html'), parsed.html, callback),
    )
  )
});

process.on('SIGINT', () => emailServer.close(() => {
  console.log('SMTP server closed');
  process.exit(0);
}));
emailServer.listen(5050, () => console.log('SMTP server is up'));


