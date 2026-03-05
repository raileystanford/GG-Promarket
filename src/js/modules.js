class Notifications {

  constructor(params) {

    this.opt = params ?? {};
    this.defineElements();

    if (!this.block) return;

    this.elapsed = 0;
    this.timer = null;
    this.remaining = 0;
    this.isPaused = false;

    this.ownMethodsBinder();
    this.setEventListeners();

  }

  setEventListeners() {

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.hideNotice());
    }

    this.block.addEventListener('mouseenter', () => {
      if (this.pauseOnHover) this.pauseAll();
    });

    this.block.addEventListener('mouseleave', () => {
      if (this.pauseOnHover) this.resumeAll();
    });

  }

  showNotice(options = {}) {

    let title = options.title ?? 'Title';
    let text = options.text ?? 'Notice message';
    let type = options.type ?? 'n-info';
    let img = options.img;

    this.duration = options.duration ?? 3000;
    this.progressEnabled = options.progress ?? true;
    this.pauseOnHover = options.pauseOnHover ?? true;
    
    this.block.classList.remove('n-info', 'n-error', 'n-warning', 'n-success');

    this.title.innerHTML = title;
    this.text.innerHTML = text;
    if (img) this.icon.src = img;

    this.block.classList.add('active', type);

    if (this.progress) this.progress.style.display = this.progressEnabled ? '' : 'none';

    this.startAll();

  }

  hideNotice() {

    this.block.classList.remove('active');
    this.clearAll();

  }

  startAll() {

    this.clearAll();

    this.isPaused = false;
    this.startTime = Date.now();
    this.pausedTime = 0;

    if (this.progressEnabled && this.progress) {
      this.progress.firstElementChild.style.width = '0%';
      this.animationFrame = requestAnimationFrame(this.animateProgress);
    }

    this.timer = setTimeout(() => {
      this.hideNotice();
    }, this.duration);

  }

  pauseAll() {

    if (this.isPaused) return;

    this.isPaused = true;

    cancelAnimationFrame(this.animationFrame);
    clearTimeout(this.timer);

    this.pausedTime = Date.now() - this.startTime;

  }

  resumeAll() {

    if (!this.isPaused) return;

    this.isPaused = false;

    this.startTime = Date.now() - this.pausedTime;

    const remaining = this.duration - this.pausedTime;

    if (this.progressEnabled && this.progress) {
      this.animationFrame = requestAnimationFrame(this.animateProgress);
    }

    this.timer = setTimeout(() => {
      this.hideNotice();
    }, remaining);

  }

  clearAll() {

    cancelAnimationFrame(this.animationFrame);
    clearTimeout(this.timer);

    this.startTime = null;
    this.pausedTime = 0;
    this.isPaused = false;

  }

  animateProgress() {

    const now = Date.now();
    const elapsed = now - this.startTime;

    const progress = Math.min(elapsed / this.duration, 1);

    if (this.progress && this.progress.firstElementChild) {
      this.progress.firstElementChild.style.width = (progress * 100) + '%';
    }

    if (progress < 1 && !this.isPaused) {
      this.animationFrame = requestAnimationFrame(this.animateProgress);
    }

  }

  defineElements() {

    let elem = this.opt.elements ?? {};

    this.block = document.querySelector(elem.block ?? '.notice');
    this.title = document.querySelector(elem.title ?? '.notice__title');
    this.text = document.querySelector(elem.text ?? '.notice__text');
    this.icon = document.querySelector(elem.icon ?? '.notice__img');
    this.closeBtn = document.querySelector(elem.closeBtn ?? '.notice__close-btn');
    this.progress = document.querySelector(elem.progress ?? '.notice__progress');

    if (this.block) this.block._notifications = this;

  }

}

class Popup {

  constructor(params) {

    this.triggers = document.querySelectorAll('[data-popup]');
    if (this.triggers.length === 0) return;

    this.params = params ?? {};
    this.params.backdrop = params.backdrop ?? true;
    this.params.scrollUnlockTime = params.scrollUnlockTime ?? 150;
    this.params.escapeButtonExit = params.escapeButtonExit ?? true;

    this.current = {};
    this.isMobile = window.matchMedia(`(max-width: ${params.mobileFrom ?? 768}px)`).matches;
    this.scrollWidth = window.innerWidth - document.documentElement.clientWidth;

    this.ownMethodsBinder();
    this.createBackdrop();
    this.setClassIntoPopups();
    this.setEventListeners();

  }

