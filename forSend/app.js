const BASE_COST = "487"; // базовая цена карты

const a = "0"; // "ОФИС-25"
const b = "80"; //  "ОФИС-12"
const c = "130"; // "БЛИК"
const d = "145"; // "РАССРОЧКА" 487 +145 +25 = (437 + 220)
const e = "190"; // "УДАЛЁННАЯ"

const discountsList = {
  shortCode95: "75", // скидка при одновременнос оформлении карты и короткого кода 95
  longCode95: "90", // скидка при одновременнос оформлении карты и длинного кода 95
  noCode95: "0", // если нужна только карта
};

const deliveryPrices = {
  ownAddres: "0", // свой адрес (с личным получением заказного письма)
  getInOffice: "25", // получение в офисе
  shippmentInPoland: "75", // пересылка по Польше
  shipmentInternational: "125", // международная пересылка, кроме РФ
  shipmenttoTheRF: "200", // пересылка в РФ
};

const surchargeSumForProcedureD = "220 zl"; //доплата по процедуре Рассрочка (Д)

const refs = {
  calculatorForm: document.querySelector(".calculator__form"),
  totalPriceValue: document.querySelector("#totalPriceValue"),
  expeditedClearanceCheckbox: document.getElementById(
    "expeditedClearanceCheckbox"
  ),
  getCardInOfficeCheckbox: document.getElementById("getCardInOfficeCheckbox"),
  hasBlikCheckbox: document.getElementById("hasBlikCheckbox"),
  deliveryMethod: document.querySelector("#deliveryMethod"),
  hasBlik: document.querySelector("#hasBlik"),
  expeditedClearance: document.querySelector("#expeditedClearance"),
  expeditedClearanceCheckbox: document.querySelector(
    "#expeditedClearanceCheckbox"
  ),
  selectedDeliveryMethod: document.querySelector("option[selected]"),
  extraOpportunity: document.querySelector(".extra__opportunity"),

  surchargeSum: document.querySelector("#surchargeValue"),
  prepaymentSum: document.querySelector("#prepaymentValue"),

  formEmail: document.querySelector("#email"),
  formTel: document.querySelector("#telNumber"),
  btnSabmit: document.querySelector(".calulator__btn-sabmit"),

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

const EMAIL_REGEXP =
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;

document.getElementById("ownAddres").value = deliveryPrices.ownAddres;
document.getElementById("getInOffice").value = deliveryPrices.getInOffice;
document.getElementById("shippmentInPoland").value =
  deliveryPrices.shippmentInPoland;
document.getElementById("shipmentInternational").value =
  deliveryPrices.shipmentInternational;

document.getElementById("shipmenttoTheRF").value =
  deliveryPrices.shipmenttoTheRF;

document.querySelector("#shortCode95").value = discountsList.shortCode95;
document.querySelector("#longCode95").value = discountsList.longCode95;
document.querySelector("#noCode95").value = discountsList.noCode95;

refs.totalPriceValue.value = `${parseInt(BASE_COST)} zl`;
refs.calculatorForm.addEventListener("change", onChangeInputValue);
refs.calculatorForm.addEventListener("submit", onCalculatorFormSubmit);
refs.prepaymentSum.value = `${parseInt(BASE_COST)} zl`;
refs.surchargeSum.value = `0 zl`;

refs.formEmail.addEventListener("input", onInput);
refs.formTel.addEventListener("input", onInputTel);

function onCalculatorFormSubmit(event) {
  event.preventDefault();

  const myPhoneIsIn = [...document.querySelectorAll(".contacts__input")]
    .filter(el => el.checked)
    .map(el => el.value);

  const code95 = [...document.querySelectorAll(".extra__code95")]
    .filter(el => el.checked)
    .map(el => {
      return {
        value: el.value,
        id: el.id,
      };
    });
  code95.forEach(el => {
    return ({ id: idCode95, value: valueCode95 } = el);
  });

  try {
    Email.send({
      SecureToken: "ec88ce96-761e-461f-9b06-00ca22ca8bfb",
      To: "infobynet@gmail.com",
      From: "infobynet@gmail.com",

      Subject: "ЗАЯВКА С ФОРМЫ",
      Body: `Calculator95 <hr/>
      'Почта:' &#x20; ${refs.formEmail.value}, <br/>
            'Телефон:' &#x20; ${refs.formTel.value}, <br/>
            'Мой телефон есть в:' &#x20; ${myPhoneIsIn}, <hr/>
            'Одновременно с картой мне нужно оформить:' &#x20;  ${idCode95} &#x20; = &#x20; ${valueCode95}, <hr/>
            'Предоплата:' &#x20; ${refs.prepaymentSum.value} <br/>
            'Доплата в момент получения:' &#x20;  ${refs.surchargeSum.value} <br/>
            'Итоговая стоимость:' &#x20; ${refs.totalPriceValue.value} <br/>
    `,
    }).then(message => alert(message));
  } catch (error) {
    alert("Не удалось отправить заявку");
  }

  event.currentTarget.reset();
}

function onChangeInputValue() {
  let procedure = null;
  const visitInOffice = document.querySelector("#comeToOffice").checked;

  if (visitInOffice && !refs.expeditedClearanceCheckbox.checked) {
    procedure = a;
  }

  if (refs.deliveryMethodsList.getInOfficeOption.selected) {
    refs.getCardInOfficeCheckbox.checked = true;
    refs.surchargeSum.value = `${parseInt(deliveryPrices.getInOffice)} zl`;
  } else {
    refs.getCardInOfficeCheckbox.checked = false;
    refs.surchargeSum.value = `0 zl`;
  }

  if (visitInOffice) {
    addClass(refs.hasBlik, "visually-hidden", "is-hidden");
    removeClass(refs.expeditedClearance, "visually-hidden", "is-hidden");
  }

  if (!visitInOffice) {
    refs.expeditedClearanceCheckbox.checked = true;
    addClass(refs.expeditedClearance, "visually-hidden", "is-hidden");

    if (refs.deliveryMethodsList.getInOfficeOption.selected) {
      removeClass(refs.hasBlik, "visually-hidden", "is-hidden");
    } else {
      addClass(refs.hasBlik, "visually-hidden", "is-hidden");
    }

    refs.deliveryMethodsList.getInOfficeOption.removeAttribute("selected");
    refs.deliveryMethodsList.ownAddresOption.setAttribute("selected", true);
  }

  if (visitInOffice && refs.expeditedClearanceCheckbox.checked) {
    procedure = b;
  }

  if (
    !visitInOffice &&
    refs.expeditedClearanceCheckbox.checked &&
    refs.getCardInOfficeCheckbox.checked &&
    refs.hasBlikCheckbox.checked
  ) {
    procedure = c;
  }

  if (
    !visitInOffice &&
    refs.expeditedClearanceCheckbox.checked &&
    refs.getCardInOfficeCheckbox.checked &&
    !refs.hasBlikCheckbox.checked
  ) {
    procedure = d;
    refs.surchargeSum.value = surchargeSumForProcedureD;
  }

  if (
    !visitInOffice &&
    refs.expeditedClearanceCheckbox.checked &&
    !refs.getCardInOfficeCheckbox.checked
  ) {
    procedure = e;
  }

  const extraSum = procedure ? procedure : a;
  const deliverySum = refs.deliveryMethod.value;

  const discount = getDiscount([
    ...document.querySelectorAll(".chooseCode input"),
  ]);

  if (discount.value) {
    refs.totalPriceValue.value = `${
      parseInt(BASE_COST) +
      parseInt(extraSum) +
      parseInt(deliverySum) -
      parseInt(discount.value)
    } zl`;
  } else {
    refs.totalPriceValue.value = `${
      parseInt(BASE_COST) + parseInt(extraSum) + parseInt(deliverySum)
    } zl`;
  }

  refs.prepaymentSum.value = `${
    parseInt(refs.totalPriceValue.value) - parseInt(refs.surchargeSum.value)
  } zl`;

  if (
    isEmailValid(refs.formEmail.value) &&
    String(refs.formTel.value).length > 7 &&
    String(refs.formTel.value).length < 17
  ) {
    refs.btnSabmit.removeAttribute("disabled");
  } else {
    refs.btnSabmit.setAttribute("disabled", "disabled");
  }
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

function onInput() {
  if (isEmailValid(refs.formEmail.value)) {
    refs.formEmail.style.borderColor = "#2E8B57cc";
  } else {
    refs.formEmail.style.borderColor = "#CD5C5Ccc";
  }
}

function onInputTel() {
  if (
    String(refs.formTel.value).length > 7 &&
    String(refs.formTel.value).length < 17
  ) {
    refs.formTel.style.borderColor = "#2E8B57cc";
  } else {
    refs.formTel.style.borderColor = "#CD5C5Ccc";
  }
}

function isEmailValid(value) {
  return EMAIL_REGEXP.test(value);
}
