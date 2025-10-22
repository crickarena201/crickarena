// Advanced Tournament Fixture Generation System V2
// Implements constraint-based scheduling with intelligent pairing and seeding

/**
 * Calculate flexibility score for a match
 * Lower score = less flexibility = should be scheduled first
 */
function calculateFlexibilityScore(match, availableDays, teamConstraints) {
  const homeAvailable = availableDays.get(match.home) || [];
  const awayAvailable = availableDays.get(match.away) || [];
  
  // Teams with fewer available days have lower flexibility
  return homeAvailable.length + awayAvailable.length;
}

/**
 * Check if a team can play on a specific date
 */
function canTeamPlay(teamId, date, lastPlayed, restDaysMin, teamBlackouts) {
  const dateKey = isoDate(date);
  
  // Check blackouts
  const blackouts = teamBlackouts.get?.(teamId) || teamBlackouts[teamId] || [];
  if (blackouts.includes(dateKey)) return false;
  
  // Check rest days
  const lastDate = lastPlayed.get(teamId);
  if (lastDate) {
    const daysSince = (date - new Date(lastDate)) / (24 * 60 * 60 * 1000);
    if (daysSince < restDaysMin) return false;
  }
  
  return true;
}

/**
 * Convert date to ISO string (YYYY-MM-DD)
 */
function isoDate(d) {
  const date = new Date(d);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
    .toISOString().slice(0, 10);
}

/**
 * Calculate available capacity considering all constraints
 */
export function calculateActualCapacity(opts) {
  const {
    startDate,
    endDate,
    venueSlots = [],
    teamBlackouts = new Map(),
    venueBlackouts = new Map(),
    restDaysMin = 1,
    teams = []
  } = opts;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  let totalSlots = 0;
  let availableSlots = 0;
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dayKey = isoDate(d);
    
    for (const v of venueSlots) {
      const venueName = v.name || String(v);
      const slots = Array.isArray(v.slotTimes) && v.slotTimes.length 
        ? v.slotTimes 
        : ['09:00'];
      
      totalSlots += slots.length;
      
      // Check venue blackouts
      const vb = venueBlackouts.get?.(venueName) || venueBlackouts[venueName] || [];
      if (!vb.includes(dayKey)) {
        availableSlots += slots.length;
      }
    }
  }
  
  const days = Math.ceil((end - start) / (24 * 60 * 60 * 1000)) + 1;
  const teamCount = teams.length;
  
  // Estimate realistic capacity considering rest days
  // Each team can play at most once every (restDaysMin + 1) days
  const maxMatchesPerTeam = Math.floor(days / (restDaysMin + 1));
  const teamCapacityLimit = (teamCount * maxMatchesPerTeam) / 2; // Divide by 2 as each match involves 2 teams
  
  return {
    totalSlots,
    availableSlots,
    teamCapacityLimit,
    effectiveCapacity: Math.min(availableSlots, teamCapacityLimit),
    days,
    venues: venueSlots.length
  };
}

/**
 * Validate fixture generation feasibility before attempting
 */
export function validateFixtureGeneration(requiredMatches, capacity, opts = {}) {
  const issues = [];
  const warnings = [];
  
  if (requiredMatches > capacity.effectiveCapacity) {
    issues.push({
      type: 'INSUFFICIENT_CAPACITY',
      message: `Need ${requiredMatches} matches but only ${capacity.effectiveCapacity} slots available`,
      required: requiredMatches,
      available: capacity.effectiveCapacity
    });
  }
  
  if (capacity.teamCapacityLimit < requiredMatches) {
    issues.push({
      type: 'REST_DAYS_CONSTRAINT',
      message: `Rest days constraint limits to ${capacity.teamCapacityLimit} matches`,
      suggestion: 'Reduce rest days or extend tournament duration'
    });
  }
  
  if (capacity.venues < 2 && requiredMatches > 10) {
    warnings.push({
      type: 'LIMITED_VENUES',
      message: 'Consider adding more venues for better scheduling flexibility'
    });
  }
  
  return {
    valid: issues.length === 0,
    issues,
    warnings,
    capacity
  };
}

/**
 * Generate round-robin pairings using circle method
 * Enhanced with home/away balancing
 */
