/* ==========================================================================
   OMNI SEAS CHARACTER BUILDER & BUILD CALCULATOR ENGINE
   Official 150 Cards from Cards.txt
   Max 100 per stat, 250 Total Build Point Cap, 100 Weapon Mastery Cap
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // Maximum Build Constraints
  const MAX_SINGLE_STAT = 100;
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
  let selectedCategory = 'ALL';

  // 150 Official Cards from Cards.txt
  const cardPool = [
    // Strength
    {name:"Heavy Hauler",req:"0 STR",category:"Strength",effect:"+3% Carrying Capacity, +2% Grip Damage"},
    {name:"Crushing Palm",req:"0 STR",category:"Strength",effect:"+3% Heavy Melee Damage"},
    {name:"Iron Grip",req:"0 STR",category:"Strength",effect:"+5% Disarm Resistance"},
    {name:"Tremor Stride",req:"0 STR",category:"Strength",effect:"+3% Guard Break Damage"},
    {name:"Anchor Stance",req:"0 STR",category:"Strength",effect:"+3% Knockback Resistance"},
    {name:"Raw Might",req:"20 STR",category:"Strength",effect:"+5% Physical Damage"},
    {name:"Bone Breaker",req:"20 STR",category:"Strength",effect:"+6% Posture Damage"},
    {name:"Overbearing Swing",req:"20 STR",category:"Strength",effect:"+8% Heavy Attack Damage"},
    {name:"Sledge Impact",req:"20 STR",category:"Strength",effect:"+6% Guard Break Power"},
    {name:"Brawny Guard",req:"20 STR",category:"Strength",effect:"+5% Block Posture Efficiency"},
    {name:"Impact Driver",req:"40 STR",category:"Strength",effect:"+10% Posture Damage"},
    {name:"Ground Pounder",req:"40 STR",category:"Strength",effect:"Heavy attacks deal +10% AOE Shockwave Posture Damage"},
    {name:"Shatter Pulse",req:"40 STR",category:"Strength",effect:"+12% Guard Break Damage"},
    {name:"Titan Reach",req:"40 STR",category:"Strength",effect:"+8% Melee Attack Range"},
    {name:"Forceful Thrust",req:"40 STR",category:"Strength",effect:"+10% Knockback Power"},
    {name:"Unyielding Force",req:"60 STR",category:"Strength",effect:"+12% Physical Attack Power"},
    {name:"Colossal Weight",req:"60 STR",category:"Strength",effect:"+15% Posture Break on Guarding Targets"},
    {name:"Seismic Strike",req:"60 STR",category:"Strength",effect:"Heavy attacks inflict 5% Movement Slow for 2s"},
    {name:"Wrecking Blow",req:"60 STR",category:"Strength",effect:"+14% Heavy Attack Damage"},
    {name:"Ironclad Fist",req:"60 STR",category:"Strength",effect:"Guarding reduces incoming posture damage by +10%"},
    {name:"Apex Might",req:"80 STR",category:"Strength",effect:"+18% Physical Damage"},
    {name:"Mountain Splitting Strike",req:"80 STR",category:"Strength",effect:"Charged heavy attacks deal +25% Guard Break"},
    {name:"Absolute Impact",req:"80 STR",category:"Strength",effect:"+20% Knockback Distance and +15% Posture Damage"},
    {name:"Giant's Pressure",req:"80 STR",category:"Strength",effect:"Parrying enemies reduces their defense by 10% for 4s"},
    {name:"Cataclysmic Swing",req:"80 STR",category:"Strength",effect:"+20% Heavy Attack Power"},

    // Vitality
    {name:"Thick Skin",req:"0 VIT",category:"Vitality",effect:"+3% Max Health"},
    {name:"Tough Fiber",req:"0 VIT",category:"Vitality",effect:"+3% Health Regeneration Rate"},
    {name:"Steady Heart",req:"0 VIT",category:"Vitality",effect:"+3% Status Effect Duration Reduction"},
    {name:"Sturdy Frame",req:"0 VIT",category:"Vitality",effect:"+2% Damage Reduction"},
    {name:"Hardened Core",req:"0 VIT",category:"Vitality",effect:"+4% Posture Recovery Speed"},
    {name:"Vital Surge",req:"20 VIT",category:"Vitality",effect:"+5% Max Health"},
    {name:"Rapid Clotting",req:"20 VIT",category:"Vitality",effect:"+8% Health Regeneration Rate"},
    {name:"Iron Will",req:"20 VIT",category:"Vitality",effect:"+6% Damage Reduction while below 50% HP"},
    {name:"Tenacious Body",req:"20 VIT",category:"Vitality",effect:"+8% Stun Duration Reduction"},
    {name:"Restorative Breath",req:"20 VIT",category:"Vitality",effect:"Regain +3% HP after successfully blocking 3 hits"},
    {name:"Dense Musculature",req:"40 VIT",category:"Vitality",effect:"+8% Max Health, +5% Stun Resistance"},
    {name:"Second Wind",req:"40 VIT",category:"Vitality",effect:"+12% Health Regeneration when below 35% HP"},
    {name:"Pain Tolerance",req:"40 VIT",category:"Vitality",effect:"+6% Overall Damage Reduction"},
    {name:"Bastion Vitality",req:"40 VIT",category:"Vitality",effect:"+10% Posture Cap"},
    {name:"Unshakable Blood",req:"40 VIT",category:"Vitality",effect:"+10% Debuff Resistance"},
    {name:"Fortress Flesh",req:"60 VIT",category:"Vitality",effect:"+12% Max Health"},
    {name:"Enduring Vessel",req:"60 VIT",category:"Vitality",effect:"+15% Health Regeneration Rate"},
    {name:"Unyielding Bone",req:"60 VIT",category:"Vitality",effect:"+10% Damage Reduction when Posture is above 50%"},
    {name:"Vital Overdrive",req:"60 VIT",category:"Vitality",effect:"+15% HP Recovery from all items and skills"},
    {name:"Resilient Pulse",req:"60 VIT",category:"Vitality",effect:"Surviving a lethal hit leaves you at 1 HP once per combat (60s CD)"},
    {name:"Immortal Foundation",req:"80 VIT",category:"Vitality",effect:"+18% Max Health"},
    {name:"Regeneration Surge",req:"80 VIT",category:"Vitality",effect:"+25% Health Regeneration Rate"},
    {name:"Granite Core",req:"80 VIT",category:"Vitality",effect:"+12% Flat Damage Reduction"},
    {name:"Invulnerable Frame",req:"80 VIT",category:"Vitality",effect:"+15% Stun Resistance, +15% Posture Cap"},
    {name:"Aegis Bloodline",req:"80 VIT",category:"Vitality",effect:"Reaching 20% HP grants a temporary damage reduction shield (+25%) for 5s"},

    // Agility
    {name:"Fleet Footed",req:"0 AGI",category:"Agility",effect:"+3% Movement Speed"},
    {name:"Light Step",req:"0 AGI",category:"Agility",effect:"-3% Sprint Stamina Cost"},
    {name:"Nimble Dodge",req:"0 AGI",category:"Agility",effect:"+3% Dodge Distance"},
    {name:"Quick Recovery",req:"0 AGI",category:"Agility",effect:"+3% Stamina Regeneration"},
    {name:"Swift Pivot",req:"0 AGI",category:"Agility",effect:"+4% Rotation and Turn Speed"},
    {name:"Gust Dash",req:"20 AGI",category:"Agility",effect:"+5% Dodge Distance, -5% Dodge Stamina Cost"},
    {name:"Wind Sprint",req:"20 AGI",category:"Agility",effect:"+6% Sprint Speed"},
    {name:"Flowing Stamina",req:"20 AGI",category:"Agility",effect:"+8% Stamina Regeneration"},
    {name:"Evader's Instinct",req:"20 AGI",category:"Agility",effect:"+5% Invulnerability Window on Roll"},
    {name:"Rapid Step",req:"20 AGI",category:"Agility",effect:"+5% Dash Speed"},
    {name:"Gale Footwork",req:"40 AGI",category:"Agility",effect:"+8% Sprint Speed, +5% Dodge Distance"},
    {name:"Slippery Target",req:"40 AGI",category:"Agility",effect:"-10% Dodge Stamina Cost"},
    {name:"Adrenaline Surge",req:"40 AGI",category:"Agility",effect:"Perfect Dodges restore 10% Stamina"},
    {name:"Feathered Body",req:"40 AGI",category:"Agility",effect:"Fall damage reduced by 50%, movement speed +5%"},
    {name:"Kinetic Flow",req:"40 AGI",category:"Agility",effect:"Moving continuously builds up to +8% Move Speed"},
    {name:"Phantom Stride",req:"60 AGI",category:"Agility",effect:"+12% Dodge Distance, +8% Movement Speed"},
    {name:"Lightning Reflex",req:"60 AGI",category:"Agility",effect:"+12% Perfect Dodge Invulnerability Window"},
    {name:"Wind Dancer",req:"60 AGI",category:"Agility",effect:"+12% Stamina Regeneration Rate"},
    {name:"Swift Evasion",req:"60 AGI",category:"Agility",effect:"Dodging creates a brief movement speed burst (+15% for 1.5s)"},
    {name:"Acrobatic Recovery",req:"60 AGI",category:"Agility",effect:"Recover from knockdown 25% faster"},
    {name:"Velocity Mastery",req:"80 AGI",category:"Agility",effect:"+15% Movement Speed"},
    {name:"Mirage Motion",req:"80 AGI",category:"Agility",effect:"Dashes bypass player collision models"},
    {name:"Endless Wind",req:"80 AGI",category:"Agility",effect:"-20% Sprint Stamina Drain, +15% Dodge Distance"},
    {name:"Blur Shift",req:"80 AGI",category:"Agility",effect:"Perfect Dodges grant +10% Movement Speed for 4s"},
    {name:"Apex Agility",req:"80 AGI",category:"Agility",effect:"+15% Stamina Regeneration, +10% Attack Velocity"},

    // Light Mastery
    {name:"Needle Point",req:"0 Light Mastery",category:"Light Mastery",effect:"+3% Light Weapon Attack Speed"},
    {name:"Swift Flourish",req:"0 Light Mastery",category:"Light Mastery",effect:"+3% Light Weapon Damage"},
    {name:"Quick Stun",req:"0 Light Mastery",category:"Light Mastery",effect:"+3% Stun Duration on Light Attacks"},
    {name:"Rapid Thrust",req:"0 Light Mastery",category:"Light Mastery",effect:"-3% Light Attack Stamina Drain"},
    {name:"Flick Wrist",req:"0 Light Mastery",category:"Light Mastery",effect:"+4% Feint Recovery Speed"},
    {name:"Viper Slash",req:"20 Light Mastery",category:"Light Mastery",effect:"+5% Light Weapon Attack Speed"},
    {name:"Razor Edge",req:"20 Light Mastery",category:"Light Mastery",effect:"+6% Light Weapon Damage"},
    {name:"Stabbing Momentum",req:"20 Light Mastery",category:"Light Mastery",effect:"Landing 3 consecutive light hits grants +5% Attack Speed for 3s"},
    {name:"Nimble Guard",req:"20 Light Mastery",category:"Light Mastery",effect:"+5% Parrying Speed with Light Weapons"},
    {name:"Precise Cutter",req:"20 Light Mastery",category:"Light Mastery",effect:"+5% Armor Penetration on Light Attacks"},
    {name:"Cobra Strike",req:"40 Light Mastery",category:"Light Mastery",effect:"+8% Light Weapon Attack Speed"},
    {name:"Flurry Stance",req:"40 Light Mastery",category:"Light Mastery",effect:"+10% Light Attack Combo Speed"},
    {name:"Puncturing Edge",req:"40 Light Mastery",category:"Light Mastery",effect:"Light Attacks deal +8% Shield/Guard Damage"},
    {name:"Agile Feint",req:"40 Light Mastery",category:"Light Mastery",effect:"Feinting with Light Weapons restores 5% Stamina"},
    {name:"Swift Retaliation",req:"40 Light Mastery",category:"Light Mastery",effect:"Counter-attacks after parrying deal +10% damage"},
    {name:"Tempest Blade",req:"60 Light Mastery",category:"Light Mastery",effect:"+12% Light Weapon Damage"},
    {name:"Blitz Cadence",req:"60 Light Mastery",category:"Light Mastery",effect:"+12% Light Weapon Attack Speed"},
    {name:"Needle Precision",req:"60 Light Mastery",category:"Light Mastery",effect:"+12% Armor Penetration"},
    {name:"Dancing Edge",req:"60 Light Mastery",category:"Light Mastery",effect:"Light attacks consume -12% Stamina"},
    {name:"Critical Piercer",req:"60 Light Mastery",category:"Light Mastery",effect:"Hits to target's back deal +15% Damage"},
    {name:"Apex Light Master",req:"80 Light Mastery",category:"Light Mastery",effect:"+15% Light Weapon Attack Speed, +10% Damage"},
    {name:"Hurricane Swarm",req:"80 Light Mastery",category:"Light Mastery",effect:"5-hit light combos release a small forward air shockwave"},
    {name:"Phantom Strike",req:"80 Light Mastery",category:"Light Mastery",effect:"Light attack range increased by 15%"},
    {name:"Lethal Precision",req:"80 Light Mastery",category:"Light Mastery",effect:"Light attack critical hit chance increased"},
    {name:"Unmatched Speed",req:"80 Light Mastery",category:"Light Mastery",effect:"+18% Light Attack Speed"},

    // Medium Mastery
    {name:"Balanced Grip",req:"0 Medium Mastery",category:"Medium Mastery",effect:"+3% Medium Weapon Damage"},
    {name:"Steady Blade",req:"0 Medium Mastery",category:"Medium Mastery",effect:"+3% Block Stability with Medium Weapons"},
    {name:"Center Guard",req:"0 Medium Mastery",category:"Medium Mastery",effect:"+3% Parry Window with Medium Weapons"},
    {name:"Versatile Stance",req:"0 Medium Mastery",category:"Medium Mastery",effect:"-3% Medium Attack Stamina Drain"},
    {name:"Clean Sweep",req:"0 Medium Mastery",category:"Medium Mastery",effect:"+3% Medium Weapon Cleave Area"},
    {name:"Duelist Posture",req:"20 Medium Mastery",category:"Medium Mastery",effect:"+5% Medium Weapon Damage"},
    {name:"Parry Rhythm",req:"20 Medium Mastery",category:"Medium Mastery",effect:"+5% Parry Timing Window"},
    {name:"Guarding Edge",req:"20 Medium Mastery",category:"Medium Mastery",effect:"+6% Block Posture Efficiency"},
    {name:"Swift Slash",req:"20 Medium Mastery",category:"Medium Mastery",effect:"+5% Medium Attack Speed"},
    {name:"Iron Counter",req:"20 Medium Mastery",category:"Medium Mastery",effect:"Successful parries deal +6% Posture damage to opponent"},
    {name:"Precision Saber",req:"40 Medium Mastery",category:"Medium Mastery",effect:"+8% Medium Weapon Damage"},
    {name:"Master Parry",req:"40 Medium Mastery",category:"Medium Mastery",effect:"+8% Parry Timing Window"},
    {name:"Flawless Balance",req:"40 Medium Mastery",category:"Medium Mastery",effect:"-8% Medium Attack Stamina Drain"},
    {name:"Ripple Guard",req:"40 Medium Mastery",category:"Medium Mastery",effect:"Blocking reduces posture damage received by 10%"},
    {name:"Striking Edge",req:"40 Medium Mastery",category:"Medium Mastery",effect:"+8% Guard Break Power with Medium Weapons"},
    {name:"Sentinel Stance",req:"60 Medium Mastery",category:"Medium Mastery",effect:"+12% Medium Weapon Damage"},
    {name:"Perfect Deflection",req:"60 Medium Mastery",category:"Medium Mastery",effect:"Perfect parries inflict a brief 0.3s Stun"},
    {name:"Tactical Mastery",req:"60 Medium Mastery",category:"Medium Mastery",effect:"Swapping stances or feinting boosts next attack by +10%"},
    {name:"Unyielding Sword",req:"60 Medium Mastery",category:"Medium Mastery",effect:"+10% Block Efficiency and +8% Damage"},
    {name:"Swift Deflect",req:"60 Medium Mastery",category:"Medium Mastery",effect:"+10% Parry Timing Window"},
    {name:"Grandmaster Duelist",req:"80 Medium Mastery",category:"Medium Mastery",effect:"+15% Medium Weapon Damage, +10% Parry Window"},
    {name:"Spatial Edge",req:"80 Medium Mastery",category:"Medium Mastery",effect:"Medium attacks deal +15% Posture damage when parried"},
    {name:"Supreme Guard",req:"80 Medium Mastery",category:"Medium Mastery",effect:"Block stamina cost reduced by 20%"},
    {name:"Countering Cleave",req:"80 Medium Mastery",category:"Medium Mastery",effect:"Attacks following a successful parry deal +20% damage"},
    {name:"Apex Medium Master",req:"80 Medium Mastery",category:"Medium Mastery",effect:"+18% Overall Medium Weapon Performance"},

    // Heavy Mastery
    {name:"Crushing Weight",req:"0 Heavy Mastery",category:"Heavy Mastery",effect:"+3% Heavy Weapon Posture Damage"},
    {name:"Heavy Swing",req:"0 Heavy Mastery",category:"Heavy Mastery",effect:"+3% Heavy Weapon Damage"},
    {name:"Anchor Weight",req:"0 Heavy Mastery",category:"Heavy Mastery",effect:"+3% Hyper Armor Duration during windups"},
    {name:"Wide Arc",req:"0 Heavy Mastery",category:"Heavy Mastery",effect:"+3% Attack Cleave Radius"},
    {name:"Brute Slam",req:"0 Heavy Mastery",category:"Heavy Mastery",effect:"+3% Guard Break Power"},
    {name:"Mighty Cleave",req:"20 Heavy Mastery",category:"Heavy Mastery",effect:"+6% Heavy Weapon Damage"},
    {name:"Shield Crusher",req:"20 Heavy Mastery",category:"Heavy Mastery",effect:"+6% Guard Break Power"},
    {name:"Impact Frame",req:"20 Heavy Mastery",category:"Heavy Mastery",effect:"+5% Posture Damage"},
    {name:"Unstoppable Windup",req:"20 Heavy Mastery",category:"Heavy Mastery",effect:"Taking damage during heavy attack windup reduces damage taken by 5%"},
    {name:"Heavy Momentum",req:"20 Heavy Mastery",category:"Heavy Mastery",effect:"-5% Heavy Attack Stamina Cost"},
    {name:"Shatter Blade",req:"40 Heavy Mastery",category:"Heavy Mastery",effect:"+10% Guard Break Power"},
    {name:"Iron Cleaver",req:"40 Heavy Mastery",category:"Heavy Mastery",effect:"+8% Heavy Weapon Damage"},
    {name:"Colossal Impact",req:"40 Heavy Mastery",category:"Heavy Mastery",effect:"Heavy attacks deal +10% Posture Damage"},
    {name:"Staggering Slam",req:"40 Heavy Mastery",category:"Heavy Mastery",effect:"Heavy attack hits extend opponent hit-stun by 10%"},
    {name:"Enduring Swing",req:"40 Heavy Mastery",category:"Heavy Mastery",effect:"+8% Damage Reduction during attack windups"},
    {name:"Titan Cleave",req:"60 Heavy Mastery",category:"Heavy Mastery",effect:"+12% Heavy Weapon Damage"},
    {name:"Demolition Force",req:"60 Heavy Mastery",category:"Heavy Mastery",effect:"Heavy attacks deal +15% Posture Damage"},
    {name:"Earth Shatter",req:"60 Heavy Mastery",category:"Heavy Mastery",effect:"Fully charged heavy attacks create a ground shockwave"},
    {name:"Unbending Titan",req:"60 Heavy Mastery",category:"Heavy Mastery",effect:"Gain poise armor during heavy charged swings"},
    {name:"Devastating Impact",req:"60 Heavy Mastery",category:"Heavy Mastery",effect:"Guard breaking an enemy reduces their defense by 12% for 3s"},
    {name:"World Breaker",req:"80 Heavy Mastery",category:"Heavy Mastery",effect:"+18% Heavy Weapon Damage"},
    {name:"Cataclysm Slam",req:"80 Heavy Mastery",category:"Heavy Mastery",effect:"Heavy attacks deal +25% Guard Break Power"},
    {name:"Immovable Force",req:"80 Heavy Mastery",category:"Heavy Mastery",effect:"Heavy attack windups gain hyper armor (uninterruptible)"},
    {name:"Dreadful Sweep",req:"80 Heavy Mastery",category:"Heavy Mastery",effect:"Heavy attack hits break weak blocks instantly"},
    {name:"Apex Heavy Master",req:"80 Heavy Mastery",category:"Heavy Mastery",effect:"+20% Heavy Weapon Posture Damage"},

    // Gun Mastery
    {name:"Quick Aim",req:"0 Gun Mastery",category:"Gun Mastery",effect:"+3% Gun Swap and Draw Speed"},
    {name:"Lead Shot",req:"0 Gun Mastery",category:"Gun Mastery",effect:"+3% Gun Damage"},
    {name:"Powder Charge",req:"0 Gun Mastery",category:"Gun Mastery",effect:"+3% Bullet Velocity"},
    {name:"Swift Chamber",req:"0 Gun Mastery",category:"Gun Mastery",effect:"+3% Reload Speed"},
    {name:"Piercing Round",req:"0 Gun Mastery",category:"Gun Mastery",effect:"+2% Armor Penetration on Shots"},
    {name:"Gunslinger Step",req:"20 Gun Mastery",category:"Gun Mastery",effect:"+5% Movement Speed while aiming"},
    {name:"Heavy Caliber",req:"20 Gun Mastery",category:"Gun Mastery",effect:"+6% Gun Damage"},
    {name:"Rapid Reload",req:"20 Gun Mastery",category:"Gun Mastery",effect:"+6% Reload Speed"},
    {name:"Precise Trigger",req:"20 Gun Mastery",category:"Gun Mastery",effect:"+5% Bullet Velocity and Range"},
    {name:"Ricochet Focus",req:"20 Gun Mastery",category:"Gun Mastery",effect:"Shots dealing partial guard damage deal +5% Posture damage"},
    {name:"Marksman Eye",req:"40 Gun Mastery",category:"Gun Mastery",effect:"+8% Gun Damage, +5% Range"},
    {name:"Point Blank",req:"40 Gun Mastery",category:"Gun Mastery",effect:"Gun shots within close range deal +10% damage"},
    {name:"Quick Reloading",req:"40 Gun Mastery",category:"Gun Mastery",effect:"+10% Reload Speed"},
    {name:"Staggering Bullet",req:"40 Gun Mastery",category:"Gun Mastery",effect:"Shots inflict +8% Posture Damage on blocking targets"},
    {name:"Mobile Shot",req:"40 Gun Mastery",category:"Gun Mastery",effect:"Aiming no longer reduces movement speed"},
    {name:"Sniper Focus",req:"60 Gun Mastery",category:"Gun Mastery",effect:"+12% Gun Damage at long range"},
    {name:"Blast Powder",req:"60 Gun Mastery",category:"Gun Mastery",effect:"+12% Gun Damage"},
    {name:"Rapid Fire Stance",req:"60 Gun Mastery",category:"Gun Mastery",effect:"+15% Reload Speed"},
    {name:"Penetrating Lead",req:"60 Gun Mastery",category:"Gun Mastery",effect:"Shots bypass 12% of enemy defense"},
    {name:"Executioner Round",req:"60 Gun Mastery",category:"Gun Mastery",effect:"Shots deal +15% damage to targets below 30% HP"},
    {name:"Apex Gunner",req:"80 Gun Mastery",category:"Gun Mastery",effect:"+18% Gun Damage"},
    {name:"Deadeye Shot",req:"80 Gun Mastery",category:"Gun Mastery",effect:"Headshots/Criticals deal +25% bonus damage"},
    {name:"Quickdraw Sentinel",req:"80 Gun Mastery",category:"Gun Mastery",effect:"Swapping to a gun instantly fires a free quick shot (10s CD)"},
    {name:"Ballistic Barrage",req:"80 Gun Mastery",category:"Gun Mastery",effect:"+20% Reload Speed and +10% Bullet Velocity"},
    {name:"Caliber Mastery",req:"80 Gun Mastery",category:"Gun Mastery",effect:"Gun shots inflict +20% Posture Damage"},

    // Mixed Category
    {name:"Iron Brawler",req:"10 STR, 10 Heavy Mastery",category:"Mixed",effect:"+5% Heavy Weapon Damage, +5% Posture Damage"},
    {name:"Swift Shooter",req:"10 AGI, 10 Gun Mastery",category:"Mixed",effect:"+5% Reload Speed, +3% Sprint Speed"},
    {name:"Vanguard Frame",req:"10 STR, 10 VIT",category:"Mixed",effect:"+4% Max Health, +4% Physical Damage"},
    {name:"Needle Dancer",req:"10 AGI, 10 Light Mastery",category:"Mixed",effect:"+4% Light Attack Speed, +4% Movement Speed"},
    {name:"Balanced Sentinel",req:"10 VIT, 10 Medium Mastery",category:"Mixed",effect:"+4% Max HP, +5% Block Efficiency"},
    {name:"Juggernaut Breaker",req:"20 STR, 20 Heavy Mastery",category:"Mixed",effect:"+8% Heavy Damage, +8% Guard Break"},
    {name:"Phantom Gunner",req:"20 AGI, 20 Gun Mastery",category:"Mixed",effect:"+6% Move Speed while aiming, +6% Reload Speed"},
    {name:"Titan Bastion",req:"40 STR, 40 VIT",category:"Mixed",effect:"+8% Max HP, +8% Physical Damage, +5% Stun Reduction"},
    {name:"Tempest Blade Master",req:"40 AGI, 40 Light Mastery",category:"Mixed",effect:"+8% Light Attack Speed, -10% Dodge Stamina Drain"},
    {name:"War Lord Matrix",req:"60 STR, 60 VIT, 60 AGI",category:"Mixed",effect:"+10% Max HP, +10% Physical Damage, +10% Move Speed"}
  ];

  // Parse Requirement String (e.g. "10 STR, 10 Heavy Mastery")
  function meetsRequirement(reqStr) {
    if (!reqStr || reqStr === '0') return true;

    const parts = reqStr.split(',');
    for (let part of parts) {
      part = part.trim();
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

    // Level Calculation (1 level per 10 trainable stat points, max 25)
    const level = Math.min(25, Math.floor(total / 10));
    charLevel.textContent = level;
    levelPackCount.textContent = `Level ${level} (Max 25)`;

    // Derived Stats Calculation (+1% HP/HP Regen/Stamina/Stamina Regen, +2.5% Endurance per level)
    healthBonus.textContent = `+${level}%`;
    healthRegen.textContent = `+${level}%`;
    staminaBonus.textContent = `+${level}%`;
    staminaRegen.textContent = `+${level}%`;
    enduranceBonus.textContent = `+${(level * 2.5).toFixed(1)}%`;

    archetypeName.textContent = calculateBuildArchetype();

    // Render Cards Library
    renderCardLibrary();
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
  // Official Card Library Renderer
  // --------------------------------------------------------------------------
  const cardLibraryGrid = document.getElementById('cardLibraryGrid');
  const equippedCardsList = document.getElementById('equippedCardsList');
  const equippedCount = document.getElementById('equippedCount');

  function renderCardLibrary() {
    if (!cardLibraryGrid) return;
    cardLibraryGrid.innerHTML = '';

    const filtered = cardPool.filter(c => selectedCategory === 'ALL' || c.category === selectedCategory);

    filtered.forEach(card => {
      const isEquipped = equippedCards.some(c => c.name === card.name);
      const reqMet = meetsRequirement(card.req);

      const cardEl = document.createElement('div');
      cardEl.className = `drawn-card-item ${reqMet ? '' : 'locked-card'}`;
      if (!reqMet) {
        cardEl.style.opacity = '0.5';
      }

      cardEl.innerHTML = `
        <div class="card-category-badge">${card.category} | Req: ${card.req}</div>
        <h4 class="card-item-title">${card.name}</h4>
        <p class="card-item-desc">${card.effect}</p>
        <button class="rs-btn-primary btn-shimmer add-card-btn" ${!reqMet || isEquipped ? 'disabled' : ''} style="padding: 8px 14px; font-size: 0.75rem; width: 100%; margin-top: 12px; ${isEquipped ? 'background: #2ed573; color: #fff;' : ''}">
          ${isEquipped ? 'EQUIPPED ✓' : reqMet ? '+ ADD TO BUILD' : 'REQ NOT MET'}
        </button>
      `;

      if (reqMet && !isEquipped) {
        cardEl.querySelector('.add-card-btn').addEventListener('click', () => {
          equippedCards.push(card);
          renderEquippedCards();
          renderCardLibrary();
        });
      }

      cardLibraryGrid.appendChild(cardEl);
    });
  }

  function renderEquippedCards() {
    equippedCount.textContent = equippedCards.length;

    if (equippedCards.length === 0) {
      equippedCardsList.innerHTML = `<span style="color: var(--text-muted); font-size: 0.85rem;">No talent cards added yet. Click "+ Add to Build" below to select cards!</span>`;
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
      });
      equippedCardsList.appendChild(tag);
    });
  }

  // Initial Sync
  syncSliders();

});
