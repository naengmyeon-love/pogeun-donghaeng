from pathlib import Path
from html import escape
import json, math
from PIL import Image, ImageDraw, ImageFont

ROOT=Path(__file__).parent
OUT=ROOT/'다이어그램'
OUT.mkdir(exist_ok=True)
FONT='/System/Library/Fonts/AppleSDGothicNeo.ttc'
INK='#17243B'; MUTED='#52627B'; BLUE='#3158D5'; LINE='#9AAAC3'
BG='#F5F7FC'; LIGHT='#EAF0FF'; MINT='#E7F6F1'; PEACH='#FFF0E5'; WHITE='#FFFFFF'
CHECKS=[]

class Board:
 def __init__(self,title,sub):
  self.w,self.h=1440,980
  self.im=Image.new('RGB',(self.w,self.h),BG); self.d=ImageDraw.Draw(self.im)
  self.svg=[f'<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="980" viewBox="0 0 1440 980"><title>{escape(title)}</title><desc>{escape(sub)}</desc><rect width="1440" height="980" fill="{BG}"/>']
  self.text(48,32,'포근동행  /  역할별 UX 설계  /  2026.11.01',17,MUTED)
  self.text(48,74,title,36,INK)
  self.text(48,126,sub,19,MUTED)
  self.line([(48,166),(1392,166)],'#DCE3EE',1)
 def text(self,x,y,s,size=20,color=INK,center=False):
  f=ImageFont.truetype(FONT,size)
  for i,t in enumerate(s.split('\n')):
   yy=y+i*(size+9); tw=self.d.textlength(t,font=f); xx=x-tw/2 if center else x
   assert xx>=0 and xx+tw<1445 and yy+size<980,(t,xx,yy,tw)
   self.d.text((xx,yy),t,font=f,fill=color)
   self.svg.append(f'<text x="{x}" y="{yy+size*.84}" font-family="Apple SD Gothic Neo, Noto Sans KR, sans-serif" font-size="{size}" fill="{color}"'+(' text-anchor="middle"' if center else '')+f'>{escape(t)}</text>')
 def rect(self,x,y,w,h,fill=WHITE,stroke='#DCE3EE',r=16):
  self.d.rounded_rectangle((x,y,x+w,y+h),radius=r,fill=fill,outline=stroke,width=1)
  self.svg.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" stroke="{stroke}"/>')
 def line(self,pts,color=LINE,width=2,arrow=False,dash=False):
  if dash:
   for a,b in zip(pts,pts[1:]):
    dist=math.dist(a,b)
    for t in range(0,int(dist),12):
     v=min(t+6,dist); p=(a[0]+(b[0]-a[0])*t/dist,a[1]+(b[1]-a[1])*t/dist); q=(a[0]+(b[0]-a[0])*v/dist,a[1]+(b[1]-a[1])*v/dist)
     self.d.line([p,q],fill=color,width=width)
  else:self.d.line(pts,fill=color,width=width)
  self.svg.append(f'<polyline points="'+ ' '.join(f'{x},{y}' for x,y in pts)+f'" fill="none" stroke="{color}" stroke-width="{width}"'+(' stroke-dasharray="6 6"' if dash else '')+'/>')
  if arrow:
   a,b=pts[-2:]; ang=math.atan2(b[1]-a[1],b[0]-a[0]); tri=[b,(b[0]-10*math.cos(ang-.45),b[1]-10*math.sin(ang-.45)),(b[0]-10*math.cos(ang+.45),b[1]-10*math.sin(ang+.45))]
   self.d.polygon(tri,fill=color);self.svg.append('<polygon points="'+' '.join(f'{x},{y}' for x,y in tri)+f'" fill="{color}"/>')
 def box(self,x,y,w,title,body='',kind='normal',h=110):
  fill={'primary':LIGHT,'external':'#EDF0F5','decision':PEACH,'done':MINT}.get(kind,WHITE)
  self.rect(x,y,w,h,fill)
  for t in title.split('\n'):assert self.d.textlength(t,font=ImageFont.truetype(FONT,21))<=w-26,(title,w)
  self.text(x+16,y+17,title,21,BLUE if kind=='primary' else INK)
  if body:
   for t in body.split('\n'):assert self.d.textlength(t,font=ImageFont.truetype(FONT,17))<=w-26,(body,w)
   self.text(x+16,y+53+(len(title.split('\n'))-1)*30,body,17,MUTED)
 def note(self,title,body,y=837):
  self.rect(48,y,1344,83,LIGHT,stroke=LIGHT)
  self.text(66,y+14,title,19,BLUE);self.text(66,y+44,body,17,MUTED)
 def save(self,stem):
  self.text(48,946,'실선: 구조·이동  ·  점선: 보완·재질문  ·  회색: 외부 역할  ·  연한 주황: 확인·분기  ·  초록: 처리 결과',16,MUTED)
  self.text(1390,946,'설계 제안 · 화면 ID는 본 시안 기준',16,MUTED,center=False) if False else None
  (OUT/(stem+'.svg')).write_text('\n'.join(self.svg+['</svg>']))
  self.im.save(OUT/(stem+'.png')); CHECKS.append(stem)

