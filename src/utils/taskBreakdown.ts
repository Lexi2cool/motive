export interface SubTask {
  id: string
  title: string
  completed: boolean
}

interface BreakdownPattern {
  keywords: string[]
  generate: (_title: string) => SubTask[]
}

function generateId() {
  return crypto.randomUUID()
}

function subtask(title: string): SubTask {
  return { id: generateId(), title, completed: false }
}

const patterns: BreakdownPattern[] = [
  {
    keywords: ['exam', 'test', 'quiz', 'midterm', 'final'],
    generate: (_title) => [
      subtask('📅 Set exam date and create a study schedule'),
      subtask('📖 Gather all notes, textbooks, and past papers'),
      subtask('📝 Identify weak topics and list them'),
      subtask('🧠 Create summary sheets for each weak topic'),
      subtask('📚 Review and condense notes into flashcards'),
      subtask('✍️ Practice past exam papers under timed conditions'),
      subtask('❌ Review mistakes and re-study weak areas'),
      subtask('🧘 Do a final light review the day before'),
    ],
  },
  {
    keywords: ['essay', 'paper', 'article', 'report', 'write'],
    generate: (_title) => [
      subtask('📋 Understand the prompt and grading rubric'),
      subtask('🔍 Research and collect 5-10 quality sources'),
      subtask('📝 Create a detailed outline'),
      subtask('✍️ Write the first draft (intro, body, conclusion)'),
      subtask('🔎 Take a break, then proofread'),
      subtask('✨ Edit for clarity, flow, and citations'),
      subtask('📄 Format and finalize'),
    ],
  },
  {
    keywords: ['project', 'build', 'create', 'make', 'develop'],
    generate: (_title) => [
      subtask('📋 Define project goals and requirements'),
      subtask('📐 Plan the architecture or structure'),
      subtask('🧩 Break project into milestones'),
      subtask('🛠️ Start with the MVP/core feature'),
      subtask('🔧 Build and test each component'),
      subtask('🐛 Debug and fix issues'),
      subtask('🎨 Polish UI/UX and add finishing touches'),
      subtask('📦 Prepare final deliverable'),
    ],
  },
  {
    keywords: ['study', 'revise', 'learn', 'memorize'],
    generate: (_title) => [
      subtask('📅 Schedule study sessions over multiple days'),
      subtask('📖 Preview the material (skim headings, diagrams)'),
      subtask('🧠 Active recall: close book and write what you remember'),
      subtask('📝 Make concise notes or flashcards'),
      subtask('🔄 Spaced repetition: review previous day\'s notes first'),
      subtask('❓ Teach the concept out loud (Feynman technique)'),
      subtask('✅ Take a practice quiz or test yourself'),
      subtask('📊 Track retention and re-iterate on weak spots'),
    ],
  },
  {
    keywords: ['presentation', 'present', 'speech', 'talk', 'pitch'],
    generate: (_title) => [
      subtask('📋 Outline key messages (3-5 main points)'),
      subtask('🎨 Design slides or visual aids'),
      subtask('✍️ Write speaker notes for each slide'),
      subtask('🔄 Rehearse out loud at least 3 times'),
      subtask('⏱️ Time yourself and trim if needed'),
      subtask('🎤 Practice in front of a mirror or record yourself'),
      subtask('📝 Prepare backup notes for Q&A'),
    ],
  },
  {
    keywords: ['homework', 'assignment', 'task', 'hw'],
    generate: (_title) => [
      subtask('📋 Read all instructions carefully'),
      subtask('📝 List every question/requirement'),
      subtask('🧠 Tackle the hardest part first'),
      subtask('✍️ Complete remaining questions'),
      subtask('🔎 Double-check answers against instructions'),
      subtask('📤 Submit before the deadline'),
    ],
  },
  {
    keywords: ['lab', 'experiment', 'practical'],
    generate: (_title) => [
      subtask('📋 Read the lab manual and safety guidelines'),
      subtask('🧪 List materials and equipment needed'),
      subtask('📝 Write down the hypothesis'),
      subtask('🔬 Set up the apparatus'),
      subtask('📊 Record observations and measurements'),
      subtask('📈 Analyze results and create graphs'),
      subtask('📝 Write the lab report'),
    ],
  },
]

const genericPatterns: BreakdownPattern[] = [
  {
    keywords: ['improve', 'better', 'master', 'learn'],
    generate: (_title) => [
      subtask('📋 Define what "done" looks like'),
      subtask('🔍 Research best practices and resources'),
      subtask('📝 Create a learning/improvement plan'),
      subtask('🛠️ Practice in focused sessions'),
      subtask('📊 Track progress and adjust strategy'),
      subtask('🏆 Test yourself on the skill'),
    ],
  },
  {
    keywords: ['plan', 'organize', 'prepare'],
    generate: (_title) => [
      subtask('📋 Write down the goal'),
      subtask('📅 Set a deadline'),
      subtask('🧩 Break into smaller steps'),
      subtask('⏰ Schedule each step'),
      subtask('✅ Execute and review'),
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

  return {
    confidence: 'low',
    breakdown: [
      subtask('📋 Clarify what the goal really is'),
      subtask('📝 Write down the first step'),
      subtask('⏰ Schedule time to work on it'),
      subtask('🔄 Break into smaller chunks'),
      subtask('✅ Execute and check progress'),
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
