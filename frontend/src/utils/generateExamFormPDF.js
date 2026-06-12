import jsPDF from 'jspdf'

const toBn = (n) => String(n).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[+d])

function buildFormHTML(user, registrations, examOptions = {}) {
  const nameEn   = user?.full_name || user?.name || ''
  const nameBn   = user?.name_bangla || ''
  const fatherEn = user?.father_name || ''
  const fatherBn = user?.father_name_bangla || ''
  const regNo    = toBn(user?.registration_no || '')
  const rollNo   = toBn(user?.student_id || '')
  const session  = user?.academic_session || ''
  const address  = user?.address_current || ''

  const yearMatch  = session.match(/20(\d{2})[–\-—]20(\d{2})/)
  const yearFromBn = yearMatch ? toBn(yearMatch[1]) : ''
  const yearToBn   = yearMatch ? toBn(yearMatch[2]) : ''

  const examYear   = toBn(examOptions.examYear   || '')
  const studyYear  = examOptions.studyYear  || ''
  const koushal    = examOptions.koushal    || ''
  const semesterNo = examOptions.semesterNo || ''
  const examType   = examOptions.examType   || 'semester'

  const examTypeHTML = [
    { key: 'semester', label: 'সেমিস্টার' },
    { key: 'backlog',  label: 'ব্যাকলগ' },
    { key: 'short',    label: 'শর্ট সেমিস্টার' },
  ].map(({ key, label }) =>
    examType === key ? `<b style="text-decoration:underline;">✓${label}</b>` : label
  ).join('/')

  // vertical-align:middle + padding-bottom keeps text centered above the dotted line
  const dl = (width, val = '') =>
    `<span style="display:inline-block;min-width:${width}px;border-bottom:1px dotted #333;vertical-align:middle;padding:0 2px 3px;">${val}</span>`

  const rows = Array.from({ length: 11 }, (_, i) => {
    const reg = registrations[i]
    return `<tr>
      <td style="text-align:center;border:1px solid #333;padding:3px 3px;font-size:10.5px;vertical-align:middle;">(${toBn(i + 1)})</td>
      <td style="border:1px solid #333;padding:3px 5px;font-size:10.5px;vertical-align:middle;">${reg?.course?.course_no || ''}</td>
      <td style="border:1px solid #333;padding:3px 5px;font-size:10.5px;vertical-align:middle;">${reg?.course?.course_title || reg?.course?.title || ''}</td>
    </tr>`
  }).join('')

  return `
<div id="exam-form-root" style="
  width:710px;
  padding:12px 22px 10px;
  font-family:'SutonnyMJ','Kalpurush','SolaimanLipi','Noto Sans Bengali','Hind Siliguri',Arial,sans-serif;
  font-size:11.5px;
  line-height:1.42;
  color:#000;
  background:#fff;
  box-sizing:border-box;
">

  <!-- HEADER: logo left, text centered in remaining space -->
  <div style="display:flex;align-items:center;gap:10px;margin-bottom:5px;">
    <img src="/ruet-logo.png"
         style="width:64px;height:64px;object-fit:contain;flex-shrink:0;filter:grayscale(1);"
         crossorigin="anonymous"
         onerror="this.style.display='none';" />
    <div style="flex:1;text-align:center;">
      <div style="font-style:italic;font-size:10px;margin-bottom:1px;">ঐশী জ্যোতিই আমাদের পথ প্রদর্শক</div>
      <div style="font-weight:bold;font-size:12.5px;margin-bottom:1px;">পরীক্ষা নিয়ন্ত্রকের কার্যালয়</div>
      <div style="font-weight:bold;font-size:15px;">রাজশাহী প্রকৌশল ও প্রযুক্তি বিশ্ববিদ্যালয়</div>
    </div>
  </div>

  <!-- SINGLE RULE DIVIDER -->
  <div style="border-top:2.5px solid #000;margin-bottom:6px;"></div>

  <!-- TITLE (no box) -->
  <div style="text-align:center;padding:2px 8px;margin-bottom:6px;">
    <div style="font-weight:bold;font-size:14.5px;">বি.এস.সি. ইঞ্জিনিয়ারিং পরীক্ষায় অংশ গ্রহণের আবেদনপত্র</div>
    <div style="font-size:10px;">(ফরমের ১ম অংশ ছাত্র, ২য় অংশ বিভাগীয় প্রধানের অফিস এবং ৩য় অংশ পরীক্ষা নিয়ন্ত্রকের অফিস পূরণ করিবে)</div>
  </div>

  <!-- ADDRESS BLOCK -->
  <div style="margin-bottom:4px;font-size:11.5px;line-height:1.65;">
    বরাবর,<br/>পরীক্ষা নিয়ন্ত্রক,<br/>রাজশাহী প্রকৌশল ও প্রযুক্তি বিশ্ববিদ্যালয়।
  </div>

  <!-- INTRO PARAGRAPH WITH FILLED FIELDS -->
  <div style="margin-bottom:5px;font-size:11.5px;">
    <div>জনাব,</div>
    <div style="margin-top:2px;padding-left:18px;">
      ২০${dl(26, examYear)}সালের বি.এস.সি. ইঞ্জিনিয়ারিং${dl(64, studyYear)}বর্ষ${dl(64, koushal)}কৌশল${dl(52, semesterNo)}${examTypeHTML} পরীক্ষায় নিয়মিত/অনিয়মিত পরীক্ষার্থী রূপে অংশ গ্রহণের অনুমতি প্রদানের জন্য আপনার নিকট সবিনয় আবেদন করিতেছি।
    </div>
  </div>

  <!-- SECTION 1: STUDENT NAME -->
  <div style="margin-bottom:4px;font-size:11.5px;">
    <div><b>১। পরীক্ষার্থীর পূর্ণ নাম স্পষ্টাক্ষরে (এস.এস.সি সার্টিফিকেট অনুসারে) ঃ</b></div>
    <div style="margin-top:2px;padding-left:14px;">বাংলা ঃ ${dl(492, nameBn)}</div>
    <div style="margin-top:2px;padding-left:14px;">ইংরেজী ঃ ${dl(485, nameEn)}</div>
  </div>

  <!-- SECTION 2: FATHER'S NAME -->
  <div style="margin-bottom:4px;font-size:11.5px;">
    <div><b>২। পিতার নাম ঃ</b></div>
    <div style="margin-top:2px;padding-left:14px;">বাংলা ঃ ${dl(492, fatherBn)}</div>
    <div style="margin-top:2px;padding-left:14px;">ইংরেজী ঃ ${dl(485, fatherEn)}</div>
  </div>

  <!-- SECTION 3: REG NO / ACADEMIC YEAR / ROLL -->
  <div style="margin-bottom:4px;font-size:11.5px;">
    ৩। নিবন্ধন সংখ্যা ঃ ${dl(130, regNo)}&nbsp;&nbsp;শিক্ষা বর্ষ ঃ ২০${dl(24, yearFromBn)}-২০${dl(24, yearToBn)}&nbsp;&nbsp;রোল নং${dl(85, rollNo)}
  </div>

  <!-- SECTION 4: CURRENT ADDRESS -->
  <div style="margin-bottom:5px;font-size:11.5px;">
    <div>৪। বর্তমান ঠিকানা ঃ ${dl(468, address)}</div>
    <div style="border-bottom:1px dotted #333;height:11px;margin-top:2px;"></div>
  </div>

  <!-- SECTION 5: COURSE TABLE (centered) -->
  <div style="margin-bottom:4px;">
    <div style="font-size:11.5px;margin-bottom:3px;"><b>৫। যে বিষয় সমূহে পরীক্ষা দিতে ইচ্ছুক ঃ</b></div>
    <table style="width:80%;border-collapse:collapse;margin:0 auto;table-layout:fixed;">
      <colgroup>
        <col style="width:52px;">
        <col style="width:110px;">
        <col>
      </colgroup>
      <thead>
        <tr>
          <th style="border:1px solid #333;padding:3px 4px;text-align:center;font-size:10.5px;font-weight:bold;text-decoration:underline;vertical-align:middle;">ক্রম নং</th>
          <th style="border:1px solid #333;padding:3px 4px;text-align:center;font-size:10.5px;font-weight:bold;text-decoration:underline;vertical-align:middle;">কোর্স নং</th>
          <th style="border:1px solid #333;padding:3px 4px;text-align:center;font-size:10.5px;font-weight:bold;text-decoration:underline;vertical-align:middle;">কোর্সের শিরোনাম</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  </div>

  <!-- DECLARATION -->
  <div style="font-size:10.5px;margin-bottom:4px;">
    আমি অঙ্গীকার করিতেছি যে, যদি আমার প্রদত্ত তথ্যাবলী অসত্য প্রমাণিত হয় অথবা এই পরীক্ষায় আমার অংশ গ্রহণের ব্যাপারে কোন আপত্তি উত্থাপিত হয়, তাহা হইলে বিশ্ববিদ্যালয় কর্তৃপক্ষের সিদ্ধান্ত মানিয়া লইব।
  </div>

  <!-- DATE + SIGNATURE -->
  <div style="display:flex;justify-content:space-between;margin-bottom:4px;font-size:11.5px;">
    <div>তারিখ ঃ ${dl(105)}</div>
    <div>পরীক্ষার্থীর পূর্ণ স্বাক্ষর ঃ ${dl(170)}</div>
  </div>

  <div style="border-top:2px solid #000;margin:4px 0;"></div>

  <!-- DEPT HEAD SECTION -->
  <div style="margin-bottom:3px;">
    <div style="text-align:center;font-weight:bold;font-size:13px;text-decoration:underline;margin-bottom:3px;">বিভাগীয় প্রদানের অফিস পূরণ করিবে</div>
    <div style="font-size:10.5px;">
      আমি নিশ্চয়তা প্রদান করিতেছি যে, উপরোলিখিত পরীক্ষার্থীর তৃতীয়/ব্যবহারিক ক্লাস সম্পর্কে যথাযথ ব্যবস্থা গৃহীত হইয়াছে। তাহাকে উল্লেখিত পরীক্ষায় অংশ গ্রহণের জন্য সুপারিশ করা হইল / হইল না।
    </div>
    <div style="min-height:18px;"></div>
    <div style="text-align:right;font-size:11px;">বিভাগীয় প্রধান</div>
  </div>

  <div style="border-top:2px solid #000;margin:4px 0;"></div>

  <!-- EXAM CONTROLLER SECTION -->
  <div>
    <div style="text-align:center;font-weight:bold;font-size:13px;text-decoration:underline;margin-bottom:3px;">পরীক্ষা নিয়ন্ত্রকের অফিস পূরণ করিবে</div>
    <div style="font-size:10.5px;">
      উপরোক্ত ছাত্র/ছাত্রীকে পরীক্ষায় অংশ গ্রহণের জন্য অনুমতি করা হইল / হইল না।
    </div>
    <div style="min-height:18px;"></div>
    <div style="text-align:right;font-size:11px;">পরীক্ষা নিয়ন্ত্রক</div>
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

    // Scale entire canvas to fit exactly one A4 page
    const canvasAspect = canvas.width / canvas.height
    let renderW = pageW
    let renderH = pageW / canvasAspect
    if (renderH > pageH) {
      renderH = pageH
      renderW = pageH * canvasAspect
    }

    doc.addImage(canvas.toDataURL('image/jpeg', 0.93), 'JPEG', 0, 0, renderW, renderH)

    const id   = user?.student_id || 'student'
    const date = new Date().toISOString().slice(0, 10)
    doc.save(`RUET_ExamForm_${id}_${date}.pdf`)
  } finally {
    document.body.removeChild(wrapper)
  }
}
