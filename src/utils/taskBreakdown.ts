export interface SubTask {
  id: string
  title: string
  completed: boolean
}

interface BreakdownPattern {
  keywords: string[]
  generate: (title: string) => SubTask[]
}

function generateId() {
  return crypto.randomUUID()
}

function subtask(title: string): SubTask {
  return { id: generateId(), title, completed: false }
}

const patterns: BreakdownPattern[] = [
  {
    keywords: ['exam', 'test', 'quiz', 'midterm', 'final', 'assessment'],
    generate: (title) => [
      subtask(`📅 Set a study schedule for "${title}" - block 30-45 min sessions`),
      subtask('📖 Gather ALL materials: notes, textbook chapters, past papers, slides'),
      subtask('📝 Make a topic list: write every chapter/concept that could be tested'),
      subtask('🎯 Identify weak spots: mark topics you\'re confused about in red'),
      subtask('🧠 Create summary sheets for each weak topic (1 page max per topic)'),
      subtask('📚 Turn summaries into flashcards (physical or Anki)'),
      subtask('✍️ Do 2-3 past papers under timed exam conditions'),
      subtask('❌ Mark every wrong answer and re-learn that specific concept'),
      subtask('🧘 Light review only the day before - no new material'),
      subtask('✅ Pack bag, set alarm, and sleep early'),
    ],
  },
  {
    keywords: ['essay', 'paper', 'article', 'report', 'write', 'dissertation', 'thesis'],
    generate: (title) => [
      subtask(`📋 Deconstruct the prompt for "${title}" - highlight every requirement`),
      subtask('📝 Check the grading rubric: know exactly what gets an A'),
      subtask('🔍 Research phase: find 8-12 credible sources (books, journals, .edu sites)'),
      subtask('📥 Download/save all sources and take 5-10 notes per source'),
      subtask('🧠 Free-write for 10 mins: dump every idea you have about the topic'),
      subtask('📐 Create a detailed outline with intro, 3-5 body sections, conclusion'),
      subtask('✍️ Write the first draft - don\'t edit, just get words on page'),
      subtask('🔎 Take a 30-min break, then proofread for big-picture flow'),
      subtask('✨ Edit sentence by sentence: cut fluff, strengthen arguments'),
      subtask('📎 Add citations and format bibliography'),
      subtask('📄 Final format check: margins, font, spacing, title page'),
    ],
  },
  {
    keywords: ['project', 'build', 'create', 'make', 'develop', 'app', 'website', 'design'],
    generate: (title) => [
      subtask(`📋 Write a one-sentence goal for "${title}"`),
      subtask('📝 List every feature/requirement (must-have vs nice-to-have)'),
      subtask('📐 Sketch the structure: wireframes, architecture, or flowchart'),
      subtask('⏰ Set milestones with deadlines (Milestone 1, 2, 3...)'),
      subtask('🛠️ Build the core/ MVP first - ignore polish for now'),
      subtask('🧪 Test each feature as you build it (don\'t wait until the end)'),
      subtask('🐛 Debug and fix broken parts before moving on'),
      subtask('🎨 Polish UI/UX, add colors, icons, and transitions'),
      subtask('📝 Write documentation or README'),
      subtask('📦 Prepare the final deliverable'),
    ],
  },
  {
    keywords: ['study', 'revise', 'learn', 'memorize', 'cram', 'read', 'textbook'],
    generate: (title) => [
      subtask(`📅 Schedule study sessions over multiple days for "${title}"`),
      subtask('📖 Preview: skim headings, diagrams, summary boxes (10 mins)'),
      subtask('🧠 Active recall: close book and write everything you remember'),
      subtask('📝 Make concise notes or flashcards from what you forgot'),
      subtask('🔄 Review yesterday\'s notes BEFORE starting new material'),
      subtask('❓ Teach the concept out loud (Feynman technique)'),
      subtask('✅ Take a practice quiz or test yourself'),
      subtask('📊 Mark retention gaps and re-iterate on weak spots'),
      subtask('🧘 End with a 5-min review of all flashcards'),
    ],
  },
  {
    keywords: ['presentation', 'present', 'speech', 'talk', 'pitch', 'seminar'],
    generate: (title) => [
      subtask(`📋 Outline 3-5 key messages for "${title}"`),
      subtask('📝 Write the script or bullet points for each slide'),
      subtask('🎨 Design slides: max 1 idea per slide, big visuals, minimal text'),
      subtask('🔄 Rehearse out loud at least 3 times with a timer'),
      subtask('⏱️ Trim content if you\'re over time (cut, don\'t rush)'),
      subtask('🎤 Record yourself or practice in front of a mirror'),
      subtask('📝 Prepare 3 backup slides for Q&A'),
      subtask('👕 Pick your outfit and test your tech (clicker, mic, video)'),
    ],
  },
  {
    keywords: ['homework', 'assignment', 'task', 'hw', 'worksheet', 'problem set'],
    generate: (title) => [
      subtask(`📋 Read ALL instructions for "${title}" twice`),
      subtask('📝 List every question/requirement number'),
      subtask('🧠 Start with the hardest question while your brain is fresh'),
      subtask('✍️ Complete remaining questions in order'),
      subtask('🔎 Double-check every answer against the instructions'),
      subtask('📤 Submit before the deadline (set a 10-min early alarm)'),
    ],
  },
  {
    keywords: ['lab', 'experiment', 'practical', 'practicum', 'fieldwork'],
    generate: (title) => [
      subtask(`📋 Read the lab manual and safety guidelines for "${title}"`),
      subtask('🧪 List all materials and equipment needed'),
      subtask('📝 Write down the hypothesis and expected results'),
      subtask('🔬 Set up the apparatus carefully'),
      subtask('📊 Record observations and measurements in real-time'),
      subtask('📈 Analyze results: create graphs, calculate stats'),
      subtask('📝 Write the lab report: intro, method, results, discussion'),
      subtask('✅ Clean up and sign off'),
    ],
  },
  {
    keywords: ['revision', 'recode', 'rewrite', 'redo', 'fix', 'repair', 'debug'],
    generate: (title) => [
      subtask(`📋 Identify exactly what needs fixing in "${title}"`),
      subtask('🔍 Find the root cause - don\'t just patch symptoms'),
      subtask('📝 Make a list of all fixes needed, in priority order'),
      subtask('🛠️ Fix the critical issues first'),
      subtask('🧪 Test each fix individually'),
      subtask('✅ Verify everything works together'),
    ],
  },
  {
    keywords: ['research', 'investigate', 'analyse', 'analyze', 'explore', 'study'],
    generate: (title) => [
      subtask(`📋 Define the research question for "${title}"`),
      subtask('🔍 Find 10-15 credible sources'),
      subtask('📝 Take structured notes (quote + page number + your thought)'),
      subtask('🧠 Group notes into themes or arguments'),
      subtask('📐 Create an outline from your grouped notes'),
      subtask('✍️ Write a first draft following the outline'),
      subtask('✨ Edit and strengthen the analysis'),
    ],
  },
  {
    keywords: ['practice', 'rehearse', 'train', 'drill', 'revision'],
    generate: (title) => [
      subtask(`📋 Define the skill you\'re practicing for "${title}"`),
      subtask('📝 Break the skill into 3-5 sub-skills'),
      subtask('🛠️ Practice the hardest sub-skill first (20 mins)'),
      subtask('🔄 Practice remaining sub-skills'),
      subtask('📊 Track what improved and what still needs work'),
      subtask('🏆 Do a full run-through to test progress'),
    ],
  },
  {
    keywords: ['plan', 'organize', 'prepare', 'schedule', 'arrange'],
    generate: (title) => [
      subtask(`📋 Write down the end goal for "${title}"`),
      subtask('📝 Brainstorm every step needed (no filtering)'),
      subtask('📅 Put steps in order and assign deadlines'),
      subtask('⏰ Block time in your calendar for each step'),
      subtask('✅ Execute step 1 today'),
    ],
  },
  {
    keywords: ['read', 'book', 'novel', 'chapter', 'article', 'paper'],
    generate: (title) => [
      subtask(`📖 Set a reading goal for "${title}" (pages/chapters)`),
      subtask('📝 Preview: read table of contents, headings, summary'),
      subtask('🧠 Read actively: underline, note questions, summarize each section'),
      subtask('📝 Write 3 key takeaways after each chapter'),
      subtask('🔄 Review notes 10 mins after finishing'),
      subtask('✅ Write a 1-paragraph summary of the whole book/text'),
    ],
  },
  {
    keywords: ['math', 'calculus', 'algebra', 'geometry', 'statistics', 'probability'],
    generate: (title) => [
      subtask(`📋 List all topics covered in "${title}"`),
      subtask('📝 Review formulas and definitions for each topic'),
      subtask('🧠 Work through 5-10 example problems step-by-step'),
      subtask('✍️ Do 15 practice problems without looking at notes'),
      subtask('❌ Check answers and re-do every wrong problem twice'),
      subtask('📝 Create a formula cheat sheet'),
      subtask('✅ Timed test: 20 mins of mixed problems'),
    ],
  },
  {
    keywords: ['coding', 'programming', 'debug', 'software', 'code', 'script', 'function'],
    generate: (title) => [
      subtask(`📋 Understand the requirements for "${title}"`),
      subtask('📝 Write pseudocode or plan the logic'),
      subtask('🛠️ Build the basic structure/starter code'),
      subtask('🧪 Test each function as you write it'),
      subtask('🐛 Debug errors one at a time (use console.log/print)'),
      subtask('✨ Refactor: clean up code, add comments, improve efficiency'),
      subtask('✅ Run final tests and edge cases'),
    ],
  },
]

