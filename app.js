/**
 * Life Quest - Main Application Logic
 * Structure:
 * 1. Constants & Config
 * 2. State & Data Layer
 * 3. Translation System
 * 4. Theme System
 * 5. Gamification Engine
 * 6. Task System
 * 7. Money System
 * 8. UI Controller
 * 9. Init
 */

/* ===========================
   1. Constants & Config
   =========================== */
const CONFIG = {
    LEVEL_BASE_XP: 100,
    LEVEL_MULTIPLIER: 1.5,
    STORAGE_KEY: 'life_quest_data_v1',
    DEFAULT_LANG: 'en',
    DEFAULT_THEME: 'light'
};

const TRANSLATIONS = {
    en: {
        app_title: "Life Quest",
        nav_home: "Home",
        nav_tasks: "Tasks",
        nav_money: "Money",
        nav_settings: "Settings",
        lvl: "Lvl",
        xp: "XP",
        streak_days: "days streak",
        task_add: "Add Task",
        task_title: "Task Title",
        difficulty: "Difficulty",
        easy: "Easy (+10 XP)",
        medium: "Medium (+20 XP)",
        hard: "Hard (+50 XP)",
        repeat: "Repeat",
        none: "None",
        daily: "Daily",
        weekly: "Weekly",
        save: "Save",
        cancel: "Cancel",
        delete: "Delete",
        confirm_delete: "Are you sure?",
        money_balance: "Balance",
        money_saved: "Savings",
        add_transaction: "Add Transaction",
        type: "Type",
        expense: "Expense",
        income: "Income/Save",
        amount: "Amount",
        desc: "Description",
        recent_activity: "Recent Activity",
        achievements: "Achievements",
        settings_theme: "Theme",
        settings_lang: "Language",
        dark: "Dark",
        light: "Light",
        reset_data: "Reset All Data",
        reset_confirm: "This will delete everything. Start over?",
        toast_xp: "+{xp} XP!",
        toast_levelup: "Level Up! You are now Level {level}!",
        achievement_unlocked: "Achievement Unlocked: {title}",
        streak_msg: "Day {days} Streak!",
        no_tasks: "No tasks yet.",
        no_trans: "No transactions yet."
    },
    ar: {
        app_title: "رحلة الحياة",
        nav_home: "الرئيسية",
        nav_tasks: "المهام",
        nav_money: "المالية",
        nav_settings: "الإعدادات",
        lvl: "مستوى",
        xp: "خبرة",
        streak_days: "أيام متتالية",
        task_add: "أضف مهمة",
        task_title: "عنوان المهمة",
        difficulty: "الصعوبة",
        easy: "سهل (+10 XP)",
        medium: "متوسط (+20 XP)",
        hard: "صعب (+50 XP)",
        repeat: "تكرار",
        none: "لا يوجد",
        daily: "يومي",
        weekly: "أسبوعي",
        save: "حفظ",
        cancel: "إلغاء",
        delete: "حذف",
        confirm_delete: "هل أنت متأكد؟",
        money_balance: "الرصيد",
        money_saved: "المدخرات",
        add_transaction: "أضف معاملة",
        type: "النوع",
        expense: "مصروف",
        income: "دخل/توفير",
        amount: "المبلغ",
        desc: "الوصف",
        recent_activity: "النشاط الأخير",
        achievements: "الإنجازات",
        settings_theme: "المظهر",
        settings_lang: "اللغة",
        dark: "داكن",
        light: "فاتح",
        reset_data: "إعادة تعيين البيانات",
        reset_confirm: "سيتم حذف كل شيء. هل أنت متأكد؟",
        toast_xp: "+{xp} خبرة!",
        toast_levelup: "مستوى جديد! أنت الآن مستوى {level}!",
        achievement_unlocked: "إنجاز جديد: {title}",
        streak_msg: "سلسلة {days} أيام!",
        no_tasks: "لا توجد مهام بعد.",
        no_trans: "لا توجد معاملات بعد."
    }
};

