(function () {
  function isRealHref(value) {
    if (!value) return false;
    const v = value.trim();
    if (!v) return false;
    if (v === '#') return false;
    if (v.toLowerCase().startsWith('javascript:')) return false;
    return true;
  }

  function getGuaranteeMatrix() {
    // Маршрутная матрица прототипа:
    // 1) выбор вида гарантии -> 2) системная проверка упрощённого маршрута
    // 3) если недоступно упрощённо -> выбор формата обычной гарантии
    return {
      'Тендерная гарантия': { simplified: true, category: 'Госзакупки 44-ФЗ', view: 'Тендерная гарантия' },
      'Гарантия возврата аванса': { simplified: true, category: 'Коммерческая', view: 'Гарантия возврата аванса' },
      'Гарантия исполнения контракта': { simplified: true, category: 'Коммерческая', view: 'Гарантия исполнения контракта' },
      'Гарантия исполнения гарантийных обязательств': { simplified: true, category: 'Коммерческая', view: 'Гарантия исполнения гарантийных обязательств' },
      'Гарантия возмещения НДС/акциза': { simplified: false, category: 'Налоговая', view: 'Гарантия возмещения НДС/акциза' },
      'Гарантия освобождения от уплаты акциза при экспорте': { simplified: false, category: 'Налоговая', view: 'Гарантия освобождения от уплаты акциза при экспорте' },
      'Гарантия освобождения от уплаты авансовых платежей акциза': { simplified: false, category: 'Налоговая', view: 'Гарантия освобождения от уплаты авансовых платежей акциза' },
      'Гарантия обеспечения платежей': { simplified: false, category: 'Коммерческая', view: 'Гарантия обеспечения платежей' },
      'Гарантия в пользу таможенных органов': { simplified: false, category: 'Таможенная', view: 'Гарантия в пользу таможенных органов' },
      'Арендная гарантия': { simplified: false, category: 'Коммерческая', view: 'Арендная гарантия' },
      'Гарантия уплаты экологического сбора': { simplified: false, category: 'Налоговая', view: 'Гарантия уплаты экологического сбора' }
    };
  }

  function markElement(el) {
    if (!el || el.classList.contains('interactive-marker')) return;
    el.classList.add('interactive-marker');
    el.dataset.marker = 'КЛИК';
  }

  function markInteractive() {
    document.querySelectorAll('a[href]').forEach((el) => {
      const href = el.getAttribute('href');
      if (!isRealHref(href)) return;
      markElement(el);
    });

    document.querySelectorAll('[data-choice]').forEach((el) => {
      markElement(el);
    });

    document.querySelectorAll('[data-g-category]').forEach((el) => {
      markElement(el);
    });

    document.querySelectorAll('[data-toggle-item]').forEach((el) => {
      markElement(el);
    });

    document.querySelectorAll('.pill[data-href]').forEach((el) => {
      markElement(el);
    });

    document.querySelectorAll('.click-card[data-href]').forEach((el) => {
      markElement(el);
    });
  }

  function setupRowLinks() {
    document.querySelectorAll('.click-row[data-href]').forEach((row) => {
      row.addEventListener('click', (e) => {
        if (e.target.closest('a, button')) return;
        const href = row.getAttribute('data-href');
        if (isRealHref(href)) window.location.href = href;
      });
    });
  }

  function setupCardLinks() {
    document.querySelectorAll('.click-card[data-href]').forEach((card) => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('a, button')) return;
        const href = card.getAttribute('data-href');
        if (isRealHref(href)) window.location.href = href;
      });
    });
  }

  function setupPillLinks() {
    document.querySelectorAll('.pill[data-href]').forEach((pill) => {
      pill.addEventListener('click', () => {
        const href = pill.getAttribute('data-href');
        if (isRealHref(href)) window.location.href = href;
      });
    });
  }

  function setupToggleGroups() {
    const groups = document.querySelectorAll('[data-toggle-group]');
    groups.forEach((group) => {
      group.addEventListener('click', (e) => {
        const target = e.target.closest('[data-toggle-item]');
        if (!target) return;
        group.querySelectorAll('[data-toggle-item]').forEach((el) => {
          el.classList.remove('active');
          el.classList.remove('selected');
        });
        target.classList.add('active');
        target.classList.add('selected');
      });
    });
  }

  function setupDemoHints() {
    document.querySelectorAll('[data-demo-close], [data-hint-close], [data-demo-source-close]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const hint = e.target.closest('.demo-popup, .demo-source, .demo-hint');
        if (!hint) return;
        hint.remove();
      });
    });
  }

  function getDemoReasonByPage() {
    const explicitReason = document.body.getAttribute('data-demo-reason');
    if (explicitReason) return explicitReason;

    const pageName = ((window.location.pathname || '').split('/').pop() || '').toLowerCase();
    const reasonMap = {
      'index.html': 'Переиспользован экран каталога сервисов как старт маршрута.',
      '01-services-garantii.html': 'Сохранён паттерн каталога сервисов, добавлен вход в раздел гарантий.',
      '02-garantii-hub.html': 'Собран единый хаб из существующих карточек и сводных блоков.',
      '03-oformit-wizard.html': 'Мастер выбора построен как эволюция текущих рабочих форм.',
      '04a-uproschennaya.html': 'Сценарий упрощённой гарантии встроен в продуктовый контур банка.',
      '04b-liniya-form.html': 'Форма заявления сохранена близко к текущим экранам Альфа-Кредит.',
      '04c-edinorazovaya.html': 'Маршрут единоразовой гарантии оформлен в стиле продуктового раздела.',
      '04d-assisted.html': 'Assisted-сценарий оформлен как штатный путь через менеджера.',
      '05-moi-garantii-zayavki.html': 'Реестр собран на базе существующих таблиц гарантий и заявок.',
      '06-kartochka-garantii.html': 'Карточка детализирована по паттерну действующих карточек заявки.',
      '07-dokumenty-podpis.html': 'Список документов на подпись собран на базе текущего табличного паттерна.',
      '07b-podpis-step.html': 'Шаг подписания оформлен в общей структуре карточки процесса.',
      '08-izmenit-garantiyu.html': 'Экран изменения гарантии сохранён близко к legacy-паттерну.',
      '08b-forma-izmeneniya.html': 'Форма изменения адаптирована из действующего шаблона заявления.',
      '09-vhodyashchie-garantii.html': 'Список входящих гарантий сохранён в привычном формате реестра.',
      '09b-kartochka-vhodyashchey.html': 'Карточка входящей гарантии собрана по текущему шаблону деталей.',
      '10-empty-errors.html': 'Пустые состояния оформлены в существующем UI-языке банка.'
    };
    return reasonMap[pageName] || 'Сохранены ключевые паттерны текущего интерфейса.';
  }

  function setupDemoSourcePlaque() {
    const source = document.body.getAttribute('data-demo-source');
    const reason = getDemoReasonByPage();
    if (!source && !reason) return;

    document.querySelectorAll('.demo-popup, .demo-source, .demo-hint').forEach((el) => el.remove());

    const lines = [];
    if (reason) {
      lines.push(`<div class="demo-popup-line"><span class="demo-popup-label"></span> ${reason}</div>`);
    }
    if (source) {
      lines.push(`<div class="demo-popup-line"><span class="demo-popup-label">Основа:</span> «${source}»</div>`);
    }

    const plaque = document.createElement('aside');
    plaque.className = 'demo-popup';
    plaque.innerHTML = [
      '<div class="demo-popup-head">DEMO</div>',
      `<div class="demo-popup-text">${lines.join('')}</div>`,
      '<button type="button" class="demo-popup-close" data-demo-close>Скрыть</button>'
    ].join('');
    document.body.appendChild(plaque);

    const closeBtn = plaque.querySelector('[data-demo-close]');
    const autoHideTimer = window.setTimeout(() => {
      if (plaque && plaque.parentNode) plaque.remove();
    }, 10000);

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        window.clearTimeout(autoHideTimer);
        plaque.remove();
      });
    }
  }

  function setupWizard() {
    const wizard = document.querySelector('[data-wizard]');
    if (!wizard) return;

    const guaranteeMatrix = getGuaranteeMatrix();
    const defaultType = 'Тендерная гарантия';
    const state = {
      guaranteeType: defaultType,
      ordinaryFormat: 'В рамках гарантийной линии'
    };

    const routeText = document.querySelector('[data-route-text]');
    const routeHint = document.querySelector('[data-route-hint]');
    const routeLink = document.querySelector('[data-route-link]');
    const selectedType = document.querySelector('[data-selected-type]');
    const routeBadge = document.querySelector('[data-route-badge]');
    const routeSystemHint = document.querySelector('[data-route-system-hint]');
    const ordinaryStep = document.querySelector('[data-ordinary-step]');

    const storageTypeKey = 'guaranteeWizardType';
    const storageRouteKey = 'guaranteeWizardRoute';
    const storageFormatKey = 'guaranteeWizardOrdinaryFormat';

    function persistSelection(routeKind) {
      try {
        window.localStorage.setItem(storageTypeKey, state.guaranteeType);
        window.localStorage.setItem(storageRouteKey, routeKind);
        window.localStorage.setItem(storageFormatKey, state.ordinaryFormat);
      } catch (_) {
        // ignore storage errors in static prototype
      }
    }

    function computeRoute() {
      const selected = guaranteeMatrix[state.guaranteeType] || guaranteeMatrix[defaultType];
      if (selected.simplified) {
        return {
          text: 'Тип оформления: Упрощённая гарантия',
          hint: '',
          href: '04b-liniya-form.html?mode=simplified',
          routeKind: 'simplified',
          showOrdinaryStep: false,
          badgeClass: 'green',
          badgeText: 'Упрощённая',
          systemHint: ''
        };
      }

      if (state.ordinaryFormat === 'Единоразовая гарантия') {
        return {
          text: 'Тип оформления: Обычная — единоразовая',
          hint: '',
          href: '04b-liniya-form.html?mode=single',
          routeKind: 'ordinary',
          showOrdinaryStep: true,
          badgeClass: 'orange',
          badgeText: 'Обычная',
          systemHint: ''
        };
      }

      return {
        text: 'Тип оформления: Обычная — в рамках линии',
        hint: '',
        href: '04b-liniya-form.html?mode=line',
        routeKind: 'ordinary',
        showOrdinaryStep: true,
        badgeClass: 'orange',
        badgeText: 'Обычная',
        systemHint: ''
      };
    }

    function renderRoute() {
      const route = computeRoute();
      if (routeText) routeText.textContent = route.text;
      if (routeHint) routeHint.textContent = route.hint;
      if (routeLink) routeLink.setAttribute('href', route.href);
      if (selectedType) selectedType.textContent = state.guaranteeType;
      if (routeSystemHint) routeSystemHint.textContent = route.systemHint;
      if (routeBadge) {
        routeBadge.textContent = route.badgeText;
        routeBadge.classList.remove('green', 'orange', 'gray', 'dark', 'red');
        routeBadge.classList.add(route.badgeClass);
      }
      if (ordinaryStep) {
        ordinaryStep.classList.toggle('is-hidden', !route.showOrdinaryStep);
      }
      persistSelection(route.routeKind);
    }

    wizard.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-choice]');
      if (!btn) return;

      const key = btn.getAttribute('data-key');
      const value = btn.getAttribute('data-choice');
      if (!key || !value) return;

      state[key] = value;
      const scope = btn.closest('[data-choice-scope]');
      if (scope) {
        scope.querySelectorAll('[data-choice]').forEach((el) => el.classList.remove('selected'));
      }
      btn.classList.add('selected');
      renderRoute();
    });

    wizard.addEventListener('click', (e) => {
      const link = e.target.closest('a[href]');
      if (!link) return;
      const route = computeRoute();
      persistSelection(route.routeKind);
    });

    renderRoute();
  }

  function setupGuaranteeClassification() {
    const scope = document.querySelector('[data-guarantee-classification]');
    if (!scope) return;

    const categoryButtons = Array.from(scope.querySelectorAll('[data-g-category]'));
    const viewSelect = scope.querySelector('[data-g-view]');
    const hint = scope.querySelector('[data-g-prefill]');
    const storageKey = 'guaranteeWizardType';
    const guaranteeMatrix = getGuaranteeMatrix();

    if (!categoryButtons.length || !viewSelect) return;

    const categoryToViews = {
      'Госзакупки 44-ФЗ': [
        'Тендерная гарантия',
        'Гарантия исполнения контракта',
        'Гарантия возврата аванса',
        'Гарантия исполнения гарантийных обязательств'
      ],
      'Госзакупки 223-ФЗ': [
        'Тендерная гарантия',
        'Гарантия исполнения контракта',
        'Гарантия возврата аванса',
        'Гарантия исполнения гарантийных обязательств'
      ],
      'Налоговая': [
        'Гарантия возмещения НДС/акциза',
        'Гарантия освобождения от уплаты акциза при экспорте',
        'Гарантия освобождения от уплаты авансовых платежей акциза',
        'Гарантия уплаты экологического сбора'
      ],
      'Таможенная': [
        'Гарантия в пользу таможенных органов'
      ],
      'Коммерческая': [
        'Арендная гарантия',
        'Гарантия исполнения контракта',
        'Гарантия возврата аванса',
        'Гарантия обеспечения платежей',
        'Гарантия исполнения гарантийных обязательств'
      ],
      'Иное': [
        'Иное'
      ]
    };

    function setActiveCategory(category) {
      categoryButtons.forEach((btn) => {
        const isActive = btn.getAttribute('data-g-category') === category;
        btn.classList.toggle('selected', isActive);
      });
    }

    function renderViews(category, preferredView) {
      const views = categoryToViews[category] || ['Иное'];
      const current = preferredView || viewSelect.value;
      viewSelect.innerHTML = '';
      views.forEach((view) => {
        const option = document.createElement('option');
        option.value = view;
        option.textContent = view;
        viewSelect.appendChild(option);
      });
      if (current && views.includes(current)) {
        viewSelect.value = current;
      }
    }

    function applyCategory(category, preferredView) {
      setActiveCategory(category);
      renderViews(category, preferredView);
    }

    categoryButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const category = btn.getAttribute('data-g-category');
        applyCategory(category);
        if (hint) hint.textContent = 'Категория и вид гарантии выбраны вручную.';
      });
    });

    let selectedGuaranteeType = '';
    try {
      selectedGuaranteeType = window.localStorage.getItem(storageKey) || '';
    } catch (_) {
      selectedGuaranteeType = '';
    }

    if (selectedGuaranteeType && guaranteeMatrix[selectedGuaranteeType]) {
      const prefill = guaranteeMatrix[selectedGuaranteeType];
      applyCategory(prefill.category, prefill.view);
      if (hint) hint.textContent = `Предзаполнено по выбранному виду гарантии: «${selectedGuaranteeType}».`;
      return;
    }

    const initiallySelected = categoryButtons.find((btn) => btn.classList.contains('selected'));
    const initialCategory = initiallySelected ? initiallySelected.getAttribute('data-g-category') : 'Госзакупки 44-ФЗ';
    applyCategory(initialCategory);
  }

  function setupSharedGuaranteeFormMode() {
    const page = document.querySelector('[data-shared-guarantee-form]');
    if (!page) return;

    const params = new URLSearchParams(window.location.search || '');
    const rawMode = (params.get('mode') || 'line').toLowerCase();
    const mode = ['line', 'single', 'simplified'].includes(rawMode) ? rawMode : 'line';

    const titleEl = page.querySelector('[data-form-page-title]');
    const introEl = page.querySelector('[data-form-page-intro]');
    const crumbEl = page.querySelector('[data-form-page-crumb]');
    const navEl = page.querySelector('[data-form-nav-title]');
    const lineSection = page.querySelector('[data-line-selection]');
    const contractBlockTitleEl = page.querySelector('[data-contract-block-title]');
    const contractLabelEl = page.querySelector('[data-contract-label]');
    const contractSelectEl = page.querySelector('[data-contract-select]');

    const modeConfig = {
      line: {
        title: 'Гарантия в рамках линии',
        intro: 'Выберите действующую линию и заполните заявление.',
        crumb: 'В рамках линии',
        nav: 'Гарантия в рамках линии',
        showLineSelection: true,
        contractBlockTitle: 'Линия / договор',
        contractLabel: 'Рамочный договор',
        contractValue: 'Рамочный договор гарантии возобновляемый №RDBG01 от 04.09.2020 до 31.12.2029'
      },
      single: {
        title: 'Единоразовая гарантия',
        intro: 'Заполните заявление на выпуск единоразовой гарантии.',
        crumb: 'Единоразовая гарантия',
        nav: 'Единоразовая гарантия',
        showLineSelection: false,
        contractBlockTitle: 'Договор / основание',
        contractLabel: 'Договор-основание',
        contractValue: 'Договор поставки №SP-88 от 02.04.2026'
      },
      simplified: {
        title: 'Упрощённая гарантия',
        intro: 'Заполните заявление на выпуск упрощённой гарантии.',
        crumb: 'Упрощённая гарантия',
        nav: 'Упрощённая гарантия',
        showLineSelection: false,
        contractBlockTitle: 'Договор / основание',
        contractLabel: 'Документ-основание',
        contractValue: 'Контракт №44-ФЗ-781 от 05.03.2026'
      }
    };

    const cfg = modeConfig[mode];
    if (!cfg) return;

    if (titleEl) titleEl.textContent = cfg.title;
    if (introEl) introEl.textContent = cfg.intro;
    if (crumbEl) crumbEl.textContent = cfg.crumb;
    if (navEl) navEl.textContent = cfg.nav;
    if (lineSection) lineSection.classList.toggle('is-hidden', !cfg.showLineSelection);
    if (contractBlockTitleEl) contractBlockTitleEl.textContent = cfg.contractBlockTitle;
    if (contractLabelEl) contractLabelEl.textContent = cfg.contractLabel;
    if (contractSelectEl) {
      contractSelectEl.innerHTML = '';
      const option = document.createElement('option');
      option.textContent = cfg.contractValue;
      contractSelectEl.appendChild(option);
    }
    if (cfg.title) document.title = cfg.title;
  }

  function setupGuaranteeCardContext() {
    const page = document.querySelector('[data-guarantee-card]');
    if (!page) return;

    const params = new URLSearchParams(window.location.search || '');
    const defaultItem = 'RDBG-24017';
    const item = params.get('item') || defaultItem;

    const records = {
      'RDBG0105': {
        kind: 'guarantee',
        meta: '№ 0105 • R006',
        typeIssue: 'Арендная гарантия, на бумаге',
        program: 'line',
        beneficiary: 'ООО «МЕГА»',
        sum: '2 345 678,00 ₽',
        issueDate: '22.01.2026',
        startDate: '22.01.2026',
        endDate: '21.01.2027',
        term: '365 дней',
        status: 'active'
      },
      'RDBG-24017': {
        kind: 'request',
        meta: '№ 24017 • R006',
        typeIssue: 'Арендная гарантия, на бумаге',
        program: 'line',
        beneficiary: 'АО «Горизонт»',
        sum: '6 100 000,00 ₽',
        issueDate: '05.04.2026',
        startDate: '06.04.2026',
        endDate: '24.12.2026',
        term: '263 дня',
        status: 'sign'
      },
      'RDBG-23988': {
        kind: 'request',
        meta: '№ 23988 • R007',
        typeIssue: 'Гарантия исполнения контракта, электронно',
        program: 'single',
        beneficiary: 'ПАО «Лидер»',
        sum: '100 500,00 ₽',
        issueDate: '02.04.2026',
        startDate: '03.04.2026',
        endDate: '31.10.2026',
        term: '212 дней',
        status: 'docs'
      },
      'RDBG0094': {
        kind: 'request',
        meta: '№ 0378 • R005',
        typeIssue: 'Гарантия исполнения контракта, на бумаге',
        program: 'line',
        beneficiary: 'ООО «ТИТАН»',
        sum: '4 980 000,00 ₽',
        issueDate: '03.09.2025',
        startDate: '03.09.2025',
        endDate: '03.09.2026',
        term: '365 дней',
        status: 'rejected'
      },
      'RDBG0089': {
        kind: 'request',
        meta: '№ 0374 • R005',
        typeIssue: 'Гарантия исполнения контракта, на бумаге',
        program: 'line',
        beneficiary: 'ООО «ТИТАН»',
        sum: '4 280 000,00 ₽',
        issueDate: '21.07.2025',
        startDate: '22.07.2025',
        endDate: '21.07.2026',
        term: '365 дней',
        status: 'sign'
      }
    };

    const base = records[item] || records[defaultItem];
    const kind = (params.get('kind') || base.kind || 'request').toLowerCase();
    const program = (params.get('program') || base.program || 'line').toLowerCase();
    const status = (params.get('status') || base.status || 'sign').toLowerCase();

    const titleKind = kind === 'guarantee' ? 'Гарантия' : 'Заявка';
    const fullTitle = `${titleKind} №${item}`;

    const titleEl = page.querySelector('[data-card-title]');
    const breadcrumbEl = page.querySelector('[data-card-breadcrumb]');
    const metaEl = page.querySelector('[data-card-meta]');
    if (titleEl) titleEl.textContent = fullTitle;
    if (breadcrumbEl) breadcrumbEl.textContent = fullTitle;
    if (metaEl) metaEl.textContent = base.meta || '';
    document.title = fullTitle;

    const programEl = page.querySelector('[data-card-program]');
    const typeIssueEl = page.querySelector('[data-card-type-issue]');
    const beneficiaryEl = page.querySelector('[data-card-beneficiary]');
    const sumEl = page.querySelector('[data-card-sum]');
    const issueDateEl = page.querySelector('[data-card-date-issue]');
    const startDateEl = page.querySelector('[data-card-date-start]');
    const endDateEl = page.querySelector('[data-card-date-end]');
    const termEl = page.querySelector('[data-card-term]');
    const actionTitleEl = page.querySelector('[data-card-action-title]');
    const docsTbody = page.querySelector('[data-card-sign-docs]');
    const primaryActionEl = page.querySelector('[data-card-primary-action]');
    const signLinkEl = page.querySelector('[data-card-sign-link]');

    const programMap = {
      line: 'В рамках гарантийной линии №RDBG01',
      single: 'Единоразовая гарантия',
      simplified: 'Упрощённая гарантия'
    };

    const typeIssueMap = {
      line: 'Арендная гарантия, на бумаге',
      single: 'Гарантия исполнения контракта, электронно',
      simplified: 'Тендерная гарантия, электронно'
    };

    if (programEl) programEl.textContent = base.programText || programMap[program] || programMap.line;
    if (typeIssueEl) typeIssueEl.textContent = base.typeIssue || typeIssueMap[program] || typeIssueMap.line;
    if (beneficiaryEl) beneficiaryEl.textContent = base.beneficiary || '—';
    if (sumEl) sumEl.textContent = base.sum || '—';
    if (issueDateEl) issueDateEl.textContent = base.issueDate || '—';
    if (startDateEl) startDateEl.textContent = base.startDate || '—';
    if (endDateEl) endDateEl.textContent = base.endDate || '—';
    if (termEl) termEl.textContent = base.term || '—';

    const statusBadgeEl = page.querySelector('[data-card-status-badge]');
    const statusNoteEl = page.querySelector('[data-card-status-note]');

    const statusMap = {
      active: {
        text: 'Действует',
        badgeClass: 'green',
        note: 'Гарантия активна. Срок действия до 24.02.2027.'
      },
      sign: {
        text: 'На подпись',
        badgeClass: 'orange',
        note: 'Срок подписания: до 08.04.2026 18:00 (МСК)'
      },
      docs: {
        text: 'Требуются документы',
        badgeClass: 'red',
        note: 'Требуется дозагрузить документы для продолжения обработки.'
      },
      draft: {
        text: 'Черновик',
        badgeClass: 'gray',
        note: 'Черновик доступен для редактирования.'
      },
      rejected: {
        text: 'Отклонено',
        badgeClass: 'red',
        note: 'Банк отклонил заявку. Ознакомьтесь с причиной в истории объекта.'
      }
    };

    const statusCfg = statusMap[status] || statusMap.sign;
    if (statusBadgeEl) {
      statusBadgeEl.textContent = statusCfg.text;
      statusBadgeEl.classList.remove('green', 'orange', 'gray', 'dark', 'red');
      statusBadgeEl.classList.add(statusCfg.badgeClass);
    }
    if (statusNoteEl) statusNoteEl.textContent = statusCfg.note;

    const signStepHref = `07b-podpis-step.html?item=${encodeURIComponent(item)}&doc=${encodeURIComponent('Заявление на гарантию.docx')}&status=sign&program=${encodeURIComponent(program)}&kind=${encodeURIComponent(kind)}`;
    if (signLinkEl) signLinkEl.setAttribute('href', signStepHref);

    if (actionTitleEl) {
      actionTitleEl.textContent = status === 'sign' ? 'Проверьте и подпишите документы' : 'Документы по объекту';
    }

    if (docsTbody) {
      const docsByStatus = {
        sign: [
          `<tr><td>Заявление на гарантию.docx</td><td>DOCX</td><td><span class="badge orange">На подпись</span></td><td><a class="link-action" href="${signStepHref}">Подписать</a></td></tr>`,
          '<tr><td>Проект гарантии.pdf</td><td>PDF</td><td><span class="badge orange">На подпись</span></td><td><button class="btn btn-light">Скачать</button></td></tr>'
        ],
        active: [
          '<tr><td>Текст выпущенной гарантии.pdf</td><td>PDF</td><td><span class="badge green">Подписан</span></td><td><button class="btn btn-light">Скачать</button></td></tr>',
          '<tr><td>Заявление на выпуск.docx</td><td>DOCX</td><td><span class="badge green">Подписан</span></td><td><button class="btn btn-light">Скачать</button></td></tr>'
        ],
        docs: [
          '<tr><td>Письмо-запрос банка.pdf</td><td>PDF</td><td><span class="badge red">Требуются документы</span></td><td><button class="btn btn-light">Скачать</button></td></tr>',
          '<tr><td>Перечень недостающих файлов.docx</td><td>DOCX</td><td><span class="badge red">Требуются документы</span></td><td><button class="btn btn-light">Скачать</button></td></tr>'
        ],
        rejected: [
          '<tr><td>Заключение банка.pdf</td><td>PDF</td><td><span class="badge red">Отклонено</span></td><td><button class="btn btn-light">Скачать</button></td></tr>'
        ],
        draft: [
          '<tr><td>Черновик заявления.docx</td><td>DOCX</td><td><span class="badge gray">Черновик</span></td><td><button class="btn btn-light">Скачать</button></td></tr>'
        ]
      };
      docsTbody.innerHTML = (docsByStatus[status] || docsByStatus.sign).join('');
    }

    if (primaryActionEl) {
      const primaryByStatus = {
        sign: { label: 'Подписать', href: signStepHref },
        active: { label: 'К документам', href: '07-dokumenty-podpis.html' },
        docs: { label: 'Продолжить', href: `04b-liniya-form.html?mode=${program === 'single' ? 'single' : (program === 'simplified' ? 'simplified' : 'line')}` },
        draft: { label: 'Продолжить', href: `04b-liniya-form.html?mode=${program === 'single' ? 'single' : (program === 'simplified' ? 'simplified' : 'line')}` },
        rejected: { label: 'Создать новую заявку', href: '03-oformit-wizard.html' }
      };
      const primaryCfg = primaryByStatus[status] || primaryByStatus.sign;
      primaryActionEl.textContent = primaryCfg.label;
      primaryActionEl.setAttribute('href', primaryCfg.href);
    }
  }

  function setupIncomingGuaranteeCardContext() {
    const page = document.querySelector('[data-incoming-card]');
    if (!page) return;

    const params = new URLSearchParams(window.location.search || '');
    const item = params.get('item') || 'OSV-2024-091';
    const records = {
      'OSV-2024-091': {
        principal: 'ООО «ССВ»',
        beneficiary: 'ООО «Ромашка»',
        bankNumber: 'OSV-2024-091 / R-IN-88712',
        sum: '5 844 655,20 ₽',
        start: '18.10.2024',
        end: '11.12.2026',
        type: 'Гарантия исполнения контракта',
        status: 'active',
        docs: [
          '<tr><td>Текст гарантии.pdf</td><td>18.10.2024</td><td><button class="btn btn-light">Скачать</button></td></tr>',
          '<tr><td>Уведомление об авизовании.pdf</td><td>18.10.2024</td><td><button class="btn btn-light">Скачать</button></td></tr>'
        ]
      },
      'OSV-2025-014': {
        principal: 'АО «Стройгарант»',
        beneficiary: 'ООО «Ромашка»',
        bankNumber: 'OSV-2025-014 / R-IN-91244',
        sum: '12 300 000,00 ₽',
        start: '02.02.2025',
        end: '14.01.2027',
        type: 'Гарантия обеспечения платежей',
        status: 'active',
        docs: [
          '<tr><td>Текст гарантии.pdf</td><td>02.02.2025</td><td><button class="btn btn-light">Скачать</button></td></tr>',
          '<tr><td>Реестр авизования.pdf</td><td>03.02.2025</td><td><button class="btn btn-light">Скачать</button></td></tr>'
        ]
      }
    };

    const data = records[item] || records['OSV-2024-091'];
    const statusMap = {
      active: { text: 'Действует', cls: 'green' },
      expired: { text: 'Завершена', cls: 'gray' }
    };
    const statusCfg = statusMap[data.status] || statusMap.active;

    const titleText = `Входящая гарантия ${item}`;
    const titleEl = page.querySelector('[data-incoming-title]');
    const breadcrumbEl = page.querySelector('[data-incoming-breadcrumb]');
    const statusEl = page.querySelector('[data-incoming-status]');
    const principalEl = page.querySelector('[data-incoming-principal]');
    const beneficiaryEl = page.querySelector('[data-incoming-beneficiary]');
    const bankNumberEl = page.querySelector('[data-incoming-bank-number]');
    const sumEl = page.querySelector('[data-incoming-sum]');
    const startEl = page.querySelector('[data-incoming-start]');
    const endEl = page.querySelector('[data-incoming-end]');
    const typeEl = page.querySelector('[data-incoming-type]');
    const docsEl = page.querySelector('[data-incoming-docs]');

    if (titleEl) titleEl.textContent = titleText;
    if (breadcrumbEl) breadcrumbEl.textContent = item;
    if (principalEl) principalEl.textContent = data.principal;
    if (beneficiaryEl) beneficiaryEl.textContent = data.beneficiary;
    if (bankNumberEl) bankNumberEl.textContent = data.bankNumber;
    if (sumEl) sumEl.textContent = data.sum;
    if (startEl) startEl.textContent = data.start;
    if (endEl) endEl.textContent = data.end;
    if (typeEl) typeEl.textContent = data.type;
    if (docsEl) docsEl.innerHTML = data.docs.join('');
    if (statusEl) {
      statusEl.textContent = statusCfg.text;
      statusEl.classList.remove('green', 'orange', 'gray', 'dark', 'red');
      statusEl.classList.add(statusCfg.cls);
    }
    document.title = titleText;
  }

  function setupChangeFormContext() {
    const page = document.querySelector('[data-change-form]');
    if (!page) return;

    const params = new URLSearchParams(window.location.search || '');
    const stmt = (params.get('stmt') || '0381').replace(/[^0-9]/g, '') || '0381';
    const records = {
      '0381': {
        guarantee: 'RDBG0105',
        beneficiary: 'ООО «ТИТАН»',
        currentEnd: '24.12.2026',
        currentSum: '6 100 000,00 ₽',
        changeType: 'Продление срока действия',
        newEnd: '24.12.2027',
        newSum: '6 100 000,00 ₽',
        effectiveDate: '10.04.2026',
        reason: 'Продление срока исполнения обязательств по договору аренды.',
        docs: 'доп_соглашение.pdf, письмо_бенефициара.pdf',
        cardHref: '06-kartochka-garantii.html?item=RDBG0105&kind=guarantee&program=line&status=active'
      },
      '0374': {
        guarantee: 'RDBG0089',
        beneficiary: 'ООО «ТИТАН»',
        currentEnd: '21.07.2026',
        currentSum: '4 280 000,00 ₽',
        changeType: 'Изменение суммы',
        newEnd: '21.07.2026',
        newSum: '4 600 000,00 ₽',
        effectiveDate: '12.04.2026',
        reason: 'Корректировка суммы обеспечения по дополнительному соглашению №1.',
        docs: 'доп_соглашение_№1.pdf, письмо_на_изменение_суммы.pdf',
        cardHref: '06-kartochka-garantii.html?item=RDBG0089&kind=request&program=line&status=sign'
      }
    };
    const data = records[stmt] || records['0381'];

    const introEl = page.querySelector('[data-change-intro]');
    const crumbEl = page.querySelector('[data-change-crumb]');
    const titleEl = page.querySelector('[data-change-title]');
    const guaranteeEl = page.querySelector('[data-change-guarantee]');
    const beneficiaryEl = page.querySelector('[data-change-beneficiary]');
    const currentEndEl = page.querySelector('[data-change-current-end]');
    const currentSumEl = page.querySelector('[data-change-current-sum]');
    const typeEl = page.querySelector('[data-change-type]');
    const newEndEl = page.querySelector('[data-change-new-end]');
    const newSumEl = page.querySelector('[data-change-new-sum]');
    const effDateEl = page.querySelector('[data-change-effective-date]');
    const reasonEl = page.querySelector('[data-change-reason]');
    const docsEl = page.querySelector('[data-change-docs]');
    const cardLinkEl = page.querySelector('[data-change-card-link]');

    const introText = `Заявление №${stmt} по гарантии ${data.guarantee}.`;
    if (introEl) introEl.textContent = introText;
    if (crumbEl) crumbEl.textContent = `Форма изменения №${stmt}`;
    if (titleEl) titleEl.textContent = `Форма изменения гарантии №${stmt}`;
    if (guaranteeEl) guaranteeEl.value = data.guarantee;
    if (beneficiaryEl) beneficiaryEl.value = data.beneficiary;
    if (currentEndEl) currentEndEl.value = data.currentEnd;
    if (currentSumEl) currentSumEl.value = data.currentSum;
    if (typeEl) typeEl.value = data.changeType;
    if (newEndEl) newEndEl.value = data.newEnd;
    if (newSumEl) newSumEl.value = data.newSum;
    if (effDateEl) effDateEl.value = data.effectiveDate;
    if (reasonEl) reasonEl.value = data.reason;
    if (docsEl) docsEl.value = data.docs;
    if (cardLinkEl) cardLinkEl.setAttribute('href', data.cardHref);
  }

  function setupSignStepContext() {
    const page = document.querySelector('[data-sign-step]');
    if (!page) return;

    const params = new URLSearchParams(window.location.search || '');
    const item = params.get('item') || 'RDBG-24017';
    const kind = (params.get('kind') || 'request').toLowerCase();
    const doc = params.get('doc') || 'Заявление на гарантию.docx';
    const status = (params.get('status') || 'sign').toLowerCase();
    const program = (params.get('program') || 'line').toLowerCase();

    const statusMap = {
      sign: { text: 'На подпись', cls: 'orange' },
      approved: { text: 'Подписано', cls: 'green' },
      waiting: { text: 'Ожидает согласования', cls: 'gray' }
    };
    const statusCfg = statusMap[status] || statusMap.sign;
    const objectTitle = `${kind === 'guarantee' ? 'Гарантия' : 'Заявка'} №${item}`;
    const cardHref = `06-kartochka-garantii.html?item=${encodeURIComponent(item)}&kind=${encodeURIComponent(kind)}&program=${encodeURIComponent(program)}&status=${encodeURIComponent(status === 'approved' ? 'active' : (status === 'waiting' ? 'draft' : 'sign'))}`;

    const crumbEl = page.querySelector('[data-sign-crumb]');
    const titleEl = page.querySelector('[data-sign-title]');
    const statusEl = page.querySelector('[data-sign-status]');
    const docEl = page.querySelector('[data-sign-doc-title]');
    const objectEl = page.querySelector('[data-sign-object]');
    const cardLinkEl = page.querySelector('[data-sign-card-link]');

    if (crumbEl) crumbEl.textContent = `Подписание ${item}`;
    if (titleEl) titleEl.textContent = `Подписание документа ${item}`;
    if (statusEl) {
      statusEl.textContent = statusCfg.text;
      statusEl.classList.remove('green', 'orange', 'gray', 'dark', 'red');
      statusEl.classList.add(statusCfg.cls);
    }
    if (docEl) docEl.textContent = doc;
    if (objectEl) objectEl.textContent = `Связанный объект: ${objectTitle}`;
    if (cardLinkEl) cardLinkEl.setAttribute('href', cardHref);
    document.title = `Подписание документа ${item}`;
  }

  function setupDesktopOnlyNotice() {
    const noticeId = 'mobile-desktop-notice';

    function isMobileView() {
      const ua = navigator.userAgent || '';
      const isMobileUa = /Android|iPhone|iPad|iPod|Windows Phone|webOS|BlackBerry|Opera Mini/i.test(ua);
      const isSmallViewport = window.matchMedia('(max-width: 980px)').matches;
      return isMobileUa || isSmallViewport;
    }

    function render() {
      const existing = document.getElementById(noticeId);
      if (isMobileView()) {
        document.body.classList.add('mobile-desktop-locked');
        if (existing) return;
        const notice = document.createElement('div');
        notice.id = noticeId;
        notice.className = 'mobile-desktop-notice';
        notice.innerHTML = [
          '<div class="mobile-desktop-notice-card">',
          '<h2 class="mobile-desktop-notice-title">Просмотр ограничен на мобильном устройстве</h2>',
          '<p class="mobile-desktop-notice-text">Воспользуйтесь персональным компьютером для просмотра прототипа.</p>',
          '</div>'
        ].join('');
        document.body.appendChild(notice);
        return;
      }

      document.body.classList.remove('mobile-desktop-locked');
      if (existing) existing.remove();
    }

    render();
    window.addEventListener('resize', render);
    window.addEventListener('orientationchange', render);
  }

  function setupServiceGridCompaction() {
    const grids = Array.from(document.querySelectorAll('.service-grid'));
    if (!grids.length) return;

    function applyGridSpans(grid) {
      const cards = Array.from(grid.querySelectorAll('.service-card'));
      cards.forEach((card) => {
        card.style.gridRowEnd = '';
      });

      if (window.matchMedia('(max-width: 1280px)').matches) return;

      const styles = window.getComputedStyle(grid);
      const rowHeight = parseFloat(styles.getPropertyValue('grid-auto-rows')) || 8;
      const rowGap = parseFloat(styles.getPropertyValue('row-gap')) || 14;

      cards.forEach((card) => {
        const cardHeight = card.getBoundingClientRect().height;
        const span = Math.max(1, Math.ceil((cardHeight + rowGap) / (rowHeight + rowGap)));
        card.style.gridRowEnd = `span ${span}`;
      });
    }

    let rafId = 0;
    function scheduleApply() {
      window.cancelAnimationFrame(rafId);
      rafId = window.requestAnimationFrame(() => {
        grids.forEach((grid) => applyGridSpans(grid));
      });
    }

    window.addEventListener('resize', scheduleApply);
    window.addEventListener('orientationchange', scheduleApply);
    window.addEventListener('load', scheduleApply);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(scheduleApply).catch(() => {});
    }

    scheduleApply();
  }

  setupRowLinks();
  setupCardLinks();
  setupPillLinks();
  setupToggleGroups();
  setupDemoSourcePlaque();
  setupDemoHints();
  setupWizard();
  setupGuaranteeClassification();
  setupSharedGuaranteeFormMode();
  setupGuaranteeCardContext();
  setupIncomingGuaranteeCardContext();
  setupChangeFormContext();
  setupSignStepContext();
  setupDesktopOnlyNotice();
  setupServiceGridCompaction();
  markInteractive();
})();
