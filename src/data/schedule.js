// ─── Schedule Data ───
export const subjects = [
  {
    section: 'CS199',
    code: 'PC 4112',
    name: 'Information Assurance and Security 2',
    type: 'Lecture',
    units: 2,
    instructor: 'Angelbert Maghanoy',
    schedules: [
      { time: '7:00 AM – 9:00 AM', day: 'M', dayFull: 'Monday', room: 'ST 302', startHour: 7, startMin: 0, endHour: 9, endMin: 0 }
    ],
    theme: 'purple',
    blockClass: 'block-purple'
  },
  {
    section: 'CS200',
    code: 'PC 4112L',
    name: 'Information Assurance and Security 2',
    type: 'Laboratory',
    units: 3,
    instructor: 'Angelbert Maghanoy',
    schedules: [
      { time: '7:00 AM – 10:00 AM', day: 'T', dayFull: 'Tuesday', room: 'IT 202', startHour: 7, startMin: 0, endHour: 10, endMin: 0 },
      { time: '7:00 AM – 10:00 AM', day: 'W', dayFull: 'Wednesday', room: 'IT 202', startHour: 7, startMin: 0, endHour: 10, endMin: 0 },
      { time: '7:00 AM – 10:00 AM', day: 'Th', dayFull: 'Thursday', room: 'IT 202', startHour: 7, startMin: 0, endHour: 10, endMin: 0 }
    ],
    theme: 'pink',
    blockClass: 'block-pink'
  },
  {
    section: 'CS201',
    code: 'PC 4113',
    name: 'Systems Administration and Maintenance',
    type: '',
    units: 3,
    instructor: 'Suzzete B. Bacus',
    schedules: [
      { time: '9:00 AM – 12:00 PM', day: 'M', dayFull: 'Monday', room: 'IT 402', startHour: 9, startMin: 0, endHour: 12, endMin: 0 },
      { time: '10:00 AM – 12:00 PM', day: 'T', dayFull: 'Tuesday', room: 'IT 402', startHour: 10, startMin: 0, endHour: 12, endMin: 0 }
    ],
    theme: 'teal',
    blockClass: 'block-teal'
  },
  {
    section: 'CS202',
    code: 'PC 4114',
    name: 'Capstone Project and Research 2 (Technopreneurship 2)',
    type: '',
    units: 3,
    instructor: 'Bell S. Campanilla',
    schedules: [
      { time: '10:00 AM – 12:00 PM', day: 'W', dayFull: 'Wednesday', room: 'ST 303', startHour: 10, startMin: 0, endHour: 12, endMin: 0 },
      { time: '10:00 AM – 11:00 AM', day: 'Th', dayFull: 'Thursday', room: 'ST 303', startHour: 10, startMin: 0, endHour: 11, endMin: 0 }
    ],
    theme: 'gold',
    blockClass: 'block-gold'
  },
  {
    section: 'CS203',
    code: 'P ELEC 4',
    name: 'Professional Elective 4',
    type: '',
    units: 3,
    instructor: 'Leodivino A. Lawas',
    schedules: [
      { time: '1:00 PM – 3:00 PM', day: 'T', dayFull: 'Tuesday', room: 'IT 301', startHour: 13, startMin: 0, endHour: 15, endMin: 0 },
      { time: '1:00 PM – 4:00 PM', day: 'W', dayFull: 'Wednesday', room: 'IT 301', startHour: 13, startMin: 0, endHour: 16, endMin: 0 }
    ],
    theme: 'green',
    blockClass: 'block-green'
  },
  {
    section: 'CS204',
    code: 'AP 6',
    name: 'Cross-Platform Script Development Technology',
    type: '',
    units: 3,
    instructor: 'Arve Baes',
    schedules: [
      { time: '7:00 AM – 12:00 PM', day: 'F', dayFull: 'Friday', room: 'ST 301', startHour: 7, startMin: 0, endHour: 12, endMin: 0 }
    ],
    theme: 'red',
    blockClass: 'block-red'
  }
]

export const dayMap = { M: 1, T: 2, W: 3, Th: 4, F: 5 }
export const dayNames = { 0: 'Sunday', 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday' }
export const dayShort = { 1: 'M', 2: 'T', 3: 'W', 4: 'Th', 5: 'F' }
export const dayList = ['M', 'T', 'W', 'Th', 'F']
export const dayLabels = { M: 'Monday', T: 'Tuesday', W: 'Wednesday', Th: 'Thursday', F: 'Friday' }
export const dayAbbrev = { M: 'Mon', T: 'Tue', W: 'Wed', Th: 'Thu', F: 'Fri' }

export const fees = [
  { name: 'Tuition (CCICT)', amount: 2550 },
  { name: 'Development Fee', amount: 3040 },
  { name: 'Computer Fee', amount: 400 },
  { name: 'Library Fee', amount: 350 },
  { name: 'Athletics Fee', amount: 200 },
  { name: 'Medical and Dental Fee', amount: 200 },
  { name: 'Cultural Fee', amount: 150 },
  { name: 'Guidance Fee', amount: 90 },
  { name: 'Registration Fee', amount: 50 }
]

export const totalFees = fees.reduce((sum, f) => sum + f.amount, 0)
export const totalUnits = subjects.reduce((sum, s) => sum + s.units, 0)
export const costPerUnit = totalFees / totalUnits

export function formatHour(h, m) {
  const period = h >= 12 ? 'PM' : 'AM'
  const dh = h > 12 ? h - 12 : h === 0 ? 12 : h
  return `${dh}:${String(m || 0).padStart(2, '0')} ${period}`
}

export function formatCurrency(amount) {
  return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
