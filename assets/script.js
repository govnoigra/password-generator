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
        alert('Error');
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

    const options = {
        includeNumbers,
        includeUppercase,
        includeLowercase,
        includeSymbols,
    };

    // Removed call to updateStrengthIndicator
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
                alert('Error'); // Не удалось скопировать пароль.
            });
    } else {
        alert('Error'); // Сначала сгенерируйте пароль.
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

// Маппинг подпапок на файлы языков и флаги
const languageMap = {
    'ru': { lang: 'ru', flag: 'ru' },
    'fr': { lang: 'fr', flag: 'fr' },
    'de': { lang: 'de', flag: 'de' },
    'es': { lang: 'es', flag: 'es' },
    'uk': { lang: 'en', flag: 'en' }, // Подпапка /uk/ использует lang-en.json и флаг en.png
    'us': { lang: 'en', flag: 'us' }  // Подпапка /us/ использует lang-en.json и флаг us.png
};

// Определяем язык и флаг на основе URL
function getLanguageFromUrl() {
    const path = window.location.pathname.split('/').filter(Boolean)[0] || ''; // Получаем первую часть пути
    return languageMap[path] || { lang: 'en', flag: 'en' }; // Если подпапка не найдена, возвращаем en
}

// Загружаем язык и флаг из URL
const urlLangData = getLanguageFromUrl();
let currentLang = urlLangData.lang;
let currentFlag = urlLangData.flag;

// Сохраняем язык подпапки в localStorage, чтобы он использовался при обновлении страницы
localStorage.setItem('selectedLang', currentLang);

// Функция для загрузки языка
async function loadLanguage(lang) {
    try {
        const response = await fetch(`/lang/lang-${lang}.json`);
        if (!response.ok) {
            console.warn(`Язык ${lang} не найден, загружаем en`);
            lang = 'en'; // Устанавливаем язык по умолчанию
            currentFlag = 'en'; // Устанавливаем флаг по умолчанию
            const fallbackResponse = await fetch(`/lang/lang-en.json`);
            if (!fallbackResponse.ok) {
                throw new Error('Ошибка загрузки языка en');
            }
            const translations = await fallbackResponse.json();
            applyTranslations(translations);
            updateCurrentFlag(currentFlag);
            return;
        }
        const translations = await response.json();
        applyTranslations(translations);
        updateCurrentFlag(currentFlag); // Обновляем флаг
    } catch (error) {
        console.error('Не удалось загрузить язык:', error);
    }
}

// Функция для обновления текущего флага
function updateCurrentFlag(flag) {
    const currentFlagElement = document.getElementById('current-flag');
    if (currentFlagElement) {
        currentFlagElement.innerHTML = `<img src="/assets/flags/${flag}.png" alt="Текущий язык">`;
    }
}

document.querySelectorAll('.language-option').forEach(option => {
    option.addEventListener('click', () => {
        const selectedLang = option.getAttribute('data-lang');
        currentLang = selectedLang;

        // Устанавливаем флаг: для 'en' на /us/ используем us.png, иначе берём из languageMap
        const currentPath = window.location.pathname.split('/').filter(Boolean)[0];
        if (selectedLang === 'en' && currentPath === 'us') {
            currentFlag = 'us';
        } else {
            currentFlag = Object.values(languageMap).find(map => map.lang === selectedLang)?.flag || selectedLang;
        }

        // Сохраняем выбранный язык в localStorage
        localStorage.setItem('selectedLang', currentLang);

        // Загружаем выбранный язык без перенаправления
        loadLanguage(currentLang);

        document.getElementById('language-dropdown').style.display = 'none';
    });
});

// Загружаем язык при загрузке страницы
loadLanguage(currentLang);

// Функция для применения перевода
function applyTranslations(translations) {
 
    // Обновляем заголовок и подзаголовок
    const pagetitle = document.querySelector('.pagetitle');
    if (pagetitle) pagetitle.textContent = translations.pagetitle;

    const subtitle = document.querySelector('.subtitle');
    if (subtitle) subtitle.textContent = translations.subtitle;

    // Обновляем метки и примеры для чекбоксов
    const lengthLabel = document.querySelector('label[for="length"]');
    if (lengthLabel) lengthLabel.textContent = translations.lengthLabel;

    const numbersLabel = document.querySelector('label[for="numbers"] span');
    if (numbersLabel) numbersLabel.textContent = translations.numbersLabel;

    const uppercaseLabel = document.querySelector('label[for="uppercase"] span');
    if (uppercaseLabel) uppercaseLabel.textContent = translations.uppercaseLabel;

    const lowercaseLabel = document.querySelector('label[for="lowercase"] span');
    if (lowercaseLabel) lowercaseLabel.textContent = translations.lowercaseLabel;

    const symbolsLabel = document.querySelector('label[for="symbols"] span');
    if (symbolsLabel) symbolsLabel.textContent = translations.symbolsLabel;

    const noRepeatsLabel = document.querySelector('label[for="no-repeats"] span');
    if (noRepeatsLabel) noRepeatsLabel.textContent = translations.noRepeatsLabel;

    // Обновляем кнопки
    const generateButton = document.getElementById('generate');
    if (generateButton) generateButton.textContent = translations.generateButton;

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

    const strengthLabel = document.getElementById('strength-label');
    if (strengthLabel) strengthLabel.textContent = translations.strengthLabel;

    const strengthText = document.getElementById('strength-text');
    if (strengthText) strengthText.textContent = ''; // Clear strength text on language change
}


// Обработчики для выбора языка
document.getElementById('current-flag').addEventListener('click', (event) => {
    event.stopPropagation(); // Останавливаем всплытие события
    const dropdown = document.getElementById('language-dropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
});


// Закрытие выпадающего списка при клике вне его
document.addEventListener('click', (event) => {
    const languageSwitcher = document.querySelector('.language-switcher');
    const dropdown = document.getElementById('language-dropdown');
    if (!languageSwitcher.contains(event.target)) {
        dropdown.style.display = 'none';
    }
});