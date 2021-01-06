

const { app, Menu, Tray} = require('electron');

class AppTray extends Tray {
    constructor (icon, mainWindow) {
        super(icon);
        this.mainWindow = mainWindow

        this.setToolTip('SysTop')
        this.on('click',  this.onClick.bind(this));
        this.on('right-click',  this.onRightClick.bind(this))
    }

    onClick(){
        if(this.mainWindow.isVisible() == true){
            mainWindow.hide();
          } else {
            this.mainWindow.show();
          }
    }

    onRightClick(){
        const contexMenu = Menu.buildFromTemplate([
            {
                label: 'Quit',
                click: () => {
                    app.isQuitting = true
                    app.quit();
                }
            }
        ])


        this.popUpContextMenu(contexMenu)
    }
}

module.exports = AppTray;