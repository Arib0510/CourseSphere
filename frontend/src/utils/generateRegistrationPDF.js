import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

/**
 * Generates an official RUET Course Registration/Course Adjustment Form PDF.
 * @param {object} user   - Auth user object (name/full_name, student_id, department)
 * @param {Array}  regs   - Array of registration objects from getMyRegistrations()
 * @param {object} extras - { registrationNo, academicSession, earnedCredits, backlogCount }
 */
export function generateRegistrationPDF(user, regs, extras = {}) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })

  const LM  = 20   // left margin
  const RM  = 190  // right margin (210 - 20)
  const CW  = 170  // content width
  const MID = 105  // horizontal center
  let y = 16

  // ─── helpers ────────────────────────────────────────────────────
  const center = (text, yPos, size, style = 'normal') => {
    doc.setFontSize(size)
    doc.setFont('helvetica', style)
    doc.text(text, MID, yPos, { align: 'center' })
  }

  const dotLine = (x1, y1, x2) => {
    doc.setLineWidth(0.25)
    doc.setLineDash([0.5, 1], 0)
    doc.line(x1, y1, x2, y1)
    doc.setLineDash([], 0)
  }

  const solidLine = (x1, y1, x2) => {
    doc.setLineWidth(0.3)
    doc.setLineDash([], 0)
    doc.line(x1, y1, x2, y1)
  }

  const field = (label, value, xStart, yPos, totalWidth) => {
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(label, xStart, yPos)
    const labelW = doc.getTextWidth(label) + 2
    if (value) {
      doc.setFont('helvetica', 'bold')
      doc.text(value, xStart + labelW, yPos)
      doc.setFont('helvetica', 'normal')
    }
    const filledW = labelW + (value ? doc.getTextWidth(value) + 2 : 0)
    dotLine(xStart + filledW, yPos + 0.5, xStart + totalWidth)
  }

  // ─── HEADER ─────────────────────────────────────────────────────
  center("Heaven's Light is Our Guide", y, 9, 'italic')
  y += 5.5

  center('RAJSHAHI UNIVERSITY OF ENGINEERING & TECHNOLOGY, BANGLADESH', y, 13, 'bold')
  y += 6.5

  center('Course Registration/Course Adjustment Form', y, 12, 'bold')
  const titleW = doc.getTextWidth('Course Registration/Course Adjustment Form')
  solidLine(MID - titleW / 2, y + 1, MID + titleW / 2)
  y += 7

  // Department line
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  const dept = user?.department || ''
  const deptDisplay = dept
    ? `${dept} Department.`
    : `................................. Department.`
  doc.text(deptDisplay, MID, y, { align: 'center' })
  y += 10

  // ─── INFO FIELDS ────────────────────────────────────────────────
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')

  const nameVal  = user?.full_name || user?.name || ''
  const rollNo   = user?.student_id || ''
  const regNo    = extras.registrationNo   || ''
  const session  = extras.academicSession  || ''
  const earned   = extras.earnedCredits    != null ? String(extras.earnedCredits) : ''
  const backlogs = extras.backlogCount     != null ? String(extras.backlogCount)  : ''

  // Helper to write a bold value then a dotted fill line
  const inlineField = (label, value, xStart, xEnd) => {
    doc.setFont('helvetica', 'normal')
    doc.text(label, xStart, y)
    const lw = doc.getTextWidth(label) + 2
    if (value) {
      doc.setFont('helvetica', 'bold')
      doc.text(value, xStart + lw, y)
      doc.setFont('helvetica', 'normal')
    }
    const filled = lw + (value ? doc.getTextWidth(value) + 2 : 0)
    dotLine(xStart + filled, y + 0.5, xEnd)
  }

  // Row 1: Roll No | Registration No with Session
  inlineField('Roll No.', rollNo, LM, LM + 75)
  inlineField('Registration No.  with Session', regNo, LM + 80, RM)
  y += 7

  // Row 2: Name
  inlineField('Name :', nameVal, LM, RM)
  y += 7

  // Row 3: Academic session with Semester  |  Previously earned credit
  doc.setFont('helvetica', 'normal')
  doc.text('Academic session with Semester :', LM, y)
  const sessLabelW = doc.getTextWidth('Academic session with Semester :') + 2
  if (session) {
    doc.setFont('helvetica', 'bold')
    doc.text(session, LM + sessLabelW, y)
    doc.setFont('helvetica', 'normal')
  }
  const sessFilled = sessLabelW + (session ? doc.getTextWidth(session) + 2 : 0)
  const prevLabel  = '  Previously earned caredit.'
  const prevLabelW = doc.getTextWidth(prevLabel)
  const earnedW    = earned ? doc.getTextWidth(earned) + 2 : 0
  // Layout: [session] [dots] Previously earned caredit. [earned]
  const prevStart  = RM - prevLabelW - earnedW
  dotLine(LM + sessFilled, y + 0.5, prevStart - 1)
  doc.text(prevLabel, prevStart, y)
  if (earned) {
    doc.setFont('helvetica', 'bold')
    doc.text(earned, prevStart + prevLabelW + 1, y)
    doc.setFont('helvetica', 'normal')
  }
  y += 7

  // Backlog courses box
  doc.setLineWidth(0.35)
  const boxX  = LM + 4
  const boxLW = 44
  const boxVW = CW - boxLW - 8

  // Format backlog string: if user typed comma/space separated course numbers
  let backlogText = ''
  if (backlogs) {
    const rawTokens = String(backlogs).split(/[,;\s]+/).filter(Boolean)
    backlogText = rawTokens.length > 0 ? rawTokens.join(', ') : String(backlogs)
  }

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  const backlogLines = backlogText ? doc.splitTextToSize(backlogText, boxVW - 6) : []
  const lineHeight = 4.2
  const boxH = Math.max(10, backlogLines.length * lineHeight + 4)

  doc.rect(boxX, y, boxLW, boxH)
  doc.rect(boxX + boxLW, y, boxVW, boxH)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  const labelCenterY = y + boxH / 2 - 1.5
  doc.text('Course No. of', boxX + 2, labelCenterY)
  doc.text('Backlog courses', boxX + 2, labelCenterY + 4)

  if (backlogLines.length > 0) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    const startValY = y + (boxH > 10 ? 4.5 : (boxH / 2 + 1.5))
    backlogLines.forEach((lineStr, idx) => {
      doc.text(lineStr, boxX + boxLW + 3, startValY + idx * lineHeight)
    })
    doc.setFont('helvetica', 'normal')
  }
  y += boxH + 6

  // ─── COURSES SECTION ────────────────────────────────────────────
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Courses to be registered in this semester :', LM, y)
  y += 5

  // Sort courses by course_no in ascending order
  const sortedRegs = [...regs].sort((a, b) => {
    const codeA = a.course?.course_no || ''
    const codeB = b.course?.course_no || ''
    return codeA.localeCompare(codeB, undefined, { numeric: true, sensitivity: 'base' })
  })

  const totalCredits = sortedRegs.reduce((sum, r) => sum + (Number(r.course?.credits) || 0), 0)

  // Build rows — always at least 10 data rows
  const dataRows = sortedRegs.map(r => [
    r.course?.course_no || '',
    r.course?.title || r.course?.course_title || '',
    r.course?.credits != null ? String(r.course.credits) : '',
  ])
  while (dataRows.length < 10) dataRows.push(['', '', ''])
  dataRows.push(['', 'Total Credit of this Semester', totalCredits > 0 ? totalCredits.toFixed(1) : ''])

  autoTable(doc, {
    startY: y,
    head: [['Course No.', 'Course Title', 'Credit']],
    body: dataRows,
    margin: { left: LM, right: LM },
    tableWidth: CW,
    styles: {
      fontSize: 9.5,
      cellPadding: { top: 2.5, right: 2, bottom: 2.5, left: 2 },
      lineColor: [30, 30, 30],
      lineWidth: 0.35,
      textColor: [0, 0, 0],
      font: 'helvetica',
      minCellHeight: 7,
    },
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      fontStyle: 'normal',
      halign: 'center',
      lineColor: [30, 30, 30],
    },
    columnStyles: {
      0: { cellWidth: 30, halign: 'center' },
      1: { cellWidth: 120, halign: 'left' },
      2: { cellWidth: 20, halign: 'center' },
    },
    didParseCell(data) {
      if (data.section === 'body' && data.row.index === dataRows.length - 1) {
        data.cell.styles.fontStyle = 'bold'
        if (data.column.index === 1) data.cell.styles.halign = 'center'
      }
    },
  })

  y = doc.lastAutoTable.finalY + 8

  // ─── ADVISER COMMENT ────────────────────────────────────────────
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text("Adviser's Comment (if any)", LM, y)
  dotLine(LM + doc.getTextWidth("Adviser's Comment (if any)") + 2, y + 0.5, RM)
  y += 7
  dotLine(LM, y + 0.5, RM)
  y += 14

  // ─── SIGNATURES ──────────────────────────────────────────────────
  const sigLabels = [
    'Signature of the Student',
    'Signature of the Adviser',
    'Signature of the Controller',
  ]
  const colW = CW / 3
  sigLabels.forEach((label, i) => {
    const cx = LM + i * colW + colW / 2
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(label, cx, y, { align: 'center' })
    const tw = doc.getTextWidth(label)
    solidLine(cx - tw / 2, y + 1, cx + tw / 2)
  })
  y += 13

  // ─── DATE ────────────────────────────────────────────────────────
  doc.setFontSize(10)
  doc.text('Date :', LM, y)
  solidLine(LM + doc.getTextWidth('Date :') + 3, y + 0.5, LM + 65)
  y += 8

  // ─── FOOTER NOTE ─────────────────────────────────────────────────
  doc.setFontSize(9)
  doc.text('Students are asked to cross out the irrelevant Terms.', LM, y)
  solidLine(LM, y + 1.5, RM)

  // ─── SAVE ────────────────────────────────────────────────────────
  const id = user?.student_id || 'student'
  const date = new Date().toISOString().slice(0, 10)

  // Derive term code (e.g. 3-2 for 3rd Year Even, 1-1 for 1st Year Odd)
  let yearStr = user?.academic_year || extras?.academicYear || ''
  let semStr  = user?.semester      || extras?.semester     || ''

  if ((!yearStr || !semStr) && Array.isArray(regs) && regs.length > 0) {
    const freq = {}
    regs.forEach(r => {
      const y = r.course?.academic_year || ''
      const s = r.course?.semester || ''
      if (y || s) {
        const key = `${y}|||${s}`
        freq[key] = (freq[key] || 0) + 1
      }
    })
    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1])
    if (sorted.length > 0 && sorted[0][0]) {
      const [y, s] = sorted[0][0].split('|||')
      yearStr = yearStr || y
      semStr  = semStr  || s
    }
  }

  const yearNum = { '1st Year': '1', '2nd Year': '2', '3rd Year': '3', '4th Year': '4' }[yearStr]
    || yearStr.match(/\d/)?.[0] || '1'
  const semNum  = { 'Odd': '1', 'Even': '2', 'odd': '1', 'even': '2' }[semStr]
    || (semStr.toLowerCase().includes('odd') ? '1' : '2')

  const termCode = `${yearNum}-${semNum}`
  doc.save(`${id}_${termCode}_CourseRegistration_${date}.pdf`)
}
