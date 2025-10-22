// ⚠️ DEPRECATED - DO NOT USE
// This file contains the old fixture generation system (V1)
// It has been replaced by fixturesV2.js with the following improvements:
//
// 1. Fixed critical bug: Global timeslot lock prevented multiple venues from using same time
// 2. Added pre-validation with capacity calculation
// 3. Intelligent seeding (serpentine group distribution, proper knockout seeding)
// 4. Home/away balancing for round-robin
// 5. Enhanced constraint handling
//
// Migration: Use fixturesV2.js functions instead
// - generateRoundRobinPairings() → same name in V2
// - generateKnockoutBracket() → generateKnockoutBracketSeeded()
// - scheduleRounds() → scheduleMatchesAdvanced()
//
// For documentation, see: FIXTURE_GENERATION_V2.md

console.warn('⚠️ WARNING: fixtures.js is DEPRECATED. Use fixturesV2.js instead.');

export function generateRoundRobinPairings(teamIds, options = {}) {
  throw new Error('DEPRECATED: Use fixturesV2.js → generateRoundRobinPairings()');
}

export function splitIntoGroups(teamIds, groupCount) {
  throw new Error('DEPRECATED: Use fixturesV2.js → splitIntoGroupsSeeded()');
}

export function generateKnockoutBracket(teamIds) {
  throw new Error('DEPRECATED: Use fixturesV2.js → generateKnockoutBracketSeeded()');
}

export function generateGroupsPlusKnockout(teamIds, groupCount = 2, qualifyPerGroup = 2, options = {}) {
  throw new Error('DEPRECATED: Use fixturesV2.js → generateGroupsWithKnockout()');
}

export function estimateCapacity(startDate, endDate, venueSlots = []) {
  throw new Error('DEPRECATED: Use fixturesV2.js → calculateActualCapacity()');
}

export function scheduleRounds(rounds, opts) {
  throw new Error('DEPRECATED: Use fixturesV2.js → scheduleMatchesAdvanced()');
}

export default {
  generateRoundRobinPairings,
  splitIntoGroups,
  generateKnockoutBracket,
  generateGroupsPlusKnockout,
  estimateCapacity,
  scheduleRounds
};
