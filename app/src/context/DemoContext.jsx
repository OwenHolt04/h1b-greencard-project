import { createContext, useContext, useReducer, useCallback, useMemo } from 'react';

const DemoContext = createContext(null);

const TOTAL_SCENES = 5;

const defaultState = {
  currentScreen: 'overview',
  currentRole: 'applicant',
  validationRun: false,
  validationRunning: false,
  issues: {
    'employer-name': false,
    'soc-wage': false,
    'travel-history': false,
  },
  syncing: false,
  employerNameFixed: false,
  stageAdvanced: false,
  overviewMode: 'future',
  alertFocus: null, // 'deadline' for Beat 7 focused view
  documentChecks: {}, // key: "stageNum-docIdx" => boolean override
  openFormCode: null, // null or form code string like 'I-485'
  presentationMode: false,
  currentScene: 0,
};

function getInitialState() {
  if (typeof window === 'undefined') return defaultState;
  const params = new URLSearchParams(window.location.search);
  const state = { ...defaultState, issues: { ...defaultState.issues }, documentChecks: {} };

  const screen = params.get('screen');
  if (screen && ['overview', 'dashboard', 'intake', 'roles', 'impact'].includes(screen)) {
    state.currentScreen = screen;
  }

  const role = params.get('role');
  if (role && ['applicant', 'employer', 'attorney'].includes(role)) {
    state.currentRole = role;
  }

  if (params.get('validated') === 'true') {
    state.validationRun = true;
  }

  const fixed = params.get('fixed');
  if (fixed) {
    fixed.split(',').forEach((id) => {
      if (state.issues.hasOwnProperty(id)) {
        state.issues[id] = true;
        if (id === 'employer-name') state.employerNameFixed = true;
      }
    });
  }

  // Overview mode from URL: ?mode=current
  const mode = params.get('mode');
  if (mode === 'current') {
    state.overviewMode = 'current';
  }

  // Alert focus from URL: ?alert=deadline (Beat 7)
  const alert = params.get('alert');
  if (alert === 'deadline') {
    state.alertFocus = 'deadline';
  }

  // Presentation mode from URL: ?mode=presentation
  if (params.get('mode') === 'presentation') {
    state.presentationMode = true;
  }

  // Scene from URL: ?scene=3
  const scene = params.get('scene');
  if (scene !== null) {
    const sceneNum = parseInt(scene, 10);
    if (!isNaN(sceneNum) && sceneNum >= 0 && sceneNum < TOTAL_SCENES) {
      state.currentScene = sceneNum;
    }
  }

  return state;
}

const initialState = getInitialState();

function demoReducer(state, action) {
  switch (action.type) {
    case 'NAVIGATE':
      return { ...state, currentScreen: action.payload };
    case 'SWITCH_ROLE':
      return { ...state, currentRole: action.payload };
    case 'START_VALIDATION':
      return { ...state, validationRunning: true };
    case 'COMPLETE_VALIDATION':
      return { ...state, validationRunning: false, validationRun: true };
    case 'RESOLVE_ISSUE':
      return {
        ...state,
        issues: { ...state.issues, [action.payload]: true },
        syncing: true,
        ...(action.payload === 'employer-name' ? { employerNameFixed: true } : {}),
      };
    case 'SYNC_COMPLETE':
      return { ...state, syncing: false };
    case 'ADVANCE_STAGE':
      return { ...state, stageAdvanced: true };
    case 'SET_OVERVIEW_MODE':
      return { ...state, overviewMode: action.payload };
    case 'SET_ALERT_FOCUS':
      return { ...state, alertFocus: action.payload };
    case 'TOGGLE_DOCUMENT': {
      const key = action.payload.key;
      const wasChecked = action.payload.wasChecked;
      return {
        ...state,
        documentChecks: { ...state.documentChecks, [key]: !wasChecked },
      };
    }
    case 'OPEN_FORM':
      return { ...state, openFormCode: action.payload };
    case 'CLOSE_FORM':
      return { ...state, openFormCode: null };
    case 'NEXT_SCENE':
      return { ...state, currentScene: Math.min(state.currentScene + 1, TOTAL_SCENES - 1) };
    case 'PREV_SCENE':
      return { ...state, currentScene: Math.max(state.currentScene - 1, 0) };
    case 'GO_TO_SCENE':
      return { ...state, currentScene: Math.max(0, Math.min(action.payload, TOTAL_SCENES - 1)) };
    case 'SET_PRESENTATION_MODE':
      return { ...state, presentationMode: action.payload };
    case 'RESET_DEMO':
      return { ...defaultState, issues: { ...defaultState.issues }, documentChecks: {}, alertFocus: null, presentationMode: state.presentationMode, currentScene: 0 };
    default:
      return state;
  }
}

