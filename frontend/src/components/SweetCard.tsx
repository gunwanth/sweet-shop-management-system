export default function SweetCard({ sweet, onPurchase }: any) {
  return (
    <div className="bg-white/90 backdrop-blur rounded-2xl shadow-lg p-5
                    hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">

      <div className="flex justify-between items-start">
        <h3 className="text-lg font-bold">{sweet.name}</h3>
        <span className="text-xs px-3 py-1 rounded-full bg-pink-100 text-pink-600">
          {sweet.category}
        </span>
      </div>

      <p className="mt-4 text-2xl font-bold text-pink-600">
        ₹{sweet.price}
      </p>

      <p className="text-sm text-gray-500 mb-4">
        Stock: {sweet.quantity}
      </p>

      <button
        disabled={sweet.quantity === 0}
        onClick={() => onPurchase(sweet.id)}
        className={`w-full py-2 rounded-xl text-white font-semibold transition
          ${
            sweet.quantity === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600'
          }`}
      >
        {sweet.quantity === 0 ? 'Out of Stock' : 'Buy Sweet'}
      </button>
    </div>
  )
}