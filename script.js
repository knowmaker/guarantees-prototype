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

    document.querySelectorAll('[data-hint-close]').forEach((el) => {
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
    document.querySelectorAll('[data-hint-close]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const hint = e.target.closest('.demo-hint');
        if (!hint) return;
        hint.classList.add('is-hidden');
      });
    });
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
          href: '04a-uproschennaya.html',
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
          href: '04c-edinorazovaya.html',
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
        href: '04b-liniya-form.html',
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

  setupRowLinks();
  setupCardLinks();
  setupPillLinks();
  setupToggleGroups();
  setupDemoHints();
  setupWizard();
  setupGuaranteeClassification();
  markInteractive();
})();