const ACHIEVEMENTS = [
    { id: 'first_task', icon: '🎯', title_en: 'Beginner', desc_en: 'Complete your first task', title_ar: 'مبتدئ', desc_ar: 'أكمل مهمتك الأولى' },
    { id: 'first_save', icon: '💰', title_en: 'Saver', desc_en: 'Save some money', title_ar: 'مدخر', desc_ar: 'قم بتوفير بعض المال' },
    { id: 'lvl_5', icon: '⭐', title_en: 'Rising Star', desc_en: 'Reach Level 5', title_ar: 'نجم ساطع', desc_ar: 'صل للمستوى 5' },
    { id: 'streak_3', icon: '🔥', title_en: 'On Fire', desc_en: '3 Day Streak', title_ar: 'مشتعل', desc_ar: 'سلسلة 3 أيام' }
];

/* ===========================
   2. State & Data Layer
   =========================== */
const DataManager = {
    state: {
        user: {
            level: 1,
            xp: 0,
            xpToNext: 100,
            streak: 0,
            lastLogin: new Date().toDateString()
        },
        settings: {
            theme: 'light',
            lang: 'en'
        },
        tasks: [],
        money: {
            entries: [],
            balance: 0,
            savings: 0
        },
        achievements: {} // id: boolean
    },

    init() {
        const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
        if (saved) {
            this.state = JSON.parse(saved);
        } else {
            this.save();
        }
        this.checkStreak();
    },

    save() {
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(this.state));
    },

    checkStreak() {
        const today = new Date().toDateString();
        const last = this.state.user.lastLogin;

        if (last !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            if (last === yesterday.toDateString()) {
                // Streak continues logic (handled on task completion usually, but we check here for breaks)
            } else {
                // Streak broken if gap > 1 day
                // But simplified: we update streak when they DO something, not just login.
                // Reset if missed a day? Let's be lenient: user only loses streak if they miss a whole day and login day after.
                // For simplicity: We'll increment streak upon first action of the day.
            }
            this.state.user.lastLogin = today;
            this.save();
        }
    },

    reset() {
        localStorage.removeItem(CONFIG.STORAGE_KEY);
        location.reload();
    }
};

/* ===========================
   3. Translation System
   =========================== */
const LangManager = {
    t(key, params = {}) {
        const lang = DataManager.state.settings.lang;
        let text = TRANSLATIONS[lang][key] || key;

        // Replace params {param}
        for (const [k, v] of Object.entries(params)) {
            text = text.replace(`{${k}}`, v);
        }
        return text;
    },

    setLang(lang) {
        DataManager.state.settings.lang = lang;
        DataManager.save();
        this.apply();
    },

    apply() {
        const lang = DataManager.state.settings.lang;
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.body.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr'); // Safety

        // Update all data-i18n elements
        document.querySelectorAll('[data-i18n]').forEach(el => {
            el.textContent = this.t(el.dataset.i18n);
        });

        // Re-render current view to update dynamic text
        UI.render();
    }
};

/* ===========================
   4. Theme System
   =========================== */
const ThemeManager = {
    setTheme(theme) {
        DataManager.state.settings.theme = theme;
        DataManager.save();
        this.apply();
    },

    apply() {
        const theme = DataManager.state.settings.theme;
        document.body.dataset.theme = theme;
        // Optionally update meta theme-color
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.content = theme === 'dark' ? '#1f2937' : '#4f46e5';
        }
    },

    toggle() {
        const current = DataManager.state.settings.theme;
        this.setTheme(current === 'light' ? 'dark' : 'light');
    }
};

/* ===========================
   5. Gamification Engine
   =========================== */
