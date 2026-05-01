import { useState } from 'react'

// 問題設定の初期値
const DEFAULT_POINTS = 20
const DEFAULT_SUB_COUNT = 3

function createProblem(index) {
  return {
    id: index,
    label: `問題${index + 1}`,
    subProblems: Array.from({ length: DEFAULT_SUB_COUNT }, (_, i) => ({
      id: i,
      label: `(${i + 1})`,
      points: DEFAULT_POINTS,
    })),
  }
}

export default function TestSetup({ onComplete }) {
  const [problems, setProblems] = useState([createProblem(0)])

  const addProblem = () => {
    setProblems(prev => [...prev, createProblem(prev.length)])
  }

  const removeProblem = (idx) => {
    setProblems(prev => prev.filter((_, i) => i !== idx).map((p, i) => ({ ...p, id: i, label: `問題${i + 1}` })))
  }

  const addSubProblem = (pIdx) => {
    setProblems(prev => prev.map((p, i) => {
      if (i !== pIdx) return p
      const newSub = {
        id: p.subProblems.length,
        label: `(${p.subProblems.length + 1})`,
        points: DEFAULT_POINTS,
      }
      return { ...p, subProblems: [...p.subProblems, newSub] }
    }))
  }

  const removeSubProblem = (pIdx, sIdx) => {
    setProblems(prev => prev.map((p, i) => {
      if (i !== pIdx) return p
      const updated = p.subProblems
        .filter((_, j) => j !== sIdx)
        .map((s, j) => ({ ...s, id: j, label: `(${j + 1})` }))
      return { ...p, subProblems: updated }
    }))
  }

  const updatePoints = (pIdx, sIdx, value) => {
    const num = parseInt(value, 10)
    if (isNaN(num) || num < 0) return
    setProblems(prev => prev.map((p, i) => {
      if (i !== pIdx) return p
      return {
        ...p,
        subProblems: p.subProblems.map((s, j) =>
          j === sIdx ? { ...s, points: num } : s
        ),
      }
    }))
  }

  const totalPoints = problems.reduce(
    (sum, p) => sum + p.subProblems.reduce((s, sub) => s + sub.points, 0),
    0
  )

  const handleSubmit = () => {
    const valid = problems.every(p => p.subProblems.length > 0)
    if (!valid) return alert('各大問に小問を1つ以上設定してください')
    onComplete(problems)
  }

  return (
    <div className="space-y-4">
      {/* 合計表示 */}
      <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 flex items-center justify-between">
        <span className="text-slate-400 text-sm">合計配点</span>
        <span className="text-2xl font-bold text-indigo-400">{totalPoints} <span className="text-sm font-normal text-slate-400">点</span></span>
      </div>

      {/* 問題リスト */}
      {problems.map((problem, pIdx) => (
        <div key={problem.id} className="bg-slate-800/60 border border-slate-700 rounded-xl overflow-hidden">
          {/* 大問ヘッダー */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-700/50">
            <span className="font-semibold text-white">{problem.label}</span>
            <button
              onClick={() => removeProblem(pIdx)}
              disabled={problems.length === 1}
              className="text-slate-500 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm"
            >
              削除
            </button>
          </div>

          {/* 小問リスト */}
          <div className="px-4 py-3 space-y-2">
            {problem.subProblems.map((sub, sIdx) => (
              <div key={sub.id} className="flex items-center gap-3">
                <span className="text-slate-400 text-sm w-8 shrink-0">{sub.label}</span>
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="number"
                    min="0"
                    value={sub.points}
                    onChange={e => updatePoints(pIdx, sIdx, e.target.value)}
                    className="w-20 bg-slate-900 border border-slate-600 rounded-lg px-3 py-1.5 text-white text-sm text-center focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                  <span className="text-slate-500 text-sm">点</span>
                </div>
                <button
                  onClick={() => removeSubProblem(pIdx, sIdx)}
                  disabled={problem.subProblems.length === 1}
                  className="text-slate-600 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  ✕
                </button>
              </div>
            ))}

            <button
              onClick={() => addSubProblem(pIdx)}
              className="mt-2 text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-1 transition-colors"
            >
              <span>+</span> 小問を追加
            </button>
          </div>
        </div>
      ))}

      {/* 大問追加ボタン */}
      <button
        onClick={addProblem}
        className="w-full border border-dashed border-slate-600 rounded-xl py-3 text-slate-400 hover:text-white hover:border-slate-400 transition-colors text-sm"
      >
        + 大問を追加
      </button>

      {/* 採点開始ボタン */}
      <button
        onClick={handleSubmit}
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition-colors mt-2"
      >
        採点を開始 →
      </button>
    </div>
  )
}
