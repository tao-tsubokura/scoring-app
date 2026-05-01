import { useState } from 'react'

// --- LCMベースのスコア計算（PHP実装に準拠） ---

function gcd(a, b) {
  while (b !== 0) {
    [a, b] = [b, a % b]
  }
  return Math.abs(a)
}

function lcm(a, b) {
  if (a === 0 || b === 0) return 0
  return Math.floor(Math.abs(a * b) / gcd(a, b))
}

/**
 * 全問題のスコアを計算する。
 * 問題ごとの解答欄数の違いをLCMで正規化し、偏りのない100点満点スコアを返す。
 *
 * attempt: 1=1回目正解(+2単位), 2=2回目正解(+1単位), 3=不正解(+0)
 */
function calculateTotalScore(problems, answers) {
  const totalQuestionCount = problems.length
  if (totalQuestionCount === 0) return 0

  const sectionCounts = problems.map(p => p.subProblems.length)
  const sectionsLcm = sectionCounts.reduce((acc, c) => lcm(acc, c), 1)
  const scoreDenominator = 2 * totalQuestionCount * sectionsLcm

  let weightedCorrectUnits = 0
  problems.forEach((problem, pIdx) => {
    const sectionCount = problem.subProblems.length
    if (sectionCount === 0) return
    const unitsPerSection = Math.floor(sectionsLcm / sectionCount)
    problem.subProblems.forEach((_, sIdx) => {
      const attempt = answers[pIdx][sIdx]
      if (attempt === 1) weightedCorrectUnits += 2 * unitsPerSection
      else if (attempt === 2) weightedCorrectUnits += unitsPerSection
    })
  })

  return Math.floor(100 * weightedCorrectUnits / scoreDenominator)
}

/**
 * 特定問題の得点を計算する（表示用）。
 */
function calcProblemScore(problem, problemAnswers, totalQuestionCount, sectionsLcm) {
  const sectionCount = problem.subProblems.length
  if (sectionCount === 0) return 0
  const unitsPerSection = Math.floor(sectionsLcm / sectionCount)
  let weightedCorrectUnits = 0
  problem.subProblems.forEach((_, sIdx) => {
    const attempt = problemAnswers[sIdx]
    if (attempt === 1) weightedCorrectUnits += 2 * unitsPerSection
    else if (attempt === 2) weightedCorrectUnits += unitsPerSection
  })
  const scoreDenominator = 2 * totalQuestionCount * sectionsLcm
  return Math.floor(100 * weightedCorrectUnits / scoreDenominator)
}

// --- UI ---

const OPTIONS = [
  { value: 1, label: '1回目正解', short: '○', bg: 'bg-emerald-600 hover:bg-emerald-500', ring: 'ring-emerald-400' },
  { value: 2, label: '2回目正解', short: '△', bg: 'bg-amber-600 hover:bg-amber-500', ring: 'ring-amber-400' },
  { value: 3, label: '不正解',   short: '✕', bg: 'bg-red-700 hover:bg-red-600',       ring: 'ring-red-400'   },
]

export default function Scoring({ problems, onReset }) {
  const [answers, setAnswers] = useState(
    problems.map(p => p.subProblems.map(() => null))
  )

  const setAttempt = (pIdx, sIdx, value) => {
    setAnswers(prev => prev.map((row, i) =>
      i !== pIdx ? row : row.map((cell, j) => j !== sIdx ? cell : value)
    ))
  }

  // LCMを1回だけ計算して各問題スコアに共有
  const sectionCounts = problems.map(p => p.subProblems.length)
  const sectionsLcm = sectionCounts.reduce((acc, c) => lcm(acc, c), 1)
  const totalQuestionCount = problems.length

  const problemScores = problems.map((problem, pIdx) =>
    calcProblemScore(problem, answers[pIdx], totalQuestionCount, sectionsLcm)
  )
  const totalScore = calculateTotalScore(problems, answers)

  const answeredCount = answers.flat().filter(a => a !== null).length
  const totalBlanks = answers.flat().length
  const percentage = totalScore

  const gradeColor = percentage >= 80 ? 'text-emerald-400' : percentage >= 60 ? 'text-amber-400' : 'text-red-400'
  const barColor   = percentage >= 80 ? 'bg-emerald-500'   : percentage >= 60 ? 'bg-amber-500'   : 'bg-red-500'

  return (
    <div className="space-y-4">
      {/* スコアボード（スクロール時固定） */}
      <div className="sticky top-4 z-10 bg-slate-800/80 backdrop-blur border border-slate-700 rounded-xl p-5 shadow-lg">
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-slate-400 text-sm">合計得点</p>
            <div className="flex items-end gap-2 mt-1">
              <span className={`text-5xl font-bold transition-all ${gradeColor}`}>{totalScore}</span>
              <span className="text-slate-400 text-lg mb-1">/ 100点</span>
            </div>
          </div>
          <div className="text-right">
            <span className={`text-3xl font-bold ${gradeColor}`}>{percentage}%</span>
            <p className="text-slate-500 text-xs mt-1">{answeredCount} / {totalBlanks} 問入力済</p>
          </div>
        </div>
        <div className="bg-slate-700 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${barColor}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* 各問題 */}
      {problems.map((problem, pIdx) => (
        <div key={problem.id} className="bg-slate-800/60 border border-slate-700 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-700/40">
            <span className="font-semibold text-white">{problem.label}</span>
            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-xs">配点 {(100 / totalQuestionCount).toFixed(1)}点</span>
              <span className="text-white font-semibold">{problemScores[pIdx]}点</span>
            </div>
          </div>

          <div className="px-4 py-3 space-y-3">
            {problem.subProblems.map((sub, sIdx) => {
              const current = answers[pIdx][sIdx]
              return (
                <div key={sub.id} className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="flex items-center gap-2 sm:w-24 shrink-0">
                    <span className="text-slate-300 text-sm font-medium">{sub.label}</span>
                    <span className="text-slate-500 text-xs">{sub.points.toFixed(1)}点</span>
                  </div>

                  <div className="flex gap-2 flex-1">
                    {OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setAttempt(pIdx, sIdx, opt.value)}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${opt.bg}
                          ${current === opt.value ? `ring-2 ${opt.ring} scale-105` : 'opacity-40'}
                        `}
                      >
                        <span className="block text-base">{opt.short}</span>
                        <span className="block text-xs mt-0.5 hidden sm:block">{opt.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="sm:w-12 text-right shrink-0 text-sm font-semibold">
                    {current === null
                      ? <span className="text-slate-600">—</span>
                      : current === 3
                        ? <span className="text-slate-500">0点</span>
                        : <span className="text-white">
                            {current === 1 ? '○' : '△'}
                          </span>
                    }
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}

      <button
        onClick={onReset}
        className="w-full border border-slate-600 text-slate-400 hover:text-white hover:border-slate-400 font-semibold py-3 rounded-xl transition-colors"
      >
        ← 設定に戻る
      </button>
    </div>
  )
}
