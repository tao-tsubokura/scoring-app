function calcScore(points, attempt) {
  if (attempt === 1) return points
  if (attempt === 2) return Math.floor(points * 0.5)
  return 0
}

const ATTEMPT_LABEL = {
  1: { text: '1回目正解', color: 'text-emerald-400' },
  2: { text: '2回目正解', color: 'text-amber-400' },
  3: { text: '不正解', color: 'text-red-400' },
}

export default function Results({ problems, answers, onReset }) {
  const totalPossible = problems.reduce(
    (sum, p) => sum + p.subProblems.reduce((s, sub) => s + sub.points, 0),
    0
  )

  const totalScore = problems.reduce((sum, p, pIdx) =>
    sum + p.subProblems.reduce((s, sub, sIdx) =>
      s + calcScore(sub.points, answers[pIdx][sIdx]), 0
    ), 0
  )

  const percentage = totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0

  const gradeColor =
    percentage >= 80 ? 'text-emerald-400' :
    percentage >= 60 ? 'text-amber-400' :
    'text-red-400'

  return (
    <div className="space-y-4">
      {/* スコアサマリー */}
      <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 text-center">
        <p className="text-slate-400 text-sm mb-2">合計得点</p>
        <div className="flex items-end justify-center gap-2">
          <span className={`text-5xl font-bold ${gradeColor}`}>{totalScore}</span>
          <span className="text-slate-400 text-lg mb-1">/ {totalPossible} 点</span>
        </div>
        <div className={`mt-2 text-2xl font-semibold ${gradeColor}`}>
          {percentage}%
        </div>
        {/* プログレスバー */}
        <div className="mt-4 bg-slate-700 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              percentage >= 80 ? 'bg-emerald-500' :
              percentage >= 60 ? 'bg-amber-500' : 'bg-red-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* 問題ごとの詳細 */}
      {problems.map((problem, pIdx) => {
        const problemScore = problem.subProblems.reduce(
          (s, sub, sIdx) => s + calcScore(sub.points, answers[pIdx][sIdx]), 0
        )
        const problemTotal = problem.subProblems.reduce((s, sub) => s + sub.points, 0)

        return (
          <div key={problem.id} className="bg-slate-800/60 border border-slate-700 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-slate-700/50">
              <span className="font-semibold text-white">{problem.label}</span>
              <span className="text-sm text-slate-300">
                {problemScore} / {problemTotal} 点
              </span>
            </div>

            <div className="px-4 py-3 space-y-2">
              {problem.subProblems.map((sub, sIdx) => {
                const attempt = answers[pIdx][sIdx]
                const score = calcScore(sub.points, attempt)
                const info = ATTEMPT_LABEL[attempt]

                return (
                  <div key={sub.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400">{sub.label}</span>
                      <span className={info.color}>{info.text}</span>
                    </div>
                    <span className={`font-semibold ${score > 0 ? 'text-white' : 'text-slate-500'}`}>
                      {score} 点
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* リセットボタン */}
      <button
        onClick={onReset}
        className="w-full border border-slate-600 text-slate-400 hover:text-white hover:border-slate-400 font-semibold py-3 rounded-xl transition-colors"
      >
        最初からやり直す
      </button>
    </div>
  )
}
