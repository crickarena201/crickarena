import { createRouter, createWebHistory } from 'vue-router';
import CrickHub from '../pages/CrickHub.vue';
import HomePage from '../pages/HomePage.vue';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import ClubRegistration from '../pages/ClubRegistration.vue';
import ClubManagerDashboard from '../pages/ClubManagerDashboard.vue';
import AdminDashboard from '../pages/AdminDashboard.vue';
import ClubManagerPanel from '../pages/ClubManagerPanel.vue';
import ClubManagerOverview from '../pages/ClubManagerOverview.vue';
import ClubManagerTournaments from '../pages/ClubManagerTournaments.vue';
import ClubManagerPlayers from '../pages/ClubManagerPlayers.vue';
import ClubManagerCoaches from '../pages/ClubManagerCoaches.vue';
import ClubManagerMatches from '../pages/ClubManagerMatches.vue';
import ClubManagerProfile from '../pages/ClubManagerProfile.vue';
import ClubManagerTrainingSessions from '../pages/ClubManagerTrainingSessions.vue'; // Added import
import ClubsList from '../pages/ClubsList.vue';
import ClubDetails from '../pages/ClubDetails.vue';
import AdminTournament from '../pages/AdminTournament.vue';
import ClubTournaments from '../pages/ClubTournaments.vue';
import UserProfile from '../pages/UserProfile.vue';
import ForgotPassword from '../pages/ForgotPassword.vue';
import ResetPassword from '../pages/ResetPassword.vue';
import HelpCenter from '../pages/HelpCenter.vue';
import ContactUs from '../pages/ContactUs.vue';
import PrivacyPolicy from '../pages/PrivacyPolicy.vue';
import TermsOfService from '../pages/TermsOfService.vue';
import TournamentDetails from '../pages/TournamentDetails.vue';
import MatchDetails from '../pages/MatchDetails.vue';
import AdminMatchEditor from '../pages/AdminMatchEditor.vue';
import TournamentsList from '../pages/TournamentsList.vue';
import Search from '../pages/Search.vue';
import PlayerRegistration from '../pages/PlayerRegistration.vue';
import PlayerDashboard from '../pages/PlayerDashboard.vue';
import PlayerPanel from '../pages/PlayerPanel.vue';
// Import new player page components
import PlayerPanelDashboard from '../pages/PlayerPanelDashboard.vue';
import PlayerTraining from '../pages/player/Training.vue';
import PlayerApplications from '../pages/player/Applications.vue';
import PlayerProfile from '../pages/player/Profile.vue';
import PlayerGoals from '../pages/player/Goals.vue'; // Added import
import PlayerFeedback from '../pages/player/Feedback.vue'; // Added import
import PlayerMatches from '../pages/player/Matches.vue'; // Added import

import CoachRegistration from '../pages/CoachRegistration.vue';
import CoachDashboard from '../pages/CoachDashboard.vue';
import CoachPanel from '../pages/CoachPanel.vue';
// Import new coach page components
import CoachAnalytics from '../pages/coach/CoachAnalytics.vue';
import CoachTrainingPrograms from '../pages/coach/TrainingPrograms.vue';
import CoachSessions from '../pages/coach/Sessions.vue';
import CoachPlayers from '../pages/coach/Players.vue';
import CoachPlayerDetails from '../pages/coach/PlayerDetails.vue';
import CoachProfile from '../pages/coach/Profile.vue';
import CoachEditProfile from '../pages/coach/EditProfile.vue';
import CoachOverview from '../pages/coach/CoachOverview.vue'; // Added import
import CoachMatches from '../pages/coach/CoachMatches.vue'; // Added import
import CoachMessages from '../pages/coach/CoachMessages.vue'; // Added import
import CoachGoalSetting from '../pages/coach/GoalSetting.vue'; // Added import
import CoachFeedbackSystem from '../pages/coach/FeedbackSystem.vue'; // Added import

