// Firebase 配置
const firebaseConfig = {
    apiKey: "AIzaSyAvBleFpF0ACQP5ZdITblyTAXZwY_NsMEg",
    authDomain: "book-3a213.firebaseapp.com",
    databaseURL: "https://book-3a213-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "book-3a213",
    storageBucket: "book-3a213.firebasestorage.app",
    messagingSenderId: "567622663755",
    appId: "1:567622663755:web:ada5084a44ea8a140d97ce",
    measurementId: "G-FJCH2G02M3"
};

// 初始化 Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// 获取近半月的日期数组
function getHalfMonthDates() {
    const dates = [];
    const now = new Date();
    for (let i = 0; i < 15; i++) {
        const date = new Date(now);
        date.setDate(now.getDate() + i);
        dates.push(date);
    }
    return dates;
}

// 初始化日历
function initCalendar() {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';

    const dates = getHalfMonthDates();
    dates.forEach(date => {
        const cell = document.createElement('div');
        cell.className = 'date-cell';
        cell.textContent = date.getDate();
        cell.dataset.date = date.toISOString().split('T')[0];
        calendar.appendChild(cell);
    });

    // 添加点击事件
    const cells = document.querySelectorAll('.date-cell');
    cells.forEach(cell => {
        cell.addEventListener('click', () => {
            cells.forEach(c => c.classList.remove('active'));
            cell.classList.add('active');
            const selectedDate = cell.dataset.date;
            initScheduleTable([selectedDate]);
        });
    });
}

// 初始化任务表格
function initScheduleTable(selectedDates) {
    const table = document.getElementById('scheduleTable');
    table.innerHTML = '';

    selectedDates.forEach(selectedDate => {
        const scheduleDiv = document.createElement('div');
        scheduleDiv.className = 'schedule';

        const scheduleTitle = document.createElement('div');
        scheduleTitle.className = 'schedule-title';
        scheduleTitle.textContent = selectedDate;
        scheduleDiv.appendChild(scheduleTitle);

        const slotsContainer = document.createElement('div');
        slotsContainer.className = 'slots-container';

        const timeSlots = [
            { id: 1, time: '10:00 - 12:00' },
            { id: 2, time: '12:00 - 14:00' },
            { id: 3, time: '14:00 - 16:00' },
            { id: 4, time: '16:00 - 18:00' },
            { id: 5, time: '18:00 - 20:00' },
            { id: 6, time: '20:00 - 22:00' }
        ];

        timeSlots.forEach(slot => {
            const slotDiv = document.createElement('div');
            slotDiv.className = 'time-slot';

            const button = document.createElement('button');
            button.className = 'booking-button';
            button.textContent = slot.time;
            button.addEventListener('click', () => toggleTask(selectedDate, slot.id, button));

            slotDiv.appendChild(button);
            slotsContainer.appendChild(slotDiv);
        });

        scheduleDiv.appendChild(slotsContainer);
        table.appendChild(scheduleDiv);
    });
}

// 切换任务状态
function toggleTask(selectedDate, slotId, button) {
    const key = `${selectedDate}-${slotId}`;
    const isBooked = button.classList.contains('booked');

    if (isBooked) {
        // 取消预约
        button.classList.remove('booked');
        const taskNameDiv = button.nextElementSibling;
        if (taskNameDiv?.classList.contains('task-name')) {
            taskNameDiv.remove();
        }
    } else {
        // 预约
        const taskName = prompt('请输入预约信息：');
        if (taskName) {
            button.classList.add('booked');

            const taskNameDiv = document.createElement('div');
            taskNameDiv.className = 'task-name';
            taskNameDiv.textContent = taskName;
            button.parentNode.insertBefore(taskNameDiv, button.nextSibling);
        }
    }
}

// 页面初始化
document.addEventListener('DOMContentLoaded', () => {
    initCalendar();
    const today = new Date().toISOString().split('T')[0];
    initScheduleTable([today]);
});
