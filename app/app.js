const servers = [
  { id:'srv-prod-01', name:'Server 1', role:'Production · Database', model:'ProLiant DL380 Gen11', status:'healthy', health:'Healthy', power:'On', rack:'M-04 · U32', serial:'CZJ41308Q2', asset:'DC-PRD-001', ip:'10.24.4.21', ilo:'10.24.0.21', cpu:'2 × Intel Xeon Gold 5418Y', cores:48, memory:256, storage:7.68, temperature:36, cpuUse:32, memoryUse:64, storageUse:57, bios:'U54 v2.10 (08/14/2026)', iloVersion:'iLO 6 v1.55', vms:[['db-primary-01','Running','8 vCPU','64 GB'],['db-replica-01','Running','8 vCPU','48 GB'],['metrics-agent-01','Running','2 vCPU','8 GB']], logs:[['09:41:08','Health scan completed','All components are operating normally','success'],['09:20:16','Virtual machine started','db-replica-01 · Hypervisor event','info'],['08:05:42','Firmware inventory updated','iLO 6 · version 1.55','info'],['Yesterday','Scheduled backup completed','Database snapshot · 186 GB','success']] },
  { id:'srv-prod-02', name:'Server 2', role:'Production · Application', model:'ProLiant DL360 Gen11', status:'warning', health:'Warning', power:'On', rack:'M-04 · U30', serial:'CZJ41309R7', asset:'DC-PRD-002', ip:'10.24.4.22', ilo:'10.24.0.22', cpu:'2 × Intel Xeon Gold 5416S', cores:32, memory:192, storage:3.84, temperature:67, cpuUse:71, memoryUse:83, storageUse:72, bios:'U54 v2.08 (06/02/2026)', iloVersion:'iLO 6 v1.53', vms:[['app-web-02','Running','8 vCPU','32 GB'],['app-api-02','Running','8 vCPU','48 GB'],['app-worker-02','Running','4 vCPU','24 GB']], logs:[['09:38:51','Memory threshold reached','Memory utilization above 80%','warning'],['09:10:04','Health scan completed','1 warning found','warning'],['Yesterday','Virtual machine migrated','app-worker-02 · Hypervisor event','info'],['Yesterday','Scheduled backup completed','Application snapshot · 94 GB','success']] },
  { id:'srv-prod-03', name:'Server 3', role:'Production · Storage', model:'ProLiant DL380 Gen11', status:'healthy', health:'Healthy', power:'On', rack:'M-04 · U28', serial:'CZJ41310P4', asset:'DC-PRD-003', ip:'10.24.4.23', ilo:'10.24.0.23', cpu:'2 × Intel Xeon Gold 5418Y', cores:48, memory:512, storage:30.72, temperature:39, cpuUse:28, memoryUse:52, storageUse:66, bios:'U54 v2.10 (08/14/2026)', iloVersion:'iLO 6 v1.55', vms:[['storage-gateway-03','Running','12 vCPU','96 GB'],['backup-index-03','Running','8 vCPU','64 GB']], logs:[['09:31:12','Health scan completed','All components are operating normally','success'],['08:45:03','Disk pool optimized','Storage pool 1 · completed','info'],['Yesterday','Firmware inventory updated','iLO 6 · version 1.55','info'],['Yesterday','Scheduled backup completed','Storage catalog · 22 GB','success']] },
  { id:'srv-prod-04', name:'Server 4', role:'Production · Compute', model:'ProLiant DL360 Gen11', status:'critical', health:'Critical', power:'On', rack:'M-04 · U26', serial:'CZJ41311W8', asset:'DC-PRD-004', ip:'10.24.4.24', ilo:'10.24.0.24', cpu:'2 × Intel Xeon Gold 5416S', cores:32, memory:128, storage:3.84, temperature:81, cpuUse:94, memoryUse:91, storageUse:61, bios:'U54 v2.08 (06/02/2026)', iloVersion:'iLO 6 v1.53', vms:[['compute-node-04','Running','16 vCPU','64 GB'],['batch-runner-04','Paused','8 vCPU','32 GB']], logs:[['09:39:20','CPU temperature critical','Thermal zone 1 · 81°C','critical'],['09:36:14','Fan speed increased','Fan group 2 · 92%','warning'],['09:30:00','Health scan completed','1 critical issue found','critical'],['08:00:02','Virtual machine paused','batch-runner-04 · operator action','info']] },
  { id:'srv-prod-05', name:'Server 5', role:'Staging · Application', model:'ProLiant DL360 Gen10', status:'healthy', health:'Healthy', power:'On', rack:'M-04 · U24', serial:'CZJ41312K6', asset:'DC-STG-001', ip:'10.24.4.25', ilo:'10.24.0.25', cpu:'2 × Intel Xeon Silver 4410Y', cores:24, memory:128, storage:1.92, temperature:34, cpuUse:18, memoryUse:42, storageUse:35, bios:'U32 v3.20 (07/11/2026)', iloVersion:'iLO 5 v3.08', vms:[['stage-web-01','Running','4 vCPU','16 GB'],['stage-api-01','Running','4 vCPU','24 GB']], logs:[['09:35:00','Health scan completed','All components are operating normally','success'],['08:50:25','Patch status checked','No updates required','info'],['Yesterday','Virtual machine started','stage-api-01 · Hypervisor event','info'],['Yesterday','Scheduled backup completed','Staging snapshot · 42 GB','success']] },
  { id:'srv-prod-06', name:'Server 6', role:'Development · Build', model:'ProLiant DL380 Gen10', status:'offline', health:'Offline', power:'Off', rack:'M-04 · U22', serial:'CZJ41313N1', asset:'DC-DEV-001', ip:'10.24.4.26', ilo:'10.24.0.26', cpu:'2 × Intel Xeon Silver 4214R', cores:24, memory:96, storage:1.92, temperature:null, cpuUse:0, memoryUse:0, storageUse:48, bios:'U32 v3.20 (07/11/2026)', iloVersion:'iLO 5 v3.08', vms:[], logs:[['08:17:02','Power state changed','Server powered off · scheduled maintenance','info'],['08:00:00','Maintenance window started','Change request CHG-2041','info'],['Yesterday','Health scan completed','System was online','success'],['Yesterday','Virtual machine stopped','build-runner-06 · maintenance','info']] },
];

