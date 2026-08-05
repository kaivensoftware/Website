/* ==========================================================================
   OMNI SEAS CHARACTER BUILDER & BUILD CALCULATOR ENGINE
   Max 30 Cards Pick Limit, Clean Titles, 250 Total Stat Cap, 100 Mastery Cap
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // Maximum Build Constraints
  const MAX_SINGLE_STAT = 100;
  const MAX_TOTAL_STATS = 250;
  const MAX_MASTERY_TOTAL = 100;
  const MAX_EQUIPPED_CARDS = 30;

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
  const levelPackCount = document.getElementById('levelPackCount');

  const healthBonus = document.getElementById('healthBonus');
  const healthRegen = document.getElementById('healthRegen');
  const staminaBonus = document.getElementById('staminaBonus');
  const staminaRegen = document.getElementById('staminaRegen');
  const enduranceBonus = document.getElementById('enduranceBonus');

  const activeCardBuffsList = document.getElementById('activeCardBuffsList');
  const buffsCountBadge = document.getElementById('buffsCountBadge');

  // Factions Selection
  const factionOptions = document.querySelectorAll('.faction-option');
  let currentFaction = 'Pirates';

  factionOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      factionOptions.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      currentFaction = opt.getAttribute('data-faction');
      if (factionBadge) factionBadge.textContent = currentFaction.toUpperCase();
      updateUI();
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
  let selectedCategory = 'ALL';

  // 233 Talent Cards (from Cards.txt)
  const cardPool = [{"name":"Heavy Hauler","req":"0 STR","category":"Strength","effect":"+3% Physical Damage, +2% Weapon Damage"},{"name":"Crushing Palm","req":"0 STR","category":"Strength","effect":"+4% Fighting Style Damage"},{"name":"Iron Grip","req":"0 STR","category":"Strength","effect":"+3% Max Posture"},{"name":"Tremor Stride","req":"0 STR","category":"Strength","effect":"+3% Physical Damage"},{"name":"Anchor Stance","req":"0 STR","category":"Strength","effect":"+3% Endurance"},{"name":"Raw Might","req":"20 STR","category":"Strength","effect":"+5% Physical Damage"},{"name":"Bone Breaker","req":"20 STR","category":"Strength","effect":"+6% Weapon Damage"},{"name":"Overbearing Swing","req":"20 STR","category":"Strength","effect":"+8% Physical Damage"},{"name":"Sledge Impact","req":"20 STR","category":"Strength","effect":"+6% Max Posture"},{"name":"Brawny Guard","req":"20 STR","category":"Strength","effect":"+5% Defense"},{"name":"Impact Driver","req":"40 STR","category":"Strength","effect":"+10% Weapon Damage"},{"name":"Ground Pounder","req":"40 STR","category":"Strength","effect":"+10% Physical Damage"},{"name":"Shatter Pulse","req":"40 STR","category":"Strength","effect":"+12% Physical Damage"},{"name":"Titan Reach","req":"40 STR","category":"Strength","effect":"+8% Total Damage"},{"name":"Forceful Thrust","req":"40 STR","category":"Strength","effect":"+10% Weapon Damage"},{"name":"Unyielding Force","req":"60 STR","category":"Strength","effect":"+12% Physical Damage"},{"name":"Colossal Weight","req":"60 STR","category":"Strength","effect":"+15% Weapon Damage"},{"name":"Seismic Strike","req":"60 STR","category":"Strength","effect":"+10% Physical Damage, +5% Stun Resistance"},{"name":"Wrecking Blow","req":"60 STR","category":"Strength","effect":"+14% Physical Damage"},{"name":"Ironclad Fist","req":"60 STR","category":"Strength","effect":"+10% Defense, +5% Endurance"},{"name":"Apex Might","req":"80 STR","category":"Strength","effect":"+18% Physical Damage"},{"name":"Mountain Splitting Strike","req":"80 STR","category":"Strength","effect":"+20% Physical Damage"},{"name":"Absolute Impact","req":"80 STR","category":"Strength","effect":"+15% Weapon Damage, +10% Max Posture"},{"name":"Giant's Pressure","req":"80 STR","category":"Strength","effect":"+15% Total Damage"},{"name":"Cataclysmic Swing","req":"80 STR","category":"Strength","effect":"+20% Total Damage"},{"name":"Thick Skin","req":"0 VIT","category":"Vitality","effect":"+3% Max HP"},{"name":"Tough Fiber","req":"0 VIT","category":"Vitality","effect":"+3% Health Regen"},{"name":"Steady Heart","req":"0 VIT","category":"Vitality","effect":"-3% Debuff Duration"},{"name":"Sturdy Frame","req":"0 VIT","category":"Vitality","effect":"+2% Defense"},{"name":"Hardened Core","req":"0 VIT","category":"Vitality","effect":"+4% Endurance"},{"name":"Vital Surge","req":"20 VIT","category":"Vitality","effect":"+5% Max HP"},{"name":"Rapid Clotting","req":"20 VIT","category":"Vitality","effect":"+8% Health Regen"},{"name":"Iron Will","req":"20 VIT","category":"Vitality","effect":"+6% Defense when below 50% HP"},{"name":"Tenacious Body","req":"20 VIT","category":"Vitality","effect":"+8% Stun Resistance"},{"name":"Restorative Breath","req":"20 VIT","category":"Vitality","effect":"+4% HP Regen, +3% Max Stamina"},{"name":"Dense Musculature","req":"40 VIT","category":"Vitality","effect":"+8% Max HP, +5% Stun Resistance"},{"name":"Second Wind","req":"40 VIT","category":"Vitality","effect":"+12% Health Regen when below 35% HP"},{"name":"Pain Tolerance","req":"40 VIT","category":"Vitality","effect":"+6% Defense"},{"name":"Bastion Vitality","req":"40 VIT","category":"Vitality","effect":"+10% Max Posture"},{"name":"Unshakable Blood","req":"40 VIT","category":"Vitality","effect":"-10% Debuff Duration"},{"name":"Fortress Flesh","req":"60 VIT","category":"Vitality","effect":"+12% Max HP"},{"name":"Enduring Vessel","req":"60 VIT","category":"Vitality","effect":"+15% Health Regen"},{"name":"Unyielding Bone","req":"60 VIT","category":"Vitality","effect":"+10% Defense, +5% Endurance"},{"name":"Vital Overdrive","req":"60 VIT","category":"Vitality","effect":"+15% HP Regen"},{"name":"Resilient Pulse","req":"60 VIT","category":"Vitality","effect":"+10% Max HP, +10% Defense"},{"name":"Immortal Foundation","req":"80 VIT","category":"Vitality","effect":"+18% Max HP"},{"name":"Regeneration Surge","req":"80 VIT","category":"Vitality","effect":"+25% Health Regen"},{"name":"Granite Core","req":"80 VIT","category":"Vitality","effect":"+12% Defense"},{"name":"Invulnerable Frame","req":"80 VIT","category":"Vitality","effect":"+15% Stun Resistance, +15% Max Posture"},{"name":"Aegis Bloodline","req":"80 VIT","category":"Vitality","effect":"+20% Defense when HP drops below 20%"},{"name":"Fleet Footed","req":"0 AGI","category":"Agility","effect":"+3% Movement Speed"},{"name":"Light Step","req":"0 AGI","category":"Agility","effect":"-3% Reduced Stamina Drain"},{"name":"Nimble Dodge","req":"0 AGI","category":"Agility","effect":"+3% Evasion"},{"name":"Quick Recovery","req":"0 AGI","category":"Agility","effect":"+3% Stamina Regen"},{"name":"Swift Pivot","req":"0 AGI","category":"Agility","effect":"+4% Movement Speed"},{"name":"Gust Dash","req":"20 AGI","category":"Agility","effect":"+5% Evasion, -5% Reduced Stamina Drain"},{"name":"Wind Sprint","req":"20 AGI","category":"Agility","effect":"+6% Movement Speed"},{"name":"Flowing Stamina","req":"20 AGI","category":"Agility","effect":"+8% Stamina Regen"},{"name":"Evader's Instinct","req":"20 AGI","category":"Agility","effect":"+5% Evasion"},{"name":"Rapid Step","req":"20 AGI","category":"Agility","effect":"+5% Movement Speed"},{"name":"Gale Footwork","req":"40 AGI","category":"Agility","effect":"+8% Movement Speed, +5% Evasion"},{"name":"Slippery Target","req":"40 AGI","category":"Agility","effect":"-10% Reduced Stamina Drain"},{"name":"Adrenaline Surge","req":"40 AGI","category":"Agility","effect":"+10% Stamina Regen"},{"name":"Feathered Body","req":"40 AGI","category":"Agility","effect":"+5% Movement Speed, +5% Evasion"},{"name":"Kinetic Flow","req":"40 AGI","category":"Agility","effect":"+8% Movement Speed"},{"name":"Phantom Stride","req":"60 AGI","category":"Agility","effect":"+12% Movement Speed, +8% Evasion"},{"name":"Lightning Reflex","req":"60 AGI","category":"Agility","effect":"+12% Evasion"},{"name":"Wind Dancer","req":"60 AGI","category":"Agility","effect":"+12% Stamina Regen"},{"name":"Swift Evasion","req":"60 AGI","category":"Agility","effect":"+15% Movement Speed after dodging"},{"name":"Acrobatic Recovery","req":"60 AGI","category":"Agility","effect":"-15% Reduced Stamina Drain"},{"name":"Velocity Mastery","req":"80 AGI","category":"Agility","effect":"+15% Movement Speed"},{"name":"Mirage Motion","req":"80 AGI","category":"Agility","effect":"+15% Evasion"},{"name":"Endless Wind","req":"80 AGI","category":"Agility","effect":"-20% Reduced Stamina Drain, +15% Stamina Regen"},{"name":"Blur Shift","req":"80 AGI","category":"Agility","effect":"+10% Movement Speed, +10% Evasion"},{"name":"Apex Agility","req":"80 AGI","category":"Agility","effect":"+15% Stamina Regen, +10% Movement Speed"},{"name":"Needle Point","req":"0 Light Mastery","category":"Light Mastery","effect":"+3% Weapon Damage"},{"name":"Swift Flourish","req":"0 Light Mastery","category":"Light Mastery","effect":"-3% Reduced Stamina Drain"},{"name":"Quick Stun","req":"0 Light Mastery","category":"Light Mastery","effect":"+3% Stun Resistance"},{"name":"Rapid Thrust","req":"0 Light Mastery","category":"Light Mastery","effect":"+3% Skill Damage"},{"name":"Flick Wrist","req":"0 Light Mastery","category":"Light Mastery","effect":"-3% Skill Cooldown Reduction"},{"name":"Viper Slash","req":"20 Light Mastery","category":"Light Mastery","effect":"+5% Weapon Damage"},{"name":"Razor Edge","req":"20 Light Mastery","category":"Light Mastery","effect":"+6% Fighting Style Damage"},{"name":"Stabbing Momentum","req":"20 Light Mastery","category":"Light Mastery","effect":"+5% Movement Speed"},{"name":"Nimble Guard","req":"20 Light Mastery","category":"Light Mastery","effect":"+5% Defense"},{"name":"Precise Cutter","req":"20 Light Mastery","category":"Light Mastery","effect":"+5% Physical Damage"},{"name":"Cobra Strike","req":"40 Light Mastery","category":"Light Mastery","effect":"+8% Weapon Damage"},{"name":"Flurry Stance","req":"40 Light Mastery","category":"Light Mastery","effect":"+10% Fighting Style Damage"},{"name":"Puncturing Edge","req":"40 Light Mastery","category":"Light Mastery","effect":"+8% Physical Damage"},{"name":"Agile Feint","req":"40 Light Mastery","category":"Light Mastery","effect":"+8% Stamina Regen"},{"name":"Swift Retaliation","req":"40 Light Mastery","category":"Light Mastery","effect":"+10% Total Damage after counter"},{"name":"Tempest Blade","req":"60 Light Mastery","category":"Light Mastery","effect":"+12% Weapon Damage"},{"name":"Blitz Cadence","req":"60 Light Mastery","category":"Light Mastery","effect":"-10% Skill Cooldown Reduction"},{"name":"Needle Precision","req":"60 Light Mastery","category":"Light Mastery","effect":"+12% Physical Damage"},{"name":"Dancing Edge","req":"60 Light Mastery","category":"Light Mastery","effect":"-12% Reduced Stamina Drain"},{"name":"Critical Piercer","req":"60 Light Mastery","category":"Light Mastery","effect":"+15% Total Damage"},{"name":"Apex Light Master","req":"80 Light Mastery","category":"Light Mastery","effect":"+15% Weapon Damage, +10% Physical Damage"},{"name":"Hurricane Swarm","req":"80 Light Mastery","category":"Light Mastery","effect":"+15% Fighting Style Damage"},{"name":"Phantom Strike","req":"80 Light Mastery","category":"Light Mastery","effect":"+12% Evasion, +8% Weapon Damage"},{"name":"Lethal Precision","req":"80 Light Mastery","category":"Light Mastery","effect":"+18% Physical Damage"},{"name":"Unmatched Speed","req":"80 Light Mastery","category":"Light Mastery","effect":"+15% Movement Speed, -10% Skill Cooldown Reduction"},{"name":"Balanced Grip","req":"0 Medium Mastery","category":"Medium Mastery","effect":"+3% Weapon Damage"},{"name":"Steady Blade","req":"0 Medium Mastery","category":"Medium Mastery","effect":"+3% Defense"},{"name":"Center Guard","req":"0 Medium Mastery","category":"Medium Mastery","effect":"+3% Max Posture"},{"name":"Versatile Stance","req":"0 Medium Mastery","category":"Medium Mastery","effect":"-3% Reduced Stamina Drain"},{"name":"Clean Sweep","req":"0 Medium Mastery","category":"Medium Mastery","effect":"+3% Physical Damage"},{"name":"Duelist Posture","req":"20 Medium Mastery","category":"Medium Mastery","effect":"+5% Weapon Damage"},{"name":"Parry Rhythm","req":"20 Medium Mastery","category":"Medium Mastery","effect":"+5% Defense"},{"name":"Guarding Edge","req":"20 Medium Mastery","category":"Medium Mastery","effect":"+6% Max Posture"},{"name":"Swift Slash","req":"20 Medium Mastery","category":"Medium Mastery","effect":"+5% Physical Damage"},{"name":"Iron Counter","req":"20 Medium Mastery","category":"Medium Mastery","effect":"+6% Defense"},{"name":"Precision Saber","req":"40 Medium Mastery","category":"Medium Mastery","effect":"+8% Weapon Damage"},{"name":"Master Parry","req":"40 Medium Mastery","category":"Medium Mastery","effect":"+8% Stamina Regen"},{"name":"Flawless Balance","req":"40 Medium Mastery","category":"Medium Mastery","effect":"-8% Reduced Stamina Drain"},{"name":"Ripple Guard","req":"40 Medium Mastery","category":"Medium Mastery","effect":"+10% Defense"},{"name":"Striking Edge","req":"40 Medium Mastery","category":"Medium Mastery","effect":"+8% Total Damage"},{"name":"Sentinel Stance","req":"60 Medium Mastery","category":"Medium Mastery","effect":"+12% Weapon Damage"},{"name":"Perfect Deflection","req":"60 Medium Mastery","category":"Medium Mastery","effect":"+10% Defense, +5% Stun Resistance"},{"name":"Tactical Mastery","req":"60 Medium Mastery","category":"Medium Mastery","effect":"-10% Skill Cooldown Reduction"},{"name":"Unyielding Sword","req":"60 Medium Mastery","category":"Medium Mastery","effect":"+10% Defense, +8% Physical Damage"},{"name":"Swift Deflect","req":"60 Medium Mastery","category":"Medium Mastery","effect":"+10% Max Posture"},{"name":"Grandmaster Duelist","req":"80 Medium Mastery","category":"Medium Mastery","effect":"+15% Weapon Damage, +10% Defense"},{"name":"Spatial Edge","req":"80 Medium Mastery","category":"Medium Mastery","effect":"+15% Total Damage"},{"name":"Supreme Guard","req":"80 Medium Mastery","category":"Medium Mastery","effect":"+18% Defense"},{"name":"Countering Cleave","req":"80 Medium Mastery","category":"Medium Mastery","effect":"+20% Physical Damage after parrying"},{"name":"Apex Medium Master","req":"80 Medium Mastery","category":"Medium Mastery","effect":"+18% Total Damage"},{"name":"Crushing Weight","req":"0 Heavy Mastery","category":"Heavy Mastery","effect":"+3% Max Posture"},{"name":"Heavy Swing","req":"0 Heavy Mastery","category":"Heavy Mastery","effect":"+3% Weapon Damage"},{"name":"Anchor Weight","req":"0 Heavy Mastery","category":"Heavy Mastery","effect":"+3% Endurance"},{"name":"Wide Arc","req":"0 Heavy Mastery","category":"Heavy Mastery","effect":"+3% Physical Damage"},{"name":"Brute Slam","req":"0 Heavy Mastery","category":"Heavy Mastery","effect":"+3% Total Damage"},{"name":"Mighty Cleave","req":"20 Heavy Mastery","category":"Heavy Mastery","effect":"+6% Weapon Damage"},{"name":"Shield Crusher","req":"20 Heavy Mastery","category":"Heavy Mastery","effect":"+6% Physical Damage"},{"name":"Impact Frame","req":"20 Heavy Mastery","category":"Heavy Mastery","effect":"+5% Max Posture"},{"name":"Unstoppable Windup","req":"20 Heavy Mastery","category":"Heavy Mastery","effect":"+5% Defense"},{"name":"Heavy Momentum","req":"20 Heavy Mastery","category":"Heavy Mastery","effect":"-5% Reduced Stamina Drain"},{"name":"Shatter Blade","req":"40 Heavy Mastery","category":"Heavy Mastery","effect":"+10% Physical Damage"},{"name":"Iron Cleaver","req":"40 Heavy Mastery","category":"Heavy Mastery","effect":"+8% Weapon Damage"},{"name":"Colossal Impact","req":"40 Heavy Mastery","category":"Heavy Mastery","effect":"+10% Max Posture"},{"name":"Staggering Slam","req":"40 Heavy Mastery","category":"Heavy Mastery","effect":"+8% Stun Resistance"},{"name":"Enduring Swing","req":"40 Heavy Mastery","category":"Heavy Mastery","effect":"+8% Defense"},{"name":"Titan Cleave","req":"60 Heavy Mastery","category":"Heavy Mastery","effect":"+12% Weapon Damage"},{"name":"Demolition Force","req":"60 Heavy Mastery","category":"Heavy Mastery","effect":"+15% Physical Damage"},{"name":"Earth Shatter","req":"60 Heavy Mastery","category":"Heavy Mastery","effect":"+12% Total Damage"},{"name":"Unbending Titan","req":"60 Heavy Mastery","category":"Heavy Mastery","effect":"+10% Stun Resistance"},{"name":"Devastating Impact","req":"60 Heavy Mastery","category":"Heavy Mastery","effect":"+12% Physical Damage"},{"name":"World Breaker","req":"80 Heavy Mastery","category":"Heavy Mastery","effect":"+18% Weapon Damage"},{"name":"Cataclysm Slam","req":"80 Heavy Mastery","category":"Heavy Mastery","effect":"+25% Physical Damage"},{"name":"Immovable Force","req":"80 Heavy Mastery","category":"Heavy Mastery","effect":"+15% Stun Resistance, +10% Defense"},{"name":"Dreadful Sweep","req":"80 Heavy Mastery","category":"Heavy Mastery","effect":"+20% Total Damage"},{"name":"Apex Heavy Master","req":"80 Heavy Mastery","category":"Heavy Mastery","effect":"+20% Max Posture, +10% Weapon Damage"},{"name":"Quick Aim","req":"0 Gun Mastery","category":"Gun Mastery","effect":"-3% Skill Cooldown Reduction"},{"name":"Lead Shot","req":"0 Gun Mastery","category":"Gun Mastery","effect":"+3% Weapon Damage"},{"name":"Powder Charge","req":"0 Gun Mastery","category":"Gun Mastery","effect":"+3% Skill Damage"},{"name":"Swift Chamber","req":"0 Gun Mastery","category":"Gun Mastery","effect":"-3% Reduced Stamina Drain"},{"name":"Piercing Round","req":"0 Gun Mastery","category":"Gun Mastery","effect":"+2% Physical Damage"},{"name":"Gunslinger Step","req":"20 Gun Mastery","category":"Gun Mastery","effect":"+5% Movement Speed"},{"name":"Heavy Caliber","req":"20 Gun Mastery","category":"Gun Mastery","effect":"+6% Weapon Damage"},{"name":"Rapid Reload","req":"20 Gun Mastery","category":"Gun Mastery","effect":"-5% Skill Cooldown Reduction"},{"name":"Precise Trigger","req":"20 Gun Mastery","category":"Gun Mastery","effect":"+5% Skill Damage"},{"name":"Ricochet Focus","req":"20 Gun Mastery","category":"Gun Mastery","effect":"+5% Physical Damage"},{"name":"Marksman Eye","req":"40 Gun Mastery","category":"Gun Mastery","effect":"+8% Weapon Damage, +5% Skill Damage"},{"name":"Point Blank","req":"40 Gun Mastery","category":"Gun Mastery","effect":"+10% Physical Damage"},{"name":"Quick Reloading","req":"40 Gun Mastery","category":"Gun Mastery","effect":"-10% Skill Cooldown Reduction"},{"name":"Staggering Bullet","req":"40 Gun Mastery","category":"Gun Mastery","effect":"+8% Stun Resistance"},{"name":"Mobile Shot","req":"40 Gun Mastery","category":"Gun Mastery","effect":"+10% Movement Speed"},{"name":"Sniper Focus","req":"60 Gun Mastery","category":"Gun Mastery","effect":"+12% Skill Damage"},{"name":"Blast Powder","req":"60 Gun Mastery","category":"Gun Mastery","effect":"+12% Weapon Damage"},{"name":"Rapid Fire Stance","req":"60 Gun Mastery","category":"Gun Mastery","effect":"-15% Skill Cooldown Reduction"},{"name":"Penetrating Lead","req":"60 Gun Mastery","category":"Gun Mastery","effect":"+12% Physical Damage"},{"name":"Executioner Round","req":"60 Gun Mastery","category":"Gun Mastery","effect":"+15% Total Damage against low HP targets"},{"name":"Apex Gunner","req":"80 Gun Mastery","category":"Gun Mastery","effect":"+18% Weapon Damage"},{"name":"Deadeye Shot","req":"80 Gun Mastery","category":"Gun Mastery","effect":"+25% Skill Damage"},{"name":"Quickdraw Sentinel","req":"80 Gun Mastery","category":"Gun Mastery","effect":"-20% Skill Cooldown Reduction"},{"name":"Ballistic Barrage","req":"80 Gun Mastery","category":"Gun Mastery","effect":"+15% Skill Damage, +10% Movement Speed"},{"name":"Caliber Mastery","req":"80 Gun Mastery","category":"Gun Mastery","effect":"+20% Physical Damage"},{"name":"Monolithic Bastion","req":"70 STR, 70 VIT, 30 Heavy Mastery","category":"High Multi-Stat","effect":"+15% Max HP, +12% Defense, +10% Stun Resistance"},{"name":"Juggernaut Overdrive","req":"80 STR, 80 VIT","category":"High Multi-Stat","effect":"+15% Physical Damage, +15% Max HP, +10% Total Damage"},{"name":"Tempest Executioner","req":"70 AGI, 70 STR, 40 Light Mastery","category":"High Multi-Stat","effect":"+15% Movement Speed, +12% Weapon Damage, -10% Skill Cooldown Reduction"},{"name":"Apex Skirmisher Stance","req":"60 AGI, 60 STR, 40 Gun Mastery","category":"High Multi-Stat","effect":"+12% Skill Damage, +10% Movement Speed, +10% Total Damage"},{"name":"Ironhide Dreadnought","req":"80 VIT, 60 STR, 40 Medium Mastery","category":"High Multi-Stat","effect":"+18% Max HP, +10% Physical Damage, +12% Defense"},{"name":"Phantasm Bladecraft","req":"70 AGI, 50 VIT, 70 Light Mastery","category":"High Multi-Stat","effect":"+12% Evasion, +12% Weapon Damage, +8% Health Regen"},{"name":"Unyielding Gladiator","req":"60 STR, 60 VIT, 60 AGI","category":"High Multi-Stat","effect":"+10% Physical Damage, +10% Max HP, +10% Movement Speed, +10% Stamina Regen"},{"name":"Colossal Warbringer","req":"80 STR, 50 VIT, 50 Heavy Mastery","category":"High Multi-Stat","effect":"+18% Physical Damage, +10% Weapon Damage, +10% Max Posture"},{"name":"Ballistic Phantom","req":"80 AGI, 40 STR, 50 Gun Mastery","category":"High Multi-Stat","effect":"+15% Movement Speed, +12% Weapon Damage, +10% Stun Resistance"},{"name":"Aegis Sentinel","req":"80 VIT, 40 STR, 50 Medium Mastery","category":"High Multi-Stat","effect":"+20% Health Regen, +10% Defense, +8% Physical Damage"},{"name":"Cataclysmic Duelist","req":"60 STR, 60 AGI, 50 Medium Mastery","category":"High Multi-Stat","effect":"+12% Physical Damage, +10% Evasion, +10% Weapon Damage"},{"name":"Vanguard Breaker","req":"70 STR, 40 VIT, 60 Heavy Mastery","category":"High Multi-Stat","effect":"+15% Weapon Damage, +10% Defense, +10% Stun Resistance"},{"name":"Gale Marksman","req":"70 AGI, 50 VIT, 50 Gun Mastery","category":"High Multi-Stat","effect":"+10% Evasion, +10% Movement Speed, +8% Max HP"},{"name":"Titan Fortress","req":"75 STR, 75 VIT, 50 Heavy Mastery","category":"High Multi-Stat","effect":"+15% Physical Damage, +15% Max HP, +15% Defense"},{"name":"Blitz Sovereign","req":"75 AGI, 50 STR, 50 Light Mastery","category":"High Multi-Stat","effect":"+15% Movement Speed, +12% Weapon Damage, +10% Total Damage"},{"name":"Absolute Order","req":"40 STR, 20 Gun Mastery, Marine Faction","category":"Marine","effect":"+8% Weapon Damage, +5% Physical Damage"},{"name":"Iron Justice","req":"50 VIT, 30 Medium Mastery, Marine Faction","category":"Marine","effect":"+10% Defense, +5% Max HP"},{"name":"Tactical Fleet Stance","req":"40 AGI, 20 Gun Mastery, Marine Faction","category":"Marine","effect":"-8% Skill Cooldown Reduction, +5% Movement Speed"},{"name":"Buster Command","req":"60 STR, 40 Heavy Mastery, Marine Faction","category":"Marine","effect":"+12% Physical Damage, +8% Total Damage"},{"name":"Righteous Pursuit","req":"50 AGI, 30 Light Mastery, Marine Faction","category":"Marine","effect":"+10% Movement Speed, +5% Weapon Damage"},{"name":"Plunderer's Greed","req":"30 AGI, 20 Light Mastery, Pirate Faction","category":"Pirate","effect":"+5% Movement Speed, +5% Weapon Damage"},{"name":"Reckless Broadside","req":"50 STR, 30 Gun Mastery, Pirate Faction","category":"Pirate","effect":"+10% Weapon Damage, +5% Physical Damage"},{"name":"Marauder's Grit","req":"60 VIT, 20 Heavy Mastery, Pirate Faction","category":"Pirate","effect":"+12% Max HP, +8% Total Damage when low HP"},{"name":"Corsair Step","req":"50 AGI, 30 Medium Mastery, Pirate Faction","category":"Pirate","effect":"+8% Evasion, +5% Defense"},{"name":"Flag of Chaos","req":"70 STR, 30 Heavy Mastery, Pirate Faction","category":"Pirate","effect":"+15% Physical Damage"},{"name":"Subversive Intel","req":"40 AGI, 20 Medium Mastery, Revolutionary Army Faction","category":"Revolutionary Army","effect":"+8% Movement Speed, -5% Skill Cooldown Reduction"},{"name":"Liberation Strike","req":"50 STR, 30 Light Mastery, Revolutionary Army Faction","category":"Revolutionary Army","effect":"+10% Physical Damage"},{"name":"Underground Resilience","req":"60 VIT, 20 Light Mastery, Revolutionary Army Faction","category":"Revolutionary Army","effect":"+15% Health Regen, +5% Max HP"},{"name":"Guerilla Ambush","req":"50 AGI, 30 Gun Mastery, Revolutionary Army Faction","category":"Revolutionary Army","effect":"+15% Total Damage from back attacks"},{"name":"Spark of Rebellion","req":"60 STR, 40 VIT, Revolutionary Army Faction","category":"Revolutionary Army","effect":"+10% Physical Damage, +8% Stun Resistance"},{"name":"Uncharted Horizon","req":"30 AGI, 20 Medium Mastery, Adventurer Faction","category":"Adventurer","effect":"+8% Movement Speed, +5% Stamina Regen"},{"name":"Wayfarer's Instinct","req":"50 AGI, 30 Light Mastery, Adventurer Faction","category":"Adventurer","effect":"+10% Evasion, +5% Movement Speed"},{"name":"Pioneer Endurance","req":"60 VIT, 20 Heavy Mastery, Adventurer Faction","category":"Adventurer","effect":"+10% Max HP, +10% Endurance"},{"name":"Survivalist Scavenger","req":"40 VIT, 20 Gun Mastery, Adventurer Faction","category":"Adventurer","effect":"+10% Health Regen, -5% Skill Cooldown Reduction"},{"name":"Master Explorer","req":"50 STR, 50 AGI, Adventurer Faction","category":"Adventurer","effect":"+8% Physical Damage, +8% Movement Speed"},{"name":"Zenkai Overdrive","req":"80 STR, 40 VIT, Saiyan Race","category":"Race Exclusive","effect":"+20% Total Damage when HP drops below 30%, +10% Max HP"},{"name":"Apex Conqueror","req":"80 STR, 50 VIT, Viltrumite Race","category":"Race Exclusive","effect":"+15% Physical Damage, +12% Endurance, +10% Max Stamina"},{"name":"Nocturnal Regeneration","req":"60 VIT, 40 STR, Demon Race","category":"Race Exclusive","effect":"+20% Health Regen, +8% Physical Damage"},{"name":"Predatory Vitality","req":"70 STR, 40 AGI, Ghoul Race","category":"Race Exclusive","effect":"+12% Physical Damage, +10% Movement Speed"},{"name":"Ten Shielding","req":"60 VIT, 60 AGI, Nen User Race","category":"Race Exclusive","effect":"+15% Defense, +10% Skill Damage"},{"name":"Hakai Essence","req":"80 STR, 60 VIT, God of Destruction Race","category":"Race Exclusive","effect":"+20% Total Damage, +15% Ultimate Skill Damage"},{"name":"Biological Peak","req":"60 STR, 60 VIT, Superhuman Race","category":"Race Exclusive","effect":"+10% Physical Damage, +10% Max HP, +5% Movement Speed"},{"name":"Elastic Recovery","req":"80 VIT, 40 AGI, Majin Race","category":"Race Exclusive","effect":"+25% Health Regen, +10% Stun Resistance"},{"name":"Insightful Weaving","req":"60 AGI, 40 STR, Uchiha Clan","category":"Clan Exclusive","effect":"-15% Skill Cooldown Reduction, +10% Skill Damage"},{"name":"Limitless Distortion","req":"70 AGI, 50 VIT, Gojo Clan","category":"Clan Exclusive","effect":"+15% Evasion, +12% Skill Damage"},{"name":"Demon Back Release","req":"80 STR, 40 VIT, Hanma Clan","category":"Clan Exclusive","effect":"+15% Physical Damage, +12% Stun Resistance"},{"name":"Sun Breath Resonance","req":"50 VIT, 50 AGI, Kamado Clan","category":"Clan Exclusive","effect":"+15% Health Regen, +10% Stamina Regen"},{"name":"Silent Execution","req":"70 AGI, 40 STR, Zoldyck Clan","category":"Clan Exclusive","effect":"+12% Total Damage, +12% Movement Speed, -10% Reduced Stamina Drain"},{"name":"Dimensional Rupture","req":"80 STR, 50 VIT, Core Area Warriors Clan","category":"Clan Exclusive","effect":"+20% Ultimate Skill Damage, +12% Max Posture"},{"name":"Shadow Sovereignty","req":"70 STR, 50 VIT, Dark Empire Clan","category":"Clan Exclusive","effect":"+15% Total Damage, -10% Skill Cooldown Reduction, +10% Debuff Duration"},{"name":"Super Warrior Awakening","req":"80 STR, 60 VIT, Saiyan Race, Dragon Team Clan","category":"Combo Exclusive","effect":"+18% Physical Damage, +15% Max Stamina, +10% Total Damage"},{"name":"Empire Monarch","req":"80 STR, 70 VIT, Viltrumite Race, Viltrum Empire Clan","category":"Combo Exclusive","effect":"+20% Physical Damage, +15% Endurance, +10% Max HP"},{"name":"Spiritual Foresight","req":"60 AGI, 60 STR, Shinigami Race, Uchiha Clan","category":"Combo Exclusive","effect":"+15% Weapon Damage, -12% Skill Cooldown Reduction, +10% Skill Damage"},{"name":"Sun Resistant Demon","req":"70 VIT, 50 STR, Demon Race, Kamado Clan","category":"Combo Exclusive","effect":"+25% Health Regen, +10% Max Stamina, +8% Physical Damage"},{"name":"Apex Biological Predator","req":"80 STR, 50 AGI, Ghoul Race, Hanma Clan","category":"Combo Exclusive","effect":"+20% Physical Damage, +10% Stun Resistance, +10% Movement Speed"},{"name":"Untouchable Transcendence","req":"80 AGI, 60 VIT, Angel Race, Gojo Clan","category":"Combo Exclusive","effect":"+20% Evasion, +15% Magical Damage, -10% Skill Cooldown Reduction"},{"name":"Abyssal Calamity","req":"70 VIT, 60 STR, Cursed Spirit Race, Dark Empire Clan","category":"Combo Exclusive","effect":"+15% Total Damage, +15% Magical Damage, +12% Debuff Duration"},{"name":"Celestial Aura Mastery","req":"70 AGI, 70 VIT, Nen User Race, Otsutsuki Clan","category":"Combo Exclusive","effect":"+18% Elemental Damage, +15% Defense, +10% Skill Damage"}];

  // Parse Requirement String
  function meetsRequirement(reqStr) {
    if (!reqStr || reqStr === '0') return true;

    const parts = reqStr.split(',');
    for (let part of parts) {
      part = part.trim();

      // Faction check
      if (part.includes('Marine Faction')) {
        if (currentFaction !== 'Marines') return false;
        continue;
      }
      if (part.includes('Pirate Faction')) {
        if (currentFaction !== 'Pirates') return false;
        continue;
      }
      if (part.includes('Revolutionary Army Faction')) {
        if (currentFaction !== 'Revolutionaries') return false;
        continue;
      }
      if (part.includes('Adventurer Faction')) {
        if (currentFaction !== 'Adventurers') return false;
        continue;
      }

      // Race & Clan requirements check
      if (part.includes('Race') || part.includes('Clan')) {
        continue;
      }

      // Stat requirement check
      const match = part.match(/^(\d+)\s+(.+)$/);
      if (!match) continue;

      const reqVal = parseInt(match[1], 10);
      const reqType = match[2].trim();

      let playerVal = 0;
      if (reqType === 'STR') playerVal = stats.str;
      else if (reqType === 'VIT') playerVal = stats.vit;
      else if (reqType === 'AGI') playerVal = stats.agi;
      else if (reqType === 'Light Mastery') playerVal = stats.light;
      else if (reqType === 'Medium Mastery') playerVal = stats.med;
      else if (reqType === 'Heavy Mastery') playerVal = stats.heavy;
      else if (reqType === 'Gun Mastery') playerVal = stats.gun;

      if (playerVal < reqVal) return false;
    }
    return true;
  }

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
    if (strValDisplay) strValDisplay.textContent = stats.str;
    if (vitValDisplay) vitValDisplay.textContent = stats.vit;
    if (agiValDisplay) agiValDisplay.textContent = stats.agi;

    if (lightValDisplay) lightValDisplay.textContent = stats.light;
    if (medValDisplay) medValDisplay.textContent = stats.med;
    if (heavyValDisplay) heavyValDisplay.textContent = stats.heavy;
    if (gunValDisplay) gunValDisplay.textContent = stats.gun;

    if (pointsRemaining) pointsRemaining.textContent = remStats;
    if (masteryRemaining) masteryRemaining.textContent = remMastery;
    if (totalAllocated) totalAllocated.textContent = total;

    const fillPercent = Math.min(100, (total / MAX_TOTAL_STATS) * 100);
    if (buildProgressFill) buildProgressFill.style.width = fillPercent + '%';

    // Level Calculation (1 level per 10 trainable stat points, max 25)
    const level = Math.min(25, Math.floor(total / 10));
    if (charLevel) charLevel.textContent = level;
    if (levelPackCount) levelPackCount.textContent = `Level ${level} (Max 25)`;

    // Derived Stats Calculation (+1% HP/HP Regen/Stamina/Stamina Regen, +2.5% Endurance per level)
    if (healthBonus) healthBonus.textContent = `+${level}%`;
    if (healthRegen) healthRegen.textContent = `+${level}%`;
    if (staminaBonus) staminaBonus.textContent = `+${level}%`;
    if (staminaRegen) staminaRegen.textContent = `+${level}%`;
    if (enduranceBonus) enduranceBonus.textContent = `+${(level * 2.5).toFixed(1)}%`;

    if (archetypeName) archetypeName.textContent = calculateBuildArchetype();

    // Render Cards Library & Active Buffs Box
    renderCardLibrary();
    renderActiveCardBuffs();
  }

  // Event Listeners for Sliders with 100 max per stat & 250 total cap enforcement
  function handleStatChange(slider, statKey) {
    let val = parseInt(slider.value, 10);
    if (val > MAX_SINGLE_STAT) {
      val = MAX_SINGLE_STAT;
      slider.value = val;
    }
    stats[statKey] = val;

    if (getTotalTrainableStats() > MAX_TOTAL_STATS) {
      const excess = getTotalTrainableStats() - MAX_TOTAL_STATS;
      stats[statKey] -= excess;
      slider.value = stats[statKey];
    }
    updateUI();
  }

  function handleMasteryChange(slider, masteryKey) {
    let val = parseInt(slider.value, 10);
    if (val > MAX_SINGLE_STAT) {
      val = MAX_SINGLE_STAT;
      slider.value = val;
    }
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

  // Reset Build Button
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
  // Category Filter Tabs
  // --------------------------------------------------------------------------
  const filterTabs = document.querySelectorAll('.filter-tab');
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      selectedCategory = tab.getAttribute('data-cat');
      renderCardLibrary();
    });
  });

  // --------------------------------------------------------------------------
  // Render Active Card Buffs List Under Top Derived Stats
  // --------------------------------------------------------------------------
  function renderActiveCardBuffs() {
    if (!activeCardBuffsList) return;

    if (buffsCountBadge) {
      buffsCountBadge.textContent = `${equippedCards.length} BUFFS ACTIVE`;
    }

    if (equippedCards.length === 0) {
      activeCardBuffsList.innerHTML = `<span style="color: var(--text-muted); font-size: 0.8rem;">No active card buffs. Add cards below to activate passive bonuses!</span>`;
      return;
    }

    activeCardBuffsList.innerHTML = '';
    equippedCards.forEach(c => {
      const item = document.createElement('div');
      item.style.fontSize = '0.78rem';
      item.style.lineHeight = '1.35';
      item.style.display = 'flex';
      item.style.justifyContent = 'space-between';
      item.style.alignItems = 'center';
      item.style.padding = '4px 8px';
      item.style.background = 'rgba(0, 242, 254, 0.06)';
      item.style.borderRadius = '4px';
      item.style.borderLeft = '2px solid var(--rs-cyan)';

      item.innerHTML = `
        <span><strong style="color: #fff;">${c.name}:</strong> <span style="color: var(--text-secondary);">${c.effect}</span></span>
        <span style="font-size: 0.65rem; color: var(--rs-gold); font-weight: 800; margin-left: 8px;">${c.category}</span>
      `;
      activeCardBuffsList.appendChild(item);
    });
  }

  // --------------------------------------------------------------------------
  // Card Library Renderer (Enforcing Max 30 Pick Limit)
  // --------------------------------------------------------------------------
  const cardLibraryGrid = document.getElementById('cardLibraryGrid');
  const equippedCardsList = document.getElementById('equippedCardsList');
  const equippedCount = document.getElementById('equippedCount');

  function renderCardLibrary() {
    if (!cardLibraryGrid) return;
    cardLibraryGrid.innerHTML = '';

    const filtered = cardPool.filter(c => {
      if (selectedCategory === 'ALL') return true;
      if (selectedCategory === 'FACTION_EXCLUSIVES') {
        return ['Marine', 'Pirate', 'Revolutionary Army', 'Adventurer'].includes(c.category);
      }
      return c.category === selectedCategory;
    });

    const isMaxReached = equippedCards.length >= MAX_EQUIPPED_CARDS;

    filtered.forEach(card => {
      const isEquipped = equippedCards.some(c => c.name === card.name);
      const reqMet = meetsRequirement(card.req);

      const cardEl = document.createElement('div');
      cardEl.className = `drawn-card-item ${reqMet ? '' : 'locked-card'}`;
      if (!reqMet || (isMaxReached && !isEquipped)) {
        cardEl.style.opacity = '0.5';
      }

      cardEl.innerHTML = `
        <div class="card-category-badge">${card.category} | Req: ${card.req}</div>
        <h4 class="card-item-title">${card.name}</h4>
        <p class="card-item-desc">${card.effect}</p>
        <button class="rs-btn-primary btn-shimmer add-card-btn" ${!reqMet || isEquipped || isMaxReached ? 'disabled' : ''} style="padding: 8px 14px; font-size: 0.75rem; width: 100%; margin-top: 12px; ${isEquipped ? 'background: #2ed573; color: #fff;' : ''}">
          ${isEquipped ? 'EQUIPPED ✓' : isMaxReached ? 'MAX 30 CARDS' : reqMet ? '+ ADD TO BUILD' : 'REQ NOT MET'}
        </button>
      `;

      if (reqMet && !isEquipped && !isMaxReached) {
        cardEl.querySelector('.add-card-btn').addEventListener('click', () => {
          if (equippedCards.length < MAX_EQUIPPED_CARDS) {
            equippedCards.push(card);
            renderEquippedCards();
            renderCardLibrary();
            renderActiveCardBuffs();
          }
        });
      }

      cardLibraryGrid.appendChild(cardEl);
    });
  }

  function renderEquippedCards() {
    if (equippedCount) equippedCount.textContent = equippedCards.length;

    if (equippedCards.length === 0) {
      equippedCardsList.innerHTML = `<span style="color: var(--text-muted); font-size: 0.85rem;">No talent cards added yet (max 30 cards pick). Click "+ Add to Build" below to select cards!</span>`;
      return;
    }

    equippedCardsList.innerHTML = '';
    equippedCards.forEach((c, idx) => {
      const tag = document.createElement('div');
      tag.className = 'equipped-card-tag';
      tag.innerHTML = `
        <span><strong>${c.name}</strong> (${c.category})</span>
        <button class="remove-card-btn" data-index="${idx}" title="Remove Card"><i class="fa-solid fa-xmark"></i></button>
      `;
      tag.querySelector('.remove-card-btn').addEventListener('click', () => {
        equippedCards.splice(idx, 1);
        renderEquippedCards();
        renderCardLibrary();
        renderActiveCardBuffs();
      });
      equippedCardsList.appendChild(tag);
    });
  }

  // Initial Sync
  syncSliders();

});
