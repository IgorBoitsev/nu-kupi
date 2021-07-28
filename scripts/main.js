const mainSection = document.querySelector('.main');

// Функция создания элемента на странице
const createPageElement = (tag, className, attributes) => {
  // Создание элемента
  const element = document.createElement(tag);
  // Добавление класса
  if (className) element.classList.add(...className);
  // Добавление атрибутов
  if (attributes) {
    for (let attribute in attributes)
      element[attribute] = attributes[attribute];
  }

  return element;
}

// Общая обертка для всех карточек товаров
const cards = createPageElement('div',
                               ['cards']);

// Функция создания одной карточки товара
const createCardGood = (data) => {
  // Создание одной карточки
  const card = createPageElement('div',
                                ['card', data.liked ? 'liked' : 'unliked']);
  // Установка id товара для карточки
  card.id = data.id;
  // Создание предварительного изображения
  const cardImage  = createPageElement('img',
                                      ['card-image', 'preview-photo'],
                                      {
                                        'src': data.preview,
                                        'alt': 'photo'
                                        });
  const cardHeader = createPageElement('div',
                                      ['card-header']);
  // Заголовок карточки
  const cardTitle = createPageElement('h3',
                                      ['card-title'],
                                      {
                                        'textContent': data.title
                                      });
  // Кнопка "нравится"
  const likeButton = createPageElement('button',
                                      ['like']);
  const likeButtonImage= createPageElement('img', ['heart'],
                                          {
                                           'src': data.liked ? 'img/like.svg' : 'img/unlike.svg',
                                           'alt': data.liked ? 'like' : 'unlike'
                                          });
  // Цена товара
  const cardPrice = createPageElement('strong',
                                     ['card-price'],
                                     {
                                       'textContent': `${data.price} ₽`
                                     });
  // Адрес продажи товара
  const cardText = createPageElement('p',
                                    ['card-text'],
                                    {
                                      'textContent': data.address
                                    });
  // Дата появления объявления
  const cardTextDate = createPageElement('p',
                                    ['card-text', 'date'],
                                    {
                                      'textContent': data.date
                                    });


  likeButton.append(likeButtonImage);
  cardHeader.append(cardTitle, likeButton);
  card.append(cardImage, cardHeader, cardPrice, cardText, cardTextDate);
  return card;
};

// Функция получения данных с сервера
const getData = async () => {
  const data = await fetch('/db.json');

  if (data.ok) {
    return data.json();
  } else {
    throw new Error(`Данные не были получены. Ошибка ${data.status} ${data.statusText}`);
  }
}

// Функция отрисовки всех карточек на странице
const renderItemsList = (callback) => {
  getData()
    .then(data => {
      data.forEach(item => {
        cards.append(callback(item));
        mainSection.append(cards);
      });
    })
    .catch(err => console.error(err));
}

// Вывод карточек 
renderItemsList(createCardGood);


mainSection.addEventListener('click', event => {
  if (event.target.closest('.heart')) {

    const elem = event.target.closest('.heart'),
          card = event.target.closest('.card'),
          elemId = event.target.closest('.card').id;
    if (elem.alt == 'like') {
      card.classList.remove('liked');
      card.classList.add('unliked');
      elem.alt = 'unlike';
      elem.src = 'img/unlike.svg';
    } else {
      card.classList.remove('unliked');
      card.classList.add('liked');
      elem.alt = 'like';
      elem.src = 'img/like.svg';
    }
  }
})