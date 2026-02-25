// 粒子特效（花瓣效果）
class Particle {
    constructor() {
        this.x = Math.random() * window.innerWidth;
        this.y = -10;
        this.size = Math.random() * 10 + 5;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 3 + 1;
        this.color = this.getRandomColor();
        this.opacity = Math.random() * 0.8 + 0.2;
    }
    
    getRandomColor() {
        const colors = ['#ff9ff3', '#feca57', '#ff6b6b', '#48dbfb', '#1dd1a1'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.y > window.innerHeight) {
            this.y = -10;
            this.x = Math.random() * window.innerWidth;
        }
    }
    
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function initParticles() {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.getElementById('particle-container').appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    const particles = [];
    
    for (let i = 0; i < 60; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw(ctx);
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // 响应窗口大小变化
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// 打字效果函数
function typeWriter(text, elementId, speed = 50) {
    return new Promise((resolve) => {
        const element = document.getElementById(elementId);
        let i = 0;
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                resolve();
            }
        }
        
        element.textContent = ''; // 清空内容
        type();
    });
}

// 加载每日一言（使用API）
function loadDailyQuote(elementId, authorId, withTypeEffect = false) {
    console.log('正在从API加载每日一言...');
    return fetch('https://v1.hitokoto.cn/')
        .then(response => response.json())
        .then(data => {
            console.log('每日一言API返回数据:', data);
            
            if (withTypeEffect) {
                // 先显示引用内容的打字效果
                return typeWriter(data.hitokoto, elementId).then(() => {
                    // 然后显示作者
                    document.getElementById(authorId).textContent = data.from ? `—— ${data.from}` : '';
                    return data;
                });
            } else {
                // 直接显示内容
                document.getElementById(elementId).textContent = data.hitokoto;
                document.getElementById(authorId).textContent = data.from ? `—— ${data.from}` : '';
                return data;
            }
        })
        .catch(error => {
            console.error('加载每日一言失败:', error);
            const defaultQuote = '生活不是缺少美，而是缺少发现美的眼睛';
            const defaultAuthor = '罗丹';
            
            if (withTypeEffect) {
                return typeWriter(defaultQuote, elementId).then(() => {
                    document.getElementById(authorId).textContent = `—— ${defaultAuthor}`;
                    return { hitokoto: defaultQuote, from: defaultAuthor };
                });
            } else {
                document.getElementById(elementId).textContent = defaultQuote;
                document.getElementById(authorId).textContent = `—— ${defaultAuthor}`;
                return { hitokoto: defaultQuote, from: defaultAuthor };
            }
        });
}

// 为背景壁纸添加随机参数，确保每次加载不同图片
function refreshBackground() {
    const imgElement = document.getElementById('background-wallpaper');
    // 使用dmoe.cc动漫图片API，通过时间戳确保每次获取不同图片
    console.log('正在刷新背景图片...');
    imgElement.src = `https://www.dmoe.cc/random.php?t=${Date.now()}`;
}

// 页面加载完成后执行
window.addEventListener('DOMContentLoaded', () => {
    console.log('页面DOM加载完成，开始初始化...');
    
    // 第一步：加载每日一言（加载页面，使用打字效果）
    loadDailyQuote('loading-quote', 'loading-author', true).then(() => {
        console.log('每日一言打字效果完成，准备进入主页面...');
        
        // 第二步：延迟1秒后进入主页面（打字完成后稍作停留）
        setTimeout(() => {
            console.log('正在进入主页面...');
            
            // 隐藏加载页面
            const loadingScreen = document.getElementById('loading-screen');
            loadingScreen.style.opacity = '0';
            loadingScreen.style.visibility = 'hidden';
            
            // 显示主页面
            const mainPage = document.getElementById('main-page');
            mainPage.style.display = 'flex';
            
            // 第三步：初始化主页面内容
            initParticles();
            loadDailyQuote('quote-content', 'quote-author');
            refreshBackground();
            
            // 第四步：设置定时任务
            // 每30秒刷新一次背景图片
            setInterval(refreshBackground, 30000);
            
            // 每60秒刷新一次每日一言
            setInterval(() => {
                loadDailyQuote('quote-content', 'quote-author');
            }, 60000);
            
            // 初始化模块内容
            initModules();
            
        }, 1000);
    });
});

// 初始化模块内容
function initModules() {
    console.log('正在初始化模块内容...');
    
    // 模块数据
    const modules = {
        about: {
            title: '关于我',
            content: '你好！我是一个热爱编程和技术的人。\n\n我喜欢探索新的技术领域，不断学习和成长。\n\n在我的个人主页上，你可以了解我的技术栈和兴趣爱好。\n\n欢迎访问我的个人主页！'
        },
        tech: {
            title: '技术栈',
            content: '前端技术：HTML5、CSS3、JavaScript、React\n\n后端技术：Node.js、Express、Python、Java\n\n数据库：MySQL、MongoDB\n\n其他：Git、Docker、Linux'
        },
        hobby: {
            title: '兴趣爱好',
            content: '编程：喜欢编写代码，解决问题\n\n阅读：喜欢阅读技术书籍和文章\n\n音乐：喜欢听各种类型的音乐\n\n运动：喜欢跑步和游泳\n\n旅行：喜欢去不同的地方旅行，了解不同的文化'
        }
    };
    
    // 创建模块元素
    const moduleContent = document.getElementById('module-content');
    
    // 为每个模块创建元素
    Object.keys(modules).forEach(moduleId => {
        const module = modules[moduleId];
        const moduleElement = document.createElement('div');
        moduleElement.className = `module ${moduleId === 'about' ? 'active' : ''}`;
        moduleElement.id = `module-${moduleId}`;
        
        const titleElement = document.createElement('h3');
        titleElement.textContent = module.title;
        titleElement.style.color = '#34495e';
        titleElement.style.marginBottom = '20px';
        
        const contentElement = document.createElement('p');
        contentElement.textContent = module.content;
        contentElement.style.whiteSpace = 'pre-wrap';
        
        moduleElement.appendChild(titleElement);
        moduleElement.appendChild(contentElement);
        moduleContent.appendChild(moduleElement);
    });
    
    // 添加模块切换事件
    const moduleButtons = document.querySelectorAll('.module-btn');
    moduleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const moduleId = button.getAttribute('data-module');
            
            // 更新按钮状态
            moduleButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // 更新模块显示
            const modulesElements = document.querySelectorAll('.module');
            modulesElements.forEach(moduleElement => {
                moduleElement.classList.remove('active');
            });
            
            const activeModule = document.getElementById(`module-${moduleId}`);
            if (activeModule) {
                activeModule.classList.add('active');
            }
        });
    });
    
    console.log('模块内容初始化完成！');
    
    // 初始化模块指示器
    initModuleIndicator();
}

