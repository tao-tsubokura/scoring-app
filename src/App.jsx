import { useState } from 'react'
import TestSetup from './components/TestSetup'
import Scoring from './components/Scoring'
import './index.css'

export default function App() {
  const [step, setStep] = useState('setup')
  const [problems, setProblems] = useState([])

  const handleSetupComplete = (configuredProblems) => {
    setProblems(configuredProblems)
    setStep('scoring')
  }

  const handleReset = () => {
    setProblems([])
    setStep('setup')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">採点プログラム</h1>
          <p className="mt-2 text-slate-400 text-sm">テスト配点・採点計算ツール</p>
        </div>

        <StepIndicator currentStep={step} />

        <div className="mt-8">
          {step === 'setup' && <TestSetup onComplete={handleSetupComplete} />}
          {step === 'scoring' && <Scoring problems={problems} onReset={handleReset} />}
        </div>
      </div>
    </div>
  )
}

function StepIndicator({ currentStep }) {
  const steps = [
    { key: 'setup', label: 'テスト設定' },
    { key: 'scoring', label: '採点・結果' },
  ]
  const currentIndex = steps.findIndex(s => s.key === currentStep)

  return (
    <div className="flex items-center justify-center">
      {steps.map((step, i) => (
        <div key={step.key} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors
              ${i < currentIndex ? 'bg-indigo-500 text-white' : ''}
              ${i === currentIndex ? 'bg-indigo-600 text-white ring-4 ring-indigo-600/30' : ''}
              ${i > currentIndex ? 'bg-slate-700 text-slate-400' : ''}
            `}>
              {i < currentIndex ? '✓' : i + 1}
            </div>
            <span className={`mt-1 text-xs ${i === currentIndex ? 'text-indigo-400' : 'text-slate-500'}`}>
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-24 h-0.5 mb-4 mx-1 transition-colors ${i < currentIndex ? 'bg-indigo-500' : 'bg-slate-700'}`} />
          )}
        </div>
      ))}
    </div>
  )
}
