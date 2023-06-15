const BASE_COST = "487"; // базовая цена карты
const a = "0"; // "ОФИС-25"
const b = "80"; //  "ОФИС-12"
const c = "130"; // "БЛИК"
const d = "190"; // "РАССРОЧКА"
const e = "190"; // "УДАЛЁННАЯ"
const surchargeSumForProcedureD = "200 zl"; //доплата по процедуре Рассрочка (Д)

const discountsList = {
  shortCode95: "75", // скидка при одновременнос оформлении карты и короткого кода 95
  longCode95: "90", // скидка при одновременнос оформлении карты и длинного кода 95
  noCode95: "0", // если нужна только карта
};

const deliveryPrices = {
  ownAddres: "0", // свой адрес (с личным получением заказного письма)
  getInOffice: "50", // получение в офисе
  shippmentInPoland: "100", // пересылка по Польше
  shipmentInternational: "150", // международная пересылка, кроме РФ
  shipmenttoTheRF: "200", // пересылка в РФ
};

const refs = {
  calculatorForm: document.querySelector("#calculator__form"),
  totalPriceValue: document.querySelector("#totalPriceValue"),
  expeditedClearanceCheckbox: document.getElementById(
    "expeditedClearanceCheckbox"
  ),
  standartClearanceCheckbox: document.querySelector(
    "#standartClearanceCheckbox"
  ),
  getCardInOfficeCheckbox: document.getElementById("getCardInOfficeCheckbox"),
  hasBlikCheckbox: document.getElementById("hasBlikCheckbox"),
  deliveryMethod: document.querySelector("#deliveryMethod"),
  blickQuestion: document.querySelector("#blickQuestion"),
  blickQuestionCheckbox: document.querySelector("#blickQuestionCheckbox"),
  hasBlik: document.querySelector("#hasBlik"),
  expeditedClearance: document.querySelector("#expeditedClearance"),
  expeditedClearanceCheckbox: document.querySelector(
    "#expeditedClearanceCheckbox"
  ),
  standartClearance: document.querySelector("#standartClearance"),
  selectedDeliveryMethod: document.querySelector("option[selected]"),
  extraOpportunity: document.querySelector(".extra__opportunity"),

  surchargeSum: document.querySelector("#surchargeValue"),
  prepaymentSum: document.querySelector("#prepaymentValue"),

  formName: document.querySelector("#name"),
  formEmail: document.querySelector("#email"),
  formTel: document.querySelector("#telNumber"),
  formPolTel: document.querySelector("#polTelNumber"),
  formPesel: document.querySelector("#pesel"),
  formAddress: document.querySelector("#address"),

  btnSabmit: document.querySelector(".calulator__btn-sabmit"),
  payInOffice: document.querySelector("#payInOffice"),
  paymentBlock: document.querySelector("#paymentBlock"),
  paymentMethod: document.querySelectorAll("[name='paymentMethod']"),
  contacts: document.querySelector("#contacts"),
  openUserformBtn: document.querySelector("#openUserformBtn"),
  backdrop: document.querySelector(".backdrop"),
  modalBtn: document.querySelector(".modal__submit"),

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

{
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
  refs.prepaymentSum.value = `${parseInt(BASE_COST)} zl`;
  refs.surchargeSum.value = `0 zl`;
  refs.totalPriceValue.value = `${parseInt(BASE_COST)} zl`;

  refs.calculatorForm.addEventListener("change", onChangeInputValue);
  refs.calculatorForm.addEventListener("submit", onCalculatorFormSubmit);
  refs.formEmail.addEventListener("input", onInput);
  refs.formTel.addEventListener("input", onInputTel);
  refs.formPolTel.addEventListener("input", onInputTel);
  refs.formPesel.addEventListener("input", onInputPesel);
  refs.openUserformBtn.addEventListener("click", onOpenUserformBtnClick);
  refs.modalBtn.addEventListener(
    "click",
    addClass,
    refs.backdrop,
    "visually-hidden",
    "is-hidden"
  );
}

function onCalculatorFormSubmit(event) {
  event.preventDefault();

  const userName = refs.formName.value.trim();
  const email = refs.formEmail.value.trim();
  const phone = refs.formTel.value.trim();
  const myPhoneIsIn = [...document.querySelectorAll(".contacts__input")]
    .filter(el => el.checked)
    .map(el => el.value);
  const deadlineForPaperwork = `${
    refs.standartClearanceCheckbox.checked
      ? "обычное, 25 дней"
      : "ускоренное, 12 дней"
  }`;
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
  const prepayment = `${refs.prepaymentSum.value}`;
  const surcharge = `${refs.surchargeSum.value}`; //доплата
  const totalSum = `${refs.totalPriceValue.value}`;
  const payMethod = [...refs.paymentMethod].find(el => el.checked);
  const paymentMethod = `${
    refs.payInOffice.classList.contains("visually-hidden")
      ? `Способ оплаты: ${payMethod.value}`
      : `Способ оплаты: наличными в офиссе `
  }`;
  const personalSubmissionOfDocs = `${
    document.querySelector("#comeToOffice").checked
      ? `Вы готовы лично приехать в Варшаву для подачи документов? - ДА <br />`
      : " "
  }`;
  const delivery = [...document.querySelectorAll("[data-delivery]")].find(
    el => el.selected
  ).dataset.delivery;
  const hasEarlyChip = [
    ...document.querySelectorAll("[data-hasChipearly]"),
  ].find(el => el.selected).value;
  const whoPay = [...document.querySelectorAll("[data-pay]")].find(
    el => el.selected
  ).value;
  const hasBlickSystemChecked = refs.blickQuestionCheckbox.checked
    ? "Да"
    : "Нет";
  const hasBlickSystem = `Есть доступ к системе оплаты Blick: ${
    (refs.hasBlikCheckbox.checked && "Да") || hasBlickSystemChecked
  } <hr />`;
  const isBlick = `${
    !document.querySelector("#comeToOffice").checked ? hasBlickSystem : " "
  }`;
  const peselNumber = refs.formPesel.value.trim()
    ? refs.formPesel.value.trim()
    : "00000000000";
  const polPhoneNumber = refs.formPolTel.value.trim()
    ? refs.formPolTel.value.trim()
    : "00000000";
  const address = refs.formAddress.value.trim()
    ? `Адресс: &#x20; ${refs.formAddress.value.trim()} <hr/>`
    : " ";

  try {
    Email.send({
      // SecureToken: "ec88ce96-761e-461f-9b06-00ca22ca8bfb",
      // To: "infobynet@gmail.com",
      // From: "infobynet@gmail.com",

      SecureToken: "62858ea7-1d3a-4ba2-bc6a-1e5656d45026",
      To: "a-a2018@ukr.net",
      From: "a-a2018@ukr.net",

      Subject: "ЗАЯВКА С ФОРМЫ",
      Body: `Calculator95 <hr/>
            Имя:  &#x20; ${userName}, <br/>
            Почта: &#x20; ${email}, <br/>
            Телефон: &#x20; ${phone}, <br/>
            Мой телефон есть в: &#x20; ${myPhoneIsIn}, <br/>
            Номер Pesel:  &#x20; ${peselNumber}, <br/>
            Польский номер телефона: &#x20; ${polPhoneNumber}, <br/>
            Оформление: &#x20; ${deadlineForPaperwork}, <hr/>
            ${paymentMethod} <hr/>
            ${personalSubmissionOfDocs}
            ${isBlick}
            Был ли чип раньше: &#x20; ${hasEarlyChip} <hr/>            
            Способ доставки:  &#x20; ${delivery} <br />           
            ${address} 
            Одновременно с картой мне нужно оформить: &#x20;  ${idCode95} &#x20; = &#x20; ${valueCode95}, <hr/>           
            Предоплата: &#x20; ${prepayment} <br/>
            Доплата в момент получения: &#x20;  ${surcharge} <br/>
            Итоговая стоимость: &#x20; ${totalSum} <hr/>             
            Кто оплачивает: &#x20; ${whoPay} <hr/>
    `,
    }).then(data => removeClass(refs.backdrop, "visually-hidden", "is-hidden"));
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
    refs.standartClearanceCheckbox.checked = "true";
  }

  if (refs.deliveryMethodsList.getInOfficeOption.selected) {
    refs.getCardInOfficeCheckbox.checked = true;
    refs.surchargeSum.value = `${parseInt(deliveryPrices.getInOffice)} zl`;
    if (visitInOffice) {
      refs.surchargeSum.value = " 0 zl";
    }
  } else {
    refs.getCardInOfficeCheckbox.checked = false;
    refs.surchargeSum.value = `0 zl`;
  }

  if (visitInOffice) {
    addClass(refs.hasBlik, "visually-hidden", "is-hidden");
    removeClass(refs.standartClearance, "visually-hidden", "is-hidden");
    addClass(refs.blickQuestion, "visually-hidden", "is-hidden");
    removeClass(refs.payInOffice, "visually-hidden", "is-hidden");
    addClass(refs.paymentBlock, "visually-hidden", "is-hidden");
  }

  if (!visitInOffice) {
    refs.expeditedClearanceCheckbox.checked = true;
    addClass(refs.standartClearance, "visually-hidden", "is-hidden");
    addClass(refs.payInOffice, "visually-hidden", "is-hidden");
    removeClass(refs.paymentBlock, "visually-hidden", "is-hidden");

    if (refs.deliveryMethodsList.getInOfficeOption.selected) {
      removeClass(refs.hasBlik, "visually-hidden", "is-hidden");
      addClass(refs.blickQuestion, "visually-hidden", "is-hidden");
      refs.blickQuestionCheckbox.checked = false;
    } else {
      addClass(refs.hasBlik, "visually-hidden", "is-hidden");
      refs.hasBlikCheckbox.checked = false;
      removeClass(refs.blickQuestion, "visually-hidden", "is-hidden");
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
    !refs.getCardInOfficeCheckbox.checked &&
    refs.blickQuestionCheckbox.checked
  ) {
    procedure = c;
  }

  if (
    !visitInOffice &&
    refs.expeditedClearanceCheckbox.checked &&
    refs.getCardInOfficeCheckbox.checked &&
    !refs.hasBlikCheckbox.checked &&
    !refs.blickQuestionCheckbox.checked
  ) {
    procedure = d;
    refs.surchargeSum.value = surchargeSumForProcedureD;
  }

  if (
    !visitInOffice &&
    refs.expeditedClearanceCheckbox.checked &&
    !refs.getCardInOfficeCheckbox.checked &&
    !refs.blickQuestionCheckbox.checked
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

    if (
      refs.deliveryMethodsList.getInOfficeOption.selected &&
      visitInOffice &&
      refs.standartClearanceCheckbox.checked
    ) {
      refs.totalPriceValue.value = `${
        parseInt(BASE_COST) +
        parseInt(deliveryPrices.getInOffice) -
        parseInt(discount.value)
      } zl`;
    }
  } else {
    refs.totalPriceValue.value = `${
      parseInt(BASE_COST) + parseInt(extraSum) + parseInt(deliverySum)
    } zl`;
    if (refs.deliveryMethodsList.getInOfficeOption.selected && visitInOffice) {
      refs.totalPriceValue.value = `${parseInt(BASE_COST)} zl`;
    }
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
  const email = refs.formEmail.value.trim();

  if (isEmailValid(email)) {
    refs.formEmail.style.borderColor = "#2E8B57cc";
  } else {
    refs.formEmail.style.borderColor = "#CD5C5Ccc";
  }
}

function onInputTel(e) {
  if (String(e.target.value).length > 7 && String(e.target.value).length < 17) {
    e.target.style.borderColor = "#2E8B57cc";
  } else {
    e.target.style.borderColor = "#CD5C5Ccc";
  }
}

function onInputPesel(e) {
  if (
    String(e.target.value).length === 11 ||
    String(e.target.value).length === 0
  ) {
    e.target.style.borderColor = "#2E8B57cc";
  } else {
    e.target.style.borderColor = "#CD5C5Ccc";
  }
}

function isEmailValid(value) {
  return EMAIL_REGEXP.test(value);
}

function onOpenUserformBtnClick(e) {
  removeClass(refs.contacts, "visually-hidden", "is-hidden");
  addClass(refs.openUserformBtn, "visually-hidden", "is-hidden");
}

function onHasEarlyChipClick(e) {
  console.log(e.target.value);
}
