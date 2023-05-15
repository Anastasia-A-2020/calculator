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
  extraOpportunity: document.querySelector(".extra__opportunity"),

  surchargeSum: document.querySelector("#surchargeValue"),
  prepaymentSum: document.querySelector("#prepaymentValue"),

  formEmail: document.querySelector("#email"),
  formTel: document.querySelector("#telNumber"),

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

const calculatorForm = document.querySelector(".calculator__form");
const totalPriceValue = document.querySelector("#totalPriceValue");
totalPriceValue.value = `${BASE_COST} zl`;
calculatorForm.addEventListener("change", onChangeInputValue);
calculatorForm.addEventListener("submit", onCalculatorFormSubmit);

refs.prepaymentSum.value = `${BASE_COST} zl`;
refs.surchargeSum.value = `0 zl`;

refs.formEmail.addEventListener("input", onInput);

function onCalculatorFormSubmit(event) {
  event.preventDefault();

  const myPhoneIsIn = [...document.querySelectorAll(".contacts__input")]
    .filter(el => el.checked)
    .map(el => el.value);

  const code95 = [...document.querySelectorAll(".extra__code95")]
    .filter(el => el.checked)
    .map(el => el.value);

  try {
    Email.send({
      SecureToken: "",
      To: "",
      From: "",

      Subject: "ЗАЯВКА С ФОРМЫ",
      Body: `'Почта': ${refs.formEmail.value}, <br/>
            'Телефон': ${refs.formTel.value}, <br/>
            'Мой телефон есть в': ${myPhoneIsIn}, <hr/>
            'Одновременно с картой мне нужно оформить': ${code95}, <hr/>
            'Предоплата': ${refs.prepaymentSum.value} <br/>
            'Доплата в момент получения": ${refs.surchargeSum.value} <br/>
            'Итоговая стоимость': ${totalPriceValue.value} <br/>
    `,
    }).then(message => alert(message));
  } catch (error) {
    alert("Не удалось отправить заявку");
  }

  event.currentTarget.reset();
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
  }

  if (!refs.visitInOfficeCheckbox.checked) {
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
    refs.formEmail.style.borderColor = "green";
  } else {
    refs.formEmail.style.borderColor = "red";
  }
}

function isEmailValid(value) {
  return EMAIL_REGEXP.test(value);
}
