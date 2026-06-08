'use client'
import { useState, JSX } from "react";

// Types
interface Student {
  id: number;
  email: string;
  password: string;
  name: string;
  matric: string;
  department: string;
  level: string;
  avatar: string;
}

interface Course {
  code: string;
  title: string;
  credits: number;
  department: string;
  lecturer: string;
}

interface Result {
  code: string;
  testScore: number;
  examScore: number;
}

interface Grade {
  letter: string;
  point: number;
}

type ResultsData = Record<string, Record<string, Result[]>>;
type RegistrationsData = Record<string, Record<string, string[]>>;

// Seeded students (in a real app this would be a DB)
const INITIAL_STUDENTS: Student[] = [
  { id: 1, email: "alice@university.edu", password: "pass123", name: "Alice Johnson", matric: "U2021/001", department: "Computer Science", level: "300", avatar: "AJ" },
  { id: 2, email: "bob@university.edu", password: "pass123", name: "Bob Mensah", matric: "U2021/042", department: "Electrical Engineering", level: "200", avatar: "BM" },
];

const ALL_COURSES: Course[] = [
  { code: "CSC301", title: "Data Structures & Algorithms", credits: 3, department: "Computer Science", lecturer: "Dr. Emmanuel Osei" },
  { code: "CSC303", title: "Operating Systems", credits: 3, department: "Computer Science", lecturer: "Prof. Akosua Boateng" },
  { code: "CSC305", title: "Database Management Systems", credits: 3, department: "Computer Science", lecturer: "Dr. Kwame Asante" },
  { code: "CSC307", title: "Computer Networks", credits: 2, department: "Computer Science", lecturer: "Dr. Ama Darko" },
  { code: "MTH301", title: "Numerical Methods", credits: 3, department: "Mathematics", lecturer: "Prof. Isaac Mensah" },
  { code: "MTH303", title: "Probability & Statistics", credits: 2, department: "Mathematics", lecturer: "Dr. Abena Frimpong" },
  { code: "ENG301", title: "Technical Writing", credits: 2, department: "General Studies", lecturer: "Mrs. Grace Owusu" },
  { code: "CSC309", title: "Software Engineering", credits: 3, department: "Computer Science", lecturer: "Dr. Kofi Adu" },
  { code: "CSC311", title: "Compiler Design", credits: 3, department: "Computer Science", lecturer: "Prof. Yaw Boateng" },
  { code: "EEE301", title: "Circuit Theory", credits: 3, department: "Electrical Engineering", lecturer: "Dr. Nana Adjei" },
  { code: "EEE303", title: "Electronics I", credits: 3, department: "Electrical Engineering", lecturer: "Dr. Mabel Owusu" },
  { code: "MTH305", title: "Linear Algebra", credits: 3, department: "Mathematics", lecturer: "Dr. Samuel Appiah" },
  { code: "PHY301", title: "Modern Physics", credits: 2, department: "Physics", lecturer: "Prof. Cecilia Otieno" },
  { code: "CSC313", title: "Artificial Intelligence", credits: 3, department: "Computer Science", lecturer: "Dr. Bernard Asare" },
  { code: "HUM301", title: "African Studies", credits: 1, department: "Humanities", lecturer: "Dr. Abena Konadu" },
];

const SEED_RESULTS: ResultsData = {
  "1": {
    "2023-First": [
      { code: "CSC301", testScore: 28, examScore: 62 },
      { code: "MTH301", testScore: 22, examScore: 55 },
      { code: "ENG301", testScore: 18, examScore: 68 },
      { code: "CSC303", testScore: 25, examScore: 58 },
    ],
    "2023-Second": [
      { code: "CSC305", testScore: 27, examScore: 65 },
      { code: "CSC307", testScore: 24, examScore: 60 },
      { code: "MTH303", testScore: 20, examScore: 52 },
    ],
    "2024-First": [
      { code: "CSC309", testScore: 29, examScore: 70 },
      { code: "CSC311", testScore: 21, examScore: 56 },
      { code: "PHY301", testScore: 26, examScore: 63 },
    ],
  },
  "2": {
    "2023-First": [
      { code: "EEE301", testScore: 26, examScore: 61 },
      { code: "EEE303", testScore: 23, examScore: 57 },
      { code: "MTH305", testScore: 19, examScore: 50 },
    ],
  },
};

const SEED_REGISTRATIONS: RegistrationsData = {
  "1": { "2024-Second": ["CSC313", "MTH303", "HUM301", "ENG301"] },
  "2": {
    "2023-Second": ["EEE303", "MTH301", "PHY301"],
    "2024-First": ["EEE301", "MTH305", "CSC307"],
  },
};

const DEPARTMENTS = [
  "Computer Science", "Electrical Engineering", "Mathematics",
  "Physics", "Civil Engineering", "Mechanical Engineering", "Chemistry",
];
const LEVELS = ["100", "200", "300", "400", "500"];

function gradeFromTotal(total: number): Grade {
  if (total >= 70) return { letter: "A", point: 4.0 };
  if (total >= 60) return { letter: "B", point: 3.0 };
  if (total >= 50) return { letter: "C", point: 2.0 };
  if (total >= 45) return { letter: "D", point: 1.0 };
  return { letter: "F", point: 0.0 };
}

function initials(name: string): string {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

const styles = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }
body, #root { font-family: 'DM Sans', sans-serif; min-height: 100vh; background: #f0ede8; color: #1a1814; }
.app { min-height: 100vh; display: flex; flex-direction: column; }

