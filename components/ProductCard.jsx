export default function ProductCard({ product, onBuy }) {
  return (
    <div className="bg-slate-800 p-4 rounded-lg shadow-md hover:shadow-lg transition flex flex-col">
      <img
        src={product.image || "/placeholder.png"}
        alt={product.name}
        className="w-full h-40 object-cover rounded mb-3"
      />
      <h3 className="text-lg font-bold">{product.name}</h3>
      <p className="text-gray-400 mb-2">{product.price} π</p>
      <button
        onClick={() => onBuy(product)}
        className="mt-auto bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
      >
        Beli
      </button>
    </div>
  );
}