const serverList = document.querySelector('#serverList');
const tabContent = document.querySelector('#tabContent');
const toast = document.querySelector('#toast');
let selectedServer = servers[0];
let activeTab = 'general';
let locatorOn = false;
let toastTimeout;

const icon = (name) => ({healthy:'✓',warning:'!',critical:'×',offline:'−'}[name] || '•');
function renderServerTree() {
  serverList.innerHTML = servers.map(server => `<button class="server-node ${server.id===selectedServer.id?'active':''}" data-server="${server.id}"><span class="tree-caret">›</span><span>${server.name}</span><i class="status-dot ${server.status}" title="${server.health}">${icon(server.status)}</i></button>`).join('');
}
function statusPill(server) { return `<span class="status-pill ${server.status}"><i></i>${server.health}</span>`; }
function faultSummary() {
  const counts = {critical:servers.filter(s=>s.status==='critical').length,warning:servers.filter(s=>s.status==='warning').length,info:3,healthy:servers.filter(s=>s.status==='healthy').length};
  return `<section class="fault-summary"><div class="section-label">FLEET FAULT SUMMARY <span>· 6 SERVERS</span></div><div class="fault-grid"><div class="fault-item"><span class="fault-icon critical">×</span><strong>${counts.critical}</strong><small>Critical</small></div><div class="fault-item"><span class="fault-icon warning">!</span><strong>${counts.warning}</strong><small>Warning</small></div><div class="fault-item"><span class="fault-icon info">i</span><strong>${counts.info}</strong><small>Informational</small></div><div class="fault-item"><span class="fault-icon healthy">✓</span><strong>${counts.healthy}</strong><small>Healthy</small></div></div></section>`;
}
function propertyRows(s) {
  return [['Product name',s.model],['Vendor','Hewlett Packard Enterprise'],['Serial number',s.serial],['Asset tag',s.asset],['Management IP',s.ilo],['Location',s.rack],['Processors',`${s.cores} physical cores`],['Memory',`${s.memory} GB DDR5`]];
}
function propertiesPanel(s) {
  return `<section class="panel properties-panel"><div class="panel-heading"><div><h2>Server properties</h2><p>Hardware identity and location</p></div><button class="kebab" aria-label="More options">···</button></div><div class="properties-list">${propertyRows(s).map(([key,value])=>`<div class="property-row"><span>${key}</span><strong>${value}</strong></div>`).join('')}</div><button class="panel-link" data-action="inventory">View full inventory <span>→</span></button></section>`;
}
function rackVisual(s) {
 return `<div class="rack-visual" aria-label="Server rack position"><div class="rack-top"><span>RACK M-04</span><span>42U</span></div><div class="rack-units">${servers.map((node,i)=>`<div class="rack-unit ${node.id===s.id?'rack-selected':''} ${node.status}" title="${node.name} · ${node.health}"><span class="rack-slot">${32-i*2}U</span><span class="rack-grille"></span><span class="rack-led ${node.status}"></span></div>`).join('')}<div class="rack-empty"><span>24U</span><span>Available rack space</span></div></div><div class="rack-base"><span>DATACENTER ROW C</span><span>42U ENCLOSURE</span></div></div>`;
}
function utilizationCard(label,value,unit,tone) { return `<div class="util-card"><div class="util-title"><span>${label}</span><b class="tone-${tone}">${value}${unit}</b></div><div class="util-meter"><i class="tone-bg-${tone}" style="width:${value}%"></i></div><small>${value<65?'Within normal range':value<85?'Elevated utilization':'Attention required'}</small></div>`; }
function generalTab(s) {
 const powerClass=s.power==='On'?'power-on':'power-off';
 return `${faultSummary()}<div class="general-grid"><div class="left-column"><section class="panel overview-panel"><div class="panel-heading"><div><h2>Server status</h2><p>Current operating state and available actions</p></div><span class="updated-label"><i></i> Updated just now</span></div><div class="status-details"><span class="large-status-icon ${s.status}">${icon(s.status)}</span><div class="status-copy"><div class="status-line">${statusPill(s)}<span class="power-state ${powerClass}"><i></i> Power ${s.power}</span></div><p>${s.role} <span>·</span> ${s.rack}</p></div></div><div class="action-area"><div class="section-label">ACTIONS</div><button class="action-link" data-action="console"><span>▣</span> Launch remote console <b>↗</b></button><button class="action-link" data-action="locator"><span>◎</span> ${locatorOn?'Turn off':'Turn on'} locator LED <i class="locator-state ${locatorOn?'on':''}"></i></button><div class="action-note">Actions are simulated in this demo environment.</div></div></section><section class="panel utilization-panel"><div class="panel-heading"><div><h2>Resource utilization</h2><p>Latest hardware readings · last 15 minutes</p></div><span class="range-chip">15 MIN <span>⌄</span></span></div><div class="util-grid">${utilizationCard('CPU',s.cpuUse,'%','purple')}${utilizationCard('MEMORY',s.memoryUse,'%','blue')}${utilizationCard('STORAGE',s.storageUse,'%','teal')}</div></section><section class="panel vm-preview"><div class="panel-heading"><div><h2>Virtual machines <span class="heading-count">${s.vms.length}</span></h2><p>Hosted workloads on this server</p></div><button class="panel-link" data-action="vms">View all <span>→</span></button></div>${s.vms.length?vmTable(s,true):'<div class="empty-state">No virtual machines are hosted on this server.</div>'}</section></div><div class="right-column">${propertiesPanel(s)}<section class="panel physical-panel"><div class="panel-heading"><div><h2>Physical location</h2><p>Rack position and chassis view</p></div><button class="small-link" data-action="locator">Locate server</button></div>${rackVisual(s)}<div class="physical-caption"><span><i class="legend-dot ${s.status}"></i>${s.name} selected</span><span>${s.rack}</span></div></section><section class="panel firmware-panel"><div class="panel-heading"><div><h2>Firmware</h2><p>Installed versions</p></div><span class="firmware-status">UP TO DATE</span></div><div class="firmware-row"><span>System ROM</span><strong>${s.bios}</strong></div><div class="firmware-row"><span>Management controller</span><strong>${s.iloVersion}</strong></div></section></div></div>`;
}
function vmTable(s, compact=false) {
 return `<div class="table-wrap"><table><thead><tr><th>NAME</th><th>STATUS</th><th>VCPU</th><th>MEMORY</th></tr></thead><tbody>${s.vms.map(vm=>`<tr><td><span class="vm-glyph">▤</span><strong>${vm[0]}</strong></td><td><span class="vm-status ${vm[1].toLowerCase()}"><i></i>${vm[1]}</span></td><td>${vm[2]}</td><td>${vm[3]}</td></tr>`).join('')}</tbody></table></div>`;
}
function inventoryTab(s) {
 const components=[['Processors','CPU',s.cpu,`${s.cores} cores · 2 sockets`],['Memory','RAM',`${s.memory} GB`,`${s.memory/16} × 16 GB DDR5 DIMMs`],['Storage','SSD',`${s.storage} TB`,`${s.storage>=7?8:4} × NVMe drives · RAID 10`],['Network adapters','NIC','2 × 25 GbE','Broadcom NetXtreme-E'],['System ROM','BIOS',s.bios,'UEFI · Secure Boot enabled'],['Management','iLO',s.iloVersion,`Dedicated port · ${s.ilo}`]];
 return `<div class="tab-intro"><div><span class="section-label">HARDWARE INVENTORY</span><h2>Installed components</h2><p>Hardware discovered on ${s.name} · ${s.serial}</p></div><button class="outline-button" data-action="refresh">↻ Sync inventory</button></div><div class="inventory-grid">${components.map(([name,glyph,value,meta])=>`<article class="panel component-card"><span class="component-icon">${glyph}</span><div class="component-copy"><span>${name}</span><strong>${value}</strong><small>${meta}</small></div><span class="component-check">✓</span></article>`).join('')}</div><section class="panel inventory-footer"><div class="panel-heading"><div><h2>Asset and warranty</h2><p>Procurement information</p></div></div><div class="asset-grid"><div><small>ASSET TAG</small><strong>${s.asset}</strong></div><div><small>SERIAL NUMBER</small><strong>${s.serial}</strong></div><div><small>WARRANTY</small><strong>Active · expires Aug 2029</strong></div><div><small>SUPPORT CONTRACT</small><strong>Foundation Care 24×7</strong></div></div></section>`;
}
function vmsTab(s) {
 return `<div class="tab-intro"><div><span class="section-label">WORKLOADS</span><h2>Virtual machines</h2><p>${s.vms.length} virtual machines hosted on ${s.name}</p></div><button class="outline-button" data-action="vm-info">＋ Create virtual machine</button></div><section class="panel table-panel">${s.vms.length?vmTable(s):'<div class="empty-state large">No virtual machines are currently assigned to this server.<br><span>Choose another server from the infrastructure tree.</span></div>'}<div class="table-foot"><span>Showing ${s.vms.length} workloads</span><span>Hypervisor · VMware ESXi 8.0 U3</span></div></section><div class="notice-box"><span>i</span><p>Virtual machine controls are shown for demonstration. This sample app is not connected to a hypervisor.</p></div>`;
}
function healthTab(s) {
 return `<div class="tab-intro"><div><span class="section-label">HARDWARE MONITORING</span><h2>Health and performance</h2><p>Component status and resource utilization</p></div><span class="health-refresh"><i></i> Updated just now</span></div><div class="health-summary-row"><div class="panel health-score"><span class="health-score-mark ${s.status}">${icon(s.status)}</span><div><small>OVERALL HEALTH</small><strong>${s.health}</strong><span>Based on ${s.status==='healthy'?12:13} component checks</span></div></div><div class="panel temp-card"><div><small>CPU TEMPERATURE</small><strong>${s.temperature===null?'—':s.temperature+'°C'}</strong><span>${s.temperature===null?'No reading while powered off':s.temperature<65?'Normal operating range':s.temperature<80?'Elevated temperature':'Critical temperature'}</span></div><span class="temp-glyph">♨</span></div></div><div class="health-util-grid">${utilizationCard('CPU',s.cpuUse,'%','purple')}${utilizationCard('MEMORY',s.memoryUse,'%','blue')}${utilizationCard('STORAGE',s.storageUse,'%','teal')}</div><section class="panel components-panel"><div class="panel-heading"><div><h2>Component status</h2><p>Current hardware health checks</p></div><span class="heading-count">6 checks</span></div><div class="component-status-list">${[['Processors','Operating normally','healthy'],['Memory','Operating normally','healthy'],['Storage controller','Operating normally','healthy'],['Power supplies','Redundant · 2 of 2','healthy'],['Cooling fans',s.temperature>75?'High speed · thermal event':'Operating normally',s.temperature>75?'warning':'healthy'],['System temperature',s.temperature===null?'Not available':`${s.temperature}°C · ${s.temperature>75?'above threshold':'within threshold'}`,s.temperature>75?'critical':'healthy']].map(([name,desc,status])=>`<div class="component-status-row"><span class="mini-status ${status}">${icon(status)}</span><strong>${name}</strong><span>${desc}</span><em class="status-word ${status}">${status==='healthy'?'Normal':status==='critical'?'Critical':'Warning'}</em></div>`).join('')}</div></section>`;
}
function logsTab(s) {
 return `<div class="tab-intro"><div><span class="section-label">AUDIT TRAIL</span><h2>Event logs</h2><p>Recent events recorded for ${s.name}</p></div><button class="outline-button" data-action="export">⇩ Export logs</button></div><section class="panel logs-panel"><div class="log-filter"><span>All events <b>4</b></span><button data-action="filter">Severity <span>⌄</span></button><button data-action="filter">Last 24 hours <span>⌄</span></button></div><div class="log-list">${s.logs.map(([time,title,desc,level])=>`<div class="log-row"><span class="log-mark ${level}">${icon(level==='success'?'healthy':level==='info'?'info':level)}</span><div class="log-main"><strong>${title}</strong><small>${desc}</small></div><span class="log-level ${level}">${level.toUpperCase()}</span><time>${time}</time></div>`).join('')}</div><div class="table-foot"><span>Showing 4 most recent events</span><span>Log retention · 90 days</span></div></section><div class="notice-box"><span>i</span><p>Events shown here are sample records for this prototype.</p></div>`;
}
function render() {
 renderServerTree();
 document.querySelector('#breadcrumbServer').textContent=selectedServer.name;
 document.querySelector('#pageTitle').childNodes[0].textContent=selectedServer.name+' ';
 document.querySelector('#pageModel').textContent=selectedServer.model;
 document.querySelector('#vmTabCount').textContent=selectedServer.vms.length;
 const content={general:generalTab,inventory:inventoryTab,vms:vmsTab,health:healthTab,logs:logsTab};
 tabContent.innerHTML=content[activeTab](selectedServer);
 document.querySelectorAll('.tab').forEach(tab=>tab.classList.toggle('active',tab.dataset.tab===activeTab));
}
function notify(message) {
 toast.textContent=message;
 toast.classList.add('show');
 clearTimeout(toastTimeout);
 toastTimeout=setTimeout(()=>toast.classList.remove('show'),2600);
}
serverList.addEventListener('click',event=>{
 const button=event.target.closest('[data-server]');
 if(!button)return;
 selectedServer=servers.find(server=>server.id===button.dataset.server);
 locatorOn=false;
 render();
});
document.querySelector('.tabs').addEventListener('click',event=>{
 const tab=event.target.closest('[data-tab]');
 if(!tab)return;
 activeTab=tab.dataset.tab;
 render();
});
tabContent.addEventListener('click',event=>{
 const button=event.target.closest('[data-action]');
 if(!button)return;
 const action=button.dataset.action;
 if(action==='inventory'||action==='vms'){activeTab=action;render();return;}
 if(action==='console'){
 document.querySelector('#consoleServerName').textContent=selectedServer.name;
 document.querySelector('#consoleHost').textContent=selectedServer.id;
 document.querySelector('#consoleDialog').showModal();return;
 }
 if(action==='locator'){locatorOn=!locatorOn;render();notify(`Locator LED ${locatorOn?'turned on':'turned off'} for ${selectedServer.name} · demo`);return;}
 if(action==='refresh'){document.querySelector('#syncTime').textContent='Just now';notify('Inventory sync complete · demo data refreshed');return;}
 const messages={'vm-info':'Virtual machine creation is not connected in this demo.','export':'Log export is not available in this demo.','filter':'Filters are visual only in this demo.'};
 notify(messages[action]||'This control is part of the demo interface.');
});
document.querySelector('#refreshButton').addEventListener('click',()=>{
 document.querySelector('#syncTime').textContent='Just now';
 render();
 notify('Status refreshed · sample environment');
});
document.querySelector('#closeDialog').addEventListener('click',()=>document.querySelector('#consoleDialog').close());
document.querySelector('#doneDialog').addEventListener('click',()=>document.querySelector('#consoleDialog').close());
document.querySelector('#consoleDialog').addEventListener('click',event=>{
 if(event.target===event.currentTarget)event.currentTarget.close();
});
render();
