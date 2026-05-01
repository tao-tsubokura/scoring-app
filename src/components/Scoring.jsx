import { useState } from 'react'

// 試行回数の選択肢
const ATTEMPT_OPTIONS = [
  { value: 1, label: '1回目で正解', color: 'bg-emerald-600 hover:bg-emerald-500', selected: 'ring-emerald-500' },
  { value: 2, label: '2回目で正解', color: 'bg-amber-600 hover:bg-amber-500', selected: 'ring-amber-500' },
  { value: 3, label: '不正解', color: 'bg-red-700 hover:bg-red-600', selected: 'ring-red-500' },
]

function calcScore(points, attempt) {
  if (attempt === 1) return points
  if (attempt === 2) return Math.floor(points * 0.5)
  return 0
}

export default function Scoring({ problems, onComplete, onBack }) {
  // answers[pIdx][sIdx] = attempt (1 | 2 | 3)
  const [answers, setAnswers] = useState(
    problems.map(p => p.subProblems.map(() => null))
  )

  const setAttempt = (pIdx, sIdx, value) => {
    setAnswers(prev => prev.map((row, i) =>
      i !== pIdx ? row : row.map((cell, j) => j !== sIdx ? cell : value)
    ))
  }

  const allAnswered = answers.every(row => row.every(cell => cell !== null))

  const handleSubmit = () => {
    if (!allAnswered) return alert('すべての小問に結果を入力してください')
    onComplete(answers)
  }

  return (
    <div className="space-y-4">
      <p className="text-slate-400 text-sm text-center">
        各小問の結果を選択してください
      </p>

      {problems.map((problem, pIdx) => (
        <div key={problem.id} className="bg-slate-800/60 border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-slate-700/50">
            <span className="font-semibold text-white">{problem.label}</span>
          </div>

          <div className="px-4 py-3 space-y-3">
            {problem.subProblems.map((sub, sIdx) => (
              <div key={sub.id} className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="flex items-center gap-2 sm:w-32 shrink-0">
                  <span className="text-slate-400 text-sm">{sub.label}</span>
                  <span className="text-slate-500 text-xs">{sub.points}点</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {ATTEMPT_OPTIONS.map(opt => {
                    const isSelected = answers[pIdx][sIdx] === opt.value
                    const score = calcScore(sub.points, opt.value)
                    return (
                      <button
                        key={opt.value}
                        onClick={() => setAttempt(pIdx, sIdx, opt.value)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${opt.color}
                          ${isSelected ? `ring-2 ${opt.selected} text-white scale-105` : 'opacity-50 text-white'}
                        `}
                      >
                        {opt.label}
                        {isSelected && (
                          <span className="ml-1.5 text-xs opacity-80">
                            ({score}点)
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex gap-3 mt-2">
        <button
          onClick={onBack}
          className="flex-1 border border-slate-600 text-slate-400 hover:text-white hover:border-slate-400 font-semibold py-3 rounded-xl transition-colors"
        >
          ← 設定に戻る
        </button>
        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className="flex-2 flex-grow-[2] bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
        >
          結果を見る →
        </button>
      </div>
    </div>
  )
}
