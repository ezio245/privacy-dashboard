// app.js

// ------------------------
// Authentication Redirect
// ------------------------
if (!localStorage.getItem('jwt')) {
  window.location.href = 'login.html';
}

// ------------------------
// Privacy-by-Design Dashboard App
// ------------------------
class PrivacyApp {
  constructor() {
    this.currentSection = 'dashboard';
    this.performanceChart = null;
    this.privacyUtilityChart = null;
    this.isDataSharing = false;
    this.packetsTransferred = 1247;
    this.encryptionKey = null;
    this.threatLevel = 0;
    this.notifications = [];
    this.consentHistory = [];
    this.smartContracts = [];
    this.complianceData = {
      gdpr: 98,
      ccpa: 95,
      hipaa: 92,
      pciDss: 94,
      sox: 89
    };
    this.metrics = {
      uptime: 99.9,
      privacyScore: 95.6,
      activeThreats: 0,
      dataProcessed: 2.4,
      systemLoad: 45,
      encryptionStrength: 98,
      complianceScore: 94
    };
    this.privacyTechniques = {
      'differential-privacy': {
        enabled: false,
        privacyLevel: 95,
        utilityLevel: 80,
        config: { epsilon: 0.1, budget: 1000 }
      },
      'homomorphic-encryption': {
        enabled: false,
        privacyLevel: 98,
        utilityLevel: 70,
        config: { scheme: 'ckks', keySize: 2048 }
      },
      'secure-mpc': {
        enabled: false,
        privacyLevel: 96,
        utilityLevel: 75,
        config: { parties: 3, protocol: 'bgw' }
      },
      'zero-knowledge': {
        enabled: false,
        privacyLevel: 99,
        utilityLevel: 85,
        config: { protocol: 'zk-snark', circuitSize: 1024 }
      }
    };
    this.init();
  }

  init() {
    this.setupNavigation();
    this.setupThemeToggle();
    this.setupTokenization();
    this.setupPrivacyTechniques();
    this.setupSmartContracts();
    this.setupConsentManagement();
    this.setupDataSharing();
    this.setupMonitoring();
    this.setupCompliance();
    this.setupModals();
    this.setupNotifications();
    this.startRealTimeUpdates();
    this.initializeCharts();
    this.loadUserPreferences();
  }

