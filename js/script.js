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

// 生成近半月的月历
function generateCalendar() {
    const calendar = document.getElementById('calendar');
    const today = new Date();
    const days = [];
    for (let i = 0; i < 14; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        days.push(date);
    }

    const weekdayNames = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
    // 先显示星期
    weekdayNames.forEach(weekday => {
        const cell = document.createElement('div');
        cell.textContent = weekday;
        cell.style.backgroundColor = 'white';
        cell.style.cursor = 'default';
        calendar.appendChild(cell);
    });

    days.forEach(day => {
        const dayNumber = day.getDate();
        const month = day.getMonth() + 1;
        const weekday = weekdayNames[day.getDay() === 0 ? 6 : day.getDay() - 1];
        const cell = document.createElement('div');
        cell.textContent = `${month}/${dayNumber} ${weekday}`;
        cell.dataset.date = day.toISOString().split('T')[0];
        cell.addEventListener('click', () => openBookingModal(cell.dataset.date));
        calendar.appendChild(cell);
    });
}

// 打开预约模态框
const bookingModal = document.getElementById('booking-modal');
const closeModal = document.querySelector('.close');
function openBookingModal(date) {
    bookingModal.style.display = 'block';
    document.getElementById('selected-date').value = date;
}

closeModal.addEventListener('click', () => {
    bookingModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target == bookingModal) {
        bookingModal.style.display = 'none';
    }
});

// 处理预约提交
const bookingForm = document.getElementById('booking-form');
bookingForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const bookingPerson = document.getElementById('booking-person').value;
    const roomName = document.getElementById('room-name').value;
    const bookingTime = document.getElementById('booking-time').value;
    const selectedDate = document.getElementById('selected-date').value;

    const newBooking = {
        bookingPerson: bookingPerson,
        roomName: roomName,
        bookingTime: bookingTime,
        date: selectedDate
    };

    const bookingsRef = database.ref('bookings');
    bookingsRef.push(newBooking);

    bookingForm.reset();
    bookingModal.style.display = 'none';
});

// 显示预约信息
function displayBookings() {
    const bookingList = document.getElementById('booking-list');
    const bookingsRef = database.ref('bookings');
    bookingsRef.on('value', function (snapshot) {
        bookingList.innerHTML = '';
        snapshot.forEach(function (childSnapshot) {
            const booking = childSnapshot.val();
            const li = document.createElement('li');
            li.textContent = `预约人: ${booking.bookingPerson}, 预约的直播间名称: ${booking.roomName}, 预约的时间段: ${booking.bookingTime}, 日期: ${booking.date}`;
            bookingList.appendChild(li);

            // 将已预约的日期模块变红
            const cells = document.querySelectorAll('#calendar div');
            cells.forEach(cell => {
                if (cell.dataset.date === booking.date) {
                    cell.classList.add('booked');
                    cell.removeEventListener('click', () => openBookingModal(cell.dataset.date));
                }
            });
        });
    });
}

// 初始化页面
generateCalendar();
displayBookings();