/* AUTH PAGES (login, signup, forgot) */
.auth-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #1a1814; position: relative; overflow: hidden; padding: 2rem; }
.auth-bg { position: absolute; inset: 0; background: radial-gradient(ellipse at 20% 50%, #2d2820 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, #1e2a1e 0%, transparent 60%); }
.auth-card { position: relative; background: #f5f2ed; border-radius: 2px; padding: 2.5rem; width: 100%; max-width: 460px; }
.auth-logo { font-family: 'DM Serif Display', serif; font-size: 28px; color: #1a1814; margin-bottom: 0.25rem; }
.auth-sub { font-size: 13px; color: #7a7570; margin-bottom: 2rem; letter-spacing: 0.5px; text-transform: uppercase; }
.auth-label { display: block; font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: #7a7570; margin-bottom: 6px; }
.auth-input { width: 100%; border: 1px solid #d4cfc8; background: #fff; padding: 11px 14px; font-size: 14px; font-family: 'DM Sans', sans-serif; border-radius: 2px; outline: none; transition: border-color 0.2s; color: #1a1814; }
.auth-input:focus { border-color: #1a1814; }
.auth-select { width: 100%; border: 1px solid #d4cfc8; background: #fff; padding: 11px 14px; font-size: 14px; font-family: 'DM Sans', sans-serif; border-radius: 2px; outline: none; color: #1a1814; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%237a7570' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; }
.auth-field { margin-bottom: 1rem; }
.auth-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.auth-btn { width: 100%; background: #1a1814; color: #f5f2ed; border: none; padding: 13px; font-size: 14px; font-weight: 500; font-family: 'DM Sans', sans-serif; cursor: pointer; border-radius: 2px; letter-spacing: 0.5px; transition: background 0.2s; margin-top: 0.75rem; }
.auth-btn:hover { background: #2d2820; }
.auth-err { background: #fdf0ee; border: 1px solid #f5c4b3; color: #993c1d; padding: 10px 14px; border-radius: 2px; font-size: 13px; margin-bottom: 1rem; }
.auth-success { background: #eaf3de; border: 1px solid #c0dd97; color: #3b6d11; padding: 10px 14px; border-radius: 2px; font-size: 13px; margin-bottom: 1rem; }
.auth-hint { margin-top: 1.25rem; padding-top: 1.25rem; border-top: 1px solid #e8e4de; font-size: 12px; color: #9a9590; }
.auth-hint code { background: #ede9e3; padding: 2px 6px; border-radius: 2px; font-size: 11px; }
.auth-link { background: none; border: none; color: #a07830; font-size: 13px; font-family: 'DM Sans', sans-serif; cursor: pointer; text-decoration: underline; padding: 0; }
.auth-link:hover { color: #7a5820; }
.auth-toggle { margin-top: 1rem; font-size: 13px; color: #7a7570; text-align: center; }

/* NAVBAR */
.navbar { background: #1a1814; color: #f5f2ed; padding: 0 2rem; display: flex; align-items: center; justify-content: space-between; height: 60px; position: sticky; top: 0; z-index: 100; }
.navbar-brand { font-family: 'DM Serif Display', serif; font-size: 20px; color: #f5f2ed; }
.navbar-nav { display: flex; gap: 0; }
.nav-link { background: none; border: none; color: #a0998f; padding: 0 1.25rem; height: 60px; font-size: 13px; font-family: 'DM Sans', sans-serif; cursor: pointer; letter-spacing: 0.3px; border-bottom: 2px solid transparent; transition: color 0.2s, border-color 0.2s; display: flex; align-items: center; gap: 6px; }
.nav-link:hover { color: #f5f2ed; }
.nav-link.active { color: #f5f2ed; border-bottom-color: #c8a96e; }
.navbar-user { display: flex; align-items: center; gap: 10px; }
.avatar-sm { width: 32px; height: 32px; border-radius: 50%; background: #c8a96e; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 600; color: #1a1814; }
.logout-btn { background: none; border: 1px solid #3a3630; color: #a0998f; padding: 6px 12px; font-size: 12px; font-family: 'DM Sans', sans-serif; cursor: pointer; border-radius: 2px; transition: all 0.2s; }
.logout-btn:hover { border-color: #a0998f; color: #f5f2ed; }

/* MAIN */
.main { flex: 1; padding: 2rem; max-width: 1100px; margin: 0 auto; width: 100%; }

/* HOME */
.hero-card { background: #1a1814; color: #f5f2ed; border-radius: 4px; padding: 2.5rem; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 2rem; }
.hero-avatar { width: 80px; height: 80px; border-radius: 50%; background: #c8a96e; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 600; color: #1a1814; flex-shrink: 0; }
.hero-name { font-family: 'DM Serif Display', serif; font-size: 26px; color: #f5f2ed; margin-bottom: 4px; }
.hero-detail { font-size: 13px; color: #a0998f; margin-bottom: 3px; }
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
.stat-card { background: #fff; border-radius: 4px; border: 1px solid #e8e4de; padding: 1.25rem 1.5rem; }
.stat-label { font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: #9a9590; margin-bottom: 6px; }
.stat-value { font-size: 28px; font-weight: 300; color: #1a1814; }
.stat-value.gold { color: #a07830; }
.info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.info-card { background: #fff; border-radius: 4px; border: 1px solid #e8e4de; padding: 1.25rem 1.5rem; }
.info-title { font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: #9a9590; margin-bottom: 1rem; }
.info-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #f0ede8; font-size: 13px; }
.info-row:last-child { border-bottom: none; }
.info-key { color: #7a7570; }
.info-val { font-weight: 500; }

/* REGISTRATION */
.page-header { margin-bottom: 1.5rem; }
.page-title { font-family: 'DM Serif Display', serif; font-size: 28px; color: #1a1814; margin-bottom: 4px; }
.page-sub { font-size: 13px; color: #7a7570; }
.semester-bar { background: #fff; border: 1px solid #e8e4de; border-radius: 4px; padding: 1rem 1.5rem; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap; }
.select-group { display: flex; align-items: center; gap: 8px; }
.select-label { font-size: 12px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; color: #7a7570; }
.styled-select { border: 1px solid #d4cfc8; background: #f9f6f2; padding: 7px 28px 7px 10px; font-size: 13px; font-family: 'DM Sans', sans-serif; border-radius: 2px; color: #1a1814; cursor: pointer; outline: none; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%237a7570' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 10px center; }
.save-btn { margin-left: auto; background: #1a1814; color: #f5f2ed; border: none; padding: 9px 20px; font-size: 13px; font-family: 'DM Sans', sans-serif; cursor: pointer; border-radius: 2px; transition: background 0.2s; }
.save-btn:hover { background: #2d2820; }
.save-btn:disabled { background: #c8c4be; cursor: not-allowed; }
.courses-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; }
.course-card { background: #fff; border: 1px solid #e8e4de; border-radius: 4px; padding: 1.25rem; cursor: pointer; transition: border-color 0.2s; position: relative; }
.course-card:hover { border-color: #c8c4be; }
.course-card.selected { border-color: #1a1814; background: #f9f6f2; }
.course-card.selected::after { content: '✓'; position: absolute; top: 12px; right: 14px; width: 22px; height: 22px; background: #1a1814; color: #f5f2ed; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 600; }
.course-code { font-size: 11px; font-weight: 600; letter-spacing: 1px; color: #a07830; margin-bottom: 4px; }
.course-title-text { font-size: 14px; font-weight: 500; color: #1a1814; margin-bottom: 8px; line-height: 1.4; }
.course-meta { display: flex; gap: 12px; font-size: 12px; color: #7a7570; }
.credit-badge { display: inline-flex; align-items: center; gap: 3px; }
.dept-tag { background: #f0ede8; color: #7a7570; padding: 2px 8px; border-radius: 2px; font-size: 11px; }
.saved-notice { background: #eaf3de; border: 1px solid #c0dd97; color: #3b6d11; padding: 10px 16px; border-radius: 4px; font-size: 13px; margin-bottom: 1rem; }
.registered-summary { background: #f9f6f2; border: 1px solid #e8e4de; border-radius: 4px; padding: 1rem 1.5rem; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 8px; font-size: 13px; color: #5a5550; }
.registered-count { font-weight: 600; color: #1a1814; }

/* RESULTS */
.results-filter { background: #fff; border: 1px solid #e8e4de; border-radius: 4px; padding: 1rem 1.5rem; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap; }
.results-table-wrap { background: #fff; border: 1px solid #e8e4de; border-radius: 4px; overflow: hidden; margin-bottom: 1.5rem; }
.results-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.results-table thead { background: #1a1814; }
.results-table thead th { padding: 12px 16px; text-align: left; font-size: 11px; font-weight: 600; letter-spacing: 0.8px; text-transform: uppercase; color: #a0998f; }
.results-table tbody tr { border-bottom: 1px solid #f0ede8; }
.results-table tbody tr:last-child { border-bottom: none; }
.results-table tbody tr:hover { background: #f9f6f2; }
.results-table td { padding: 13px 16px; color: #1a1814; }
.grade-badge { display: inline-block; width: 28px; height: 28px; border-radius: 50%; text-align: center; line-height: 28px; font-size: 12px; font-weight: 600; }
.grade-A { background: #eaf3de; color: #3b6d11; }
.grade-B { background: #e6f1fb; color: #185fa5; }
.grade-C { background: #faeeda; color: #854f0b; }
.grade-D { background: #faece7; color: #993c1d; }
.grade-F { background: #fcebeb; color: #a32d2d; }
.gpa-summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 1rem; }
.empty-state { text-align: center; padding: 4rem 2rem; }
.empty-icon { font-size: 48px; color: #d4cfc8; margin-bottom: 1rem; }
.empty-title { font-size: 16px; font-weight: 500; color: #5a5550; margin-bottom: 6px; }
.empty-sub { font-size: 13px; color: #9a9590; }

/* PAYMENT GATE */
.payment-gate { max-width: 520px; margin: 4rem auto; }
.payment-card { background: #fff; border: 1px solid #e8e4de; border-radius: 4px; overflow: hidden; }
.payment-header { background: #1a1814; padding: 2rem 2rem 1.5rem; }
.payment-header-icon { width: 52px; height: 52px; border-radius: 50%; background: rgba(200,169,110,0.15); border: 1px solid rgba(200,169,110,0.3); display: flex; align-items: center; justify-content: center; font-size: 22px; margin-bottom: 1rem; }
.payment-header-title { font-family: 'DM Serif Display', serif; font-size: 22px; color: #f5f2ed; margin-bottom: 4px; }
.payment-header-sub { font-size: 13px; color: #a0998f; }
.payment-body { padding: 1.75rem 2rem; }
.payment-amount-box { background: #f9f6f2; border: 1px solid #e8e4de; border-radius: 4px; padding: 1.25rem 1.5rem; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between; }
.payment-amount-label { font-size: 12px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; color: #9a9590; margin-bottom: 4px; }
.payment-amount-value { font-size: 32px; font-weight: 300; color: #1a1814; }
.payment-amount-currency { font-size: 14px; color: #7a7570; margin-top: 2px; }
.payment-info { font-size: 13px; color: #7a7570; margin-bottom: 1.5rem; line-height: 1.6; }
.payment-methods { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1.5rem; }
.payment-method-btn { background: #f9f6f2; border: 1px solid #e8e4de; border-radius: 4px; padding: 0.75rem 1rem; cursor: pointer; transition: border-color 0.2s, background 0.2s; text-align: left; font-family: 'DM Sans', sans-serif; }
.payment-method-btn:hover { border-color: #c8c4be; background: #f0ede8; }
.payment-method-btn.active { border-color: #1a1814; background: #f5f2ed; }
.payment-method-icon { font-size: 18px; margin-bottom: 4px; }
.payment-method-name { font-size: 13px; font-weight: 500; color: #1a1814; }
.payment-method-desc { font-size: 11px; color: #9a9590; }
.payment-phone-field { margin-bottom: 1.25rem; }
.pay-btn { width: 100%; background: #a07830; color: #fff; border: none; padding: 13px; font-size: 14px; font-weight: 500; font-family: 'DM Sans', sans-serif; cursor: pointer; border-radius: 2px; letter-spacing: 0.3px; transition: background 0.2s; }
.pay-btn:hover { background: #7a5820; }
.pay-btn:disabled { background: #c8c4be; cursor: not-allowed; }
.payment-processing { text-align: center; padding: 2rem 0; }
.payment-processing-spinner { width: 40px; height: 40px; border: 3px solid #e8e4de; border-top-color: #a07830; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1rem; }
.payment-success-icon { width: 56px; height: 56px; border-radius: 50%; background: #eaf3de; display: flex; align-items: center; justify-content: center; font-size: 24px; margin: 0 auto 1rem; }
.payment-receipt { background: #f9f6f2; border: 1px solid #e8e4de; border-radius: 4px; padding: 1rem 1.25rem; margin-bottom: 1.5rem; }
.payment-receipt-row { display: flex; justify-content: space-between; font-size: 12px; padding: 4px 0; }
.payment-receipt-key { color: #7a7570; }
.payment-receipt-val { font-weight: 500; color: #1a1814; }
.view-results-btn { width: 100%; background: #1a1814; color: #f5f2ed; border: none; padding: 13px; font-size: 14px; font-weight: 500; font-family: 'DM Sans', sans-serif; cursor: pointer; border-radius: 2px; transition: background 0.2s; }
.view-results-btn:hover { background: #2d2820; }
@keyframes spin { to { transform: rotate(360deg); } }
`;

type Page = "login" | "signup" | "forgot" | "home" | "register" | "results";

export default function App(): JSX.Element {
  const [page, setPage] = useState<Page>("login");
  const [student, setStudent] = useState<Student | null>(null);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [results] = useState<ResultsData>(JSON.parse(JSON.stringify(SEED_RESULTS)));
  const [registrations, setRegistrations] = useState<RegistrationsData>(JSON.parse(JSON.stringify(SEED_REGISTRATIONS)));
  // Track which students have paid the results fee (by student id)
  const [paidStudents, setPaidStudents] = useState<Set<number>>(new Set());
  // When navigating to results, show payment gate first if unpaid
  const [showPaymentGate, setShowPaymentGate] = useState<boolean>(false);

  const handleLogin = (s: Student): void => { setStudent(s); setPage("home"); };
  const handleLogout = (): void => { setStudent(null); setPage("login"); setShowPaymentGate(false); };
  const handleRegister = (s: Student): void => {
    setStudents(prev => [...prev, s]);
    setStudent(s);
    setPage("home");
  };

  const handleNavResults = (): void => {
    if (!student) return;
    if (paidStudents.has(student.id)) {
      setPage("results");
      setShowPaymentGate(false);
    } else {
      setShowPaymentGate(true);
      setPage("results");
    }
  };

  const handlePaymentComplete = (): void => {
    if (!student) return;
    setPaidStudents(prev => new Set(prev).add(student.id));
    setShowPaymentGate(false);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        {page === "login" && (
          <LoginPage
            students={students}
            onLogin={handleLogin}
            onGoSignup={() => setPage("signup")}
            onGoForgot={() => setPage("forgot")}
          />
        )}
        {page === "signup" && (
          <SignupPage
            students={students}
            onRegister={handleRegister}
            onGoLogin={() => setPage("login")}
          />
        )}
        {page === "forgot" && (
          <ForgotPasswordPage
            students={students}
            onGoLogin={() => setPage("login")}
          />
        )}
        {page !== "login" && page !== "signup" && page !== "forgot" && student && (
          <>
            <Navbar page={page} setPage={setPage} student={student} onLogout={handleLogout} onNavResults={handleNavResults} />
            <div className="main">
              {page === "home" && <HomePage student={student} registrations={registrations} results={results} />}
              {page === "register" && (
                <RegisterPage student={student} registrations={registrations} setRegistrations={setRegistrations} />
              )}
              {page === "results" && showPaymentGate && (
                <PaymentGatePage student={student} onPaymentComplete={handlePaymentComplete} />
              )}
              {page === "results" && !showPaymentGate && (
                <ResultsPage student={student} results={results} registrations={registrations} />
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

// ─── LOGIN ───────────────────────────────────────────────────────────────────

interface LoginPageProps {
  students: Student[];
  onLogin: (student: Student) => void;
  onGoSignup: () => void;
  onGoForgot: () => void;
}

function LoginPage({ students, onLogin, onGoSignup, onGoForgot }: LoginPageProps): JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = (): void => {
    if (!email || !password) { setError("Please fill in all fields."); return; }
    const found = students.find(s => s.email === email && s.password === password);
    if (found) { setError(""); onLogin(found); }
    else setError("Invalid email or password. Please try again.");
  };

  return (
    <div className="auth-wrap">
      <div className="auth-bg" />
      <div className="auth-card">
        <div className="auth-logo">HIPAL</div>
        <div className="auth-sub">Student Portal — Sign In</div>
        {error && <div className="auth-err">{error}</div>}
        <div className="auth-field">
          <label className="auth-label">Email Address</label>
          <input className="auth-input" type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="you@university.edu" onKeyDown={e => e.key === "Enter" && handleSubmit()} />
        </div>
        <div className="auth-field">
          <label className="auth-label">Password</label>
          <input className="auth-input" type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="••••••••" onKeyDown={e => e.key === "Enter" && handleSubmit()} />
        </div>
        <div style={{ textAlign: "right", marginTop: "-0.25rem", marginBottom: "0.75rem" }}>
          <button className="auth-link" onClick={onGoForgot}>Forgot password?</button>
        </div>
        <button className="auth-btn" onClick={handleSubmit}>Sign In →</button>
        <div className="auth-toggle">
          Don't have an account?{" "}
          <button className="auth-link" onClick={onGoSignup}>Create account</button>
        </div>
        <div className="auth-hint">
          Demo: <code>alice@university.edu</code> · Password: <code>pass123</code>
        </div>
      </div>
    </div>
  );
}

// ─── SIGNUP ──────────────────────────────────────────────────────────────────

interface SignupPageProps {
  students: Student[];
  onRegister: (student: Student) => void;
  onGoLogin: () => void;
}

function SignupPage({ students, onRegister, onGoLogin }: SignupPageProps): JSX.Element {
  const [form, setForm] = useState({ name: "", email: "", matric: "", department: "", level: "", password: "", confirm: "" });
  const [error, setError] = useState<string>("");

  const set = (field: string, val: string) => setForm(f => ({ ...f, [field]: val }));

  const handleSubmit = (): void => {
    if (!form.name || !form.email || !form.matric || !form.department || !form.level || !form.password || !form.confirm) {
      setError("Please fill in all fields."); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email address."); return;
    }
    if (students.find(s => s.email === form.email)) {
      setError("An account with this email already exists."); return;
    }
    if (students.find(s => s.matric === form.matric)) {
      setError("This matriculation number is already registered."); return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters."); return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match."); return;
    }
    const newStudent: Student = {
      id: Date.now(),
      email: form.email,
      password: form.password,
      name: form.name,
      matric: form.matric,
      department: form.department,
      level: form.level,
      avatar: initials(form.name),
    };
    setError("");
    onRegister(newStudent);
  };

  return (
    <div className="auth-wrap">
      <div className="auth-bg" />
      <div className="auth-card">
        <div className="auth-logo">HIPAL</div>
        <div className="auth-sub">Create Student Account</div>
        {error && <div className="auth-err">{error}</div>}
        <div className="auth-field">
          <label className="auth-label">Full Name</label>
          <input className="auth-input" type="text" value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Alice Johnson" />
        </div>
        <div className="auth-field">
          <label className="auth-label">Matriculation Number</label>
          <input className="auth-input" type="text" value={form.matric} onChange={e => set("matric", e.target.value)} placeholder="e.g. U2024/123" />
        </div>
        <div className="auth-field">
          <label className="auth-label">Email Address</label>
          <input className="auth-input" type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="you@university.edu" />
        </div>
        <div className="auth-row">
          <div className="auth-field">
            <label className="auth-label">Department</label>
            <select className="auth-select" value={form.department} onChange={e => set("department", e.target.value)}>
              <option value="">Select…</option>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="auth-field">
            <label className="auth-label">Level</label>
            <select className="auth-select" value={form.level} onChange={e => set("level", e.target.value)}>
              <option value="">Select…</option>
              {LEVELS.map(l => <option key={l} value={l}>{l} Level</option>)}
            </select>
          </div>
        </div>
        <div className="auth-row">
          <div className="auth-field">
            <label className="auth-label">Password</label>
            <input className="auth-input" type="password" value={form.password} onChange={e => set("password", e.target.value)} placeholder="Min. 6 characters" />
          </div>
          <div className="auth-field">
            <label className="auth-label">Confirm Password</label>
            <input className="auth-input" type="password" value={form.confirm} onChange={e => set("confirm", e.target.value)} placeholder="Repeat password" />
          </div>
        </div>
        <button className="auth-btn" onClick={handleSubmit}>Create Account →</button>
        <div className="auth-toggle">
          Already have an account?{" "}
          <button className="auth-link" onClick={onGoLogin}>Sign in</button>
        </div>
      </div>
    </div>
  );
}

// ─── FORGOT PASSWORD ──────────────────────────────────────────────────────────

interface ForgotPasswordPageProps {
  students: Student[];
  onGoLogin: () => void;
}

function ForgotPasswordPage({ students, onGoLogin }: ForgotPasswordPageProps): JSX.Element {
  const [step, setStep] = useState<"email" | "verify" | "reset" | "done">("email");
  const [email, setEmail] = useState<string>("");
  const [matric, setMatric] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [foundStudent, setFoundStudent] = useState<Student | null>(null);

  const handleEmailStep = (): void => {
    if (!email) { setError("Please enter your email address."); return; }
    const s = students.find(s => s.email === email);
    if (!s) { setError("No account found with that email address."); return; }
    setFoundStudent(s);
    setError("");
    setStep("verify");
  };

  const handleVerifyStep = (): void => {
    if (!matric) { setError("Please enter your matriculation number."); return; }
    if (foundStudent && foundStudent.matric !== matric) {
      setError("Matriculation number does not match our records."); return;
    }
    setError("");
    setStep("reset");
  };

  const handleResetStep = (): void => {
    if (!newPassword || !confirmPassword) { setError("Please fill in both password fields."); return; }
    if (newPassword.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (newPassword !== confirmPassword) { setError("Passwords do not match."); return; }
    // In a real app: update the password in the DB
    setError("");
    setStep("done");
  };

  return (
    <div className="auth-wrap">
      <div className="auth-bg" />
      <div className="auth-card">
        <div className="auth-logo">HIPAL</div>
        <div className="auth-sub">Reset Your Password</div>

        {/* Step indicator */}
        <div style={{ display: "flex", gap: 6, marginBottom: "1.75rem" }}>
          {(["email", "verify", "reset"] as const).map((s, i) => (
            <div key={s} style={{ flex: 1, height: 3, borderRadius: 2, background: ["email","verify","reset","done"].indexOf(step) >= i ? "#a07830" : "#e8e4de", transition: "background 0.3s" }} />
          ))}
        </div>

        {error && <div className="auth-err">{error}</div>}

        {step === "email" && (
          <>
            <p style={{ fontSize: 13, color: "#7a7570", marginBottom: "1.25rem", lineHeight: 1.6 }}>Enter your registered email address and we'll verify your identity.</p>
            <div className="auth-field">
              <label className="auth-label">Email Address</label>
              <input className="auth-input" type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@university.edu" onKeyDown={e => e.key === "Enter" && handleEmailStep()} />
            </div>
            <button className="auth-btn" onClick={handleEmailStep}>Continue →</button>
          </>
        )}

        {step === "verify" && (
          <>
            <p style={{ fontSize: 13, color: "#7a7570", marginBottom: "1.25rem", lineHeight: 1.6 }}>To confirm your identity, enter your matriculation number.</p>
            <div className="auth-field">
              <label className="auth-label">Matriculation Number</label>
              <input className="auth-input" type="text" value={matric} onChange={e => setMatric(e.target.value)}
                placeholder="e.g. U2021/001" onKeyDown={e => e.key === "Enter" && handleVerifyStep()} />
            </div>
            <button className="auth-btn" onClick={handleVerifyStep}>Verify Identity →</button>
          </>
        )}

        {step === "reset" && (
          <>
            <p style={{ fontSize: 13, color: "#7a7570", marginBottom: "1.25rem", lineHeight: 1.6 }}>Identity confirmed. Choose a new password for your account.</p>
            <div className="auth-field">
              <label className="auth-label">New Password</label>
              <input className="auth-input" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Min. 6 characters" />
            </div>
            <div className="auth-field">
              <label className="auth-label">Confirm New Password</label>
              <input className="auth-input" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Repeat new password" />
            </div>
            <button className="auth-btn" onClick={handleResetStep}>Reset Password →</button>
          </>
        )}

        {step === "done" && (
          <>
            <div style={{ textAlign: "center", padding: "1rem 0 1.5rem" }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#eaf3de", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, margin: "0 auto 1rem" }}>✓</div>
              <p style={{ fontSize: 15, fontWeight: 500, color: "#1a1814", marginBottom: 6 }}>Password reset successfully</p>
              <p style={{ fontSize: 13, color: "#7a7570" }}>You can now sign in with your new password.</p>
            </div>
            <button className="auth-btn" onClick={onGoLogin}>Back to Sign In →</button>
          </>
        )}

        {step !== "done" && (
          <div className="auth-toggle" style={{ marginTop: "1rem" }}>
            <button className="auth-link" onClick={onGoLogin}>← Back to sign in</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PAYMENT GATE ─────────────────────────────────────────────────────────────

interface PaymentGatePageProps {
  student: Student;
  onPaymentComplete: () => void;
}

type PaymentMethod = "momo" | "orange";
type PaymentState = "idle" | "processing" | "success";

function PaymentGatePage({ student, onPaymentComplete }: PaymentGatePageProps): JSX.Element {
  const [method, setMethod] = useState<PaymentMethod>("momo");
  const [phone, setPhone] = useState<string>("");
  const [payState, setPayState] = useState<PaymentState>("idle");
  const [error, setError] = useState<string>("");
  const txRef = `TXN-${Date.now().toString(36).toUpperCase()}`;

  const handlePay = (): void => {
    if (!phone || phone.replace(/\s/g, "").length < 9) {
      setError("Please enter a valid phone number."); return;
    }
    setError("");
    setPayState("processing");
    // Simulate payment processing (2.5s)
    setTimeout(() => setPayState("success"), 2500);
  };

  return (
    <div className="payment-gate">
      <div className="payment-card">
        <div className="payment-header">
          <div className="payment-header-icon">🔒</div>
          <div className="payment-header-title">Results Access Fee</div>
          <div className="payment-header-sub">One-time payment to unlock your academic results</div>
        </div>
        <div className="payment-body">
          {payState === "idle" && (
            <>
              <div className="payment-amount-box">
                <div>
                  <div className="payment-amount-label">Amount Due</div>
                  <div className="payment-amount-value">500</div>
                  <div className="payment-amount-currency">XAF (Central African Franc)</div>
                </div>
                <div style={{ fontSize: 36, opacity: 0.3 }}>🎓</div>
              </div>
              <p className="payment-info">
                A one-time fee of <strong>500 XAF</strong> is required to access your scores and results.
                This fee covers administrative processing and is non-refundable. Payment is valid for the current academic session.
              </p>
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase", color: "#9a9590", marginBottom: "0.75rem" }}>Select Payment Method</p>
              <div className="payment-methods">
                <button className={`payment-method-btn${method === "momo" ? " active" : ""}`} onClick={() => setMethod("momo")}>
                  <div className="payment-method-icon">📱</div>
                  <div className="payment-method-name">MTN MoMo</div>
                  <div className="payment-method-desc">Mobile Money</div>
                </button>
                <button className={`payment-method-btn${method === "orange" ? " active" : ""}`} onClick={() => setMethod("orange")}>
                  <div className="payment-method-icon">🟠</div>
                  <div className="payment-method-name">Orange Money</div>
                  <div className="payment-method-desc">Mobile Money</div>
                </button>
              </div>
              <div className="payment-phone-field">
                <label className="auth-label">
                  {method === "momo" ? "MTN" : "Orange"} Phone Number
                </label>
                <input className="auth-input" type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder={method === "momo" ? "e.g. 6 70 00 00 00" : "e.g. 6 99 00 00 00"} />
              </div>
              {error && <div className="auth-err" style={{ marginBottom: "1rem" }}>{error}</div>}
              <button className="pay-btn" onClick={handlePay}>
                Pay 500 XAF via {method === "momo" ? "MTN MoMo" : "Orange Money"} →
              </button>
            </>
          )}

          {payState === "processing" && (
            <div className="payment-processing">
              <div className="payment-processing-spinner" />
              <p style={{ fontSize: 15, fontWeight: 500, color: "#1a1814", marginBottom: 6 }}>Processing Payment…</p>
              <p style={{ fontSize: 13, color: "#7a7570" }}>Please wait and do not close this page.</p>
            </div>
          )}

          {payState === "success" && (
            <>
              <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                <div className="payment-success-icon">✓</div>
                <p style={{ fontSize: 16, fontWeight: 500, color: "#1a1814", marginBottom: 4 }}>Payment Successful</p>
                <p style={{ fontSize: 13, color: "#7a7570" }}>Your results access has been unlocked.</p>
              </div>
              <div className="payment-receipt">
                <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase", color: "#9a9590", marginBottom: "0.75rem" }}>Receipt</p>
                {[
                  ["Student", student.name],
                  ["Matric No.", student.matric],
                  ["Amount", "500 XAF"],
                  ["Method", method === "momo" ? "MTN Mobile Money" : "Orange Money"],
                  ["Phone", phone],
                  ["Reference", txRef],
                  ["Status", "✓ Confirmed"],
                ].map(([k, v]) => (
                  <div className="payment-receipt-row" key={k}>
                    <span className="payment-receipt-key">{k}</span>
                    <span className="payment-receipt-val" style={k === "Status" ? { color: "#3b6d11" } : {}}>{v}</span>
                  </div>
                ))}
              </div>
              <button className="view-results-btn" onClick={onPaymentComplete}>View My Results →</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── NAVBAR ──────────────────────────────────────────────────────────────────

interface NavbarProps {
  page: Page;
  setPage: (page: Page) => void;
  student: Student;
  onLogout: () => void;
  onNavResults: () => void;
}

function Navbar({ page, setPage, student, onLogout, onNavResults }: NavbarProps): JSX.Element {
  return (
    <nav className="navbar">
      <div className="navbar-brand">HIPAL</div>
      <div className="navbar-nav">
        <button className={`nav-link${page === "home" ? " active" : ""}`} onClick={() => setPage("home")}>Home</button>
        <button className={`nav-link${page === "register" ? " active" : ""}`} onClick={() => setPage("register")}>Course Registration</button>
        <button className={`nav-link${page === "results" ? " active" : ""}`} onClick={onNavResults}>Scores & Results</button>
      </div>
      <div className="navbar-user">
        <div className="avatar-sm">{student.avatar}</div>
        <button className="logout-btn" onClick={onLogout}>Sign out</button>
      </div>
    </nav>
  );
}

// ─── HOME ────────────────────────────────────────────────────────────────────

interface HomePageProps {
  student: Student;
  registrations: RegistrationsData;
  results: ResultsData;
}

function HomePage({ student, registrations, results }: HomePageProps): JSX.Element {
  const allResults = results[String(student.id)] || {};
  let totalCredits = 0, totalPoints = 0, totalCourses = 0;
  Object.values(allResults).forEach(semCourses => {
    semCourses.forEach(r => {
      const course = ALL_COURSES.find(c => c.code === r.code);
      if (!course) return;
      const grade = gradeFromTotal(r.testScore + r.examScore);
      totalCredits += course.credits;
      totalPoints += grade.point * course.credits;
      totalCourses++;
    });
  });
  const cgpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "—";
  const allReg = registrations[String(student.id)] || {};
  let registeredCount = 0;
  Object.values(allReg).forEach(arr => { registeredCount += arr.length; });

  return (
    <div>
      <div className="hero-card">
        <div className="hero-avatar">{student.avatar}</div>
        <div>
          <div className="hero-name">{student.name}</div>
          <div className="hero-detail">Matriculation No: {student.matric}</div>
          <div className="hero-detail">{student.department} · Level {student.level}</div>
        </div>
      </div>
      <div className="stats-grid">
        {[
          { label: "CGPA", value: cgpa, gold: true },
          { label: "Courses Completed", value: totalCourses },
          { label: "Total Credits Earned", value: totalCredits },
          { label: "Courses Registered", value: registeredCount },
        ].map(({ label, value, gold }) => (
          <div className="stat-card" key={label}>
            <div className="stat-label">{label}</div>
            <div className={`stat-value${gold ? " gold" : ""}`}>{value}</div>
          </div>
        ))}
      </div>
      <div className="info-grid">
        <div className="info-card">
          <div className="info-title">Academic Profile</div>
          {[["Full Name", student.name], ["Email", student.email], ["Matric No.", student.matric], ["Department", student.department], ["Level", student.level + " Level"]].map(([k, v]) => (
            <div className="info-row" key={k}><span className="info-key">{k}</span><span className="info-val">{v}</span></div>
          ))}
        </div>
        <div className="info-card">
          <div className="info-title">Academic Standing</div>
          {[
            ["CGPA", cgpa],
            ["Total Credits", totalCredits + " units"],
            ["Courses Completed", totalCourses + " courses"],
            ["Status", totalCredits > 0 ? (parseFloat(cgpa as string) >= 2.0 ? "Good Standing" : "On Probation") : "No Records Yet"],
            ["Courses Registered", registeredCount + " courses"],
          ].map(([k, v]) => (
            <div className="info-row" key={k}><span className="info-key">{k}</span><span className="info-val">{v}</span></div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── REGISTER ────────────────────────────────────────────────────────────────

interface RegisterPageProps {
  student: Student;
  registrations: RegistrationsData;
  setRegistrations: React.Dispatch<React.SetStateAction<RegistrationsData>>;
}

function RegisterPage({ student, registrations, setRegistrations }: RegisterPageProps): JSX.Element {
  const years = ["2022", "2023", "2024", "2025"];
  const semesters = ["First", "Second"];
  const [year, setYear] = useState<string>("2025");
  const [semester, setSemester] = useState<string>("First");
  const [saved, setSaved] = useState<boolean>(false);

  const key = `${year}-${semester}`;
  const currentSelected: string[] = (registrations[String(student.id)] || {})[key] || [];

  const toggle = (code: string): void => {
    setSaved(false);
    const cur = (registrations[String(student.id)] || {})[key] || [];
    const updated = cur.includes(code) ? cur.filter(c => c !== code) : [...cur, code];
    setRegistrations(prev => ({ ...prev, [String(student.id)]: { ...(prev[String(student.id)] || {}), [key]: updated } }));
  };

  const handleSave = (): void => { setSaved(true); setTimeout(() => setSaved(false), 3000); };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Course Registration</div>
        <div className="page-sub">Select courses for your desired semester and save your registration.</div>
      </div>
      <div className="semester-bar">
        <div className="select-group">
          <span className="select-label">Academic Year</span>
          <select className="styled-select" value={year} onChange={e => { setYear(e.target.value); setSaved(false); }}>
            {years.map(y => <option key={y} value={y}>{y}/{parseInt(y) + 1}</option>)}
          </select>
        </div>
        <div className="select-group">
          <span className="select-label">Semester</span>
          <select className="styled-select" value={semester} onChange={e => { setSemester(e.target.value); setSaved(false); }}>
            {semesters.map(s => <option key={s} value={s}>{s} Semester</option>)}
          </select>
        </div>
        <button className="save-btn" onClick={handleSave} disabled={currentSelected.length === 0}>
          Save Registration ({currentSelected.length})
        </button>
      </div>
      {saved && <div className="saved-notice">✓ Registration saved for {year}/{parseInt(year) + 1} {semester} Semester — {currentSelected.length} course(s) registered.</div>}
      {currentSelected.length > 0 && (
        <div className="registered-summary">
          <span><span className="registered-count">{currentSelected.length}</span> course(s) selected</span>
          <span>·</span>
          <span>{ALL_COURSES.filter(c => currentSelected.includes(c.code)).reduce((s, c) => s + c.credits, 0)} credit units</span>
        </div>
      )}
      <div className="courses-grid">
        {ALL_COURSES.map(course => (
          <div key={course.code} className={`course-card${currentSelected.includes(course.code) ? " selected" : ""}`} onClick={() => toggle(course.code)}>
            <div className="course-code">{course.code}</div>
            <div className="course-title-text">{course.title}</div>
            <div className="course-meta">
              <span className="credit-badge">⬡ {course.credits} credits</span>
              <span className="dept-tag">{course.department.split(" ")[0]}</span>
            </div>
            <div style={{ marginTop: 8, fontSize: 12, color: "#9a9590" }}>{course.lecturer}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── RESULTS ──────────────────────────────────────────────────────────────────

interface ResultsPageProps {
  student: Student;
  results: ResultsData;
  registrations: RegistrationsData;
}

function ResultsPage({ student, results }: ResultsPageProps): JSX.Element {
  const years = ["2022", "2023", "2024", "2025"];
  const semesters = ["First", "Second"];
  const [year, setYear] = useState<string>("2023");
  const [semester, setSemester] = useState<string>("First");

  const key = `${year}-${semester}`;
  const studentResults = (results[String(student.id)] || {})[key] || [];

  let totalCredits = 0, totalWeightedPoints = 0;
  const rows = studentResults.map(r => {
    const course = ALL_COURSES.find(c => c.code === r.code);
    if (!course) return null;
    const total = r.testScore + r.examScore;
    const grade = gradeFromTotal(total);
    totalCredits += course.credits;
    totalWeightedPoints += grade.point * course.credits;
    return { course, r, total, grade };
  }).filter((item): item is NonNullable<typeof item> => item !== null);

  const gpa = totalCredits > 0 ? (totalWeightedPoints / totalCredits).toFixed(2) : null;

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Scores & Results</div>
        <div className="page-sub">Select an academic year and semester to view your results.</div>
      </div>
      <div className="results-filter">
        <div className="select-group">
          <span className="select-label">Year</span>
          <select className="styled-select" value={year} onChange={e => setYear(e.target.value)}>
            {years.map(y => <option key={y} value={y}>{y}/{parseInt(y) + 1}</option>)}
          </select>
        </div>
        <div className="select-group">
          <span className="select-label">Semester</span>
          <select className="styled-select" value={semester} onChange={e => setSemester(e.target.value)}>
            {semesters.map(s => <option key={s} value={s}>{s} Semester</option>)}
          </select>
        </div>
      </div>
      {rows.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <div className="empty-title">No results found</div>
          <div className="empty-sub">No scores are available for {year}/{parseInt(year) + 1} {semester} Semester.</div>
        </div>
      ) : (
        <>
          <div className="results-table-wrap">
            <table className="results-table">
              <thead>
                <tr>
                  <th>Course Code</th><th>Course Title</th><th>Lecturer</th>
                  <th>Credits</th><th>Test /30</th><th>Exam /70</th>
                  <th>Total /100</th><th>Grade</th><th>GP</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ course, r, total, grade }) => (
                  <tr key={course.code}>
                    <td style={{ fontWeight: 600, color: "#a07830", fontFamily: "monospace", fontSize: 12 }}>{course.code}</td>
                    <td style={{ fontWeight: 500 }}>{course.title}</td>
                    <td style={{ color: "#7a7570", fontSize: 12 }}>{course.lecturer}</td>
                    <td style={{ textAlign: "center" }}>{course.credits}</td>
                    <td style={{ textAlign: "center" }}>{r.testScore}</td>
                    <td style={{ textAlign: "center" }}>{r.examScore}</td>
                    <td style={{ textAlign: "center", fontWeight: 600 }}>{total}</td>
                    <td style={{ textAlign: "center" }}><span className={`grade-badge grade-${grade.letter}`}>{grade.letter}</span></td>
                    <td style={{ textAlign: "center" }}>{grade.point.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="gpa-summary">
            {[
              { label: "Semester GPA", value: gpa, gold: true },
              { label: "Courses Taken", value: rows.length },
              { label: "Total Credit Load", value: totalCredits },
              { label: "Credit Points", value: totalWeightedPoints.toFixed(1) },
            ].map(({ label, value, gold }) => (
              <div className="stat-card" key={label}>
                <div className="stat-label">{label}</div>
                <div className={`stat-value${gold ? " gold" : ""}`}>{value}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}