  setEventListeners() {

    document.addEventListener('click', (event) => {

      let trigger = event.target.closest('[data-popup]');
      let close = event.target.closest('[data-popup-close]');
      let overlay = !this.current.popup?.contains(event.target);

      if (trigger) {

        this.openPopup(trigger);

      } else if (close) {

        this.closePopup();

      } else if (overlay && this.current.popup?.matches('.active')) {

        if (this.params.overlayExit) {

          this.closePopup();

        } else {

          this.params.overlayForbiddenExit?.(this, this.current);

        }

      }

    });

    if (this.params.escapeButtonExit && !this.isMobile) {

      document.addEventListener('keydown', (event) => {

        if (event.key === 'Escape' && this.current.popup?.matches('.active')) {
          this.closePopup();
        } 
        
      });

    }

  }

  openPopup(data) {

    this.params.preOpenCallback?.(this, this.current);

    this.closePopup();

    let popClass = typeof data === 'string' ? data : data.dataset.popup;

    this.current.popup = document.querySelector(`.${popClass}`);
    if (data.dataset) this.current.opener = data;

    let popup = this.current.popup;

    if (this.current.opener) this.current.opener.disabled = true;
    this.backdrop?.classList.add('active');

    this.preventPageTrembling('open');

    popup.classList.add('active');
    popup.tabIndex = -1;
    popup.addEventListener('transitionend', (event) => popup.focus(), { once: true });
    popup.focus();

    this.params.afterOpenCallback?.(this, this.current);

  }

  closePopup() {

    let popup = this.current.popup;

    if (!popup) return;

    this.params.preCloseCallback?.(this, this.current);

    if (this.current.opener) this.current.opener.disabled = '';
    this.backdrop?.classList.remove('active');

    this.preventPageTrembling('close');

    popup.classList.remove('active');
    popup.tabIndex = '';
    popup.blur();

    this.params.afterCloseCallback?.(this, this.current);

    this.current.popup = null;
    this.current.opener = null;

  }

  preventPageTrembling(state) {

    if (this.isMobile) return;

    if (this.params.pageWrapper) {

      let wrapper = document.querySelector(this.params.pageWrapper);

      if (state === 'open') {

        clearTimeout(this.scrollUnlockTimer);
        document.body.style.overflow = 'hidden';
        wrapper.style.paddingRight = this.scrollWidth + 'px';

      } else {

        this.scrollUnlockTimer = setTimeout(() => {
          document.body.style.overflow = '';
          wrapper.style.paddingRight = '';
        }, this.params.scrollUnlockTime);
        
      }

    } else {

      if (state === 'open') {

        clearTimeout(this.scrollUnlockTimer);
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = this.scrollWidth + 'px';

      } else {
        
        this.scrollUnlockTimer = setTimeout(() => {
          document.body.style.overflow = '';
          document.body.style.paddingRight = '';
        }, this.params.scrollUnlockTime);
      }

    }

  }

  createBackdrop() {

    if (!this.params.backdrop) return;

    this.backdrop = document.createElement('div');
    this.backdrop.classList.add('popup-backdrop');
    document.body.append(this.backdrop);

  }

  setClassIntoPopups() {

    Array.from(this.triggers).forEach((item) => {

      let popup = document.querySelector(`.${item.dataset.popup}`);
      if (popup) popup._popup = this;

    })

  }

}

class FormValidator {

  constructor(params) {

    this.forms = Array.from(document.querySelectorAll('[data-form]'));

    if (this.forms.length === 0) return;

    this.params = params ?? {};
    this.resetWhenChange = this.params.resetWhenChange ?? true;
    this.realTimeCheck = this.params.realTimeCheck;
    this.invalids = [];

    this.ownMethodsBinder();
    this.updateFormFields();
    this.initPhoneMask();
    this.setEventListeners();

  }

  setEventListeners() {

    document.addEventListener('submit', this.submitHandler);

    if (this.resetWhenChange || this.realTimeCheck) {
      document.addEventListener('input', this.inputHandler);
    }

  }

  submitHandler(event) {

    this.form = event.target;

    if (!this.form.closest('[data-form]')) return;

    event.preventDefault();

    this.form._elements.forEach((field) => {

      field.classList.remove('valid');

      if (field.type === 'text' || field.tagName === 'TEXTAREA' || field.type === 'search') {
        this.validateTextField(field);
      } else if (field.type === 'email') {
        this.validateEmailField(field);
      } else if (field.type === 'tel') {
        this.validatePhoneField(field);
      } else if (field.type === 'checkbox') {
        this.validateSoloCheckbox(field);
      } else if (field.tagName !== 'INPUT') {
        this.validateGroupedCheckboxRadios(field);
      }

    });

    let validInputs = this.form.querySelectorAll('.valid');

    if (validInputs.length === this.form._elements.length) {
      this.validEvent();
      // this.form.submit();
    } else {
      this.invalidEvent();
    }

  }