roles={'학생': {'code': 'S',
        'home': '학생 공간',
        'sub': '배정된 수업과 같은 자료로 배우고, 복습하고, 선생님에게 질문합니다.',
        'groups': [('오늘', 'S01', [('오늘의 수업', '시간·담당 선생님·바로가기'), ('이어 할 일', '복습 위치·도착한 답변')]),
                   ('배움방',
                    'S02',
                    [('S03 차시 자료', '수학·영어 / 학습 목표'), ('S04 복습', '문제·힌트·피드백'), ('S07 학습 기록', '출석·복습·이해 확인')]),
                   ('질문', 'S06', [('S05 질문 작성', '차시·문항 자동 연결'), ('S06 질문 목록·상세', '대기·답변·재질문·이해함')])],
        'nav': [('오늘 S01', '수업 카드 → S03 차시 자료', '복습 카드 → S04 / 답변 카드 → S06'),
                ('배움방 S02', '과목·차시 → S03 → S04 복습', '학습 기록 → S07 / 막힌 문제 → S05'),
                ('질문 S06', '질문 선택 → S06 답변 상세', '원래 문제 → S04 / 다시 묻기 → S05')],
        'note': '자료 ID·버전·문항은 자동 연결하고, 학생 화면에는 과목·차시·문제 이름으로 보여줍니다.'},
 '튜터': {'code': 'T',
        'home': '튜터 공간',
        'sub': '담당 클래스의 수업 준비, 공통 자료, 질문 답변과 학습 기록을 연결합니다.',
        'groups': [('오늘', 'T01', [('수업·질문 요약', '일정·준비·답변 대기')]),
                   ('클래스', 'T02', [('T03 수업 준비·진행', '차시·출석·복습 배정'), ('자료 꾸러미', '학생 자료·지도안·문제')]),
                   ('배포 자료', 'T04', [('중앙 배포 자료', '과목·목표·버전'), ('자료 피드백', '오류·개선 제안')]),
                   ('질문함', 'T06', [('질문 대기·재질문', '담당·기한·학습 맥락'), ('T07 질문 답변', '설명·검토 요청')]),
                   ('학습 기록', 'T08', [('학생별 기록', '출석·시도·자기 확인'), ('다음 수업 보충', '관찰·보충 메모')])],
        'nav': [('오늘 T01', '수업 카드 → T03 수업 준비', '질문 카드 → T07 질문 답변'),
                ('클래스 T02', '반·차시 → T03 준비·진행', '학생 기록 → T08 / 배정 자료 → T04'),
                ('배포 자료 T04', '배포 자료 상세 → T03에 선택', '자료 오류·개선 제안 → 중앙 전달'),
                ('질문함 T06', '질문 선택 → T07 답변', '연결 자료 → T04 / 학생 기록 → T08'),
                ('학습 기록 T08', '반·학생 선택 → 기록 상세', '다음 수업 준비 → T03')],
        'note': '중앙이 제작·검토·배포한 자료로 수업합니다. 튜터는 원본을 편집하지 않고 오류·개선 의견을 전달합니다.'},
 '기관': {'code': 'I',
        'home': '기관 공간',
        'sub': '우리 기관에서 튜터·학생을 매칭하고, 중앙 배포 자료로 수업을 운영합니다.',
        'groups': [('운영 홈', 'I01', [('현황 요약', '수업·대기·지원 필요'), ('우선 확인', '미처리 요청·기한')]),
                   ('참여 학생', 'I02', [('I03 학생 상세', '참여·동의 확인 상태'), ('학습 지원 정보', '출결·접속 지원 필요')]),
                   ('튜터·매칭', 'I04', [('튜터·학생 선택', '과목·자격·시간·정원'), ('기관 매칭 확정', '신규·대체·인계')]),
                   ('일정·자료', 'I05', [('기관 수업 일정', '담당·장소·변경·보강'), ('I09 배포 자료', '수신 확인·클래스 연결')]),
                   ('지원', 'I06', [('지원 요청 목록', '접속·기기·수업 공백'), ('I07 지원 상세', '담당·조치·확인 결과')])],
        'nav': [('운영 홈 I01', '우선 확인 → I04 / I07', '오늘 수업 → I05 / 새 자료 → I09'),
                ('참여 학생 I02', '학생 선택 → I03 상세', '튜터 매칭 → I04 / 지원 → I07'),
                ('튜터·매칭 I04', '조건 확인 → 기관에서 매칭 확정', '확정 일정 → I05 / 대체·인계 → I04'),
                ('일정·자료 I05', '수업 선택 → 일정·변경·보강', '자료 수신 → I09 → 클래스 자료 연결'),
                ('지원 I06', '항목 선택 → I07 조치·확인', '기관 해결이 어려운 요청 → 중앙 지원')],
        'note': '기관이 소속 튜터·학생 매칭을 확정합니다. 공통 자료는 중앙에서 받고 운영 현황·지원 필요를 중앙과 공유합니다.'},
 '중앙 운영자': {'code': 'C',
            'home': '중앙 운영 공간',
            'sub': '전국 기관의 프로그램 운영을 확인하고 교육과정 기반 공통 학습자료를 제작·배포합니다.',
            'groups': [('전국 현황', 'C01', [('전국 운영 요약', '기간·지역·과목·상태'), ('확인 필요 기관', '미배정·수업 공백·지원')]),
                       ('기관 관리', 'C02', [('C03 기관 상세', '클래스·운영·담당자'), ('운영 이력', '보고 시점·조치 상태')]),
                       ('자료 제작', 'C04', [('C05 제작·편집', '성취기준·자료 꾸러미'), ('C06 내부 검토', '정답·해설·수정 이력')]),
                       ('자료 배포', 'C07', [('배포 설정', '대상 기관·버전·시점'), ('C08 배포 현황', '배포·수신·사용 상태')]),
                       ('운영 지원', 'C09', [('C10 지원 상세', '기관·사유·담당·기한'), ('조치·재확인', '자료 오류·운영 지원')])],
            'nav': [('전국 현황 C01', '확인 필요 기관 → C03 기관 상세', '배포 지연 → C08 / 운영 지원 → C10'),
                    ('기관 관리 C02', '기관 선택 → C03 운영 현황', '지원 등록·이력 → C10 / 배포 → C08'),
                    ('자료 제작 C04', '새 자료·수정 → C05 제작·편집', '내부 검토 → C06 → C07 배포 설정'),
                    ('자료 배포 C07', '대상·버전·시점 확인 → 배포', '기관별 수신·사용 → C08'),
                    ('운영 지원 C09', '요청 선택 → C10 조치·재확인', '관련 기관 → C03 / 자료 수정 → C05')],
            'note': '전국 현황은 운영 지원에 활용합니다. 자료 제작·검토·배포는 중앙이 맡고, 개별 매칭 확정은 각 기관이 맡습니다.'}}

