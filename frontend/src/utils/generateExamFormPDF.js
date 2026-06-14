import jsPDF from 'jspdf'

const toBn = (n) => String(n).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[+d])

// Colon rendered in Arial so Bengali fonts don't swap it for the visarga (ঃ)
const colon = `<span style="font-family:Arial,sans-serif;"> :</span>`

function buildFormHTML(user, registrations, examOptions = {}) {
  const nameEn = user?.full_name || user?.name || ''
  const nameBn = user?.name_bangla || ''
  const fatherEn = user?.father_name || ''
  const fatherBn = user?.father_name_bangla || ''
  const rawRegNo = user?.registration_no || ''
  // Strip academic session suffix (e.g. /2022-23) — keep only the number
  const regNo = toBn(rawRegNo.replace(/\/.*$/, ''))
  // Extract academic session from reg no suffix (e.g. "788/2022-23" → "2022-23")
  const regSessionMatch = rawRegNo.match(/\/(.+)$/)
  const sessionFromReg = regSessionMatch ? toBn(regSessionMatch[1]) : ''
  const rollNo = toBn(user?.student_id || '')
  const session = user?.academic_session || ''
  const sessionBn = sessionFromReg || toBn(session)
  const address = user?.address_current || ''

  const examYear = toBn(examOptions.examYear || '')
  const studyYear = examOptions.studyYear || ''
  const koushal = examOptions.koushal || ''
  const semesterNo = examOptions.semesterNo || ''
  const examType = examOptions.examType || 'semester'

  // Semester type: ✓ sits above the label via position:absolute (no extra line height)
  const examTypeHTML = [
    { key: 'semester', label: 'সেমিস্টার' },
    { key: 'backlog', label: 'ব্যাকলগ' },
    { key: 'short', label: 'শর্ট সেমিস্টার' },
  ].map(({ key, label }) =>
    examType === key
      ? `<span style="display:inline-block;position:relative;"><span style="position:absolute;top:-10px;left:0;right:0;text-align:center;font-size:9px;font-family:Arial,sans-serif;line-height:1;">✓</span>${label}</span>`
      : label
  ).join('/')

  // Dotted underline helper — clean uniform style
  const dl = (width, val = '') =>
    `<span style="display:inline-block;min-width:${width}px;border-bottom:1px dotted #333;vertical-align:baseline;padding:0 4px 2px;text-align:left;">${val}</span>`

  const rows = Array.from({ length: 11 }, (_, i) => {
    const reg = registrations[i]
    return `<tr>
      <td style="text-align:center;border:1px solid #333;padding:6px 4px;font-size:11px;vertical-align:top;">(${toBn(i + 1)})</td>
      <td style="text-align:center;border:1px solid #333;padding:6px 6px;font-size:11px;vertical-align:top;">${reg?.course?.course_no || ''}</td>
      <td style="border:1px solid #333;padding:6px 8px;font-size:11px;vertical-align:top;">${reg?.course?.course_title || reg?.course?.title || ''}</td>
    </tr>`
  }).join('')

  return `
<div id="exam-form-root" style="
  width:710px;
  margin:0 auto;
  padding:18px 32px 14px;
  font-family:'Kalpurush','SolaimanLipi','Noto Sans Bengali','Hind Siliguri',Arial,sans-serif;
  font-size:12px;
  line-height:1.55;
  color:#000;
  background:#fff;
  box-sizing:border-box;
">

  <!-- HEADER: logo centered with text -->
  <div style="display:flex;align-items:center;gap:12px;margin-bottom:6px;">
    <img src="/ruet-logo.png"
         style="width:62px;height:62px;object-fit:contain;flex-shrink:0;filter:grayscale(1);"
         crossorigin="anonymous"
         onerror="this.style.display='none';" />
    <div style="flex:1;text-align:center;">
      <div style="font-style:italic;font-size:10.5px;margin-bottom:1px;">ঐশী জ্যোতিই আমাদের পথ প্রদর্শক</div>
      <div style="font-weight:bold;font-size:13px;margin-bottom:1px;">পরীক্ষা নিয়ন্ত্রকের কার্যালয়</div>
      <div style="font-weight:bold;font-size:16px;">রাজশাহী প্রকৌশল ও প্রযুক্তি বিশ্ববিদ্যালয়</div>
    </div>
  </div>

  <!-- SINGLE RULE DIVIDER -->
  <div style="border-top:2.5px solid #000;margin-bottom:8px;"></div>

  <!-- TITLE -->
  <div style="text-align:center;padding:2px 8px;margin-bottom:8px;">
    <div style="font-weight:bold;font-size:14.5px;margin-bottom:2px;">বি.এস.সি. ইঞ্জিনিয়ারিং পরীক্ষায় অংশ গ্রহণের আবেদনপত্র</div>
    <div style="font-size:10px;">(ফরমের ১ম অংশ ছাত্র, ২য় অংশ বিভাগীয় প্রধানের অফিস এবং ৩য় অংশ পরীক্ষা নিয়ন্ত্রকের অফিস পূরণ করিবে)</div>
  </div>

  <!-- ADDRESS BLOCK -->
  <div style="margin-bottom:6px;font-size:12px;line-height:1.7;text-align:left;">
    বরাবর,<br/>পরীক্ষা নিয়ন্ত্রক,<br/>রাজশাহী প্রকৌশল ও প্রযুক্তি বিশ্ববিদ্যালয়।
  </div>

  <!-- INTRO PARAGRAPH -->
  <div style="margin-bottom:8px;font-size:12px;text-align:left;">
    <div>জনাব,</div>
    <div style="margin-top:3px;padding-left:20px;">
      আমি ${dl(36, '২০' + examYear)} সালের বি.এস.সি. ইঞ্জিনিয়ারিং ${dl(50, studyYear)} বর্ষ ${dl(56, koushal)} কৌশল ${dl(50, semesterNo)} ${examTypeHTML} পরীক্ষায় নিয়মিত/অনিয়মিত পরীক্ষার্থী রূপে অংশ গ্রহণের অনুমতি প্রদানের জন্য আপনার নিকট সবিনয় আবেদন করিতেছি।
    </div>
  </div>

  <!-- SECTION 1: STUDENT NAME -->
  <div style="margin-bottom:6px;font-size:12px;text-align:left;">
    <div><b>১। পরীক্ষার্থীর পূর্ণ নাম স্পষ্টাক্ষরে (এস.এস.সি সার্টিফিকেট অনুসারে)</b></div>
    <div style="margin-top:3px;padding-left:16px;">বাংলা${colon} ${dl(496, nameBn)}</div>
    <div style="margin-top:3px;padding-left:16px;">ইংরেজী${colon} ${dl(488, nameEn)}</div>
  </div>

  <!-- SECTION 2: FATHER'S NAME -->
  <div style="margin-bottom:6px;font-size:12px;text-align:left;">
    <div><b>২। পিতার নাম</b></div>
    <div style="margin-top:3px;padding-left:16px;">বাংলা${colon} ${dl(496, fatherBn)}</div>
    <div style="margin-top:3px;padding-left:16px;">ইংরেজী${colon} ${dl(488, fatherEn)}</div>
  </div>

  <!-- SECTION 3: REG NO / ACADEMIC YEAR / ROLL -->
  <div style="margin-bottom:6px;font-size:12px;text-align:left;">
    <b>৩।</b> নিবন্ধন সংখ্যা${colon} ${dl(130, regNo)}&nbsp;&nbsp;শিক্ষা বর্ষ${colon} ${dl(110, sessionBn)}&nbsp;&nbsp;রোল নং${colon} ${dl(100, rollNo)}
  </div>

  <!-- SECTION 4: CURRENT ADDRESS -->
  <div style="margin-bottom:8px;font-size:12px;text-align:left;">
    <div><b>৪।</b> বর্তমান ঠিকানা${colon} ${dl(470, address)}</div>
    <div style="border-bottom:1px dotted #333;height:12px;margin-top:2px;"></div>
  </div>

  <!-- SECTION 5: COURSE TABLE -->
  <div style="margin-bottom:6px;text-align:left;">
    <div style="font-size:12px;margin-bottom:4px;"><b>৫। যে বিষয় সমূহে পরীক্ষা দিতে ইচ্ছুক</b></div>
    <table style="width:85%;border-collapse:collapse;margin:0 auto;table-layout:fixed;line-height:1.3;font-size:11px;">
      <colgroup>
        <col style="width:56px;">
        <col style="width:120px;">
        <col>
      </colgroup>
      <thead>
        <tr>
          <th style="border:1px solid #333;padding:4px 5px;text-align:center;font-size:11px;font-weight:bold;vertical-align:middle;">ক্রঃ নং</th>
          <th style="border:1px solid #333;padding:4px 5px;text-align:center;font-size:11px;font-weight:bold;vertical-align:middle;">কোর্স নং</th>
          <th style="border:1px solid #333;padding:4px 5px;text-align:center;font-size:11px;font-weight:bold;vertical-align:middle;">কোর্সের শিরোনাম</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  </div>

  <!-- DECLARATION -->
  <div style="font-size:11px;margin-bottom:6px;text-align:left;">
    আমি অঙ্গীকার করিতেছি যে, যদি আমার প্রদত্ত তথ্যাবলী অসত্য প্রমাণিত হয় অথবা এই পরীক্ষায় আমার অংশ গ্রহণের ব্যাপারে কোন আপত্তি উত্থাপিত হয়, তাহা হইলে বিশ্ববিদ্যালয় কর্তৃপক্ষের সিদ্ধান্ত মানিয়া লইব।
  </div>

  <!-- DATE + SIGNATURE — flex-end so dotted line sits at text baseline -->
  <div style="display:flex;justify-content:space-between;margin-top:6px;font-size:12px;">
    <div style="display:flex;align-items:flex-end;gap:4px;">
      <span style="white-space:nowrap;padding-bottom:2px;">তারিখ${colon}</span>
      <span style="display:block;min-width:120px;border-bottom:1px dotted #333;"></span>
    </div>
    <div style="display:flex;align-items:flex-end;gap:4px;">
      <span style="white-space:nowrap;padding-bottom:2px;">পরীক্ষার্থীর পূর্ণ স্বাক্ষর${colon}</span>
      <span style="display:block;min-width:200px;border-bottom:1px dotted #333;"></span>
    </div>
  </div>

  <div style="border-top:2px solid #000;margin:6px 0;"></div>

  <!-- DEPT HEAD SECTION -->
  <div style="margin-bottom:4px;">
    <div style="text-align:center;font-weight:bold;font-size:13px;text-decoration:underline;margin-bottom:4px;">বিভাগীয় প্রধানের অফিস পূরণ করিবে</div>
    <div style="font-size:11px;text-align:left;">
      আমি নিশ্চয়তা প্রদান করিতেছি যে, উপরোল্লিখিত পরীক্ষার্থীর তত্ত্বীয়/ব্যবহারিক ক্লাস সম্পর্কে যথাযথ ব্যবস্থা গৃহীত হইয়াছে। তাহাকে উল্লেখিত পরীক্ষায় অংশ গ্রহণের জন্য সুপারিশ করা হইল / হইল না।
    </div>
    <div style="min-height:36px;"></div>
    <div style="border-bottom:1px dotted #333;width:200px;margin-left:auto;margin-bottom:0;"></div>
    <div style="text-align:right;font-size:12px;">বিভাগীয় প্রধান</div>
  </div>

  <div style="border-top:2px solid #000;margin:6px 0;"></div>

  <!-- EXAM CONTROLLER SECTION -->
  <div>
    <div style="text-align:center;font-weight:bold;font-size:13px;text-decoration:underline;margin-bottom:4px;">পরীক্ষা নিয়ন্ত্রকের অফিস পূরণ করিবে</div>
    <div style="font-size:11px;text-align:left;">
      উপরোক্ত ছাত্র/ছাত্রীকে পরীক্ষায় অংশ গ্রহণের অনুমতি প্রদান করা হইল / হইল না।
    </div>
    <div style="min-height:36px;"></div>
    <div style="border-bottom:1px dotted #333;width:200px;margin-left:auto;margin-bottom:0;"></div>
    <div style="text-align:right;font-size:12px;">পরীক্ষা নিয়ন্ত্রক</div>
  </div>

</div>`
}

