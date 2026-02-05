
import { useState, useEffect, useCallback } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Users, 
  Settings, 
  Bell, 
  ShieldAlert,
  X,
  Mail,
  AlertTriangle,
  Flame,
  Power,
  Heart,
  Loader2,
  CheckCircle2,
  Shield
} from 'lucide-react';
import { SafetyStatus, Contact, Location } from './types';
import Dashboard from './components/Dashboard';
import MapView from './components/MapView';
import ContactsView from './components/ContactsView';
import SettingsView from './components/SettingsView';
import Auth from './components/Auth';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'mail' | 'alert' | 'success';
}

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [user, setUser] = useState<{name: string, phone: string, email: string} | null>({
    name: 'Harshini',
    phone: '+91 98765 43210',
    email: 'harshinitv25@gmail.com'
  });
  const [activeTab, setActiveTab] = useState<'dash' | 'map' | 'contacts' | 'settings'>('dash');
  const [status, setStatus] = useState<SafetyStatus>(SafetyStatus.SAFE);
  const [safetyMode, setSafetyMode] = useState<'general' | 'campus' | 'workplace'>('general');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  
  const [contacts, setContacts] = useState<Contact[]>([
    { 
      id: '1', 
      name: 'Local Police Dispatch', 
      email: 'emergency@police.gov',
      phone: '100', 
      relation: 'Emergency Authority',
      isLive: true,
      status: 'verified',
      avatarSeed: 'police'
    }
  ]);

  const addNotification = useCallback((title: string, message: string, type: 'mail' | 'alert' | 'success' = 'mail') => {
    const id = Date.now().toString();
    setNotifications(prev => [{ id, title, message, type }, ...prev]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000); // Faster notification dismissal
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  

    
    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setUserLocation({ 
            lat: pos.coords.latitude, 
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            timestamp: pos.timestamp
          });
        },
        (err) => console.error("Location error:", err),
        { enableHighAccuracy: true, timeout: 3000, maximumAge: 0 }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [isLoggedIn]);

  const handleLogin = (userData: {name: string, phone: string, email: string}) => {
    setUser(userData);
    setIsLoggedIn(true);
    setShowOnboarding(true); 
    startOnboarding();
  };

  const startOnboarding = async () => {
    setOnboardingStep(1);
    await new Promise(r => setTimeout(r, 600)); // Accelerated
    setOnboardingStep(2);
    await new Promise(r => setTimeout(r, 600)); // Accelerated
    setOnboardingStep(3);
    await new Promise(r => setTimeout(r, 400)); // Accelerated
    setShowOnboarding(false);
    addNotification("Shield Deployed", "Your official SafeHer perimeter is now active.", "success");
  };

  const handleUpdateUser = (updatedUser: {name: string, phone: string, email: string}) => {
    setUser(updatedUser);
    addNotification("Profile Updated", "Official records synchronized.", "success");
  };

  const triggerSOS = useCallback(() => {
    setStatus(SafetyStatus.ALERT);
    addNotification("SOS ACTIVE", "Police Link Established. Vitals streaming.", "alert");
    addNotification("Circle Notified", "All verified guardians have been alerted.", "success");
    setActiveTab('map');
  }, [addNotification]);

  const handleCheckIn = useCallback(() => {
    setStatus(SafetyStatus.SAFE);
    addNotification("Safe Check-in", "Perimeter secured. Circle notified.", "success");
  }, [addNotification]);

  const handleCancelSOS = () => {
    setStatus(SafetyStatus.SAFE);
    addNotification("SOS Cancelled", "Standby mode resumed.", "success");
  };

  if (!isLoggedIn) {
    return <Auth onLogin={handleLogin} onNotify={addNotification} />;
  }

  return (
    <div className={`min-h-screen flex flex-col transition-all duration-300 ${status === SafetyStatus.ALERT ? 'bg-rose-100' : 'bg-rose-50/20'}`}>
      
      {showOnboarding && (
        <div className="fixed inset-0 z-[200] bg-rose-950/95 backdrop-blur-3xl flex items-center justify-center p-8 text-center animate-in fade-in duration-300">
          <div className="max-w-sm w-full space-y-8 animate-in zoom-in-95 duration-500">
             <div className="relative inline-flex">
                <div className="absolute -inset-12 bg-rose-500 rounded-full animate-ping opacity-20"></div>
                <div className="bg-white p-8 rounded-[40px] text-rose-600 shadow-2xl relative">
                  {onboardingStep < 3 ? <Loader2 size={48} className="animate-spin" /> : <ShieldCheck size={48} />}
                </div>
             </div>
             <div className="space-y-4">
                <h2 className="text-3xl font-black text-white tracking-tight">
                  {onboardingStep === 1 && "Verifying Identity..."}
                  {onboardingStep === 2 && "Linking Network..."}
                  {onboardingStep === 3 && "Shield Activated!"}
                </h2>
                <p className="text-rose-200/60 font-medium text-sm px-4">
                  {onboardingStep === 1 && `Calibrating sensors for ${user?.name}...`}
                  {onboardingStep === 2 && "Establishing secure law enforcement handshake."}
                  {onboardingStep === 3 && "You are protected by the SafeHer network."}
                </p>
             </div>
             <div className="flex gap-2 justify-center">
                {[1,2,3].map(i => (
                  <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${onboardingStep >= i ? 'w-8 bg-rose-500' : 'w-2 bg-rose-800'}`}></div>
                ))}
             </div>
          </div>
        </div>
      )}

      {status === SafetyStatus.ALERT && (
        <div className="bg-rose-600 text-white px-6 py-3 flex items-center justify-between animate-pulse sticky top-0 z-[60]">
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} />
            <span className="text-xs font-black uppercase tracking-[0.2em]">OFFICIAL POLICE ALERT</span>
          </div>
          <button onClick={handleCancelSOS} className="bg-white text-rose-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Deactivate</button>
        </div>
      )}

      <div className="fixed top-20 left-0 right-0 z-[100] p-4 pointer-events-none flex flex-col items-center gap-3">
        {notifications.map(n => (
          <div key={n.id} className={`pointer-events-auto w-full max-sm bg-white/95 backdrop-blur-xl border shadow-2xl rounded-3xl p-4 flex items-start gap-4 animate-in slide-in-from-top-full duration-300 ${n.type === 'alert' ? 'border-rose-200 ring-4 ring-rose-50' : 'border-rose-100'}`}>
             <div className={`p-2.5 rounded-2xl ${n.type === 'mail' ? 'bg-rose-500 text-white' : n.type === 'alert' ? 'bg-rose-600 text-white' : 'bg-emerald-500 text-white'}`}>
                {n.type === 'mail' ? <Mail size={20} /> : n.type === 'alert' ? <ShieldAlert size={20} /> : <ShieldCheck size={20} />}
             </div>
             <div className="flex-1">
                <p className="text-xs font-black text-slate-800 uppercase tracking-widest leading-none mb-1">{n.title}</p>
                <p className="text-[11px] text-slate-500 font-medium">{n.message}</p>
             </div>
             <button onClick={() => setNotifications(prev => prev.filter(notif => notif.id !== n.id))} className="text-slate-300 hover:text-slate-500 p-1"><X size={16} /></button>
          </div>
        ))}
      </div>

      <header className="p-6 pb-2 flex justify-between items-center bg-white/70 backdrop-blur-xl sticky top-0 z-50 border-b border-rose-100/50">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-rose-500 to-fuchsia-600 p-2 rounded-xl shadow-lg">
            <Heart className="text-white animate-heartbeat" size={22} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-rose-950">SafeHer</h1>
            <div className="flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${status === SafetyStatus.ALERT ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Verified</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 py-4 relative">
        {activeTab === 'dash' && (
          <Dashboard 
            status={status} 
            lastCheckIn={new Date()} 
            onCheckIn={handleCheckIn} 
            onSilentSOS={triggerSOS}
            location={userLocation}
            mode={safetyMode}
            onModeChange={setSafetyMode}
            userName={user?.name || 'Harshini'}
            circleMembers={contacts}
          />
        )}
        {activeTab === 'map' && <MapView userLocation={userLocation} circleMembers={contacts} isEmergency={status === SafetyStatus.ALERT} />}
        {activeTab === 'contacts' && <ContactsView contacts={contacts} onAdd={c => setContacts([...contacts, c])} onRemove={id => setContacts(contacts.filter(con => con.id !== id))} isUserSOS={status === SafetyStatus.ALERT} />}
        {activeTab === 'settings' && <SettingsView campusMode={safetyMode === 'campus'} onCampusToggle={v => setSafetyMode(v ? 'campus' : 'general')} onLogout={() => setIsLoggedIn(false)} user={user} onUpdateUser={handleUpdateUser} />}
        
        <div className="fixed bottom-28 right-6 z-[60] flex flex-col items-center gap-3">
          <button 
            onClick={status === SafetyStatus.ALERT ? handleCancelSOS : triggerSOS}
            className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 active:scale-90 ${status === SafetyStatus.ALERT ? 'bg-rose-600 text-white emergency-pulse border-4 border-white' : 'bg-white text-rose-600 border-2 border-rose-100'}`}
          >
            {status === SafetyStatus.ALERT ? <Power size={28} /> : <ShieldAlert size={28} />}
          </button>
        </div>
      </main>

      <nav className="bg-white/90 backdrop-blur-lg border-t border-rose-100 flex justify-around items-center py-4 px-6 pb-8 sticky bottom-0 rounded-t-[32px] shadow-lg">
        <NavButton active={activeTab === 'dash'} onClick={() => setActiveTab('dash')} icon={<ShieldCheck size={24} />} label="Vitals" />
        <NavButton active={activeTab === 'map'} onClick={() => setActiveTab('map')} icon={<MapPin size={24} />} label="Map" />
        <NavButton active={activeTab === 'contacts'} onClick={() => setActiveTab('contacts')} icon={<Users size={24} />} label="Circle" />
        <NavButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings size={24} />} label="Profile" />
      </nav>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }: any) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-all duration-200 ${active ? 'text-rose-600' : 'text-slate-300'}`}>
    <div className={`transition-transform duration-200 ${active ? 'scale-110 -translate-y-1' : ''}`}>{icon}</div>
    <span className={`text-[9px] font-black uppercase tracking-[0.15em] ${active ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>{label}</span>
  </button>
);

export default App;
