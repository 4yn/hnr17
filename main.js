const {app, BrowserWindow, ipcMain, globalShortcut} = require('electron')
const path = require('path')
const url = require('url')
var robot = require('robotjs')

var disabled = false;
var mousedown = false;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWin,miniWin;

function spawnMini(){
  if(miniWin==null){
    miniWin = new BrowserWindow({width: 400, height: 300,frame:false, resizable: false, transparent: true});
    miniWin.setAlwaysOnTop(true,"status");
    // miniWin.webContents.openDevTools()
    miniWin.loadURL(url.format({
    pathname: path.join(__dirname, 'mini.html'),
    protocol: 'file:',
    slashes: true
  }))
  } else {
    miniWin.restore();
  }
  // miniWin.webContents.openDevTools()
}

function killMini(){
  miniWin.minimize();
}

function createWindow () {
  // Create the browser window.
  mainWin = new BrowserWindow({width: 820, height: 450, resizable: false})

  // and load the index.html of the app.
  mainWin.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  mainWin.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWin.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWin = null
  })

  spawnMini();
  // mainWin.on('blur', () => {
  //   // mainWin.minimize();
  //   // spawn preview window
  //   // mainWin.minimize();
  //   spawnMini();
  // })
  // mainWin.on('focus', () => {
  //   // spawn preview window
  //   if(miniWin!=null) killMini();
  // })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow();
  // const disable = globalShortcut.register('CommandOrControl+X', () => {
  //   disabled = !disabled
  // });
  // const showmain = globalShortcut.register('CommandOrControl+Z', () => {
  //   mainWin.restore();
  // });
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

ipcMain.on('tracker-move', (event, arg) => {
  if (!disabled) {
    if (arg["x"] != -1 && arg["y"] != -1) {
      robot.moveMouse(arg["x"], arg["y"]);
    } 
  }
})

ipcMain.on('tracker-keypress', (event, arg) => {
  robot.keyTap("enter");
})

ipcMain.on('tracker-bindings', (event, arg) => {
  if (arg["left_down"] && !mousedown) {
    robot.mouseToggle("down");
    mousedown = true;
  } else if (mousedown) {
    robot.mouseToggle("up");
    mousedown = false;
  }
});

//ipcMain.on('whereever you are')

// ipcMain.on('clickonce', (event, arg) => {
//   robot.mouseClick();
// })