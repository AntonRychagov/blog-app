const posts = []; // массив постов

const TITLE_VALIDATION_LIMIT = 50; // ограничения символов в (input)
const TEXT_VALIDATION_LIMIT = 200; // ограничения символов в (text)

const TITLE_ERROR = "напиши заголовок";
const TEXT_ERROR = "напиши пост";

const titlePostNode = document.querySelector("#inputTitle"); // ЗАГОЛОВОК (input)
const textPostNode = document.querySelector("#textareaText"); // ТЕКСТ (textarea)

const newPostBtnNode = document.querySelector(".js-btn-publish"); // КНОПКА (опубликовать)
const clearPostBtnNode = document.querySelector(".js-btn-clear"); // КНОПКА (очистить)

const postFeedbackNode = document.querySelector(".post__feedback-inner"); // БЛОК (div)

const validationMessage = document.querySelector("#validationMessage"); // ТЭГ (div)

const labelTitleNode = document.querySelector("#labelTitle"); // счетчик (input)
const labelTextNode = document.querySelector("#labelText"); // счетчик (text)
const labelTitleErrorNode = document.querySelector("#labelErrorTitle"); // текст ЗАГОЛОВКА
const labelTextErrorNode = document.querySelector("#labelErrorText"); // текст ПОСТА

////////////////////  ОБРАБОТЧИКИ СОБЫТИЙ  /////////////////////////////////

newPostBtnNode.addEventListener("click", getPost); //создание поста

titlePostNode.addEventListener("input", validation); // валидация
textPostNode.addEventListener("input", validation); // валидация

titlePostNode.addEventListener("input", titleCount); // счетчик символов заголовка
textPostNode.addEventListener("input", textCount); // счетчик символов текста

titlePostNode.addEventListener("input", checkLength); // проверка поля (ЗАГОЛОВКА)
textPostNode.addEventListener("input", checkLength); // проверка поля (ТЕКСТА ПОЛЯ)

clearPostBtnNode.addEventListener("click", clearPost); // событие при клике на кнопку (сбросить)

////////////////////////  ФУНКЦИИ  ////////////////////////////////////////////////

function getPost() {
  // функция создает пост (берет данные с полей ввода от user), возращает заголовок и текст
  const postFromUser = getPostFromUser();

  // функция создает один пост и добавляет его в массив постов
  addPost(postFromUser);

  // функция добавляет пост по селектору в блок (вывод пользователю)
  renderPosts();

  //очитска полей ввода после нажатии на кнопку
  clearPost();

  //отключение кнопки после публикации поста
  disabledSubmitButton();
}

// функция создает один пост и добавляет его в массив постов
function addPost(post) {
  posts.push(post);
}

// конструктор поста
function Post(data, title, text) {
  this.data = data;
  this.title = title;
  this.text = text;
}

// функция создает пост (берет данные с полей ввода от user), возращает дату, время, заголовок, текст.
function getPostFromUser() {
  const data = getCurrentDate();
  const title = titlePostNode.value;
  const text = textPostNode.value;
  const post = new Post(data, title, text);

  return post;
}

// функция возвращает посты
function getPosts() {
  return posts;
}

// функция добавляет пост по селектору в блок (вывод пользователю)
function renderPosts() {
  const posts = getPosts();

  let postsHTML = "";

  for (let i = 0; i < posts.length; i++) {
    postsHTML += `
            <div class='post'>
                <p class='post__data'>${posts[i].data}</p>
                <h3 class='post__title'>${posts[i].title}</h3>
                <p class='post__text'>${posts[i].text}</p>
            </div>
        `;
  }

  postFeedbackNode.innerHTML = postsHTML;
}

// функция возвращет дату и время строкой
function getCurrentDate() {
  const date = new Date();

  return (
    date.toLocaleString("ru-RU", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }) +
    " " +
    date.toLocaleString("ru-RU", {
      hour: "numeric",
      minute: "numeric",
    })
  );
}

// функция выводит колличетсво символов (input)
function titleCount() {
  const count = titlePostNode.value.length;
  labelTitleNode.innerText = `${count} / ${TITLE_VALIDATION_LIMIT}`;
}

// функция выводит колличество символов (text)
function textCount() {
  const count = textPostNode.value.length;
  labelTextNode.innerText = `${count} / ${TEXT_VALIDATION_LIMIT}`;
}

checkLength(); // проверка полей ввода

function checkLength() {
  const titleLength = titlePostNode.value.length;
  const textLength = textPostNode.value.length;

  if (titleLength === 0 || textLength === 0) {
    disabledSubmitButton();
    titlePostNode.focus(); //фокус на поле заголовка
    return;
  }
  unDisabledSubmitButton();
}

// функция выполняет валидацию
function validation() {
  const titleLength = titlePostNode.value.length;
  const textLength = textPostNode.value.length;

  // если длина заголовка > лимита , выполняем условие
  if (titleLength > TITLE_VALIDATION_LIMIT) {
    disabledSubmitButton(); // отключаем кнопку опубликовать
    validationMessage.innerText = `Длина заголовка превышает ${TITLE_VALIDATION_LIMIT} символов`;
    return;
  }

  // если длина текста > лимита , выполняем условие
  if (textLength > TEXT_VALIDATION_LIMIT) {
    disabledSubmitButton(); // отключаем кнопку опубликовать
    validationMessage.innerText = `Длина текста превышает ${TEXT_VALIDATION_LIMIT} символов`;
    return;
  }

  validationMessage.innerText = null;

  // вывод предупреждения , если заголовок пустой
  if (titleLength === 0) {
    labelTitleErrorNode.innerText = TITLE_ERROR;
    disabledSubmitButton();
    return;
  }

  labelTitleErrorNode.innerText = null;

  // вывод предупреждения , если текст поста пустой
  if (textLength === 0) {
    labelTextErrorNode.innerText = TEXT_ERROR;
    disabledSubmitButton();
    return;
  }

  labelTextErrorNode.innerText = null;

  // если условия соблюдены выполняем данный код
  unDisabledSubmitButton(); // включаем кнопку опубликовать , если услровия выполнены
}

// функция блокирует кнопку (ОПУБЛИКОВАТЬ)
function disabledSubmitButton() {
  newPostBtnNode.disabled = true;
  newPostBtnNode.classList.add("button__disabled");
}

// функция разблокирует кнопку (ОПУБЛИКОВАТЬ)
function unDisabledSubmitButton() {
  newPostBtnNode.disabled = false;
  newPostBtnNode.classList.remove("button__disabled");
}

// функция очистки полей
function clearPost() {
  titlePostNode.value = null;
  textPostNode.value = null;
  labelTitleNode.innerText = `0 / 50`;
  labelTextNode.innerText = `0 / 200`;
  disabledSubmitButton();
}

// Добавляем обработчик события на нажатие клавиши Enter в поле input
titlePostNode.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    // Отменяем стандартное поведение формы
    event.preventDefault();

    // Переходим к полю textarea
    if (textPostNode) {
      textPostNode.focus();
    }
  }
});
