const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')

const FILE_PATH = './saved-files'

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    }
  })

  win.loadFile('index.html')

}

function saveFile (name, html) {
    let path = FILE_PATH + '/' + name;
    console.log(path)
    // Creating and Writing to the sample.txt file
    fs.writeFile(path, html, function (err) {
    if (err) throw err;
    console.log('Saved!');
    });
}

function readFile (file) {
    let path = FILE_PATH + '/' + file;
return fs.readFileSync(path, 'utf8')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Event handler for asynchronous incoming messages
ipcMain.on('save-data', (event, arg) => {
    let fileName = 'file.html'
    saveFile(fileName, arg)
    event.sender.send('saved-data', {status : 'success', file : fileName})
 })

 ipcMain.on('load-data', (event, arg) => {
    let fileName = 'file.html'
    let content = readFile(fileName)
    event.sender.send('loaded-data', {status : 'success', content : content})
 })