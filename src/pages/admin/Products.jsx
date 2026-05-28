import { useEffect, useState } from 'react'
import { FiEdit2, FiPlus, FiTrash2, FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [formData, setFormData] = useState({ name: '', description: '', price: '', category: 'coffee', stock_status: 'available' })
  const { token } = useAuth()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      setProducts(data)
    } catch (error) {
      toast.error('Gagal memuat produk')
    } finally {
      setLoading(false)
    }
  }

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price.toString(),
        category: product.category,
        stock_status: product.stock_status,
      })
    } else {
      setEditingProduct(null)
      setFormData({ name: '', description: '', price: '', category: 'coffee', stock_status: 'available' })
    }
    setSelectedImage(null)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingProduct(null)
    setSelectedImage(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products'
    const method = editingProduct ? 'PUT' : 'POST'

    const payload = new FormData()
    payload.append('name', formData.name)
    payload.append('description', formData.description)
    payload.append('price', formData.price)
    payload.append('category', formData.category)
    payload.append('stock_status', formData.stock_status)
    if (selectedImage) payload.append('image', selectedImage)

    try {
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: payload,
      })
      const data = await res.json()
      if (res.ok) {
        toast.success(editingProduct ? 'Produk diupdate' : 'Produk ditambahkan')
        fetchProducts()
        closeModal()
      } else {
        toast.error(data.error)
      }
    } catch (error) {
      toast.error('Terjadi kesalahan')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus produk ini?')) return
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        toast.success('Produk dihapus')
        fetchProducts()
      }
    } catch (error) {
      toast.error('Gagal menghapus produk')
    }
  }

  const formatPrice = (price) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)

  if (loading) {
    return <div className="card p-10 text-center text-coffee-700">Memuat produk...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-coffee-600">Produk</p>
          <h1 className="mt-2 section-title">Manajemen Produk</h1>
        </div>
        <button onClick={() => openModal()} className="btn-primary">
          <FiPlus /> Tambah Produk
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-cream-100 text-coffee-700">
              <tr>
                <th className="px-4 py-3 font-semibold">Produk</th>
                <th className="px-4 py-3 font-semibold">Kategori</th>
                <th className="px-4 py-3 font-semibold">Harga</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t border-cream-200">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-coffee-900">{product.name}</div>
                    <div className="text-xs text-coffee-600">{product.description}</div>
                  </td>
                  <td className="px-4 py-3 text-coffee-700">{product.category === 'coffee' ? 'Kopi' : 'Non-Kopi'}</td>
                  <td className="px-4 py-3 text-coffee-700">{formatPrice(product.price)}</td>
                  <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${product.stock_status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{product.stock_status === 'available' ? 'Tersedia' : 'Habis'}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openModal(product)} className="p-2 rounded-lg bg-cream-100 text-coffee-700"><FiEdit2 /></button>
                      <button onClick={() => handleDelete(product.id)} className="p-2 rounded-lg bg-red-50 text-red-500"><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-coffee-600">Produk</p>
                <h2 className="mt-1 text-2xl font-semibold text-coffee-900">{editingProduct ? 'Edit Produk' : 'Tambah Produk'}</h2>
              </div>
              <button onClick={closeModal} className="p-2 rounded-lg bg-cream-100 text-coffee-700"><FiX /></button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-coffee-800">Nama Produk</span>
                <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-field" required />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-coffee-800">Deskripsi</span>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="input-field resize-none" rows="3" />
              </label>

              <div className="grid md:grid-cols-2 gap-4">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-coffee-800">Harga</span>
                  <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="input-field" required />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-coffee-800">Kategori</span>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="input-field">
                    <option value="coffee">Kopi</option>
                    <option value="non-coffee">Non-Kopi</option>
                  </select>
                </label>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-coffee-800">Status Stok</span>
                  <select value={formData.stock_status} onChange={(e) => setFormData({ ...formData, stock_status: e.target.value })} className="input-field">
                    <option value="available">Tersedia</option>
                    <option value="out_of_stock">Habis</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-coffee-800">Gambar (Opsional)</span>
                  <input type="file" accept="image/*" onChange={(e) => setSelectedImage(e.target.files?.[0])} className="input-field" />
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={closeModal} className="btn-secondary">Batal</button>
                <button type="submit" className="btn-primary">{editingProduct ? 'Update' : 'Simpan'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
