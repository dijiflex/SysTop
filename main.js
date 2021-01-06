
const { app, Menu, ipcMain, Tray } = require('electron');
const path = require('path')
const log = require('electron-log');
const Store = require('./Store');
const MainWindow = require('./MainWindow')
 
// Set env
process.env.NODE_ENV = 'development'

const isDev = process.env.NODE_ENV !== 'production' ? true : false
const isMac = process.platform === 'darwin' ? true : false

let mainWindow;
let tray;

//Init store and Defaults
const store = new Store({
    configName: 'user-settings',
    defaults: {
        settings: {
            cpuOverload : 80,
            alertFrequency : 5
        }
    }
})

function createMainWindow() {
  mainWindow = new MainWindow('./app/index.html', isDev);

 
}

app.on('ready', () => {
  createMainWindow()

  mainWindow.webContents.on('dom-ready', () => {
      mainWindow.webContents.send('settings:get', store.get('settings'))
  })

  mainWindow.on('close', e => {
      if(!app.isQuitting){
          e.preventDefault();
          mainWindow.hide();
      }

      return true;
  })

  const icon = path.join(__dirname, 'assets', 'icons', 'tray_icon.png');

  //Create Tray
  tray = new Tray(icon);
  tray.on('click', () =>{
      if(mainWindow.isVisible() == true){
        mainWindow.hide();
      } else {
        mainWindow.show();
      }

      tray.on('right-click', () =>{
          const contexMenu = Menu.buildFromTemplate([
              {
                  label: 'Quit',
                  click: ()=> {
                      app.isQuitting = true
                      app.quit();
                  }
              }
          ])


          tray.popUpContextMenu(contexMenu)
      })
  })

  
  const mainMenu = Menu.buildFromTemplate(menu)
  Menu.setApplicationMenu(mainMenu)
})

const menu = [
  ...(isMac ? [{ role: 'appMenu' }] : []),
  {
    role: 'fileMenu',
  },
  {
        label: 'View',
        submenu: [
            {
                label: 'Toggle Naviation',
                click: () => mainWindow.webContents.send('nav:toggle')
            }
        ]
  },
  ...(isDev
    ? [
        {
          label: 'Developer',
          submenu: [
            { role: 'reload' },
            { role: 'forcereload' },
            { type: 'separator' },
            { role: 'toggledevtools' },
          ],
        },
      ]
    : []),
]

//Set Settings
ipcMain.on('settings:set', (e, value) => {
    store.set('settings', value);
    mainWindow.webContents.send('settings:get', store.get('settings')) 
})

app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow()
  }
})

app.allowRendererProcessReuse = true