// Messaging components
import PlayerMessages from '../pages/player/Messages.vue';
import ClubManagerMessages from '../pages/ClubManagerMessages.vue';

// OTP verification removed
// import VerifyOtp from '../pages/VerifyOtp.vue';
import { useAuthStore } from '../store/auth';
import axios from 'axios';
import AdminPanel from '../pages/AdminPanel.vue';
import AdminOverview from '../pages/AdminOverview.vue';
import AdminPlayerManagement from '../components/admin/AdminPlayerManagement.vue';
import AdminCoachManagement from '../components/admin/AdminCoachManagement.vue';

const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

const routes = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/search', name: 'search', component: Search },
  { path: '/dashboard', redirect: { name: 'crickhub' } },
  { path: '/crickhub', name: 'crickhub', component: CrickHub, meta: { requiresAuth: true } },
  { path: '/clubs', name: 'clubs', component: ClubsList },
  { path: '/clubs/:id', name: 'club-details', component: ClubDetails, props: true },
  { path: '/club-registration', name: 'club-registration', component: ClubRegistration, meta: { requiresAuth: true, requiresClubManager: true } },
  // Club Manager panel layout with nested routes
  { 
    path: '/club-manager', 
    component: ClubManagerPanel, 
    meta: { requiresAuth: true, requiresClubManager: true },
    children: [
      { path: '', name: 'club-manager', component: ClubManagerOverview },
      { path: 'tournaments', name: 'club-manager-tournaments', component: ClubManagerTournaments },
      { path: 'players', name: 'club-manager-players', component: ClubManagerPlayers },
      { path: 'coaches', name: 'club-manager-coaches', component: ClubManagerCoaches },
      { path: 'matches', name: 'club-manager-matches', component: ClubManagerMatches },
      { path: 'training-sessions', name: 'club-manager-training-sessions', component: ClubManagerTrainingSessions }, // Added route
      { path: 'messages', name: 'club-manager-messages', component: ClubManagerMessages },
      { path: 'profile', name: 'club-manager-profile', component: ClubManagerProfile }
    ]
  },
  // Admin panel layout with nested routes
  { 
    path: '/admin', 
    component: AdminPanel, 
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      { path: '', name: 'admin', component: AdminOverview },
      { path: 'tournaments', name: 'admin-tournaments', component: AdminTournament },
      { path: 'clubs', name: 'admin-clubs', component: AdminDashboard },
      { path: 'players', name: 'admin-players', component: AdminPlayerManagement },
      { path: 'coaches', name: 'admin-coaches', component: AdminCoachManagement }
    ]
  },
  // Backward-compatible alias redirect (if any code still links to old path names)
  { path: '/admin/tournaments', redirect: { name: 'admin-tournaments' } },
  { path: '/club/tournaments', name: 'club-tournaments', component: ClubTournaments, meta: { requiresAuth: true, requiresClubManager: true } },
  { path: '/tournaments', name: 'tournaments', component: TournamentsList },
  { path: '/tournaments/:id', name: 'tournament-details', component: TournamentDetails, props: true },
  { path: '/profile', name: 'profile', component: UserProfile, meta: { requiresAuth: true } },
  { path: '/forgot-password', name: 'forgot-password', component: ForgotPassword },
  { path: '/reset-password/:token?', name: 'reset-password', component: ResetPassword },
  { path: '/help', name: 'help', component: HelpCenter },
  { path: '/contact', name: 'contact', component: ContactUs },
  { path: '/privacy', name: 'privacy', component: PrivacyPolicy },
  { path: '/terms', name: 'terms', component: TermsOfService },
  { path: '/explore', redirect: { name: 'home' } },

  // Public match details view
  { path: '/tournaments/:id/matches/:matchId', name: 'match-details', component: MatchDetails, props: true },
  // Admin match editor
  { path: '/admin/tournaments/:id/matches/:matchId', name: 'admin-match-editor', component: AdminMatchEditor, meta: { requiresAuth: true, requiresAdmin: true }, props: true },
  
  // Player routes
  { path: '/player/register', name: 'player-registration', component: PlayerRegistration, meta: { requiresAuth: true } },
  // Alias to support older links/components pointing to '/player/registration'
  { path: '/player/registration', redirect: { name: 'player-registration' } },
  { path: '/player/dashboard', name: 'player-dashboard', component: PlayerDashboard, meta: { requiresAuth: true, requiresPlayer: true } },
  // Player panel layout with nested routes
  { 
    path: '/player-panel', 
    component: PlayerPanel, 
    meta: { requiresAuth: true, requiresPlayer: true },
    children: [
      { path: '', name: 'player-panel', component: PlayerPanelDashboard },
      { path: 'training', name: 'player-panel-training', component: PlayerTraining },
      { path: 'applications', name: 'player-panel-applications', component: PlayerApplications },
      { path: 'messages', name: 'player-panel-messages', component: PlayerMessages },
      { path: 'goals', name: 'player-panel-goals', component: PlayerGoals }, // Player goals page
      { path: 'feedback', name: 'player-panel-feedback', component: PlayerFeedback }, // Player feedback page
      { path: 'matches', name: 'player-panel-matches', component: PlayerMatches }, // Player matches page
      { path: 'profile', name: 'player-panel-profile', component: PlayerProfile }
    ]
  },
  
  // Coach routes
  { path: '/coach/register', name: 'coach-registration', component: CoachRegistration, meta: { requiresAuth: true } },
  // Alias to support older links/components pointing to '/coach/registration'
  { path: '/coach/registration', redirect: { name: 'coach-registration' } },
  { path: '/coach/dashboard', name: 'coach-dashboard', component: CoachDashboard, meta: { requiresAuth: true, requiresCoach: true } },
  // Coach panel layout with nested routes
  { 
    path: '/coach-panel', 
    component: CoachPanel, 
    meta: { requiresAuth: true, requiresCoach: true },
    children: [
      { path: '', name: 'coach-panel', component: CoachOverview },
      { path: 'analytics', name: 'coach-panel-analytics', component: CoachAnalytics },
      { path: 'sessions', name: 'coach-panel-sessions', component: CoachSessions },
      { path: 'players', name: 'coach-panel-players', component: CoachPlayers },
      { path: 'players/:playerId', name: 'coach-panel-player-details', component: CoachPlayerDetails, props: true },
      { path: 'matches', name: 'coach-panel-matches', component: CoachMatches }, // Dedicated matches page
      { path: 'messages', name: 'coach-panel-messages', component: CoachMessages },
      { path: 'goals', name: 'coach-panel-goals', component: CoachGoalSetting }, // Goal setting page
      { path: 'feedback', name: 'coach-panel-feedback', component: CoachFeedbackSystem }, // Feedback system page
      { path: 'overview', name: 'coach-panel-overview', component: CoachOverview }, // Overview page
      { path: 'profile', name: 'coach-panel-profile', component: CoachProfile },
      { path: 'profile/edit', name: 'coach-panel-edit-profile', component: CoachEditProfile }
    ]
  },
  
  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register }
];

