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

  function markElement(el, nav, marker) {
    if (!el || el.classList.contains('interactive-marker')) return;
    el.classList.add('interactive-marker');
    el.dataset.nav = nav;
    el.dataset.marker = marker;
  }

  function markInteractive() {
    document.querySelectorAll('a[href]').forEach((el) => {
      const href = el.getAttribute('href');
      if (!isRealHref(href)) return;

      let nav = 'secondary';
      let marker = 'Клик';

      if (el.classList.contains('btn-red')) {
        nav = 'primary';
        marker = 'Действие';
      } else if (el.classList.contains('back-link')) {
        nav = 'back';
        marker = 'Назад';
      } else if (el.classList.contains('link-action')) {
        nav = 'detail';
        marker = 'Детали';
      } else if (el.closest('.crumbs')) {
        nav = 'secondary';
        marker = 'Навигация';
      } else if (el.classList.contains('nav-item')) {
        nav = 'secondary';
        marker = 'Навигация';
      }

      markElement(el, nav, marker);
    });

    document.querySelectorAll('[data-choice]').forEach((el) => {
      markElement(el, 'secondary', 'Клик');
    });

    document.querySelectorAll('[data-g-category]').forEach((el) => {
      markElement(el, 'secondary', 'Клик');
    });

    document.querySelectorAll('[data-demo-close], [data-hint-close], [data-demo-source-close]').forEach((el) => {
      markElement(el, 'secondary', 'Клик');
    });

    document.querySelectorAll('[data-toggle-item]').forEach((el) => {
      markElement(el, 'secondary', 'Клик');
    });

    document.querySelectorAll('.pill[data-href]').forEach((el) => {
      markElement(el, 'secondary', 'Клик');
    });

    document.querySelectorAll('.click-row[data-href]').forEach((el) => {
      markElement(el, 'detail', 'Детали');
    });

    document.querySelectorAll('.click-card[data-href]').forEach((el) => {
      markElement(el, 'detail', 'Переход');
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
      lines.push(`<div class="demo-popup-line"><span class="demo-popup-label">Почему:</span> ${reason}</div>`);
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
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
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
          text: 'Рекомендуемый маршрут: упрощённая гарантия',
          hint: 'Система направляет в упрощённый сценарий оформления.',
          href: '04b-liniya-form.html?mode=simplified',
          routeKind: 'simplified',
          showOrdinaryStep: false,
          badgeClass: 'green',
          badgeText: 'Доступна упрощённая гарантия',
          systemHint: 'Для выбранного вида доступен упрощённый маршрут.'
        };
      }

      if (state.ordinaryFormat === 'Единоразовая гарантия') {
        return {
          text: 'Рекомендуемый маршрут: обычная гарантия — единоразовая',
          hint: 'Переход в сценарий единоразовой банковской гарантии.',
          href: '04b-liniya-form.html?mode=single',
          routeKind: 'ordinary',
          showOrdinaryStep: true,
          badgeClass: 'orange',
          badgeText: 'Упрощённая гарантия недоступна',
          systemHint: 'Система направляет в обычный маршрут оформления.'
        };
      }

      return {
        text: 'Рекомендуемый маршрут: обычная гарантия — в рамках линии',
        hint: 'Переход к оформлению гарантии в рамках действующей линии.',
        href: '04b-liniya-form.html?mode=line',
        routeKind: 'ordinary',
        showOrdinaryStep: true,
        badgeClass: 'orange',
        badgeText: 'Упрощённая гарантия недоступна',
        systemHint: 'Система направляет в обычный маршрут оформления.'
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

    const modeConfig = {
      line: {
        title: 'Гарантия в рамках линии',
        intro: 'Выберите действующую линию и заполните заявление.',
        crumb: 'В рамках линии',
        nav: 'Гарантия в рамках линии',
        showLineSelection: true
      },
      single: {
        title: 'Единоразовая гарантия',
        intro: 'Заполните заявление на выпуск единоразовой гарантии.',
        crumb: 'Единоразовая гарантия',
        nav: 'Единоразовая гарантия',
        showLineSelection: false
      },
      simplified: {
        title: 'Упрощённая гарантия',
        intro: 'Заполните заявление на выпуск упрощённой гарантии.',
        crumb: 'Упрощённая гарантия',
        nav: 'Упрощённая гарантия',
        showLineSelection: false
      }
    };

    const cfg = modeConfig[mode];
    if (!cfg) return;

    if (titleEl) titleEl.textContent = cfg.title;
    if (introEl) introEl.textContent = cfg.intro;
    if (crumbEl) crumbEl.textContent = cfg.crumb;
    if (navEl) navEl.textContent = cfg.nav;
    if (lineSection) lineSection.classList.toggle('is-hidden', !cfg.showLineSelection);
    if (cfg.title) document.title = cfg.title;
  }

  function setupGuaranteeCardContext() {
    const page = document.querySelector('[data-guarantee-card]');
    if (!page) return;

    const params = new URLSearchParams(window.location.search || '');
    const item = params.get('item');
    if (!item) return;

    const kind = (params.get('kind') || 'request').toLowerCase();
    const program = (params.get('program') || 'line').toLowerCase();
    const status = (params.get('status') || 'sign').toLowerCase();

    const titleKind = kind === 'guarantee' ? 'Гарантия' : 'Заявка';
    const fullTitle = `${titleKind} №${item}`;

    const titleEl = page.querySelector('[data-card-title]');
    const breadcrumbEl = page.querySelector('[data-card-breadcrumb]');
    if (titleEl) titleEl.textContent = fullTitle;
    if (breadcrumbEl) breadcrumbEl.textContent = fullTitle;
    document.title = fullTitle;

    const programEl = page.querySelector('[data-card-program]');
    const typeIssueEl = page.querySelector('[data-card-type-issue]');

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

    if (programEl) programEl.textContent = programMap[program] || programMap.line;
    if (typeIssueEl) typeIssueEl.textContent = typeIssueMap[program] || typeIssueMap.line;

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
      }
    };

    const statusCfg = statusMap[status] || statusMap.sign;
    if (statusBadgeEl) {
      statusBadgeEl.textContent = statusCfg.text;
      statusBadgeEl.classList.remove('green', 'orange', 'gray', 'dark', 'red');
      statusBadgeEl.classList.add(statusCfg.badgeClass);
    }
    if (statusNoteEl) statusNoteEl.textContent = statusCfg.note;
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

      if (existing) existing.remove();
    }

    render();
    window.addEventListener('resize', render);
    window.addEventListener('orientationchange', render);
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
  setupDesktopOnlyNotice();
  markInteractive();
})();
