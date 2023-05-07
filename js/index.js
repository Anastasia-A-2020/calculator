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
  deliveryMethod: document.querySelector("#getFinishCard"),
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

function onChangeInputValue(event) {
  let procedure = null;
  if (
    refs.visitInOfficeCheckbox.checked &&
    !refs.expeditedClearanceCheckbox.checked
  ) {
    procedure = a;
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

  const extraSum = procedure ? procedure : a;
  const deliverySum = refs.deliveryMethod.value;

  console.log("минимальная стоимость:", BASE_COST);
  console.log("доплата по выбранной процедуре", extraSum);
  console.log("стоимость доставки", deliverySum);

  totalPriceValue.value = `${BASE_COST + +extraSum + +deliverySum}zl`;
  console.log("ИТОГОВАЯ СТОИМОСТЬ:", totalPriceValue.value);
}

// localStorage
// что значит вариант доставки свой адресс?
// нужна ли детализация итоговой суммы? (клиенту - нет)
// шаблон ответа на почту (сумма и детализация)
// что делает кнопка отправить? отправляет уведомление на почту?
// если удаленная услуга, но есть блик, что делать? есть ли скидка 15?

// если приезжает в офис, то без блика
// если стоит галочка получить в офисе, то убираем способыт доставки (автоматом получение в офисе)
// уведомление, что уточним адрес после готовности карты
// свой адресс - выводим поле для ввода адреса (индекс, город, улица, дом, квартира)

//отправить ссылку на калк Сергею +++
