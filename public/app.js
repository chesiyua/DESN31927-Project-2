const API = '/api/signups';

const form = document.getElementById('signup-form');
const editingIdInput = document.getElementById('editing-id');
const submitBtn = document.getElementById('submit-btn');
const cancelEditBtn = document.getElementById('cancel-edit-btn');
const formHeading = document.getElementById('form-heading');
const statusEl = document.getElementById('status');
const listEl = document.getElementById('signup-list');
const emptyMsg = document.getElementById('empty-message');
const totalsEl = document.getElementById('totals-line');
const template = document.getElementById('signup-template');
const fName = document.getElementById('name');
const fEmail = document.getElementById('email');
const fPhone = document.getElementById('phone');
const fCampus = document.getElementById('campus');
const fAttendeeType = document.getElementById('attendee_type');
const fHowHeard = document.getElementById('how_heard');
const fAttendedBefore = document.getElementById('attended_before');
const fActivity = document.getElementById('activity');
const fGuests = document.getElementById('guests');
const fArrivalTime = document.getElementById('arrival_time');
const fCostumeTheme = document.getElementById('costume_theme');
const fCostume = document.getElementById('costume');
const fFoodNeeds = document.getElementById('food_needs');
const fCandyPreference = document.getElementById('candy_preference');
const fVolunteer = document.getElementById('volunteer');
const fAccessibilityNeeds = document.getElementById('accessibility_needs');
const fSuggestions = document.getElementById('suggestions');
const fPhotoPermission = document.getElementById('photo_permission');

// ---------- Constraint Validation API: inline feedback ----------
function showFieldError(field) {
  const slot = document.querySelector(`[data-error-for="${field.id}"]`);
  if (slot) slot.textContent = field.validity.valid ? '' : field.validationMessage;
}
for (const field of form.querySelectorAll('input, select, textarea')) {
  field.addEventListener('invalid', () => showFieldError(field));
  field.addEventListener('input', () => showFieldError(field));
  field.addEventListener('change', () => showFieldError(field));
}

function setStatus(text) {
  statusEl.textContent = text;
}

// ---------- Read all ----------
async function loadSignups() {
  const res = await fetch(API);
  if (!res.ok) {
    setStatus('Could not load sign-ups. Check the server / database connection.');
    return;
  }
  const items = await res.json();
  render(items);
}

function render(items) {
  listEl.textContent = '';
  emptyMsg.hidden = items.length > 0;
  const totalPeople = items.reduce((sum, item) => sum + (Number(item.guests) || 0), 0);
  totalsEl.textContent = `${items.length} sign-ups · ${totalPeople} people total`;
  for (const item of items) {
    const node = template.content.cloneNode(true);
    node.querySelector('.item-name').textContent = item.name;
    const meta = [
      item.attendee_type,
      item.campus ? `${item.campus} Campus` : '',
      item.activity,
      item.arrival_time ? `Arrives ${item.arrival_time}` : '',
      `${item.guests} ${item.guests === 1 ? 'person' : 'people'}`,
    ]
      .filter(Boolean)
      .join(' · ');
    node.querySelector('.item-meta').textContent = meta;
    const detail = [
      item.costume_theme ? `Costume theme: ${item.costume_theme}` : '',
      item.costume ? `Costume: ${item.costume}` : '',
      item.food_needs && item.food_needs !== 'None' ? `Food: ${item.food_needs}` : '',
      item.candy_preference ? `Candy: ${item.candy_preference}` : '',
      item.volunteer && item.volunteer !== 'No' ? `Volunteer: ${item.volunteer}` : '',
      item.accessibility_needs ? `Accessibility: ${item.accessibility_needs}` : '',
      item.suggestions ? `Suggestion: ${item.suggestions}` : '',
      item.photo_permission ? 'Photo OK' : '',
    ]
      .filter(Boolean)
      .join(' · ');
    node.querySelector('.item-detail').textContent = detail;
    const extra = [
      item.how_heard ? `Heard about it: ${item.how_heard}` : '',
      item.attended_before ? `Been to a Sheridan Halloween event before: ${item.attended_before}` : '',
    ]
      .filter(Boolean)
      .join(' · ');
    node.querySelector('.item-extra').textContent = extra;
    const contact = [item.email, item.phone].filter(Boolean).join(' · ');
    node.querySelector('.item-contact').textContent = contact;
    node.querySelector('.edit-btn').addEventListener('click', () => startEdit(item));
    node.querySelector('.delete-btn').addEventListener('click', () => removeSignup(item));
    listEl.appendChild(node);
  }
}

