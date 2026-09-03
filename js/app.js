/*
 * Guided Form + Upload & Review overlay logic (spec v1.2, Section 8).
 * Vanilla JS, no framework, no network calls — all reading/writing of
 * spreadsheet data happens client-side via SheetJS (loaded from CDN in
 * index.html before this file).
 */
(function () {
  'use strict';

  const ALL_FIELDS_BY_ID = {};
  QUESTIONNAIRE_SECTIONS.forEach((section) => {
    section.fields.forEach((field) => { ALL_FIELDS_BY_ID[field.id] = field; });
  });

  const state = {
    mode: null,           // 'guided' | 'upload'
    screen: null,         // 'wizard-section' | 'wizard-declaration' | 'review' | 'upload-select' | 'confirmation'
    sectionIndex: 0,
    editingFromReview: false,
    errors: new Set(),
    uploadError: null
  };

  let answers = {};
  let declaration = { name: '', date: '' };

  let overlayEl, titleEl, bodyEl, closeBtn, fileInput;

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatDate(isoDate) {
    if (!isoDate) return '';
    const parts = isoDate.split('-');
    if (parts.length !== 3) return isoDate;
    const [y, m, d] = parts;
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthName = months[parseInt(m, 10) - 1];
    if (!monthName) return isoDate;
    return `${d} ${monthName} ${y}`;
  }

  function resetState() {
    answers = {};
    declaration = { name: '', date: '' };
    state.mode = null;
    state.screen = null;
    state.sectionIndex = 0;
    state.editingFromReview = false;
    state.errors = new Set();
    state.uploadError = null;
  }

  function overlayTitle() {
    if (state.screen === 'confirmation') return 'Submission Complete';
    if (state.mode === 'upload') return 'Upload Completed File';
    return 'Fill Out Online';
  }

  function showOverlay() {
    overlayEl.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeOverlay() {
    overlayEl.classList.remove('is-open');
    document.body.style.overflow = '';
    resetState();
  }

  function openGuided() {
    resetState();
    state.mode = 'guided';
    state.screen = 'wizard-section';
    state.sectionIndex = 0;
    showOverlay();
    render();
  }

  function openUpload() {
    resetState();
    state.mode = 'upload';
    state.screen = 'upload-select';
    showOverlay();
    render();
  }

  function getMissingCount() {
    let count = 0;
    QUESTIONNAIRE_SECTIONS.forEach((section) => {
      section.fields.forEach((field) => {
        const v = answers[field.id];
        if (!v || !String(v).trim()) count++;
      });
    });
    if (!declaration.name || !declaration.name.trim()) count++;
    if (!declaration.date || !declaration.date.trim()) count++;
    return count;
  }

  function renderFieldControl(field, value, hasError) {
    const v = value || '';
    switch (field.type) {
      case 'Dropdown': {
        const opts = field.options.map((o) => `<option value="${escapeHtml(o)}"${v === o ? ' selected' : ''}>${escapeHtml(o)}</option>`).join('');
        return `<select data-field="${field.id}"><option value=""${!v ? ' selected' : ''}>Select…</option>${opts}</select>`;
      }
      case 'Quantitative':
        return `<input type="number" step="any" data-field="${field.id}" value="${escapeHtml(v)}" placeholder="${escapeHtml(field.unit || '')}">`;
      case 'Open-Ended':
        return `<textarea data-field="${field.id}">${escapeHtml(v)}</textarea>`;
      case 'Required':
      default:
        return `<input type="text" data-field="${field.id}" value="${escapeHtml(v)}">`;
    }
  }

  function renderFieldWrap(field) {
    const hasError = state.errors.has(field.id);
    return `<div class="tc-field${hasError ? ' has-error' : ''}">
      <label>${escapeHtml(field.question)}</label>
      ${renderFieldControl(field, answers[field.id], hasError)}
      ${hasError ? '<div class="tc-error-text">— Please answer this question.</div>' : ''}
    </div>`;
  }

  function renderSection(index) {
    const section = QUESTIONNAIRE_SECTIONS[index];
    const fieldsHtml = section.fields.map(renderFieldWrap).join('');
    const showBack = index > 0 && !state.editingFromReview;
    const nextLabel = state.editingFromReview ? 'Save' : (index === QUESTIONNAIRE_SECTIONS.length - 1 ? 'Next' : 'Next');

    bodyEl.innerHTML = `
      <p class="tc-progress">Section ${index + 1} of ${QUESTIONNAIRE_SECTIONS.length}</p>
      <div class="tc-progress-bar"><div class="tc-progress-bar-fill" style="width:${Math.round(((index + 1) / QUESTIONNAIRE_SECTIONS.length) * 100)}%"></div></div>
      <h3 class="tc-section-title">${escapeHtml(section.title)}</h3>
      ${fieldsHtml}
      <div class="tc-wizard-nav">
        ${showBack ? '<button type="button" class="tc-btn-secondary" id="wiz-back">Back</button>' : '<span></span>'}
        <button type="button" class="tc-btn-primary" id="wiz-next">${nextLabel}</button>
      </div>
    `;

    const backBtn = document.getElementById('wiz-back');
    if (backBtn) backBtn.addEventListener('click', () => {
      state.errors = new Set();
      state.sectionIndex = index - 1;
      render();
    });
    document.getElementById('wiz-next').addEventListener('click', () => {
      const errors = new Set();
      section.fields.forEach((f) => {
        const v = answers[f.id];
        if (!v || !String(v).trim()) errors.add(f.id);
      });
      state.errors = errors;
      if (errors.size > 0) { render(); return; }
      state.errors = new Set();
      if (state.editingFromReview) {
        state.editingFromReview = false;
        state.screen = 'review';
      } else if (index < QUESTIONNAIRE_SECTIONS.length - 1) {
        state.sectionIndex = index + 1;
      } else {
        state.screen = 'wizard-declaration';
      }
      render();
    });
  }

  function renderDeclaration() {
    bodyEl.innerHTML = `
      <p class="tc-progress">Declaration</p>
      <div class="tc-progress-bar"><div class="tc-progress-bar-fill" style="width:100%"></div></div>
      <h3 class="tc-section-title">Confirm and Sign</h3>
      <p class="tc-body" style="margin-bottom: var(--tc-space-lg);">I confirm that the information provided in this assessment is accurate and complete to the best of my knowledge.</p>
      <div class="tc-field${state.errors.has('decl-name') ? ' has-error' : ''}">
        <label>Authorised signatory name</label>
        <input type="text" data-decl="name" value="${escapeHtml(declaration.name)}">
        ${state.errors.has('decl-name') ? '<div class="tc-error-text">— Please enter the signatory name.</div>' : ''}
      </div>
      <div class="tc-field${state.errors.has('decl-date') ? ' has-error' : ''}">
        <label>Date</label>
        <input type="date" data-decl="date" value="${escapeHtml(declaration.date)}">
        ${state.errors.has('decl-date') ? '<div class="tc-error-text">— Please enter the date.</div>' : ''}
      </div>
      <div class="tc-wizard-nav">
        ${state.editingFromReview ? '<span></span>' : '<button type="button" class="tc-btn-secondary" id="wiz-back">Back</button>'}
        <button type="button" class="tc-btn-primary" id="wiz-next">${state.editingFromReview ? 'Save' : 'Next'}</button>
      </div>
    `;
    const backBtn = document.getElementById('wiz-back');
    if (backBtn) backBtn.addEventListener('click', () => {
      state.errors = new Set();
      state.screen = 'wizard-section';
      state.sectionIndex = QUESTIONNAIRE_SECTIONS.length - 1;
      render();
    });
    document.getElementById('wiz-next').addEventListener('click', () => {
      const errors = new Set();
      if (!declaration.name || !declaration.name.trim()) errors.add('decl-name');
      if (!declaration.date || !declaration.date.trim()) errors.add('decl-date');
      state.errors = errors;
      if (errors.size > 0) { render(); return; }
      state.errors = new Set();
      state.editingFromReview = false;
      state.screen = 'review';
      render();
    });
  }

  function renderReview() {
    const missingCount = getMissingCount();
    const sectionsHtml = QUESTIONNAIRE_SECTIONS.map((section, idx) => {
      const itemsHtml = section.fields.map((f) => {
        const val = answers[f.id];
        const missing = !val || !String(val).trim();
        return `<div class="tc-review-item${missing ? ' tc-review-item--error' : ''}">
          <div class="tc-review-q">${escapeHtml(f.question)}</div>
          <div class="tc-review-a">${missing ? '— Not answered — (required)' : escapeHtml(String(val))}</div>
        </div>`;
      }).join('');
      return `<div class="tc-review-section">
        <div class="tc-review-section-head">
          <span>${escapeHtml(section.title)}</span>
          <button type="button" class="tc-link tc-edit-link" data-edit-step="${idx}">Edit</button>
        </div>
        ${itemsHtml}
      </div>`;
    }).join('');

    const declMissing = !declaration.name.trim() || !declaration.date.trim();
    const declHtml = `<div class="tc-review-section">
      <div class="tc-review-section-head">
        <span>Declaration</span>
        <button type="button" class="tc-link tc-edit-link" data-edit-step="declaration">Edit</button>
      </div>
      <div class="tc-review-item${declMissing ? ' tc-review-item--error' : ''}">
        <div class="tc-review-q">Authorised signatory name and date</div>
        <div class="tc-review-a">${declMissing ? '— Not answered — (required)' : `${escapeHtml(declaration.name)} — ${formatDate(declaration.date)}`}</div>
      </div>
    </div>`;

    const submitLabel = state.mode === 'upload' ? 'Confirm & Download' : 'Submit';
    const bannerHtml = missingCount > 0
      ? `<div class="tc-review-banner">${missingCount} question${missingCount === 1 ? '' : 's'} still need${missingCount === 1 ? 's' : ''} an answer. Use Edit on the relevant section to complete ${missingCount === 1 ? 'it' : 'them'}.</div>`
      : '';

    bodyEl.innerHTML = `
      <p class="tc-progress">Review your answers</p>
      <div class="tc-progress-bar"><div class="tc-progress-bar-fill" style="width:100%"></div></div>
      ${bannerHtml}
      ${sectionsHtml}
      ${declHtml}
      <div class="tc-wizard-nav">
        <button type="button" class="tc-btn-secondary" id="review-back">${state.mode === 'upload' ? 'Re-upload File' : 'Back'}</button>
        <button type="button" class="tc-btn-primary" id="review-submit">${submitLabel}</button>
      </div>
    `;

    document.querySelectorAll('.tc-edit-link').forEach((btn) => btn.addEventListener('click', () => {
      const step = btn.getAttribute('data-edit-step');
      state.editingFromReview = true;
      state.errors = new Set();
      if (step === 'declaration') {
        state.screen = 'wizard-declaration';
      } else {
        state.screen = 'wizard-section';
        state.sectionIndex = Number(step);
      }
      render();
    }));
    document.getElementById('review-back').addEventListener('click', () => {
      if (state.mode === 'upload') {
        state.screen = 'upload-select';
      } else {
        state.screen = 'wizard-section';
        state.sectionIndex = QUESTIONNAIRE_SECTIONS.length - 1;
      }
      render();
    });
    document.getElementById('review-submit').addEventListener('click', onSubmit);
  }

  function onSubmit() {
    if (getMissingCount() > 0) { render(); return; }
    exportWorkbook();
    state.screen = 'confirmation';
    render();
  }

  function renderUploadSelect() {
    bodyEl.innerHTML = `
      <p class="tc-body" style="margin-bottom: var(--tc-space-lg);">Upload your completed questionnaire (.xlsx or .csv) and we will read your answers back to you for review before you download the final file.</p>
      ${state.uploadError ? `<div class="tc-review-banner">${escapeHtml(state.uploadError)}</div>` : ''}
      <div class="tc-upload-drop">
        <button type="button" class="tc-btn-primary" id="upload-choose-btn">Choose File</button>
        <p class="tc-upload-hint">Accepted formats: .xlsx, .csv</p>
      </div>
      ${state.uploadError ? '<button type="button" class="tc-link" id="upload-switch-guided">Fill Out Online Instead</button>' : ''}
    `;
    document.getElementById('upload-choose-btn').addEventListener('click', () => fileInput.click());
    const switchBtn = document.getElementById('upload-switch-guided');
    if (switchBtn) switchBtn.addEventListener('click', openGuided);
  }

  function renderConfirmation() {
    bodyEl.innerHTML = `
      <h3 class="tc-confirm-title">Your File Has Downloaded</h3>
      <p class="tc-body" style="margin-bottom: var(--tc-space-md);">Your completed questionnaire has downloaded to your device. Please check it, then email the file to
        <a href="mailto:sustainability@thecorporate.com" class="tc-link" style="display:inline; text-transform:none; letter-spacing:normal; font-weight:400;">sustainability@thecorporate.com</a>
        to complete your submission.</p>
      <p class="tc-body" style="margin-bottom: var(--tc-space-xl);">We do not send or store anything on your behalf. Emailing the file is the final step.</p>
      <button type="button" class="tc-btn-primary" id="confirm-close">Return to Portal</button>
    `;
    document.getElementById('confirm-close').addEventListener('click', closeOverlay);
  }

  function render() {
    titleEl.textContent = overlayTitle();
    switch (state.screen) {
      case 'wizard-section': renderSection(state.sectionIndex); break;
      case 'wizard-declaration': renderDeclaration(); break;
      case 'review': renderReview(); break;
      case 'upload-select': renderUploadSelect(); break;
      case 'confirmation': renderConfirmation(); break;
      default: break;
    }
  }

  function normalize(str) {
    return String(str || '').replace(/\s+/g, ' ').trim().toLowerCase();
  }

  function matchRowsToAnswers(rows) {
    const headerIdx = rows.findIndex((row) => Array.isArray(row) && normalize(row[0]) === 'section');
    if (headerIdx === -1) return { matched: 0 };

    const header = rows[headerIdx].map(normalize);
    const colOf = (names) => header.findIndex((h) => names.includes(h));
    const col = {
      section: colOf(['section']),
      question: colOf(['question / metric', 'question/metric', 'question']),
      response: colOf(['supplier response', 'response'])
    };
    if (col.section === -1 || col.question === -1 || col.response === -1) return { matched: 0 };

    const lookup = {};
    Object.values(ALL_FIELDS_BY_ID).forEach((field) => {
      lookup[`${normalize(field.section)}||${normalize(field.question)}`] = field;
    });

    const parsedAnswers = {};
    let matched = 0;
    for (let i = headerIdx + 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row) continue;
      const key = `${normalize(row[col.section])}||${normalize(row[col.question])}`;
      const field = lookup[key];
      if (field) {
        parsedAnswers[field.id] = String(row[col.response] || '').trim();
        matched++;
      }
    }
    return { matched, answers: parsedAnswers };
  }

  function handleFile(file) {
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext !== 'xlsx' && ext !== 'csv') {
      state.uploadError = 'That file type is not supported. Please upload a .xlsx or .csv file.';
      render();
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => {
      state.uploadError = 'This file could not be read. Please check it and try again, or fill out the form online instead.';
      render();
    };
    reader.onload = (e) => {
      try {
        const workbook = ext === 'csv'
          ? XLSX.read(e.target.result, { type: 'string' })
          : XLSX.read(e.target.result, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '', raw: false });
        const result = matchRowsToAnswers(rows);
        if (!result.matched) {
          state.uploadError = "This file's structure doesn't match the expected questionnaire columns. Please check it and try again, or fill out the form online instead.";
          render();
          return;
        }
        answers = Object.assign({}, answers, result.answers);
        state.uploadError = null;
        state.editingFromReview = false;
        state.screen = 'review';
        render();
      } catch (err) {
        state.uploadError = 'This file could not be read. Please check it and try again, or fill out the form online instead.';
        render();
      }
    };
    if (ext === 'csv') reader.readAsText(file);
    else reader.readAsArrayBuffer(file);
  }

  function exportWorkbook() {
    const rows = EXPORT_ROW_TEMPLATE.map((rowDef) => {
      if (rowDef.kind === 'static') return rowDef.cells.slice();
      if (rowDef.kind === 'section') return [rowDef.section, '', '', rowDef.title, '', '', rowDef.status];
      if (rowDef.kind === 'declaration') {
        return [
          'DECLARATION: I confirm that the information provided in this assessment is accurate and complete to the best of my knowledge.',
          '', '', '',
          `Authorised Signatory Name: ${declaration.name}`,
          `Date (DD Month YYYY): ${formatDate(declaration.date)}`,
          'Signature / Digital Auth:'
        ];
      }
      if (rowDef.kind === 'field') {
        const field = ALL_FIELDS_BY_ID[rowDef.fieldId];
        return [field.section, field.esrsRef, field.type, field.question, answers[rowDef.fieldId] || '', field.staticNote || '', ''];
      }
      return [];
    });

    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 8 }, { wch: 10 }, { wch: 14 }, { wch: 70 }, { wch: 45 }, { wch: 34 }, { wch: 14 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Supplier Assessment 2026');
    XLSX.writeFile(wb, 'The_Corporate_Supplier_Questionnaire_2026_Completed.xlsx');
  }

  document.addEventListener('DOMContentLoaded', () => {
    overlayEl = document.getElementById('tc-overlay');
    titleEl = document.getElementById('tc-overlay-title');
    bodyEl = document.getElementById('tc-overlay-body');
    closeBtn = document.getElementById('tc-overlay-close');
    fileInput = document.getElementById('tc-upload-input');

    document.getElementById('btn-fill-online').addEventListener('click', openGuided);
    document.getElementById('btn-upload-file').addEventListener('click', openUpload);
    closeBtn.addEventListener('click', closeOverlay);
    overlayEl.addEventListener('click', (e) => { if (e.target === overlayEl) closeOverlay(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && overlayEl.classList.contains('is-open')) closeOverlay(); });

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) handleFile(file);
      fileInput.value = '';
    });

    bodyEl.addEventListener('input', (e) => {
      const fieldId = e.target.getAttribute('data-field');
      const declKey = e.target.getAttribute('data-decl');
      if (fieldId) answers[fieldId] = e.target.value;
      if (declKey) declaration[declKey] = e.target.value;
    });
    bodyEl.addEventListener('change', (e) => {
      const fieldId = e.target.getAttribute('data-field');
      const declKey = e.target.getAttribute('data-decl');
      if (fieldId) answers[fieldId] = e.target.value;
      if (declKey) declaration[declKey] = e.target.value;
    });
  });
})();
