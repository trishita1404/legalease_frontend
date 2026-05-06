
export function ClientTimeline() {
  const steps = [
    { name: "Case Filed", date: "April 10", status: "complete" },
    { name: "Document Verification", date: "April 15", status: "complete" },
    { name: "Initial Hearing", date: "May 12", status: "current" },
    { name: "Final Judgment", date: "TBD", status: "upcoming" },
  ];

  return (
    <div className="space-y-4">
      {steps.map((step, idx) => (
        <div key={idx} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className={`h-4 w-4 rounded-full ${step.status === 'complete' ? 'bg-emerald-500' : step.status === 'current' ? 'bg-blue-500 animate-pulse' : 'bg-slate-200'}`} />
            {idx !== steps.length - 1 && <div className="w-px h-10 bg-slate-100" />}
          </div>
          <div>
            <p className="text-sm font-bold">{step.name}</p>
            <p className="text-xs text-muted-foreground">{step.date}</p>
          </div>
        </div>
      ))}
    </div>
  );
}