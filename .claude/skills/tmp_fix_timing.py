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
shots=json.loads((root/"episodes/ep3/shots.json").read_text(encoding="utf-8-sig"))
# distribute 27 segs across 20 shots by cumulative word weight
counts=[len(re.sub(r"[,.?!:;…¡¿]","",s["text"]).split()) for s in shots]
totalW=sum(counts); totalS=len(segs)
boundaries=[0]
cum=0
for c in counts[:-1]:
    cum+=c
    boundaries.append(int(round(cum/totalW*totalS)))
# make strictly increasing and within range
for i in range(1,len(boundaries)):
    boundaries[i]=max(boundaries[i-1]+1,min(boundaries[i], totalS-(len(boundaries)-i)))
boundaries.append(totalS)
timing={"voice":"external-voice3","speed":1,"total":round(trimEnd,3),"shots":[]}
for i,s in enumerate(shots):
    a,bnd=boundaries[i],boundaries[i+1]
    a=max(0,min(a,totalS-1)); bnd=max(a+1,min(bnd,totalS))
    rs=max(trimStart,segs[a][0]-0.02)
    re_=min(trimEnd,segs[bnd-1][1]+0.02)
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
shutil.copy2(wav, root/"public/ep3/voice.wav")
print("ok",len(timing["shots"]),timing["total"])
for s in timing["shots"]: print(s["id"],s["start"],s["end"])
