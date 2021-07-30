const mainSection = document.querySelector('.main'),
      sidebar = document.querySelector('.sidebar'),
      servicesOrCommercial = document.querySelector('.services-or-commercial'),
      menuBtn = document.querySelector('.menu-button')
      closeBtn = document.querySelector('.close-button'),
      navbarPanel = document.querySelector('.navbar-panel');

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
    title: 'Онлайн-бронирование жилья',
    text: 'Посуточная аренда квартир и домов: большой выбор вариантов для поездок по России',
    src: 'img/online-booking.svg',
    alt: 'icon: online-booking'
  }
}
// Список рекламных блоков
const commercials = {
  yandex: {
    title: 'Курс по рекламе в Instagram, FB, MT и TikTok',
    src: 'img/yandex.jpg'
  },
  projector: {
    title: 'Карманный проектор Atom Evolution',
    src: 'img/atom.jpg'
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

// Установка заголовка страницы
document.title = 'Ну купи!';

// Общая обертка для всех карточек товаров
const cards = createPageElement('div',
                               ['cards']);

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
  // Предварительная очистка содержимого
  mainSection.textContent = '';
  cards.textContent = '';
  // Добавление заголовка для раздела страницы
  mainSection.append(createPageElement('h2', ['page-title'], {textContent: 'Рекомендации для вас'}));
  // console.log(mainSection.textContent);

  getData()
    .then(data => {
      data.forEach(item => {
        cards.append(callback(item));
        mainSection.append(cards);
      });
    })
    .catch(err => console.error(err));
}

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
// Функция создания раздела страницы с одним товаром
const createSingleGood = (singleGood) => {
  const mainSingleSection = createPageElement('div', ['main-single']);

  // Обертка для фотогафий с описанием товара
  const content = createPageElement('div', ['content']),
        h2 = createPageElement('h2', ['page-title'], {textContent: singleGood.title});

  content.append(h2);

  // Добавление фотографий в слайдер
  for (let i = 2; i >= 1; i--) {

    const swiperContainer = createPageElement('div', ['swiper-container', 'mySwiper' + i]),
          swiperWrapper = createPageElement('div', ['swiper-wrapper']);

    singleGood.photo.forEach(src => {
      const swiperSlide = createPageElement('div', ['swiper-slide']),
            swiperSlideImage = createPageElement('img', ['swiper-slide-image'], {src: src, alt: singleGood.title});
  
      swiperSlide.append(swiperSlideImage);
      swiperWrapper.append(swiperSlide);
    });

    swiperContainer.append(swiperWrapper);
    content.append(swiperContainer);
  }

  // Блок для описания товара
  const contentText = createPageElement('div', ['content-text'], {textContent: singleGood.description});
  content.append(contentText);

  // Обертка для автора
  const author = createPageElement('div', ['author']),
        singlePrice = createPageElement('h2', ['single-price'], {textContent: `${singleGood.price} ₽`}),
        authorWrapper = createPageElement('div', ['author-wrapper']),
        authorInfo = createPageElement('div', ['author-info']),
        authorName = createPageElement('span', ['author-name'], {textContent: singleGood.salesman}),
        rating = createPageElement('div', ['rating']),
        ratingCounter = createPageElement('span', ['rating-counter'], {textContent: `${singleGood.reviews.length} отзыва`})
        authorStatus = createPageElement('span', ['author-status'], {textContent: singleGood.status}),
        authorAvatar = createPageElement('img', ['author-avatar'], {src: singleGood.avatar, alt: singleGood.salesman});

  // Добавление звездочек рейтинга
  for (let i = 1; i <= singleGood.rating; i++) {
    const filledStar = createPageElement('img', ['rating-star'], {src: 'img/filled-star.svg'});
    rating.append(filledStar);
  }
  for (let j = 1; j <= (5 - singleGood.rating); j++) {
    const unfilledStar = createPageElement('img', ['rating-star'], {src: 'img/unfilled-star.svg'});
    rating.append(unfilledStar);
  }

  // Кнопки с номером телефона и сообщением
  const buttonGroup = createPageElement('div', ['button-group']),
        buttonPrimary = createPageElement('button',
                                         ['button', 'button-block', 'button-primary'],
                                         {
                                           textContent: 'Показать телефон'
                                         }),
        buttonSuccess = createPageElement('button',
                                         ['button', 'button-block', 'button-success'],
                                         {
                                           textContent: 'Написать сообщение'
                                         }),
        buttonBack = createPageElement('button',
                                      ['button', 'button-block', 'button-back'],
                                      {
                                        textContent: 'Вернуться'
                                      });
  
  buttonGroup.append(buttonPrimary, buttonSuccess, buttonBack)
  
  author.append(singlePrice);
  rating.append(ratingCounter);
  authorInfo.append(authorName, rating, authorStatus);
  authorWrapper.append(authorInfo, authorAvatar);
  author.append(authorWrapper, buttonGroup);

  mainSingleSection.append(content, author);
  mainSection.append(mainSingleSection);

  // Активация слайдера
  const swiper = new Swiper(".mySwiper1", {
    spaceBetween: 10,
    slidesPerView: 5,
    freeMode: true,
    watchSlidesVisibility: true,
    watchSlidesProgress: true,
  });
  const swiper2 = new Swiper(".mySwiper2", {
    spaceBetween: 10,
    thumbs: {
      swiper: swiper,
    },
  });
}

// Функция отрисовки страницы для одного товара
const renderSingleGood = (callback, id) => {
  // Предварительная очистка содержимого
  mainSection.textContent = '';

  getData()
    .then(data => {
      const good = data.filter(item => item.id == id);
      callback(...good);
    })
    .catch(err => console.error(err));
}

// Функция создания сервисов для боковой колонки
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

// Функция создания блоков рекламы для боковой колонки
const createCommercialSidebar = (commercial) => {

  const banner = createPageElement('a', ['banner'], {href: '#'}),
        bannerImage = createPageElement('img', ['banner-image'], {src: commercial.src, alt: commercial.title});
  banner.append(bannerImage);
  servicesOrCommercial.insertAdjacentElement('afterbegin', banner);
}
// Отрисовка рекламы для сайдбара
const renderCommercialList = (commercials) => {
    // Предварительная очистка сайдбара
  servicesOrCommercial.textContent = '';

  for (const commercial in commercials)
    createCommercialSidebar(commercials[commercial]);
}

// if (mainSection.textContent) console.log(1, mainSection.textContent);
// Вывод карточек 
renderItemsList(createCardGood);
// Вывод боковой колонки сервисов и услуг
renderSevicesList(services);



mainSection.addEventListener('click', event => {
  // Установка лайка или нелайка для товара
  if (event.target.closest('.heart')) {

    const elem = event.target.closest('.heart'),
          card = event.target.closest('.card');

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

  if (event.target.closest('.card-image') || event.target.closest('.card-title')) {
    const elem = event.target.closest('.card'),
          elemId = event.target.closest('.card').id,
          elemTitle = elem.querySelector('.card-title').textContent;

    // Установка заголовка страницы
    document.title = elemTitle;

    // Вызов функции вывода информации о выбранном товаре
    renderSingleGood(createSingleGood, elemId);
    renderCommercialList(commercials);
  }
})

mainSection.addEventListener('click', event => {
  // Возврат на главную страницы
  if (event.target.closest('.button-back')) {
    document.title = 'Ну купи!';
    renderItemsList(createCardGood);
    renderSevicesList(services);
  }
})

menuBtn.addEventListener('click', () => {
  navbarPanel.style.transform = 'translateX(0)';
  navbarPanel.style.opacity = '1';
})

closeBtn.addEventListener('click', () => {
  navbarPanel.style.transform = 'translateX(100%)';
  navbarPanel.style.opacity = '0';
})