  inputHandler(event) {

    let input = event.target;

    if (!input.matches('[data-validate]')) return;

    input.classList.remove('valid');

    if (this.resetWhenChange) {

      if (input.matches('.invalid')) {
        input.classList.remove('invalid');
        this.resetEvent(input);
      }
      
    }

    if (this.realTimeCheck) {

      this.form = input.closest('[data-form]');

      if (input.type === 'text' || input.tagName === 'TEXTAREA' || input.type === 'search') {
        this.validateTextField(input);
      } else if (input.type === 'email') {
        this.validateEmailField(input);
      } else if (input.type === 'tel') {
        this.validatePhoneField(input);
      }

      if (this.invalids.length > 0) this.invalidEvent();

    }
 
  }

  validEvent() {

    let event = new CustomEvent('formvalid', {

      bubbles: true,
      cancelable: true,
      composed: true,

    });

    this.form.dispatchEvent(event);

  }

  invalidEvent() {

    let event = new CustomEvent('invalidinput', {

      bubbles: true,
      cancelable: true,
      composed: true,
      detail: [...this.invalids],

    });

    this.form.dispatchEvent(event);
    this.invalids.length = 0;

  }

  resetEvent(input) {

    let event = new CustomEvent('resetinput', {

      bubbles: true,
      cancelable: true,
      composed: true,
      detail: { input },

    });

    if (this.form) this.form.dispatchEvent(event);

  }

  validationError(input, msg) {

    input.classList.add('invalid');
    this.invalids.push({ input, msg });

  }

