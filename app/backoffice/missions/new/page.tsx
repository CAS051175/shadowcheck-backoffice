'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function NewMission() {
  const [branches, setBranches] = useState<any[]>([])
  const [protocols, setProtocols] = useState<any[]>([])
  const [evaluators, setEvaluators] = useState<any[]>([])
  const [form, setForm] = useState({ branch_id: '', protocol_id: '', evaluator_id: '', scheduled_date: '' })
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const [b, p, e] = await Promise.all([
      supabase.from('branches').select('id, name, companies(name)'),
      supabase.from('protocols').select('id, name').eq('is_active', true),
      supabase.from('evaluators').select('id, full_name')
    ])
    setBranches(b.data || [])
    setProtocols(p.data || [])
    setEvaluators(e.data || [])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const { error } = await supabase.from('missions').insert(form)
    if (!error) router.push('/backoffice')
    else alert('Error: ' + error.message)
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Nueva Misión</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Sucursal</label>
          <select 
            className="w-full border rounded px-3 py-2"
            value={form.branch_id}
            onChange={e => setForm({...form, branch_id: e.target.value})}
            required
          >
            <option value="">Seleccionar...</option>
            {branches.map(b => (
              <option key={b.id} value={b.id}>{b.companies.name} - {b.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Protocolo</label>
          <select 
            className="w-full border rounded px-3 py-2"
            value={form.protocol_id}
            onChange={e => setForm({...form, protocol_id: e.target.value})}
            required
          >
            <option value="">Seleccionar...</option>
            {protocols.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Evaluador</label>
          <select 
            className="w-full border rounded px-3 py-2"
            value={form.evaluator_id}
            onChange={e => setForm({...form, evaluator_id: e.target.value})}
          >
            <option value="">Sin asignar</option>
            {evaluators.map(e => <option key={e.id} value={e.id}>{e.full_name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Fecha Programada</label>
          <input 
            type="date"
            className="w-full border rounded px-3 py-2"
            value={form.scheduled_date}
            onChange={e => setForm({...form, scheduled_date: e.target.value})}
            required
          />
        </div>

        <button type="submit" className="bg-black text-white px-4 py-2 rounded">
          Crear Misión
        </button>
      </form>
    </div>
  )
}