  // Navigation System
  setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = link.getAttribute('data-section');
        this.showSection(sectionId);
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      });
    });

    // Auto-show dashboard on load
    this.showSection('dashboard');
  }

  showSection(sectionId) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.remove('active'));
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.classList.add('active');
      this.currentSection = sectionId;
      
      // Initialize section-specific features
      switch(sectionId) {
        case 'monitoring':
          this.initPerformanceChart();
          break;
        case 'dashboard':
          this.updateDashboardMetrics();
          this.initPrivacyUtilityChart();
          break;
        case 'techniques':
          this.updatePrivacyTechniqueCards();
          break;
        case 'consent':
          this.updateConsentHistory();
          break;
      }
    }
  }

  // Theme Toggle System
  setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme') || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    document.documentElement.setAttribute('data-color-scheme', currentTheme);
    if (themeToggle) {
      themeToggle.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
      
      themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-color-scheme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-color-scheme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        this.addNotification(`Theme changed to ${newTheme} mode`, 'info');
      });
    }
  }

  // Advanced Data Tokenization
  setupTokenization() {
    const tokenizeBtn = document.getElementById('tokenizeBtn');
    const originalData = document.getElementById('originalData');
    const tokenizedData = document.getElementById('tokenizedData');
    const decryptBtn = document.getElementById('decryptBtn');
    const tokenMethodRadios = document.querySelectorAll('input[name="tokenMethod"]');

    if (tokenizeBtn) {
      tokenizeBtn.addEventListener('click', async () => {
        const data = originalData.value.trim();
        if (!data) {
          this.addNotification('Please enter data to tokenize', 'warning');
          return;
        }

        let tokenized;
        const selectedMethod = Array.from(tokenMethodRadios).find(radio => radio.checked)?.value || 'vault-based';
        
        this.animateTokenization();
        
        try {
          if (selectedMethod === 'format-preserving' || selectedMethod === 'vault-less') {
            tokenized = this.tokenizeData(data, selectedMethod);
          } else {
            tokenized = await this.tokenizeDataWithEncryption(data);
          }
          
          tokenizedData.value = tokenized;
          this.addNotification(`Data tokenized successfully using ${selectedMethod}`, 'success');
          
          // Update metrics
          this.metrics.dataProcessed += 0.001;
          this.updateDashboardMetrics();
          
        } catch (error) {
          this.addNotification('Tokenization failed: ' + error.message, 'error');
        }
      });
    }

    if (decryptBtn) {
      decryptBtn.addEventListener('click', async () => {
        const encrypted = tokenizedData.value;
        if (!encrypted) {
          this.addNotification('No tokenized data to decrypt', 'warning');
          return;
        }
        
        if (encrypted.startsWith('TOKEN_') || encrypted.includes('****')) {
          this.addNotification('This data was tokenized with a non-reversible method', 'warning');
          return;
        }
        
        try {
          const decrypted = await decryptData(this.encryptionKey, encrypted);
          this.showModal('Decrypted Data', `<pre>${decrypted}</pre>`, 'info');
          this.addNotification('Data decrypted successfully', 'success');
        } catch (err) {
          this.addNotification('Decryption failed: Wrong key or corrupted data', 'error');
        }
      });
    }
  }

  async tokenizeDataWithEncryption(data) {
    if (!this.encryptionKey) {
      this.encryptionKey = await generateKey();
    }
    return await encryptData(this.encryptionKey, data);
  }

  tokenizeData(data, method) {
    const lines = data.split('\n');
    const tokenized = lines.map(line => {
      if (line.includes('@')) {
        return method === 'format-preserving' ? 
          'user.****@****.com' : 
          `TOKEN_EMAIL_${this.generateToken(8)}`;
      } else if (line.includes('SSN:')) {
        return method === 'format-preserving' ? 
          'SSN: ***-**-****' : 
          `TOKEN_SSN_${this.generateToken(8)}`;
      } else if (line.match(/\d{4}-\d{4}-\d{4}-\d{4}/)) {
        return method === 'format-preserving' ? 
          '****-****-****-****' : 
          `TOKEN_CC_${this.generateToken(12)}`;
      } else if (line.match(/\d{3}-\d{2}-\d{4}/)) {
        return method === 'format-preserving' ? 
          '***-**-****' : 
          `TOKEN_SSN_${this.generateToken(8)}`;
      } else {
        return line;
      }
    });
    return tokenized.join('\n');
  }

  generateToken(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  animateTokenization() {
    const tokenizeBtn = document.getElementById('tokenizeBtn');
    if (tokenizeBtn) {
      const originalText = tokenizeBtn.textContent;
      tokenizeBtn.textContent = 'Tokenizing...';
      tokenizeBtn.disabled = true;
      
      setTimeout(() => {
        tokenizeBtn.textContent = originalText;
        tokenizeBtn.disabled = false;
      }, 1500);
    }
  }

  // Privacy Techniques
    setupPrivacyTechniques() {
        const configureButtons = document.querySelectorAll('.configure-btn');
        
        configureButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const techniqueCard = e.target.closest('.technique-card');
                const technique = techniqueCard.getAttribute('data-technique');
                this.showTechniqueModal(technique);
            });
        });
    }

    showTechniqueModal(technique) {
        const modal = document.getElementById('configModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalContent = document.getElementById('modalContent');
        
        const techniqueData = {
            'differential-privacy': {
                title: 'Configure Differential Privacy',
                content: `
                    <div class="form-group">
                        <label class="form-label">Epsilon (Privacy Budget):</label>
                        <input type="range" class="form-control" min="0.1" max="10" step="0.1" value="1.0" id="epsilonValue">
                        <span id="epsilonDisplay">1.0</span>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Noise Distribution:</label>
                        <select class="form-control">
                            <option value="laplace">Laplace</option>
                            <option value="gaussian">Gaussian</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Query Type:</label>
                        <select class="form-control">
                            <option value="count">Count</option>
                            <option value="sum">Sum</option>
                            <option value="mean">Mean</option>
                        </select>
                    </div>
                `
            },
            'homomorphic': {
                title: 'Configure Homomorphic Encryption',
                content: `
                    <div class="form-group">
                        <label class="form-label">Encryption Scheme:</label>
                        <select class="form-control">
                            <option value="bfv">BFV (Integer)</option>
                            <option value="ckks">CKKS (Floating Point)</option>
                            <option value="bgv">BGV (Integer)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Security Level:</label>
                        <select class="form-control">
                            <option value="128">128-bit</option>
                            <option value="192">192-bit</option>
                            <option value="256">256-bit</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Polynomial Modulus Degree:</label>
                        <select class="form-control">
                            <option value="4096">4096</option>
                            <option value="8192">8192</option>
                            <option value="16384">16384</option>
                        </select>
                    </div>
                `
            },
            'secure-mpc': {
                title: 'Configure Secure Multi-party Computation',
                content: `
                    <div class="form-group">
                        <label class="form-label">Number of Parties:</label>
                        <input type="number" class="form-control" min="2" max="10" value="3">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Security Model:</label>
                        <select class="form-control">
                            <option value="semi-honest">Semi-honest</option>
                            <option value="malicious">Malicious</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Protocol:</label>
                        <select class="form-control">
                            <option value="gmw">GMW</option>
                            <option value="bgw">BGW</option>
                            <option value="shamir">Shamir Secret Sharing</option>
                        </select>
                    </div>
                `
            },
            'zero-knowledge': {
                title: 'Configure Zero-Knowledge Proofs',
                content: `
                    <div class="form-group">
                        <label class="form-label">Proof System:</label>
                        <select class="form-control">
                            <option value="zk-snarks">zk-SNARKs</option>
                            <option value="zk-starks">zk-STARKs</option>
                            <option value="bulletproofs">Bulletproofs</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Circuit Complexity:</label>
                        <select class="form-control">
                            <option value="low">Low (< 1K gates)</option>
                            <option value="medium">Medium (1K-10K gates)</option>
                            <option value="high">High (> 10K gates)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Trusted Setup:</label>
                        <select class="form-control">
                            <option value="required">Required</option>
                            <option value="universal">Universal</option>
                            <option value="transparent">Transparent</option>
                        </select>
                    </div>
                `
            }
        };
        
        const config = techniqueData[technique];
        if (config) {
            modalTitle.textContent = config.title;
            modalContent.innerHTML = config.content;
            
            // Setup epsilon slider if it exists
            const epsilonValue = document.getElementById('epsilonValue');
            const epsilonDisplay = document.getElementById('epsilonDisplay');
            if (epsilonValue && epsilonDisplay) {
                epsilonValue.addEventListener('input', (e) => {
                    epsilonDisplay.textContent = e.target.value;
                });
            }
            
            modal.classList.add('show');
        }
    }

  // Smart Contract Management
  setupSmartContracts() {
    const deployBtn = document.getElementById('deployContract');
    if (deployBtn) {
      deployBtn.addEventListener('click', () => {
        const accessLevel = document.getElementById('accessLevel')?.value || 'restricted';
        const retentionPeriod = document.getElementById('retentionPeriod')?.value || '90';
        const dataTypes = Array.from(document.querySelectorAll('input[name="dataTypes"]:checked'))
          .map(cb => cb.value);

        const contractId = this.generateContractId();
        const contract = {
          id: contractId,
          type: 'Data Access Policy',
          version: '1.0',
          accessLevel,
          retentionPeriod: parseInt(retentionPeriod),
          dataTypes,
          status: 'Active',
          deployedAt: new Date(),
          address: `0x${this.generateToken(40).toLowerCase()}`
        };

        this.smartContracts.push(contract);
        this.updateSmartContractsList();
        this.addNotification(`Smart Contract deployed successfully (${contractId})`, 'success');
      });
    }

    this.createSmartContractBuilder();
    this.updateSmartContractsList();
  }

  createSmartContractBuilder() {
    const contractSection = document.getElementById('contracts');
    if (!contractSection) return;

    const builderHtml = `
      <div class="section-header">
        <h1>Smart Contract Governance</h1>
        <p>Blockchain-based policy management and automated compliance</p>
      </div>
      
      <div class="contract-builder">
        <div class="card">
          <div class="card__body">
            <h3>Policy Builder</h3>
            <div class="form-group">
              <label class="form-label">Access Level:</label>
              <select class="form-control" id="accessLevel">
                <option value="public">Public</option>
                <option value="restricted" selected>Restricted</option>
                <option value="confidential">Confidential</option>
                <option value="top-secret">Top Secret</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Data Retention Period (days):</label>
              <input type="number" class="form-control" id="retentionPeriod" 
                     value="90" min="1" max="3650">
            </div>
            <div class="form-group">
              <label class="form-label">Data Types:</label>
              <div class="checkbox-group">
                <label><input type="checkbox" name="dataTypes" value="personal" checked> Personal Information</label>
                <label><input type="checkbox" name="dataTypes" value="financial"> Financial Data</label>
                <label><input type="checkbox" name="dataTypes" value="health"> Health Records</label>
                <label><input type="checkbox" name="dataTypes" value="behavioral"> Behavioral Data</label>
              </div>
            </div>
            <button class="btn btn--primary" id="deployContract">Deploy Smart Contract</button>
          </div>
        </div>
        <div class="card">
          <div class="card__body">
            <h3>Active Contracts</h3>
            <div class="contract-list" id="contractList">
              <!-- Contracts will be populated here -->
            </div>
          </div>
        </div>
      </div>
    `;

    contractSection.innerHTML = builderHtml;
  }

  updateSmartContractsList() {
    const contractList = document.getElementById('contractList');
    if (!contractList) return;

    if (this.smartContracts.length === 0) {
      contractList.innerHTML = '<p>No active contracts deployed.</p>';
      return;
    }

    contractList.innerHTML = this.smartContracts.map(contract => `
      <div class="contract-item">
        <div class="contract-info">
          <strong>${contract.type} v${contract.version}</strong>
          <div class="contract-status">
            <span class="status status--success">${contract.status}</span>
            <span class="contract-address">${contract.address}</span>
          </div>
          <p>Access: ${contract.accessLevel} | Retention: ${contract.retentionPeriod} days</p>
          <p>Data Types: ${contract.dataTypes.join(', ')}</p>
          <small>Deployed: ${contract.deployedAt.toLocaleString()}</small>
        </div>
        <button class="btn btn--secondary" onclick="window.privacyApp.viewContract('${contract.id}')">
          View Details
        </button>
      </div>
    `).join('');
  }

  generateContractId() {
    return `CONTRACT_${Date.now()}_${this.generateToken(6)}`;
  }

  viewContract(contractId) {
    const contract = this.smartContracts.find(c => c.id === contractId);
    if (contract) {
      const details = `
        <div class="contract-details">
          <p><strong>Contract ID:</strong> ${contract.id}</p>
          <p><strong>Type:</strong> ${contract.type}</p>
          <p><strong>Version:</strong> ${contract.version}</p>
          <p><strong>Status:</strong> ${contract.status}</p>
          <p><strong>Address:</strong> ${contract.address}</p>
          <p><strong>Access Level:</strong> ${contract.accessLevel}</p>
          <p><strong>Retention Period:</strong> ${contract.retentionPeriod} days</p>
          <p><strong>Data Types:</strong> ${contract.dataTypes.join(', ')}</p>
          <p><strong>Deployed:</strong> ${contract.deployedAt.toLocaleString()}</p>
        </div>
      `;
      this.showModal('Smart Contract Details', details, 'info');
    }
  }

  // Comprehensive Consent Management
  setupConsentManagement() {
    this.createConsentDashboard();
    this.loadConsentHistory();
  }

  createConsentDashboard() {
    const consentSection = document.getElementById('consent');
    if (!consentSection) return;

    const dashboardHtml = `
      <div class="section-header">
        <h1>Consent Management</h1>
        <p>Granular privacy controls and consent history</p>
      </div>
      
      <div class="consent-dashboard">
        <div class="card">
          <div class="card__body">
            <h3>Consent Controls</h3>
            <div class="consent-controls">
              <div class="consent-item">
                <div class="consent-info">
                  <strong>Marketing Communications</strong>
                  <p>Allow us to send you promotional emails and offers</p>
                </div>
                <div class="toggle-switch">
                  <input type="checkbox" id="marketingConsent" checked>
                  <span class="slider"></span>
                </div>
              </div>
              
              <div class="consent-item">
                <div class="consent-info">
                  <strong>Data Sharing with Partners</strong>
                  <p>Share anonymized data with trusted partners for research</p>
                </div>
                <div class="toggle-switch">
                  <input type="checkbox" id="dataSharingConsent" checked>
                  <span class="slider"></span>
                </div>
              </div>
              
              <div class="consent-item">
                <div class="consent-info">
                  <strong>Analytics & Tracking</strong>
                  <p>Allow analytics tracking to improve user experience</p>
                </div>
                <div class="toggle-switch">
                  <input type="checkbox" id="analyticsConsent" checked>
                  <span class="slider"></span>
                </div>
              </div>
              
              <div class="consent-item">
                <div class="consent-info">
                  <strong>Location Services</strong>
                  <p>Use location data for personalized services</p>
                </div>
                <div class="toggle-switch">
                  <input type="checkbox" id="locationConsent">
                  <span class="slider"></span>
                </div>
              </div>
              
              <div class="consent-item">
                <div class="consent-info">
                  <strong>Biometric Data Collection</strong>
                  <p>Collect biometric data for enhanced security</p>
                </div>
                <div class="toggle-switch">
                  <input type="checkbox" id="biometricConsent">
                  <span class="slider"></span>
                </div>
              </div>
            </div>
            
            <div style="margin-top: 24px; display: flex; gap: 16px;">
              <button class="btn btn--primary" id="saveConsent">Save All Preferences</button>
              <button class="btn btn--secondary" id="exportConsent">Export Consent Record</button>
            </div>
          </div>
        </div>
        
        <div class="card">
          <div class="card__body">
            <h3>Consent History</h3>
            <div class="consent-history" id="consentHistoryList">
              <!-- History will be populated here -->
            </div>
          </div>
        </div>
      </div>
    `;

    consentSection.innerHTML = dashboardHtml;

    // Add event listeners after DOM creation
    setTimeout(() => {
      const saveBtn = document.getElementById('saveConsent');
      if (saveBtn) {
        saveBtn.addEventListener('click', () => {
          this.saveConsentPreferences();
        });
      }

      const exportBtn = document.getElementById('exportConsent');
      if (exportBtn) {
        exportBtn.addEventListener('click', () => {
          this.exportConsentRecord();
        });
      }

      // Add toggle listeners
      ['marketingConsent', 'dataSharingConsent', 'analyticsConsent', 'locationConsent', 'biometricConsent']
        .forEach(id => {
          const toggle = document.getElementById(id);
          if (toggle) {
            toggle.addEventListener('change', (e) => {
              this.logConsentChange(id, e.target.checked);
              this.addNotification(`${id.replace('Consent', '')} consent ${e.target.checked ? 'granted' : 'revoked'}`, 'info');
            });
          }
        });
    }, 100);
  }

  saveConsentPreferences() {
    const preferences = {
      marketing: document.getElementById('marketingConsent')?.checked || false,
      dataSharing: document.getElementById('dataSharingConsent')?.checked || false,
      analytics: document.getElementById('analyticsConsent')?.checked || false,
      location: document.getElementById('locationConsent')?.checked || false,
      biometric: document.getElementById('biometricConsent')?.checked || false,
      timestamp: new Date().toISOString()
    };

    localStorage.setItem('consentPreferences', JSON.stringify(preferences));
    this.addNotification('Consent preferences saved successfully', 'success');
    this.logConsentChange('bulk_update', true, 'Bulk preference update');
  }

  logConsentChange(consentType, granted, details = '') {
    const historyEntry = {
      id: Date.now(),
      type: consentType.replace('Consent', ''),
      action: granted ? 'Granted' : 'Revoked',
      timestamp: new Date(),
      details: details || `Consent ${granted ? 'granted' : 'revoked'} for ${consentType.replace('Consent', '')}`
    };

    this.consentHistory.unshift(historyEntry);
    
    // Keep only last 50 entries
    if (this.consentHistory.length > 50) {
      this.consentHistory = this.consentHistory.slice(0, 50);
    }

    this.updateConsentHistory();
    this.saveConsentHistory();
  }

  updateConsentHistory() {
    const historyList = document.getElementById('consentHistoryList');
    if (!historyList) return;

    if (this.consentHistory.length === 0) {
      historyList.innerHTML = '<p>No consent history available.</p>';
      return;
    }

    historyList.innerHTML = this.consentHistory.map(entry => `
      <div class="history-item">
        <div class="timestamp">${entry.timestamp.toLocaleString()}</div>
        <div class="action">
          <strong>${entry.action}</strong> - ${entry.type}
        </div>
        <div class="details">${entry.details}</div>
      </div>
    `).join('');
  }

  loadConsentHistory() {
    const saved = localStorage.getItem('consentHistory');
    if (saved) {
      this.consentHistory = JSON.parse(saved).map(entry => ({
        ...entry,
        timestamp: new Date(entry.timestamp)
      }));
    }
  }

  saveConsentHistory() {
    localStorage.setItem('consentHistory', JSON.stringify(this.consentHistory));
  }

  exportConsentRecord() {
    const preferences = JSON.parse(localStorage.getItem('consentPreferences') || '{}');
    const data = {
      exportDate: new Date().toISOString(),
      preferences: preferences,
      history: this.consentHistory.slice(0, 20), // Last 20 entries
      message: 'Consent record exported successfully'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `consent-record-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    this.addNotification('Consent record exported successfully', 'success');
  }

  // Advanced Data Sharing
  setupDataSharing() {
    this.createDataSharingInterface();
  }

  createDataSharingInterface() {
    const sharingSection = document.getElementById('sharing');
    if (!sharingSection) return;

    const sharingHtml = `
      <div class="section-header">
        <h1>Cross-Platform Data Sharing</h1>
        <p>Secure data collaboration and federated learning</p>
      </div>
      
      <div class="sharing-simulator">
        <div class="card">
          <div class="card__body">
            <h3>Federated Data Sharing Configuration</h3>
            <div class="form-group">
              <label class="form-label">Collaboration Mode:</label>
              <select class="form-control" id="sharingMode">
                <option value="federated">Federated Learning</option>
                <option value="encrypted">Encrypted Transfer</option>
                <option value="anonymized">Anonymized Data</option>
                <option value="differential">Differential Privacy</option>
              </select>
            </div>
            
            <div class="form-group">
              <label class="form-label">Privacy Budget (for Differential Privacy):</label>
              <input type="range" class="form-control" id="privacyBudget" 
                     min="0.1" max="2.0" step="0.1" value="1.0">
              <small>Current value: <span id="budgetValue">1.0</span></small>
            </div>

            <div class="form-group">
              <label class="form-label">Partner Organizations:</label>
              <div class="checkbox-group">
                <label><input type="checkbox" value="healthcare-org" id="org1"> Healthcare Research Institute</label>
                <label><input type="checkbox" value="university-lab" id="org2"> University AI Lab</label>
                <label><input type="checkbox" value="tech-company" id="org3"> Tech Company Analytics</label>
                <label><input type="checkbox" value="government-agency" id="org4"> Government Health Agency</label>
              </div>
            </div>
            
            <button class="btn btn--primary" id="startSharing">Start Data Sharing</button>
            <button class="btn btn--secondary" id="stopSharing">Stop Sharing</button>
          </div>
        </div>

        <div class="data-flow" id="dataFlowViz">
          <div class="platform-node source">
            <div class="node-icon">🏥</div>
            <div class="node-label">Your Data</div>
            <div class="node-status active">Ready</div>
          </div>
          
          <div class="flow-arrow">➡️</div>
          
          <div class="platform-node security">
            <div class="node-icon">🔒</div>
            <div class="node-label">Privacy Engine</div>
            <div class="node-status processing">Processing</div>
          </div>
          
          <div class="flow-arrow">➡️</div>
          
          <div class="platform-node destination">
            <div class="node-icon">🤝</div>
            <div class="node-label">Partners</div>
            <div class="node-status active">Receiving</div>
          </div>
        </div>

        <div class="sharing-stats" id="sharingStats">
          <div class="card">
            <div class="card__body">
              <h4>Data Transferred</h4>
              <div class="metric-value" id="dataTransferred">0 MB</div>
            </div>
          </div>
          <div class="card">
            <div class="card__body">
              <h4>Privacy Level</h4>
              <div class="metric-value" id="privacyLevel">95%</div>
            </div>
          </div>
          <div class="card">
            <div class="card__body">
              <h4>Active Partners</h4>
              <div class="metric-value" id="activePartners">0</div>
            </div>
          </div>
        </div>
      </div>
    `;

    sharingSection.innerHTML = sharingHtml;

    // Event listeners
    setTimeout(() => {
      document.getElementById('privacyBudget')?.addEventListener('input', (e) => {
        document.getElementById('budgetValue').textContent = e.target.value;
      });

      document.getElementById('startSharing')?.addEventListener('click', () => {
        this.startDataSharing();
      });

      document.getElementById('stopSharing')?.addEventListener('click', () => {
        this.stopDataSharing();
      });
    }, 100);
  }

  startDataSharing() {
    const mode = document.getElementById('sharingMode')?.value || 'federated';
    const budget = document.getElementById('privacyBudget')?.value || '1.0';
    const partners = Array.from(document.querySelectorAll('#sharing input[type="checkbox"]:checked'))
      .map(cb => cb.value);

    if (partners.length === 0) {
      this.addNotification('Please select at least one partner organization', 'warning');
      return;
    }

    this.isDataSharing = true;
    const activePartnersEl = document.getElementById('activePartners');
    if (activePartnersEl) {
      activePartnersEl.textContent = partners.length;
    }
    
    this.addNotification(`Data sharing started with ${partners.length} partner(s) using ${mode} mode`, 'success');
    
    // Simulate data transfer
    this.simulateDataTransfer();
  }

  stopDataSharing() {
    this.isDataSharing = false;
    const activePartnersEl = document.getElementById('activePartners');
    const dataTransferredEl = document.getElementById('dataTransferred');
    
    if (activePartnersEl) activePartnersEl.textContent = '0';
    if (dataTransferredEl) dataTransferredEl.textContent = '0 MB';
    
    this.addNotification('Data sharing stopped', 'info');
  }

  simulateDataTransfer() {
    if (!this.isDataSharing) return;

    const dataTransferredEl = document.getElementById('dataTransferred');
    if (dataTransferredEl) {
      const current = parseFloat(dataTransferredEl.textContent) || 0;
      const increment = Math.random() * 5;
      dataTransferredEl.textContent = `${(current + increment).toFixed(1)} MB`;
    }

    setTimeout(() => this.simulateDataTransfer(), 2000);
  }

  // Enhanced Monitoring System
  setupMonitoring() {
    this.createMonitoringInterface();
    this.startThreatMonitoring();
  }

  createMonitoringInterface() {
    const monitoringSection = document.getElementById('monitoring');
    if (!monitoringSection) return;

    const monitoringHtml = `
      <div class="section-header">
        <h1>Real-time Monitoring Center</h1>
        <p>Live security monitoring and anomaly detection</p>
      </div>
      
      <div class="monitoring-dashboard">
        <div class="card">
          <div class="card__body">
            <div class="threat-indicators">
              <h3>Threat Detection</h3>
              <div class="indicator safe">
                <span class="indicator-icon">🛡️</span>
                <span class="indicator-text">No Active Threats</span>
              </div>
              <div class="security-metrics">
                <div class="metric">
                  <span>Firewall Status:</span>
                  <span class="status status--success">Active</span>
                </div>
                <div class="metric">
                  <span>Intrusion Detection:</span>
                  <span class="status status--success">Monitoring</span>
                </div>
                <div class="metric">
                  <span>Data Encryption:</span>
                  <span class="status status--success">Enabled</span>
                </div>
                <div class="metric">
                  <span>Access Controls:</span>
                  <span class="status status--success">Enforced</span>
                </div>
                <div class="metric">
                  <span>Anomaly Detection:</span>
                  <span class="status status--success">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card__body">
            <h3>System Performance</h3>
            <div class="security-metrics">
              <div class="metric">
                <span>CPU Usage:</span>
                <span id="cpuUsage">45%</span>
              </div>
              <div class="metric">
                <span>Memory Usage:</span>
                <span id="memoryUsage">62%</span>
              </div>
              <div class="metric">
                <span>Network I/O:</span>
                <span id="networkIO">1.2 MB/s</span>
              </div>
              <div class="metric">
                <span>Disk Usage:</span>
                <span id="diskUsage">34%</span>
              </div>
              <div class="metric">
                <span>Encryption Ops/sec:</span>
                <span id="encryptionOps">15,247</span>
              </div>
              <div class="metric">
                <span>Request Rate:</span>
                <span id="requestRate">127 req/min</span>
              </div>
            </div>
            <canvas id="performanceChart" style="margin-top: 20px; max-height: 300px;"></canvas>
          </div>
        </div>
      </div>

      <div class="card" style="margin-top: 24px;">
        <div class="card__body">
          <h3>Security Events Log</h3>
          <div id="securityLog" style="max-height: 300px; overflow-y: auto;">
            <!-- Security events will be logged here -->
          </div>
        </div>
      </div>
    `;

    monitoringSection.innerHTML = monitoringHtml;
  }

  startThreatMonitoring() {
    // Simulate real-time system monitoring
    setInterval(() => {
      if (this.currentSection === 'monitoring') {
        this.updateSystemMetrics();
        this.checkForThreats();
      }
    }, 3000);

    // Log initial security event
    this.logSecurityEvent('System monitoring started', 'info');
  }

  updateSystemMetrics() {
    const metrics = {
      cpu: Math.floor(Math.random() * 30 + 30), // 30-60%
      memory: Math.floor(Math.random() * 40 + 40), // 40-80%
      network: (Math.random() * 2 + 0.5).toFixed(1), // 0.5-2.5 MB/s
      disk: Math.floor(Math.random() * 20 + 25), // 25-45%
      encryption: Math.floor(Math.random() * 5000 + 12000), // 12000-17000
      requests: Math.floor(Math.random() * 100 + 80) // 80-180
    };

    const cpuEl = document.getElementById('cpuUsage');
    const memoryEl = document.getElementById('memoryUsage');
    const networkEl = document.getElementById('networkIO');
    const diskEl = document.getElementById('diskUsage');
    const encryptionEl = document.getElementById('encryptionOps');
    const requestsEl = document.getElementById('requestRate');

    if (cpuEl) cpuEl.textContent = `${metrics.cpu}%`;
    if (memoryEl) memoryEl.textContent = `${metrics.memory}%`;
    if (networkEl) networkEl.textContent = `${metrics.network} MB/s`;
    if (diskEl) diskEl.textContent = `${metrics.disk}%`;
    if (encryptionEl) encryptionEl.textContent = metrics.encryption.toLocaleString();
    if (requestsEl) requestsEl.textContent = `${metrics.requests} req/min`;

    // Update overall system load
    this.metrics.systemLoad = Math.floor((metrics.cpu + metrics.memory) / 2);
  }

  checkForThreats() {
    const threatChance = Math.random();
    const threatIndicator = document.querySelector('.threat-indicators .indicator');
    const threatText = document.querySelector('.threat-indicators .indicator-text');

    if (threatChance > 0.95) { // 5% chance of threat
      const threatTypes = [
        'Unusual login attempt detected',
        'Potential data exfiltration attempt',
        'Suspicious network activity',
        'Failed authentication spike',
        'Anomalous access pattern'
      ];
      
      const threat = threatTypes[Math.floor(Math.random() * threatTypes.length)];
      this.threatLevel = 1;
      
      if (threatIndicator && threatText) {
        threatIndicator.className = 'indicator warning';
        threatIndicator.innerHTML = '<span class="indicator-icon">⚠️</span>';
        threatText.textContent = 'Threat Detected';
      }
      
      this.logSecurityEvent(threat, 'warning');
      this.addNotification(threat, 'warning');
      
      // Auto-resolve after 30 seconds
      setTimeout(() => {
        this.threatLevel = 0;
        if (threatIndicator && threatText) {
          threatIndicator.className = 'indicator safe';
          threatIndicator.innerHTML = '<span class="indicator-icon">🛡️</span>';
          threatText.textContent = 'No Active Threats';
        }
        this.logSecurityEvent('Threat resolved automatically', 'success');
      }, 30000);
    }

    // Update dashboard metric
    this.metrics.activeThreats = this.threatLevel;
    this.updateDashboardMetrics();
  }

  logSecurityEvent(message, type) {
    const securityLog = document.getElementById('securityLog');
    if (!securityLog) return;

    const timestamp = new Date().toLocaleString();
    const eventElement = document.createElement('div');
    eventElement.className = `security-event ${type}`;
    eventElement.innerHTML = `
      <span class="timestamp">${timestamp}</span>
      <span class="message">${message}</span>
      <span class="status status--${type}">${type.toUpperCase()}</span>
    `;

    securityLog.insertBefore(eventElement, securityLog.firstChild);

    // Keep only last 20 events
    while (securityLog.children.length > 20) {
      securityLog.removeChild(securityLog.lastChild);
    }
  }

  // Performance Chart Implementation
  initPerformanceChart() {
    const existingChart = document.getElementById('performanceChart');
    if (!existingChart) return;

    if (this.performanceChart) {
      this.performanceChart.destroy();
    }

    const ctx = existingChart.getContext('2d');
    
    const data = {
      labels: this.generateTimeLabels(),
      datasets: [
        {
          label: 'System Load (%)',
          data: this.generatePerformanceData(),
          borderColor: 'rgba(33, 128, 141, 1)',
          backgroundColor: 'rgba(33, 128, 141, 0.1)',
          fill: true,
          tension: 0.3
        },
        {
          label: 'Encryption Ops (thousands)',
          data: this.generateEncryptionData(),
          borderColor: 'rgba(192, 21, 47, 1)',
          backgroundColor: 'rgba(192, 21, 47, 0.1)',
          fill: false,
          tension: 0.3
        }
      ]
    };

    // Only create chart if Chart.js is available
    if (typeof Chart !== 'undefined') {
      this.performanceChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: { beginAtZero: true, max: 100 }
          },
          animation: { duration: 0 }
        }
      });

      // Update chart every 5 seconds
      setInterval(() => {
        if (this.currentSection === 'monitoring' && this.performanceChart) {
          this.updatePerformanceChart();
        }
      }, 5000);
    }
  }

  generateTimeLabels() {
    const labels = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60000); // 1 minute intervals
      labels.push(time.toLocaleTimeString().slice(0, 5));
    }
    return labels;
  }

  generatePerformanceData() {
    return Array.from({length: 12}, () => Math.floor(Math.random() * 50 + 20));
  }

  generateEncryptionData() {
    return Array.from({length: 12}, () => Math.floor(Math.random() * 20 + 10));
  }

  updatePerformanceChart() {
    if (!this.performanceChart) return;

    const now = new Date();
    const newLabel = now.toLocaleTimeString().slice(0, 5);
    const newSystemLoad = Math.floor(Math.random() * 50 + 20);
    const newEncryption = Math.floor(Math.random() * 20 + 10);

    // Update data
    this.performanceChart.data.labels.shift();
    this.performanceChart.data.labels.push(newLabel);
    
    this.performanceChart.data.datasets[0].data.shift();
    this.performanceChart.data.datasets[0].data.push(newSystemLoad);
    
    this.performanceChart.data.datasets[1].data.shift();
    this.performanceChart.data.datasets[1].data.push(newEncryption);

    this.performanceChart.update('none'); // No animation for real-time updates
  }

  // Comprehensive Compliance System
  setupCompliance() {
    this.createComplianceInterface();
    this.scheduleComplianceUpdates();
  }

  createComplianceInterface() {
    const complianceSection = document.getElementById('compliance');
    if (!complianceSection) return;

    const complianceHtml = `
      <div class="section-header">
        <h1>Compliance Reporting</h1>
        <p>Automated compliance reports and audit trails</p>
      </div>
      
      <div class="compliance-grid">
        ${Object.entries(this.complianceData).map(([framework, score]) => `
          <div class="compliance-item" data-framework="${framework}">
            <div class="framework-name">${framework.toUpperCase()}</div>
            <div class="compliance-score">${score}%</div>
            <div class="status ${score >= 90 ? 'status--success' : 'status--warning'}">
              ${score >= 90 ? 'Compliant' : 'Needs Review'}
            </div>
          </div>
        `).join('')}
      </div>

      <div class="card" style="margin-top: 24px;">
        <div class="card__body">
          <h3>Compliance Details</h3>
          <div id="complianceDetails">
            <div class="compliance-breakdown">
              <h4>GDPR Compliance Breakdown</h4>
              <div class="metric">
                <span>Data Subject Rights:</span>
                <span class="status status--success">Compliant</span>
              </div>
              <div class="metric">
                <span>Privacy by Design:</span>
                <span class="status status--success">Implemented</span>
              </div>
              <div class="metric">
                <span>Breach Notification:</span>
                <span class="status status--success">Ready</span>
              </div>
              <div class="metric">
                <span>Data Protection Officer:</span>
                <span class="status status--warning">Pending</span>
              </div>
            </div>
          </div>
          
          <div class="report-actions">
            <button class="btn btn--primary" id="generateReport">Generate Full Report</button>
            <button class="btn btn--secondary" id="scheduleAudit">Schedule Audit</button>
            <button class="btn btn--secondary" id="exportCompliance">Export Compliance Data</button>
          </div>
        </div>
      </div>
    `;

    complianceSection.innerHTML = complianceHtml;

    // Add event listeners
    setTimeout(() => {
      document.getElementById('generateReport')?.addEventListener('click', () => {
        this.generateComplianceReport();
      });

      document.getElementById('scheduleAudit')?.addEventListener('click', () => {
        this.scheduleComplianceAudit();
      });

      document.getElementById('exportCompliance')?.addEventListener('click', () => {
        this.exportComplianceData();
      });
    }, 100);
  }

  scheduleComplianceUpdates() {
    // Update compliance scores every 30 seconds
    setInterval(() => {
      this.updateComplianceScores();
    }, 30000);
  }

  updateComplianceScores() {
    Object.keys(this.complianceData).forEach(framework => {
      // Simulate small fluctuations in compliance scores
      const change = (Math.random() - 0.5) * 2; // -1 to +1
      this.complianceData[framework] = Math.min(100, Math.max(80, 
        this.complianceData[framework] + change));
      
      // Round to 1 decimal place
      this.complianceData[framework] = Math.round(this.complianceData[framework] * 10) / 10;
    });

    // Update UI
    const complianceItems = document.querySelectorAll('.compliance-item');
    complianceItems.forEach(item => {
      const framework = item.getAttribute('data-framework');
      const score = this.complianceData[framework];
      
      const scoreEl = item.querySelector('.compliance-score');
      const statusEl = item.querySelector('.status');
      
      if (scoreEl) scoreEl.textContent = `${score}%`;
      if (statusEl) {
        statusEl.className = score >= 90 ? 'status status--success' : 'status status--warning';
        statusEl.textContent = score >= 90 ? 'Compliant' : 'Needs Review';
      }
    });

    // Update overall compliance score
    const avgCompliance = Object.values(this.complianceData)
      .reduce((sum, score) => sum + score, 0) / Object.keys(this.complianceData).length;
    this.metrics.complianceScore = Math.round(avgCompliance * 10) / 10;
  }

  generateComplianceReport() {
    this.addNotification('Generating comprehensive compliance report...', 'info');
    
    setTimeout(() => {
      this.exportComplianceReport();
      this.addNotification('Compliance report generated successfully', 'success');
    }, 2000);
  }

  scheduleComplianceAudit() {
    const auditDate = new Date();
    auditDate.setDate(auditDate.getDate() + 30); // Schedule 30 days from now
    
    this.addNotification(`Compliance audit scheduled for ${auditDate.toDateString()}`, 'info');
    this.logSecurityEvent(`Compliance audit scheduled for ${auditDate.toDateString()}`, 'info');
  }

  exportComplianceData() {
    const complianceData = {
      timestamp: new Date().toISOString(),
      scores: this.complianceData,
      overallScore: this.metrics.complianceScore,
      systemMetrics: this.metrics,
      enabledTechniques: Object.entries(this.privacyTechniques)
        .filter(([_, tech]) => tech.enabled)
        .map(([name, _]) => name)
    };

    const dataStr = JSON.stringify(complianceData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `compliance_data_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    this.addNotification('Compliance data exported successfully', 'success');
  }

  exportComplianceReport() {
    // Simple text report (can be enhanced with jsPDF if available)
    const reportContent = `
Privacy & Compliance Report
Generated: ${new Date().toLocaleDateString()}

Overall Compliance Score: ${this.metrics.complianceScore}%
Privacy Score: ${this.metrics.privacyScore}
Active Privacy Techniques: ${Object.values(this.privacyTechniques).filter(t => t.enabled).length}

Regulatory Compliance:
${Object.entries(this.complianceData).map(([framework, score]) => 
  `${framework.toUpperCase()}: ${score}% (${score >= 90 ? 'COMPLIANT' : 'NEEDS REVIEW'})`
).join('\n')}

Active Privacy Technologies:
${Object.entries(this.privacyTechniques)
  .filter(([_, tech]) => tech.enabled)
  .map(([name, tech]) => `✓ ${name.replace('-', ' ').toUpperCase()}: Privacy ${tech.privacyLevel}% | Utility ${tech.utilityLevel}%`)
  .join('\n')}

Recommendations:
${this.generateComplianceRecommendations().map(rec => `• ${rec}`).join('\n')}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compliance_report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  generateComplianceRecommendations() {
    const recommendations = [];
    
    // Check compliance scores
    Object.entries(this.complianceData).forEach(([framework, score]) => {
      if (score < 90) {
        recommendations.push(`Improve ${framework.toUpperCase()} compliance (currently ${score}%)`);
      }
    });

    // Check privacy techniques
    const enabledTechniques = Object.values(this.privacyTechniques).filter(t => t.enabled).length;
    if (enabledTechniques < 2) {
      recommendations.push('Consider enabling additional privacy-enhancing technologies');
    }

    // Check privacy score
    if (this.metrics.privacyScore < 95) {
      recommendations.push('Enhance privacy protection measures to achieve higher privacy score');
    }

    // Default recommendations
    if (recommendations.length === 0) {
      recommendations.push('Maintain current privacy and compliance standards');
      recommendations.push('Consider regular compliance audits');
      recommendations.push('Stay updated with regulatory changes');
    }

    return recommendations;
  }

  // Modal System
  setupModals() {
    // Create modal if it doesn't exist
    if (!document.getElementById('configModal')) {
      this.createModalStructure();
    }

     const modal = document.getElementById('configModal');
        const closeBtn = document.querySelector('.modal-close');
        const cancelBtn = document.querySelector('.modal-cancel');
        const applyBtn = document.querySelector('.modal-apply');
        
        const closeModal = () => {
            modal.classList.remove('show');
        };
        
        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        
        applyBtn.addEventListener('click', () => {
            this.showNotification('Configuration applied successfully!', 'success');
            closeModal();
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                closeModal();
            }
        });
    }

  createModalStructure() {
    const modal = document.createElement('div');
    modal.id = 'configModal';
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3 id="modalTitle">Modal Title</h3>
          <button id="modalClose" class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <div id="modalContent">Modal content goes here</div>
        </div>
        <div class="modal-footer">
          <button class="btn btn--secondary" id="modalCancel">Cancel</button>
          <button class="btn btn--primary" id="modalSave">Save</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  showModal(title, content, type = 'info', context = null) {
    const modal = document.getElementById('configModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    const footer = modal.querySelector('.modal-footer');
    
    modalTitle.textContent = title;
    modalContent.innerHTML = content;
    
    // Show/hide footer based on modal type
    if (type === 'info') {
      footer.style.display = 'none';
    } else {
      footer.style.display = 'flex';
    }
    
    modal.classList.add('show');
    modal.setAttribute('data-context', context || '');
  }

  handleModalSave() {
    const modal = document.getElementById('configModal');
    const context = modal.getAttribute('data-context');
    
    if (context && this.privacyTechniques[context]) {
      // Save privacy technique configuration
      const config = {};
      const inputs = modal.querySelectorAll('input, select');
      
      inputs.forEach(input => {
        config[input.id] = input.type === 'number' ? 
          parseFloat(input.value) : input.value;
      });
      
      this.privacyTechniques[context].config = { ...this.privacyTechniques[context].config, ...config };
      this.addNotification(`${context.replace('-', ' ')} configuration saved`, 'success');
    }
    
    modal.classList.remove('show');
  }

  // Notification System
  setupNotifications() {
    this.createNotificationContainer();
  }

  createNotificationContainer() {
    const container = document.createElement('div');
    container.id = 'notificationContainer';
    container.className = 'notification-container';
    container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      max-width: 400px;
    `;
    document.body.appendChild(container);
  }

  addNotification(message, type = 'info', duration = 5000) {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date()
    };

    this.notifications.unshift(notification);
    this.displayNotification(notification, duration);

    // Keep only last 20 notifications
    if (this.notifications.length > 20) {
      this.notifications = this.notifications.slice(0, 20);
    }
  }

  displayNotification(notification, duration) {
    const container = document.getElementById('notificationContainer');
    if (!container) return;

    const element = document.createElement('div');
    element.className = `notification notification--${notification.type}`;
    element.style.cssText = `
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-base);
      padding: var(--space-16);
      margin-bottom: var(--space-8);
      box-shadow: var(--shadow-lg);
      animation: slideIn 0.3s ease-out;
      position: relative;
    `;

    const iconMap = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };

    element.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
        <span style="font-size: 18px;">${iconMap[notification.type]}</span>
        <div style="flex: 1;">
          <div style="font-weight: 500; margin-bottom: 4px;">${notification.message}</div>
          <div style="font-size: 12px; color: var(--color-text-secondary);">
            ${notification.timestamp.toLocaleTimeString()}
          </div>
        </div>
        <button style="background: none; border: none; font-size: 18px; cursor: pointer; color: var(--color-text-secondary);" 
                onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;

    container.appendChild(element);

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        if (element.parentNode) {
          element.style.animation = 'slideOut 0.3s ease-out';
          setTimeout(() => element.remove(), 300);
        }
      }, duration);
    }
  }

  // Dashboard Metrics
  updateDashboardMetrics() {
    // Update metric cards
    const metricCards = document.querySelectorAll('.metric-card');
    if (metricCards.length >= 4) {
      const uptimeEl = metricCards[0]?.querySelector('.metric-value');
      const privacyEl = metricCards[1]?.querySelector('.metric-value');
      const threatEl = metricCards[2]?.querySelector('.metric-value');
      const dataEl = metricCards[3]?.querySelector('.metric-value');

      if (uptimeEl) uptimeEl.textContent = `${this.metrics.uptime}%`;
      if (privacyEl) privacyEl.textContent = this.metrics.privacyScore;
      if (threatEl) threatEl.textContent = this.metrics.activeThreats;
      if (dataEl) dataEl.textContent = `${this.metrics.dataProcessed.toFixed(1)}M`;
    }

    // Update threat indicator
    const threatCard = metricCards[2];
    if (threatCard) {
      const labelEl = threatCard.querySelector('.metric-label');
      if (this.metrics.activeThreats === 0) {
        if (labelEl) labelEl.textContent = 'Secure';
        threatCard.style.borderColor = 'var(--color-success)';
      } else {
        if (labelEl) labelEl.textContent = 'Alert';
        threatCard.style.borderColor = 'var(--color-warning)';
      }
    }
  }

  // Chart Initialization
  initializeCharts() {
    this.initPrivacyUtilityChart();
  }

  initPrivacyUtilityChart() {
    const chartContainer = document.querySelector('#dashboard .charts-grid');
    if (!chartContainer || typeof Chart === 'undefined') return;

    const canvas = document.createElement('canvas');
    canvas.id = 'privacyUtilityChart';
    canvas.style.maxHeight = '300px';
    
    const chartCard = document.createElement('div');
    chartCard.className = 'card';
    chartCard.innerHTML = `
      <div class="card__body">
        <h3>Privacy-Utility Tradeoffs</h3>
      </div>
    `;
    chartCard.querySelector('.card__body').appendChild(canvas);
    chartContainer.appendChild(chartCard);

    const ctx = canvas.getContext('2d');
    this.privacyUtilityChart = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Privacy Techniques',
          data: Object.entries(this.privacyTechniques).map(([name, tech]) => ({
            x: tech.utilityLevel,
            y: tech.privacyLevel,
            technique: name
          })),
          backgroundColor: 'rgba(33, 128, 141, 0.6)',
          borderColor: 'rgba(33, 128, 141, 1)',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: { display: true, text: 'Utility Level (%)' },
            min: 0, max: 100
          },
          y: {
            title: { display: true, text: 'Privacy Level (%)' },
            min: 0, max: 100
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                const point = context.raw;
                return `${point.technique}: Privacy ${point.y}%, Utility ${point.x}%`;
              }
            }
          }
        }
      }
    });
  }

  // Real-time Updates
  startRealTimeUpdates() {
    // Update dashboard metrics every 3 seconds
    setInterval(() => {
      if (this.currentSection === 'dashboard') {
        this.simulateMetricUpdates();
        this.updateDashboardMetrics();
      }
    }, 3000);

    // Update data processing counter
    setInterval(() => {
      this.metrics.dataProcessed += Math.random() * 0.01;
      if (this.currentSection === 'dashboard') {
        this.updateDashboardMetrics();
      }
    }, 5000);

    // Simulate system uptime
    setInterval(() => {
      this.metrics.uptime = Math.min(99.9, this.metrics.uptime + Math.random() * 0.01);
    }, 10000);
  }

  simulateMetricUpdates() {
    // Small random variations in metrics
    this.metrics.uptime = Math.max(99.0, Math.min(99.9, 
      this.metrics.uptime + (Math.random() - 0.5) * 0.1));
    
    // Privacy score based on enabled techniques
    this.updatePrivacyScore();
    
    // System load variation
    this.metrics.systemLoad = Math.max(20, Math.min(80, 
      this.metrics.systemLoad + (Math.random() - 0.5) * 10));
  }

  // User Preferences
  loadUserPreferences() {
    const saved = localStorage.getItem('userPreferences');
    if (saved) {
      const preferences = JSON.parse(saved);
      
      // Apply saved consent preferences
      if (preferences.consent) {
        Object.entries(preferences.consent).forEach(([key, value]) => {
          const element = document.getElementById(`${key}Consent`);
          if (element) element.checked = value;
        });
      }

      // Apply saved privacy technique states
      if (preferences.techniques) {
        Object.entries(preferences.techniques).forEach(([key, enabled]) => {
          if (this.privacyTechniques[key]) {
            this.privacyTechniques[key].enabled = enabled;
          }
        });
      }
    }

    // Initial notification
    this.addNotification('Privacy Dashboard initialized successfully', 'success');
  }

  saveUserPreferences() {
    const preferences = {
      consent: {
        marketing: document.getElementById('marketingConsent')?.checked,
        dataSharing: document.getElementById('dataSharingConsent')?.checked,
        analytics: document.getElementById('analyticsConsent')?.checked,
        location: document.getElementById('locationConsent')?.checked,
        biometric: document.getElementById('biometricConsent')?.checked
      },
      techniques: Object.fromEntries(
        Object.entries(this.privacyTechniques).map(([key, tech]) => [key, tech.enabled])
      ),
      theme: document.documentElement.getAttribute('data-color-scheme')
    };

    localStorage.setItem('userPreferences', JSON.stringify(preferences));
  }

  // Cleanup
  destroy() {
    // Clean up charts
    if (this.performanceChart) {
      this.performanceChart.destroy();
    }
    if (this.privacyUtilityChart) {
      this.privacyUtilityChart.destroy();
    }

    // Save preferences before cleanup
    this.saveUserPreferences();
  }
}

// Add required CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
  
  .security-event {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    margin-bottom: 8px;
    border-radius: 4px;
    border-left: 4px solid var(--color-primary);
  }
  
  .security-event.warning {
    border-left-color: var(--color-warning);
    background-color: rgba(var(--color-warning-rgb), 0.1);
  }
  
  .security-event.error {
    border-left-color: var(--color-error);
    background-color: rgba(var(--color-error-rgb), 0.1);
  }
  
  .security-event .timestamp {
    font-family: var(--font-family-mono);
    font-size: var(--font-size-xs);
    color: var(--color-text-secondary);
  }
`;
document.head.appendChild(style);

// Initialize App when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.privacyApp = new PrivacyApp();
  
  // Setup logout functionality
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      localStorage.removeItem('jwt');
      localStorage.removeItem('role');
      localStorage.removeItem('username');
      window.location.href = 'login.html';
    });
  }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (window.privacyApp) {
    window.privacyApp.destroy();
  }
});