export function generateRoundRobinPairings(teamIds, options = {}) {
  const ids = [...teamIds].map(String);
  const double = !!options.doubleRoundRobin;
  const list = ids.length % 2 === 0 ? ids : [...ids, '__BYE__'];
  const n = list.length;
  const rounds = n - 1;
  const half = n / 2;
  const schedule = [];
  
  // Track home/away balance
  const homeCount = new Map(ids.map(id => [id, 0]));
  
  let arr = [...list];
  for (let r = 0; r < rounds; r++) {
    const matches = [];
    for (let i = 0; i < half; i++) {
      const a = arr[i];
      const b = arr[n - 1 - i];
      if (a !== '__BYE__' && b !== '__BYE__') {
        // Balance home/away assignments
        const aHomeCount = homeCount.get(a) || 0;
        const bHomeCount = homeCount.get(b) || 0;
        
        let home, away;
        if (aHomeCount < bHomeCount) {
          home = a;
          away = b;
        } else if (bHomeCount < aHomeCount) {
          home = b;
          away = a;
        } else {
          // Equal counts, alternate based on round
          const homeFirst = (r + i) % 2 === 0;
          home = homeFirst ? a : b;
          away = homeFirst ? b : a;
        }
        
        matches.push({ home, away });
        homeCount.set(home, (homeCount.get(home) || 0) + 1);
      }
    }
    schedule.push({ round: r + 1, matches });
    // Rotate (keep arr[0] fixed)
    arr = [arr[0], arr[n - 1], ...arr.slice(1, n - 1)];
  }
  
  if (!double) return schedule;
  
  // Double RR: swap home/away
  const back = schedule.map((r, idx) => ({
    round: rounds + idx + 1,
    matches: r.matches.map(m => ({ home: m.away, away: m.home }))
  }));
  
  return [...schedule, ...back];
}

/**
 * Split teams into groups with seeded distribution
 * Serpentine distribution: 1→A, 2→B, 3→C, 4→C, 5→B, 6→A
 */
export function splitIntoGroupsSeeded(teamIds, groupCount, seeds = null) {
  const teams = [...teamIds].map(String);
  const numGroups = Math.max(1, groupCount);
  const groups = Array.from({ length: numGroups }, () => []);
  
  // If seeds provided, sort by seeds; otherwise use registration order
  const sorted = seeds 
    ? teams.sort((a, b) => (seeds[a] || 999) - (seeds[b] || 999))
    : teams;
  
  // Serpentine distribution
  let groupIdx = 0;
  let direction = 1; // 1 for forward, -1 for backward
  
  for (const team of sorted) {
    groups[groupIdx].push(team);
    
    groupIdx += direction;
    
    // Reverse direction at boundaries
    if (groupIdx >= numGroups) {
      groupIdx = numGroups - 1;
      direction = -1;
    } else if (groupIdx < 0) {
      groupIdx = 0;
      direction = 1;
    }
  }
  
  return groups;
}

/**
 * Generate knockout bracket with proper seeding
 */
export function generateKnockoutBracketSeeded(teamIds, seeds = null) {
  const teams = [...teamIds].map(String);
  
  // Sort by seeds if provided
  const sorted = seeds
    ? teams.sort((a, b) => (seeds[a] || 999) - (seeds[b] || 999))
    : teams;
  
  // Pad to next power of two
  const nextPow2 = 1 << Math.ceil(Math.log2(Math.max(1, sorted.length)));
  const padded = [...sorted];
  while (padded.length < nextPow2) padded.push('__BYE__');
  
  // Standard tournament seeding: 1v8, 4v5, 2v7, 3v6 for 8 teams
  const pairs = [];
  for (let i = 0; i < padded.length / 2; i++) {
    const seed1 = i;
    const seed2 = padded.length - 1 - i;
    
    const a = padded[seed1];
    const b = padded[seed2];
    
    if (a !== '__BYE__' && b !== '__BYE__') {
      pairs.push({ 
        home: a, 
        away: b,
        seed1: seed1 + 1,
        seed2: seed2 + 1
      });
    } else if (a !== '__BYE__') {
      // Bye - team advances automatically
      pairs.push({ 
        home: a, 
        away: null,
        seed1: seed1 + 1,
        isBye: true
      });
    } else if (b !== '__BYE__') {
      pairs.push({ 
        home: b, 
        away: null,
        seed2: seed2 + 1,
        isBye: true
      });
    }
  }
  
  return [{
    round: 1,
    roundLabel: getRoundLabel(pairs.length),
    stage: 'Knockout',
    matches: pairs.filter(p => !p.isBye)
  }];
}

