const fs = require('fs');

let html = fs.readFileSync('C:/Users/FSOS/kaivensoftware/builder.html', 'utf8');

const targetStr = `              <h3><i class="fa-solid fa-khanda text-gold"></i> WEAPON MASTERY</h3>
              <span class="stat-pool-badge" id="masteryPoolBadge">MASTERY REMAINING: <strong id="masteryRemaining" class="text-gold">100</strong> / 100</span>
            </div>`;

const replacementStr = `              <h3><i class="fa-solid fa-khanda text-gold"></i> WEAPON & MASTERY</h3>
              <span class="stat-pool-badge" id="masteryPoolBadge">MASTERY REMAINING: <strong id="masteryRemaining" class="text-gold">100</strong> / 100</span>
            </div>

            <!-- Weapon / Style Dropdown Selector (Categorized LHT, MED, HVY) -->
            <div style="margin-bottom: 20px;">
              <label style="font-size: 0.8rem; font-weight: 800; color: var(--rs-gold); display: block; margin-bottom: 6px;"><i class="fa-solid fa-wand-magic-sparkles"></i> SELECT WEAPON / STYLE (12)</label>
              <select id="weaponSelect" class="rs-select" style="border-color: var(--rs-gold);">
                <optgroup label="LIGHT MASTERY (LHT STYLES)">
                  <option value="Viltrumite Style" data-dmg="35">Viltrumite Style (LHT - Base Dmg: 35)</option>
                  <option value="Taijutsu" data-dmg="30">Taijutsu (LHT - Base Dmg: 30)</option>
                </optgroup>
                <optgroup label="MEDIUM MASTERY (MED WEAPONS)">
                  <option value="Shusui" data-dmg="25" selected>Shusui (MED - Base Dmg: 25)</option>
                  <option value="Nidai Kitetsu" data-dmg="27">Nidai Kitetsu (MED - Base Dmg: 27)</option>
                  <option value="Shodaki Kitetsu" data-dmg="27">Shodaki Kitetsu (MED - Base Dmg: 27)</option>
                  <option value="Ame No Habakiri" data-dmg="30">Ame No Habakiri (MED - Base Dmg: 30)</option>
                  <option value="Wado Ichimonji" data-dmg="30">Wado Ichimonji (MED - Base Dmg: 30)</option>
                  <option value="Zanpakutō" data-dmg="25">Zanpakutō (MED - Base Dmg: 25)</option>
                  <option value="Shikai" data-dmg="30">Shikai (MED - Base Dmg: 30)</option>
                  <option value="Letzt Stil" data-dmg="30">Letzt Stil (MED - Base Dmg: 30)</option>
                </optgroup>
                <optgroup label="HEAVY MASTERY (HVY WEAPONS)">
                  <option value="Bankai" data-dmg="35">Bankai (HVY - Base Dmg: 35)</option>
                  <option value="Vollständig" data-dmg="35">Vollständig (HVY - Base Dmg: 35)</option>
                </optgroup>
              </select>
            </div>`;

if (html.includes(targetStr)) {
  html = html.replace(targetStr, replacementStr);
  console.log('Inserted weaponSelect successfully!');
} else {
  console.log('targetStr not found!');
}

// Add banner after archetype name
const targetArch = `<h2 class="build-archetype-name" id="archetypeName">NOVICE MARINER</h2>`;
const replacementArch = `<h2 class="build-archetype-name" id="archetypeName">NOVICE MARINER</h2>

            <!-- Selected Weapon & Modified Output Damage Highlights Banner -->
            <div style="margin-top: 14px; background: rgba(255, 209, 102, 0.08); border: 1px solid var(--rs-gold); border-radius: 6px; padding: 14px; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 800; display: block;">EQUIPPED WEAPON / STYLE</span>
                <strong style="color: var(--rs-gold); font-size: 1.05rem; font-weight: 900;" id="activeWeaponName">Shusui (MED)</strong>
              </div>
              <div style="text-align: right;">
                <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 800; display: block;">SCALED HIT DAMAGE</span>
                <strong style="color: #2ed573; font-size: 1.25rem; font-weight: 900;" id="finalWeaponDmgVal">25.0 DMG</strong>
              </div>
            </div>`;

if (html.includes(targetArch)) {
  html = html.replace(targetArch, replacementArch);
  console.log('Inserted activeWeaponName banner successfully!');
}

// Update script tags to ?v=1.0.4
html = html.replace('app.js', 'app.js?v=1.0.4');
html = html.replace('builder.js', 'builder.js?v=1.0.4');
html = html.replace('style.css', 'style.css?v=1.0.4');

fs.writeFileSync('C:/Users/FSOS/kaivensoftware/builder.html', html);
