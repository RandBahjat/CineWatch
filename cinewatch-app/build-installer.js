const builder = require('electron-builder');
const path = require('path');
const fs = require('fs');

console.log('[Build] Starting CineWatch Windows NSIS Installer build...');

const outputDir = 'C:\\CinewatchBuild';

builder.build({
    targets: builder.Platform.WINDOWS.createTarget('nsis'),
    config: {
        appId: 'com.cinewatch.app',
        productName: 'CineWatch',
        icon: 'icon-512.png',
        directories: {
            output: outputDir
        },
        artifactName: 'CineWatch-v${version}-Setup.${ext}',
        nsis: {
            oneClick: false,
            allowToChangeInstallationDirectory: true,
            createDesktopShortcut: true,
            createStartMenuShortcut: true,
            shortcutName: 'CineWatch',
            perMachine: false,
            installerIcon: 'build/icon.ico',
            uninstallerIcon: 'build/icon.ico',
            runAfterFinish: true
        },
        win: {
            target: [
                {
                    target: 'nsis',
                    arch: ['x64']
                }
            ],
            icon: 'build/icon.ico'
        }
    }
}).then((result) => {
    console.log('[Build] SUCCESS! Artifacts created:');
    console.log(result);
    
    const rootDir = path.join(__dirname, '..');
    const files = fs.readdirSync(outputDir);
    const exeFile = files.find(f => f.endsWith('.exe') && f.includes('Setup'));
    
    if (exeFile) {
        const srcPath = path.join(outputDir, exeFile);
        const destSetup = path.join(rootDir, 'CineWatch-Setup.exe');
        const destVersioned = path.join(rootDir, 'CineWatch-v1.2.6-Setup.exe');
        
        fs.copyFileSync(srcPath, destSetup);
        fs.copyFileSync(srcPath, destVersioned);
        
        console.log(`[Build] Copied ${exeFile} -> ${destSetup} (${fs.statSync(destSetup).size} bytes)`);
        console.log(`[Build] Copied ${exeFile} -> ${destVersioned} (${fs.statSync(destVersioned).size} bytes)`);
    } else {
        console.error('[Build] No setup exe found in build directory!');
    }
}).catch((error) => {
    console.error('[Build] Build failed with error:', error);
    process.exit(1);
});