/**
 * Get proper round label based on matches count
 */
function getRoundLabel(matchCount) {
  if (matchCount === 1) return 'Final';
  if (matchCount === 2) return 'Semi-Final';
  if (matchCount === 4) return 'Quarter-Final';
  if (matchCount === 8) return 'Round of 16';
  return `Round of ${matchCount * 2}`;
}

/**
 * Advanced scheduling with constraint propagation and intelligent time slot allocation
 * Minimizes parallel matches unless tournament days are limited
 */
export function scheduleMatchesAdvanced(rounds, opts) {
  const {
    startDate,
    endDate,
    venueSlots = [],
    restDaysMin = 1,
    teamBlackouts = new Map(),
    venueBlackouts = new Map(),
    respectRoundOrder = true,
    prioritizeWeekends = false,
    matchTimeSlots = ['09:00', '14:00', '18:00'], // Default time slots
    allowParallelMatches = false,
    maxParallelMatches = 1
  } = opts || {};
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Track last played date for each team
  const lastPlayed = new Map();
  
  // Track slot usage: "YYYY-MM-DD|Time" -> count of matches
  const timeSlotUsage = new Map();
  
  // Track venue usage per day and time: "YYYY-MM-DD|VenueName|Time" -> true
  const venueUsage = new Map();
  
  const scheduled = [];
  
  // Flatten all matches with metadata
  const allMatches = [];
  rounds.forEach((r, idx) => {
    r.matches.forEach(m => {
      allMatches.push({
        ...m,
        _round: r.round || (idx + 1),
        _roundLabel: r.roundLabel || `Round ${r.round || idx + 1}`,
        _stage: r.stage || 'Group',
        _group: r.group || '',
        _roundIndex: idx
      });
    });
  });
  
  // Calculate total available capacity
  const totalDays = Math.ceil((end - start) / (24 * 60 * 60 * 1000)) + 1;
  const totalMatches = allMatches.length;
  const venues = venueSlots.length || 1;
  
  // Extract actual time slots from venueSlots or use matchTimeSlots parameter
  let actualTimeSlots = matchTimeSlots;
  if (venueSlots.length > 0 && venueSlots[0].slotTimes && venueSlots[0].slotTimes.length > 0) {
    actualTimeSlots = venueSlots[0].slotTimes;
  }
  
  // Ensure we have valid time slots (fallback to defaults if empty)
  if (!actualTimeSlots || actualTimeSlots.length === 0) {
    actualTimeSlots = ['09:00', '14:00', '18:00'];
  }
  
  const timeSlotsPerDay = actualTimeSlots.length;
  const maxCapacity = totalDays * timeSlotsPerDay * venues;
  
  // Determine if we need parallel matches (limited days scenario)
  const needsParallelMatches = totalMatches > (totalDays * timeSlotsPerDay);
  const effectiveMaxParallel = (allowParallelMatches || needsParallelMatches) ? maxParallelMatches : 1;
  
  console.log('Scheduling Strategy:', {
    totalMatches,
    totalDays,
    timeSlotsPerDay,
    venues,
    maxCapacity,
    needsParallelMatches,
    effectiveMaxParallel
  });
  
  // Sort matches by priority
  if (respectRoundOrder) {
    allMatches.sort((a, b) => {
      if (a._roundIndex !== b._roundIndex) return a._roundIndex - b._roundIndex;
      return 0;
    });
  }
  
  // Try to schedule each match
  for (const match of allMatches) {
    let matchScheduled = false;
    
    // Try each day in the tournament window
    for (let d = new Date(start); d <= end && !matchScheduled; d.setDate(d.getDate() + 1)) {
      const dayKey = isoDate(d);
      const isWeekend = d.getDay() === 0 || d.getDay() === 6;
      
      // Skip if teams can't play today
      if (!canTeamPlay(match.home, d, lastPlayed, restDaysMin, teamBlackouts)) continue;
      if (!canTeamPlay(match.away, d, lastPlayed, restDaysMin, teamBlackouts)) continue;
      
      // Try each configured time slot
      for (const time of actualTimeSlots) {
        if (matchScheduled) break;
        
        const timeSlotKey = `${dayKey}|${time}`;
        const currentSlotUsage = timeSlotUsage.get(timeSlotKey) || 0;
        
        // Check if we can add another match to this time slot
        if (currentSlotUsage >= effectiveMaxParallel) {
          continue; // This time slot is full
        }
        
        // Try to find an available venue for this day/time
        let assignedVenue = null;
        
        if (venueSlots.length > 0) {
          for (const v of venueSlots) {
            const venueName = v.name || String(v);
            const slotKey = `${dayKey}|${venueName}|${time}`;
            
            // Check venue blackouts
            const vb = venueBlackouts.get?.(venueName) || venueBlackouts[venueName] || [];
            if (vb.includes(dayKey)) continue;
            
            // Check if this specific venue+time slot is available
            if (venueUsage.has(slotKey)) continue;
            
            // Found available venue!
            assignedVenue = venueName;
            venueUsage.set(slotKey, true);
            break;
          }
        } else {
          // No specific venues configured, use default
          assignedVenue = 'Main Ground';
        }
        
        if (assignedVenue) {
          // Successfully scheduled!
          scheduled.push({
            home: match.home,
            away: match.away,
            date: new Date(d),
            time,
            venue: assignedVenue,
            round: match._roundLabel,
            stage: match._stage,
            group: match._group,
            isWeekend
          });
          
          // Update tracking
          lastPlayed.set(match.home, dayKey);
          lastPlayed.set(match.away, dayKey);
          timeSlotUsage.set(timeSlotKey, currentSlotUsage + 1);
          
          matchScheduled = true;
        }
      }
    }
    
    if (!matchScheduled) {
      throw new Error(`Failed to schedule match ${match.home} vs ${match.away}. Insufficient capacity or constraints too tight.`);
    }
  }
  
  // Log scheduling statistics
  const parallelMatchCount = Array.from(timeSlotUsage.values()).filter(count => count > 1).length;
  const stats = {
    totalScheduled: scheduled.length,
    timeSlotsWithParallelMatches: parallelMatchCount,
    utilizationRate: (scheduled.length / maxCapacity * 100).toFixed(1) + '%'
  };
  
  console.log('Scheduling Complete:', stats);
  
  return {
    ok: true,
    matches: scheduled,
    stats
  };
}

