import json,re,math,subprocess,shutil,wave,contextlib,array
from pathlib import Path
root=Path(r"C:\Users\rubca\OneDrive\Documentos\Canal_Ingenieria\animated-shorts\.claude\skills")
wav=root/"public/ep3/voice3.wav"
out=subprocess.check_output(["ffmpeg","-hide_banner","-i",str(wav),"-af","silencedetect=noise=-30dB:d=0.25","-f","null","-"],stderr=subprocess.STDOUT,text=True)
starts=[float(m) for m in re.findall(r"silence_start: ([0-9.]+)",out)]
ends=[float(m) for m in re.findall(r"silence_end: ([0-9.]+)",out)]
with contextlib.closing(wave.open(str(wav),"rb")) as w:
    sr=w.getframerate(); n=w.getnframes(); ch=w.getnchannels(); data=w.readframes(n)
pcm=array.array("h"); pcm.frombytes(data)
if ch>1: pcm=pcm[::ch]
F=sr//100; env=[]
for i in range(len(pcm)//F):
    s=0.0
    for j in range(F): v=pcm[i*F+j]/32768.0; s+=v*v
    env.append(math.sqrt(s/F))
peak=max(env); th=peak*0.04
a=0;b=len(env)-1
while a<b and env[a]<th:a+=1
while b>a and env[b]<th:b-=1
trimStart=max(0,(a-2)*0.01); trimEnd=min(len(pcm)/sr,(b+4)*0.01)
segs=[]; cur=trimStart
for s,e in zip(starts,ends):
    if s>cur+0.05: segs.append((cur,min(s,trimEnd)))
    cur=max(cur,e)
if trimEnd>cur+0.05: segs.append((cur,trimEnd))
segs=[s for s in segs if s[1]-s[0]>0.15]
groups=[(0,5),(5,7),(7,10),(10,12),(12,13),(13,14),(14,15),(15,16),(16,17),(17,18),(18,19),(19,20),(20,21),(21,22),(22,23),(23,24),(24,25),(25,26),(26,27)]
shots=json.loads((root/"episodes/ep3/shots.json").read_text(encoding="utf-8-sig"))
timing={"voice":"external-voice3","speed":1,"total":round(trimEnd,3),"shots":[]}
for i,(s,(a,b)) in enumerate(zip(shots,groups)):
    a=max(0,min(a,len(segs)-1)); b=max(a+1,min(b,len(segs)))
    rs=max(trimStart,segs[a][0]-0.02)
    re_=min(trimEnd,segs[b-1][1]+0.02)
    if i>0: rs=max(rs,timing["shots"][-1]["end"])
    if re_<=rs: re_=min(trimEnd,rs+0.25)
    words=re.sub(r"[,.?!:;…¡¿]","",s["text"]).split()
    ws=[]
    for j,w in enumerate(words):
        a0=rs+(re_-rs)*j/max(1,len(words)); a1=rs+(re_-rs)*(j+1)/max(1,len(words))
        ws.append({"w":w,"start":round(a0,3),"end":round(a1,3)})
    timing["shots"].append({"id":s["id"],"start":round(rs,3),"end":round(re_,3),"words":ws})
timing["total"]=timing["shots"][-1]["end"]
(root/"episodes/ep3/timing.json").write_text(json.dumps(timing,ensure_ascii=False,indent=1),encoding="utf-8")
shutil.copy2(root/"public/ep3/voice.wav", root/"public/ep3/voice.prev.bak.wav")
shutil.copy2(wav, root/"public/ep3/voice.wav")
print("ok",len(timing["shots"]),timing["total"])
for s in timing["shots"]: print(s["id"],s["start"],s["end"])
