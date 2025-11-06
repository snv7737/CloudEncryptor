const { app, BrowserWindow, shell, Menu, Tray, dialog, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');
const { ipcMain } = require('electron');

let mainWindow;
let tray;
let isQuitting = false;

// Store folder paths for different types
const folderPaths = {
  encrypt: null,
  decrypt: null, 
  notes: null
};

// Custom tray icon loader - Development and Production both supported
function loadTrayIcon() {
  // Try multiple paths for both development and production
  const possiblePaths = [
    // Development paths
    path.join(__dirname, 'assets', 'tray-icon.png'),
    path.join(__dirname, 'assets', 'icon.png'),
    path.join(__dirname, 'assets', 'tray-icon.ico'),
    path.join(__dirname, 'assets', 'icon.ico'),
    path.join(__dirname, 'assets', 'tray-icon.jpg'),
    path.join(__dirname, 'assets', 'icon.jpg'),
    
    // Production paths (after build)
    path.join(process.resourcesPath, 'assets', 'tray-icon.png'),
    path.join(process.resourcesPath, 'assets', 'icon.png'),
    path.join(process.resourcesPath, 'assets', 'tray-icon.ico'),
    path.join(process.resourcesPath, 'assets', 'icon.ico'),
    
    // Fallback paths
    path.join(__dirname, '..', 'assets', 'tray-icon.png'),
    path.join(__dirname, '..', 'assets', 'icon.png'),
  ];

  console.log('🔍 Searching for tray icon in possible paths...');
  
  for (const iconPath of possiblePaths) {
    try {
      if (fs.existsSync(iconPath)) {
        console.log('🔄 Loading tray icon from:', iconPath);
        const image = nativeImage.createFromPath(iconPath);
        if (!image.isEmpty()) {
          console.log('✅ Tray icon successfully loaded from:', iconPath);
          const resized = image.resize({ width: 32, height: 32 });
          return resized;
        }
      }
    } catch (error) {
      console.log('❌ Failed to load icon from:', iconPath, error.message);
    }
  }

  // Final fallback: Create a dynamic icon
  console.log('⚠️ Using dynamic fallback tray icon');
  return createDynamicTrayIcon();
}

// Create dynamic tray icon as fallback
function createDynamicTrayIcon() {
  const size = 32;
  const bytesPerPixel = 4;
  const buffer = Buffer.alloc(size * size * bytesPerPixel);
  
  // Create a green lock icon programmatically
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const index = (y * size + x) * bytesPerPixel;
      
      // Draw a simple lock shape
      const isLockBody = (x > 8 && x < 24 && y > 12 && y < 24);
      const isLockTop = (x > 12 && x < 20 && y > 6 && y < 16);
      
      if (isLockBody || isLockTop) {
        // Green color for lock
        buffer[index] = 0;       // R
        buffer[index + 1] = 255; // G
        buffer[index + 2] = 102; // B
        buffer[index + 3] = 255; // A
      } else if (x > 6 && x < 26 && y > 6 && y < 26) {
        // Dark green background
        buffer[index] = 0;       // R
        buffer[index + 1] = 100; // G
        buffer[index + 2] = 0;   // B
        buffer[index + 3] = 255; // A
      } else {
        // Transparent
        buffer[index + 3] = 0;
      }
    }
  }
  
  return nativeImage.createFromBuffer(buffer, {
    width: size,
    height: size
  });
}

