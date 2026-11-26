import {useState} from "react";
import {Smartphone} from "lucide-react";
import {usePWAInstall} from "../hooks/usePWAInstall";
export function PWAInstallButton(){
  const {isInstallable,isInstalled,isIOS,install}=usePWAInstall();
  const [g,setG]=useState(false);
  if(isInstalled)return null;
  if(isInstallable)return(<button type="button" onClick={install} className="min-h-[40px] px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs sm:text-sm font-bold hover:bg-blue-700 transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"><Smartphone className="w-4 h-4"/><span>Install App</span></button>);
  if(isIOS)return(<><button type="button" onClick={()=>setG(true)} className="min-h-[40px] px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm font-bold text-black dark:text-slate-100 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"><Smartphone className="w-4 h-4"/><span>Install</span></button>{g&&<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-xl"><h3 className="font-display text-lg font-bold text-black dark:text-white">Install My AI</h3><p className="mt-2 text-sm text-slate-800 dark:text-slate-300">Tap Share then Add to Home Screen.</p><button type="button" onClick={()=>setG(false)} className="mt-4 w-full min-h-[44px] rounded-xl bg-slate-900 text-white text-sm font-bold">Close</button></div></div>}</>);
  return null;
}
