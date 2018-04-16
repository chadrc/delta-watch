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

function makeDefaultDeliveryFormData(): DeliveryFormData {
  return {
    fullName: "",
    address: "",
    email: "",
    phone: "",
    deliveryDate: "",
    deliveryTime: "",
    additionalOptions: [],
    agreedToTerms: false
  };
}

window.addEventListener('load', () => {

  // Get all form elements
  const fullNameInput = document.getElementById('fullName') as HTMLInputElement;
  const addressInput = document.getElementById('address') as HTMLInputElement;
  const emailInput = document.getElementById('email') as HTMLInputElement;
  const phoneInput = document.getElementById('phone') as HTMLInputElement;
  const deliveryDatePickerInput = document.getElementById('deliveryDate') as HTMLInputElement;
  const deliveryTimePickerInput = document.getElementById('deliveryTime') as HTMLInputElement;
  const additionalOptionsSelect = document.getElementById('additionalOptions') as HTMLSelectElement;
  const termsAgreementCheckbox = document.getElementById('termsAgreement') as HTMLInputElement;
  const submitBtn = document.getElementById('submitBtn');
  const resetBtn = document.getElementById('resetBtn');

  // Materialize CSS initialization
  const deliveryDatePickerInstance = M.Datepicker.init(deliveryDatePickerInput, {});
  const deliveryTimePickerInstance = M.Timepicker.init(deliveryTimePickerInput, {});
  let additionalOptionsSelectInstance = M.FormSelect.init(additionalOptionsSelect, {});

  // Data setup
  const formData = DeltaWatch.Watchable(makeDefaultDeliveryFormData());

  const {Watcher, Accessor, Mutator} = formData;

  // Setup watchers
  // For this form we need
  // two way binding (watcher to set the value and mutator to receive the value) on each input
  // we are going to validate the email and phone inputs
  // and the submit button will be enabled/disabled depending on validity of the form data
  DeltaWatch.Watch(Watcher, (data: DeliveryFormData) => {
    if (isValidDeliveryFormData(data)) {
      submitBtn.removeAttribute('disabled');
    } else {
      submitBtn.setAttribute('disabled', '');
    }
  });

  DeltaWatch.Watch(Watcher.fullName, (name: string) => {
    fullNameInput.value = name;
  });

  DeltaWatch.Watch(Watcher.address, (address: string) => {
    addressInput.value = address;
  });

  DeltaWatch.Watch(Watcher.email, (email: string) => {
    if (isValidEmail(email)) {
      emailInput.classList.remove('invalid')
    } else {
      emailInput.classList.add('invalid')
    }
    emailInput.value = email;
  });

  DeltaWatch.Watch(Watcher.phone, (phone: string) => {
    if (isValidPhone(phone)) {
      phoneInput.classList.remove('invalid')
    } else {
      phoneInput.classList.add('invalid')
    }
    phoneInput.value = phone;
  });

  DeltaWatch.Watch(Watcher.deliveryDate, (date: string) => {
    deliveryDatePickerInput.value = date;
  });

  DeltaWatch.Watch(Watcher.deliveryTime, (time: string) => {
    deliveryTimePickerInput.value = time;
  });

  DeltaWatch.Watch(Watcher.additionalOptions, (options: string[]) => {
    (additionalOptionsSelect as any).value = options;
  });

  DeltaWatch.Watch(Watcher.agreedToTerms, (agreed: boolean) => {
    termsAgreementCheckbox.checked = agreed;
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

  additionalOptionsSelect.addEventListener('change', () => {
    // Materialize CSS method for getting the values
    Mutator.additionalOptions = additionalOptionsSelectInstance.getSelectedValues();
  });

  termsAgreementCheckbox.addEventListener('change', (event) => {
    Mutator.agreedToTerms = (event.target as HTMLInputElement).checked;
  });

  // Setup button actions
  resetBtn.addEventListener('click', () => {
    // in order to reset entire data object, need to reference Mutator from the root object
    formData.Mutator = makeDefaultDeliveryFormData();

    // Materialize CSS thing
    // need to reinitialize it for ui to update
    additionalOptionsSelectInstance = M.FormSelect.init(additionalOptionsSelect, {});
  });
});