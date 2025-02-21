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

// 生成近 14 天的日历
function generateCalendar() {
    const calendar = document.getElementById('calendar');
    const today = new Date();
    for (let i = 0; i < 14; i++) {
        const currentDate = new Date(today);
        currentDate.setDate(today.getDate() + i);
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        const dayElement = document.createElement('div');
        dayElement.textContent = formattedDate;
        dayElement.dataset.date = formattedDate;
        dayElement.addEventListener('click', () => openModal(dayElement));
        calendar.appendChild(dayElement);
    }
}

// 打开输入模态框
const inputModal = document.getElementById('input-modal');
const closeModalButton = document.querySelector('.close-modal');
let selectedDayElement;

function openModal(dayElement) {
    inputModal.style.display = 'block';
    selectedDayElement = dayElement;
}

closeModalButton.addEventListener('click', () => {
    inputModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === inputModal) {
        inputModal.style.display = 'none';
    }
});

// 确认输入并更新日历和 Firebase
const confirmButton = document.getElementById('confirm-button');
const inputField = document.getElementById('input-field');

confirmButton.addEventListener('click', () => {
    const inputValue = inputField.value.trim();
    if (inputValue) {
        selectedDayElement.textContent = `${selectedDayElement.dataset.date}\n${inputValue}`;
        selectedDayElement.classList.add('booked');
        inputModal.style.display = 'none';
        inputField.value = '';

        // 保存到 Firebase
        const dateRef = database.ref('dates/' + selectedDayElement.dataset.date);
        dateRef.set(inputValue);
    }
});

// 从 Firebase 加载数据
function loadDataFromFirebase() {
    const datesRef = database.ref('dates');
    datesRef.on('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const date = childSnapshot.key;
            const value = childSnapshot.val();
            const dayElements = document.querySelectorAll('#calendar div');
            dayElements.forEach((dayElement) => {
                if (dayElement.dataset.date === date) {
                    dayElement.textContent = `${date}\n${value}`;
                    dayElement.classList.add('booked');
                }
            });
        });
    });
}

// 初始化页面
generateCalendar();
loadDataFromFirebase();
