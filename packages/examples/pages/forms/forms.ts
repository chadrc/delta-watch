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
  const loadingSpinner = document.getElementById('loadingSpinner');

  // Get modal elements
  const submitModal = document.getElementById('submitModal');
  const closeSubmitModalBtn = document.getElementById('closeSubmitModalBtn');
  const submitModalDeliveryDateText = document.getElementById('submitModalDeliveryDate');
  const submitModalDeliveryTimeText = document.getElementById('submitModalDeliveryTime');
  const termsModal = document.getElementById('termsModal');

  // Materialize CSS initialization
  M.Datepicker.init(deliveryDatePickerInput, {});
  M.Timepicker.init(deliveryTimePickerInput, {});
  const submitModalInstance = M.Modal.init(submitModal, {});
  M.Modal.init(termsModal, {});
  // keep reference for resetting later
  let additionalOptionsSelectInstance = M.FormSelect.init(additionalOptionsSelect, {});

  // Data setup
  const formData = DeltaWatch.Watchable({
    loading: false,
    showErrors: false,
    formData: makeDefaultDeliveryFormData()
  });

  const {Watcher, Accessor, Mutator} = formData;

  // Setup watchers
  // For this form we need
  // two way binding (watcher to set the value and mutator to receive the value) on each input
  // we are going to validate the email and phone inputs
  // and the submit button will be enabled/disabled depending on validity of the form data
  DeltaWatch.Watch(Watcher.formData, (data: DeliveryFormData) => {
    if (isValidDeliveryFormData(data)) {
      submitBtn.removeAttribute('disabled');
    } else {
      submitBtn.setAttribute('disabled', '');
    }
  });

  DeltaWatch.Watch(Watcher.formData.fullName, (name: string) => {
    fullNameInput.value = name;
  });

  DeltaWatch.Watch(Watcher.formData.address, (address: string) => {
    addressInput.value = address;
  });

  DeltaWatch.Watch(Watcher.formData.email, (email: string) => {
    if (isValidEmail(email) || !Accessor.showErrors) {
      emailInput.classList.remove('invalid');
    } else {
      emailInput.classList.add('invalid');
    }
    emailInput.value = email;
  });

  DeltaWatch.Watch(Watcher.formData.phone, (phone: string) => {
    if (isValidPhone(phone) || !Accessor.showErrors) {
      phoneInput.classList.remove('invalid');
    } else {
      phoneInput.classList.add('invalid');
    }
    phoneInput.value = phone;
  });

  DeltaWatch.Watch(Watcher.formData.deliveryDate, (date: string) => {
    deliveryDatePickerInput.value = date;
    submitModalDeliveryDateText.innerHTML = date;
  });

  DeltaWatch.Watch(Watcher.formData.deliveryTime, (time: string) => {
    deliveryTimePickerInput.value = time;
    submitModalDeliveryTimeText.innerHTML = time;
  });

  DeltaWatch.Watch(Watcher.formData.additionalOptions, (options: string[]) => {
    (additionalOptionsSelect as any).value = options;
  });

  DeltaWatch.Watch(Watcher.formData.agreedToTerms, (agreed: boolean) => {
    termsAgreementCheckbox.checked = agreed;
  });

  DeltaWatch.Watch(Watcher.loading, (loading: boolean) => {
    if (loading) {
      submitBtn.classList.add('hide');
      loadingSpinner.classList.remove('hide');
    } else {
      submitBtn.classList.remove('hide');
      loadingSpinner.classList.add('hide');
    }
  });

  // Set up receiving side of two way binding
  // Each change also enables the showErrors flag, which is set to false by submitting or pressing reset button
  fullNameInput.addEventListener('change', (event) => {
    Mutator.showErrors = true;
    Mutator.formData.fullName = (event.target as HTMLInputElement).value;
  });

  addressInput.addEventListener('change', (event) => {
    Mutator.showErrors = true;
    Mutator.formData.address = (event.target as HTMLInputElement).value;
  });

  emailInput.addEventListener('change', (event) => {
    Mutator.showErrors = true;
    Mutator.formData.email = (event.target as HTMLInputElement).value;
  });

  phoneInput.addEventListener('change', (event) => {
    Mutator.showErrors = true;
    Mutator.formData.phone = (event.target as HTMLInputElement).value;
  });

  deliveryDatePickerInput.addEventListener('change', (event) => {
    Mutator.showErrors = true;
    Mutator.formData.deliveryDate = (event.target as HTMLInputElement).value;
  });

  deliveryTimePickerInput.addEventListener('change', (event) => {
    Mutator.showErrors = true;
    Mutator.formData.deliveryTime = (event.target as HTMLInputElement).value;
  });

  additionalOptionsSelect.addEventListener('change', () => {
    Mutator.showErrors = true;
    // Materialize CSS method for getting the values
    Mutator.formData.additionalOptions = additionalOptionsSelectInstance.getSelectedValues();
  });

  termsAgreementCheckbox.addEventListener('change', (event) => {
    Mutator.showErrors = true;
    Mutator.formData.agreedToTerms = (event.target as HTMLInputElement).checked;
  });

  // Shared functionality for reset and close submit modal buttons
  function resetData() {
    // can't use a local variable to set the entire data
    // need to set from the root data object
    Mutator.showErrors = false;
    Mutator.formData = makeDefaultDeliveryFormData();

    // Materialize CSS thing
    // need to reinitialize it for ui to update
    additionalOptionsSelectInstance = M.FormSelect.init(additionalOptionsSelect, {});
  }

  // Setup button actions
  resetBtn.addEventListener('click', () => {
    resetData();
  });

  submitBtn.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();

    // Normally this would be sent to a server, but were just going to log it
    let data = JSON.stringify(Accessor.formData, null, 2);
    console.log("Sending data");
    console.log(data);

    // Simulate request delay
    Mutator.loading = true;
    let loadingTimeout = setTimeout(() => {
      Mutator.loading = false;
      submitModalInstance.open();
      clearTimeout(loadingTimeout);
    }, (Math.random() * 5000 + 1000));
  });

  closeSubmitModalBtn.addEventListener('click', () => {
    submitModalInstance.close();
    resetData();
  });
});