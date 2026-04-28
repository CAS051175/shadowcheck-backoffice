'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

type Mission = {
  id: string
  status: string
  scheduled_date: string
  branches: { name: string, companies: { name: string } }
  evaluators: { full_name: string }
}

export default function Backoffice() {
  const [missions, setMissions] = useState<Mission[]>([])
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 })
  const supabase = createClient()

  useEffect(() => {
    loadMissions()
  }, [])

  async function loadMissions() {
    const { data } = await supabase
      .from('missions')
      .select('id, status, scheduled_date, branches(name, companies(name)), evaluators(full_name)')
      .order('created_at', { ascending: false })
      .limit(10)
    
    if (data) {
      setMissions(data as any)
      setStats({
        total: data.length,
        completed: data.filter(m => m.status === 'qa_passed').length,
        pending: data.filter(m => m.status === 'pending').length
      })
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Backoffice ShadowCheck</h1>
      
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-gray-500 text-sm">Misiones Totales</p>
          <p className="text-3xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-gray-500 text-sm">Completadas QA</p>
          <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-gray-500 text-sm">Pendientes</p>
          <p className="text-3xl font-bold text-orange-600">{stats.pending}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-semibold">Últimas Misiones</h2>
          <a href="/backoffice/missions/new" className="bg-black text-white px-4 py-2 rounded text-sm">
            + Nueva Misión
          </a>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-3">Empresa</th>
              <th className="p-3">Sucursal</th>
              <th className="p-3">Evaluador</th>
              <th className="p-3">Fecha</th>
              <th className="p-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {missions.map(m => (
              <tr key={m.id} className="border-t">
                <td className="p-3">{m.branches?.companies?.name}</td>
                <td className="p-3">{m.branches?.name}</td>
                <td className="p-3">{m.evaluators?.full_name || 'Sin asignar'}</td>
                <td className="p-3">{m.scheduled_date}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs ${
                    m.status === 'qa_passed' ? 'bg-green-100 text-green-700' : 
                    m.status === 'completed' ? 'bg-blue-100 text-blue-700' : 
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {m.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
