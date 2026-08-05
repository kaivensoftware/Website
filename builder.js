/* ==========================================================================
   OMNI SEAS CHARACTER BUILDER ENGINE
   263 Talent Cards, 29 Races, 21 Clans, & 26 Game Stats Calculation
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // Maximum Build Constraints & Stat Caps (from Stats.json)
  const MAX_SINGLE_STAT = 100;
  const MAX_TOTAL_STATS = 250;
  const MAX_MASTERY_TOTAL = 100;
  const MAX_EQUIPPED_CARDS = 30;

  const STAT_CAPS = {
  "STR": "0-100",
  "AGI": "0-100",
  "VIT": "0-100",
  "LHT": "0-100",
  "MED": "0-100",
  "HVY": "0-100",
  "GUN": "0-100",
  "Max HP": "0 to 50%",
  "Max Stamina": "0 to 50%",
  "Max Posture": "0 to 50%",
  "Health Regen": "0 to 50%",
  "Stamina Regen": "0 to 50%",
  "Endurance": "0 to 50%",
  "Physical Damage": "0 to 300%",
  "Weapon Damage": "0 to 300%",
  "Total Damage": "0 to 100%",
  "Skill Damage": "0 to 300%",
  "Magical Damage": "0 to 300%",
  "Fighting Style Dmg": "0 to 100%",
  "Ultimate Skill Dmg": "0 to 100%",
  "Elemental Damage": "0 to 300%",
  "Defense": "0 to 100%",
  "Movement Speed": "0 to 300%",
  "Evasion": "0 to 10%",
  "Cooldown Reduction": "0 to 50%",
  "Stun Resistance": "0 to 50%",
  "Reduced Stamina Drain": "0 to 50%",
  "Debuff Duration": "0 to 50%"
};
  const RACES_AND_CLANS_DATA = [
  {"type": "Race", "name": "Human", "stat_bonus": "+5% Training EXP"},
  {"type": "Race", "name": "Skilled Human", "stat_bonus": "+10% Training EXP, +5% Stamina Regen"},
  {"type": "Race", "name": "Peak Human", "stat_bonus": "+10% Movement Speed, +10% Training EXP, +5% Stamina Regen"},
  {"type": "Race", "name": "Superhuman", "stat_bonus": "+20% Physical Damage, +15% Max HP, +10% Movement Speed, +10% Training EXP, +5% Stamina Regen"},
  {"type": "Race", "name": "Viltrumite", "stat_bonus": "+20% Physical Damage, +25% Max HP, +10% Movement Speed, +15% Stamina Regen, +10% Endurance, +10% Max Stamina, +10% Fighting Style Dmg"},
  {"type": "Race", "name": "Hollow", "stat_bonus": "+15% Physical Damage"},
  {"type": "Race", "name": "Fullbringer", "stat_bonus": "+10% Movement Speed, +10% Weapon Damage"},
  {"type": "Race", "name": "Demon", "stat_bonus": "+25% Health Regen, -15% Defense"},
  {"type": "Race", "name": "Ghoul", "stat_bonus": "+15% Physical Damage"},
  {"type": "Race", "name": "Cursed Spirit", "stat_bonus": "+15% Defense, +20% Magical Damage"},
  {"type": "Race", "name": "Shinigami", "stat_bonus": "+15% Weapon Damage, +10% Max Posture"},
  {"type": "Race", "name": "Arrancar", "stat_bonus": "+20% Defense, +15% Magical Damage"},
  {"type": "Race", "name": "Quincy", "stat_bonus": "+15% Weapon Damage"},
  {"type": "Race", "name": "Death Painting Womb", "stat_bonus": "+20% Health Regen, +12% Debuff Duration"},
  {"type": "Race", "name": "Half-Ghoul", "stat_bonus": "-20% Reduced Stamina Drain, +15% Physical Damage"},
  {"type": "Race", "name": "Devil", "stat_bonus": "+15% Total Damage"},
  {"type": "Race", "name": "Fiend", "stat_bonus": "+15% Defense, +10% Health Regen"},
  {"type": "Race", "name": "Hybrid", "stat_bonus": "+15% Total Damage, +10% Health Regen"},
  {"type": "Race", "name": "Chimera Ant", "stat_bonus": "+10% Total Damage"},
  {"type": "Race", "name": "Nen User", "stat_bonus": "+20% Defense, +15% Skill Damage"},
  {"type": "Race", "name": "Saiyan", "stat_bonus": "+15% Total Damage when HP drops below 30%"},
  {"type": "Race", "name": "Majin", "stat_bonus": "+30% Health Regen, Status Effect Immunity"},
  {"type": "Race", "name": "Angel", "stat_bonus": "+10% Evasion, +15% Magical Damage"},
  {"type": "Race", "name": "God of Destruction", "stat_bonus": "+35% Total Damage"},
  {"type": "Race", "name": "Ninja", "stat_bonus": "+10% Movement Speed, +5% Skill Damage"},
  {"type": "Race", "name": "Fish-Men", "stat_bonus": "+20% Physical Damage, +15% Fighting Style Dmg, +10% Max HP"},
  {"type": "Race", "name": "Mink", "stat_bonus": "+15% Elemental Damage, +10% Movement Speed, +10% Stamina Regen"},
  {"type": "Race", "name": "Lunarian", "stat_bonus": "+20% Defense, +15% Elemental Damage, +10% Health Regen"},
  {"type": "Race", "name": "Skypiean", "stat_bonus": "+10% Movement Speed, +5% Evasion, +10% Max Stamina"},
  {"type": "Clan", "name": "Kamado", "stat_bonus": "+3% Health Regen, +5% Max Stamina"},
  {"type": "Clan", "name": "Hyuga", "stat_bonus": "+3% Max HP, +5% Fighting Style Dmg"},
  {"type": "Clan", "name": "Uzumaki", "stat_bonus": "+5% Max HP, +3% Endurance"},
  {"type": "Clan", "name": "Dragon Team", "stat_bonus": "+5% Physical Damage, +5% Max Stamina"},
  {"type": "Clan", "name": "Zoldyck", "stat_bonus": "+8% Total Damage, +12% Movement Speed, -12% Reduced Stamina Drain"},
  {"type": "Clan", "name": "Hanma", "stat_bonus": "+10% Physical Damage, +8% Stun Resistance"},
  {"type": "Clan", "name": "Uchiha", "stat_bonus": "-12% Cooldown Reduction, +10% Skill Damage"},
  {"type": "Clan", "name": "Gojo", "stat_bonus": "+15% Skill Damage, +10% Evasion"},
  {"type": "Clan", "name": "Core Area Warriors", "stat_bonus": "+20% Ultimate Skill Dmg, +15% Max Posture"},
  {"type": "Clan", "name": "Dark Empire", "stat_bonus": "+15% Total Damage, +12% Debuff Duration, -12% Cooldown Reduction"},
  {"type": "Clan", "name": "Otsutsuki", "stat_bonus": "+18% Elemental Damage, +10% Max Stamina"},
  {"type": "Clan", "name": "Viltrum Empire", "stat_bonus": "+20% Physical Damage, +15% Endurance, +3% Evasion"},
  {"type": "Clan", "name": "Espada", "stat_bonus": "+12% Physical Damage, +8% Magical Damage"},
  {"type": "Clan", "name": "Gotei 13", "stat_bonus": "+10% Weapon Damage, +5% Defense"},
  {"type": "Clan", "name": "Royal Guard", "stat_bonus": "+15% Max Posture, +10% Total Damage"},
  {"type": "Clan", "name": "Sternritter", "stat_bonus": "+10% Weapon Damage, -8% Cooldown Reduction"},
  {"type": "Clan", "name": "Schutzstaffel", "stat_bonus": "+15% Defense, +10% Skill Damage"},
  {"type": "Clan", "name": "Akatsuki", "stat_bonus": "+10% Skill Damage, +8% Total Damage"},
  {"type": "Clan", "name": "Sannin", "stat_bonus": "+10% Health Regen, +8% Physical Damage"},
  {"type": "Clan", "name": "Warlord", "stat_bonus": "+12% Total Damage, +10% Defense"},
  {"type": "Clan", "name": "Emperor", "stat_bonus": "+20% Total Damage, +15% Max HP, +10% Defense"}
];
  const cardPool = [
  {"name":"Heavy Hauler","req":"0 STR","category":"Strength","effect":"+3% Physical Damage, +2% Weapon Damage"},
  {"name":"Crushing Palm","req":"0 STR","category":"Strength","effect":"+4% Fighting Style Dmg"},
  {"name":"Iron Grip","req":"0 STR","category":"Strength","effect":"+3% Max Posture"},
  {"name":"Tremor Stride","req":"0 STR","category":"Strength","effect":"+3% Physical Damage"},
  {"name":"Anchor Stance","req":"0 STR","category":"Strength","effect":"+3% Endurance"},
  {"name":"Raw Might","req":"20 STR","category":"Strength","effect":"+5% Physical Damage"},
  {"name":"Bone Breaker","req":"20 STR","category":"Strength","effect":"+6% Weapon Damage"},
  {"name":"Overbearing Swing","req":"20 STR","category":"Strength","effect":"+8% Physical Damage"},
  {"name":"Sledge Impact","req":"20 STR","category":"Strength","effect":"+6% Max Posture"},
  {"name":"Brawny Guard","req":"20 STR","category":"Strength","effect":"+5% Defense"},
  {"name":"Impact Driver","req":"40 STR","category":"Strength","effect":"+10% Weapon Damage"},
  {"name":"Ground Pounder","req":"40 STR","category":"Strength","effect":"+10% Physical Damage"},
  {"name":"Shatter Pulse","req":"40 STR","category":"Strength","effect":"+12% Physical Damage"},
  {"name":"Titan Reach","req":"40 STR","category":"Strength","effect":"+8% Total Damage"},
  {"name":"Forceful Thrust","req":"40 STR","category":"Strength","effect":"+10% Weapon Damage"},
  {"name":"Unyielding Force","req":"60 STR","category":"Strength","effect":"+12% Physical Damage"},
  {"name":"Colossal Weight","req":"60 STR","category":"Strength","effect":"+15% Weapon Damage"},
  {"name":"Seismic Strike","req":"60 STR","category":"Strength","effect":"+10% Physical Damage, +5% Stun Resistance"},
  {"name":"Wrecking Blow","req":"60 STR","category":"Strength","effect":"+14% Physical Damage"},
  {"name":"Ironclad Fist","req":"60 STR","category":"Strength","effect":"+10% Defense, +5% Endurance"},
  {"name":"Apex Might","req":"80 STR","category":"Strength","effect":"+18% Physical Damage"},
  {"name":"Mountain Splitting Strike","req":"80 STR","category":"Strength","effect":"+20% Physical Damage"},
  {"name":"Absolute Impact","req":"80 STR","category":"Strength","effect":"+15% Weapon Damage, +10% Max Posture"},
  {"name":"Giant's Pressure","req":"80 STR","category":"Strength","effect":"+15% Total Damage"},
  {"name":"Cataclysmic Swing","req":"80 STR","category":"Strength","effect":"+20% Total Damage"},
  {"name":"Thick Skin","req":"0 VIT","category":"Vitality","effect":"+3% Max HP"},
  {"name":"Tough Fiber","req":"0 VIT","category":"Vitality","effect":"+3% Health Regen"},
  {"name":"Steady Heart","req":"0 VIT","category":"Vitality","effect":"-3% Debuff Duration"},
  {"name":"Sturdy Frame","req":"0 VIT","category":"Vitality","effect":"+2% Defense"},
  {"name":"Hardened Core","req":"0 VIT","category":"Vitality","effect":"+4% Endurance"},
  {"name":"Vital Surge","req":"20 VIT","category":"Vitality","effect":"+5% Max HP"},
  {"name":"Rapid Clotting","req":"20 VIT","category":"Vitality","effect":"+8% Health Regen"},
  {"name":"Iron Will","req":"20 VIT","category":"Vitality","effect":"+6% Defense when below 50% HP"},
  {"name":"Tenacious Body","req":"20 VIT","category":"Vitality","effect":"+8% Stun Resistance"},
  {"name":"Restorative Breath","req":"20 VIT","category":"Vitality","effect":"+4% Health Regen, +3% Max Stamina"},
  {"name":"Dense Musculature","req":"40 VIT","category":"Vitality","effect":"+8% Max HP, +5% Stun Resistance"},
  {"name":"Second Wind","req":"40 VIT","category":"Vitality","effect":"+12% Health Regen when below 35% HP"},
  {"name":"Pain Tolerance","req":"40 VIT","category":"Vitality","effect":"+6% Defense"},
  {"name":"Bastion Vitality","req":"40 VIT","category":"Vitality","effect":"+10% Max Posture"},
  {"name":"Unshakable Blood","req":"40 VIT","category":"Vitality","effect":"-10% Debuff Duration"},
  {"name":"Fortress Flesh","req":"60 VIT","category":"Vitality","effect":"+12% Max HP"},
  {"name":"Enduring Vessel","req":"60 VIT","category":"Vitality","effect":"+15% Health Regen"},
  {"name":"Unyielding Bone","req":"60 VIT","category":"Vitality","effect":"+10% Defense, +5% Endurance"},
  {"name":"Vital Overdrive","req":"60 VIT","category":"Vitality","effect":"+15% Health Regen"},
  {"name":"Resilient Pulse","req":"60 VIT","category":"Vitality","effect":"+10% Max HP, +10% Defense"},
  {"name":"Immortal Foundation","req":"80 VIT","category":"Vitality","effect":"+18% Max HP"},
  {"name":"Regeneration Surge","req":"80 VIT","category":"Vitality","effect":"+25% Health Regen"},
  {"name":"Granite Core","req":"80 VIT","category":"Vitality","effect":"+12% Defense"},
  {"name":"Invulnerable Frame","req":"80 VIT","category":"Vitality","effect":"+15% Stun Resistance, +15% Max Posture"},
  {"name":"Aegis Bloodline","req":"80 VIT","category":"Vitality","effect":"+20% Defense when HP drops below 20%"},
  {"name":"Fleet Footed","req":"0 AGI","category":"Agility","effect":"+3% Movement Speed"},
  {"name":"Light Step","req":"0 AGI","category":"Agility","effect":"-3% Reduced Stamina Drain"},
  {"name":"Nimble Dodge","req":"0 AGI","category":"Agility","effect":"+2% Evasion"},
  {"name":"Quick Recovery","req":"0 AGI","category":"Agility","effect":"+3% Stamina Regen"},
  {"name":"Swift Pivot","req":"0 AGI","category":"Agility","effect":"+4% Movement Speed"},
  {"name":"Gust Dash","req":"20 AGI","category":"Agility","effect":"+2% Evasion, -5% Reduced Stamina Drain"},
  {"name":"Wind Sprint","req":"20 AGI","category":"Agility","effect":"+6% Movement Speed"},
  {"name":"Flowing Stamina","req":"20 AGI","category":"Agility","effect":"+8% Stamina Regen"},
  {"name":"Evader's Instinct","req":"20 AGI","category":"Agility","effect":"+3% Evasion"},
  {"name":"Rapid Step","req":"20 AGI","category":"Agility","effect":"+5% Movement Speed"},
  {"name":"Gale Footwork","req":"40 AGI","category":"Agility","effect":"+8% Movement Speed, +3% Evasion"},
  {"name":"Slippery Target","req":"40 AGI","category":"Agility","effect":"-10% Reduced Stamina Drain"},
  {"name":"Adrenaline Surge","req":"40 AGI","category":"Agility","effect":"+10% Stamina Regen"},
  {"name":"Feathered Body","req":"40 AGI","category":"Agility","effect":"+5% Movement Speed, +3% Evasion"},
  {"name":"Kinetic Flow","req":"40 AGI","category":"Agility","effect":"+8% Movement Speed"},
  {"name":"Phantom Stride","req":"60 AGI","category":"Agility","effect":"+12% Movement Speed, +4% Evasion"},
  {"name":"Lightning Reflex","req":"60 AGI","category":"Agility","effect":"+5% Evasion"},
  {"name":"Wind Dancer","req":"60 AGI","category":"Agility","effect":"+12% Stamina Regen"},
  {"name":"Swift Evasion","req":"60 AGI","category":"Agility","effect":"+15% Movement Speed after dodging"},
  {"name":"Acrobatic Recovery","req":"60 AGI","category":"Agility","effect":"-15% Reduced Stamina Drain"},
  {"name":"Velocity Mastery","req":"80 AGI","category":"Agility","effect":"+15% Movement Speed"},
  {"name":"Mirage Motion","req":"80 AGI","category":"Agility","effect":"+6% Evasion"},
  {"name":"Endless Wind","req":"80 AGI","category":"Agility","effect":"-20% Reduced Stamina Drain, +15% Stamina Regen"},
  {"name":"Blur Shift","req":"80 AGI","category":"Agility","effect":"+10% Movement Speed, +4% Evasion"},
  {"name":"Apex Agility","req":"80 AGI","category":"Agility","effect":"+15% Stamina Regen, +10% Movement Speed"},
  {"name":"Needle Point","req":"0 LHT","category":"Light Mastery","effect":"+3% Weapon Damage"},
  {"name":"Swift Flourish","req":"0 LHT","category":"Light Mastery","effect":"-3% Reduced Stamina Drain"},
  {"name":"Quick Stun","req":"0 LHT","category":"Light Mastery","effect":"+3% Stun Resistance"},
  {"name":"Rapid Thrust","req":"0 LHT","category":"Light Mastery","effect":"+3% Skill Damage"},
  {"name":"Flick Wrist","req":"0 LHT","category":"Light Mastery","effect":"-3% Cooldown Reduction"},
  {"name":"Viper Slash","req":"20 LHT","category":"Light Mastery","effect":"+5% Weapon Damage"},
  {"name":"Razor Edge","req":"20 LHT","category":"Light Mastery","effect":"+6% Fighting Style Dmg"},
  {"name":"Stabbing Momentum","req":"20 LHT","category":"Light Mastery","effect":"+5% Movement Speed"},
  {"name":"Nimble Guard","req":"20 LHT","category":"Light Mastery","effect":"+5% Defense"},
  {"name":"Precise Cutter","req":"20 LHT","category":"Light Mastery","effect":"+5% Physical Damage"},
  {"name":"Cobra Strike","req":"40 LHT","category":"Light Mastery","effect":"+8% Weapon Damage"},
  {"name":"Flurry Stance","req":"40 LHT","category":"Light Mastery","effect":"+10% Fighting Style Dmg"},
  {"name":"Puncturing Edge","req":"40 LHT","category":"Light Mastery","effect":"+8% Physical Damage"},
  {"name":"Agile Feint","req":"40 LHT","category":"Light Mastery","effect":"+8% Stamina Regen"},
  {"name":"Swift Retaliation","req":"40 LHT","category":"Light Mastery","effect":"+10% Total Damage after counter"},
  {"name":"Tempest Blade","req":"60 LHT","category":"Light Mastery","effect":"+12% Weapon Damage"},
  {"name":"Blitz Cadence","req":"60 LHT","category":"Light Mastery","effect":"-10% Cooldown Reduction"},
  {"name":"Needle Precision","req":"60 LHT","category":"Light Mastery","effect":"+12% Physical Damage"},
  {"name":"Dancing Edge","req":"60 LHT","category":"Light Mastery","effect":"-12% Reduced Stamina Drain"},
  {"name":"Critical Piercer","req":"60 LHT","category":"Light Mastery","effect":"+15% Total Damage"},
  {"name":"Apex Light Master","req":"80 LHT","category":"Light Mastery","effect":"+15% Weapon Damage, +10% Physical Damage"},
  {"name":"Hurricane Swarm","req":"80 LHT","category":"Light Mastery","effect":"+15% Fighting Style Dmg"},
  {"name":"Phantom Strike","req":"80 LHT","category":"Light Mastery","effect":"+4% Evasion, +8% Weapon Damage"},
  {"name":"Lethal Precision","req":"80 LHT","category":"Light Mastery","effect":"+18% Physical Damage"},
  {"name":"Unmatched Speed","req":"80 LHT","category":"Light Mastery","effect":"+15% Movement Speed, -10% Cooldown Reduction"},
  {"name":"Balanced Grip","req":"0 MED","category":"Medium Mastery","effect":"+3% Weapon Damage"},
  {"name":"Steady Blade","req":"0 MED","category":"Medium Mastery","effect":"+3% Defense"},
  {"name":"Center Guard","req":"0 MED","category":"Medium Mastery","effect":"+3% Max Posture"},
  {"name":"Versatile Stance","req":"0 MED","category":"Medium Mastery","effect":"-3% Reduced Stamina Drain"},
  {"name":"Clean Sweep","req":"0 MED","category":"Medium Mastery","effect":"+3% Physical Damage"},
  {"name":"Duelist Posture","req":"20 MED","category":"Medium Mastery","effect":"+5% Weapon Damage"},
  {"name":"Parry Rhythm","req":"20 MED","category":"Medium Mastery","effect":"+5% Defense"},
  {"name":"Guarding Edge","req":"20 MED","category":"Medium Mastery","effect":"+6% Max Posture"},
  {"name":"Swift Slash","req":"20 MED","category":"Medium Mastery","effect":"+5% Physical Damage"},
  {"name":"Iron Counter","req":"20 MED","category":"Medium Mastery","effect":"+6% Defense"},
  {"name":"Precision Saber","req":"40 MED","category":"Medium Mastery","effect":"+8% Weapon Damage"},
  {"name":"Master Parry","req":"40 MED","category":"Medium Mastery","effect":"+8% Stamina Regen"},
  {"name":"Flawless Balance","req":"40 MED","category":"Medium Mastery","effect":"-8% Reduced Stamina Drain"},
  {"name":"Ripple Guard","req":"40 MED","category":"Medium Mastery","effect":"+10% Defense"},
  {"name":"Striking Edge","req":"40 MED","category":"Medium Mastery","effect":"+8% Total Damage"},
  {"name":"Sentinel Stance","req":"60 MED","category":"Medium Mastery","effect":"+12% Weapon Damage"},
  {"name":"Perfect Deflection","req":"60 MED","category":"Medium Mastery","effect":"+10% Defense, +5% Stun Resistance"},
  {"name":"Tactical Mastery","req":"60 MED","category":"Medium Mastery","effect":"-10% Cooldown Reduction"},
  {"name":"Unyielding Sword","req":"60 MED","category":"Medium Mastery","effect":"+10% Defense, +8% Physical Damage"},
  {"name":"Swift Deflect","req":"60 MED","category":"Medium Mastery","effect":"+10% Max Posture"},
  {"name":"Grandmaster Duelist","req":"80 MED","category":"Medium Mastery","effect":"+15% Weapon Damage, +10% Defense"},
  {"name":"Spatial Edge","req":"80 MED","category":"Medium Mastery","effect":"+15% Total Damage"},
  {"name":"Supreme Guard","req":"80 MED","category":"Medium Mastery","effect":"+18% Defense"},
  {"name":"Countering Cleave","req":"80 MED","category":"Medium Mastery","effect":"+20% Physical Damage after parrying"},
  {"name":"Apex Medium Master","req":"80 MED","category":"Medium Mastery","effect":"+18% Total Damage"},
  {"name":"Crushing Weight","req":"0 HVY","category":"Heavy Mastery","effect":"+3% Max Posture"},
  {"name":"Heavy Swing","req":"0 HVY","category":"Heavy Mastery","effect":"+3% Weapon Damage"},
  {"name":"Anchor Weight","req":"0 HVY","category":"Heavy Mastery","effect":"+3% Endurance"},
  {"name":"Wide Arc","req":"0 HVY","category":"Heavy Mastery","effect":"+3% Physical Damage"},
  {"name":"Brute Slam","req":"0 HVY","category":"Heavy Mastery","effect":"+3% Total Damage"},
  {"name":"Mighty Cleave","req":"20 HVY","category":"Heavy Mastery","effect":"+6% Weapon Damage"},
  {"name":"Shield Crusher","req":"20 HVY","category":"Heavy Mastery","effect":"+6% Physical Damage"},
  {"name":"Impact Frame","req":"20 HVY","category":"Heavy Mastery","effect":"+5% Max Posture"},
  {"name":"Unstoppable Windup","req":"20 HVY","category":"Heavy Mastery","effect":"+5% Defense"},
  {"name":"Heavy Momentum","req":"20 HVY","category":"Heavy Mastery","effect":"-5% Reduced Stamina Drain"},
  {"name":"Shatter Blade","req":"40 HVY","category":"Heavy Mastery","effect":"+10% Physical Damage"},
  {"name":"Iron Cleaver","req":"40 HVY","category":"Heavy Mastery","effect":"+8% Weapon Damage"},
  {"name":"Colossal Impact","req":"40 HVY","category":"Heavy Mastery","effect":"+10% Max Posture"},
  {"name":"Staggering Slam","req":"40 HVY","category":"Heavy Mastery","effect":"+8% Stun Resistance"},
  {"name":"Enduring Swing","req":"40 HVY","category":"Heavy Mastery","effect":"+8% Defense"},
  {"name":"Titan Cleave","req":"60 HVY","category":"Heavy Mastery","effect":"+12% Weapon Damage"},
  {"name":"Demolition Force","req":"60 HVY","category":"Heavy Mastery","effect":"+15% Physical Damage"},
  {"name":"Earth Shatter","req":"60 HVY","category":"Heavy Mastery","effect":"+12% Total Damage"},
  {"name":"Unbending Titan","req":"60 HVY","category":"Heavy Mastery","effect":"+10% Stun Resistance"},
  {"name":"Devastating Impact","req":"60 HVY","category":"Heavy Mastery","effect":"+12% Physical Damage"},
  {"name":"World Breaker","req":"80 HVY","category":"Heavy Mastery","effect":"+18% Weapon Damage"},
  {"name":"Cataclysm Slam","req":"80 HVY","category":"Heavy Mastery","effect":"+25% Physical Damage"},
  {"name":"Immovable Force","req":"80 HVY","category":"Heavy Mastery","effect":"+15% Stun Resistance, +10% Defense"},
  {"name":"Dreadful Sweep","req":"80 HVY","category":"Heavy Mastery","effect":"+20% Total Damage"},
  {"name":"Apex Heavy Master","req":"80 HVY","category":"Heavy Mastery","effect":"+20% Max Posture, +10% Weapon Damage"},
  {"name":"Quick Aim","req":"0 GUN","category":"Gun Mastery","effect":"-3% Cooldown Reduction"},
  {"name":"Lead Shot","req":"0 GUN","category":"Gun Mastery","effect":"+3% Weapon Damage"},
  {"name":"Powder Charge","req":"0 GUN","category":"Gun Mastery","effect":"+3% Skill Damage"},
  {"name":"Swift Chamber","req":"0 GUN","category":"Gun Mastery","effect":"-3% Reduced Stamina Drain"},
  {"name":"Piercing Round","req":"0 GUN","category":"Gun Mastery","effect":"+2% Physical Damage"},
  {"name":"Gunslinger Step","req":"20 GUN","category":"Gun Mastery","effect":"+5% Movement Speed"},
  {"name":"Heavy Caliber","req":"20 GUN","category":"Gun Mastery","effect":"+6% Weapon Damage"},
  {"name":"Rapid Reload","req":"20 GUN","category":"Gun Mastery","effect":"-5% Cooldown Reduction"},
  {"name":"Precise Trigger","req":"20 GUN","category":"Gun Mastery","effect":"+5% Skill Damage"},
  {"name":"Ricochet Focus","req":"20 GUN","category":"Gun Mastery","effect":"+5% Physical Damage"},
  {"name":"Marksman Eye","req":"40 GUN","category":"Gun Mastery","effect":"+8% Weapon Damage, +5% Skill Damage"},
  {"name":"Point Blank","req":"40 GUN","category":"Gun Mastery","effect":"+10% Physical Damage"},
  {"name":"Quick Reloading","req":"40 GUN","category":"Gun Mastery","effect":"-10% Cooldown Reduction"},
  {"name":"Staggering Bullet","req":"40 GUN","category":"Gun Mastery","effect":"+8% Stun Resistance"},
  {"name":"Mobile Shot","req":"40 GUN","category":"Gun Mastery","effect":"+10% Movement Speed"},
  {"name":"Sniper Focus","req":"60 GUN","category":"Gun Mastery","effect":"+12% Skill Damage"},
  {"name":"Blast Powder","req":"60 GUN","category":"Gun Mastery","effect":"+12% Weapon Damage"},
  {"name":"Rapid Fire Stance","req":"60 GUN","category":"Gun Mastery","effect":"-15% Cooldown Reduction"},
  {"name":"Penetrating Lead","req":"60 GUN","category":"Gun Mastery","effect":"+12% Physical Damage"},
  {"name":"Executioner Round","req":"60 GUN","category":"Gun Mastery","effect":"+15% Total Damage against low HP targets"},
  {"name":"Apex Gunner","req":"80 GUN","category":"Gun Mastery","effect":"+18% Weapon Damage"},
  {"name":"Deadeye Shot","req":"80 GUN","category":"Gun Mastery","effect":"+25% Skill Damage"},
  {"name":"Quickdraw Sentinel","req":"80 GUN","category":"Gun Mastery","effect":"-20% Cooldown Reduction"},
  {"name":"Ballistic Barrage","req":"80 GUN","category":"Gun Mastery","effect":"+15% Skill Damage, +10% Movement Speed"},
  {"name":"Caliber Mastery","req":"80 GUN","category":"Gun Mastery","effect":"+20% Physical Damage"},
  {"name":"Monolithic Bastion","req":"70 STR, 70 VIT, 30 HVY","category":"High Multi-Stat","effect":"+15% Max HP, +12% Defense, +10% Stun Resistance"},
  {"name":"Juggernaut Overdrive","req":"80 STR, 80 VIT","category":"High Multi-Stat","effect":"+15% Physical Damage, +15% Max HP, +10% Total Damage"},
  {"name":"Tempest Executioner","req":"70 AGI, 70 STR, 40 LHT","category":"High Multi-Stat","effect":"+15% Movement Speed, +12% Weapon Damage, -10% Cooldown Reduction"},
  {"name":"Apex Skirmisher Stance","req":"60 AGI, 60 STR, 40 GUN","category":"High Multi-Stat","effect":"+12% Skill Damage, +10% Movement Speed, +10% Total Damage"},
  {"name":"Ironhide Dreadnought","req":"80 VIT, 60 STR, 40 MED","category":"High Multi-Stat","effect":"+18% Max HP, +10% Physical Damage, +12% Defense"},
  {"name":"Phantasm Bladecraft","req":"70 AGI, 50 VIT, 70 LHT","category":"High Multi-Stat","effect":"+5% Evasion, +12% Weapon Damage, +8% Health Regen"},
  {"name":"Unyielding Gladiator","req":"60 STR, 60 VIT, 60 AGI","category":"High Multi-Stat","effect":"+10% Physical Damage, +10% Max HP, +10% Movement Speed, +10% Stamina Regen"},
  {"name":"Colossal Warbringer","req":"80 STR, 50 VIT, 50 HVY","category":"High Multi-Stat","effect":"+18% Physical Damage, +10% Weapon Damage, +10% Max Posture"},
  {"name":"Ballistic Phantom","req":"80 AGI, 40 STR, 50 GUN","category":"High Multi-Stat","effect":"+15% Movement Speed, +12% Weapon Damage, +10% Stun Resistance"},
  {"name":"Aegis Sentinel","req":"80 VIT, 40 STR, 50 MED","category":"High Multi-Stat","effect":"+20% Health Regen, +10% Defense, +8% Physical Damage"},
  {"name":"Cataclysmic Duelist","req":"60 STR, 60 AGI, 50 MED","category":"High Multi-Stat","effect":"+12% Physical Damage, +4% Evasion, +10% Weapon Damage"},
  {"name":"Vanguard Breaker","req":"70 STR, 40 VIT, 60 HVY","category":"High Multi-Stat","effect":"+15% Weapon Damage, +10% Defense, +10% Stun Resistance"},
  {"name":"Gale Marksman","req":"70 AGI, 50 VIT, 50 GUN","category":"High Multi-Stat","effect":"+4% Evasion, +10% Movement Speed, +8% Max HP"},
  {"name":"Titan Fortress","req":"75 STR, 75 VIT, 50 HVY","category":"High Multi-Stat","effect":"+15% Physical Damage, +15% Max HP, +15% Defense"},
  {"name":"Blitz Sovereign","req":"75 AGI, 50 STR, 50 LHT","category":"High Multi-Stat","effect":"+15% Movement Speed, +12% Weapon Damage, +10% Total Damage"},
  {"name":"Absolute Order","req":"40 STR, 20 GUN, Marine Faction","category":"Marine","effect":"+8% Weapon Damage, +5% Physical Damage"},
  {"name":"Iron Justice","req":"50 VIT, 30 MED, Marine Faction","category":"Marine","effect":"+10% Defense, +5% Max HP"},
  {"name":"Tactical Fleet Stance","req":"40 AGI, 20 GUN, Marine Faction","category":"Marine","effect":"-8% Cooldown Reduction, +5% Movement Speed"},
  {"name":"Buster Command","req":"60 STR, 40 HVY, Marine Faction","category":"Marine","effect":"+12% Physical Damage, +8% Total Damage"},
  {"name":"Righteous Pursuit","req":"50 AGI, 30 LHT, Marine Faction","category":"Marine","effect":"+10% Movement Speed, +5% Weapon Damage"},
  {"name":"Plunderer's Greed","req":"30 AGI, 20 LHT, Pirate Faction","category":"Pirate","effect":"+5% Movement Speed, +5% Weapon Damage"},
  {"name":"Reckless Broadside","req":"50 STR, 30 GUN, Pirate Faction","category":"Pirate","effect":"+10% Weapon Damage, +5% Physical Damage"},
  {"name":"Marauder's Grit","req":"60 VIT, 20 HVY, Pirate Faction","category":"Pirate","effect":"+12% Max HP, +8% Total Damage when low HP"},
  {"name":"Corsair Step","req":"50 AGI, 30 MED, Pirate Faction","category":"Pirate","effect":"+3% Evasion, +5% Defense"},
  {"name":"Flag of Chaos","req":"70 STR, 30 HVY, Pirate Faction","category":"Pirate","effect":"+15% Physical Damage"},
  {"name":"Subversive Intel","req":"40 AGI, 20 MED, Revolutionary Army Faction","category":"Revolutionary Army","effect":"+8% Movement Speed, -5% Cooldown Reduction"},
  {"name":"Liberation Strike","req":"50 STR, 30 LHT, Revolutionary Army Faction","category":"Revolutionary Army","effect":"+10% Physical Damage"},
  {"name":"Underground Resilience","req":"60 VIT, 20 LHT, Revolutionary Army Faction","category":"Revolutionary Army","effect":"+15% Health Regen, +5% Max HP"},
  {"name":"Guerilla Ambush","req":"50 AGI, 30 GUN, Revolutionary Army Faction","category":"Revolutionary Army","effect":"+15% Total Damage from back attacks"},
  {"name":"Spark of Rebellion","req":"60 STR, 40 VIT, Revolutionary Army Faction","category":"Revolutionary Army","effect":"+10% Physical Damage, +8% Stun Resistance"},
  {"name":"Uncharted Horizon","req":"30 AGI, 20 MED, Adventurer Faction","category":"Adventurer","effect":"+8% Movement Speed, +5% Stamina Regen"},
  {"name":"Wayfarer's Instinct","req":"50 AGI, 30 LHT, Adventurer Faction","category":"Adventurer","effect":"+4% Evasion, +5% Movement Speed"},
  {"name":"Pioneer Endurance","req":"60 VIT, 20 HVY, Adventurer Faction","category":"Adventurer","effect":"+10% Max HP, +10% Endurance"},
  {"name":"Survivalist Scavenger","req":"40 VIT, 20 GUN, Adventurer Faction","category":"Adventurer","effect":"+10% Health Regen, -5% Cooldown Reduction"},
  {"name":"Master Explorer","req":"50 STR, 50 AGI, Adventurer Faction","category":"Adventurer","effect":"+8% Physical Damage, +8% Movement Speed"},
  {"name":"Zenkai Overdrive","req":"80 STR, 40 VIT, Saiyan Race","category":"Race Exclusive","effect":"+20% Total Damage when HP drops below 30%, +10% Max HP"},
  {"name":"Apex Conqueror","req":"80 STR, 50 VIT, Viltrumite Race","category":"Race Exclusive","effect":"+15% Physical Damage, +12% Endurance, +10% Max Stamina"},
  {"name":"Nocturnal Regeneration","req":"60 VIT, 40 STR, Demon Race","category":"Race Exclusive","effect":"+20% Health Regen, +8% Physical Damage"},
  {"name":"Predatory Vitality","req":"70 STR, 40 AGI, Ghoul Race","category":"Race Exclusive","effect":"+12% Physical Damage, +10% Movement Speed"},
  {"name":"Ten Shielding","req":"60 VIT, 60 AGI, Nen User Race","category":"Race Exclusive","effect":"+15% Defense, +10% Skill Damage"},
  {"name":"Hakai Essence","req":"80 STR, 60 VIT, God of Destruction Race","category":"Race Exclusive","effect":"+20% Total Damage, +15% Ultimate Skill Dmg"},
  {"name":"Biological Peak","req":"60 STR, 60 VIT, Superhuman Race","category":"Race Exclusive","effect":"+10% Physical Damage, +10% Max HP, +5% Movement Speed"},
  {"name":"Elastic Recovery","req":"80 VIT, 40 AGI, Majin Race","category":"Race Exclusive","effect":"+25% Health Regen, +10% Stun Resistance"},
  {"name":"Insightful Weaving","req":"60 AGI, 40 STR, Uchiha Clan","category":"Clan Exclusive","effect":"-15% Cooldown Reduction, +10% Skill Damage"},
  {"name":"Limitless Distortion","req":"70 AGI, 50 VIT, Gojo Clan","category":"Clan Exclusive","effect":"+5% Evasion, +12% Skill Damage"},
  {"name":"Demon Back Release","req":"80 STR, 40 VIT, Hanma Clan","category":"Clan Exclusive","effect":"+15% Physical Damage, +12% Stun Resistance"},
  {"name":"Sun Breath Resonance","req":"50 VIT, 50 AGI, Kamado Clan","category":"Clan Exclusive","effect":"+15% Health Regen, +10% Stamina Regen"},
  {"name":"Silent Execution","req":"70 AGI, 40 STR, Zoldyck Clan","category":"Clan Exclusive","effect":"+12% Total Damage, +12% Movement Speed, -10% Reduced Stamina Drain"},
  {"name":"Dimensional Rupture","req":"80 STR, 50 VIT, Core Area Warriors Clan","category":"Clan Exclusive","effect":"+20% Ultimate Skill Dmg, +12% Max Posture"},
  {"name":"Shadow Sovereignty","req":"70 STR, 50 VIT, Dark Empire Clan","category":"Clan Exclusive","effect":"+15% Total Damage, -10% Cooldown Reduction, +10% Debuff Duration"},
  {"name":"Super Warrior Awakening","req":"80 STR, 60 VIT, Saiyan Race, Dragon Team Clan","category":"Combo Exclusive","effect":"+18% Physical Damage, +15% Max Stamina, +10% Total Damage"},
  {"name":"Empire Monarch","req":"80 STR, 70 VIT, Viltrumite Race, Viltrum Empire Clan","category":"Combo Exclusive","effect":"+20% Physical Damage, +15% Endurance, +10% Max HP"},
  {"name":"Spiritual Foresight","req":"60 AGI, 60 STR, Shinigami Race, Uchiha Clan","category":"Combo Exclusive","effect":"+15% Weapon Damage, -12% Cooldown Reduction, +10% Skill Damage"},
  {"name":"Sun Resistant Demon","req":"70 VIT, 50 STR, Demon Race, Kamado Clan","category":"Combo Exclusive","effect":"+25% Health Regen, +10% Max Stamina, +8% Physical Damage"},
  {"name":"Apex Biological Predator","req":"80 STR, 50 AGI, Ghoul Race, Hanma Clan","category":"Combo Exclusive","effect":"+20% Physical Damage, +10% Stun Resistance, +10% Movement Speed"},
  {"name":"Untouchable Transcendence","req":"80 AGI, 60 VIT, Angel Race, Gojo Clan","category":"Combo Exclusive","effect":"+8% Evasion, +15% Magical Damage, -10% Cooldown Reduction"},
  {"name":"Abyssal Calamity","req":"70 VIT, 60 STR, Cursed Spirit Race, Dark Empire Clan","category":"Combo Exclusive","effect":"+15% Total Damage, +15% Magical Damage, +12% Debuff Duration"},
  {"name":"Celestial Aura Mastery","req":"70 AGI, 70 VIT, Nen User Race, Otsutsuki Clan","category":"Combo Exclusive","effect":"+18% Elemental Damage, +15% Defense, +10% Skill Damage"},
  {"name":"Shadow Destruction Overlord","req":"80 STR, 60 VIT, God of Destruction Race, Dark Empire Clan","category":"Combo Exclusive","effect":"+25% Total Damage, +20% Ultimate Skill Dmg, -10% Cooldown Reduction"},
  {"name":"Celestial Divine Transcendence","req":"80 AGI, 60 VIT, Angel Race, Otsutsuki Clan","category":"Combo Exclusive","effect":"+20% Elemental Damage, +8% Evasion, +15% Magical Damage"},
  {"name":"Demonic Ogre Resilience","req":"80 STR, 50 VIT, Devil Race, Hanma Clan","category":"Combo Exclusive","effect":"+20% Physical Damage, +12% Stun Resistance, +10% Total Damage"},
  {"name":"Cero Metamorphic Release","req":"70 VIT, 50 STR, Arrancar Race, Espada Faction","category":"Combo Exclusive","effect":"+20% Defense, +15% Magical Damage, +10% Physical Damage"},
  {"name":"Gotei Captain Ascension","req":"70 STR, 50 MED, Shinigami Race, Gotei 13 Faction","category":"Combo Exclusive","effect":"+15% Weapon Damage, +12% Defense, -10% Cooldown Reduction"},
  {"name":"Zero Division Sovereign","req":"80 STR, 60 AGI, Shinigami Race, Royal Guard Faction","category":"Combo Exclusive","effect":"+20% Weapon Damage, +15% Max Posture, +10% Total Damage"},
  {"name":"Vollständig Schrift Resonance","req":"70 GUN, 50 AGI, Quincy Race, Sternritter Faction","category":"Combo Exclusive","effect":"+15% Weapon Damage, -12% Cooldown Reduction, +10% Physical Damage"},
  {"name":"Schutzstaffel Sacred Guard","req":"80 AGI, 60 GUN, Quincy Race, Schutzstaffel Faction","category":"Combo Exclusive","effect":"+20% Weapon Damage, +15% Skill Damage, +6% Evasion"},
  {"name":"Crimson Cloud Ambush","req":"70 AGI, 50 STR, Ninja Class, Akatsuki Faction","category":"Combo Exclusive","effect":"+15% Skill Damage, +10% Total Damage, -10% Cooldown Reduction"},
  {"name":"Sage Sannin Mastery","req":"70 VIT, 60 STR, Ninja Class, Sannin Faction","category":"Combo Exclusive","effect":"+15% Health Regen, +12% Physical Damage, +10% Defense"},
  {"name":"Visual Foresight Mastery","req":"80 AGI, 60 STR, Ninja Class, Uchiha Clan","category":"Combo Exclusive","effect":"-15% Cooldown Reduction, +15% Skill Damage, +4% Evasion"},
  {"name":"Sealing Force Vitality","req":"80 VIT, 50 STR, Ninja Class, Uzumaki Clan","category":"Combo Exclusive","effect":"+18% Max HP, +15% Max Stamina, +10% Endurance"},
  {"name":"Eight Trigrams Precision","req":"70 STR, 60 AGI, Ninja Class, Hyuga Clan","category":"Combo Exclusive","effect":"+15% Fighting Style Dmg, +10% Max Posture, +8% Physical Damage"},
  {"name":"Ancestral Truth Core","req":"80 VIT, 70 AGI, Ninja Class, Otsutsuki Clan","category":"Combo Exclusive","effect":"+20% Elemental Damage, +15% Max Stamina, +12% Skill Damage"},
  {"name":"Seven Seas Tyrant","req":"80 STR, 60 VIT, Pirate Faction, Warlord Clan","category":"Combo Exclusive","effect":"+20% Total Damage, +12% Defense, +10% Max HP"},
  {"name":"Sovereign of the High Seas","req":"80 STR, 70 VIT, Pirate Faction, Emperor Clan","category":"Combo Exclusive","effect":"+25% Total Damage, +18% Max HP, +15% Defense"},
  {"name":"Corsair Warlord","req":"70 AGI, 50 STR, Pirate Faction, Warlord Clan","category":"Combo Exclusive","effect":"+15% Movement Speed, +12% Weapon Damage, +10% Total Damage"},
  {"name":"Imperial Marauder","req":"75 STR, 50 AGI, Pirate Faction, Emperor Clan","category":"Combo Exclusive","effect":"+20% Physical Damage, +15% Total Damage, +10% Movement Speed"},
  {"name":"Warlord Bastion","req":"70 VIT, 50 STR, Warlord Clan","category":"Clan Exclusive","effect":"+15% Defense, +12% Total Damage, +10% Max Posture"},
  {"name":"Emperor's Presence","req":"80 STR, 60 VIT, Emperor Clan","category":"Clan Exclusive","effect":"+20% Total Damage, +15% Max HP, +10% Endurance"},
  {"name":"Ironclad Warlord","req":"80 VIT, 50 STR, Superhuman Race, Warlord Clan","category":"Combo Exclusive","effect":"+18% Max HP, +15% Defense, +10% Total Damage"},
  {"name":"Conquering Sovereign","req":"80 STR, 60 VIT, Viltrumite Race, Emperor Clan","category":"Combo Exclusive","effect":"+22% Physical Damage, +18% Total Damage, +12% Endurance"},
  {"name":"Ocean Overlord Marauder","req":"70 STR, 50 VIT, Fish-Men Race, Pirate Faction","category":"Combo Exclusive","effect":"+18% Physical Damage, +12% Fighting Style Dmg, +10% Max HP"},
  {"name":"Tidal Corsair Strike","req":"60 STR, 40 AGI, Fish-Men Race, Pirate Faction","category":"Combo Exclusive","effect":"+15% Fighting Style Dmg, +10% Movement Speed, +8% Total Damage"},
  {"name":"Sinking Electro Raider","req":"70 AGI, 50 STR, Mink Race, Pirate Faction","category":"Combo Exclusive","effect":"+15% Elemental Damage, +12% Movement Speed, +10% Stamina Regen"},
  {"name":"Sunsoul Wild Marauder","req":"60 AGI, 40 VIT, Mink Race, Pirate Faction","category":"Combo Exclusive","effect":"+12% Elemental Damage, +10% Movement Speed, +8% Total Damage"},
  {"name":"Ignited Calamity Corsair","req":"80 VIT, 60 STR, Lunarian Race, Pirate Faction","category":"Combo Exclusive","effect":"+18% Defense, +15% Elemental Damage, +10% Total Damage"},
  {"name":"Flame-Winged Dreadnought","req":"70 STR, 50 VIT, Lunarian Race, Pirate Faction","category":"Combo Exclusive","effect":"+15% Elemental Damage, +12% Physical Damage, +10% Health Regen"},
  {"name":"Skybound Buccaneer","req":"70 AGI, 40 STR, Skypiean Race, Pirate Faction","category":"Combo Exclusive","effect":"+15% Movement Speed, +4% Evasion, +10% Total Damage"},
  {"name":"Dial-Engine Corsair","req":"60 AGI, 50 GUN, Skypiean Race, Pirate Faction","category":"Combo Exclusive","effect":"+12% Weapon Damage, +10% Movement Speed, -8% Cooldown Reduction"}
];

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
  const raceBadge = document.getElementById('raceBadge');
  const clanBadge = document.getElementById('clanBadge');
  const levelPackCount = document.getElementById('levelPackCount');

  // Race and Clan Selectors
  const raceSelect = document.getElementById('raceSelect');
  const clanSelect = document.getElementById('clanSelect');

  let currentRace = 'Human';
  let currentClan = 'None';

  raceSelect?.addEventListener('change', (e) => {
    currentRace = e.target.value;
    if (raceBadge) raceBadge.textContent = currentRace.toUpperCase();
    updateUI();
  });

  clanSelect?.addEventListener('change', (e) => {
    currentClan = e.target.value;
    if (clanBadge) clanBadge.textContent = currentClan.toUpperCase();
    updateUI();
  });

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

  // Smart Requirement Parser (Handles Factions, Races, Clans, Classes, and Masteries)
  function meetsRequirement(reqStr) {
    if (!reqStr || reqStr === '0') return true;

    const parts = reqStr.split(',');
    for (let part of parts) {
      part = part.trim();

      // Faction check
      if (part.endsWith(' Faction')) {
        const fac = part.replace(' Faction', '').trim();
        if (fac === 'Marine' && currentFaction !== 'Marines') return false;
        if (fac === 'Pirate' && currentFaction !== 'Pirates') return false;
        if (fac === 'Revolutionary Army' && currentFaction !== 'Revolutionaries') return false;
        if (fac === 'Adventurer' && currentFaction !== 'Adventurers') return false;
        if (['Espada', 'Gotei 13', 'Royal Guard', 'Sternritter', 'Schutzstaffel', 'Akatsuki', 'Sannin', 'Warlord', 'Emperor'].includes(fac)) {
          if (currentClan !== fac && currentFaction !== fac) return false;
        }
        continue;
      }

      // Class / Race check
      if (part.endsWith(' Class')) {
        const cls = part.replace(' Class', '').trim();
        if (currentRace !== cls) return false;
        continue;
      }

      if (part.endsWith(' Race')) {
        const reqRace = part.replace(' Race', '').trim();
        if (currentRace !== reqRace) return false;
        continue;
      }

      // Clan check
      if (part.endsWith(' Clan')) {
        const reqClan = part.replace(' Clan', '').trim();
        if (currentClan !== reqClan) return false;
        continue;
      }

      // Stat requirement check (e.g. 80 STR, 60 VIT, 50 LHT, 40 MED, 30 HVY, 20 GUN)
      const match = part.match(/^(\d+)\s+(.+)$/);
      if (!match) continue;

      const reqVal = parseInt(match[1], 10);
      const reqType = match[2].trim();

      let playerVal = 0;
      if (reqType === 'STR') playerVal = stats.str;
      else if (reqType === 'VIT') playerVal = stats.vit;
      else if (reqType === 'AGI') playerVal = stats.agi;
      else if (reqType === 'LHT' || reqType === 'Light Mastery') playerVal = stats.light;
      else if (reqType === 'MED' || reqType === 'Medium Mastery') playerVal = stats.med;
      else if (reqType === 'HVY' || reqType === 'Heavy Mastery') playerVal = stats.heavy;
      else if (reqType === 'GUN' || reqType === 'Gun Mastery') playerVal = stats.gun;

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

  // Calculate 26 Game Stats from base stats, level scaling, inherent race/clan perks, and card passive effects
  function calculateGameStats() {
    const total = getTotalTrainableStats();
    const level = Math.min(25, Math.floor(total / 10));

    // Base Level Derived Stats
    let maxHp = level;
    let hpRegen = level;
    let maxStamina = level;
    let staminaRegen = level;
    let endurance = level * 2.5;

    let physDmg = 0;
    let magicDmg = 0;
    let moveSpeed = 0;
    let cdr = 0;
    let skillDmg = 0;
    let wpnDmg = 0;
    let stunRes = 0;
    let totalDmg = 0;
    let debuffDuration = 0;
    let staminaDrain = 0;
    let defense = 0;
    let maxPosture = 0;
    let styleDmg = 0;
    let evasion = 0;
    let ultDmg = 0;
    let elemDmg = 0;

    // Helper parser for effect strings
    const applyEffectString = (effStr) => {
      if (!effStr) return;
      const parts = effStr.split(',');
      parts.forEach(p => {
        const text = p.trim();
        const numMatch = text.match(/([+-]?\d+(?:\.\d+)?)%/);
        const val = numMatch ? parseFloat(numMatch[1]) : 0;

        if (text.includes('Physical Damage') || text.includes('Phys Dmg') || text.includes('Phys')) physDmg += val;
        else if (text.includes('Magical Damage') || text.includes('Magic Dmg') || text.includes('Magic')) magicDmg += val;
        else if (text.includes('Movement Speed') || text.includes('Sprint Speed') || text.includes('Speed')) moveSpeed += val;
        else if (text.includes('Cooldown Reduction') || text.includes('CDR')) cdr += Math.abs(val);
        else if (text.includes('Skill Damage') || text.includes('Skill Dmg') || text.includes('Skill')) skillDmg += val;
        else if (text.includes('Weapon Damage') || text.includes('Weapon Dmg') || text.includes('Wpn Dmg') || text.includes('Heavy Weapon Damage') || text.includes('Light Weapon Damage')) wpnDmg += val;
        else if (text.includes('Stun Resistance') || text.includes('Stun Res')) stunRes += val;
        else if (text.includes('Total Damage') || text.includes('Total Dmg')) totalDmg += val;
        else if (text.includes('Health Regen') || text.includes('HP Regen')) hpRegen += val;
        else if (text.includes('Debuff Duration') || text.includes('Debuff')) debuffDuration += Math.abs(val);
        else if (text.includes('Reduced Stamina Drain') || text.includes('Stamina Drain') || text.includes('Stamina Cost') || text.includes('Drain')) staminaDrain += Math.abs(val);
        else if (text.includes('Defense') || text.includes('Def')) defense += val;
        else if (text.includes('Max HP') || text.includes('HP')) maxHp += val;
        else if (text.includes('Max Stamina') || text.includes('Stamina')) staminaRegen += val;
        else if (text.includes('Max Posture') || text.includes('Posture Cap') || text.includes('Posture')) maxPosture += val;
        else if (text.includes('Stamina Regen')) staminaRegen += val;
        else if (text.includes('Fighting Style Dmg') || text.includes('Fighting Style Damage') || text.includes('Style Dmg') || text.includes('Style')) styleDmg += val;
        else if (text.includes('Evasion') || text.includes('Dodge Distance')) evasion += val;
        else if (text.includes('Ultimate Skill Dmg') || text.includes('Ultimate Skill Damage')) ultDmg += val;
        else if (text.includes('Elemental Damage') || text.includes('Elem Dmg') || text.includes('Elem')) elemDmg += val;
        else if (text.includes('Endurance') || text.includes('End')) endurance += val;
      });
    };

    // 1. Inherent Race Stat Bonus
    const activeRace = RACES_AND_CLANS_DATA.find(r => r.type === 'Race' && r.name === currentRace);
    if (activeRace && activeRace.stat_bonus) {
      applyEffectString(activeRace.stat_bonus);
    }

    // 2. Inherent Clan Stat Bonus
    const activeClan = RACES_AND_CLANS_DATA.find(c => c.type === 'Clan' && c.name === currentClan);
    if (activeClan && activeClan.stat_bonus) {
      applyEffectString(activeClan.stat_bonus);
    }

    // 3. Equipped Talent Cards Passive Effects
    equippedCards.forEach(c => {
      applyEffectString(c.effect);
    });

    return {
      str: stats.str,
      agi: stats.agi,
      vit: stats.vit,
      light: stats.light,
      med: stats.med,
      heavy: stats.heavy,
      gun: stats.gun,
      physDmg: Math.min(300, physDmg),
      magicDmg: Math.min(300, magicDmg),
      moveSpeed: Math.min(300, moveSpeed),
      cdr: Math.min(50, cdr),
      skillDmg: Math.min(300, skillDmg),
      wpnDmg: Math.min(300, wpnDmg),
      stunRes: Math.min(50, stunRes),
      totalDmg: Math.min(100, totalDmg),
      hpRegen: Math.min(50, hpRegen),
      debuffDuration: Math.min(50, debuffDuration),
      staminaDrain: Math.min(50, staminaDrain),
      defense: Math.min(100, defense),
      maxHp: Math.min(50, maxHp),
      maxStamina: Math.min(50, maxStamina),
      maxPosture: Math.min(50, maxPosture),
      staminaRegen: Math.min(50, staminaRegen),
      styleDmg: Math.min(100, styleDmg),
      evasion: Math.min(10, evasion),
      ultDmg: Math.min(100, ultDmg),
      elemDmg: Math.min(300, elemDmg),
      endurance: Math.min(50, endurance)
    };
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

    // Calculate & Display 26 Game Stats with +VAL% | +CAP% format
    const gStats = calculateGameStats();

    const setStatTextWithCap = (id, val, capVal, prefix = '+') => {
      const el = document.getElementById(id);
      if (el) {
        el.textContent = `${prefix}${val.toFixed(0)}% | ${prefix}${capVal}%`;
      }
    };

    const setCoreStatText = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = `${val} | 100`;
    };

    // Trainable Stats
    setCoreStatText('statStr', gStats.str);
    setCoreStatText('statAgi', gStats.agi);
    setCoreStatText('statVit', gStats.vit);
    setCoreStatText('statLht', gStats.light);
    setCoreStatText('statMed', gStats.med);
    setCoreStatText('statHvy', gStats.heavy);
    setCoreStatText('statGun', gStats.gun);

    // Derived Caps
    setStatTextWithCap('statMaxHp', gStats.maxHp, 50);
    setStatTextWithCap('statMaxStamina', gStats.maxStamina, 50);
    setStatTextWithCap('statMaxPosture', gStats.maxPosture, 50);
    setStatTextWithCap('statHpRegen', gStats.hpRegen, 50);
    setStatTextWithCap('statStaminaRegen', gStats.staminaRegen, 50);
    setStatTextWithCap('statEndurance', gStats.endurance, 50);
    setStatTextWithCap('statPhysDmg', gStats.physDmg, 300);
    setStatTextWithCap('statWpnDmg', gStats.wpnDmg, 300);
    setStatTextWithCap('statTotalDmg', gStats.totalDmg, 100);
    setStatTextWithCap('statSkillDmg', gStats.skillDmg, 300);
    setStatTextWithCap('statMagicDmg', gStats.magicDmg, 300);
    setStatTextWithCap('statStyleDmg', gStats.styleDmg, 100);
    setStatTextWithCap('statUltDmg', gStats.ultDmg, 100);
    setStatTextWithCap('statElemDmg', gStats.elemDmg, 300);
    setStatTextWithCap('statDefense', gStats.defense, 100);
    setStatTextWithCap('statMoveSpeed', gStats.moveSpeed, 300);
    setStatTextWithCap('statEvasion', gStats.evasion, 10);
    setStatTextWithCap('statCdr', gStats.cdr, 50, '-');
    setStatTextWithCap('statStunRes', gStats.stunRes, 50);
    setStatTextWithCap('statStaminaDrain', gStats.staminaDrain, 50, '-');
    setStatTextWithCap('statDebuffDuration', gStats.debuffDuration, 50, '-');

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
    if (raceSelect) raceSelect.value = 'Human';
    if (clanSelect) clanSelect.value = 'None';
    currentRace = 'Human';
    currentClan = 'None';
    if (raceBadge) raceBadge.textContent = 'HUMAN';
    if (clanBadge) clanBadge.textContent = 'NONE';
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

    const racePerk = RACES_AND_CLANS_DATA.find(r => r.type === 'Race' && r.name === currentRace);
    const clanPerk = RACES_AND_CLANS_DATA.find(c => c.type === 'Clan' && c.name === currentClan);

    let activeItems = [];

    if (racePerk && racePerk.stat_bonus) {
      activeItems.push({ name: `[RACE] ${racePerk.name}`, effect: racePerk.stat_bonus, category: 'Race Perk' });
    }
    if (clanPerk && clanPerk.stat_bonus) {
      activeItems.push({ name: `[CLAN] ${clanPerk.name}`, effect: clanPerk.stat_bonus, category: 'Clan Perk' });
    }

    equippedCards.forEach(c => {
      activeItems.push({ name: c.name, effect: c.effect, category: c.category });
    });

    if (buffsCountBadge) {
      buffsCountBadge.textContent = `${activeItems.length} BUFFS ACTIVE`;
    }

    if (activeItems.length === 0) {
      activeCardBuffsList.innerHTML = `<span style="color: var(--text-muted); font-size: 0.8rem;">No active card buffs. Add cards below to activate passive bonuses!</span>`;
      return;
    }

    activeCardBuffsList.innerHTML = '';
    activeItems.forEach(c => {
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
            updateUI();
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
        updateUI();
      });
      equippedCardsList.appendChild(tag);
    });
  }

  // Initial Sync
  syncSliders();

});
