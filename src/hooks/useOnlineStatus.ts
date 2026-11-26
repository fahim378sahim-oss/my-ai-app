import {useEffect,useState} from "react";
export function useOnlineStatus(){
  const [on,setOn]=useState(typeof navigator!=="undefined"?navigator.onLine:true);
  useEffect(()=>{const a=()=>setOn(true),b=()=>setOn(false);window.addEventListener("online",a);window.addEventListener("offline",b);return()=>{window.removeEventListener("online",a);window.removeEventListener("offline",b);};},[]);
  return on;
}
