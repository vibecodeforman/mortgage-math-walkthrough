import React, { useState, useMemo } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  HelpCircle, 
  CheckCircle2, 
  TrendingUp, 
  DollarSign, 
  Timer, 
  Users, 
  FileText, 
  ChevronRight,
  Info,
  X,
  Target
} from 'lucide-react';

const App = () => {
  const [step, setStep] = useState(0);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [data, setData] = useState({
    adSpend: 0,
    leads: 0,
    speedToLeadCount: 0,
    contacts: 0,
    appts: 0,
    apps: 0,
    funded: 0,
    avgGOS: 9000
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  // Metric Definitions & Educational Content
  const metricGuides = {
    adSpend: {
      title: "Total Marketing Investment",
      howTo: "Aggregate your monthly ad spend (Meta, Google, Zillow) PLUS any agency management fees or software specifically used for lead gen (e.g., HighLevel, Verse).",
      why: "If you only track ad spend and not the fees to manage it, your ROI will look artificially high."
    },
    leads: {
      title: "Total Lead Volume",
      howTo: "This is the 'Raw Lead' count from all sources before any scrubbing. Most CRMs provide a 'Lead Created Date' report.",
      why: "This is your baseline. Everything else is a percentage of this number."
    },
    speedToLeadCount: {
      title: "Speed to Lead (< 5 Mins)",
      howTo: "Compare the 'Lead Created' timestamp with your first 'Call/Text Outbound' timestamp. If your CRM doesn't automate this, spot-check 10 leads manually to get an average.",
      why: "Conversion rates drop by 400% if the lead isn't contacted within 5 minutes."
    },
    contacts: {
      title: "Contact Rate (Conversations)",
      howTo: "Track every lead where a 'Two-Way Conversation' occurred. A 'No Answer' or 'Voicemail' is NOT a contact.",
      why: "Low contact rates usually point to poor lead quality or bad caller ID reputation (spam flags)."
    },
    appts: {
      title: "Qualified Appointments",
      howTo: "Log every lead that agreed to a specific time for a strategy call or application. Use a 'Stage Change' in your CRM called 'Appt Set'.",
      why: "This measures your (or your LO's) ability to sell the value of the consultation."
    },
    apps: {
      title: "Full Applications",
      howTo: "Count 1003s submitted. Pull this directly from your LOS (Encompass, MeridianLink, etc.) for accuracy.",
      why: "This is the bridge between marketing and manufacturing."
    },
    funded: {
      title: "Funded Loans",
      howTo: "Final closed/funded units for the month. Cross-reference your LOS with your commission statements.",
      why: "The ultimate metric. This is where the math ends."
    }
  };

  const steps = [
    {
      title: "The Investment",
      description: "How much are you putting into the machine?",
      fields: [
        { label: "Total Monthly Spend ($)", name: "adSpend", icon: <DollarSign className="w-4 h-4" /> },
        { label: "Total Leads Generated", name: "leads", icon: <Users className="w-4 h-4" /> }
      ]
    },
    {
      title: "The First Response",
      description: "Speed and initial engagement are the biggest killers of ROI.",
      fields: [
        { label: "Leads Contacted in < 5 Mins", name: "speedToLeadCount", icon: <Timer className="w-4 h-4" /> },
        { label: "Total Conversations (Contacted)", name: "contacts", icon: <Users className="w-4 h-4" /> }
      ]
    },
    {
      title: "The Commitment",
      description: "Turning conversations into actual business opportunities.",
      fields: [
        { label: "Appointments Set/Shown", name: "appts", icon: <CheckCircle2 className="w-4 h-4" /> },
        { label: "Full Applications (1003s)", name: "apps", icon: <FileText className="w-4 h-4" /> }
      ]
    },
    {
      title: "The Closing",
      description: "The final result and your revenue per unit.",
      fields: [
        { label: "Loans Funded", name: "funded", icon: <Target className="w-4 h-4" /> },
        { label: "Avg Revenue/GOS per Loan ($)", name: "avgGOS", icon: <DollarSign className="w-4 h-4" /> }
      ]
    }
  ];

  const results = useMemo(() => {
    const cpfl = data.funded > 0 ? data.adSpend / data.funded : 0;
    const speedRate = data.leads > 0 ? (data.speedToLeadCount / data.leads) * 100 : 0;
    const contactRate = data.leads > 0 ? (data.contacts / data.leads) * 100 : 0;
    const appToFunded = data.apps > 0 ? (data.funded / data.apps) * 100 : 0;
    const totalRev = data.funded * data.avgGOS;
    const roas = data.adSpend > 0 ? totalRev / data.adSpend : 0;

    return { cpfl, speedRate, contactRate, appToFunded, totalRev, roas };
  }, [data]);

  const renderTooltip = () => {
    if (!activeTooltip) return null;
    const guide = metricGuides[activeTooltip];
    return (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-slate-900">{guide.title}</h3>
            <button onClick={() => setActiveTooltip(null)} className="p-1 hover:bg-slate-100 rounded-full">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
          <div className="space-y-4">
            <section>
              <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-1">How to track it:</h4>
              <p className="text-slate-600 leading-relaxed">{guide.howTo}</p>
            </section>
            <section>
              <h4 className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-1">Why it matters:</h4>
              <p className="text-slate-600 leading-relaxed">{guide.why}</p>
            </section>
            <button 
              onClick={() => setActiveTooltip(null)}
              className="w-full py-3 bg-slate-900 text-white rounded-xl font-semibold mt-4"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {renderTooltip()}
      
      <div className="max-w-2xl mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            Marketing Efficiency Audit
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">The Mortgage Math Walkthrough</h1>
          <p className="text-slate-500">If you don't know your numbers, you don't have a business.</p>
        </div>

        {/* Step Progress */}
        <div className="flex gap-2 mb-8">
          {[0, 1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className={`h-2 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-blue-600' : 'bg-slate-200'}`} 
            />
          ))}
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
          {step < 4 ? (
            <div className="animate-in slide-in-from-right-4 duration-300">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">{steps[step].title}</h2>
                <p className="text-slate-500">{steps[step].description}</p>
              </div>

              <div className="space-y-6">
                {steps[step].fields.map((field) => (
                  <div key={field.name} className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        {field.icon} {field.label}
                      </label>
                      <button 
                        onClick={() => setActiveTooltip(field.name)}
                        className="text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-1 text-xs"
                      >
                        <HelpCircle className="w-3.5 h-3.5" /> 
                        <span className="hidden sm:inline">How to track?</span>
                      </button>
                    </div>
                    <input 
                      type="number"
                      name={field.name}
                      value={data[field.name]}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-xl font-semibold focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                      placeholder="0"
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-4 mt-10">
                {step > 0 && (
                  <button 
                    onClick={() => setStep(s => s - 1)}
                    className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                )}
                <button 
                  onClick={() => setStep(s => s + 1)}
                  className="flex-[2] flex items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
                >
                  {step === 3 ? "Generate Report" : "Next Step"} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-bold">Marketing Report Card</h2>
                <p className="text-slate-500 mt-2">Here is the efficiency of your current machine.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <ResultCard 
                  label="Cost Per Funded Loan" 
                  value={`$${Math.round(results.cpfl).toLocaleString()}`} 
                  desc="Target: <$2,500"
                  status={results.cpfl < 1500 ? 'excellent' : results.cpfl < 2500 ? 'good' : 'poor'}
                />
                <ResultCard 
                  label="ROAS" 
                  value={`${results.roas.toFixed(1)}x`} 
                  desc="Target: 3.0x+"
                  status={results.roas > 4 ? 'excellent' : results.roas > 2.5 ? 'good' : 'poor'}
                />
                <ResultCard 
                  label="Speed to Lead Rate" 
                  value={`${results.speedRate.toFixed(0)}%`} 
                  desc="Target: 60%+"
                  status={results.speedRate > 60 ? 'excellent' : results.speedRate > 30 ? 'good' : 'poor'}
                />
                <ResultCard 
                  label="Pull-Through (App to Funded)" 
                  value={`${results.appToFunded.toFixed(0)}%`} 
                  desc="Target: 70%+"
                  status={results.appToFunded > 70 ? 'excellent' : results.appToFunded > 55 ? 'good' : 'poor'}
                />
              </div>

              <div className="bg-slate-900 text-white rounded-2xl p-6">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Strategic Diagnosis</h4>
                <div className="space-y-4">
                  {results.speedRate < 40 && (
                    <div className="flex gap-3">
                      <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center shrink-0 mt-1">
                        <Info className="w-3 h-3 text-white" />
                      </div>
                      <p className="text-sm text-slate-300">Your <span className="text-amber-400 font-bold">Speed to Lead</span> is killing your conversion. Implement an automated dialer or AI lead-sitter to contact leads within the first 60 seconds.</p>
                    </div>
                  )}
                  {results.cpfl > 2500 && (
                    <div className="flex gap-3">
                      <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shrink-0 mt-1">
                        <Info className="w-3 h-3 text-white" />
                      </div>
                      <p className="text-sm text-slate-300">Your <span className="text-red-400 font-bold">Cost Per Funded Loan</span> is too high. You are likely 'buying' volume rather than 'manufacturing' it. Focus on your contact-to-appointment conversion skills.</p>
                    </div>
                  )}
                  {results.roas > 3 && (
                    <div className="flex gap-3">
                      <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shrink-0 mt-1">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </div>
                      <p className="text-sm text-slate-300">Your marketing is <span className="text-emerald-400 font-bold">Profitable</span>. For every $1 you spend, you earn ${results.roas.toFixed(1)}. You have permission to scale your current ad budget.</p>
                    </div>
                  )}
                </div>
              </div>

              <button 
                onClick={() => setStep(0)}
                className="w-full py-4 text-slate-500 font-bold hover:text-blue-600 transition-colors mt-6"
              >
                Restart Audit
              </button>
            </div>
          )}
        </div>

        {/* Side Note */}
        <div className="mt-12 p-6 bg-blue-50/50 rounded-2xl border border-blue-100 flex gap-4">
          <Info className="w-6 h-6 text-blue-500 shrink-0" />
          <p className="text-sm text-blue-800 leading-relaxed">
            <strong>Pro Tip:</strong> 2025 data shows that brokers who use a CRM with automated **"Speed to Lead"** tracking convert 3x more purchase business than those who track manually.
          </p>
        </div>
      </div>
    </div>
  );
};

const ResultCard = ({ label, value, desc, status }) => {
  const statusStyles = {
    excellent: "border-emerald-200 bg-emerald-50 text-emerald-700",
    good: "border-blue-200 bg-blue-50 text-blue-700",
    poor: "border-red-200 bg-red-50 text-red-700"
  };

  return (
    <div className={`p-5 rounded-2xl border-2 transition-all ${statusStyles[status]}`}>
      <div className="text-xs font-bold uppercase tracking-wider opacity-70 mb-1">{label}</div>
      <div className="text-2xl font-black mb-1">{value}</div>
      <div className="text-[10px] font-medium opacity-80">{desc}</div>
    </div>
  );
};

export default App;