// 初始化模块指示器
function initModuleIndicator() {
    console.log('正在初始化模块指示器...');
    
    const indicator = document.querySelector('.module-indicator');
    const buttons = document.querySelectorAll('.module-btn');
    
    if (!indicator || !buttons.length) {
        console.warn('模块指示器或按钮不存在');
        return;
    }
    
    // 更新指示器位置的函数
    function updateIndicatorPosition(element) {
        const rect = element.getBoundingClientRect();
        const navRect = element.parentElement.getBoundingClientRect();
        const top = rect.top - navRect.top + element.parentElement.scrollTop;
        
        indicator.style.top = `${top}px`;
        indicator.style.height = `${rect.height}px`;
    }
    
    // 为每个按钮添加事件
    buttons.forEach(button => {
        // 鼠标悬停事件
        button.addEventListener('mouseenter', () => {
            // 移除所有按钮的active和hover类
            buttons.forEach(btn => {
                btn.classList.remove('active');
                btn.classList.remove('hover');
            });
            // 添加当前按钮的hover效果
            button.classList.add('hover');
            // 更新指示器位置
            updateIndicatorPosition(button);
        });
        
        // 点击事件
        button.addEventListener('click', () => {
            // 移除所有按钮的active和hover类
            buttons.forEach(btn => {
                btn.classList.remove('active');
                btn.classList.remove('hover');
            });
            // 添加当前按钮的active类
            button.classList.add('active');
            // 更新指示器位置
            updateIndicatorPosition(button);
        });
    });
    
    // 为模块导航添加鼠标离开事件
    const nav = document.querySelector('.module-nav');
    if (nav) {
        nav.addEventListener('mouseleave', () => {
            // 不移除hover类，保持最后一个悬停的按钮的状态
            // 这样鼠标离开后，最后停留的按钮仍然保持背景颜色
        });
    }
    
    // 初始化默认位置
    const activeButton = document.querySelector('.module-btn.active');
    if (activeButton) {
        updateIndicatorPosition(activeButton);
    }
    
    console.log('模块指示器初始化完成！');
    
    // 初始化节日祝福语
    initHolidayGreeting();
}

// 初始化节日祝福语
function initHolidayGreeting() {
    console.log('正在初始化节日祝福语...');
    
    const today = new Date();
    const month = today.getMonth() + 1; // 月份从0开始，所以+1
    const day = today.getDate();
    
    // 定义节日祝福语
    let greeting = "";
    let showLanterns = false;
    
    // 根据日期设置不同的祝福语和是否显示灯笼
    if (month === 1 && day === 1) {
        // 元旦
        greeting = "元旦快乐";
        showLanterns = true;
    } else if (month === 1 && day >= 20 && day <= 31) {
        // 春节期间（假设在1月20日到1月31日之间）
        greeting = "春节快乐";
        showLanterns = true;
    } else if (month === 2 && day <= 15) {
        // 春节期间（假设在2月1日到2月15日之间）
        greeting = "春节快乐";
        showLanterns = true;
    } else if (month === 5 && day === 1) {
        // 劳动节
        greeting = "劳动快乐";
        showLanterns = true;
    } else if (month === 10 && day === 1) {
        // 国庆节
        greeting = "国庆快乐";
        showLanterns = true;
    } else if (month === 12 && day === 25) {
        // 圣诞节
        greeting = "圣诞快乐";
        showLanterns = true;
    }
    
    // 控制灯笼的显示和隐藏
    const lanternContainers = document.querySelectorAll('.deng-box, .deng-box1, .deng-box2, .deng-box3');
    lanternContainers.forEach(container => {
        if (showLanterns) {
            container.style.display = 'block';
        } else {
            container.style.display = 'none';
        }
    });
    
    // 显示祝福语到灯笼
    if (showLanterns && greeting) {
        const lanterns = ['lantern-1', 'lantern-2', 'lantern-3', 'lantern-4'];
        for (let i = 0; i < greeting.length && i < lanterns.length; i++) {
            const lantern = document.getElementById(lanterns[i]);
            if (lantern) {
                lantern.textContent = greeting[i];
            }
        }
    }
    
    console.log('节日祝福语初始化完成！当前祝福语：', greeting, '是否显示灯笼：', showLanterns);
}