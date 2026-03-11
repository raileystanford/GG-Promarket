import { 
  Notifications,
  Popup,
  FormValidator,
} from "./modules.js";


// Plugins

new Notifications();

new Swiper('#intSlider', {
  slidesPerView: 1,
  // slidesPerGroup: 2, 
  spaceBetween: 2,
  speed: 800,
  loop: true,
  simulateTouch: false,

  // centeredSlides: true, // Центрирование слайда
  // initialSlide: 1, // Каокй слайд по счету изначально активен с 0
  
  // Эти 2 свойства надо чтобы показывался на видимых елементах мпец клас а при прокруте убирался 
  // watchSlidesProgress: true,
  // watchSlidesVisibility: true,

  pagination: {
    el: '#intSlider .solo-slider__pagination',
    clickable: true,   
  },

  // Кастомный вывод пагинации
  // pagination: {
  //   el: '.skills-slider__pagination',
  //   type: 'custom',
  //   renderCustom: function (swiper, current, total) {
  //     return `<span class="my-pagination">Слайд pizda из zalupa</span>`;
  //   }
  // },

  navigation: {
    nextEl: '#intSlider .solo-slider__btn--next',
    prevEl: '#intSlider .solo-slider__btn--prev',
  },

  // autoplay: {
  //   delay: 2500,
  //   disableOnInteraction: false,
  //   pauseOnMouseEnter: true,
  // },

  on: {
    // init: function () {
    //   console.log('Swiper проинициализирован');
    //   // Идеально для предзагрузки, анимаций при загрузке
    // },
    // beforeInit: function () {
    //   console.log('Перед инициализацией');
    // },
    // afterInit: function () {
    //   console.log('После инициализации');
    // },
    // slideChange: function () {
    //   console.log('Активный слайд:', this.activeIndex);
    //   // Обновление UI, синхронизация с другими элементами
    // },
    // slideChangeTransitionStart: function () {
    //   console.log('Началась анимация смены слайда');
    //   // Показ лоадера, блокировка интерфейса
    // },
    // slideChangeTransitionEnd: function () {
    //   console.log('Анимация смены слайда завершена');
    //   // Скрытие лоадера, разблокировка интерфейса
    // },
    // slideNextTransitionStart: function () {
    //   console.log('Началось перелистывание вперед');
    // },
    // slideNextTransitionEnd: function () {
    //   console.log('Перелистывание вперед завершено');
    // },
    // slidePrevTransitionStart: function () {
    //   console.log('Началось перелистывание назад');
    // },
    // slidePrevTransitionEnd: function () {
    //   console.log('Перелистывание назад завершено');
    // },
    // paginationRender: function (swiper, paginationEl) {
    //   console.log('Пагинация отрендерена');
    //   // Кастомизация пагинации после создания
    // },
    // paginationUpdate: function (swiper, paginationEl) {
    //   console.log('Пагинация обновлена');
    //   // Обновление кастомной пагинации
    // }
  }

});

new Popup({
  backdrop: true, // Добавляет блок бекдропа для попапа в документ (можно не писать это свойтсов по умолч true)
  overlayExit: true, // Разрешает запрещяет закрытие попапа при клике за его пределами (если не писать то будет фалс тоесть нельзя)
  // pageWrapper: '.popup-backdrop', // Если есть какойто скрол смусер или еще чтото что обрачивает както страницу то указывай тут егог класс что падинг при открытии попапа ему задавался а не быди. Если ниче такого нет то просто не пиши ето свойство
  scrollUnlockTime: 100, // Время в мс когда для страницы вернеться прокрутка после закрытия попапа. Можно не писать по умолчанию 150
  mobileFrom: 768, // С какого вьюпорта начинаеться мобилка (макс видс). Можно не писать по умолч 768
  escapeButtonExit: true, // Если тру то закрываем попап клавишей ескейп если фолс то нельзя. Можно не писать по умолчанию тру

  // Колбек срабатывающий когда выход из попапа по клику вне него запрещен и мы кликнули вне него
  overlayForbiddenExit: function(module, current) {},

  preOpenCallback: function(module, current) {},
  afterOpenCallback: function(module, current) {},
  preCloseCallback: function(module, current) {},

  afterCloseCallback: function(plugin, data) {
    let form = data.popup.querySelector('form');
    formValidatorEventsHandler.clearForm(form);
  },
});