// ---------- Create / Update ----------
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  // Constraint Validation API gate before sending anything.
  for (const field of form.querySelectorAll('input, select, textarea')) showFieldError(field);
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const payload = {
    name: fName.value.trim(),
    email: fEmail.value.trim(),
    phone: fPhone.value.trim(),
    campus: fCampus.value,
    attendee_type: fAttendeeType.value,
    how_heard: fHowHeard.value,
    attended_before: fAttendedBefore.value,
    activity: fActivity.value,
    guests: Number(fGuests.value),
    arrival_time: fArrivalTime.value,
    costume: fCostume.value.trim(),
    food_needs: fFoodNeeds.value || 'None',
    photo_permission: fPhotoPermission.checked,
    volunteer: fVolunteer.value || 'No',
    accessibility_needs: fAccessibilityNeeds.value.trim(),
    suggestions: fSuggestions.value.trim(),
  };
  // Optional fields: only send them when the attendee actually answered,
  // so empty answers stay empty in the database instead of failing enum checks.
  if (fCostumeTheme.value) payload.costume_theme = fCostumeTheme.value;
  if (fCandyPreference.value) payload.candy_preference = fCandyPreference.value;

  const editingId = editingIdInput.value;
  const isEditing = editingId !== '';
  const res = await fetch(isEditing ? `${API}/${editingId}` : API, {
    method: isEditing ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    setStatus(data.error || 'Save failed. Check the fields and try again.');
    return;
  }

  setStatus(isEditing ? 'Sign-up updated.' : 'Sign-up saved. See you at the event!');
  stopEdit();
  await loadSignups();
});

// ---------- Edit: fill the form from an existing sign-up (all fields) ----------
function startEdit(item) {
  editingIdInput.value = item._id;
  fName.value = item.name || '';
  fEmail.value = item.email || '';
  fPhone.value = item.phone || '';
  fCampus.value = item.campus || '';
  fAttendeeType.value = item.attendee_type || '';
  fHowHeard.value = item.how_heard || '';
  fAttendedBefore.value = item.attended_before || '';
  fActivity.value = item.activity || '';
  fGuests.value = item.guests ?? 1;
  fArrivalTime.value = item.arrival_time || '';
  fCostumeTheme.value = item.costume_theme || '';
  fCostume.value = item.costume || '';
  fFoodNeeds.value = item.food_needs || 'None';
  fCandyPreference.value = item.candy_preference || '';
  fVolunteer.value = item.volunteer || 'No';
  fAccessibilityNeeds.value = item.accessibility_needs || '';
  fSuggestions.value = item.suggestions || '';
  fPhotoPermission.checked = Boolean(item.photo_permission);
  submitBtn.textContent = 'Update sign-up';
  formHeading.textContent = 'Edit sign-up';
  cancelEditBtn.hidden = false;
  form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  fName.focus();
}

function stopEdit() {
  editingIdInput.value = '';
  form.reset();
  fGuests.value = 1;
  fFoodNeeds.value = 'None';
  fVolunteer.value = 'No';
  fPhotoPermission.checked = false;
  submitBtn.textContent = 'Sign up';
  formHeading.textContent = 'Sign up';
  cancelEditBtn.hidden = true;
}
cancelEditBtn.addEventListener('click', stopEdit);

// ---------- Delete ----------
async function removeSignup(item) {
  if (!confirm(`Delete the sign-up for "${item.name}"? This cannot be undone.`)) return;
  const res = await fetch(`${API}/${item._id}`, { method: 'DELETE' });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    setStatus(data.error || 'Delete failed.');
    return;
  }
  if (editingIdInput.value === item._id) stopEdit();
  setStatus('Sign-up deleted.');
  await loadSignups();
}

loadSignups();
