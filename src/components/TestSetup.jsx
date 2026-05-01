import { useState } from 'react'

function formatPoints(pts) {
  return Number.isInteger(pts) ? `${pts}` : pts.toFixed(1)
}

function buildProblems(problemDefs) {
  const n = problemDefs.length
  return problemDefs.map((def, i) => {
    const problemPoints = 100 / n
    const subPoints = problemPoints / def.blanks
    return {
      id: i,
      label: `問題${i + 1}`,
      points: problemPoints,
      subProblems: Array.from({ length: def.blanks }, (_, j) => ({
        id: j,
        label: `(${j + 1})`,
        points: subPoints,
      })),
    }
  })
}

function Counter({ value, onChange, min = 1, max = 20 }) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold transition-colors flex items-center justify-center"
      >
        −
      </button>
      <span className="w-8 text-center font-semibold text-white">{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold transition-colors flex items-center justify-center"
      >
        ＋
      </button>
    </div>
  )
}

export default function TestSetup({ onComplete }) {
  const [numProblems, setNumProblems] = useState(5)
  const [blanksPerProblem, setBlanksPerProblem] = useState(Array(5).fill(1))

  const handleNumProblems = (n) => {
    setNumProblems(n)
    setBlanksPerProblem(prev => {
      if (n > prev.length) return [...prev, ...Array(n - prev.length).fill(1)]
      return prev.slice(0, n)
    })
  }

  const handleBlanks = (idx, val) => {
    setBlanksPerProblem(prev => prev.map((v, i) => i === idx ? val : v))
  }

  const problemDefs = blanksPerProblem.slice(0, numProblems).map(blanks => ({ blanks }))
  const preview = buildProblems(problemDefs)

  return (
    <div className="space-y-5">
      {/* 問題数設定 */}
      <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-white">大問数</p>
            <p className="text-slate-400 text-sm mt-0.5">テストの問題数を設定</p>
          </div>
          <Counter value={numProblems} onChange={handleNumProblems} min={1} max={20} />
        </div>
      </div>

      {/* 各問題の解答欄数 */}
      <div className="bg-slate-800/60 border border-slate-700 rounded-xl overflow-hidden">
        <div className="px-5 py-3 bg-slate-700/50">
          <p className="font-semibold text-white text-sm">各問題の解答欄数と配点</p>
        </div>
        <div className="divide-y divide-slate-700/50">
          {preview.map((problem, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-3">
              <div className="flex items-center gap-4">
                <span className="text-white font-medium w-14">{problem.label}</span>
                <Counter
                  value={blanksPerProblem[i]}
                  onChange={(v) => handleBlanks(i, v)}
                  min={1}
                  max={10}
                />
              </div>
              {/* 配点プレビュー */}
              <div className="text-right">
                <span className="text-indigo-400 font-semibold">
                  {formatPoints(problem.points)}点
                </span>
                {problem.subProblems.length > 1 && (
                  <p className="text-slate-500 text-xs mt-0.5">
                    各 {formatPoints(problem.subProblems[0].points)}点 × {problem.subProblems.length}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 合計表示 */}
      <div className="flex items-center justify-between px-1">
        <span className="text-slate-400 text-sm">合計配点</span>
        <span className="text-indigo-400 font-bold">100点</span>
      </div>

      <button
        onClick={() => onComplete(preview)}
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition-colors"
      >
        採点を開始 →
      </button>
    </div>
  )
}
