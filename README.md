
# 🔐 Cloud Encryptor v2.0.0

<div align="center">

![Latest Release](https://img.shields.io/github/v/release/snv7737/CloudEncryptor)
![Downloads](https://img.shields.io/github/downloads/snv7737/CloudEncryptor/total)
![Platform](https://img.shields.io/badge/Platform-Windows%20|%20macOS%20|%20Linux-blue)

**Professional file encryption with military-grade security**

[![Download Now](https://img.shields.io/badge/Download-Latest%20Release-green)](https://github.com/snv7737/CloudEncryptor/releases/latest)

</div>

## 📥 Download

### Latest Version: v2.0.0

[**Download Installer**](https://github.com/snv7737/CloudEncryptor/releases/download/v2.0.0/Cloud.Encryptor.Setup.2.0.0.exe) • 
[**Download Portable**](https://github.com/snv7737/CloudEncryptor/releases/download/v2.0.0/Cloud_Encryptor_Portable_2.0.0.exe)

Or visit the [Releases Page](https://github.com/snv7737/CloudEncryptor/releases) for all versions.

---

# 🔐 Cloud Encryptor v2.0.0

<div align="center">

![Version](https://img.shields.io/badge/Version-2.0.0-green)
![Electron](https://img.shields.io/badge/Built%20with-Electron-blue)
![Platform](https://img.shields.io/badge/Platform-Windows%20|%20macOS%20|%20Linux-lightgrey)
![License](https://img.shields.io/badge/License-MIT-yellow)

**A professional-grade file encryption tool with military-grade AES-256-GCM encryption**

*Security you can trust, simplicity you'll love*

</div>

## 📋 Table of Contents
- [✨ Features](#-features)
- [🚀 Quick Start](#-quick-start)
- [📖 User Guide](#-user-guide)
- [🛡️ Security](#️-security)
- [🐛 Troubleshooting](#-troubleshooting)
- [👨‍💻 Developer](#-developer)
- [📄 License](#-license)

## ✨ Features

### 🔒 Core Encryption
- **Military-Grade AES-256-GCM** encryption algorithm
- **PBKDF2 Key Derivation** with 100k to 1M iterations
- **Zero-Knowledge Architecture** - All processing happens locally
- **No Data Transmission** - Your files never leave your device

### 📝 Secure Notes
- **Encrypted note storage** with separate passphrases
- **Auto-expire functionality** (1 day to never)
- **Export/Import capabilities** for backup and restore
- **Secure preview** with passphrase verification

### 🎯 Advanced Features
- **Separate folder selection** for Encrypt/Decrypt/Notes
- **System tray integration** for quick access
- **Drag & drop support** for easy file selection
- **Multi-language support** (English, Bengali, Arabic)
- **Progress tracking** with real-time status

### ⌨️ User Experience
- **Keyboard shortcuts** (Ctrl+E, Ctrl+D, Ctrl+N, F1, F11)
- **Password strength indicator**
- **Matrix background** for security aesthetics
- **Responsive design** that works on all screen sizes

## 🚀 Quick Start

### 📥 Download & Install

#### Option 1: Installer Version (Recommended)
Download and run the main installer:
- **File**: `Cloud Encryptor Setup 2.0.0.exe`
- **Size**: ~150MB
- **Requirements**: Windows 10/11

#### Option 2: Portable Version
Download and run directly (no installation required):
- **File**: `Cloud_Encryptor_Portable_2.0.0.exe`
- **Size**: ~150MB
- **Requirements**: Windows 10/11

### 🛠️ For Developers

```bash
# Clone the repository
git clone https://github.com/snv7737/CloudEncryptor.git

# Navigate to project directory
cd CloudEncryptor

# Install dependencies
npm install

# Run in development mode
npm start

# Build for production
npm run build-windows
```

### Available Build Commands
| Command | Description |
|---------|-------------|
| `npm start` | Run development version |
| `npm run build-windows` | Build Windows versions |
| `npm run build-portable` | Build portable version only |
| `npm run build-installer` | Build installer version only |
| `npm run clean` | Clean installation |

## 📖 User Guide

### 🔒 How to Encrypt Files

1. **Launch** Cloud Encryptor
2. **Navigate** to "Encrypt Files" section (or press `Ctrl+E`)
3. **Select Files**:
   - Click "Choose Folder" or drag & drop files
   - Multiple files supported
4. **Set Encryption Parameters**:
   - Enter strong passphrase (12+ characters recommended)
   - Choose PBKDF2 iterations:
     - 100k (Fast)
     - 250k (Recommended)
     - 500k (Secure)
     - 1M (Maximum)
5. **Choose Save Location**:
   - Select folder for encrypted files
   - Or use auto-download to Downloads folder
6. **Click** "Encrypt & Save" button
7. **Wait** for progress to complete
8. **Encrypted files** will be saved with `.enc` extension

### 🔓 How to Decrypt Files

1. **Navigate** to "Decrypt Files" section (or press `Ctrl+D`)
2. **Select Encrypted Files**:
   - Only `.enc` files are supported
   - Multiple files supported
3. **Enter Passphrase**:
   - Use exact same passphrase from encryption
   - Case-sensitive
4. **Set Iterations**:
   - Use same iteration count as encryption
5. **Choose Save Location**:
   - Select folder for decrypted files
6. **Click** "Decrypt & Save" button
7. **Wait** for progress to complete
8. **Original files** will be restored

### 📝 Secure Notes Management

#### Creating Secure Notes
1. **Navigate** to "Secure Notes" section (or press `Ctrl+N`)
2. **Write** your confidential note
3. **Set Note Passphrase** (different from file encryption)
4. **Choose Auto-Expire**:
   - 1 day
   - 7 days
   - 30 days (default)
   - 90 days
   - Never
5. **Select Save Location** for note files
6. **Click** "Save Note" button

#### Managing Notes
- **Preview Notes**: View decrypted notes (requires passphrase)
- **Export Notes**: Backup all notes to JSON file
- **Import Notes**: Restore notes from backup
- **Clear All**: Delete all saved notes

### 🖥️ System Tray Features

Cloud Encryptor runs in system tray for quick access:

- **Show/Hide**: Click tray icon or double-click
- **Quick Encrypt**: Right-click → "Quick Encrypt"
- **Quick Decrypt**: Right-click → "Quick Decrypt" 
- **New Note**: Right-click → "New Secure Note"
- **User Guide**: Right-click → "User Guide"
- **Quit**: Right-click → "Quit Cloud Encryptor"

### ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + E` | Quick Encrypt Files |
| `Ctrl + D` | Quick Decrypt Files |
| `Ctrl + N` | New Secure Note |
| `F1` | User Guide |
| `F11` | Toggle Fullscreen |
| `Ctrl + Q` | Exit Application |
| `Ctrl + R` | Reload Application |

## 🛡️ Security

### Encryption Standards

| Feature | Specification |
|---------|---------------|
| Algorithm | AES-256-GCM |
| Key Size | 256 bits |
| Key Derivation | PBKDF2 with SHA-256 |
| Iterations | 100,000 to 1,000,000 |
| Salt Size | 16 bytes (128 bits) |
| IV Size | 12 bytes (96 bits) |
| Authentication | GCM mode built-in |

### Privacy Guarantees

- ✅ **Zero-Knowledge**: We never see your data or passphrases
- ✅ **Local-Only**: All encryption/decryption happens on your device
- ✅ **No Telemetry**: No data collection, tracking, or analytics
- ✅ **Open Source**: Transparent code for security verification
- ✅ **No Internet Required**: Works completely offline

### Best Practices

1. **Use Strong Passphrases**:
   - Minimum 12 characters
   - Mix of uppercase, lowercase, numbers, symbols
   - Avoid dictionary words
   - Use unique passphrases for different files

2. **Choose Appropriate Iterations**:
   - **100k**: Fast but less secure (for quick operations)
   - **250k**: Recommended balance (default)
   - **500k**: More secure (for sensitive data)
   - **1M**: Maximum security (for highly sensitive data)

## 🌐 Multi-Language Support

Cloud Encryptor supports multiple languages to cater to global users:

### 🇺🇸 English (Default)
Complete interface in English with professional terminology.

### 🇧🇩 বাংলা (Bengali)
Full Bengali translation for native speakers.

### 🇸🇦 العربية (Arabic)
Complete Arabic interface with RTL support.

### Language Switching
1. Go to top-right corner of application
2. Click language selector dropdown
3. Choose your preferred language
4. Interface updates instantly

## 🐛 Troubleshooting

### Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Tray icon not showing | Icon path issues or permissions | Restart application, check assets folder |
| Folder selection not working | File system permissions | Run as Administrator, check folder permissions |
| Decryption fails | Wrong passphrase or iterations | Verify exact passphrase and iteration count |
| "Invalid file format" error | File not encrypted by Cloud Encryptor | Use only .enc files from Cloud Encryptor |
| Performance issues with large files | System resource limitations | Close other applications, use lower iterations |
| Application won't start | Missing dependencies or corruption | Reinstall, run npm install for development |

### Error Messages

**"Error saving to folder: DOMException"**
- **Cause**: Folder permissions or browser security
- **Solution**: Files will auto-download to Downloads folder

**"Failed to decrypt - Wrong passphrase?"**
- **Cause**: Incorrect passphrase or different iterations
- **Solution**: Verify exact passphrase and iteration count

**"Tray icon creation failed"**
- **Cause**: System tray limitations
- **Solution**: Application will work without tray, restart may help

### Performance Tips

1. **For Large Files**:
   - Use lower iterations (100k-250k)
   - Close other applications
   - Ensure sufficient RAM

2. **For Better Security**:
   - Use higher iterations (500k-1M)
   - Use stronger passphrases
   - Encrypt in smaller batches

## 👨‍💻 Developer

### Contact Information
- **Developer**: @ALHASSAN7737 | @SNV7737
- **Email**: snv7737@github.com
- **GitHub**: [@snv7737](https://github.com/snv7737)
- **Discord**: [@ALHASSAN7737 | @SNV7737](https://discord.gg/fjfNCsf)

### Project Information
- **Repository**: https://github.com/snv7737/CloudEncryptor
- **Releases**: https://github.com/snv7737/CloudEncryptor/releases
- **Issues**: https://github.com/snv7737/CloudEncryptor/issues
- **Documentation**: This README and in-app guide (F1)

### Development Setup

#### Prerequisites
- Node.js 16.0.0 or higher
- npm or yarn package manager
- Git for version control

#### Development Commands
```bash
# Install dependencies
npm install

# Development mode with hot reload
npm run dev

# Build for production
npm run build-windows

# Create portable version
npm run build-portable

# Create installer version
npm run build-installer

# Clean installation
npm run clean
```

### Contributing
We welcome contributions from the community:

1. **Report Bugs**: Use GitHub Issues with detailed descriptions
2. **Feature Requests**: Suggest new features with use cases
3. **Code Contributions**: Fork repository and submit pull requests
4. **Documentation**: Improve documentation and translations

### Support
For support and questions:
1. Check the in-app User Guide (F1)
2. Review this documentation
3. Search existing GitHub Issues
4. Contact developer via GitHub or Discord

## 📄 License

This project is licensed under the **MIT License**.
-See the [LICENSE](LICENSE) file for details.

### License Summary
- ✅ **Free to use** for personal and commercial projects
- ✅ **Modification and distribution** allowed
- ✅ **Private use** allowed
- ✅ **Commercial use** allowed
- ⚠️ **Attribution** required
- ⚠️ **Include license** in copies

### Full License Text
```
MIT License

Copyright (c) 2025 ⌞ΛL HΛSSΛΠ⌝ | ⌞SΠV7737™⌝

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 💎 Acknowledgments

- **Electron Team** for the amazing framework
- **Web Crypto API** for robust encryption capabilities
- **Open Source Community** for continuous inspiration
- **Beta Testers** for valuable feedback and testing
- **Users** for trusting us with your security needs

---

## 💲 Donation & Support

If you find this tool useful, consider supporting development:

**Bitcoin (BTC)**: `bc1q0snw9tpjyw5zqel28xjr903te8kgqj4nlz4a5y`  
**USDT (BEP20)**: `0xaE2710f6243E24e069abfb07BecD85A529620ba8`

Your support helps maintain and improve this tool!

---

<div align="center">

## ⭐ Support the Project

If you find Cloud Encryptor useful, please consider giving it a star on GitHub!

**"Empowering your digital privacy, one encryption at a time"** 🔐

<br />

**📞 Stay Connected**<br />
[GitHub](https://github.com/snv7737) • [Discord](https://discord.gg/fjfNCsf) • [Email](mailto:snv7737@github.com)

<br />

*Cloud Encryptor v2.0.0 | Made with 🔐 by ⌞ΛL HΛSSΛΠ⌝ | ⌞SΠV7737™⌝*

</div>