const GameEngine = {
    addXP(amount) {
        const user = DataManager.state.user;
        user.xp += amount;

        UI.showToast(LangManager.t('toast_xp', { xp: amount }));

        if (user.xp >= user.xpToNext) {
            this.levelUp();
        }

        DataManager.save();
        UI.updateHeader();
    },

    levelUp() {
        const user = DataManager.state.user;
        user.xp -= user.xpToNext;
        user.level++;
        user.xpToNext = Math.floor(user.xpToNext * CONFIG.LEVEL_MULTIPLIER);

        UI.showToast(LangManager.t('toast_levelup', { level: user.level }));

        this.checkAchievements('level');
        this.emitConfetti();
    },

    checkAchievements(triggerType) {
        // Simple check loop
        ACHIEVEMENTS.forEach(ach => {
            if (DataManager.state.achievements[ach.id]) return; // Already unlocked

            let unlocked = false;

            if (ach.id === 'first_task' && DataManager.state.tasks.some(t => t.completed)) unlocked = true;
            if (ach.id === 'first_save' && DataManager.state.money.entries.some(e => e.type === 'income')) unlocked = true;
            if (ach.id === 'lvl_5' && DataManager.state.user.level >= 5) unlocked = true;
            if (ach.id === 'streak_3' && DataManager.state.user.streak >= 3) unlocked = true;

            if (unlocked) {
                DataManager.state.achievements[ach.id] = true;
                const lang = DataManager.state.settings.lang;
                const title = lang === 'ar' ? ach.title_ar : ach.title_en;
                UI.showToast(LangManager.t('achievement_unlocked', { title: title }));
            }
        });
        DataManager.save();
    },

    updateStreak() {
        // Logic to increment streak if not already done today
        // For simplicity: simplified manual streak update
        // In real app, check dates strictly.
        // Assuming this is called when a key action is performed (Task complete/Money save)
        // We'll just trust lastLogin logic in DataManager for now or expand this later.
    },

    emitConfetti() {
        // Simple manual CSS confetti or just a log for now
        // To keep it 0-dep, we can create elements.
        console.log("Confetti!");
    }
};

/* ===========================
   6. Task System
   =========================== */
const TaskSystem = {
    addTask(title, difficulty, repeat) {
        const task = {
            id: Date.now(),
            title,
            difficulty,
            repeat,
            completed: false,
            createdAt: new Date().toISOString()
        };
        DataManager.state.tasks.unshift(task); // Add to top
        DataManager.save();
        UI.renderTasks();
    },

    toggleTask(id) {
        const task = DataManager.state.tasks.find(t => t.id === id);
        if (!task) return;

        if (!task.completed) {
            // Complete
            task.completed = true;

            // Calc XP
            let xp = 10;
            if (task.difficulty === 'medium') xp = 20;
            if (task.difficulty === 'hard') xp = 50;

            if (task.repeat !== 'none') {
                // Determine if we clone it for next recurrence or just uncheck it later?
                // Simplest: Create a new instance for next time? 
                // Or just keep it marked completed until reset (daily reset logic needed).
                // MVP: Just mark completed.
            }

            // Streak Logic (Increment streak if first task of day)
            // Checking if streak already incremented today logic omitted for brevity in MVP

            GameEngine.addXP(xp);
            GameEngine.checkAchievements('task');
        } else {
            // Uncomplete (Undo?)
            // We usually don't remove XP on undo to prevent cheating (spam uncheck/check)
            // But for personal app, maybe strict?
            // Let's just allow unchecking but NO XP refund to act as penalty/anti-abuse? 
            // Or just allow simple uncheck.
            task.completed = false;
        }

        DataManager.save();
        UI.renderTasks();
    },

    deleteTask(id) {
        DataManager.state.tasks = DataManager.state.tasks.filter(t => t.id !== id);
        DataManager.save();
        UI.renderTasks();
    }
};

/* ===========================
   7. Money System
   =========================== */
const MoneySystem = {
    addTransaction(type, amount, desc) {
        const cleanAmount = parseFloat(amount);
        if (isNaN(cleanAmount) || cleanAmount <= 0) return;

        const entry = {
            id: Date.now(),
            type,
            amount: cleanAmount,
            desc,
            date: new Date().toISOString()
        };

        DataManager.state.money.entries.unshift(entry);

        if (type === 'income') {
            DataManager.state.money.savings += cleanAmount;
            // Saving rewards XP!
            const xp = Math.floor(cleanAmount / 10); // 1 XP per 10 currency units saved
            if (xp > 0) GameEngine.addXP(xp);
            GameEngine.checkAchievements('money');
        } else {
            DataManager.state.money.balance -= cleanAmount; // Or however we track balance. 
            // Actually, usually expense reduces balance, income increases it.
            // Let's assume 'savings' is a separate pot.
            // Implementation: Simple Expense vs Savings tracking.
        }

        DataManager.save();
        UI.renderMoney();
    }
};

/* ===========================
   8. UI Controller
   =========================== */