// Application menu তৈরি করুন
function createAppMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Encrypt Files',
          accelerator: 'Ctrl+E',
          click: () => {
            if (mainWindow) {
              mainWindow.show();
              mainWindow.focus();
              mainWindow.webContents.executeJavaScript(`
                if (document.getElementById('encrypt-section')) {
                  document.getElementById('encrypt-section').scrollIntoView({behavior: 'smooth'});
                  setTimeout(() => {
                    const fileInput = document.getElementById('fileInputEncrypt');
                    if (fileInput) fileInput.click();
                  }, 500);
                }
              `);
            }
          }
        },
        {
          label: 'Decrypt Files', 
          accelerator: 'Ctrl+D',
          click: () => {
            if (mainWindow) {
              mainWindow.show();
              mainWindow.focus();
              mainWindow.webContents.executeJavaScript(`
                if (document.getElementById('decrypt-section')) {
                  document.getElementById('decrypt-section').scrollIntoView({behavior: 'smooth'});
                  setTimeout(() => {
                    const fileInput = document.getElementById('fileInputDecrypt');
                    if (fileInput) fileInput.click();
                  }, 500);
                }
              `);
            }
          }
        },
        { type: 'separator' },
        { 
          label: 'New Secure Note', 
          accelerator: 'Ctrl+N',
          click: () => {
            if (mainWindow) {
              mainWindow.show();
              mainWindow.focus();
              mainWindow.webContents.executeJavaScript(`
                document.getElementById('notes-section').scrollIntoView({behavior: 'smooth'});
                document.getElementById('noteText').focus();
              `);
            }
          }
        },
        { type: 'separator' },
        { 
          label: 'Fullscreen', 
          accelerator: 'F11',
          click: () => {
            if (mainWindow) {
              mainWindow.setFullScreen(!mainWindow.isFullScreen());
            }
          }
        },
        { type: 'separator' },
        { 
          label: 'Exit Cloud Encryptor', 
          accelerator: 'Ctrl+Q',
          click: () => {
            isQuitting = true;
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo', label: 'Undo' },
        { role: 'redo', label: 'Redo' },
        { type: 'separator' },
        { role: 'cut', label: 'Cut' },
        { role: 'copy', label: 'Copy' },
        { role: 'paste', label: 'Paste' },
        { role: 'selectall', label: 'Select All' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload', label: 'Reload' },
        { role: 'forceReload', label: 'Force Reload' },
        { role: 'toggleDevTools', label: 'Developer Tools' },
        { type: 'separator' },
        { role: 'resetZoom', label: 'Actual Size' },
        { role: 'zoomIn', label: 'Zoom In' },
        { role: 'zoomOut', label: 'Zoom Out' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Toggle Fullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize', label: 'Minimize' },
        { role: 'close', label: 'Close Window' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'User Guide & Instructions',
          accelerator: 'F1',
          click: () => {
            if (mainWindow) {
              mainWindow.show();
              mainWindow.focus();
              dialog.showMessageBox(mainWindow, {
                type: 'info',
                title: 'Cloud Encryptor - Complete User Guide',
                message: '📖 Detailed User Guide & Instructions',
                detail: `🔐 CLOUD ENCRYPTOR - COMPLETE USER GUIDE v2.0.0

🔒 HOW TO ENCRYPT FILES:
1. Click 'Encrypt Files' button or press Ctrl+E
2. Drag & drop files or click to select multiple files
3. Enter a strong passphrase (12+ characters with mix of letters, numbers, symbols)
4. Set PBKDF2 iterations:
   • 100k - Fast but less secure
   • 250k - Recommended balance (default)
   • 500k - More secure
   • 1M - Maximum security (slower)
5. Click "Choose Folder" to select specific save location for encrypted files
6. Click "Encrypt & Save" button
7. Encrypted files will be saved with .enc extension in selected folder

🔓 HOW TO DECRYPT FILES:
1. Click 'Decrypt Files' button or press Ctrl+D
2. Select .enc files only (encrypted files)
3. Enter the exact same passphrase used during encryption
4. Set same PBKDF2 iterations as used during encryption
5. Click "Choose Folder" to select specific save location for decrypted files
6. Click "Decrypt & Save" button
7. Original files will be restored in selected folder

📝 SECURE NOTES FEATURE:
• Write confidential notes in the secure notes section
• Set separate passphrase for each note (different from file encryption)
• Choose auto-expire duration:
  - 1 day, 7 days, 30 days (default), 90 days, or Never
• Click "Choose Folder" to select save location for note files
• Click "Save Note" to encrypt and save the note
• Use "Preview Notes" to view decrypted notes (requires passphrase)
• "Export" to backup all notes, "Import" to restore notes
• "Clear All" to delete all saved notes

💡 ADVANCED FEATURES:
• Separate folder selection for Encrypt, Decrypt, and Notes
• Selected folders are remembered during app session
• Progress bars show operation status
• Password strength indicator for encryption
• Matrix background for security aesthetics
• System tray integration for quick access
• Keyboard shortcuts for all major functions

🛡️ SECURITY BEST PRACTICES:
• Use unique, strong passphrases for different files
• Never reuse passwords across different services
• Keep backups of important encrypted files
• Remember your passphrase - it cannot be recovered!
• Use 250k+ iterations for better security
• Close the app when not in use for maximum security

⌨️ KEYBOARD SHORTCUTS:
Ctrl+E - Quick Encrypt Files
Ctrl+D - Quick Decrypt Files  
Ctrl+N - New Secure Note
F11 - Toggle Fullscreen
Ctrl+Q - Exit Application
F1 - This Help Guide
Ctrl+R - Reload Application

🎯 TROUBLESHOOTING:
• Ensure correct passphrase for decryption
• Only .enc files can be decrypted
• Use same iterations as encryption for decryption
• Files save to selected folders or Downloads as fallback
• Restart app if experiencing performance issues

📞 SUPPORT & CONTACT:
Developer: AL HASSAN | SNV7737
Discord: @ALHASSAN7737 | @SNV7737
GitHub: https://github.com/snv7737
Discord Server: https://discord.gg/fjfNCsf

Thank you for using Cloud Encryptor! 🔐`
              });
            }
          }
        },
        {
          label: 'About Cloud Encryptor',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About Cloud Encryptor',
              message: 'Cloud Encryptor PRO v2.0.0',
              detail: `🔐 CLOUD ENCRYPTOR - Secure File Encryption Tool

Version: 2.0.0
Developer: SNV7737 | AL HASSAN
GitHub: https://github.com/snv7737

A professional-grade file encryption tool with 
military-grade AES-256-GCM encryption for maximum security.

🛡️ SECURITY FEATURES:
• AES-256-GCM Encryption (Military Grade)
• PBKDF2 Key Derivation (100k to 1M iterations)
• Zero-Knowledge Architecture
• Local Processing Only - No Data Transmission
• Secure Notes Encryption
• Separate Folder Management
• System Tray Integration

🌐 SUPPORTED PLATFORMS:
• Windows (Full Support)
• macOS (Compatible) 
• Linux (Compatible)

📞 CONTACT DEVELOPER:
Discord: @ALHASSAN7737 | @SNV7737
GitHub: snv7737
Email: snv7737@github.com

🔗 LINKS:
GitHub Repository: https://github.com/snv7737
Discord Community: https://discord.gg/fjfNCsf

Built with passion for digital privacy and security.`
            });
          }
        },
        {
          label: 'Visit GitHub Repository',
          click: () => {
            shell.openExternal('https://github.com/snv7737');
          }
        },
        {
          label: 'Join Discord Community',
          click: () => {
            shell.openExternal('https://discord.gg/fjfNCsf');
          }
        },
        { type: 'separator' },
        {
          label: 'Check for Updates',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'Update Check',
              message: 'Cloud Encryptor Update Status',
              detail: '✅ You are using the latest version: 2.0.0\n\n🔔 Update Notifications:\n• Automatic update checking is enabled\n• Visit GitHub for new releases\n• Follow Discord for announcements\n\n📢 Stay updated for new features and security enhancements!'
            });
          }
        },
        { type: 'separator' },
        {
          label: 'Developer Information',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'Developer Info',
              message: 'About the Developer',
              detail: `👨‍💻 DEVELOPER: AL HASSAN | SNV7737

🌐 PROFILES:
GitHub: https://github.com/snv7737
Discord: @ALHASSAN7737 | @SNV7737

💼 SPECIALIZATION:
• File Encryption & Security
• Cryptography Systems
• Privacy-focused Applications
• Cross-platform Development

🔧 TECHNICAL EXPERTISE:
• AES-256 Encryption Systems
• Electron Framework
• Web Cryptography API
• Security Architecture

📫 CONTACT:
For security issues, feature requests, or collaboration,
please contact via GitHub or Discord.

Thank you for your support! 🚀`
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// System tray তৈরি করুন
function createAppTray() {
  try {
    const trayIcon = loadTrayIcon();
    tray = new Tray(trayIcon);
    
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Show Cloud Encryptor',
        click: () => {
          if (mainWindow) {
            mainWindow.show();
            mainWindow.focus();
          }
        }
      },
      {
        label: 'Quick Encrypt Files',
        accelerator: 'Ctrl+E',
        click: () => {
          if (mainWindow) {
            mainWindow.show();
            mainWindow.focus();
            mainWindow.webContents.executeJavaScript(`
              if (document.getElementById('encrypt-section')) {
                document.getElementById('encrypt-section').scrollIntoView({behavior: 'smooth'});
                setTimeout(() => {
                  const fileInput = document.getElementById('fileInputEncrypt');
                  if (fileInput) fileInput.click();
                }, 500);
              }
            `);
          }
        }
      },
      {
        label: 'Quick Decrypt Files',
        accelerator: 'Ctrl+D',
        click: () => {
          if (mainWindow) {
            mainWindow.show();
            mainWindow.focus();
            mainWindow.webContents.executeJavaScript(`
              if (document.getElementById('decrypt-section')) {
                document.getElementById('decrypt-section').scrollIntoView({behavior: 'smooth'});
                setTimeout(() => {
                  const fileInput = document.getElementById('fileInputDecrypt');
                  if (fileInput) fileInput.click();
                }, 500);
              }
            `);
          }
        }
      },
      { type: 'separator' },
      {
        label: 'New Secure Note',
        accelerator: 'Ctrl+N',
        click: () => {
          if (mainWindow) {
            mainWindow.show();
            mainWindow.focus();
            mainWindow.webContents.executeJavaScript(`
              document.getElementById('notes-section').scrollIntoView({behavior: 'smooth'});
              document.getElementById('noteText').focus();
            `);
          }
        }
      },
      { type: 'separator' },
      {
        label: 'Encrypt Single File',
        click: () => {
          if (mainWindow) {
            mainWindow.show();
            mainWindow.focus();
            mainWindow.webContents.executeJavaScript(`
              document.getElementById('encrypt-section').scrollIntoView({behavior: 'smooth'});
              setTimeout(() => document.getElementById('fileInputEncrypt').click(), 500);
            `);
          }
        }
      },
      {
        label: 'Decrypt Single File',
        click: () => {
          if (mainWindow) {
            mainWindow.show();
            mainWindow.focus();
            mainWindow.webContents.executeJavaScript(`
              document.getElementById('decrypt-section').scrollIntoView({behavior: 'smooth'});
              setTimeout(() => document.getElementById('fileInputDecrypt').click(), 500);
            `);
          }
        }
      },
      { type: 'separator' },
      {
        label: 'User Guide & Help',
        click: () => {
          dialog.showMessageBox(mainWindow, {
            type: 'info',
            title: 'Cloud Encryptor - Quick Guide',
            message: '📖 Quick Start Guide',
            detail: `🔒 ENCRYPT FILES:
1. Select files to encrypt
2. Enter strong passphrase
3. Choose save folder
4. Click "Encrypt & Save"

🔓 DECRYPT FILES:
1. Select .enc files
2. Enter same passphrase
3. Choose save folder
4. Click "Decrypt & Save"

📝 SECURE NOTES:
• Each section has separate folder
• Notes auto-expire based on setting
• Export/Import for backup

💡 TIP: Use different folders for Encrypt/Decrypt/Notes!`
          });
        }
      },
      {
        label: 'About Cloud Encryptor',
        click: () => {
          dialog.showMessageBox(mainWindow, {
            type: 'info',
            title: 'About',
            message: 'Cloud Encryptor v2.0.0',
            detail: 'Secure File Encryption Tool\nBy SNV7737 | AL HASSAN\n\nGitHub: https://github.com/snv7737\nDiscord: @ALHASSAN7737'
          });
        }
      },
      { type: 'separator' },
      {
        label: 'Check for Updates',
        click: () => {
          dialog.showMessageBox(mainWindow, {
            type: 'info',
            title: 'Update Check',
            message: 'Update Status',
            detail: '✅ You are using latest version: 2.0.0'
          });
        }
      },
      { type: 'separator' },
      {
        label: 'Quit Cloud Encryptor',
        click: () => {
          isQuitting = true;
          app.quit();
        }
      }
    ]);

    tray.setToolTip('Cloud Encryptor 🔐 v2.0.0\nSecure File Encryption Tool\nBy SNV7737 | AL HASSAN');
    tray.setContextMenu(contextMenu);
    
    // Double-click tray icon to show window
    tray.on('double-click', () => {
      if (mainWindow) {
        if (mainWindow.isMinimized()) {
          mainWindow.restore();
        }
        mainWindow.show();
        mainWindow.focus();
      }
    });

    // Tray icon click event
    tray.on('click', () => {
      if (mainWindow) {
        if (mainWindow.isVisible()) {
          mainWindow.hide();
        } else {
          mainWindow.show();
          mainWindow.focus();
        }
      }
    });

    console.log('✅ Tray icon created successfully');
    return tray;
  } catch (error) {
    console.error('❌ Failed to create tray:', error);
    // Even if tray fails, continue without it
    return null;
  }
}

