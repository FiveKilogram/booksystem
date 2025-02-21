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
    for (let i = 0; i < 14; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const weekday = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()];
        const cell = document.createElement('div');
        cell.textContent = `${month}/${day} 周${weekday}`;
        calendar.appendChild(cell);
    }
}

// 处理预约提交
const bookingForm = document.getElementById('booking-form');
bookingForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const bookingPerson = document.getElementById('booking-person').value;
    const roomName = document.getElementById('room-name').value;
    const bookingTime = document.getElementById('booking-time').value;

    const newBooking = {
        bookingPerson: bookingPerson,
        roomName: roomName,
        bookingTime: bookingTime
    };

    const bookingsRef = database.ref('bookings');
    bookingsRef.push(newBooking);

    bookingForm.reset();
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
            li.textContent = `预约人: ${booking.bookingPerson}, 预约直播间名称: ${booking.roomName}, 预约时间: ${booking.bookingTime}`;
            bookingList.appendChild(li);
        });
    });
}

// 初始化页面
generateCalendar();
displayBookings();