const router = createRouter({ history: createWebHistory(), routes });

// Auth guard: protect dashboard, redirect logged-in users away from login/register
router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();
  // Wait for auth store to initialize once after reload
  if (!auth.initialized) {
    try {
      await auth.init?.();
    } catch {}
  }
  const isAuthed = !!auth.user;

  const userRole = auth.userProfile?.role || 'user';
  const isAdmin = userRole === 'admin' || auth.user?.email === 'admin@crickarena.com';

  if (to.meta.requiresAuth && !isAuthed) {
    return next({ name: 'login' });
  }
  
  // Check admin access
  if (to.meta.requiresAdmin && isAuthed) {
    if (!isAdmin) {
      // Show notification instead of alert
      if (typeof window.$notify !== 'undefined') {
        window.$notify.error('Access Denied', 'Admin privileges required.');
      } else {
        alert('Access denied. Admin privileges required.');
      }
      return next({ name: 'crickhub' });
    }
  }

  // If heading to dashboard but user is admin, route them to admin panel
  if (isAuthed && isAdmin && (to.name === 'dashboard' || to.name === 'crickhub')) {
    return next({ name: 'admin' });
  }

  // Check club manager access for club registration
  if (to.meta.requiresClubManager && isAuthed) {
    const role = auth.userProfile?.role || 'public';
    if (role !== 'clubManager') {
      // Show notification instead of alert
      if (typeof window.$notify !== 'undefined') {
        window.$notify.error('Access Denied', 'Only Club Managers can register a club. Please register an account as Club Manager.');
      } else {
        alert('Only Club Managers can register a club. Please register an account as Club Manager.');
      }
      return next({ name: 'crickhub' });
    }
    
    // Check if club manager has registered and approved club
    if (to.path.startsWith('/club-manager')) {
      try {
        const response = await axios.get(`${API}/clubs/my-club`, { withCredentials: true });
        const club = response.data.club;
        
        // If club exists but is not approved, redirect to club registration
        if (club && club.status !== 'approved') {
          // Show notification instead of alert
          if (typeof window.$notify !== 'undefined') {
            window.$notify.warning('Club Registration Pending', 'Your club registration is pending approval. Please wait for admin approval.');
          } else {
            alert('Your club registration is pending approval. Please wait for admin approval.');
          }
          return next({ name: 'club-registration' });
        }
        
        // If no club exists, redirect to club registration
        if (!club) {
          // Show notification instead of alert
          if (typeof window.$notify !== 'undefined') {
            window.$notify.info('Club Registration Required', 'Please register your club first.');
          } else {
            alert('Please register your club first.');
          }
          return next({ name: 'club-registration' });
        }
      } catch (e) {
        // If no club exists (404), redirect to club registration
        if (e?.response?.status === 404) {
          // Show notification instead of alert
          if (typeof window.$notify !== 'undefined') {
            window.$notify.info('Club Registration Required', 'Please register your club first.');
          } else {
            alert('Please register your club first.');
          }
          return next({ name: 'club-registration' });
        }
        console.warn('Failed to check club status:', e?.response?.data || e.message);
      }
    }
  }

  // Check player access
  if (to.meta.requiresPlayer && isAuthed) {
    const role = auth.userProfile?.role || 'public';
    if (role !== 'player') {
      // Show notification instead of alert
      if (typeof window.$notify !== 'undefined') {
        window.$notify.error('Access Denied', 'Player access required. Please register as a player first.');
      } else {
        alert('Player access required. Please register as a player first.');
      }
      return next({ name: 'player-registration' });
    }

    // Check if player profile is completed
    try {
      const response = await axios.get(`${API}/players/profile`, { withCredentials: true });
      const player = response.data.player;
      if (!player || !player.profileCompleted) {
        // Show notification instead of alert
        if (typeof window.$notify !== 'undefined') {
          window.$notify.info('Profile Incomplete', 'Please complete your profile before accessing the player dashboard.');
        } else {
          alert('Please complete your profile before accessing the player dashboard.');
        }
        return next({ name: 'player-registration' });
      }
    } catch (e) {
      // If no profile exists, redirect to registration
      if (e?.response?.status === 404) {
        return next({ name: 'player-registration' });
      }
      console.warn('Failed to check player profile:', e?.response?.data || e.message);
    }
  }

  // Check coach access
  if (to.meta.requiresCoach && isAuthed) {
    const role = auth.userProfile?.role || 'public';
    if (role !== 'coach') {
      // Show notification instead of alert
      if (typeof window.$notify !== 'undefined') {
        window.$notify.error('Access Denied', 'Coach access required. Please register as a coach first.');
      } else {
        alert('Coach access required. Please register as a coach first.');
      }
      return next({ name: 'coach-registration' });
    }

    // Check if coach profile is completed
    try {
      const response = await axios.get(`${API}/coaches/profile`, { withCredentials: true });
      const coach = response.data.coach;
      if (!coach || !coach.profileCompleted) {
        // Show notification instead of alert
        if (typeof window.$notify !== 'undefined') {
          window.$notify.info('Profile Incomplete', 'Please complete your profile before accessing the coach dashboard.');
        } else {
          alert('Please complete your profile before accessing the coach dashboard.');
        }
        return next({ name: 'coach-registration' });
      }
    } catch (e) {
      // If no profile exists, redirect to registration
      if (e?.response?.status === 404) {
        return next({ name: 'coach-registration' });
      }
      console.warn('Failed to check coach profile:', e?.response?.data || e.message);
    }
  }

  // Prevent completed players from accessing registration page
  if (to.name === 'player-registration' && isAuthed) {
    const role = auth.userProfile?.role || 'public';
    if (role === 'player') {
      try {
        const response = await axios.get(`${API}/players/profile`, { withCredentials: true });
        const player = response.data.player;
        if (player && player.profileCompleted) {
          // Show notification instead of alert
          if (typeof window.$notify !== 'undefined') {
            window.$notify.info('Profile Completed', 'Your profile is already completed. Redirecting to dashboard.');
          } else {
            alert('Your profile is already completed. Redirecting to dashboard.');
          }
          return next({ name: 'player-dashboard' });
        }
      } catch (e) {
        // If error, allow access to registration
        console.warn('Failed to check player profile for registration access:', e?.response?.data || e.message);
      }
    }
  }

  // Prevent completed coaches from accessing registration page
  if (to.name === 'coach-registration' && isAuthed) {
    const role = auth.userProfile?.role || 'public';
    if (role === 'coach') {
      try {
        const response = await axios.get(`${API}/coaches/profile`, { withCredentials: true });
        const coach = response.data.coach;
        if (coach && coach.profileCompleted) {
          // Show notification instead of alert
          if (typeof window.$notify !== 'undefined') {
            window.$notify.info('Profile Completed', 'Your profile is already completed. Redirecting to dashboard.');
          } else {
            alert('Your profile is already completed. Redirecting to dashboard.');
          }
          return next({ name: 'coach-dashboard' });
        }
      } catch (e) {
        // If error, allow access to registration
        console.warn('Failed to check coach profile for registration access:', e?.response?.data || e.message);
      }
    }
  }

  // Prevent already-registered club managers from accessing registration page
  if (to.name === 'club-registration' && isAuthed) {
    const role = auth.userProfile?.role || 'public';
    if (role === 'clubManager') {
      try {
        const resp = await axios.get(`${API}/clubs/my-club`);
        if (resp?.data?.club) {
          // Show notification instead of alert
          if (typeof window.$notify !== 'undefined') {
            window.$notify.info('Club Already Registered', 'You have already registered a club.');
          } else {
            alert('You have already registered a club.');
          }
          return next({ name: 'club-manager' });
        }
      } catch (e) {
        // 404 means no club exists; allow access
        if (e?.response?.status !== 404) {
          console.warn('Club check failed:', e?.response?.data || e.message);
        }
      }
    }
  }
  
  if ((to.name === 'login' || to.name === 'register') && isAuthed) {
    // Send admins to admin panel; others to CrickHub
    return next({ name: isAdmin ? 'admin' : 'crickhub' });
  }
  // Optional: redirect authenticated users away from public landing if desired
  if (to.name === 'home' && isAuthed && from.name !== 'login') {
    // Keep landing page accessible when they explicitly navigate; remove this block if not needed.
  }
  next();
});

export default router;