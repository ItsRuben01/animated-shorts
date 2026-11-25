import json,re,math,subprocess,shutil,wave,contextlib,array
from pathlib import Path
root=Path(r"C:\Users\rubca\OneDrive\Documentos\Canal_Ingenieria\animated-shorts\.claude\skills")
wav=root/"public/ep3/voice3.wav"
out=subprocess.check_output(["ffmpeg","-hide_banner","-i",str(wav),"-af","silencedetect=noise=-30dB:d=0.25","-f","null","-"],stderr=subprocess.STDOUT,text=True)
starts=[float(m) for m in re.findall(r"silence_start: ([0-9.]+)",out)]
ends=[float(m) for m in re.findall(r"silence_end: ([0-9.]+)",out)]
with contextlib.closing(wave.open(str(wav),"rb")) as w:
    sr=w.getframerate(); n=w.getnframes(); ch=w.getnchannels(); sw=w.getsampwidth(); data=w.readframes(n)
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
print("segs",len(segs))
for i,(s,e) in enumerate(segs,1): print(i,f"{s:.2f}-{e:.2f}",f"{e-s:.2f}")