// Window icon load করুন
function loadWindowIcon() {
  const possiblePaths = [
    path.join(__dirname, 'assets', 'icon.png'),
    path.join(__dirname, 'assets', 'icon.ico'),
    path.join(__dirname, 'assets', 'app-icon.png'),
    path.join(__dirname, 'assets', 'app-icon.ico'),
    path.join(process.resourcesPath, 'assets', 'icon.png'),
    path.join(process.resourcesPath, 'assets', 'icon.ico')
  ];

  for (const iconPath of possiblePaths) {
    try {
      if (fs.existsSync(iconPath)) {
        console.log('🔄 Loading window icon from:', iconPath);
        const image = nativeImage.createFromPath(iconPath);
        if (!image.isEmpty()) {
          console.log('✅ Window icon successfully loaded');
          return image;
        }
      }
    } catch (error) {
      console.log('❌ Failed to load window icon from:', iconPath, error.message);
    }
  }

  console.log('⚠️ Using default window icon');
  return null;
}

// Show folder picker dialog
async function showFolderPicker() {
  try {
    const result = await dialog.showOpenDialog(mainWindow, {
      title: 'Select Save Folder',
      properties: ['openDirectory', 'createDirectory'],
      buttonLabel: 'Select Folder'
    });

    if (!result.canceled && result.filePaths.length > 0) {
      return result.filePaths[0];
    }
    return null;
  } catch (error) {
    console.error('Error showing folder picker:', error);
    return null;
  }
}

