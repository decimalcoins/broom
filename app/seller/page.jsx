import PiAds from '@/components/PiAds';

export default function SellerPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Seller Dashboard (protected)</h1>
      <PiAds sellerId="demo_seller_1" />
    </main>
  );
}
