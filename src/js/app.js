const BASE_COST = 487;

const a = "0";
const b = "80";
const c = "130";
const d = "145"; // +145 +25 (437 + 220)
const e = "190";

const discountsList = {
  shortCode95: "75",
  longCode95: "90",
  noCode95: "0",
};

const deliveryPrices = {
  getInoffice: 25,
};

const surchargeSumForProcedureD = "220 zl";
// создать переменные для стоимости доставки (все варианты)

const refs = {
  expeditedClearanceCheckbox: document.getElementById(
    "expeditedClearanceCheckbox"
  ),
  visitInOfficeCheckbox: document.getElementById("visitInOfficeCheckbox"),
  getCardInOfficeCheckbox: document.getElementById("getCardInOfficeCheckbox"),
  hasBlikCheckbox: document.getElementById("hasBlikCheckbox"),
  deliveryMethod: document.querySelector("#deliveryMethod"),
  hasBlik: document.querySelector("#hasBlik"),
  expeditedClearance: document.querySelector("#expeditedClearance"),
  expeditedClearanceCheckbox: document.querySelector(
    "#expeditedClearanceCheckbox"
  ),
  selectedDeliveryMethod: document.querySelector("option[selected]"),
  textareaForOwnAdress: document.querySelector("#textareaForOwnAdress"),
  extraOpportunity: document.querySelector(".extra__opportunity"),
  // category_CE: document.querySelector("#category_CE"),

  surchargeSum: document.querySelector("#SurchargeValue"),
  prepaymentSum: document.querySelector("#PrepaymentValue"),

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
totalPriceValue.value = `${BASE_COST} zl`;
calculatorForm.addEventListener("change", onChangeInputValue);
calculatorForm.addEventListener("submit", onCalculatorFormSubmit);

refs.prepaymentSum.value = `${BASE_COST} zl`;
refs.surchargeSum.value = `0 zl`;

function onCalculatorFormSubmit(event) {
  event.preventDefault();
  console.log("hi");
  event.currentTarget.reset();
  console.log("hello");
  alert("Мы уточним адрес доставки после готовности карты.");
}

function onChangeInputValue() {
  let procedure = null;

  if (
    refs.visitInOfficeCheckbox.checked &&
    !refs.expeditedClearanceCheckbox.checked
  ) {
    procedure = a;
  }

  if (refs.deliveryMethodsList.getInOfficeOption.selected) {
    refs.getCardInOfficeCheckbox.checked = true;
    refs.surchargeSum.value = `${parseInt(deliveryPrices.getInoffice)} zl`;
  } else {
    refs.getCardInOfficeCheckbox.checked = false;
    refs.surchargeSum.value = `0 zl`;
  }

  if (refs.visitInOfficeCheckbox.checked) {
    addClass(refs.hasBlik, "visually-hidden", "is-hidden");
    removeClass(refs.expeditedClearance, "visually-hidden", "is-hidden");

    // refs.selectedDeliveryMethod?.setAttribute("selected", false);
    // for (const value in Object.values(refs.deliveryMethodsList)) {
    //   const optionValue = Object.values(refs.deliveryMethodsList)[value];
    //   if (
    //     optionValue.dataset.addres === "getInOffice" ||
    //     optionValue.dataset.addres === "ownAddres"
    //   ) {
    //     continue;
    //   }
    //   optionValue.setAttribute("disabled", true);
    // }
    // refs.deliveryMethodsList.ownAddresOption.setAttribute("selected", true);
  }

  if (!refs.visitInOfficeCheckbox.checked) {
    refs.expeditedClearanceCheckbox.checked = true;
    addClass(refs.expeditedClearance, "visually-hidden", "is-hidden");
    // for (const value in Object.values(refs.deliveryMethodsList)) {
    //   Object.values(refs.deliveryMethodsList)[value].removeAttribute(
    //     "disabled"
    //   );
    // }

    if (refs.deliveryMethodsList.getInOfficeOption.selected) {
      removeClass(refs.hasBlik, "visually-hidden", "is-hidden");
    } else {
      addClass(refs.hasBlik, "visually-hidden", "is-hidden");
    }

    refs.deliveryMethodsList.getInOfficeOption.removeAttribute("selected");
    refs.deliveryMethodsList.ownAddresOption.setAttribute("selected", true);
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
    refs.surchargeSum.value = surchargeSumForProcedureD;
  }

  if (
    !refs.visitInOfficeCheckbox.checked &&
    refs.expeditedClearanceCheckbox.checked &&
    !refs.getCardInOfficeCheckbox.checked
  ) {
    procedure = e;
  }

  const extraSum = procedure ? procedure : a;
  const deliverySum = refs.deliveryMethod.value;

  // if (category_CE.checked) {
  //   return (totalPriceValue.value = `${
  //     +BASE_COST + +extraSum + +deliverySum - +refs.category_CE.value
  //   }zl`);
  // }

  // if (!category_CE.checked) {
  //   let discount = getDiscount([
  //     ...document.querySelectorAll(".chooseCode input"),
  //   ]);
  //   if (discount.value) {
  //     return (totalPriceValue.value = `${
  //       +BASE_COST + +extraSum + +deliverySum - +discount.value
  //     }zl`);
  //   }

  //   totalPriceValue.value = `${+BASE_COST + +extraSum + +deliverySum}zl`;
  // }

  const discount = getDiscount([
    ...document.querySelectorAll(".chooseCode input"),
  ]);

  if (discount.value) {
    totalPriceValue.value = `${
      +BASE_COST + +extraSum + +deliverySum - +discount.value
    } zl`;
  } else {
    totalPriceValue.value = `${+BASE_COST + +extraSum + +deliverySum} zl`;
  }

  refs.prepaymentSum.value = `${
    parseInt(totalPriceValue.value) - parseInt(refs.surchargeSum.value)
  } zl`;

  // console.log("минимальная стоимость:", BASE_COST);
  // console.log("доплата по выбранной процедуре", extraSum);
  // console.log("стоимость доставки", deliverySum);
  // console.log("сумма скидки: ", discount.value);
  // console.log("ИТОГОВАЯ СТОИМОСТЬ:", totalPriceValue.value);
}

function getDiscount(arr) {
  return arr.find(element => element.checked);
}

function addClass(element, ...className) {
  return element.classList.add(...className);
}

function removeClass(element, ...className) {
  return element.classList.remove(...className);
}

// localStorage
// +++ очистка формы после отправки
// +++ не работает сабмит, если установить привент дефолт
// добавить валидацию на форму, плюс убрать зависимость от регистра
// проверка на заполненность обязательных полей формы

// +++ нужна ли детализация итоговой суммы? (клиенту - нет)
// шаблон ответа на почту (сумма и детализация)
// что делает кнопка отправить? отправляет уведомление на почту?
// +++ если удаленная услуга, но есть блик, что делать? есть ли скидка 15?

// +++ если приезжает в офис, то без блика
// +++ если стоит галочка получить в офисе, то убираем способы доставки (автоматом получение в офисе)
// +++ уведомление, что уточним адрес после готовности карты
// +++ свой адресс - выводим поле для ввода адреса (индекс, город, улица, дом, квартира)
// +++ добавить стили для своего адреса

// +++ отправить ссылку на калк Сергею

// +++ 2.5 пересылка в РФ +185 - здесь пожалуйста измените цифру 185 на 200
// +++ добавить поля Одновременно с картой мне требуется...
// +++ 4.1 и 4.2 не могут помечаться одновременно
// +++ 4.3 может быть выбран одновременно с 4.1 либо 4.2
// +++ Не суммируется скидка по принципу 75+100 или 90+100. Большая величина (100) всегда поглощает меньшую (75 или 90) в случае если активирована 4.3
// +++ 1) поле "Выберите способ получения карты" пусть по умолчанию имеет позицию "свой адрес = 0зл"

//собрать все переменные в отдельный блок

// +++ 2) графа "Вам нужно ускоренное оформление?" должна появляться только если клиент активировал поле "Вы готовы приехать лично на подачу документов?" Удаленные процедуры без приезда в офис автоматически являются ускоренными
// +++ По пункту 2) - Как вариант можно сделать чтобы Ускоренное оформление всегда было активно поле (статус галочки ДА), а возможность отмены появлялась только при активации личной подачи.
// +++ image

// +++ Блок "Одновременно с картой мне  требуется" я бы выделил отдельным цветом или может взять в рамку? Чтобы было понятно клиенту, что это единое смысловое поле, влияющее на скидку.

// +++ Поле "Введите адрес доставки" переназываем на "Введите ваш контактный номер телефона вместе с кодом страны" и рядом чекбоксы/флажки "Мой телефон есть в:"
// ✅ Viber
// ✅ Telegram
// ✅ WhatsApp

// +++ И пожалуйста ниже плюс одно поле. "Ваша электронная почта"
// +++ С верификацией существования почтового ящика (на случай ошибочного ввода) - если такое возможно конечно...) - не удолось

// +++Вы готовы приехать лично - ДА. Вам нужно ускоренное - НЕТ. При этой комбинации не выбирается доставка, жёстко привязано "Получение в офисе"

// +++ Сейчас по умолчанию калькулятор выдает Итоговая стоимость 677. Было бы неплохо на стартовой форме высвечивать минимально возможную оплату - 487, то есть сочетание "Приехать лично" ДА + "Свой адрес"

// +++ Либо как вариант поднять поле "Выберите способ получения" вверх чтобы не дублировать вопрос способа получения карты.
// +++ Тогда поле "У вас есть доступ к Blik?" Должно появляться только при одновременном выполнении: Вы готовы приехать лично - НЕТ. Выбор в выпадающем меню - "получение в офисе"

//+++ кнопка отправить такая же, как и сумма или влево передвинуть
//+++ контакты должно быть всегда видно
//+++ вся форма должна быть маленькой
// +++ картинка внутри формы

// +++ Кнопка N°1 предоплата Кнопка N°2 доплата в момент получения Кнопка N°3 итоговая стоимость
// +++ Кнопка N°1 = N°3 минус N°2. N°3 уже считается корректно

// ПРЕДЛОЖЕНИЕ
// +++ отправить клиенту расшифровку суммы на почту (через алерт спросить нужно ли ему это) - не нужно!