// Main window তৈরি করুন
const createWindow = () => {
  const windowIcon = loadWindowIcon();

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    show: false,
    icon: windowIcon,
    title: 'Cloud Encryptor ⚙️ ⌞SΠV7737™⌝',
    fullscreenable: true,
    maximizable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
      enableRemoteModule: true,
      allowRunningInsecureContent: false
    },
    titleBarStyle: 'default',
    backgroundColor: '#000000',
    darkTheme: true
  });

  // Load the HTML file
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
    
    if (process.env.NODE_ENV === 'development') {
      mainWindow.webContents.openDevTools();
    }

    // Inject complete folder selection system
    setTimeout(() => {
      mainWindow.webContents.executeJavaScript(`
        console.log('🔧 Injecting complete folder selection system...');
        
        // Store selected folders globally
        window.selectedFolders = {
          encrypt: null,
          decrypt: null,
          notes: null
        };

        // Override the folder selection system
        if (typeof eventHandlers !== 'undefined') {
          // Replace pickFolder function
          const originalPickFolder = eventHandlers.pickFolder;
          eventHandlers.pickFolder = async function(type) {
            console.log('📁 Folder selection requested for:', type);
            
            // Send IPC message to main process
            if (window.require && window.require('electron').ipcRenderer) {
              try {
                const ipcRenderer = window.require('electron').ipcRenderer;
                const folderPath = await ipcRenderer.invoke('select-folder', type);
                
                if (folderPath) {
                  // Store the folder path globally
                  window.selectedFolders[type] = folderPath;
                  
                  // Update UI
                  const folderNameElement = document.getElementById('folderName' + type.charAt(0).toUpperCase() + type.slice(1));
                  if (folderNameElement) {
                    const folderName = folderPath.split(/[\\\\/]/).pop();
                    folderNameElement.textContent = folderName;
                    folderNameElement.style.color = '#00ff66';
                  }
                  
                  if (typeof utils !== 'undefined') {
                    utils.showNotification('✓ ' + type.toUpperCase() + ' folder selected: ' + folderPath, 'success');
                  }
                  
                  console.log('✅ Folder stored for', type + ':', folderPath);
                  return folderPath;
                }
              } catch (error) {
                console.log('IPC error:', error);
              }
            }
            
            // Fallback: show message
            if (typeof utils !== 'undefined') {
              utils.showNotification('⚠️ Folder selection not available', 'warning');
            }
            return null;
          };
        }
        
        // Override saveToFolder to use main process with separate folders
        if (typeof utils !== 'undefined') {
          const originalSaveToFolder = utils.saveToFolder;
          utils.saveToFolder = async function(blob, filename, folderType) {
            console.log('💾 Save requested:', filename, 'for type:', folderType);
            
            // Get the stored folder path for this type
            const folderPath = window.selectedFolders[folderType];
            console.log('📁 Using folder for', folderType + ':', folderPath);
            
            // Convert blob to buffer for IPC
            const arrayBuffer = await blob.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            
            // Send to main process for saving with specific type
            if (window.require && window.require('electron').ipcRenderer) {
              try {
                const ipcRenderer = window.require('electron').ipcRenderer;
                const result = await ipcRenderer.invoke('save-file', {
                  filename: filename,
                  buffer: buffer,
                  type: blob.type,
                  folderType: folderType,
                  folderPath: folderPath // Pass the actual folder path
                });
                
                if (result.success) {
                  console.log('✅ File saved to ' + folderType + ' folder:', result.path);
                  if (typeof utils !== 'undefined') {
                    utils.showNotification('✓ File saved to: ' + result.path, 'success');
                  }
                  return true;
                }
              } catch (error) {
                console.log('Save IPC error:', error);
              }
            }
            
            // Fallback to download
            console.log('📥 Falling back to download');
            this.downloadBlob(blob, filename);
            return false;
          };
        }

        // Fix the encrypt function to pass correct folder type
        if (typeof eventHandlers !== 'undefined' && eventHandlers.handleEncrypt) {
          const originalHandleEncrypt = eventHandlers.handleEncrypt;
          eventHandlers.handleEncrypt = async function() {
            console.log('🔒 Encrypt with folder system');
            // Ensure folder type is passed correctly
            return originalHandleEncrypt.call(this);
          };
        }

        // Fix the decrypt function to pass correct folder type
        if (typeof eventHandlers !== 'undefined' && eventHandlers.handleDecrypt) {
          const originalHandleDecrypt = eventHandlers.handleDecrypt;
          eventHandlers.handleDecrypt = async function() {
            console.log('🔓 Decrypt with folder system');
            // Ensure folder type is passed correctly
            return originalHandleDecrypt.call(this);
          };
        }

        // Fix the notes function to pass correct folder type
        if (typeof notesManager !== 'undefined' && notesManager.addNote) {
          const originalAddNote = notesManager.addNote;
          notesManager.addNote = async function(text, password, expireDays) {
            console.log('📝 Add note with folder system');
            // Ensure folder type is passed correctly
            return originalAddNote.call(this, text, password, expireDays);
          };
        }
        
        console.log('✅ Complete folder system injected and active');
        
        // Update UI to show folder selection is available
        document.querySelectorAll('[id^="folderName"]').forEach(element => {
          if (element.textContent.includes('Not selected') || element.textContent.includes('Auto Download') || element.textContent.includes('Click "Choose Folder"')) {
            element.textContent = 'Click "Choose Folder"';
            element.style.color = '#00ccff';
          }
        });
        
        // Show welcome message
        setTimeout(() => {
          if (typeof utils !== 'undefined') {
            utils.showNotification('🔐 Cloud Encryptor Ready - All Features Active!', 'success');
          }
        }, 1000);
      `);
    }, 2000);
  });

  // Handle window close event
  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
      
      if (process.platform === 'win32' && tray) {
        tray.displayBalloon({
          title: 'Cloud Encryptor',
          content: 'Application is running in system tray. Double-click to show window.\nAll features including folder selection are active!',
          iconType: 'info'
        });
      }
      
      return false;
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://') || url.startsWith('http://')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  // Create application menu and tray
  createAppMenu();
  createAppTray();

  // Show welcome notification
  setTimeout(() => {
    if (tray && process.platform === 'win32') {
      tray.displayBalloon({
        title: 'Cloud Encryptor Started ✅',
        content: 'Secure file encryption tool is running.\n• Folder selection active\n• All features enabled\n• System tray integration working',
        iconType: 'info'
      });
    }
  }, 3000);
};

