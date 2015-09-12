var BrowserWindow = require('browser-window');
var ipc = require('ipc');
var fs = require('fs');

module.exports = function(args, mainWindow) {
  var width = args.width || 400;
  var height = args.height || 200;
  var frame = args.frame || false;
  var killOnBlur = args.killOnBlur || true;
  var eventName = args.eventName || '';
  var filename = args.filename;
  if(fs.accessSync(`file://${__dirname}/../render/popup/${filename}/index.html`) === undefined)
    filename = '404';

  var popUp = new BrowserWindow({
    width: width,
    height: height,
    frame: frame,
  });

  popUp.loadUrl(`file://${__dirname}/../render/popup/${filename}/index.html`);

  if (killOnBlur)
    popUp.on('blur', function (event) {
      popUp.close();
    });

  ipc.on('close', function(event, args) {
    mainWindow.send(eventName, args.info);
    popUp.close();
  });
};