for role,d in roles.items():
 b=Board(f'{role} · IA 정보구조',d['sub'])
 b.box(540,190,360,d['home'],'정보를 어떤 묶음으로 나누는가',kind='primary',h=95)
 n=len(d['groups']); gap=18; w=(1344-gap*(n-1))/n
 b.line([(720,285),(720,315)])
 centers=[48+i*(w+gap)+w/2 for i in range(n)]
 b.line([(centers[0],315),(centers[-1],315)])
 for i,(name,sid,children) in enumerate(d['groups']):
  x=48+i*(w+gap);b.line([(centers[i],315),(centers[i],345)],arrow=True)
  b.box(x,345,w,f'{sid}  {name}',kind='primary',h=65)
  for j,(name2,content) in enumerate(children):
   y=432+j*119;b.box(x,y,w,name2,content,h=99)
   if j==0:b.line([(centers[i],410),(centers[i],432)])
  last=432+len(children)*119
 b.note('정보 연결 원칙',d['note'])
 b.text(48,794,'공통 영역  G01 로그인·참여 상태  /  G02 도움·계정'+('  /  I08 기관 설정' if role=='기관' else ''),18,MUTED)
 b.save(f'{d["code"]}-01-IA')

 b=Board(f'{role} · 내비게이션 구조','항상 보이는 메뉴와 화면 안의 이동·돌아오기 경로를 구분합니다.')
 b.text(48,191,'고정 내비게이션',22,BLUE);b.text(375,191,'선택 후 이동하는 화면',22,BLUE)
 n=len(d['nav']);step=105 if n==5 else 150
 for i,(menu,route,quick) in enumerate(d['nav']):
  y=239+i*step
  b.box(48,y,270,menu,kind='primary',h=77)
  b.line([(318,y+38),(367,y+38)],arrow=True)
  b.rect(380,y,1012,87)
  b.text(403,y+12,route,22);b.text(403,y+48,quick,18,MUTED)
 b.rect(48,790,1344,128,LIGHT,stroke=LIGHT)
 b.text(68,807,'배치와 복귀 규칙',20,BLUE)
 layout='PC: 상단 3개 메뉴  /  모바일: 하단 오늘·배움방·질문' if role=='학생' else 'PC: 왼쪽 메뉴  /  작은 화면: 이름이 보이는 전체 메뉴 버튼'
 b.text(68,841,layout+'  /  도움·계정은 공통 영역',18)
 return_rule='지원 상세에서 관련 학생·요청으로 복귀' if role=='기관' else '기관·배포 상세에서 원래 목록으로 복귀' if role=='중앙 운영자' else '질문에서 원래 차시·문항으로 복귀'
 b.text(68,876,'상세에는 뒤로가기와 상위 경로 표시 · 목록의 선택·필터 유지 · '+return_rule,18,MUTED)
 b.save(f'{d["code"]}-02-내비게이션')