  validateTextField(input) {

    let opt = this.params.textInput ?? {};
    let value = input.value.trim();

    let isEmpty = value.length === 0;
    let isLatinText = !/[а-я]/i.test(value);
    let isCyrylicText = !/[a-z]/i.test(value);
    let isMinLengthDone = value.length >= (opt.minLength ?? 1);
    let isNotContainNumbers = !/\d+/.test(value);
    let isContainForbiddenSymbols;

    if (opt.forbiddenSymbols !== false) {
      isContainForbiddenSymbols = (opt.forbiddenSymbols ?? /[\!@\#\$\%\~\^\&\*\(\)_\=\+\{\}\[\];:'"\>\<,\./?\\\|`\-]/).test(value);
    } else {
      isContainForbiddenSymbols = false;
    }

    if (isEmpty) {
      this.validationError(input, 'Empty field');
    } else if (!isLatinText && opt.onlyLatin) {
      this.validationError(input, 'Only latins allowed');
    } else if (!isCyrylicText && opt.onlyCyrylic) {
      this.validationError(input, 'Only cyrylic allowed');
    } else if (!isNotContainNumbers && opt.noNumbers) {
      this.validationError(input, 'Digits not allowed');
    } else if (isContainForbiddenSymbols) {
      this.validationError(input, 'Forbidden symbol');
    } else if (!isMinLengthDone) {
      this.validationError(input, 'Text lower than minimum length');
    } else {
      input.classList.remove('invalid');
      input.classList.add('valid');
    }

  }

  validateEmailField(input) {

    let opt = this.params.emailInput ?? {};
    let value = input.value.trim();
    let regExp = /^[a-z][a-z0-9._-]*(?<![._-])@[a-z0-9-]+(?:\.[a-z0-9-]+)*\.[a-z]{2,}$/i;

    let isEmpty = value.length === 0;
    let isMultipleAccepted = input.multiple;
    let isMultiple = (value.match(/@/g) ?? []).length > 1;
    let isOnlyLatinSymbols = !/[а-я]/i.test(value);
    let isCorrectFormat, isAllowedDomain;

    if (isMultipleAccepted) {

      let correctCount = 0;

      let emails = value.split(' ');
    
      emails.forEach((email) => {
        if (regExp.test(email)) correctCount++;
      });

      if (correctCount === emails.length) {
        isCorrectFormat = true;
      } else {
        isCorrectFormat = false;
      }

    } else {

      isCorrectFormat = regExp.test(value);

    }

    if (opt.allowedDomains) {

      isAllowedDomain = opt.allowedDomains.some((item) => value.includes(item));

    } else {

      isAllowedDomain = true;

    }

    if (isEmpty) {
      this.validationError(input, 'Empty field');
    } else if (!isOnlyLatinSymbols) {
      this.validationError(input, 'Cyrylic symbols forbidden');
    } else if (!isMultipleAccepted && isMultiple) {
      this.validationError(input, 'More than one email');
    } else if (!isCorrectFormat) {
      this.validationError(input, 'Wrong email format');
    } else if (!isAllowedDomain) {
      this.validationError(input, 'Wrong mail service');
    } else {
      input.classList.remove('invalid');
      input.classList.add('valid');
    }

  }

  validatePhoneField(input) {

    if (this.isPhoneMaskExist) {

      let value = input._mask.unmaskedValue;
      let mask = input._mask.masked.mask;
      let maskLength = mask.match(/\d/g).length;
      let codeLength = mask.match(/\{\d+\}/)[0].length - 2;

      let isFullNumber = value.length === maskLength;
      let isEmpty = value.length === codeLength;

      if (isEmpty) {
        this.validationError(input, 'Empty field');
      } else if (!isFullNumber) {
        this.validationError(input, 'Enter full number');
      } else {
        input.classList.remove('invalid');
        input.classList.add('valid');
      }
      
    } else {

      let value = input.value.trim();
      value = value.includes('+') ? value.replace(/\+/g, '') : value;
      let opt = this.params.phoneInput ?? {};

      let isEmpty = value.length === 0;
      let isMultiple = input.multiple;
      let isContainForbiddenSymbols = /[а-яa-z!@#$%^&*\(\)_=\-\|\}\{'";:\/?\.\\>,<`~]/i.test(value);
      let isFullLength = opt.length ? value.length === opt.length : true;
      let isOverNumbered = value.length > opt.length;

      let isAllowedCountry, isCorrectFormat;

      if (opt.code) {

        if (isMultiple) {

          let phones = value.split(' ');
          let validCount = 0;

          phones.forEach((phone) => {

            if (phone.startsWith(opt.code)) validCount++;

          });

          isAllowedCountry = validCount === phones.length;

        } else {

          isAllowedCountry = value.startsWith(opt.code);

        }

      } else {

        isAllowedCountry = true;

      }

      if (isEmpty) {
        this.validationError(input, 'Empty field');
      } else if (isContainForbiddenSymbols) {
        this.validationError(input, 'Forbidden symbol');
      } else if (!isAllowedCountry) {
        this.validationError(input, 'Wrong number country');
      } else if (isOverNumbered) {
        this.validationError(input, 'Value bigger than length');
      } else if (!isFullLength) {
        this.validationError(input, 'Enter full number');
      }  else {
        input.classList.remove('invalid');
        input.classList.add('valid');
      }

    }

  }

  validateSoloCheckbox(input) {

    let isChecked = input.checked;

    if (!isChecked) {
      this.validationError(input, 'Checkbox not selected');
    } else {
      input.classList.remove('invalid');
      input.classList.add('valid');
    }

  }

  validateGroupedCheckboxRadios(element) {

    let inputs = Array.from(element.querySelectorAll('[type="checkbox"], [type="radio"]'));
    let isSomeChecked = inputs.some((input) => input.checked);

    if (!isSomeChecked) {
      this.validationError(element, 'Select at least one element');
    } else {
      element.classList.remove('invalid');
      element.classList.add('valid');
    }

  }

  async initPhoneMask() {

    if (!this.params.phoneMask) return;

    let inputs = Array.from(document.querySelectorAll('[data-form] input[type="tel"][data-validate]'));

    if (inputs.length === 0) return;

    let maskModule = await import('https://unpkg.com/imask?module');
    const IMask = maskModule.default ?? maskModule.IMask ?? window.IMask;

    inputs.forEach((input) => {

      let mask = IMask(input, this.params.phoneMask);
      input._mask = mask;

    });

    this.isPhoneMaskExist = true;

  }

  updateFormFields() {

    this.forms.forEach((form) => {

      let inputs = Array.from(form.querySelectorAll('[data-validate]'));

      form._validator = this;
      form._elements = inputs;
      
      inputs.forEach((input) => input._validator = this);

    });

  }

}






function setupMixin(...classes) {

  const mixin = {

    ownMethodsBinder() {
      let prototype = Object.getPrototypeOf(this);
      let ownMethods = Object.getOwnPropertyNames(prototype);

      for (let item of ownMethods) {
        if (item !== 'constructor') prototype[item] = prototype[item].bind(this);
      }
    }

  };

  classes.forEach((item) => Object.assign(item.prototype, mixin));

}

setupMixin(
  Notifications,
  Popup,
  FormValidator,
);

export {
  Notifications,
  Popup,
  FormValidator,
}