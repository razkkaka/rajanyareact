import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FiBriefcase, FiCheck, FiX, FiPhone, FiMessageSquare } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'

export default function Collaborations() {
  const [collaborations, setCollaborations] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedCollab, setSelectedCollab] = useState(null)
  const { token } = useAuth()

  useEffect(() => {
    fetchCollaborations()
  }, [])

  const fetchCollaborations = async () => {
    try {
      const res = await fetch('/api/collaboration', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setCollaborations(data)
      }
    } catch (error) {
      toast.error('Gagal memuat data kolaborasi')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/collaboration/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        setCollaborations(collaborations.map((c) => c.id === id ? { ...c, status: newStatus } : c))
        toast.success(`Pengajuan ${newStatus}`)
        setSelectedCollab(null)
      }
    } catch (error) {
      toast.error('Gagal update status')
    }
  }

  const formatDate = (date) => new Date(date).toLocaleDateString('id-ID', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    }
    return styles[status] || styles.pending
  }

  const filteredCollaborations = filter === 'all' ? collaborations : collaborations.filter((c) => c.status === filter)

  if (loading) {
    return <div className="card p-10 text-center text-coffee-700">Memuat data kolaborasi...</div>
  }

  return (
    <div className="space-y-6">
      <div className="card p-6 bg-gradient-to-r from-coffee-900 to-coffee-700 text-white">
        <p className="text-sm uppercase tracking-[0.2em] text-cream-200">Manajemen</p>
        <h1 className="mt-2 section-title text-white">Pengajuan Kolaborasi</h1>
        <p className="mt-2 text-cream-100">Kelola permintaan kolaborasi UMKM yang masuk.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {['all', 'pending', 'approved', 'rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
              filter === status ? 'bg-coffee-700 text-white' : 'bg-cream-100 text-coffee-700 hover:bg-cream-200'
            }`}
          >
            {status === 'all' ? 'Semua' : status === 'pending' ? 'Menunggu' : status === 'approved' ? 'Disetujui' : 'Ditolak'}
          </button>
        ))}
      </div>

      {filteredCollaborations.length === 0 ? (
        <div className="card p-10 text-center text-coffee-700">
          <FiBriefcase className="mx-auto text-4xl text-coffee-500 mb-3" />
          <p>Tidak ada pengajuan kolaborasi</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredCollaborations.map((collab) => (
            <div
              key={collab.id}
              onClick={() => setSelectedCollab(selectedCollab?.id === collab.id ? null : collab)}
              className="card p-5 cursor-pointer hover:shadow-md transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-coffee-700 text-white flex items-center justify-center text-sm font-bold">
                      {collab.business_name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-coffee-900">{collab.business_name}</p>
                      <p className="text-xs text-coffee-600">{collab.business_type}</p>
                    </div>
                  </div>
                  <p className="text-sm text-coffee-700 mt-2">{collab.message || 'Tidak ada pesan tambahan'}</p>
                  <p className="text-xs text-coffee-500 mt-2">{formatDate(collab.created_at)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(collab.status)}`}>
                    {collab.status === 'pending' ? 'Menunggu' : collab.status === 'approved' ? 'Disetujui' : 'Ditolak'}
                  </span>
                </div>
              </div>

              {selectedCollab?.id === collab.id && (
                <div className="mt-4 border-t border-cream-200 pt-4 space-y-3">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-coffee-700">
                      <FiPhone className="text-sm" />
                      <span className="text-sm">{collab.contact}</span>
                    </div>
                    {collab.message && (
                      <div className="flex items-start gap-2 text-coffee-700 sm:col-span-2">
                        <FiMessageSquare className="text-sm mt-0.5 flex-shrink-0" />
                        <span className="text-sm break-words">{collab.message}</span>
                      </div>
                    )}
                  </div>

                  {collab.status === 'pending' && (
                    <div className="flex gap-2 pt-3 border-t border-cream-200">
                      <button
                        onClick={() => updateStatus(collab.id, 'approved')}
                        className="flex-1 flex items-center justify-center gap-2 btn-primary text-sm"
                      >
                        <FiCheck /> Setujui
                      </button>
                      <button
                        onClick={() => updateStatus(collab.id, 'rejected')}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition text-sm font-semibold"
                      >
                        <FiX /> Tolak
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
