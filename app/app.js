const scanButton = document.querySelector('#scanButton');
const toast = document.querySelector('#toast');
const lastCheck = document.querySelector('#lastCheck');
const modeLabel = document.querySelector('#modeLabel');
const formatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });

// GitHub Pages cannot read the visitor's computer. This sample keeps the hosted
// dashboard useful; the local Python server replaces it with real readings.
const demoSystem = {
  hostname: 'ubuntu-workstation',
  user: 'Jordan',
  os: 'Ubuntu 26.04.1 LTS',
  kernel: '6.14.0-generic',
  uptime: '12d 4h 32m',
  cpu: 24,
  cpu_cores: 8,
  memory_used: 5.8 * 1024 ** 3,
  memory_total: 16 * 1024 ** 3,
  disk_used: 342 * 1024 ** 3,
  disk_total: 512 * 1024 ** 3,
  temperature: 48,
  ip: '192.168.1.8',
  gateway: '192.168.1.1',
  interface: 'Wi-Fi · wlp0s20f3',
};
let demoMode = false;

function gib(bytes) {
  return bytes / (1024 ** 3);
}

function renderSystem(system) {
  document.querySelector('#hostname').textContent = system.hostname;
  document.querySelector('#currentUser').textContent = system.user;
  document.querySelector('#osName').textContent = system.os;
  document.querySelector('#kernel').textContent = `Linux ${system.kernel}`;
  document.querySelector('#uptime').textContent = `Uptime ${system.uptime}`;
  document.querySelector('#cpuValue').textContent = system.cpu ?? '—';
  document.querySelector('#cpuBar').style.width = `${system.cpu ?? 0}%`;
  document.querySelector('#cpuCores').textContent = `${system.cpu_cores} cores`;

  const memoryUsed = gib(system.memory_used);
  const memoryTotal = gib(system.memory_total);
  const memoryPercent = system.memory_total ? Math.round(100 * system.memory_used / system.memory_total) : 0;
  document.querySelector('#memoryValue').textContent = formatter.format(memoryUsed);
  document.querySelector('#memoryTotal').textContent = `/ ${formatter.format(memoryTotal)} GB`;
  document.querySelector('#memoryBar').style.width = `${memoryPercent}%`;
  document.querySelector('#memoryUsedLabel').textContent = `${memoryPercent}% used`;
  document.querySelector('#memoryFreeLabel').textContent = `${formatter.format(gib(system.memory_total - system.memory_used))} GB free`;

  const diskPercent = system.disk_total ? Math.round(100 * system.disk_used / system.disk_total) : 0;
  document.querySelector('#diskUsed').textContent = Math.round(gib(system.disk_used));
  document.querySelector('#diskTotal').textContent = `/ ${Math.round(gib(system.disk_total))} GB`;
  document.querySelector('#diskBar').style.width = `${diskPercent}%`;
  document.querySelector('#diskUsedLabel').textContent = `${diskPercent}% used`;
  document.querySelector('#diskFreeLabel').textContent = `${Math.round(gib(system.disk_total - system.disk_used))} GB free`;

  document.querySelector('#temperatureValue').textContent = system.temperature ?? '—';
  document.querySelector('#temperatureMarker').style.left = `${Math.min(system.temperature ?? 42, 100)}%`;
  document.querySelector('#localIp').textContent = system.ip;
  document.querySelector('#networkInterface').textContent = system.interface;
  document.querySelector('#gateway').textContent = system.gateway;
}

async function refreshSystem() {
  try {
    const response = await fetch('/api/health', { cache: 'no-store' });
    if (!response.ok) throw new Error('Local system server is unavailable');
    renderSystem(await response.json());
    demoMode = false;
  } catch {
    renderSystem(demoSystem);
    demoMode = true;
  }
  modeLabel.innerHTML = demoMode
    ? '<i></i> DEMO DATA'
    : '<i></i> SYSTEM ONLINE';
  modeLabel.classList.toggle('demo-mode', demoMode);
  lastCheck.textContent = 'Just now';
}

function showToast(message, isError = false) {
  toast.textContent = message;
  toast.classList.toggle('error', isError);
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 3200);
}

scanButton.addEventListener('click', async () => {
  scanButton.disabled = true;
  scanButton.innerHTML = '<span>↻</span> Scanning…';
  await refreshSystem();
  showToast(demoMode
    ? 'Demo scan complete · sample data shown'
    : 'Scan complete · live system information updated');
  scanButton.disabled = false;
  scanButton.innerHTML = '<span>↻</span> Run system scan';
});

refreshSystem();
window.setInterval(refreshSystem, 15000);