def flowrow(b,y,label,items,loop=None):
 b.text(48,y-40,label,21,BLUE)
 w=240;gap=36;xs=[48+i*(w+gap) for i in range(5)]
 for i,item in enumerate(items):
  title,body,kind=item;b.box(xs[i],y,w,title,body,kind,h=112)
  if i<len(items)-1:b.line([(xs[i]+w,y+56),(xs[i+1],y+56)],arrow=True)
 if loop:
  start,end,lab=loop
  yy=y+144
  b.line([(xs[start]+w/2,y+112),(xs[start]+w/2,yy),(xs[end]+w/2,yy),(xs[end]+w/2,y+112)],BLUE,arrow=True,dash=True)
  b.rect((xs[start]+xs[end])/2+28,yy-11,360,28,BG,stroke=BG,r=3)
  b.text((xs[start]+xs[end])/2+40,yy-8,lab,16,BLUE)

b=Board('학생 · 화면 흐름도','수업 → 같은 자료로 복습 → 필요한 경우 질문 → 답변 확인 후 다시 풀기')
flowrow(b,225,'01  수업과 복습',[
 ('S01 오늘','오늘의 수업 선택','primary'),('S02 배움방','과목·차시 선택','normal'),('S03 차시 자료','수업 자료 확인','normal'),('S04 복습','답·힌트·다시 풀기','normal'),('S07 학습 기록','복습 완료 시 기록','done')])
flowrow(b,475,'02  S03·S04에서 막힌 경우',[
 ('S05 질문 작성','문제 자동 연결\n막힌 부분 선택','primary'),('S06 질문 대기','접수 상태·담당 안내','normal'),('외부: T07 튜터','맥락 확인 후 답변','external'),('S06 답변 확인','이해함 / 아직 어려움','decision'),('S04 다시 풀기','이해함 선택 후\n원래 문제로 복귀','done')],loop=(3,0,'아직 어려움 → 같은 질문에 이어 묻기'))
b.note('예외와 상태','매칭 전: G01 참여 안내 → 기관 도움 / 제출 실패: 입력 유지·재시도 / 답변 도착은 이해 완료가 아닙니다.')
b.text(48,744,'빠른 길: S01의 수업·복습·답변 카드는 각각 S03·S04·S06으로 바로 연결됩니다.',19,MUTED)
b.text(48,781,'복습은 질문 없이도 완료할 수 있고, 답변을 본 뒤에도 같은 문항을 다시 풀 수 있습니다.',19,MUTED)
b.save('S-03-화면흐름')


