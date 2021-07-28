const mainSection = document.querySelector('.main'),
      sidebar = document.querySelector('.sidebar'),
      servicesOrCommercial = document.querySelector('.services-or-commercial');

// Набор сервисов для сайдбара
const services = {
  shipping: {
    title: 'Доставка',
    text: 'Проверка при получении и возможность бесплатно вернуть товар',
    src: 'img/shipping.svg',
    alt: 'icon: shipping'
  },
  avtoteka: {
    title: 'Автотека',
    text: 'Отчёт с историей авто: пробег, владельцы, сведения о залоге, ДТП и ремонтах',
    src: 'img/avtoteka.svg',
    alt: 'icon: avtoteka'
  },
  onlineBooking: {
    title: 'Онлайн-ьронирование жилья',
    text: 'Посуточная аренда квартир и домов: большой выбор вариантов для поездок по России',
    src: 'img/online-booking.svg',
    alt: 'icon: online-booking'
  }
}

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

// Функцмя создания боковой колонки
const createServiceSidebar = (service) => {
  const serviceItem = createPageElement('div', ['services']);
  const srviceItemImage = createPageElement('img', 
                                           ['service-image'],
                                          {
                                            src: service.src,
                                            alt: service.alt
                                          });
  const serviceTitle = createPageElement('h5', ['service-title'], {textContent: service.title})
  const serviceText = createPageElement('p', ['service-text'], {textContent: service.text});

  serviceItem.append(srviceItemImage, serviceTitle, serviceText);
  servicesOrCommercial.insertAdjacentElement('afterbegin', serviceItem);
}
// Отриовка сервисов для сайдбара
const renderSevicesList = (services) => {
  // Предварительная очистка сайдбара
  servicesOrCommercial.textContent = '';

  // И заполнение его же нужной информацией
  const sidebarTitle =  createPageElement('h4', ['page-title'], {textContent: 'Сервисы и услуги'});

  for (const service in services)
    createServiceSidebar(services[service]);

  servicesOrCommercial.insertAdjacentElement('afterbegin', sidebarTitle);
}

// Вывод карточек 
renderItemsList(createCardGood);
// Вывод боковой колонки сервисов и услуг
renderSevicesList(services);


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