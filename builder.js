/* ==========================================================================
   OMNI SEAS CHARACTER BUILDER & BUILD CALCULATOR ENGINE
   Based on official Plan.txt specifications
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // Maximum Build Constraints
  const MAX_TOTAL_STATS = 250;
  const MAX_MASTERY_TOTAL = 100;

  // DOM Elements
  const strSlider = document.getElementById('strSlider');
  const vitSlider = document.getElementById('vitSlider');
  const agiSlider = document.getElementById('agiSlider');

  const lightSlider = document.getElementById('lightSlider');
  const medSlider = document.getElementById('medSlider');
  const heavySlider = document.getElementById('heavySlider');
  const gunSlider = document.getElementById('gunSlider');

  const strValDisplay = document.getElementById('strVal');
  const vitValDisplay = document.getElementById('vitVal');
  const agiValDisplay = document.getElementById('agiVal');

  const lightValDisplay = document.getElementById('lightVal');
  const medValDisplay = document.getElementById('medVal');
  const heavyValDisplay = document.getElementById('heavyVal');
  const gunValDisplay = document.getElementById('gunVal');

  const pointsRemaining = document.getElementById('pointsRemaining');
  const masteryRemaining = document.getElementById('masteryRemaining');
  const totalAllocated = document.getElementById('totalAllocated');
  const buildProgressFill = document.getElementById('buildProgressFill');

  const charLevel = document.getElementById('charLevel');
  const archetypeName = document.getElementById('archetypeName');
  const factionBadge = document.getElementById('factionBadge');
  const startingOmni = document.getElementById('startingOmni');
  const levelPackCount = document.getElementById('levelPackCount');

  const healthBonus = document.getElementById('healthBonus');
  const healthRegen = document.getElementById('healthRegen');
  const staminaBonus = document.getElementById('staminaBonus');
  const staminaRegen = document.getElementById('staminaRegen');
  const enduranceBonus = document.getElementById('enduranceBonus');

  // Factions Selection
  const factionOptions = document.querySelectorAll('.faction-option');
  let currentFaction = 'Pirates';

  const factionOmniMap = {
    'Pirates': '50 Omni (Loguetown / Foosha / Orange Town)',
    'Marines': '75 Omni (Marine Base Headquarters)',
    'Revolutionaries': '40 Omni (Low-level Archipelago Hideouts)',
    'Adventurers': '60 Omni (Starter Island Choice)'
  };

  factionOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      factionOptions.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      currentFaction = opt.getAttribute('data-faction');
      factionBadge.textContent = currentFaction.toUpperCase();
      startingOmni.textContent = factionOmniMap[currentFaction];
    });
  });

  // State
  let stats = {
    str: 0,
    vit: 0,
    agi: 0,
    light: 0,
    med: 0,
    heavy: 0,
    gun: 0
  };

  let equippedCards = [];

  // Card Pool Definition (Respecting Plan.txt exact rules)
  const cardPool = [
    // Strength Cards
    { id: 'str_1', category: 'Strength', reqStat: 'str', reqVal: 0, title: 'Iron Lifting', desc: '+5% Heavy melee attack damage.' },
    { id: 'str_2', category: 'Strength', reqStat: 'str', reqVal: 20, title: 'Power Surge', desc: 'Breaks enemy block posture 15% faster.' },
    { id: 'str_3', category: 'Strength', reqStat: 'str', reqVal: 40, title: 'Titan Grip', desc: 'Reduces heavy attack stamina cost by 20%.' },
    { id: 'str_4', category: 'Strength', reqStat: 'str', reqVal: 60, title: 'Unstoppable Force', desc: 'Parrying heavy attacks knocks enemies back.' },
    { id: 'str_5', category: 'Strength', reqStat: 'str', reqVal: 80, title: 'Colossus Cleave', desc: 'Finisher attacks deal splash damage to nearby foes.' },

    // Vitality Cards
    { id: 'vit_1', category: 'Vitality', reqStat: 'vit', reqVal: 0, title: 'Hardened Skin', desc: '+8% Flat damage reduction.' },
    { id: 'vit_2', category: 'Vitality', reqStat: 'vit', reqVal: 20, title: 'Second Wind', desc: 'Instantly heals 15% HP when posture breaks.' },
    { id: 'vit_3', category: 'Vitality', reqStat: 'vit', reqVal: 40, title: 'Brawler Stamina', desc: 'Taking combat damage regenerates 5 stamina.' },
    { id: 'vit_4', category: 'Vitality', reqStat: 'vit', reqVal: 60, title: 'Iron Will', desc: 'Stun duration reduced by 30%.' },
    { id: 'vit_5', category: 'Vitality', reqStat: 'vit', reqVal: 80, title: 'Undying Vessel', desc: 'Survive fatal damage once per sea voyage.' },

    // Agility Cards
    { id: 'agi_1', category: 'Agility', reqStat: 'agi', reqVal: 0, title: 'Feathered Footwork', desc: '+10% Movement speed and sprint velocity.' },
    { id: 'agi_2', category: 'Agility', reqStat: 'agi', reqVal: 20, title: 'Shadow Roll', desc: 'Dodge roll grants 0.2s extra invulnerability frames.' },
    { id: 'agi_3', category: 'Agility', reqStat: 'agi', reqVal: 40, title: 'Phantom Dash', desc: 'Dashing behind enemies increases critical chance.' },
    { id: 'agi_4', category: 'Agility', reqStat: 'agi', reqVal: 60, title: 'Flow Like Water', desc: 'Parrying refunds full dodge stamina cost.' },
    { id: 'agi_5', category: 'Agility', reqStat: 'agi', reqVal: 80, title: 'Tempest Step', desc: 'Double dash creates a gust of wind disorienting foes.' },

    // Weapon Mastery Cards (Light)
    { id: 'wm_light_1', category: 'Light Mastery', reqStat: 'light', reqVal: 10, title: 'Swift Thrust', desc: 'Light weapon attack speed +15%.' },
    { id: 'wm_light_2', category: 'Light Mastery', reqStat: 'light', reqVal: 40, title: 'Flurry Parrying', desc: 'Light parries execute instant counter thrust.' },

    // Weapon Mastery Cards (Medium)
    { id: 'wm_med_1', category: 'Medium Mastery', reqStat: 'med', reqVal: 10, title: 'Balanced Stance', desc: 'Medium weapons deal +10% posture damage.' },
    { id: 'wm_med_2', category: 'Medium Mastery', reqStat: 'med', reqVal: 40, title: 'Blade Feinting', desc: 'Feinting medium attacks baits enemy parries.' },

    // Weapon Mastery Cards (Heavy)
    { id: 'wm_heavy_1', category: 'Heavy Mastery', reqStat: 'heavy', reqVal: 10, title: 'Crushing Blow', desc: 'Heavy weapon attacks cannot be blocked.' },
    { id: 'wm_heavy_2', category: 'Heavy Mastery', reqStat: 'heavy', reqVal: 40, title: 'Hyper Armor', desc: 'Gain hyper armor during heavy attack windups.' },

    // Weapon Mastery Cards (Gun)
    { id: 'wm_gun_1', category: 'Gun Mastery', reqStat: 'gun', reqVal: 10, title: 'Quick Draw', desc: 'Gun holstering and firing speed +25%.' },
    { id: 'wm_gun_2', category: 'Gun Mastery', reqStat: 'gun', reqVal: 40, title: 'Lead Burst', desc: 'Gun shots break enemy guard instantly.' }
  ];

  // Helper Functions
  function getWeaponMasterySum() {
    return stats.light + stats.med + stats.heavy + stats.gun;
  }

  function getTotalTrainableStats() {
    return stats.str + stats.vit + stats.agi + getWeaponMasterySum();
  }

  function calculateBuildArchetype() {
    const total = getTotalTrainableStats();
    if (total === 0) return 'NOVICE MARINER';

    if (stats.heavy >= 50 && stats.str >= 50) return 'HEAVY JUGGERNAUT';
    if (stats.gun >= 50 && stats.agi >= 50) return 'AGILE GUNSLINGER';
    if (stats.str >= 60 && stats.vit >= 60) return 'VITAL BRAWLER';
    if (stats.light >= 40 && stats.agi >= 60) return 'SHADOW BLADESMAN';
    if (stats.med >= 50 && stats.vit >= 40) return 'GRAND SWORDSMAN';
    if (total >= 200) return 'MASTER OCEAN CHAMPION';

    return 'BALANCED MARAUDER';
  }

  function updateUI() {
    const total = getTotalTrainableStats();
    const masteryTotal = getWeaponMasterySum();

    const remStats = MAX_TOTAL_STATS - total;
    const remMastery = MAX_MASTERY_TOTAL - masteryTotal;

    // Displays
    strValDisplay.textContent = stats.str;
    vitValDisplay.textContent = stats.vit;
    agiValDisplay.textContent = stats.agi;

    lightValDisplay.textContent = stats.light;
    medValDisplay.textContent = stats.med;
    heavyValDisplay.textContent = stats.heavy;
    gunValDisplay.textContent = stats.gun;

    pointsRemaining.textContent = remStats;
    masteryRemaining.textContent = remMastery;
    totalAllocated.textContent = total;

    const fillPercent = Math.min(100, (total / MAX_TOTAL_STATS) * 100);
    buildProgressFill.style.width = fillPercent + '%';

    // Level Calculation (Plan.txt: 1 level per 10 trainable stat points, max 25)
    const level = Math.min(25, Math.floor(total / 10));
    charLevel.textContent = level;
    levelPackCount.textContent = `${level} Card Packs Earned`;

    // Derived Stats Calculation (Plan.txt: +1% HP/HP Regen/Stamina/Stamina Regen, +2.5% Endurance per level)
    healthBonus.textContent = `+${level}%`;
    healthRegen.textContent = `+${level}%`;
    staminaBonus.textContent = `+${level}%`;
    staminaRegen.textContent = `+${level}%`;
    enduranceBonus.textContent = `+${(level * 2.5).toFixed(1)}%`;

    archetypeName.textContent = calculateBuildArchetype();
  }

  // Event Listeners for Sliders with strict cap enforcement
  function handleStatChange(slider, statKey) {
    const val = parseInt(slider.value, 10);
    const oldVal = stats[statKey];
    stats[statKey] = val;

    if (getTotalTrainableStats() > MAX_TOTAL_STATS) {
      const excess = getTotalTrainableStats() - MAX_TOTAL_STATS;
      stats[statKey] -= excess;
      slider.value = stats[statKey];
    }
    updateUI();
  }

  function handleMasteryChange(slider, masteryKey) {
    const val = parseInt(slider.value, 10);
    stats[masteryKey] = val;

    // Enforce Mastery Total Cap (100)
    if (getWeaponMasterySum() > MAX_MASTERY_TOTAL) {
      const excess = getWeaponMasterySum() - MAX_MASTERY_TOTAL;
      stats[masteryKey] -= excess;
      slider.value = stats[masteryKey];
    }

    // Enforce Total Build Cap (250)
    if (getTotalTrainableStats() > MAX_TOTAL_STATS) {
      const excess = getTotalTrainableStats() - MAX_TOTAL_STATS;
      stats[masteryKey] -= excess;
      slider.value = stats[masteryKey];
    }
    updateUI();
  }

  strSlider?.addEventListener('input', () => handleStatChange(strSlider, 'str'));
  vitSlider?.addEventListener('input', () => handleStatChange(vitSlider, 'vit'));
  agiSlider?.addEventListener('input', () => handleStatChange(agiSlider, 'agi'));

  lightSlider?.addEventListener('input', () => handleMasteryChange(lightSlider, 'light'));
  medSlider?.addEventListener('input', () => handleMasteryChange(medSlider, 'med'));
  heavySlider?.addEventListener('input', () => handleMasteryChange(heavySlider, 'heavy'));
  gunSlider?.addEventListener('input', () => handleMasteryChange(gunSlider, 'gun'));

  // Preset Buttons
  document.getElementById('presetHeavyBtn')?.addEventListener('click', () => {
    stats = { str: 100, vit: 50, agi: 0, light: 0, med: 0, heavy: 100, gun: 0 };
    syncSliders();
  });

  document.getElementById('presetGunslingerBtn')?.addEventListener('click', () => {
    stats = { str: 20, vit: 50, agi: 80, light: 0, med: 0, heavy: 0, gun: 100 };
    syncSliders();
  });

  document.getElementById('presetBalancedBtn')?.addEventListener('click', () => {
    stats = { str: 50, vit: 50, agi: 50, light: 25, med: 25, heavy: 25, gun: 25 };
    syncSliders();
  });

  document.getElementById('resetBuildBtn')?.addEventListener('click', () => {
    stats = { str: 0, vit: 0, agi: 0, light: 0, med: 0, heavy: 0, gun: 0 };
    equippedCards = [];
    renderEquippedCards();
    syncSliders();
  });

  function syncSliders() {
    strSlider.value = stats.str;
    vitSlider.value = stats.vit;
    agiSlider.value = stats.agi;

    lightSlider.value = stats.light;
    medSlider.value = stats.med;
    heavySlider.value = stats.heavy;
    gunSlider.value = stats.gun;

    updateUI();
  }

  // --------------------------------------------------------------------------
  // 5-Card Level Draw Simulator
  // --------------------------------------------------------------------------
  const drawCardsBtn = document.getElementById('drawCardsBtn');
  const cardsDrawContainer = document.getElementById('cardsDrawContainer');
  const equippedCardsList = document.getElementById('equippedCardsList');
  const equippedCount = document.getElementById('equippedCount');

  drawCardsBtn?.addEventListener('click', () => {
    // Filter cards based on stat prerequisites (Plan.txt: respects exact stat thresholds)
    const validCards = cardPool.filter(card => {
      const statVal = stats[card.reqStat] || 0;
      return statVal >= card.reqVal;
    });

    if (validCards.length < 5) {
      cardsDrawContainer.innerHTML = `
        <div style="text-align: center; padding: 20px; color: var(--rs-gold);">
          <i class="fa-solid fa-triangle-exclamation" style="font-size: 2rem; margin-bottom: 10px;"></i>
          <p>Allocate more stat points to unlock 5-card level draw pools!</p>
        </div>
      `;
      return;
    }

    // Shuffle and pick 5 random cards
    const shuffled = [...validCards].sort(() => 0.5 - Math.random());
    const drawnFive = shuffled.slice(0, 5);

    renderDrawnCards(drawnFive);
  });

  function renderDrawnCards(fiveCards) {
    cardsDrawContainer.innerHTML = '';
    const cardsGrid = document.createElement('div');
    cardsGrid.className = 'drawn-cards-grid';

    fiveCards.forEach(card => {
      const cardEl = document.createElement('div');
      cardEl.className = 'drawn-card-item tilt-card';

      cardEl.innerHTML = `
        <div class="card-category-badge">${card.category}</div>
        <h4 class="card-item-title">${card.title}</h4>
        <p class="card-item-desc">${card.desc}</p>
        <button class="rs-btn-primary btn-shimmer select-card-btn" style="padding: 8px 14px; font-size: 0.75rem; width: 100%; margin-top: 12px;">
          PICK CARD
        </button>
      `;

      cardEl.querySelector('.select-card-btn').addEventListener('click', () => {
        if (!equippedCards.some(c => c.id === card.id)) {
          equippedCards.push(card);
          renderEquippedCards();
        }
        cardsDrawContainer.innerHTML = `
          <div style="text-align: center; padding: 20px; color: var(--rs-cyan);">
            <i class="fa-solid fa-circle-check" style="font-size: 2rem; margin-bottom: 10px;"></i>
            <p><strong>${card.title}</strong> equipped to your character deck!</p>
          </div>
        `;
      });

      cardsGrid.appendChild(cardEl);
    });

    cardsDrawContainer.appendChild(cardsGrid);
  }

  function renderEquippedCards() {
    equippedCount.textContent = equippedCards.length;

    if (equippedCards.length === 0) {
      equippedCardsList.innerHTML = `<span style="color: var(--text-muted); font-size: 0.85rem;">No talent cards selected yet.</span>`;
      return;
    }

    equippedCardsList.innerHTML = '';
    equippedCards.forEach((c, idx) => {
      const tag = document.createElement('div');
      tag.className = 'equipped-card-tag';
      tag.innerHTML = `
        <span><strong>${c.title}</strong> (${c.category})</span>
        <button class="remove-card-btn" data-index="${idx}"><i class="fa-solid fa-xmark"></i></button>
      `;
      tag.querySelector('.remove-card-btn').addEventListener('click', () => {
        equippedCards.splice(idx, 1);
        renderEquippedCards();
      });
      equippedCardsList.appendChild(tag);
    });
  }

  // Initial Sync
  syncSliders();

});
