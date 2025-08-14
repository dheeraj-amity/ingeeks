export interface FinishedProject { title: string; desc: string; link?: string }
export interface ProgressProject { title: string; desc: string; progress: number }

export const finishedProjects: FinishedProject[] = [
  { title:'Pharmacy Inventory Management App', desc:'Stock control, expiry tracking, purchase automation, analytics.'},
  { title:'Cloud Sales Analytics', desc:'Revenue dashboards, forecasting, pipeline health.', link:'https://salesanalyst.ingeeks.in/'},
];

export const inProgressProjects: ProgressProject[] = [
  { title:'Smart Farmer Assistant App', progress:60, desc:'AI agronomy support, weather alerts, yield optimization.'},
  { title:'Learning Management System', progress:40, desc:'Adaptive assessments, gamification, analytics.'},
  { title:'Fleet Tracking & IoT Platform', progress:55, desc:'Real-time tracking, geofencing, predictive maintenance.'},
];
