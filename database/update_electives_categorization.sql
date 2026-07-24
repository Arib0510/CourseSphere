-- =========================================================================
-- CourseSphere Database Update: Delete Placeholders & Categorize Electives
-- Run this in your Supabase SQL Editor
-- =========================================================================

-- 1. Remove obsolete Elective Placeholder courses
DELETE FROM public.courses
WHERE course_no IN ('ETE 3219', 'ETE 3220', 'ETE 4119', 'ETE 4218')
   OR course_title ILIKE '%Placeholder%';

-- 2. Update Elective-I courses to 3rd Year, Even Semester
UPDATE public.courses
SET 
  academic_year = '3rd Year',
  semester      = 'Even'
WHERE category = 'Elective-I'
   OR course_no IN (
     'ETE 3221', 'ETE 3222', 'ETE 3223', 'ETE 3224',
     'ETE 3225', 'ETE 3226', 'ETE 3237', 'ETE 3238',
     'ETE 3229', 'ETE 3230', 'ETE 3231', 'ETE 3232',
     'ETE 3233', 'ETE 3234', 'ETE 3235', 'ETE 3236'
   );

-- 3. Update Elective-II courses to 4th Year, Odd Semester
UPDATE public.courses
SET 
  academic_year = '4th Year',
  semester      = 'Odd'
WHERE category = 'Elective-II'
   OR course_no IN (
     'ETE 4121', 'ETE 4123', 'ETE 4125', 'ETE 4127',
     'ETE 4129', 'ETE 4131', 'ETE 4133', 'ETE 4135',
     'ETE 4137', 'ETE 4139'
   );

-- 4. Update Elective-III courses to 4th Year, Even Semester
UPDATE public.courses
SET 
  academic_year = '4th Year',
  semester      = 'Even'
WHERE category = 'Elective-III'
   OR course_no IN (
     'ETE 4217', 'ETE 4219', 'ETE 4221', 'ETE 4223',
     'ETE 4225', 'ETE 4227', 'ETE 4229', 'ETE 4231',
     'ETE 4233'
   );

-- Verify remaining courses
SELECT course_no, course_title, academic_year, semester, category 
FROM public.courses 
WHERE category LIKE 'Elective%'
ORDER BY category, course_no;
