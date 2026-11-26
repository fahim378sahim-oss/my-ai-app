import {useEffect,useState} from "react";
interface E extends Event{prompt:()=>Promise<void>;userChoice:Promise<{outcome:"accepted"|"dismissed"}>}
export function usePWAInstall(){
  const [p,setP]=useState<E|null>(null),[ok,setOk]=useState(false),[ios,setIos]=useState(false);
  useEffect(()=>{
    setOk(window.matchMedia("(display-mode: standalone)").matches||(navigator as unknown as {standalone?:boolean}).standalone===true);
    setIos(/iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase()));
    const h1=(e:Event)=>{e.preventDefault();setP(e as E);},h2=()=>{setOk(true);setP(null);};
    window.addEventListener("beforeinstallprompt",h1);window.addEventListener("appinstalled",h2);
    return()=>{window.removeEventListener("beforeinstallprompt",h1);window.removeEventListener("appinstalled",h2);};
  },[]);
  const install=async()=>{if(!p)return false;await p.prompt();const {outcome}=await p.userChoice;if(outcome==="accepted"){setOk(true);setP(null);return true;}return false;};
  return{isInstallable:!!p,isInstalled:ok,isIOS:ios,install};
}