const genericPatterns: BreakdownPattern[] = [
  {
    keywords: ['improve', 'better', 'master', 'learn', 'get better at'],
    generate: (title) => [
      subtask(`📋 Define exactly what "done" looks like for "${title}"`),
      subtask('🔍 Research: find 3-5 tutorials/guides/books on the topic'),
      subtask('📝 Create a 7-day practice plan'),
      subtask('🛠️ Practice in focused 25-min sessions'),
      subtask('📊 Track daily progress in a log'),
      subtask('🏆 Test yourself at the end of the week'),
    ],
  },
  {
    keywords: ['plan', 'organize', 'prepare', 'schedule', 'arrange'],
    generate: (title) => [
      subtask(`📋 Write down the end goal for "${title}"`),
      subtask('📝 Brainstorm every step needed (no filtering)'),
      subtask('📅 Put steps in order and assign deadlines'),
      subtask('⏰ Block time in your calendar for each step'),
      subtask('✅ Execute step 1 today'),
    ],
  },
]

export function analyzeTaskTitle(title: string): { confidence: 'high' | 'medium' | 'low'; breakdown: SubTask[] } {
  const lower = title.toLowerCase()

  for (const pattern of [...patterns, ...genericPatterns]) {
    if (pattern.keywords.some(k => lower.includes(k))) {
      return { confidence: 'high', breakdown: pattern.generate(title) }
    }
  }

  const words = title.split(' ').filter(w => w.length > 3)
  const hasVerb = words.some(w => ['create', 'make', 'do', 'finish', 'complete', 'start', 'build', 'write', 'read', 'study', 'practice', 'review', 'prepare', 'plan', 'fix', 'solve'].includes(w.toLowerCase()))

  if (hasVerb) {
    return {
      confidence: 'medium',
      breakdown: [
        subtask(`📋 Clarify exactly what "${title}" means - write 1 sentence`),
        subtask('📝 Break it into 3-5 smaller steps'),
        subtask('⏰ Schedule time for the first step today'),
        subtask('🛠️ Complete step 1'),
        subtask('🔄 Review progress and adjust plan'),
        subtask('✅ Finish remaining steps one by one'),
      ],
    }
  }

  return {
    confidence: 'low',
    breakdown: [
      subtask(`📋 Rewrite "${title}" as an action verb (e.g., "Write...", "Study...", "Build...")`),
      subtask('📝 Define what success looks like'),
      subtask('🧩 Break into 3 smaller tasks'),
      subtask('⏰ Schedule the first one'),
      subtask('✅ Do it'),
    ],
  }
}

export function getBreakdownConfidence(title: string): 'high' | 'medium' | 'low' {
  const lower = title.toLowerCase()
  const allKeywords = [...patterns, ...genericPatterns].flatMap(p => p.keywords)
  const matches = allKeywords.filter(k => lower.includes(k)).length
  if (matches >= 2) return 'high'
  if (matches === 1) return 'medium'
  return 'low'
}