const UI = {
    view: 'dashboard',

    init() {
        // Nav Listeners
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget.dataset.view;
                this.switchView(target);
            });
        });

        this.render();
        this.updateHeader();
    },

    switchView(viewName) {
        this.view = viewName;
        // Update Nav
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.getElementById(`nav-${viewName}`).classList.add('active');

        this.render();
    },

    render() {
        const content = document.getElementById('content-area');
        content.innerHTML = '';

        switch (this.view) {
            case 'dashboard':
                this.renderDashboard(content);
                break;
            case 'tasks':
                this.renderTasksView(content);
                break;
            case 'money':
                this.renderMoneyView(content);
                break;
            case 'settings':
                this.renderSettings(content);
                break;
        }
    },

    updateHeader() {
        const user = DataManager.state.user;
        document.getElementById('level-display').textContent = `${LangManager.t('lvl')} ${user.level}`;
        document.getElementById('xp-text').textContent = `${user.xp} / ${user.xpToNext} ${LangManager.t('xp')}`;
        document.getElementById('streak-count').textContent = user.streak;

        const percent = Math.min((user.xp / user.xpToNext) * 100, 100);
        document.getElementById('xp-bar').style.width = `${percent}%`;
    },

    showToast(msg) {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = msg;
        container.appendChild(toast);

        requestAnimationFrame(() => toast.classList.add('show'));

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    // --- View Renderers ---

    renderDashboard(container) {
        // Recent Achievements or Summary
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `<h2>${LangManager.t('recent_activity')}</h2>`;
        // TODO: List recent actions or stats
        // Quick Actions
        const dashHTML = `
            <div class="card">
                <h3>Welcome back!</h3>
                <p>Focus on your goals today.</p>
                <button class="btn btn-primary" style="margin-top:10px" onclick="UI.switchView('tasks')">${LangManager.t('task_add')}</button>
            </div>
            
             <div class="card">
                <h2>${LangManager.t('achievements')}</h2>
                <div id="ach-list" style="display:flex; gap:10px; flex-wrap:wrap;"></div>
            </div>
        `;

        container.innerHTML = dashHTML;

        const achList = container.querySelector('#ach-list');
        ACHIEVEMENTS.forEach(ach => {
            const unlocked = DataManager.state.achievements[ach.id];
            const div = document.createElement('div');
            div.style.opacity = unlocked ? '1' : '0.4';
            div.style.fontSize = '2rem';
            div.innerHTML = ach.icon;
            div.title = DataManager.state.settings.lang === 'ar' ? ach.title_ar : ach.title_en;
            achList.appendChild(div);
        });
    },

    renderTasksView(container) {
        const html = `
            <div class="card">
                <h2>${LangManager.t('task_add')}</h2>
                <div class="form-group">
                    <input type="text" id="task-input" class="form-control" placeholder="${LangManager.t('task_title')}">
                </div>
                <div class="form-group" style="display:flex; gap:10px;">
                    <select id="task-diff" class="form-control">
                        <option value="easy">${LangManager.t('easy')}</option>
                        <option value="medium">${LangManager.t('medium')}</option>
                        <option value="hard">${LangManager.t('hard')}</option>
                    </select>
                </div>
                 <div class="form-group">
                     <button class="btn btn-primary" id="btn-add-task">${LangManager.t('save')}</button>
                 </div>
            </div>
            <div id="task-list"></div>
        `;
        container.innerHTML = html;

        document.getElementById('btn-add-task').addEventListener('click', () => {
            const title = document.getElementById('task-input').value;
            const diff = document.getElementById('task-diff').value;
            if (title.trim()) {
                TaskSystem.addTask(title, diff, 'none');
            }
        });

        this.renderTasks();
    },

    renderTasks() {
        const list = document.getElementById('task-list');
        if (!list) return;
        list.innerHTML = '';

        // Sort: Incomplete first
        const tasks = [...DataManager.state.tasks].sort((a, b) => a.completed - b.completed);

        if (tasks.length === 0) {
            list.innerHTML = `<p style="text-align:center; color:var(--text-secondary)">${LangManager.t('no_tasks')}</p>`;
            return;
        }

        tasks.forEach(t => {
            const div = document.createElement('div');
            div.className = `task-item task-completed-${t.completed} priority-${t.difficulty}`;
            if (t.completed) div.classList.add('task-completed');

            div.innerHTML = `
                <input type="checkbox" ${t.completed ? 'checked' : ''} onchange="TaskSystem.toggleTask(${t.id})">
                <span class="task-title">${t.title}</span>
                <button onclick="TaskSystem.deleteTask(${t.id})" style="background:none; border:none; color:var(--danger-color); font-size:1.2rem;">&times;</button>
            `;
            list.appendChild(div);
        });
    },

    renderMoneyView(container) {
        const money = DataManager.state.money;

        const html = `
            <div class="money-summary">
                <div class="money-card expense">
                    <span>Exp</span>
                    <div class="money-amount">$${Math.abs(money.balance)}</div>
                </div>
                <div class="money-card income">
                    <span>${LangManager.t('money_saved')}</span>
                    <div class="money-amount">$${money.savings}</div>
                </div>
            </div>
            
            <div class="card">
                <h2>${LangManager.t('add_transaction')}</h2>
                <div class="form-group">
                     <select id="money-type" class="form-control">
                        <option value="income">${LangManager.t('income')}</option>
                        <option value="expense">${LangManager.t('expense')}</option>
                    </select>
                </div>
                 <div class="form-group">
                    <input type="number" id="money-amount" class="form-control" placeholder="${LangManager.t('amount')}">
                </div>
                <div class="form-group">
                    <input type="text" id="money-desc" class="form-control" placeholder="${LangManager.t('desc')}">
                </div>
                 <button class="btn btn-primary" id="btn-add-money">${LangManager.t('save')}</button>
            </div>
            
             <div class="card">
                <h3>${LangManager.t('recent_activity')}</h3>
                <div id="money-list"></div>
             </div>
        `;
        container.innerHTML = html;

        document.getElementById('btn-add-money').addEventListener('click', () => {
            const type = document.getElementById('money-type').value;
            const amount = document.getElementById('money-amount').value;
            const desc = document.getElementById('money-desc').value;
            if (amount) {
                MoneySystem.addTransaction(type, amount, desc);
            }
        });

        this.renderMoney();
    },

    renderMoney() {
        const list = document.getElementById('money-list');
        if (!list) return;
        list.innerHTML = '';

        const entries = DataManager.state.money.entries;
        if (entries.length === 0) {
            list.innerHTML = `<p style="text-align:center;">${LangManager.t('no_trans')}</p>`;
            return;
        }

        entries.slice(0, 10).forEach(e => {
            const div = document.createElement('div');
            div.style.padding = '10px 0';
            div.style.borderBottom = '1px solid var(--border-color)';
            div.style.display = 'flex';
            div.style.justifyContent = 'space-between';

            const color = e.type === 'income' ? 'var(--accent-color)' : 'var(--danger-color)';
            const sign = e.type === 'income' ? '+' : '-';

            div.innerHTML = `
                <div>
                    <div style="font-weight:bold">${e.desc || 'Transaction'}</div>
                    <div style="font-size:0.8rem; color:var(--text-secondary)">${new Date(e.date).toLocaleDateString()}</div>
                </div>
                <div style="color:${color}; font-weight:bold">${sign}$${e.amount}</div>
            `;
            list.appendChild(div);
        });
    },

    renderSettings(container) {
        const html = `
            <div class="card">
                <h2>${LangManager.t('settings_theme')}</h2>
                <div style="display:flex; gap:10px;">
                    <button class="btn btn-outline" onclick="ThemeManager.setTheme('light')">${LangManager.t('light')}</button>
                    <button class="btn btn-outline" style="background:#333; color:white; border-color:#333" onclick="ThemeManager.setTheme('dark')">${LangManager.t('dark')}</button>
                </div>
            </div>
            
            <div class="card">
                <h2>${LangManager.t('settings_lang')}</h2>
                 <div style="display:flex; gap:10px;">
                    <button class="btn btn-outline" onclick="LangManager.setLang('en')">English</button>
                    <button class="btn btn-outline" onclick="LangManager.setLang('ar')">العربية</button>
                </div>
            </div>
            
            <div class="card">
                <button class="btn" style="background:var(--danger-color); color:white" onclick="if(confirm('${LangManager.t('confirm_delete')}')) DataManager.reset()">${LangManager.t('reset_data')}</button>
            </div>
        `;
        container.innerHTML = html;
    }
};

/* ===========================
   9. Init
   =========================== */
document.addEventListener('DOMContentLoaded', () => {
    DataManager.init();
    LangManager.apply();
    ThemeManager.apply();
    UI.init();
});