new FormValidator({
  resetWhenChange: true,

  textInput: {
    onlyCyrylic: true,
    minLength: 2,
    noNumbers: true,
  },

  phoneMask: {
    mask: '+{38} (000) 000-00-00',
    lazy: false,
    placeholderChar: '_',
  },

});


// Functions

function focusStateFix(...selectors) {

  let initSelectors = [ 'a', 'button' ];
  if (selectors) initSelectors.push(...selectors);

  document.addEventListener('pointerdown', (event) => {

    initSelectors.forEach((selector) => {

      let isValid = event.target.closest(selector);
      if (isValid) isValid.addEventListener('pointerleave', (event) => event.currentTarget.blur(), { once: true });

    });

  });

}

function locationSelect() {

  let element = document.querySelector('.location');

  if (!element) return;

  let block = element.querySelector('.location__body');
  let trigger = element.querySelector('.location__trigger');
  let triggerText = trigger.querySelector('.location__trigger-text');
  let autoLocateBtn = element.querySelector('.location__button');
  let locBtnText = autoLocateBtn.querySelector('.location__button-text');
  let notif = document.querySelector('.notice')?._notifications;

  let dic = {
    'krim': 'АР Крым',
    'vin': 'Винницкая обл.',
    'vol': 'Волынская обл.',
    'dnep': 'Днепропетровская обл.',
    'don': 'Донецкая обл.',
    'jhit': 'Житомирская обл.',
    'zak': 'Закарпатская обл.',
    'zap': 'Запорожская обл.',
    'ivan': 'Ивано-Франковская обл.',
    'kyiv': 'Киев',
    'kir': 'Кировоградская обл.',
    'lug': 'Луганская обл.',
    'lviv': 'Львовская обл.',
    'nikol': 'Николаевская обл.',
    'odesa': 'Одесская обл.',
    'polt': 'Полтавская обл.',
    'rovn': 'Ровненская обл.',
    'sum': 'Сумская обл.',
    'tern': 'Тернопольская обл.',
    'hark': 'Харьковская обл.',
    'hers': 'Херсонская обл.',
    'hmel': 'Хмельницкая обл.',
    'cherk': 'Черкасская обл.',
    'chernig': 'Черниговская обл.',
    'chern': 'Черновицкая обл.',
  }

  document.addEventListener('click', (event) => {

    let trigger = event.target.closest('.location__trigger');
    let variant = event.target.closest('.location__variant');
    let autoLocBtn = event.target.closest('.location__button');
    let voidSpace = !event.target.closest('.location');
    
    if (trigger) {

      showBlock();

    } else if (variant) {

      selectVariant(variant);
      locationBtnState();

    } else if (autoLocBtn) {

      autoLocate();

    } else if (voidSpace && block.matches('.active')) {

      showBlock();

    }

  });

  function showBlock() {

    block.classList.toggle('active');
    trigger.classList.toggle('active');

  }

  function selectVariant(variant) {

    let text = dic[variant.id];
    if (text) triggerText.textContent = text;

    showBlock();

  }

  function autoLocate(btn) {
    
    autoLocateBtn.classList.add('blocked');
    autoLocateBtn.disabled = true;
    navigator.geolocation.getCurrentPosition(successLocation, errorLocation);

  }

  async function successLocation(result) {

    let lat = result.coords.latitude 
    let lon = result.coords.longitude

    let request = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`, {
      headers: {
        'User-Agent': 'GG-Promarket/1.0 (myemail@example.com)'
      }
    });

    if (request.ok) {

      let result = await request.json();
      
      if (result.address.country_code === 'ua') {
        
        let text = result.address.state.replace('область', 'обл.');
        triggerText.textContent = text;

        locationBtnState();

      } else {

        autoLocateBtn.classList.remove('blocked');
        autoLocateBtn.classList.add('loc-blocked');

        if (notif) notif.showNotice({
          title: 'Ошибка',
          text: 'Пользователь не находиться в Украине. Выберите область вручную.',
          img: './images/icons/error.svg',
          duration: 4000,
          type: 'n-error',
        });

      }
      
    } else {

      if (notif) notif.showNotice({
        title: 'Ошибка запроса',
        text: 'Повторите попытку снова или выберите область вручную.',
        img: './images/icons/warning.svg',
        duration: 4000,
        type: 'n-warning',
      });

    }
  
  }

  function errorLocation(result) {

    if (notif) notif.showNotice({
      title: 'Ошибка',
      text: 'Невозможно определить местоположение. Выберите область вручную.',
      img: './images/icons/error.svg',
      duration: 4000,
      type: 'n-error',
    });

  }

  function locationBtnState() {

    if (autoLocateBtn.matches('[disabled].blocked')) {

      autoLocateBtn.classList.remove('blocked');
      locBtnText.textContent = 'Определено';

    } else if (autoLocateBtn.matches('[disabled]:not(.loc-blocked)')) {

      autoLocateBtn.disabled = false;
      locBtnText.textContent = 'Определить автоматически';

    }

  }

}

function showAdditionalPhones() {

  let block = document.querySelector('.phone-select');

  if (!block) return;

  document.addEventListener('click', (event) => {

    let trigger = event.target.closest('.phone-select__trigger');
    let link = event.target.closest('.phone-select__link');
    let isVoid = !event.target.closest('.phone-select__main');

    if (trigger) {

      showMenu();

    } else if (link && block.matches('.active')) {

      showMenu();

    } else if (isVoid && block.matches('.active')) {

      showMenu();

    }

  });

  function showMenu() {
    block.classList.toggle('active');
  }

}

function formValidatorEventsHandler() {

  let form = document.querySelector('[data-form]');

  if (!form) return;

  let notif = document.querySelector('.notice')?._notifications;
  defineWarnFields();

  document.addEventListener('formvalid', (event) => {

    let popup = event.target.closest('.popup');

    popup._popup?.closePopup();

    setTimeout(() => {
      
      if (notif) notif.showNotice({
        title: 'Заявка принята',
        text: 'Ожидайте звонка от нашего менеджера.',
        img: './images/icons/success.svg',
        duration: 4000,
        type: 'n-success',
      });

    }, 100);

  })

  document.addEventListener('invalidinput', (event) => {

    event.detail.forEach((item) => showWarning(item));

  });

  document.addEventListener('resetinput', (event) => {

    let warning = event.detail.input._warning;
   
    warning.classList.remove('active');
    warning.style.height = '';

  })

  function showWarning(data) {

    let warnField = data.input._warning;
    let text = getWarningText(data.input.type, data.msg);

    if (text) {
      warnField.textContent = text;
      warnField.style.height = warnField.scrollHeight + 'px';
    }
    
    warnField.classList.add('active');

  }

  function getWarningText(type, msg) {

    let text;

    if (type === 'text') {

      if (msg === 'Empty field') {
        text = 'Введите ваше имя';
      } else if (msg === 'Only cyrylic allowed') {
        text = 'Используйте кириллические символы';
      } else if (msg === 'Text lower than minimum length') {
        text = 'Введите минимум две буквы';
      } else if (msg === 'Digits not allowed' || msg === 'Forbidden symbol') {
        text = 'Вводите только буквы';
      }

    } else if (type === 'tel') {

      if (msg === 'Empty field') {
        text = 'Введите номер телефона';
      } else if (msg === 'Enter full number') {
        text = 'Введите номер телефона полностью';
      }

    }

    return text;

  }

  function defineWarnFields() {

    let inputs = Array.from(document.querySelectorAll('[data-validate]'));

    inputs.forEach((input) => {

      let warnElement = document.querySelector(`[data-warn="${input.id}"]`);
      if (warnElement) input._warning = warnElement;

    });

  }

  formValidatorEventsHandler.clearForm = function(form) {

    Array.from(form.elements).forEach((item) => {

      item.classList.remove('invalid', 'valid');

      if (item._warning) {
        item._warning.classList.remove('active');
        item._warning.style.height = '';
        item._warning.textContent = '';
      }

      if (item.type === 'text') {

        item.value = '';

      } else if (item.type === 'tel') {

        if (item._mask) {
          item._mask.value = '';
        } else {
          item.value = '';
        }

      } else if (item.type === 'checkbox') {

        item.checked = false;

      }

    });

  }

}

function catalogHandler() {

  let trigger = document.querySelector('[data-cat-trig]');
  let container = document.querySelector('.catalog');

  if (!trigger || !container) return;

  let backdrop, lastMenuLi;
  let menuList = container.querySelector('.catalog__list');
  let catDescs = Array.from(container.querySelectorAll('.cat-desc'));
  let scrollWidth = window.innerWidth - document.documentElement.clientWidth;

  createBackdrop();

  document.addEventListener('click', (event) => {

    let trigger = event.target.closest('[data-cat-trig]');
    let backdrop = event.target.closest('.catalog-backdrop');

    if (trigger || backdrop) {
      containerOpenClose();
    } 

  });

  menuList.addEventListener('pointerover', (event) => {

    let isMenuLi = event.target.closest('.catalog__li');

    if (isMenuLi) showCatDesc(isMenuLi);

  });

  function showCatDesc(elem) {

    let key = elem.dataset.target;
    let block = container.querySelector(`[data-desc="${key}"]`);

    if (lastMenuLi) lastMenuLi.classList.remove('active');
    elem.classList.add('active');
    lastMenuLi = elem;

    if (!block) return;

    catDescs.forEach((item) => item.classList.remove('active'));
    if (container.matches('.active')) block.classList.add('active');
    
  }

  function containerOpenClose() {

    backdrop.classList.toggle('active');
    trigger.classList.toggle('active');
    container.classList.toggle('active');

    if (container.matches('.active')) {

      catDescs[0].classList.add('active');
      container.tabIndex = 0;
      setTimeout(() => container.focus(), 100);
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = scrollWidth + 'px';

    } else {

      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      if (lastMenuLi) lastMenuLi.classList.remove('active');
      lastMenuLi = null;

      setTimeout(() => {
        catDescs.forEach((item) => item.classList.remove('active'));
      }, 100);

    }

  }

  function createBackdrop() {

    backdrop = document.createElement('div');
    backdrop.classList.add('catalog-backdrop');
    document.body.append(backdrop);

  }

}

function searchSimulation() {

  let form = document.querySelector('.search');
  let menu = document.querySelector('.search-menu');

  if (!form || !menu) return;

  let container = menu.querySelector('.search-menu__variants');
  let input = form.querySelector('.search__input');
  let notif = document.querySelector('.notice')?._notifications;

  let dictionary = [

    { title: 'Раковина для ванной CERSANIT', price: '4000', img: './images/pictures/rak.png', alt: 'Раковина', url: './404.html' },
    { title: 'Раковина для кухни GEBERIT', price: '4500', img: './images/pictures/rak.png', alt: 'Раковина', url: './404.html' },
    { title: 'Раковина ROCA', price: '3200', img: './images/pictures/rak.png', alt: 'Раковина', url: './404.html' },
    { title: 'Раковина металлическая DYSON', price: '3950', img: './images/pictures/rak.png', alt: 'Раковина', url: './404.html' },
    { title: 'Раковина квадратная DORNBACHT', price: '4320', img: './images/pictures/rak.png', alt: 'Раковина', url: './404.html' },

    { title: 'Унитаз компакт ROCA', price: '5200', img: './images/pictures/unitaz1.png', alt: 'Унитаз', url: './404.html' },
    { title: 'Унитаз встраиваемый CERSANIT', price: '5200', img: './images/pictures/unitaz1.png', alt: 'Унитаз', url: './404.html' },
    { title: 'Унитаз навесной GROHE', price: '5200', img: './images/pictures/unitaz1.png', alt: 'Унитаз', url: './404.html' },
    { title: 'Унитаз автоматический DYSON', price: '6300', img: './images/pictures/unitaz1.png', alt: 'Унитаз', url: './404.html' },

    { title: 'Биде складное LVI', price: '2200', img: './images/pictures/bide.png', alt: 'Биде', url: './404.html' },
    { title: 'Биде автоматическое GESSI', price: '2900', img: './images/pictures/bide.png', alt: 'Биде', url: './404.html' },

    { title: 'Сушилка електрическая VITRA', price: '3250', img: './images/pictures/sushka.png', alt: 'Cушилка', url: './404.html' },
    { title: 'Сушилка водяная JADO', price: '3570', img: './images/pictures/sushka.png', alt: 'Cушилка', url: './404.html' },

    { title: 'Трап вертикальный GROHE', price: '2400', img: './images/pictures/trap-g.png', alt: 'Трап', url: './404.html' },
    { title: 'Трап двухкамерный CERSANIT', price: '2800', img: './images/pictures/trap-g.png', alt: 'Трап', url: './404.html' },
    { title: 'Трап керамический PAFFONI', price: '3500', img: './images/pictures/trap-g.png', alt: 'Трап', url: './404.html' },

    { title: 'Ванна керамическая GROHE', price: '6240', img: './images/pictures/vanna.png', alt: 'Ванна', url: './404.html' },
    { title: 'Ванна овальная GEBERIT', price: '6000', img: './images/pictures/vanna.png', alt: 'Ванна', url: './404.html' },
    { title: 'Ванна полноразмерная CERSANIT', price: '5500', img: './images/pictures/vanna.png', alt: 'Ванна', url: './404.html' },
    { title: 'Ванна литая JADO', price: '7000', img: './images/pictures/vanna.png', alt: 'Ванна', url: './404.html' },
    { title: 'Ванна компакт GESSI', price: '5200', img: './images/pictures/vanna.png', alt: 'Ванна', url: './404.html' },

    { title: 'Смеситель для ванны CERSANIT', price: '2200', img: './images/pictures/smesitel.png', alt: 'Смеситель', url: './404.html' },
    { title: 'Смеситель для кухни CERSANIT', price: '2100', img: './images/pictures/smesitel.png', alt: 'Смеситель', url: './404.html' },
    { title: 'Смеситель для душа GROHE', price: '2500', img: './images/pictures/smesitel.png', alt: 'Смеситель', url: './404.html' },
    { title: 'Смеситель накладной ROCA', price: '2100', img: './images/pictures/smesitel.png', alt: 'Смеситель', url: './404.html' },

    { title: 'Умывальник керамический GROHE', price: '3200', img: './images/pictures/umiv.png', alt: 'Умывальник', url: './404.html' },
    { title: 'Умывальник навесной ROCA', price: '3000', img: './images/pictures/umiv.png', alt: 'Умывальник', url: './404.html' },
    { title: 'Умывальник квадратный GEBERIT', price: '3400', img: './images/pictures/umiv.png', alt: 'Умывальник', url: './404.html' },
    { title: 'Умывальник компакт JADO', price: '3100', img: './images/pictures/umiv.png', alt: 'Умывальник', url: './404.html' },

    { title: 'Плитка для ванной комнаты KERASAN', price: '250', img: './images/pictures/plitka.png', alt: 'Плитка', url: './404.html' },
    { title: 'Плитка для кухни MIRAGGIO', price: '230', img: './images/pictures/plitka.png', alt: 'Плитка', url: './404.html' },
    { title: 'Плитка универсальная HANSGROHE', price: '310', img: './images/pictures/plitka.png', alt: 'Плитка', url: './404.html' },

    { title: 'Душевая кабинка квадратная ROCA', price: '4200', img: './images/pictures/kabinka.png', alt: 'Кабинка', url: './404.html' },
    { title: 'Душевая кабинка полукруглая GROHE', price: '4000', img: './images/pictures/kabinka.png', alt: 'Кабинка', url: './404.html' },

    { title: 'Писуар автоматический CERSANIT', price: '5000', img: './images/pictures/pisuar.png', alt: 'Писуар', url: './404.html' },
    { title: 'Писуар навесной GROHE', price: '4500', img: './images/pictures/pisuar.png', alt: 'Писуар', url: './404.html' },
    { title: 'Писуар адаптивный JADO', price: '4800', img: './images/pictures/pisuar.png', alt: 'Писуар', url: './404.html' },

  ]

  form.addEventListener('submit', (event) => {

    event.preventDefault();
    validateSearchInput(input.value);

  });

  input.addEventListener('input', (event) => {

    let value = event.target.value.trim();

    input.classList.remove('invalid');

    if (notif) notif.hideNotice();
    if (value) showFindedResults(value);

  });

  input.addEventListener('focus', (event) => {

    menu.classList.add('active');

  })

  document.addEventListener('click', (event) => {

    let isLink = event.target.closest('.search-menu a');
    let isVoid = !event.target.closest('.search');

    if (isLink) {

      menu.classList.remove('active');
      input.classList.remove('invalid');
      input.value = '';
      container.innerHTML = '';

    } else if (isVoid) {

      menu.classList.remove('active');
      input.classList.remove('invalid');

    }

  })

  function validateSearchInput(value) {

    value = value.trim();

    if (value.length > 1) {

      menu.classList.remove('active');
      input.classList.remove('invalid');
      input.value = '';
      container.innerHTML = '';
      input.blur();

    } else if (value.length > 0) {

      input.classList.add('invalid');

      if (notif) notif.showNotice({
        title: 'Внимание',
        text: 'Введите минимум 2 символа',
        img: './images/icons/warning.svg',
        duration: 3500,
        type: 'n-warning',
      });

    } else if (!value) {

      input.classList.add('invalid');

      if (notif) notif.showNotice({
        title: 'Ошибка',
        text: 'Введите поисковый запрос',
        img: './images/icons/error.svg',
        duration: 3500,
        type: 'n-error',
      });

    }

  }

  function showFindedResults(value) {

    let results = [];

    if (value.length > 1) {

      dictionary.forEach((item) => {

        if (new RegExp(`^${value}`, 'i').test(item.title)) results.push(item);

      });

      container.innerHTML = '';

      results.forEach((result) => {

        let variant = createSearchVariant(result);
        container.append(variant);

      });

    } else {

      container.innerHTML = '';      

    }

  }

  function createSearchVariant(data) {

    let container = document.createElement('div');
    let price = new Intl.NumberFormat('ru').format(data.price);

    let inner = `
      <a href="${data.url}" target="_blank" class="search-menu__variant">
        <img class="search-menu__icon" src="${data.img}" alt="${data.alt}">
        <span class="search-menu__title semi-text">${data.title}</span>
        <span class="search-menu__price semi-text">${price} ₴</span>
      </a>
    `;

    container.innerHTML = inner;
    return container.firstElementChild;

  }

}

function mobileNavUI() {

  let navbar = document.querySelector('.navbar');
  let media = window.matchMedia('(max-width: 800px)').matches;

  if (!navbar || !media) return;

  let search = navbar.querySelector('.search');
  let burger = navbar.querySelector('.burger-btn');
  let mobLogo = navbar.querySelector('.mob-logo');
  let catalog = navbar.querySelector('.catalog');
  let navbarInfo = navbar.querySelector('.navbar__info');
  let navbarLinks = navbar.querySelector('.navbar__links');
  let navLinks = navbar.querySelector('.nav-links');
  let navbarControls = navbar.querySelector('.navbar__controls');

  let exceptSelectors = '.location__trigger, .phone-select__trigger';
  let topNavbar, mobMenu, backdrop;

  createElements();
  replaceElements();

  document.addEventListener('click', (event) => {

    let burger = event.target.closest('.burger-btn');
    let isLink = event.target.closest('.mob-menu a');
    let isButton = event.target.closest(`.mob-menu button:not(${exceptSelectors})`);
    let isVoid = event.target.closest('.mob-menu-backdrop');

    if (burger || isLink || isButton) {
      openCloseMobMenu();
    } else if (isVoid) {
      openCloseMobMenu();
    }

  });

  function openCloseMobMenu() {

    mobMenu.classList.toggle('active');
    backdrop.classList.toggle('active');

    if (mobMenu.matches('.active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

  }

  function replaceElements() {

    if (mobLogo) topNavbar.append(mobLogo);
    if (search) topNavbar.append(search);
    if (burger) topNavbar.append(burger);

    if (catalog) document.body.append(catalog);

    if (navbarInfo) {
      mobMenu.append(navbarInfo);
      if (navLinks) navbarInfo.append(navLinks);
    } 

    navbar.innerHTML = '';
    navbar.append(navbarLinks, navbarControls);
    
  }

  function createElements() {

    topNavbar = document.createElement('div');
    topNavbar.classList.add('top-navbar');

    mobMenu = document.createElement('div');
    mobMenu.classList.add('mob-menu');

    let btn = document.createElement('button');
    btn.classList.add('mob-menu__close-btn');
    btn.innerHTML = '&times;';

    backdrop = document.createElement('div');
    backdrop.classList.add('mob-menu-backdrop');

    mobMenu.append(btn);
    document.body.append(topNavbar, mobMenu, backdrop);

  }

}

function enableScrollbar() {

  let media = window.matchMedia('(max-width: 800px)').matches;

  if (!media) return;

  let elements = Array.from(document.querySelectorAll('.no-scrollbar'));
  elements.forEach((item) => item.classList.remove('no-scrollbar'));

}

function searchFieldDemoQueries() {

  let input = document.querySelector('.search__input');

  if (!input) return;

  let queries = [ 'Раковина', 'Унитаз', 'Биде', 'Сушилка', 'Трап', 'Ванна', 'Смеситель', 'Умывальник', 'Плитка', 'Душевая кабинка', 'Писуар' ];

  let word = '';
  let currentLetterIndex = 0;
  let currentQuery = 0;
  let queryTimer, mainTimer;

  runAutoQueries();

  input.addEventListener('focus', (event) => {

    stopAutoQueries();

  });

  input.addEventListener('blur', (event) => {

    runAutoQueries();

  })

  function stopAutoQueries() {

    clearInterval(queryTimer);
    clearTimeout(mainTimer);
    input.placeholder = '';
    word = '';
    currentLetterIndex = 0;
    currentQuery = 0;

  }

  function runAutoQueries() {

    input.placeholder = 'Что вы ищете?';

    if (input.value.trim()) return;

    mainTimer = setTimeout(() => {

      queryTimer = setInterval(() => {

        if (input.matches('.invalid')) {
          stopAutoQueries();
          input.placeholder = 'Что вы ищете?';
          return;
        } 

        let query = queries[currentQuery];

        if (!query) {
          currentQuery = 0;
          return;
        } 

        let letter = query[currentLetterIndex];

        if (letter) {

          word += letter;
          input.placeholder = word;
          currentLetterIndex++;

        } else {

          input.placeholder = '';
          word = '';
          currentQuery++;
          currentLetterIndex = 0

        }
        
      }, 350);
      
    }, 3000);

  }

}







mobileNavUI();
focusStateFix('.swiper-pagination-bullet', '.catalog__li');
locationSelect();
showAdditionalPhones();
formValidatorEventsHandler();
catalogHandler();
searchSimulation();
enableScrollbar();
searchFieldDemoQueries();



          // obj.showNotice({
    //   title: 'NANDASASUJJA!!!!', // TITLE
    //   text: 'SASAT!', // Text
    //   img: './1.jpg',
    //   duration: 5000, // 3000
    //   // progress: false, // true
    //   // pauseOnHover: false, // true
    //   // type: 'n-error', // 'n-info', 'n-error', 'n-warning', 'n-success'
    // })