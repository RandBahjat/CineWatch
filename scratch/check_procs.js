const { execSync } = require('child_process');

try {
  const output = execSync('powershell "Get-WmiObject Win32_Process -Filter \\"name = \'node.exe\'\\" | Select-Object ProcessId, CommandLine | Format-List"', { encoding: 'utf8' });
  console.log(output);
} catch (e) {
  console.error(e);
}