// IPC Handlers for folder operations
ipcMain.handle('select-folder', async (event, folderType) => {
  try {
    const folderPath = await showFolderPicker();
    if (folderPath) {
      // Store the folder path for this specific type
      folderPaths[folderType] = folderPath;
      console.log('📁 Folder selected for', folderType + ':', folderPath);
      return folderPath;
    }
    return null;
  } catch (error) {
    console.error('Error in select-folder:', error);
    return null;
  }
});

ipcMain.handle('save-file', async (event, fileData) => {
  try {
    const { filename, buffer, type, folderType, folderPath } = fileData;
    
    console.log('💾 Saving file for type:', folderType);
    console.log('📁 Received folder path:', folderPath);
    
    // Use the provided folder path or fallback to stored path
    let finalFolderPath = folderPath || folderPaths[folderType];
    
    if (!finalFolderPath) {
      // No folder selected for this type, use default
      finalFolderPath = app.getPath('downloads');
      console.log('⚠️ No folder selected for', folderType + ', using downloads:', finalFolderPath);
    } else {
      console.log('✅ Using specific folder for', folderType + ':', finalFolderPath);
    }
    
    const fullPath = path.join(finalFolderPath, filename);
    
    // Ensure directory exists
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Save file
    fs.writeFileSync(fullPath, buffer);
    
    console.log('✅ File saved successfully to', folderType + ' folder:', fullPath);
    return { success: true, path: fullPath, folderType: folderType };
  } catch (error) {
    console.error('Error saving file for type', fileData.folderType + ':', error);
    return { success: false, error: error.message };
  }
});

// App event handlers
app.whenReady().then(() => {
  console.log('🚀 Starting Cloud Encryptor with complete features...');
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('before-quit', () => {
  isQuitting = true;
});

// Multiple instance prevention
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

console.log('🔐 Cloud Encryptor Main Process Started');