b=Board('튜터 · 화면 흐름도','중앙 배포 자료로 수업하고, 질문에 답변하며, 자료 개선 의견을 전달합니다.')
flowrow(b,220,'01  배포 자료로 수업 준비·진행',[
 ('T01 오늘','기관이 배정한 수업','primary'),('T03 수업 준비','T04 배포 자료 확인\n배정된 버전 유지','normal'),('T03 수업 진행','학생 자료·지도안\n출석·이해 확인','normal'),('T03 수업 마무리','공통 복습 배정\n수업 메모 저장','normal'),('T08 학습 기록','보충할 내용 확인\n다음 수업 반영','done')])
flowrow(b,450,'02  자료 오류·개선 의견이 있는 경우',[
 ('T04 배포 자료','자료·문항 위치 확인','primary'),('T04 의견 전달','오류·개선 사유\n원본은 수정하지 않음','normal'),('외부: 중앙 C10','접수·영향 확인\n중앙 제작팀 검토','external'),('외부: 중앙 C05','필요 시 수정·검토\n새 버전 제작','external'),('T04 정정 안내','중앙 재배포 확인\n기관 적용 안내 확인','done')])
flowrow(b,715,'03  학생 질문에 답변',[
 ('T06 질문함','새 질문·재질문 선택','primary'),('T07 맥락 확인','자료·버전·문항\n학생의 시도 확인','normal'),('T07 설명 작성','설명 확인 후 전송\n실패 시 입력 유지','normal'),('외부: S06 학생','이해함 / 재질문','external'),('T06·T08 후속','재질문은 답변 대기\n보충은 다음 수업','done')])
b.text(48,891,'튜터의 자료 제작·승인 요청 흐름은 없습니다. 수업 메모와 보충 설명은 중앙 배포 원본과 구분합니다.',18,MUTED)
b.save('T-03-화면흐름')

b=Board('기관 · 화면 흐름도','기관이 참여 확인·매칭 확정·수업 운영을 맡고, 중앙 자료와 운영 지원을 연결합니다.')
flowrow(b,220,'01  기관에서 튜터·학생 직접 매칭',[
 ('I02 참여 학생','I03 참여·동의 확인\n미완료는 보완 안내','primary'),('I04 후보 선택','튜터 자격·과목\n시간·정원 확인','normal'),('I04 조건 확인','가능 / 보완 필요\n가능할 때만 확정','decision'),('I04 매칭 확정','기관 담당자가 확정\n학생·튜터 안내','normal'),('I05 수업 운영','클래스·일정·장소\n대체·보강도 기관 관리','done')],loop=(2,1,'조건 불충족 → 후보·시간 조정'))
flowrow(b,485,'02  중앙 배포 자료 수신·사용',[
 ('외부: 중앙 C07','검토된 자료 배포\n대상·버전·시점','external'),('I09 자료 수신','버전·변경점 확인\n수신 상태 기록','primary'),('I09 클래스 연결','해당 과목·차시 연결\n튜터에게 사용 안내','normal'),('외부: 튜터 T03','공통 자료로 수업\n같은 자료로 복습 배정','external'),('I01 운영 현황','수신·사용 상태\n중앙 현황에 반영','done')])
flowrow(b,720,'03  운영 지원과 중앙 협력',[
 ('I06 지원 목록','수업 공백·접속 문제','primary'),('I07 기관 조치','담당·기한·지원 기록\n미해결 사유 확인','normal'),('외부: 중앙 C10','기관에서 해결 어려움\n운영 지원·자료 정정','external'),('I07 결과 확인','운영 재개 확인\n미해결은 재지원','decision'),('I01 현황 반영','조치 결과 공유\n학습 이해와 구분','done')])
b.text(48,897,'일반 매칭은 중앙 승인 없이 기관에서 확정합니다. 중앙은 전국 현황을 확인하고 필요한 지원을 제공합니다.',18,MUTED)
b.save('I-03-화면흐름')

