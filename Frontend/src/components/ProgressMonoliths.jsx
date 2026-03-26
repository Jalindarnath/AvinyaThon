const sites = [
  { name: 'Site Alpha', phase: 'Foundation Complete', progress: 85 },
  { name: 'Harbor View', phase: 'Excavation Phase', progress: 32 },
  { name: 'Skyline Tower', phase: 'Interior Fitting', progress: 92 },
  { name: 'Green Bridge', phase: 'Superstructure', progress: 55 },
];

export default function ProgressMonoliths() {
  return (
    <div className="bg-white p-8 rounded-2xl border border-gray-50 shadow-sm mt-8">
      <div className="mb-10">
        <h3 className="text-2xl font-bold text-gray-800">Project Progress Monoliths</h3>
        <p className="text-gray-400 text-sm">Structural completion across active sites.</p>
      </div>

      <div className="flex justify-between items-end h-64 px-4">
        {sites.map((site) => (
          <div key={site.name} className="flex flex-col items-center w-1/4 group">
            {/* The Monolith (Vertical Bar) */}
            <div className="relative w-4 h-48 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="absolute bottom-0 w-full bg-orange-800 rounded-full transition-all duration-1000 ease-out"
                style={{ height: `${site.progress}%` }}
              ></div>
            </div>
            
            {/* Labels */}
            <div className="mt-6 text-left w-full pl-8">
              <h4 className="font-bold text-gray-800 leading-tight">{site.name}</h4>
              <p className="text-[10px] text-gray-400 font-medium uppercase mt-1">{site.phase}</p>
              <p className="text-orange-800 font-bold text-sm mt-1">{site.progress}% Done</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}