export function computeReadiness(issues) {
  let score = 95;
  if (!issues['employer-name']) score -= 8;
  if (!issues['soc-wage']) score -= 10;
  if (!issues['travel-history']) score -= 5;
  return score;
}

export function getCaseHealth(issues) {
  const unresolvedHigh = !issues['soc-wage'];
  if (unresolvedHigh) return 'Needs Review';
  return 'On Track';
}

export function DemoProvider({ children }) {
  const [state, dispatch] = useReducer(demoReducer, initialState);

  const navigate = useCallback((screen) => dispatch({ type: 'NAVIGATE', payload: screen }), []);
  const switchRole = useCallback((role) => dispatch({ type: 'SWITCH_ROLE', payload: role }), []);
  const runValidation = useCallback(() => {
    dispatch({ type: 'START_VALIDATION' });
    setTimeout(() => dispatch({ type: 'COMPLETE_VALIDATION' }), 1200);
  }, []);
  const resolveIssue = useCallback((issueId) => {
    dispatch({ type: 'RESOLVE_ISSUE', payload: issueId });
    setTimeout(() => dispatch({ type: 'SYNC_COMPLETE' }), 800);
  }, []);
  const advanceStage = useCallback(() => dispatch({ type: 'ADVANCE_STAGE' }), []);
  const setOverviewMode = useCallback((mode) => dispatch({ type: 'SET_OVERVIEW_MODE', payload: mode }), []);
  const setAlertFocus = useCallback((focus) => dispatch({ type: 'SET_ALERT_FOCUS', payload: focus }), []);
  const toggleDocument = useCallback((key, wasChecked) => dispatch({ type: 'TOGGLE_DOCUMENT', payload: { key, wasChecked } }), []);
  const openForm = useCallback((code) => dispatch({ type: 'OPEN_FORM', payload: code }), []);
  const closeForm = useCallback(() => dispatch({ type: 'CLOSE_FORM' }), []);
  const nextScene = useCallback(() => dispatch({ type: 'NEXT_SCENE' }), []);
  const prevScene = useCallback(() => dispatch({ type: 'PREV_SCENE' }), []);
  const goToScene = useCallback((n) => dispatch({ type: 'GO_TO_SCENE', payload: n }), []);
  const setPresentationMode = useCallback((on) => dispatch({ type: 'SET_PRESENTATION_MODE', payload: on }), []);
  const resetDemo = useCallback(() => dispatch({ type: 'RESET_DEMO' }), []);

  const readinessScore = useMemo(() => computeReadiness(state.issues), [state.issues]);
  const caseHealth = useMemo(() => getCaseHealth(state.issues), [state.issues]);
  const unresolvedCount = useMemo(() => Object.values(state.issues).filter((v) => !v).length, [state.issues]);

  const value = useMemo(
    () => ({
      ...state,
      readinessScore, caseHealth, unresolvedCount,
      navigate, switchRole, runValidation, resolveIssue,
      advanceStage, setOverviewMode, setAlertFocus, toggleDocument,
      openForm, closeForm, resetDemo,
      nextScene, prevScene, goToScene, setPresentationMode,
    }),
    [state, readinessScore, caseHealth, unresolvedCount,
     navigate, switchRole, runValidation, resolveIssue,
     advanceStage, setOverviewMode, setAlertFocus, toggleDocument,
     openForm, closeForm, resetDemo,
     nextScene, prevScene, goToScene, setPresentationMode]
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) throw new Error('useDemo must be used within DemoProvider');
  return context;
}
