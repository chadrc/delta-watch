import DeltaWatch from 'delta-watch';
declare const M: any; // Materialize CSS global

interface DeliveryFormData {
  fullName: string
  address: string
  email: string
  phone: string
  deliveryDate: string
  deliveryTime: string
  additionalOptions: string[]
  agreedToTerms: boolean
}

// Validation Utilities
const emailRegex = /^[a-zA-Z].*@*.\..*[a-zA-Z]$/;
const phoneRegex = /^[0-9]{3}-[0-9]{3}-[0-9]{4}/;

function isValidEmail(email: string) {
  return emailRegex.test(email);
}

function isValidPhone(phone: string) {
  return phoneRegex.test(phone);
}

function isEmpty(str: string) {
  return str.trim() === '';
}

function isValidDeliveryFormData(data: DeliveryFormData) {
  return !isEmpty(data.fullName)
    && !isEmpty(data.address)
  && isValidEmail(data.email)
  && isValidPhone(data.phone)
  && !isEmpty(data.deliveryDate)
  && !isEmpty(data.deliveryTime)
  && data.agreedToTerms === true;
}

window.addEventListener('load', () => {

  // Get all form elements
  const fullNameInput = document.getElementById('fullName');
  const addressInput = document.getElementById('address');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const deliveryDatePickerInput = document.getElementById('deliveryDate');
  const deliveryTimePickerInput = document.getElementById('deliveryTime');
  const additionalOptionsSelect = document.getElementById('additionalOptions');
  const termsAgreementCheckbox = document.getElementById('termsAgreement');
  const submitBtn = document.getElementById('submitBtn');

  // Materialize CSS initialization
  const deliveryDatePickerInstance = M.Datepicker.init(deliveryDatePickerInput, {});
  const deliveryTimePickerInstance = M.Timepicker.init(deliveryTimePickerInput, {});
  const additionalOptionsSelectInstance = M.FormSelect.init(additionalOptionsSelect, {});

  // Data setup
  const formData = DeltaWatch.Watchable({
    fullName: "",
    address: "",
    email: "",
    phone: "",
    deliveryDate: "",
    deliveryTime: "",
    additionalOptions: [],
    agreedToTerms: false
  });

  const {Watcher, Accessor, Mutator} = formData;

  // Setup watchers
  // Only need watchers on values we are going to validate
  // For this form, we are going to validate the email and phone inputs
  // and the submit button will be enabled/disabled depending on validity of the form data
  DeltaWatch.Watch(Watcher, (data: DeliveryFormData) => {
    if (isValidDeliveryFormData(data)) {
      submitBtn.removeAttribute('disabled');
    } else {
      submitBtn.setAttribute('disabled', '');
    }
  });

  DeltaWatch.Watch(Watcher.email, (email: string) => {
    console.log('email', email);
    if (isValidEmail(email)) {
      emailInput.classList.remove('invalid')
    } else {
      emailInput.classList.add('invalid')
    }
  });

  DeltaWatch.Watch(Watcher.phone, (phone: string) => {
    console.log('phone', phone);
    if (isValidPhone(phone)) {
      phoneInput.classList.remove('invalid')
    } else {
      phoneInput.classList.add('invalid')
    }
  });

  // Set up one way binding mutations
  fullNameInput.addEventListener('change', (event) => {
    Mutator.fullName = (event.target as HTMLInputElement).value;
  });

  addressInput.addEventListener('change', (event) => {
    Mutator.address = (event.target as HTMLInputElement).value;
  });

  emailInput.addEventListener('change', (event) => {
    Mutator.email = (event.target as HTMLInputElement).value;
  });

  phoneInput.addEventListener('change', (event) => {
    Mutator.phone = (event.target as HTMLInputElement).value;
  });

  deliveryDatePickerInput.addEventListener('change', (event) => {
    Mutator.deliveryDate = (event.target as HTMLInputElement).value;
  });

  deliveryTimePickerInput.addEventListener('change', (event) => {
    Mutator.deliveryTime = (event.target as HTMLInputElement).value;
  });

  additionalOptionsSelect.addEventListener('change', (event) => {
    let options = (event.target as HTMLSelectElement).selectedOptions;
    let values = [];
    for (let i=0; i<options.length; i++) {
      let option = options.item(i);
      values.push(option.value);
    }
    Mutator.additionalOptions = values;
  });

  termsAgreementCheckbox.addEventListener('change', (event) => {
    Mutator.agreedToTerms = (event.target as HTMLInputElement).checked;
  });
});