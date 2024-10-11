const colors = ["red", "blue", "green", "yellow", "orange", "purple", "pink", "brown", "black", "gray"];
let displayedColor;
let level = 1;
let time = 15; // Начальное время для уровня 1
let timerId;

// Обработчик для выбора уровня
document.getElementById('level-select').addEventListener('change', (e) => {
    level = parseInt(e.target.value);
    switch (level) {
        case 1:
            time = 15;
            break;
        case 2:
            time = 10;
            break;
        case 3:
            time = 5; // Уровень 3 будет с отображением 5 секунд
            break;
    }
});

// Кнопка для начала игры
document.getElementById('start-btn').addEventListener('click', startGame);

// Кнопка для остановки игры
document.getElementById('stop-btn').addEventListener('click', stopGame);

function startGame() {
    clearResult(); // Очистить прошлую попытку
    displayColor(); // Показать новый цвет
    startTimer();   // Запустить таймер
}

function displayColor() {
    const randomIndex = Math.floor(Math.random() * colors.length);
    displayedColor = colors[randomIndex];
    document.getElementById('color-display').style.backgroundColor = displayedColor;

    // Скрыть цвет после заданного времени и показать варианты
    setTimeout(() => {
        if (timerId) {
            document.getElementById('color-display').style.backgroundColor = 'white';
            showChoices();
        }
    }, time * 1000); // Время зависит от уровня
}

function startTimer() {
    let remainingTime = time;
    document.getElementById('timer').innerText = `Время: ${remainingTime} секунд`;

    timerId = setInterval(() => {
        remainingTime--;
        document.getElementById('timer').innerText = `Время: ${remainingTime} секунд`;

        if (remainingTime <= 0) {
            clearInterval(timerId);
            showChoices(); // Показать варианты ответа, если время вышло
        }
    }, 1000);
}

function stopGame() {
    clearResult(); // Остановить и очистить игру
}

function showChoices() {
    if (!timerId) return; // Если игра остановлена, не показывать варианты

    const choicesContainer = document.getElementById('choices-container');
    choicesContainer.innerHTML = ''; // Очистить предыдущие варианты ответа

    let optionsCount;
    if (level === 1) {
        optionsCount = 4;
    } else if (level === 2) {
        optionsCount = 8;
    } else if (level === 3) {
        optionsCount = 9;
    }

    const randomChoices = generateRandomChoices(optionsCount);
    // Перемешивание списка ответов перед отображением
    const shuffledChoices = shuffleArray(randomChoices);
    shuffledChoices.forEach((color) => {
        const choiceDiv = document.createElement('div');
        choiceDiv.classList.add('choice');
        choiceDiv.style.backgroundColor = color;
        choiceDiv.addEventListener('click', () => checkAnswer(color));
        choicesContainer.appendChild(choiceDiv);
    });
}

function generateRandomChoices(count) {
    const choices = new Set();
    choices.add(displayedColor);

    while (choices.size < count) {
        const randomIndex = Math.floor(Math.random() * colors.length);
        choices.add(colors[randomIndex]);
    }

    return Array.from(choices);
}

// Функция для перемешивания массива
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Меняем элементы местами
    }
    return array;
}

function checkAnswer(selectedColor) {
    clearInterval(timerId); // Остановить таймер после выбора
    const resultDiv = document.getElementById('result');

    if (selectedColor === displayedColor) {
        resultDiv.innerText = 'Правильно!';
        resultDiv.style.color = 'green';
    } else {
        resultDiv.innerText = 'Неправильно!';
        resultDiv.style.color = 'red';
    }

    // Начать новую попытку через 2 секунды
    setTimeout(() => {
        clearResult();
        startGame();
    }, 2000);
}

function clearResult() {
    document.getElementById('result').innerText = '';
    document.getElementById('choices-container').innerHTML = '';
    document.getElementById('color-display').style.backgroundColor = 'white';
    document.getElementById('timer').innerText = '';
    if (timerId) {
        clearInterval(timerId); // Убедиться, что таймер очищен перед новым запуском
        timerId = null; // Сбрасываем timerId, чтобы знать, что игра не запущена
    }
}