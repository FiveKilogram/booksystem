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

// 生成近14天的日历
function generateCalendar() {
    const calendar = document.getElementById('calendar');
    const today = new Date();
    for (let i = 0; i < 14; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const cell = document.createElement('div');
        cell.textContent = `${year}-${month}-${day}`;
        cell.dataset.date = `${year}-${month}-${day}`;
        cell.addEventListener('click', () => openInputModal(cell));
        calendar.appendChild(cell);
    }
}

// 打开输入模态框
const inputModal = document.getElementById('input-modal');
const closeModal = document.querySelector('.close');
let selectedCell;
function openInputModal(cell) {
    inputModal.style.display = 'block';
    selectedCell = cell;
}

closeModal.addEventListener('click', () => {
    inputModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target == inputModal) {
        inputModal.style.display = 'none';
    }
});

// 确认输入
const confirmBtn = document.getElementById('confirm-btn');
const inputText = document.getElementById('input-text');
confirmBtn.addEventListener('click', () => {
    const text = inputText.value;
    if (text) {
        selectedCell.textContent = `${selectedCell.dataset.date}\n${text}`;
        selectedCell.classList.add('booked');
        inputModal.style.display = 'none';
        inputText.value = '';

        // 存入 Firebase
        const dateRef = database.ref('dates/' + selectedCell.dataset.date);
        dateRef.set(text);
    }
});

// 从 Firebase 加载数据
function loadDataFromFirebase() {
    const datesRef = database.ref('dates');
    datesRef.on('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const date = childSnapshot.key;
            const text = childSnapshot.val();
            const cells = document.querySelectorAll('#calendar div');
            cells.forEach((cell) => {
                if (cell.dataset.date === date) {
                    cell.textContent = `${date}\n${text}`;
                    cell.classList.add('booked');
                }
            });
        });
    });
}

// 初始化页面
generateCalendar();
loadDataFromFirebase();
