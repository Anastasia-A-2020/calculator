const BASE_COST = 487;

const a = "0"; //без доплаты
const b = "80"; // +80

const c = "130"; // +130 + 25
const d = "145"; // +145 +25 (437 + 220)
const e = "190"; // +190

const refs = {
  expeditedClearanceCheckbox: document.getElementById(
    "expeditedClearanceCheckbox"
  ),
  visitInOfficeCheckbox: document.getElementById("visitInOfficeCheckbox"),
  getCardInOfficeCheckbox: document.getElementById("getCardInOfficeCheckbox"),
  hasBlikCheckbox: document.getElementById("hasBlikCheckbox"),
  deliveryMethod: document.querySelector("#deliveryMethod"),
  hasBlik: document.querySelector("#hasBlik"),
  selectedDeliveryMethod: document.querySelector("option[selected]"),
  textareaForOwnAdress: document.querySelector("#textareaForOwnAdress"),

  deliveryMethodsList: {
    ownAddresOption: document.querySelector("[data-addres='ownAddres']"),
    getInOfficeOption: document.querySelector("[data-addres='getInOffice']"),
    shippmentInPolandOption: document.querySelector(
      "[data-addres='shippmentInPoland']"
    ),
    shipmentInternationalOption: document.querySelector(
      "[data-addres='shipmentInternational']"
    ),
    shipmenttoTheRFOption: document.querySelector(
      "[data-addres='shipmenttoTheRF']"
    ),
  },
};

const calculatorForm = document.querySelector(".calculatorForm");
const totalPriceValue = document.querySelector("#totalPriceValue");
totalPriceValue.value = `${BASE_COST + +e}zl`;
calculatorForm.addEventListener("change", onChangeInputValue);
calculatorForm.addEventListener("submit", onCalculatorFormSubmit);

function onCalculatorFormSubmit(event) {
  // event.preventDefault();
  event.preventDefault();
  event.target.reset();
}

function onChangeInputValue() {
  let procedure = null;
  if (
    refs.visitInOfficeCheckbox.checked &&
    !refs.expeditedClearanceCheckbox.checked
  ) {
    procedure = a;
  }

  if (refs.visitInOfficeCheckbox.checked) {
    refs.hasBlik.classList.add("visually-hidden", "is-hidden");
    refs.deliveryMethodsList.getInOfficeOption.setAttribute("selected", true);
    refs.selectedDeliveryMethod?.setAttribute("selected", false);

    for (const value in Object.values(refs.deliveryMethodsList)) {
      Object.values(refs.deliveryMethodsList)[value].setAttribute(
        "disabled",
        true
      );
    }

    addClass(refs.textareaForOwnAdress, "visually-hidden", "is-hidden");
  }

  if (!refs.visitInOfficeCheckbox.checked) {
    for (const value in Object.values(refs.deliveryMethodsList)) {
      Object.values(refs.deliveryMethodsList)[value].removeAttribute(
        "disabled"
      );
    }
    refs.hasBlik.classList.remove("visually-hidden", "is-hidden");
    refs.deliveryMethodsList.getInOfficeOption.removeAttribute("selected");
    refs.deliveryMethodsList.ownAddresOption.setAttribute("selected", true);
    removeClass(refs.textareaForOwnAdress, "visually-hidden", "is-hidden");
  }

  if (
    refs.visitInOfficeCheckbox.checked &&
    refs.expeditedClearanceCheckbox.checked
  ) {
    procedure = b;
  }

  if (
    !refs.visitInOfficeCheckbox.checked &&
    refs.expeditedClearanceCheckbox.checked &&
    refs.getCardInOfficeCheckbox.checked &&
    refs.hasBlikCheckbox.checked
  ) {
    procedure = c;
  }

  if (
    !refs.visitInOfficeCheckbox.checked &&
    refs.expeditedClearanceCheckbox.checked &&
    refs.getCardInOfficeCheckbox.checked &&
    !refs.hasBlikCheckbox.checked
  ) {
    procedure = d;
  }

  if (
    !refs.visitInOfficeCheckbox.checked &&
    refs.expeditedClearanceCheckbox.checked &&
    !refs.getCardInOfficeCheckbox.checked
  ) {
    procedure = e;
  }

  if (refs.deliveryMethodsList.ownAddresOption.selected === false) {
    addClass(refs.textareaForOwnAdress, "visually-hidden", "is-hidden");
  }
  if (refs.deliveryMethodsList.ownAddresOption.selected) {
    removeClass(refs.textareaForOwnAdress, "visually-hidden", "is-hidden");
  }

  const extraSum = procedure ? procedure : a;
  const deliverySum = refs.deliveryMethod.value;

  // console.log("минимальная стоимость:", BASE_COST);
  // console.log("доплата по выбранной процедуре", extraSum);
  // console.log("стоимость доставки", deliverySum);

  totalPriceValue.value = `${BASE_COST + +extraSum + +deliverySum}zl`;
  // console.log("ИТОГОВАЯ СТОИМОСТЬ:", totalPriceValue.value);
}

function addClass(element, ...className) {
  return element.classList.add(...className);
}

function removeClass(element, ...className) {
  return element.classList.remove(...className);
}

// localStorage

// +++ нужна ли детализация итоговой суммы? (клиенту - нет)
// шаблон ответа на почту (сумма и детализация)
// что делает кнопка отправить? отправляет уведомление на почту?
// если удаленная услуга, но есть блик, что делать? есть ли скидка 15?

// +++ если приезжает в офис, то без блика
// +++ если стоит галочка получить в офисе, то убираем способы доставки (автоматом получение в офисе)
// уведомление, что уточним адрес после готовности карты
// свой адресс - выводим поле для ввода адреса (индекс, город, улица, дом, квартира)

// +++ отправить ссылку на калк Сергею

// +++ 2.5 пересылка в РФ +185 - здесь пожалуйста измените цифру 185 на 200
// +++ добавить поля Одновременно с картой мне требуется...
// +++ 4.1 и 4.2 не могут помечаться одновременно
// +++ 4.3 может быть выбран одновременно с 4.1 либо 4.2
// Не суммируется скидка по принципу 75+100 или 90+100. Большая величина (100) всегда поглощает меньшую (75 или 90) в случае если активирована 4.3
// +++ 1) поле "Выберите способ получения карты" пусть по умолчанию имеет позицию "свой адрес = 0зл"

// 2) графа "Вам нужно ускоренное оформление?" должна появляться только если клиент активировал поле "Вы готовы приехать лично на подачу документов?" Удаленные процедуры без приезда в офис автоматически являются ускоренными
// +/- По пункту 2) - Как вариант можно сделать чтобы Ускоренное оформление всегда было активно поле (статус галочки ДА), а возможность отмены появлялась только при активации личной подачи.
