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

// 工作人员数据，固定为李楠
const staffMembers = [
    { id: 1, name: '李楠' }
];

// 时间段数据，仅保留 14:00 - 21:00
const timeSlots = [
    { id: 1, time: '14:00 - 21:00' }
];

// 获取当前日期
function getCurrentDate() {
    const now = new Date();
    return now.toISOString().split('T')[0];
}

// 获取近两周的日期数组
function getRecentTwoWeeksDates() {
    const dates = [];
    const now = new Date();
    for (let i = 0; i < 14; i++) {
        const date = new Date(now);
        date.setDate(now.getDate() + i);
        dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
}

// 获取一周的星期名称数组
function getWeekDays() {
    return ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天'];
}

// 初始化任务表格
async function initScheduleTable(selectedDates) {
    const table = document.getElementById('scheduleTable');
    table.innerHTML = '';

    try {
        const snapshot = await database.ref('tasks').once('value');
        const tasks = snapshot.val() || {};

        // 遍历近两周的日期
        selectedDates.forEach(selectedDate => {
            const dateDiv = document.createElement('div');
            // 显示日期和星期几
            const dateObj = new Date(selectedDate);
            const weekday = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][dateObj.getDay()];
            dateDiv.textContent = `${selectedDate} (${weekday})`;
            table.appendChild(dateDiv);

            staffMembers.forEach(staff => {
                const staffDiv = document.createElement('div');
                staffDiv.className = 'room';

                const staffTitle = document.createElement('div');
                staffTitle.className = 'room-title';
                staffTitle.textContent = staff.name;
                staffDiv.appendChild(staffTitle);

                const slotsContainer = document.createElement('div');
                slotsContainer.className = 'slots-container';

                timeSlots.forEach(slot => {
                    const slotDiv = document.createElement('div');
                    slotDiv.className = 'time-slot';

                    const button = document.createElement('button');
                    const key = `${selectedDate}-${staff.id}-${slot.id}`;
                    const taskData = tasks[key];
                    const isBooked = !!taskData;

                    button.className = `booking-button ${isBooked ? 'booked' : ''}`;
                    // 在按钮上显示日期和时间段
                    button.textContent = `${selectedDate} ${slot.time}`;
                    button.onclick = () => toggleTask(selectedDate, staff.id, slot.id, button);

                    if (staff.name.includes('不可预约')) {
                        button.disabled = true;
                        button.classList.add('disabled');
                    }

                    slotDiv.appendChild(button);

                    if (isBooked && taskData.taskName) {
                        const taskNameDiv = document.createElement('div');
                        taskNameDiv.className = 'task-name';
                        taskNameDiv.textContent = taskData.taskName;
                        slotDiv.appendChild(taskNameDiv);
                    }

                    slotsContainer.appendChild(slotDiv);
                });

                staffDiv.appendChild(slotsContainer);
                table.appendChild(staffDiv);
            });
        });

    } catch (error) {
        console.error('加载失败:', error);
        alert('数据加载失败，请检查网络连接！');
    }
}

// 切换任务状态
async function toggleTask(selectedDate, staffId, slotId, button) {
    const key = `${selectedDate}-${staffId}-${slotId}`;

    try {
        const snapshot = await database.ref(`tasks/${key}`).once('value');
        const taskData = snapshot.val();
        const isBooked = !!taskData;

        if (isBooked) {
            await database.ref(`tasks/${key}`).remove();
            button.classList.remove('booked');
            const taskNameDiv = button.nextElementSibling;
            if (taskNameDiv?.classList.contains('task-name')) {
                taskNameDiv.remove();
            }
        } else {
            const taskName = prompt('请输入任务名称：');
            if (taskName) {
                await database.ref(`tasks/${key}`).set({
                    booked: true,
                    taskName: taskName
                });
                button.classList.add('booked');

                const taskNameDiv = document.createElement('div');
                taskNameDiv.className = 'task-name';
                taskNameDiv.textContent = taskName;
                button.parentNode.insertBefore(taskNameDiv, button.nextSibling);
            }
        }
    } catch (error) {
        console.error('操作失败:', error);
        alert('操作失败，请稍后重试！');
    }
}

// 初始化日期选择器（这里可以选择是否保留，因为默认展示近两周数据）
function initDatePicker() {
    const datePicker = document.createElement('input');
    datePicker.type = 'date';
    datePicker.value = getCurrentDate();
    datePicker.onchange = (e) => initScheduleTable([e.target.value]);

    const container = document.getElementById('datePickerContainer');
    container.innerHTML = '';
    container.appendChild(datePicker);
}

// 页面初始化
document.addEventListener('DOMContentLoaded', () => {
    // initDatePicker(); // 如果不需要日期选择器，可以注释掉这一行
    const recentDates = getRecentTwoWeeksDates();
    initScheduleTable(recentDates);
});
