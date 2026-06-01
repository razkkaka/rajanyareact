import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi'

export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  const formatPrice = (price) => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price)

  const maxQuantity = item.stock_quantity || 100

  return (
    <div className="card p-4 flex items-center gap-4">
      <div className={`w-18 h-18 rounded-2xl bg-gradient-to-br ${item.category === 'coffee' ? 'from-coffee-700 to-coffee-500' : 'from-emerald-600 to-lime-500'} flex items-center justify-center text-white font-bold`}>
        {item.name?.[0]}
      </div>
      <div className="flex-1">
        <p className="font-semibold text-coffee-900">{item.name}</p>
        <p className="text-sm text-coffee-600">{formatPrice(item.price)} / item</p>
        <p className="text-xs text-coffee-500 mt-1">Stok tersedia: {maxQuantity}</p>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="p-2 rounded-lg bg-cream-100 text-coffee-700" disabled={item.quantity <= 1}>
          <FiMinus className="text-sm" />
        </button>
        <span className="min-w-8 text-center font-semibold text-coffee-900">{item.quantity}</span>
        <button onClick={() => onUpdateQuantity(item.id, Math.min(item.quantity + 1, maxQuantity))} className="p-2 rounded-lg bg-cream-100 text-coffee-700" disabled={item.quantity >= maxQuantity}>
          <FiPlus className="text-sm" />
        </button>
      </div>
      <div className="text-right">
        <p className="font-bold text-coffee-900">{formatPrice(item.price * item.quantity)}</p>
        <button onClick={() => onRemove(item.id)} className="mt-2 p-2 rounded-lg text-red-500 hover:bg-red-50">
          <FiTrash2 className="text-sm" />
        </button>
      </div>
    </div>
  )
}
