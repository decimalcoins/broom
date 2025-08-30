export default function Splash() {
  return (
    <div className="fixed inset-0 bg-slate-900 flex flex-col items-center justify-center z-50">
      <img src="https://placehold.co/512x128/10b981/ffffff?text=Broom+Marketplace" alt="Broom Marketplace Logo" className="w-64 fade-in-up" />
      <p className="text-slate-400 mt-4 fade-in-up" style={{animationDelay: '0.5s'}}>Powered by Pi Network</p>
    </div>
  );
}
