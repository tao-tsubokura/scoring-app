import { useState } from 'react'

function calcScore(points, attempt) {
  if (attempt === 1) return points
  if (attempt === 2) return Math.floor(points * 0.5)
  return 0
}

const OPTIONS = [
  { value: 1, label: '1回目正解', short: '○', bg: 'bg-emerald-600 hover:bg-emerald-500', ring: 'ring-emerald-400' },
  { value: 2, label: '2回目正解', short: '△', bg: 'bg-amber-600 hover:bg-amber-500', ring: 'ring-amber-400' },
  { value: 3, label: '不正解', short: '✕', bg: 'bg-red-700 hover:bg-red-600', ring: 'ring-red-400' },
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

  // リアルタイムスコア計算
  const problemScores = problems.map((p, pIdx) =>
    p.subProblems.reduce((sum, sub, sIdx) => {
      const a = answers[pIdx][sIdx]
      return sum + (a !== null ? calcScore(sub.points, a) : 0)
    }, 0)
  )
  const totalScore = problemScores.reduce((a, b) => a + b, 0)
  const answeredCount = answers.flat().filter(a => a !== null).length
  const totalBlanks = answers.flat().length
  const percentage = Math.round((totalScore / 100) * 100)

  const gradeColor =
    percentage >= 80 ? 'text-emerald-400' :
    percentage >= 60 ? 'text-amber-400' :
    'text-red-400'

  const barColor =
    percentage >= 80 ? 'bg-emerald-500' :
    percentage >= 60 ? 'bg-amber-500' :
    'bg-red-500'

  return (
    <div className="space-y-4">
      {/* スコアボード（常に表示・リアルタイム更新） */}
      <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
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
              <span className="text-slate-500 text-xs">配点 {problem.points}点</span>
              <span className="text-white font-semibold">
                {problemScores[pIdx]}点
              </span>
            </div>
          </div>

          <div className="px-4 py-3 space-y-3">
            {problem.subProblems.map((sub, sIdx) => {
              const current = answers[pIdx][sIdx]
              const earned = current !== null ? calcScore(sub.points, current) : null

              return (
                <div key={sub.id} className="flex flex-col sm:flex-row sm:items-center gap-2">
                  {/* ラベルと配点 */}
                  <div className="flex items-center gap-2 sm:w-24 shrink-0">
                    <span className="text-slate-300 text-sm font-medium">{sub.label}</span>
                    <span className="text-slate-500 text-xs">{sub.points}点</span>
                  </div>

                  {/* 選択ボタン */}
                  <div className="flex gap-2 flex-1">
                    {OPTIONS.map(opt => {
                      const isSelected = current === opt.value
                      return (
                        <button
                          key={opt.value}
                          onClick={() => setAttempt(pIdx, sIdx, opt.value)}
                          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${opt.bg}
                            ${isSelected ? `ring-2 ${opt.ring} scale-105` : 'opacity-40'}
                          `}
                        >
                          <span className="block text-base">{opt.short}</span>
                          <span className="block text-xs mt-0.5 hidden sm:block">{opt.label}</span>
                        </button>
                      )
                    })}
                  </div>

                  {/* 獲得点数 */}
                  <div className="sm:w-12 text-right shrink-0">
                    {earned !== null ? (
                      <span className={`text-sm font-semibold ${earned > 0 ? 'text-white' : 'text-slate-500'}`}>
                        {earned}点
                      </span>
                    ) : (
                      <span className="text-slate-600 text-sm">—</span>
                    )}
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
