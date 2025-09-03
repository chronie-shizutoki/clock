// Enhanced Clock Component with multiple features
class EnhancedClock {
    constructor(language = 'en-US') {
        this.language = language;
        this.clockMode = 'digital'; // 'digital' or 'analog'
        this.theme = 'light'; // 'light' or 'dark'
        this.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        this.is24Hour = true;
        this.showSeconds = true;
        this.isFullscreen = false;
        this.soundEnabled = true;
        
        // Timer states
        this.stopwatchTime = 0;
        this.stopwatchInterval = null;
        this.stopwatchRunning = false;
        
        this.countdownTime = 0;
        this.countdownInterval = null;
        this.countdownRunning = false;
        
        // Alarm states
        this.alarms = [];
        this.alarmSound = null;
        
        this.container = null;
        this.currentClockElement = null;
        
        this.init();
    }
    
    init() {
        this.createContainer();
        this.createControlPanel();
        this.createClock();
        this.setupEventListeners();
        this.loadSettings();
    }
    
    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'enhanced-clock-container';
        this.container.innerHTML = `
            <div class="clock-wrapper">
                <div class="control-panel" id="controlPanel">
                    <div class="panel-header">
                        <h3>时钟设置</h3>
                        <button class="panel-toggle" id="panelToggle">⚙️</button>
                    </div>
                    <div class="panel-content" id="panelContent">
                        <div class="control-group">
                            <label>显示模式:</label>
                            <select id="clockModeSelect">
                                <option value="digital">数字时钟</option>
                                <option value="analog">模拟时钟</option>
                            </select>
                        </div>
                        
                        <div class="control-group">
                            <label>主题:</label>
                            <select id="themeSelect">
                                <option value="light">浅色</option>
                                <option value="dark">深色</option>
                                <option value="neon">霓虹</option>
                            </select>
                        </div>
                        
                        <div class="control-group">
                            <label>时区:</label>
                            <select id="timezoneSelect">
                                <option value="Asia/Shanghai">北京时间</option>
                                <option value="America/New_York">纽约时间</option>
                                <option value="Europe/London">伦敦时间</option>
                                <option value="Asia/Tokyo">东京时间</option>
                                <option value="Australia/Sydney">悉尼时间</option>
                                <option value="Europe/Paris">巴黎时间</option>
                                <option value="America/Los_Angeles">洛杉矶时间</option>
                            </select>
                        </div>
                        
                        <div class="control-group">
                            <label>
                                <input type="checkbox" id="format24Hour" checked> 24小时制
                            </label>
                        </div>
                        
                        <div class="control-group">
                            <label>
                                <input type="checkbox" id="showSecondsCheck" checked> 显示秒
                            </label>
                        </div>
                        
                        <div class="control-group">
                            <label>
                                <input type="checkbox" id="soundEnabledCheck" checked> 音效
                            </label>
                        </div>
                        
                        <div class="control-group">
                            <button id="fullscreenBtn">全屏模式</button>
                        </div>
                        
                        <div class="timer-controls">
                            <h4>计时器</h4>
                            <div class="timer-section">
                                <h5>秒表</h5>
                                <div class="stopwatch-display" id="stopwatchDisplay">00:00:00</div>
                                <div class="timer-buttons">
                                    <button id="stopwatchStart">开始</button>
                                    <button id="stopwatchPause">暂停</button>
                                    <button id="stopwatchReset">重置</button>
                                </div>
                            </div>
                            
                            <div class="timer-section">
                                <h5>倒计时</h5>
                                <div class="countdown-inputs">
                                    <input type="number" id="countdownMinutes" placeholder="分钟" min="0" max="59">
                                    <input type="number" id="countdownSeconds" placeholder="秒" min="0" max="59">
                                </div>
                                <div class="countdown-display" id="countdownDisplay">00:00</div>
                                <div class="timer-buttons">
                                    <button id="countdownStart">开始</button>
                                    <button id="countdownPause">暂停</button>
                                    <button id="countdownReset">重置</button>
                                </div>
                            </div>
                            
                            <div class="timer-section">
                                <h5>闹钟</h5>
                                <div class="alarm-inputs">
                                    <input type="time" id="alarmTime">
                                    <button id="addAlarm">添加闹钟</button>
                                </div>
                                <div class="alarm-list" id="alarmList"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="clock-display-area" id="clockDisplayArea">
                    <!-- Clock will be inserted here -->
                </div>
            </div>
        `;
    }
    
    createControlPanel() {
        // Control panel is created in createContainer
    }
    
    createClock() {
        const clockArea = this.container.querySelector('#clockDisplayArea');
        clockArea.innerHTML = '';
        
        if (this.clockMode === 'digital') {
            this.currentClockElement = this.createDigitalClock();
        } else {
            this.currentClockElement = this.createAnalogClock();
        }
        
        clockArea.appendChild(this.currentClockElement);
        this.applyTheme();
    }
    
    createDigitalClock() {
        const digitalClock = document.createElement('div');
        digitalClock.className = 'digital-clock';
        digitalClock.innerHTML = `
            <div class="glow"></div>
            <div class="particles"></div>
            <div class="time-display" id="digitalTime"></div>
            <div class="date-display" id="digitalDate"></div>
            <div class="timezone-display" id="timezoneDisplay"></div>
        `;
        
        this.updateDigitalTime(digitalClock);
        this.digitalInterval = setInterval(() => this.updateDigitalTime(digitalClock), 1000);
        
        return digitalClock;
    }
    
    createAnalogClock() {
        const analogClock = document.createElement('div');
        analogClock.className = 'analog-clock';
        analogClock.innerHTML = `
            <div class="clock-face">
                <div class="clock-center"></div>
                <div class="hour-hand" id="hourHand"></div>
                <div class="minute-hand" id="minuteHand"></div>
                <div class="second-hand" id="secondHand"></div>
                ${this.createClockNumbers()}
                ${this.createClockMarks()}
            </div>
            <div class="analog-time-display" id="analogTimeDisplay"></div>
            <div class="analog-date-display" id="analogDateDisplay"></div>
        `;
        
        this.updateAnalogTime(analogClock);
        this.analogInterval = setInterval(() => this.updateAnalogTime(analogClock), 1000);
        
        return analogClock;
    }
    
    createClockNumbers() {
        let numbers = '';
        for (let i = 1; i <= 12; i++) {
            const angle = (i * 30) - 90;
            numbers += `<div class="clock-number" style="transform: rotate(${angle}deg) translate(0, -85px) rotate(-${angle}deg)">${i}</div>`;
        }
        return numbers;
    }
    
    createClockMarks() {
        let marks = '';
        for (let i = 0; i < 60; i++) {
            const angle = i * 6;
            const isHour = i % 5 === 0;
            marks += `<div class="clock-mark ${isHour ? 'hour-mark' : 'minute-mark'}" style="transform: rotate(${angle}deg)"></div>`;
        }
        return marks;
    }
    
    updateDigitalTime(clockElement) {
        const now = new Date();
        const timeEl = clockElement.querySelector('#digitalTime');
        const dateEl = clockElement.querySelector('#digitalDate');
        const timezoneEl = clockElement.querySelector('#timezoneDisplay');
        
        // Convert to selected timezone
        const timeInTimezone = new Date(now.toLocaleString("en-US", {timeZone: this.timezone}));
        
        const timeOptions = { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: this.showSeconds ? '2-digit' : undefined,
            hour12: !this.is24Hour,
            timeZone: this.timezone
        };
        const dateOptions = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            weekday: 'long',
            timeZone: this.timezone
        };
        
        timeEl.textContent = new Intl.DateTimeFormat(this.language, timeOptions).format(now);
        dateEl.textContent = new Intl.DateTimeFormat(this.language, dateOptions).format(now);
        timezoneEl.textContent = this.timezone.replace('_', ' ');
        
        this.checkAlarms(timeInTimezone);
    }
    
    updateAnalogTime(clockElement) {
        const now = new Date();
        const timeInTimezone = new Date(now.toLocaleString("en-US", {timeZone: this.timezone}));
        
        const hours = timeInTimezone.getHours() % 12;
        const minutes = timeInTimezone.getMinutes();
        const seconds = timeInTimezone.getSeconds();
        
        const hourAngle = (hours * 30) + (minutes * 0.5);
        const minuteAngle = minutes * 6;
        const secondAngle = seconds * 6;
        
        const hourHand = clockElement.querySelector('#hourHand');
        const minuteHand = clockElement.querySelector('#minuteHand');
        const secondHand = clockElement.querySelector('#secondHand');
        
        hourHand.style.transform = `rotate(${hourAngle}deg)`;
        minuteHand.style.transform = `rotate(${minuteAngle}deg)`;
        if (this.showSeconds) {
            secondHand.style.transform = `rotate(${secondAngle}deg)`;
            secondHand.style.display = 'block';
        } else {
            secondHand.style.display = 'none';
        }
        
        // Update digital display for analog clock
        const timeEl = clockElement.querySelector('#analogTimeDisplay');
        const dateEl = clockElement.querySelector('#analogDateDisplay');
        
        const timeOptions = { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: !this.is24Hour,
            timeZone: this.timezone
        };
        const dateOptions = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            timeZone: this.timezone
        };
        
        timeEl.textContent = new Intl.DateTimeFormat(this.language, timeOptions).format(now);
        dateEl.textContent = new Intl.DateTimeFormat(this.language, dateOptions).format(now);
        
        this.checkAlarms(timeInTimezone);
    }
    
    applyTheme() {
        this.container.className = `enhanced-clock-container theme-${this.theme}`;
    }
    
    setupEventListeners() {
        const panelToggle = this.container.querySelector('#panelToggle');
        const panelContent = this.container.querySelector('#panelContent');
        
        panelToggle.addEventListener('click', () => {
            panelContent.classList.toggle('collapsed');
        });
        
        // Clock mode change
        this.container.querySelector('#clockModeSelect').addEventListener('change', (e) => {
            this.clockMode = e.target.value;
            this.createClock();
            this.saveSettings();
        });
        
        // Theme change
        this.container.querySelector('#themeSelect').addEventListener('change', (e) => {
            this.theme = e.target.value;
            this.applyTheme();
            this.saveSettings();
        });
        
        // Timezone change
        this.container.querySelector('#timezoneSelect').addEventListener('change', (e) => {
            this.timezone = e.target.value;
            this.saveSettings();
        });
        
        // Format toggles
        this.container.querySelector('#format24Hour').addEventListener('change', (e) => {
            this.is24Hour = e.target.checked;
            this.saveSettings();
        });
        
        this.container.querySelector('#showSecondsCheck').addEventListener('change', (e) => {
            this.showSeconds = e.target.checked;
            this.saveSettings();
        });
        
        this.container.querySelector('#soundEnabledCheck').addEventListener('change', (e) => {
            this.soundEnabled = e.target.checked;
            this.saveSettings();
        });
        
        // Fullscreen
        this.container.querySelector('#fullscreenBtn').addEventListener('click', () => {
            this.toggleFullscreen();
        });
        
        // Stopwatch controls
        this.container.querySelector('#stopwatchStart').addEventListener('click', () => {
            this.startStopwatch();
        });
        
        this.container.querySelector('#stopwatchPause').addEventListener('click', () => {
            this.pauseStopwatch();
        });
        
        this.container.querySelector('#stopwatchReset').addEventListener('click', () => {
            this.resetStopwatch();
        });
        
        // Countdown controls
        this.container.querySelector('#countdownStart').addEventListener('click', () => {
            this.startCountdown();
        });
        
        this.container.querySelector('#countdownPause').addEventListener('click', () => {
            this.pauseCountdown();
        });
        
        this.container.querySelector('#countdownReset').addEventListener('click', () => {
            this.resetCountdown();
        });
        
        // Alarm controls
        this.container.querySelector('#addAlarm').addEventListener('click', () => {
            this.addAlarm();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'f':
                        e.preventDefault();
                        this.toggleFullscreen();
                        break;
                    case 'm':
                        e.preventDefault();
                        this.clockMode = this.clockMode === 'digital' ? 'analog' : 'digital';
                        this.container.querySelector('#clockModeSelect').value = this.clockMode;
                        this.createClock();
                        break;
                    case 't':
                        e.preventDefault();
                        const themes = ['light', 'dark', 'neon'];
                        const currentIndex = themes.indexOf(this.theme);
                        this.theme = themes[(currentIndex + 1) % themes.length];
                        this.container.querySelector('#themeSelect').value = this.theme;
                        this.applyTheme();
                        break;
                }
            }
        });
    }
    
    // Stopwatch methods
    startStopwatch() {
        if (!this.stopwatchRunning) {
            this.stopwatchRunning = true;
            const startTime = Date.now() - this.stopwatchTime;
            this.stopwatchInterval = setInterval(() => {
                this.stopwatchTime = Date.now() - startTime;
                this.updateStopwatchDisplay();
            }, 10);
        }
    }
    
    pauseStopwatch() {
        this.stopwatchRunning = false;
        if (this.stopwatchInterval) {
            clearInterval(this.stopwatchInterval);
        }
    }
    
    resetStopwatch() {
        this.pauseStopwatch();
        this.stopwatchTime = 0;
        this.updateStopwatchDisplay();
    }
    
    updateStopwatchDisplay() {
        const display = this.container.querySelector('#stopwatchDisplay');
        const totalSeconds = Math.floor(this.stopwatchTime / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const milliseconds = Math.floor((this.stopwatchTime % 1000) / 10);
        
        display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;
    }
    
    // Countdown methods
    startCountdown() {
        const minutes = parseInt(this.container.querySelector('#countdownMinutes').value) || 0;
        const seconds = parseInt(this.container.querySelector('#countdownSeconds').value) || 0;
        
        if (!this.countdownRunning && (minutes > 0 || seconds > 0)) {
            if (this.countdownTime === 0) {
                this.countdownTime = (minutes * 60 + seconds) * 1000;
            }
            
            this.countdownRunning = true;
            const startTime = Date.now();
            const initialTime = this.countdownTime;
            
            this.countdownInterval = setInterval(() => {
                const elapsed = Date.now() - startTime;
                this.countdownTime = Math.max(0, initialTime - elapsed);
                this.updateCountdownDisplay();
                
                if (this.countdownTime === 0) {
                    this.pauseCountdown();
                    this.playAlarmSound();
                    alert('倒计时结束！');
                }
            }, 100);
        }
    }
    
    pauseCountdown() {
        this.countdownRunning = false;
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
    }
    
    resetCountdown() {
        this.pauseCountdown();
        this.countdownTime = 0;
        this.updateCountdownDisplay();
    }
    
    updateCountdownDisplay() {
        const display = this.container.querySelector('#countdownDisplay');
        const totalSeconds = Math.ceil(this.countdownTime / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        
        display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // Alarm methods
    addAlarm() {
        const timeInput = this.container.querySelector('#alarmTime');
        const time = timeInput.value;
        
        if (time) {
            const alarm = {
                id: Date.now(),
                time: time,
                enabled: true
            };
            
            this.alarms.push(alarm);
            this.updateAlarmList();
            this.saveSettings();
            timeInput.value = '';
        }
    }
    
    removeAlarm(id) {
        this.alarms = this.alarms.filter(alarm => alarm.id !== id);
        this.updateAlarmList();
        this.saveSettings();
    }
    
    toggleAlarm(id) {
        const alarm = this.alarms.find(alarm => alarm.id === id);
        if (alarm) {
            alarm.enabled = !alarm.enabled;
            this.updateAlarmList();
            this.saveSettings();
        }
    }
    
    updateAlarmList() {
        const alarmList = this.container.querySelector('#alarmList');
        alarmList.innerHTML = '';
        
        this.alarms.forEach(alarm => {
            const alarmItem = document.createElement('div');
            alarmItem.className = 'alarm-item';
            alarmItem.innerHTML = `
                <span class="alarm-time ${alarm.enabled ? 'enabled' : 'disabled'}">${alarm.time}</span>
                <div class="alarm-controls">
                    <button onclick="enhancedClock.toggleAlarm(${alarm.id})">${alarm.enabled ? '关闭' : '开启'}</button>
                    <button onclick="enhancedClock.removeAlarm(${alarm.id})">删除</button>
                </div>
            `;
            alarmList.appendChild(alarmItem);
        });
    }
    
    checkAlarms(currentTime) {
        const currentTimeString = currentTime.toTimeString().substr(0, 5);
        
        this.alarms.forEach(alarm => {
            if (alarm.enabled && alarm.time === currentTimeString) {
                this.playAlarmSound();
                alert(`闹钟响了！时间：${alarm.time}`);
                // Disable the alarm after it rings
                alarm.enabled = false;
                this.updateAlarmList();
                this.saveSettings();
            }
        });
    }
    
    playAlarmSound() {
        if (this.soundEnabled) {
            // Create a simple beep sound using Web Audio API
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 1);
        }
    }
    
    toggleFullscreen() {
        if (!this.isFullscreen) {
            if (this.container.requestFullscreen) {
                this.container.requestFullscreen();
            } else if (this.container.webkitRequestFullscreen) {
                this.container.webkitRequestFullscreen();
            } else if (this.container.msRequestFullscreen) {
                this.container.msRequestFullscreen();
            }
            this.isFullscreen = true;
            this.container.classList.add('fullscreen');
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            this.isFullscreen = false;
            this.container.classList.remove('fullscreen');
        }
    }
    
    saveSettings() {
        const settings = {
            language: this.language,
            clockMode: this.clockMode,
            theme: this.theme,
            timezone: this.timezone,
            is24Hour: this.is24Hour,
            showSeconds: this.showSeconds,
            soundEnabled: this.soundEnabled,
            alarms: this.alarms
        };
        
        localStorage.setItem('enhancedClockSettings', JSON.stringify(settings));
    }
    
    loadSettings() {
        const saved = localStorage.getItem('enhancedClockSettings');
        if (saved) {
            const settings = JSON.parse(saved);
            
            this.language = settings.language || this.language;
            this.clockMode = settings.clockMode || this.clockMode;
            this.theme = settings.theme || this.theme;
            this.timezone = settings.timezone || this.timezone;
            this.is24Hour = settings.is24Hour !== undefined ? settings.is24Hour : this.is24Hour;
            this.showSeconds = settings.showSeconds !== undefined ? settings.showSeconds : this.showSeconds;
            this.soundEnabled = settings.soundEnabled !== undefined ? settings.soundEnabled : this.soundEnabled;
            this.alarms = settings.alarms || [];
            
            // Update UI controls
            this.container.querySelector('#clockModeSelect').value = this.clockMode;
            this.container.querySelector('#themeSelect').value = this.theme;
            this.container.querySelector('#timezoneSelect').value = this.timezone;
            this.container.querySelector('#format24Hour').checked = this.is24Hour;
            this.container.querySelector('#showSecondsCheck').checked = this.showSeconds;
            this.container.querySelector('#soundEnabledCheck').checked = this.soundEnabled;
            
            this.updateAlarmList();
            this.applyTheme();
        }
    }
    
    destroy() {
        if (this.digitalInterval) clearInterval(this.digitalInterval);
        if (this.analogInterval) clearInterval(this.analogInterval);
        if (this.stopwatchInterval) clearInterval(this.stopwatchInterval);
        if (this.countdownInterval) clearInterval(this.countdownInterval);
    }
}

// Global instance
let enhancedClock;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const userLanguage = navigator.language || 'en-US';
    enhancedClock = new EnhancedClock(userLanguage);
    
    // Insert the clock into the page
    const clockContainer = document.createElement('div');
    clockContainer.style.textAlign = 'center';
    clockContainer.appendChild(enhancedClock.container);
    
    document.body.insertBefore(clockContainer, document.body.firstChild);
});

// Handle language changes from external i18n system
document.addEventListener('i18nLanguageChanged', (e) => {
    if (enhancedClock) {
        enhancedClock.language = e.detail.locale;
        enhancedClock.saveSettings();
    }
});