/**
 * Generate fixtures for groups + knockout format
 */
export function generateGroupsWithKnockout(teamIds, options = {}) {
  const {
    groupCount = 2,
    qualifyPerGroup = 2,
    doubleRoundRobin = false,
    seeds = null
  } = options;
  
  // Split into groups with seeding
  const groups = splitIntoGroupsSeeded(teamIds, groupCount, seeds);
  const rounds = [];
  
  // Generate group stage fixtures
  groups.forEach((groupTeams, idx) => {
    const groupName = String.fromCharCode(65 + idx); // A, B, C, etc.
    const groupRounds = generateRoundRobinPairings(groupTeams, { doubleRoundRobin });
    
    groupRounds.forEach(r => {
      rounds.push({
        round: r.round,
        roundLabel: `Group ${groupName} - Round ${r.round}`,
        stage: 'Group',
        group: `Group ${groupName}`,
        matches: r.matches
      });
    });
  });
  
  return {
    rounds,
    groups: groups.map((g, idx) => ({
      name: `Group ${String.fromCharCode(65 + idx)}`,
      teams: g
    })),
    qualifyPerGroup
  };
}

export default {
  calculateActualCapacity,
  validateFixtureGeneration,
  generateRoundRobinPairings,
  splitIntoGroupsSeeded,
  generateKnockoutBracketSeeded,
  scheduleMatchesAdvanced,
  generateGroupsWithKnockout
};