b=Board('중앙 운영자 · 화면 흐름도','공통 자료의 제작·배포와 전국 기관의 운영 확인·지원이 핵심 업무입니다.')
flowrow(b,220,'01  중앙에서 학습자료 제작·검토',[
 ('C04 자료 제작','과목·학년·단원 선택','primary'),('C05 제작·편집','교육과정 근거 연결\nAI 초안 또는 직접 작성','normal'),('C05 자료 꾸러미','학생 자료·지도안\n복습 문제·정답·해설','normal'),('C06 내부 검토','내용·정답·적합성\n승인 / 수정 필요','decision'),('C07 배포 준비','검토 완료 버전 선택\n대상 기관·시점 설정','done')],loop=(3,1,'수정 필요 → 중앙 제작자가 보완'))
flowrow(b,485,'02  전국 기관에 배포하고 사용까지 확인',[
 ('C07 배포 확인','대상·버전·시점 확인','primary'),('C07 배포 실행','배포 이력·변경점 안내','normal'),('외부: 기관 I09','수신·클래스 연결\n튜터 공통 자료 사용','external'),('C08 배포 현황','배포·수신·사용 구분\n미수신 기관 확인','decision'),('C10 후속 지원','미수신 사유 확인\n지원·재전달·재확인','done')])
flowrow(b,720,'03  전국 프로그램 운영 확인·지원',[
 ('C01 전국 현황','기간·지역·과목 필터\n집계 시점 함께 표시','primary'),('C03 기관 상세','미배정·수업 공백\n미답변·지원 지연 확인','normal'),('C10 지원 등록','담당·기한·사유\n기관과 조치 협의','normal'),('외부: 기관 I07','기관 조치·결과 공유\n필요 시 중앙 협력','external'),('C10 재확인','해결 / 추가 지원\nC01 운영 현황 갱신','done')])
b.text(48,897,'현황 숫자만으로 정상 운영을 단정하지 않습니다. 기준 기간·분모·최종 보고 시점·미보고 상태를 함께 봅니다.',18,MUTED)
b.save('C-03-화면흐름')

b=Board('중앙 제작 · 기관 운영 · 학습의 연결','중앙이 공통 자료와 품질을 관리하고, 기관이 매칭과 현장 운영을 책임집니다.')
flowrow(b,220,'01  공통 학습자료를 전국으로',[
 ('중앙 · 자료 제작','교육과정·성취기준\n학생용·지도안·복습','primary'),('중앙 · 내부 검토','정답·해설·적합성\n수정 후 버전 확정','normal'),('중앙 · 자료 배포','대상 기관·적용 시점\n배포 이력 관리','normal'),('기관 · 자료 수신','수신 확인·클래스 연결\n튜터에게 사용 안내','normal'),('튜터·학생 · 학습','수업·복습·질문\n같은 자료 버전 유지','done')])
flowrow(b,485,'02  매칭과 수업은 각 기관에서',[
 ('기관 · 참여 확인','학생 참여·튜터 자격','primary'),('기관 · 조건 확인','과목·시간·정원','normal'),('기관 · 매칭 확정','담당 튜터·학생 연결','normal'),('기관·튜터 · 수업','일정·출석·보강\n공통 자료로 진행','normal'),('학생 · 복습·질문','튜터 답변·재시도\n다음 수업 보충','done')])
flowrow(b,720,'03  운영 현황을 보고 필요한 지원을 되돌려 보내기',[
 ('기관 · 현황 공유','매칭·수업·자료 사용\n미해결 지원·보고 시점','primary'),('중앙 · 전국 확인','지역·기관·과목별\n운영 지연·공백 확인','normal'),('중앙 · 기관 상세','문제 사유·영향 확인\n지원 담당·기한 지정','normal'),('중앙·기관 · 조치','운영 지원·자료 개선\n조치 결과 공유','normal'),('중앙 · 재확인','정상화·추가 지원\n다음 자료 제작에 반영','done')])
b.text(48,897,'중앙 = 제작·배포·전국 관리  /  기관 = 매칭·수업 운영  /  튜터 = 수업·답변  /  학생 = 학습·복습',20,BLUE)
b.save('00-역할-연결')
(ROOT/'검증-기록.json').write_text(json.dumps({'version':2,'diagrams':CHECKS,'count':len(CHECKS),'canvas':'1440×980','checks':['모든 텍스트 캔버스 범위 검사','카드 제목·본문 폭 검사','PNG·SVG 동시 생성']},ensure_ascii=False,indent=2))
print(f'{len(CHECKS)} diagrams rendered to PNG and SVG')