export async function generateExamFormPDF(user, registrations, examOptions = {}) {
  const wrapper = document.createElement('div')
  wrapper.style.cssText = 'position:fixed;left:-9999px;top:0;z-index:-9999;width:800px;overflow:visible;'
  wrapper.innerHTML = buildFormHTML(user, registrations, examOptions)
  document.body.appendChild(wrapper)

  await document.fonts.ready

  try {
    const { default: html2canvas } = await import('html2canvas')
    const el = wrapper.querySelector('#exam-form-root')

    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: 800,
    })

    const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })
    const pageW = 210
    const pageH = 297

    // Scale to fit A4, then center horizontally on the page
    const canvasAspect = canvas.width / canvas.height
    let renderW = pageW
    let renderH = pageW / canvasAspect
    if (renderH > pageH) {
      renderH = pageH
      renderW = pageH * canvasAspect
    }
    const xOffset = (pageW - renderW) / 2

    doc.addImage(canvas.toDataURL('image/jpeg', 0.93), 'JPEG', xOffset, 0, renderW, renderH)

    const id = user?.student_id || 'student'
    const date = new Date().toISOString().slice(0, 10)
    doc.save(`RUET_ExamForm_${id}_${date}.pdf`)
  } finally {
    document.body.removeChild(wrapper)
  }
}
