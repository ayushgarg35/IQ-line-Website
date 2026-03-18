function initSiteForms() {
  initInterestChips();
  initCareerRolePrefill();
  initJsonForms();
}

function initInterestChips() {
  const chipGroup = document.querySelector('[data-interest-chips]');
  if (!chipGroup) {
    return;
  }

  const hiddenInput = document.querySelector('input[name="interests"]');
  const chips = chipGroup.querySelectorAll('[data-chip-value]');

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const isSelected = chip.classList.toggle('selected');
      chip.setAttribute('aria-pressed', String(isSelected));
      syncChipSelection(chips, hiddenInput);
    });
  });

  syncChipSelection(chips, hiddenInput);
}

function syncChipSelection(chips, hiddenInput) {
  if (!hiddenInput) {
    return;
  }

  const selectedValues = Array.from(chips)
    .filter(chip => chip.classList.contains('selected'))
    .map(chip => chip.getAttribute('data-chip-value'));

  hiddenInput.value = selectedValues.join(', ');
}

function initCareerRolePrefill() {
  const roleSelect = document.querySelector('#applyForm select[name="role"]');
  if (!roleSelect) {
    return;
  }

  document.querySelectorAll('[data-role-target]').forEach(link => {
    link.addEventListener('click', event => {
      const role = link.getAttribute('data-role-target');
      if (!role) {
        return;
      }

      roleSelect.value = role;
      event.preventDefault();
      const target = document.getElementById('apply');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

function initJsonForms() {
  bindJsonForm({
    formId: 'contactFormElement',
    endpoint: '/api/contact',
    statusId: 'contactStatus',
    successId: 'contactSuccess',
    hideId: 'contactForm',
    onSuccess: () => {
      const success = document.getElementById('contactSuccess');
      if (success) {
        success.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });

  bindJsonForm({
    formId: 'applyForm',
    endpoint: '/api/careers',
    statusId: 'careerStatus',
    successId: 'applySuccess',
    hideId: 'applyForm'
  });

  bindJsonForm({
    formId: 'newsletterForm',
    endpoint: '/api/newsletter',
    statusId: 'newsletterStatus',
    successId: null,
    hideId: null,
    onSuccess: form => {
      form.reset();
    }
  });
}

function bindJsonForm(config) {
  const form = document.getElementById(config.formId);
  if (!form) {
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');
  const status = config.statusId ? document.getElementById(config.statusId) : null;
  const successState = config.successId ? document.getElementById(config.successId) : null;
  const hideTarget = config.hideId ? document.getElementById(config.hideId) : null;

  form.addEventListener('submit', async event => {
    event.preventDefault();

    if (window.location.protocol === 'file:') {
      setStatus(status, 'error', 'This form needs the local server. Start the site with `python3 server.py` and try again.');
      return;
    }

    const originalButtonMarkup = submitButton ? submitButton.innerHTML : '';
    const payload = objectFromFormData(new FormData(form));

    try {
      setStatus(status, 'loading', 'Sending...');
      setButtonLoading(submitButton, true);

      const response = await fetch(config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.error || 'Something went wrong while submitting the form.');
      }

      setStatus(status, 'success', result.message || 'Saved successfully.');

      if (hideTarget) {
        hideTarget.style.display = 'none';
      }

      if (successState) {
        successState.classList.add('show');
      }

      if (typeof config.onSuccess === 'function') {
        config.onSuccess(form, result);
      }
    } catch (error) {
      setStatus(status, 'error', error.message || 'Unable to submit right now.');
    } finally {
      setButtonLoading(submitButton, false, originalButtonMarkup);
    }
  });
}

function objectFromFormData(formData) {
  const data = {};

  formData.forEach((value, key) => {
    if (data[key]) {
      if (!Array.isArray(data[key])) {
        data[key] = [data[key]];
      }
      data[key].push(value);
    } else {
      data[key] = value;
    }
  });

  return data;
}

function setStatus(element, type, message) {
  if (!element) {
    return;
  }

  element.className = 'status-message is-' + type;
  element.textContent = message;
}

function setButtonLoading(button, isLoading, originalMarkup) {
  if (!button) {
    return;
  }

  if (isLoading) {
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  } else {
    button.disabled = false;
    if (originalMarkup) {
      button.innerHTML = originalMarkup;
    }
  }
}
