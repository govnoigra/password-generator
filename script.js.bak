// Генерация пароля
document.getElementById('generate').addEventListener('click', function() {
    const lengthInput = document.getElementById('length');
    const length = parseInt(lengthInput.value);
    const lengthWarning = document.getElementById('length-warning');

    // Проверка длины пароля
    if (length > 64) {
        lengthWarning.style.display = 'block';
        return;
    } else {
        lengthWarning.style.display = 'none';
    }

    const includeNumbers = document.getElementById('numbers').checked;
    const includeUppercase = document.getElementById('uppercase').checked;
    const includeLowercase = document.getElementById('lowercase').checked;
    const includeSymbols = document.getElementById('symbols').checked;
    const noRepeats = document.getElementById('no-repeats').checked;

    const numbers = '0123456789';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const symbols = '!@#$%^&*()_+~`|}{[]\:;?><,./-=';

    let characters = '';
    if (includeNumbers) characters += numbers;
    if (includeUppercase) characters += uppercase;
    if (includeLowercase) characters += lowercase;
    if (includeSymbols) characters += symbols;

    if (characters === '') {
        alert('Выберите хотя бы один тип символов!');
        return;
    }

    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        const randomChar = characters[randomIndex];

        if (noRepeats && password.includes(randomChar)) {
            i--;
            continue;
        }

        password += randomChar;
    }

    const passwordText = document.getElementById('password-text');
    passwordText.textContent = password;

    // Уменьшение шрифта и перенос текста для длинных паролей
    if (password.length > 32) {
        passwordText.classList.add('long-password'); // Уменьшаем шрифт
    } else {
        passwordText.classList.remove('long-password'); // Возвращаем стандартный размер
    }

    // Показываем кнопку "Copy"
    const copyButton = document.getElementById('copy-button');
    copyButton.style.display = 'block';
});

// Копирование пароля в буфер обмена
document.getElementById('copy-button').addEventListener('click', function() {
    const passwordText = document.getElementById('password-text');
    const password = passwordText.textContent;
    const copyButton = document.getElementById('copy-button');

    if (password) {
        navigator.clipboard.writeText(password)
            .then(() => {
                copyButton.textContent = '';
                copyButton.classList.add('copied');
                setTimeout(() => {
                    copyButton.textContent = 'Copy';
                    copyButton.classList.remove('copied');
                }, 1000);
            })
            .catch(() => {
                alert('Не удалось скопировать пароль.');
            });
    } else {
        alert('Сначала сгенерируйте пароль.');
    }
});

// Ограничение длины пароля
document.getElementById('length').addEventListener('input', function() {
    const lengthWarning = document.getElementById('length-warning');
    if (this.value > 64) {
        lengthWarning.style.display = 'block';
    } else {
        lengthWarning.style.display = 'none';
    }
});

let currentLang = 'ru'; // По умолчанию русский язык

// Функция для загрузки языка
async function loadLanguage(lang) {
    try {
        const response = await fetch(`lang/lang-${lang}.json`);
        if (!response.ok) {
            throw new Error('Ошибка загрузки языка');
        }
        const translations = await response.json();
        applyTranslations(translations);
        updateCurrentFlag(lang); // Обновляем текущий флаг
    } catch (error) {
        console.error('Не удалось загрузить язык:', error);
    }
}

// Функция для применения перевода
function applyTranslations(translations) {
    // Обновляем заголовок страницы
    document.querySelector('title').textContent = translations.title;

    // Обновляем заголовок и подзаголовок
    const h1 = document.querySelector('h1');
    if (h1) h1.textContent = translations.title;

    const subtitle = document.querySelector('.subtitle');
    if (subtitle) subtitle.textContent = translations.subtitle;

    // Обновляем метки и примеры для чекбоксов
    const lengthLabel = document.querySelector('label[for="length"]');
    if (lengthLabel) lengthLabel.textContent = translations.lengthLabel;

    // Сохраняем текущие состояния чекбоксов
    const numbersChecked = document.getElementById('numbers').checked;
    const uppercaseChecked = document.getElementById('uppercase').checked;
    const lowercaseChecked = document.getElementById('lowercase').checked;
    const symbolsChecked = document.getElementById('symbols').checked;
    const noRepeatsChecked = document.getElementById('no-repeats').checked;

    // Обновляем текст, сохраняя состояния
    document.querySelector('label[for="numbers"] .label-text').textContent = translations.numbersLabel;
    document.querySelector('label[for="uppercase"] .label-text').textContent = translations.uppercaseLabel;
    document.querySelector('label[for="lowercase"] .label-text').textContent = translations.lowercaseLabel;
    document.querySelector('label[for="symbols"] .label-text').textContent = translations.symbolsLabel;
    document.querySelector('label[for="no-repeats"] .label-text').textContent = translations.noRepeatsLabel;

    // Восстанавливаем состояния
    document.getElementById('numbers').checked = numbersChecked;
    document.getElementById('uppercase').checked = uppercaseChecked;
    document.getElementById('lowercase').checked = lowercaseChecked;
    document.getElementById('symbols').checked = symbolsChecked;
    document.getElementById('no-repeats').checked = noRepeatsChecked;

    // Обновляем кнопки
    const generateButton = document.getElementById('generate');
    if (generateButton) generateButton.textContent = translations.generateButton;

    const copyButton = document.getElementById('copy-button');
    if (copyButton) copyButton.textContent = translations.copyButton;

    // Обновляем SEO-текст
    const seoTitle = document.querySelector('.seo-text h2');
    if (seoTitle) seoTitle.textContent = translations.seoTitle;

    const seoText = document.querySelector('.seo-text p');
    if (seoText) seoText.textContent = translations.seoText;

    // Обновляем футер
    const privacyPolicy = document.querySelector('footer a');
    if (privacyPolicy) privacyPolicy.textContent = translations.privacyPolicy;

    const copyright = document.querySelector('footer p');
    if (copyright) copyright.textContent = translations.copyright;

    // Обновляем предупреждение о длине пароля
    const lengthWarning = document.getElementById('length-warning');
    if (lengthWarning) lengthWarning.textContent = translations.lengthWarning;
}

// Функция для обновления текущего флага
function updateCurrentFlag(lang) {
    const currentFlag = document.getElementById('current-flag');
    currentFlag.innerHTML = `<img src="assets/flags/${lang}.png" alt="Текущий язык">`;
}

// Обработчики для выбора языка
document.getElementById('current-flag').addEventListener('click', (event) => {
    event.stopPropagation(); // Останавливаем всплытие события
    const dropdown = document.getElementById('language-dropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
});

document.querySelectorAll('.language-option').forEach(option => {
    option.addEventListener('click', () => {
        const selectedLang = option.getAttribute('data-lang');
        currentLang = selectedLang;
        loadLanguage(currentLang);
        document.getElementById('language-dropdown').style.display = 'none'; // Скрываем выпадающий список
    });
});

// Закрытие выпадающего списка при клике вне его
document.addEventListener('click', (event) => {
    const languageSwitcher = document.querySelector('.language-switcher');
    const dropdown = document.getElementById('language-dropdown');
    if (!languageSwitcher.contains(event.target)) {
        dropdown.style.display = 'none';
    }
});

// Загружаем язык по умолчанию
loadLanguage(currentLang);