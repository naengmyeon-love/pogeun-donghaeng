(function(root){
'use strict';
const VERSION=1, KEY='pogeun-prototype-v1';
const catalogId='grade5-semester1-2022-v1';
const sources=[{title:'교육부 · 2022 개정 교육과정 고시 및 적용 시기',url:'https://www.moe.go.kr/boardCnts/viewRenew.do?boardID=141&boardSeq=93458&lev=0&m=0404'},{title:'충청북도교육청 · 2022 개정 초등학교 각론 (수학 81~82쪽, 영어 137쪽)',url:'https://pain.cbe.go.kr/upload/dept-19/na/bbs_1437/2025/01/42D2EF47-B7BF-7348-32ED-418D79977B1A.pdf'}];
const semesterContent=typeof module!=='undefined'&&module.exports?[...require('./curriculum-math.js'),...require('./curriculum-english.js')]:[...(root.PogeunMathSemester||[]),...(root.PogeunEnglishSemester||[])];
const MaterialAgent=typeof module!=='undefined'&&module.exports?require('./material-agent.js'):root.PogeunMaterialAgent;
function installSemester(s){
 for(const content of semesterContent){
  const existing=s.materials.find(m=>m.id===content.id);
  // Finalize unused preview copies without changing material already referenced by learning records.
  if(existing&&existing.catalogId===catalogId&&!existing.contentRevision&&!s.classes.some(c=>c.materialId===content.id)&&!s.questions.some(q=>q.materialId===content.id)&&!s.attempts.some(a=>a.materialId===content.id))Object.assign(existing,clone(content),{contentRevision:1});
  if(!existing)s.materials.push({...clone(content),catalogId,contentRevision:1,status:'published',reviewed:true,checks:[true,true,true,true],curriculum:'2022 개정 교육과정 · 초등 5~6학년군',curriculumChecked:'2026-11-02',sources:clone(sources),publicationNote:'포근동행 자체 제작 · 프로토타입 수록본'});
  for(const ins of s.institutions)if(!s.deliveries.some(d=>d.materialId===content.id&&d.institution===ins.id))s.deliveries.push({materialId:content.id,institution:ins.id,received:true});
 }
 return installMatching(s);
}

const lessons={math:{subject:'수학',title:'분수의 크기 비교',goal:'분모가 다른 분수의 크기를 비교할 수 있어요.',explanation:'분모가 다르면 바로 비교하기 어려워요. 분모를 같게 만든 다음 분자를 비교해 보세요.',guide:'같은 크기의 전체를 나눈 그림으로 시작합니다. 학생이 분모를 같게 만드는 이유를 말하도록 기다려 주세요.',questions:[{id:'m1',text:'2/3와 3/4 중 더 큰 분수는 무엇일까요?',options:['2/3','3/4'],answer:1,hint:'분모를 12로 같게 만들어 볼까요?',feedback:'2/3는 8/12, 3/4는 9/12예요. 따라서 3/4가 더 커요.'},{id:'m2',text:'1/2와 크기가 같은 분수는 무엇일까요?',options:['1/4','2/4','3/4'],answer:1,hint:'분자와 분모에 같은 수를 곱해 보세요.',feedback:'1/2의 분자와 분모에 각각 2를 곱하면 2/4가 돼요.'},{id:'m3',text:'5/6와 3/4 중 더 큰 분수는 무엇일까요?',options:['5/6','3/4'],answer:0,hint:'공통 분모 12를 사용해 보세요.',feedback:'5/6는 10/12, 3/4는 9/12예요. 10/12가 더 크므로 5/6가 더 커요.'}]},english:{subject:'영어',title:'하루 일과 말하기',goal:'하루 일과를 짧은 영어 문장으로 말할 수 있어요.',explanation:'I get up at seven. 나는 7시에 일어나요. I go to school at eight. 나는 8시에 학교에 가요.',guide:'예시 문장을 함께 읽고 학생의 일과에 맞게 시간을 바꿔 말해 봅니다. 정답보다 의미 전달을 먼저 확인해 주세요.',questions:[{id:'e1',text:'“I get up at seven.”은 어떤 뜻일까요?',options:['나는 7시에 일어나요.','나는 7시에 잠들어요.','나는 7시에 점심을 먹어요.'],answer:0,hint:'get up은 일어난다는 뜻이에요.',feedback:'get up은 일어나다, at seven은 7시에라는 뜻이에요.'},{id:'e2',text:'“나는 8시에 학교에 가요.”에 맞는 문장은?',options:['I get up at eight.','I go to school at eight.','I eat lunch at eight.'],answer:1,hint:'학교에 가다는 go to school이에요.',feedback:'I go to school at eight.라고 말할 수 있어요.'},{id:'e3',text:'“I eat lunch.”에서 lunch는 무엇일까요?',options:['아침','점심','저녁'],answer:1,hint:'하루의 가운데에 먹는 식사예요.',feedback:'lunch는 점심이에요. I eat lunch.는 나는 점심을 먹어요라는 뜻이에요.'}]}};
function seed(){return installSemester({schema:VERSION,institutions:[{id:'ga',name:'가온센터',region:'서울',reported:'오늘 10:30'},{id:'da',name:'다온센터',region:'전북',reported:'오늘 09:20'},{id:'nu',name:'누리센터',region:'강원',reported:'어제 17:00'}],students:[{id:'s1',name:'이지우',institution:'ga',consent:true,subjects:['math','english']},{id:'s2',name:'김하늘',institution:'ga',consent:true,subjects:['math']},{id:'s3',name:'박서준',institution:'ga',consent:true,subjects:['math']},{id:'s4',name:'최다은',institution:'ga',consent:false,subjects:['english']},{id:'s5',name:'정민준',institution:'da',consent:true,subjects:['math']},{id:'s6',name:'오수빈',institution:'nu',consent:true,subjects:['english']}],tutors:[{id:'t1',name:'김민서',institution:'ga',verified:true,subjects:['math','english'],slots:['화요일 16:00','목요일 17:00']},{id:'t2',name:'이도윤',institution:'ga',verified:true,subjects:['math'],slots:['목요일 17:00']},{id:'t3',name:'박유진',institution:'ga',verified:false,subjects:['english'],slots:['화요일 16:00']},{id:'t4',name:'장서연',institution:'da',verified:true,subjects:['math'],slots:['화요일 16:00']}],materials:[{id:'mat-m12',program:'fraction',version:'1.2',status:'published',reviewed:true,checks:[true,true,true,true],...JSON.parse(JSON.stringify(lessons.math)),key:'math',curriculum:'2022 개정 교육과정 · 초등 5~6학년군',criterion:'분모가 다른 분수의 크기 비교 · 근거 연결 예시'},{id:'mat-e10',program:'daily',version:'1.0',status:'published',reviewed:true,checks:[true,true,true,true],...JSON.parse(JSON.stringify(lessons.english)),key:'english',curriculum:'2022 개정 교육과정 · 초등 5~6학년군',criterion:'일상생활의 세부 정보 묻고 답하기 · 근거 연결 예시'}],deliveries:[{materialId:'mat-m12',institution:'ga',received:true},{materialId:'mat-e10',institution:'ga',received:true},{materialId:'mat-m12',institution:'da',received:true},{materialId:'mat-e10',institution:'nu',received:false}],classes:[{id:'cl-m',name:'수학 A반',institution:'ga',tutor:'t1',students:['s1','s2'],subject:'math',slot:'화요일 16:00',room:'학습실 1',materialId:'mat-m12',status:'scheduled',attendance:{},reviewAssigned:true,notes:''},{id:'cl-e',name:'영어 B반',institution:'ga',tutor:'t1',students:['s1'],subject:'english',slot:'목요일 17:00',room:'학습실 2',materialId:'mat-e10',status:'scheduled',attendance:{},reviewAssigned:true,notes:''},{id:'cl-da',name:'수학 A반',institution:'da',tutor:'t4',students:['s5'],subject:'math',slot:'화요일 16:00',room:'학습실',materialId:'mat-m12',status:'cancelled',attendance:{},reviewAssigned:false,notes:''}],questions:[{id:'q1',student:'s1',classId:'cl-m',materialId:'mat-m12',item:0,status:'answered',category:'풀이가 헷갈려요',messages:[{by:'student',text:'분모가 다르면 어떻게 비교해요?'},{by:'tutor',text:'분모를 12로 같게 만들어 보자. 2/3는 8/12, 3/4는 9/12가 돼. 이제 분자를 비교하면 3/4가 더 큰 것을 알 수 있어!'}]},{id:'q2',student:'s2',classId:'cl-m',materialId:'mat-m12',item:1,status:'waiting',category:'내 답을 봐주세요',messages:[{by:'student',text:'1/2와 2/4가 왜 같은지 궁금해요.'}]}],attempts:[],supports:[{id:'sup1',institution:'ga',type:'접속 지원',title:'복습 기기 이용 지원',detail:'기관에서 태블릿을 빌려 복습할 수 있도록 도와주세요.',status:'open',owner:'기관 담당자',due:'이번 주',central:false,log:[]},{id:'sup2',institution:'da',type:'수업 공백',title:'취소 수업의 보강 일정 확인',detail:'기관 담당자가 튜터와 보강 가능 시간을 확인하고 있어요.',status:'open',owner:'중앙 운영팀',due:'이번 주',central:true,log:[]}],audit:[]});}

lessons.math.explanation='분자와 분모에 0이 아닌 같은 수를 곱하거나 나누어도 분수의 크기는 같아요. 분모를 같게 만드는 것을 통분이라고 해요. 2/3의 분자와 분모에 4를 곱하면 8/12, 3/4의 분자와 분모에 3을 곱하면 9/12가 돼요. 분모가 같아지면 분자를 비교해요. 9/12가 8/12보다 크므로 3/4가 2/3보다 커요.';
lessons.english.explanation='I get up at seven.은 나는 7시에 일어나요, I go to school at eight.은 나는 8시에 학교에 가요라는 뜻이에요. get up은 일어나다, go to school은 학교에 가다, eat lunch는 점심을 먹다예요. lunch는 점심이고 시각 앞에는 at을 써요. I eat lunch at twelve.는 나는 12시에 점심을 먹어요라는 뜻이에요.';
const matchSlots=['화요일 16:00','목요일 17:00'];
const needs=['기초 개념','문제 풀이','말하기 연습'];
const styles=['천천히 설명','직접 풀 시간','활동 중심'];
function installMatching(s){
 s.proposals ||= [];s.matchWait ||= [];
 if(!s.matchingVersion){
  // Existing records are the explicitly fictional prototype dataset.
  for(const k of s.students)Object.assign(k,{slots:[...matchSlots],preferredSlot:matchSlots[1],need:k.subjects.includes('math')?needs[0]:needs[2],style:styles[0],level:'기초',waitingSince:'2026-10-01',interrupted:false});
  for(const t of s.tutors)Object.assign(t,{skills:[...needs],styles:[styles[0]],weeks:18,maxStudents:8,preferredSlot:t.slots[0],document:{status:t.verified?'approved':'missing',demo:true}});
  s.matchingVersion=1;
 }
 return s;
}
function matchProblems(s,p){
 const t=s.tutors.find(t=>t.id===p.tutor),kids=(p.students||[]).map(id=>s.students.find(k=>k.id===id)),cs=s.classes.filter(c=>c.id!==p.classId&&c.status!=='cancelled'),errors=[];
 if(!t||t.institution!==p.institution||!t.verified)errors.push('튜터 자격·소속 확인 필요');
 if(t?.document?.status!=='approved'||!t.document.demo&&t.document.reviewVersion!==2)errors.push('성범죄·아동학대 관련 취업제한 확인 절차의 기관 확인 필요');
 if(!t?.subjects.includes(p.subject))errors.push('튜터 담당 과목 불일치');
 if(!t?.slots.includes(p.slot))errors.push('튜터가 가능한 시간 아님');
 if(!kids.length||kids.length>4||new Set(p.students).size!==kids.length||kids.some(k=>!k))errors.push('학생은 중복 없이 1~4명 선택');
 if(kids.some(k=>!k||k.institution!==p.institution||!k.consent||!k.subjects.includes(p.subject)))errors.push('학생 소속·참여·신청 과목 확인 필요');
 if(kids.some(k=>!k?.slots?.includes(p.slot)))errors.push('학생 가능 시간 확인 필요');
 if(kids.some(k=>!k?.need||!k?.style||!k?.level)||!t?.skills?.length||!t?.styles?.length||!t?.weeks||!t?.maxStudents)errors.push('매칭 정보 보완 필요');
 if(cs.some(c=>c.slot===p.slot&&(c.tutor===p.tutor||c.students.some(id=>p.students?.includes(id)))))errors.push('튜터 또는 학생이 같은 시간에 이미 배정됨');
 if(cs.some(c=>c.institution===p.institution&&c.slot===p.slot&&c.room===p.room))errors.push('학습실 일정 충돌');
 if(cs.filter(c=>c.tutor===p.tutor).reduce((n,c)=>n+c.students.length,0)+kids.length>(t?.maxStudents||0))errors.push('튜터 최대 담당 인원 초과');
 if(new Set(kids.filter(Boolean).map(k=>k.level)).size>1)errors.push('소그룹 진도 수준 조정 필요');
 if(kids.length>1&&new Set(kids.filter(Boolean).map(k=>k.need)).size>1)errors.push('소그룹 학습 목표 조정 필요');
 return errors;
}
function candidates(s,k,subject){
 const list=[];
 for(const t of s.tutors.filter(t=>t.institution===k.institution))for(const slot of t.slots)for(const room of ['학습실 1','학습실 2']){
  const p={institution:k.institution,subject,tutor:t.id,students:[k.id],slot,room};
  if(matchProblems(s,p).length)continue;
  const load=s.classes.filter(c=>c.tutor===t.id&&c.status!=='cancelled').reduce((n,c)=>n+c.students.length,0);
  const parts=[['학습 필요·지도 역량',t.skills.includes(k.need)?35:0],['지속 참여',Math.round(Math.min(t.weeks/18,1)*25)],['선호 시간',(slot===k.preferredSlot?10:0)+(slot===t.preferredSlot?10:0)],['지도 방식',t.styles.includes(k.style)?10:0],['담당 여력',Math.round(Math.max(0,1-load/t.maxStudents)*10)]];
  list.push({...p,parts,score:parts.reduce((n,x)=>n+x[1],0),note:`${k.need} · ${k.style} / ${t.weeks}주 활동 가능`});
 }
 const seen=new Set();return list.sort((a,b)=>b.score-a.score||a.tutor.localeCompare(b.tutor)||a.slot.localeCompare(b.slot)||a.room.localeCompare(b.room)).filter(x=>{if(seen.has(x.tutor))return false;seen.add(x.tutor);return true;}).slice(0,3);
}
function validateDocument(d){requireThat(d&&typeof d.id==='string'&&typeof d.name==='string'&&d.name.length<=200&&['application/pdf','image/png','image/jpeg'].includes(d.type)&&d.size>0&&d.size<=10*1024*1024,'PDF·JPG·PNG, 10MB 이하 파일을 첨부해 주세요.');return {id:d.id,name:d.name,type:d.type,size:d.size,status:'pending',submittedAt:new Date().toISOString()};}
function profileValues(p,tutor){
 requireThat(p.slots?.length&&p.slots.every(x=>matchSlots.includes(x))&&p.slots.includes(p.preferredSlot),'가능 시간과 그중 선호 시간을 선택해 주세요.');
 const v={slots:p.slots,preferredSlot:p.preferredSlot};
 if(tutor){requireThat(p.skills?.length&&p.skills.every(x=>needs.includes(x))&&p.styles?.length&&p.styles.every(x=>styles.includes(x)),'지도 가능 영역·방식을 선택해 주세요.');requireThat(Number.isInteger(+p.weeks)&&+p.weeks>=1&&+p.weeks<=52&&Number.isInteger(+p.maxStudents)&&+p.maxStudents>=1&&+p.maxStudents<=40,'활동 기간 1~52주·담당 한도 1~40명을 입력해 주세요.');Object.assign(v,{skills:p.skills,styles:p.styles,weeks:+p.weeks,maxStudents:+p.maxStudents});}
 else{requireThat(needs.includes(p.need)&&styles.includes(p.style)&&['기초','기본','심화'].includes(p.level)&&/^\d{4}-\d{2}-\d{2}$/.test(p.waitingSince),'학습 목표·방식·수준·대기 시작일을 입력해 주세요.');Object.assign(v,{need:p.need,style:p.style,level:p.level,waitingSince:p.waitingSince,interrupted:!!p.interrupted});}
 return v;
}

function clone(x){return JSON.parse(JSON.stringify(x));}
function id(prefix){return prefix+'-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,6);}
function requireThat(ok,msg){if(!ok)throw new Error(msg);}
function material(s,key){return s.materials.find(m=>m.id===key);}
function audit(s,text){s.audit.unshift({text,at:new Date().toISOString()});}
function inspectAgentMaterial(m,blockErrors=false){
 if(!m.agent)return null;
 requireThat(MaterialAgent,'교재 에이전트를 다시 불러와 주세요.');
 const report=MaterialAgent.inspect(m);m.agent.inspection=report;
 if(blockErrors)requireThat(report.errors===0,'자동 점검에서 오류가 발견됐어요. 검토 결과를 확인하고 수정한 뒤 다시 진행해 주세요.');
 return report;
}
function materialEdits(p){
 const changes={},limits={title:80,goal:600,explanation:10000,guide:15000,criterion:2000,extension:4000};
 for(const [key,max] of Object.entries(limits))if(p[key]!==undefined){requireThat(typeof p[key]==='string'&&p[key].length<=max,'자료의 글자 수와 입력 형식을 확인해 주세요.');changes[key]=p[key].trim();}
 function text(value,max=4000){return typeof value==='string'&&value.length<=max;}
 function lines(value){return Array.isArray(value)&&value.length<=30&&value.every(x=>text(x));}
 if(p.questions!==undefined){
  requireThat(Array.isArray(p.questions)&&p.questions.length<=20&&p.questions.every(q=>q&&typeof q==='object'&&text(q.text)&&Array.isArray(q.options)&&q.options.length<=8&&q.options.every(x=>text(x,1000))&&(Number.isInteger(q.answer)||q.answer===null)&&text(q.hint)&&text(q.feedback)),'문항·선택지·힌트·해설의 입력 형식을 확인해 주세요.');
  requireThat(JSON.stringify(p.questions).length<=200000,'문항의 분량을 줄여 주세요.');changes.questions=clone(p.questions);
 }
 if(p.workedExample!==undefined){const x=p.workedExample;requireThat(x&&text(x.prompt)&&lines(x.steps)&&text(x.answer),'예제의 설명·풀이 단계·답을 확인해 주세요.');changes.workedExample=clone(x);}
 if(p.activity!==undefined){const x=p.activity;requireThat(x&&text(x.title)&&text(x.materials)&&lines(x.steps),'활동 이름·준비물·순서의 입력 형식을 확인해 주세요.');changes.activity=clone(x);}
 if(p.selfCheck!==undefined){requireThat(lines(p.selfCheck),'자기 확인 항목의 입력 형식을 확인해 주세요.');changes.selfCheck=clone(p.selfCheck);}
 if(p.duration!==undefined){requireThat([20,40,60].includes(+p.duration),'수업 시간은 20·40·60분 중에서 선택해 주세요.');changes.duration=+p.duration;}
 if(p.plan!==undefined){const x=p.plan;requireThat(x&&Array.isArray(x.phases)&&x.phases.length<=12&&x.phases.every(y=>y&&text(y.title)&&text(y.activity)&&Number.isInteger(y.minutes)&&y.minutes>=0&&y.minutes<=60)&&(!x.prerequisites||lines(x.prerequisites))&&(!x.focus||text(x.focus))&&(!x.coverageNote||text(x.coverageNote)),'수업 단계와 시간의 입력 형식을 확인해 주세요.');changes.plan=clone(x);}
 return changes;
}
function apply(original,action,p={}){const s=clone(original), c=s.classes.find(c=>c.id===p.classId),m=material(s,p.materialId),q=s.questions.find(q=>q.id===p.questionId);let result;
switch(action){

case 'registerTutor':{
 requireThat(p.role==='tutor'&&p.name?.trim()&&p.name.trim().length<=40&&s.institutions.some(i=>i.id===p.institution),'이름·활동 기관을 확인해 주세요.');
 requireThat(p.subjects?.length&&p.subjects.every(x=>lessons[x]),'지도 과목을 선택해 주세요.');
 const profile=profileValues(p,true),document=p.document?validateDocument(p.document):{status:'missing'};result=id('t');
 s.tutors.push({id:result,name:p.name.trim(),institution:p.institution,subjects:p.subjects,verified:false,...profile,document});audit(s,'튜터 가입 신청 접수');break;
}
case 'saveMatchProfile':{
 const tutor=p.kind==='tutor',target=(tutor?s.tutors:s.students).find(x=>x.id===p.id);
 requireThat(target&&(p.role==='institution'&&target.institution===p.institution||tutor&&p.role==='tutor'&&target.id===p.actor),'본인 또는 소속 기관에서 정보를 수정해 주세요.');
 Object.assign(target,profileValues(p,tutor));break;
}
case 'submitDocument':{
 const t=s.tutors.find(t=>t.id===p.tutor);requireThat(p.role==='tutor'&&t&&p.actor===t.id,'본인 서류를 첨부해 주세요.');
 t.document=validateDocument(p.document);t.verified=false;audit(s,'튜터 서류 재검토 요청');break;
}
case 'reviewTutor':{
 const t=s.tutors.find(t=>t.id===p.tutor);requireThat(p.role==='institution'&&t?.institution===p.institution,'소속 기관에서 서류를 검토해 주세요.');
 requireThat((t.document?.status==='pending'||t.document?.status==='approved'&&!t.document.demo&&t.document.reviewVersion!==2)&&t.document.id&&p.documentId===t.document.id,'최신 제출 서류를 확인해 주세요.');
 requireThat(['approved','rejected'].includes(p.decision)&&p.note?.trim(),'검토 결과와 사유를 입력해 주세요.');
 requireThat(p.decision!=='approved'||p.checked,'서류와 참여 자격 확인을 체크해 주세요.');
 const reviewChecks={institution:p.institutionChecked===true,consent:p.consentChecked===true,result:p.resultChecked===true};
 requireThat(p.decision!=='approved'||Object.values(reviewChecks).every(Boolean),'기관 적용 요건·본인 동의와 발급 절차·회신서의 취업제한 확인을 모두 체크해 주세요.');
 Object.assign(t.document,{status:p.decision,note:p.note.trim(),reviewedAt:new Date().toISOString(),reviewer:p.institution,reviewVersion:2,reviewChecks});t.verified=p.decision==='approved';audit(s,'기관에서 성범죄·아동학대 관련 취업제한 확인 '+(t.verified?'완료':'보완 요청'));break;
}
case 'generateMatches':{
 requireThat(p.role==='institution'&&s.institutions.some(i=>i.id===p.institution),'기관 담당자가 추천안을 생성해 주세요.');
 const work=clone(s);for(const d of s.proposals.filter(d=>d.status==='pending'&&d.institution===p.institution))work.classes.push({...d.options[d.selected],id:d.id,status:'scheduled'});
 const pending=s.proposals.filter(d=>d.status==='pending');
 const queue=s.students.filter(k=>k.institution===p.institution).flatMap(k=>k.subjects.filter(subject=>!s.classes.some(c=>c.status!=='cancelled'&&c.subject===subject&&c.students.includes(k.id))&&!pending.some(d=>d.student===k.id&&d.subject===subject)).map(subject=>({k,subject,count:candidates(work,k,subject).length})));
 queue.sort((a,b)=>Number(b.k.interrupted)-Number(a.k.interrupted)||(a.k.waitingSince||'9999').localeCompare(b.k.waitingSince||'9999')||a.count-b.count||a.k.id.localeCompare(b.k.id));
 s.matchWait=s.matchWait.filter(w=>w.institution!==p.institution);result=0;
 for(const {k,subject} of queue){const options=candidates(work,k,subject);if(!options.length){s.matchWait.push({institution:p.institution,student:k.id,subject,reason:!k.consent?'참여 동의 확인 필요':!k.slots?.length?'학생 가능 시간 입력 필요':'자격·서류·시간·정원·학습 정보에 맞는 후보 없음. 튜터 정보와 예약 일정을 확인해 주세요.'});continue;}
 const d={id:id('proposal'),institution:p.institution,student:k.id,subject,options,selected:0,status:'pending',createdAt:new Date().toISOString()};s.proposals.push(d);work.classes.push({...options[0],id:d.id,status:'scheduled'});result++;}
 audit(s,`자동매칭 승인 대기 ${result}건 생성`);break;
}
case 'reviewMatch':{
 const d=s.proposals.find(x=>x.id===p.id);requireThat(p.role==='institution'&&d?.institution===p.institution&&d.status==='pending','소속 기관의 승인 대기안을 선택해 주세요.');
 requireThat(['approved','rejected'].includes(p.decision),'승인 또는 반려를 선택해 주세요.');
 if(p.decision==='rejected'){requireThat(p.note?.trim(),'반려 사유를 입력해 주세요.');d.status='rejected';d.note=p.note.trim();audit(s,'기관에서 매칭안 반려');break;}
 requireThat(p.checked,'학생·튜터 참여 의사와 학습 목표를 확인해 주세요.');const option=d.options[+p.selected];requireThat(option,'후보를 선택해 주세요.');
 requireThat(!s.classes.some(c=>c.status!=='cancelled'&&c.subject===d.subject&&c.students.includes(d.student)),'이미 해당 과목에 배정된 학생입니다.');
 const out=apply(s,'match',option);Object.assign(s,out.state);const updated=s.proposals.find(x=>x.id===d.id);Object.assign(updated,{selected:+p.selected,status:'approved',classId:out.result,reviewedAt:new Date().toISOString(),reviewer:p.institution});result=out.result;break;
}
case 'match':{
 const tutor=s.tutors.find(t=>t.id===p.tutor),kids=s.students.filter(k=>(p.students||[]).includes(k.id));
 requireThat(tutor&&tutor.institution===p.institution&&tutor.verified,'자격 확인을 마친 소속 튜터를 선택해 주세요.');
 requireThat(tutor.subjects.includes(p.subject),'선택한 튜터의 담당 과목을 확인해 주세요.');
 requireThat(tutor.slots.includes(p.slot),'튜터가 가능한 수업 시간을 선택해 주세요.');
 requireThat(kids.length>0&&kids.length<=4,'참여 학생은 1~4명 선택해 주세요.');
 requireThat(kids.every(k=>k.institution===p.institution&&k.consent&&k.subjects.includes(p.subject)),'학생의 소속·참여 확인·신청 과목을 확인해 주세요.');
 const conflicts=s.classes.filter(k=>k.id!==p.classId&&k.status!=='cancelled');
 requireThat(!conflicts.some(k=>k.slot===p.slot&&(k.tutor===p.tutor||k.students.some(x=>p.students.includes(x)))),'같은 시간에 이미 배정된 튜터 또는 학생이 있어요. 다른 시간을 선택해 주세요.');
 requireThat(!conflicts.some(k=>k.institution===p.institution&&k.slot===p.slot&&k.room===(p.room||'학습실 1')),'같은 시간에 사용 중인 학습실이에요. 장소를 바꿔 주세요.');
 const problems=matchProblems(s,{...p,room:p.room||'학습실 1'});requireThat(!problems.length,problems.join(' · '));
 if(c){requireThat(c.institution===p.institution,'우리 기관의 수업만 변경할 수 있어요.');Object.assign(c,{tutor:p.tutor,students:p.students,slot:p.slot,room:p.room,status:'scheduled'});result=c.id;}
 else{result=id('cl');s.classes.push({id:result,name:p.name||`${lessons[p.subject].subject} 새 클래스`,institution:p.institution,tutor:p.tutor,students:p.students,subject:p.subject,slot:p.slot,room:p.room||'학습실 1',materialId:null,status:'scheduled',attendance:{},reviewAssigned:false,notes:''});}
 audit(s,'기관에서 '+(c?'매칭 변경':'새 매칭')+' 확정');break;}
case 'lesson':requireThat(c&&c.tutor===p.tutor,'담당 수업을 선택해 주세요.');requireThat(c.materialId,'기관에서 배포 자료를 연결한 뒤 수업을 시작할 수 있어요.');if(p.status==='completed')requireThat(c.status==='active','먼저 수업 시작을 눌러 주세요.');c.status=p.status;c.notes=p.notes??c.notes;if(p.status==='completed')c.reviewAssigned=true;audit(s,c.name+' '+(p.status==='active'?'수업 시작':'수업 완료·복습 배정'));break;
case 'attendance':requireThat(c&&c.students.includes(p.student),'수업의 학생을 선택해 주세요.');c.attendance[p.student]=p.present;break;
case 'schedule':requireThat(c&&c.institution===p.institution,'기관의 수업을 선택해 주세요.');requireThat(['scheduled','cancelled'].includes(p.status),'일정 상태를 확인해 주세요.');c.status=p.status;audit(s,c.name+' 일정 '+p.status);break;
case 'practice':requireThat(Number.isInteger(p.item),'문제를 선택해 주세요.');requireThat(s.students.some(k=>k.id===p.student),'학습할 학생을 선택해 주세요.');requireThat(m&&m.catalogId===catalogId&&m.status==='published','학기 학습자료를 선택해 주세요.');requireThat(m.questions[p.item]&&Number.isInteger(p.choice)&&p.choice>=0&&p.choice<m.questions[p.item].options.length,'답을 선택해 주세요.');result=m.questions[p.item].answer===p.choice;s.attempts.push({student:p.student,classId:null,mode:'selfStudy',materialId:m.id,item:p.item,choice:p.choice,correct:result,at:new Date().toISOString()});break;
case 'attempt':requireThat(c&&c.students.includes(p.student)&&c.reviewAssigned,'배정된 복습을 선택해 주세요.');requireThat(m&&(m.id===c.materialId||s.questions.some(q=>q.student===p.student&&q.classId===c.id&&q.materialId===m.id)),'배정된 자료나 이전 질문의 자료에서 복습해 주세요.');requireThat(m.questions[p.item]&&Number.isInteger(p.choice)&&p.choice>=0&&p.choice<m.questions[p.item].options.length,'답을 선택해 주세요.');result=m.questions[p.item].answer===p.choice;s.attempts.push({student:p.student,classId:c.id,materialId:m.id,item:p.item,choice:p.choice,correct:result,at:new Date().toISOString()});break;
case 'question':requireThat(c&&c.students.includes(p.student)&&m,'질문할 수업 자료를 선택해 주세요.');requireThat(c.materialId===m.id||s.questions.some(x=>x.student===p.student&&x.classId===c.id&&x.materialId===m.id),'배정된 자료에서 질문해 주세요.');requireThat(m.questions[p.item],'문제를 선택해 주세요.');result=id('q');s.questions.unshift({id:result,student:p.student,classId:c.id,materialId:m.id,item:p.item,status:'waiting',category:p.category,messages:[{by:'student',text:(p.text||'').trim()||p.category||'여기서 막혔어요.'}]});audit(s,'학생의 문항 질문 접수');break;
case 'answer':requireThat(q&&s.classes.find(k=>k.id===q.classId)?.tutor===p.tutor,'담당 클래스의 질문에 답변해 주세요.');requireThat(p.text?.trim(),'설명을 입력해 주세요.');q.messages.push({by:'tutor',text:p.text.trim()});q.status='answered';audit(s,'튜터 답변 도착');break;
case 'understood':requireThat(q&&q.student===p.student&&q.status==='answered','도착한 답변을 먼저 확인해 주세요.');q.status='understood';break;
case 'reask':requireThat(q&&q.student===p.student&&['answered','understood'].includes(q.status),'도착한 답변에서 다시 질문할 수 있어요.');q.messages.push({by:'student',text:p.text?.trim()||'아직 어려워요. 다른 방법으로 설명해 주세요.'});q.status='reasked';break;
case 'generateMaterial':{
 requireThat(p.role==='central','중앙 운영자가 교재 꾸러미를 만들어 주세요.');requireThat(MaterialAgent,'교재 에이전트를 다시 불러와 주세요.');
 const generated=MaterialAgent.generate(p,s.materials);result=id('mat');
 const created={...clone(generated),id:result,program:'agent-'+result,key:p.subject,version:'1.0',status:'draft',reviewed:false,checks:[false,false,false,false],sources:clone(generated.sources?.length?generated.sources:sources),publicationNote:'포근동행 참고자료 기반 자동 구성 · 중앙 검토 전 초안'};
 delete created.catalogId;delete created.contentRevision;
 inspectAgentMaterial(created);s.materials.unshift(created);audit(s,'중앙 교재 에이전트에서 꾸러미 초안 생성: '+created.title);break;
}
case 'inspectMaterial':{
 requireThat(p.role==='central'&&m?.agent,'중앙 운영자의 교재 에이전트 자료를 선택해 주세요.');result=inspectAgentMaterial(m);audit(s,'교재 자동 점검: '+m.title);break;
}
case 'repairMaterial':{
 requireThat(p.role==='central'&&m?.agent&&['draft','review'].includes(m.status),'중앙 제작·검토 중인 교재만 자동 수정할 수 있어요.');
 const fixed=MaterialAgent.repair(m);requireThat(fixed?.material&&Array.isArray(fixed.fixes),'자동 수정 결과를 확인할 수 없어요.');
 const identity={id:m.id,program:m.program,version:m.version,key:m.key,subject:m.subject};
 Object.assign(m,clone(fixed.material),identity,{status:'draft',reviewed:false,checks:[false,false,false,false]});delete m.catalogId;delete m.contentRevision;
 m.agent.updatedAt=new Date().toISOString();inspectAgentMaterial(m);result=clone(fixed.fixes);audit(s,`교재 자동 수정 ${fixed.fixes.length}건: ${m.title}`);break;
}
case 'createMaterial':{
 requireThat(lessons[p.subject],'과목을 선택해 주세요.');const base=p.source?material(s,p.source):null;requireThat(!base||base.status==='published','배포된 자료에서 새 버전을 만들어 주세요.');result=id('mat');const prog=base?.program|| (p.subject==='math'?'fraction':'daily');const versions=s.materials.filter(m=>m.program===prog).map(m=>Number(m.version));const ver=versions.length?(Math.max(...versions)+.1).toFixed(1):'1.0';const created={...clone(base||lessons[p.subject]),id:result,program:prog,key:p.subject,version:ver,status:'draft',reviewed:false,checks:[false,false,false,false],curriculum:base?.curriculum||'2022 개정 교육과정 · 초등 5~6학년군',criterion:base?.criterion||'공식 성취기준 원문 연결 필요 · 예시 초안'};if(created.agent)inspectAgentMaterial(created);s.materials.unshift(created);audit(s,'중앙에서 자료 초안 작성');break;}
case 'editMaterial':{
 requireThat(m&&['draft','review'].includes(m.status),'배포 원본은 수정할 수 없어요. 새 버전을 만들어 주세요.');requireThat(typeof p.title==='string'&&p.title.trim()&&typeof p.goal==='string'&&p.goal.trim()&&typeof p.explanation==='string'&&p.explanation.trim(),'제목·목표·설명을 입력해 주세요.');
 const changes=materialEdits(p);const plan=changes.plan;delete changes.plan;Object.assign(m,changes,{status:'draft',reviewed:false,checks:[false,false,false,false]});
 if(m.agent){if(plan)m.agent.plan=plan;if(m.agent.input)Object.assign(m.agent.input,{goal:m.goal,duration:m.duration,questionCount:m.questions.length});m.agent.updatedAt=new Date().toISOString();inspectAgentMaterial(m);}break;
}
case 'reviewMaterial':requireThat(m&&m.status==='draft','초안을 선택해 주세요.');inspectAgentMaterial(m,true);m.status='review';break;
case 'approveMaterial':requireThat(m&&m.status==='review','중앙 내부 검토 중인 자료를 선택해 주세요.');inspectAgentMaterial(m,true);requireThat(p.checks?.length===4&&p.checks.every(Boolean),'검토 항목 4개를 모두 확인해 주세요.');m.status='approved';m.reviewed=true;m.checks=p.checks;audit(s,'중앙 내부 검토 완료: '+m.title);break;
case 'returnMaterial':requireThat(m&&m.status==='review','검토 중인 자료를 선택해 주세요.');m.status='draft';m.reviewed=false;m.checks=[false,false,false,false];break;
case 'publish':requireThat(m&&['approved','published'].includes(m.status)&&m.reviewed,'중앙 내부 검토를 마친 자료만 배포할 수 있어요.');inspectAgentMaterial(m,true);requireThat(p.institutions?.length&&p.institutions.every(x=>s.institutions.some(i=>i.id===x)),'배포할 기관을 선택해 주세요.');m.status='published';for(const ins of p.institutions)if(!s.deliveries.some(d=>d.materialId===m.id&&d.institution===ins))s.deliveries.push({materialId:m.id,institution:ins,received:false});audit(s,`${m.title} v${m.version} · ${p.institutions.length}개 기관 배포`);break;
case 'receive':{const d=s.deliveries.find(d=>d.materialId===p.materialId&&d.institution===p.institution);requireThat(d,'우리 기관에 배포된 자료를 선택해 주세요.');d.received=true;audit(s,'기관에서 자료 수신 확인');break;}
case 'assignMaterial':requireThat(c&&c.institution===p.institution,'우리 기관의 클래스를 선택해 주세요.');requireThat(m&&m.status==='published'&&m.key===c.subject,'과목에 맞는 배포 자료를 선택해 주세요.');requireThat(s.deliveries.some(d=>d.materialId===m.id&&d.institution===p.institution&&d.received),'먼저 기관 수신을 확인해 주세요.');requireThat(c.status==='scheduled','진행 중이거나 마친 수업의 자료는 바꾸지 않아요. 다음 수업에서 적용해 주세요.');c.materialId=m.id;audit(s,c.name+'에 자료 v'+m.version+' 연결');break;
case 'support':requireThat(p.title?.trim(),'지원 내용을 입력해 주세요.');result=id('sup');s.supports.unshift({id:result,institution:p.institution,type:p.type||'운영 지원',title:p.title.trim(),detail:p.detail||'',status:'open',owner:p.central?'중앙 운영팀':'기관 담당자',due:'이번 주',central:!!p.central,log:[]});audit(s,'지원 요청 등록');break;
case 'supportUpdate':{const t=s.supports.find(t=>t.id===p.id);requireThat(t,'지원 요청을 선택해 주세요.');requireThat(p.note?.trim(),'조치 내용을 입력해 주세요.');t.log.push(p.note.trim());if(p.status)t.status=p.status;if(p.owner)t.owner=p.owner;if(p.due)t.due=p.due;if(p.central)t.central=true;audit(s,'지원 조치 기록: '+t.title);break;}
default:throw new Error('지원하지 않는 동작입니다.');
}return {state:s,result};}
function load(storage){try{const x=JSON.parse(storage.getItem(KEY));return x?.schema===VERSION?installSemester(x):seed();}catch{return seed();}}
function save(storage,s){storage.setItem(KEY,JSON.stringify(s));}
// Read-time study aids keep already published versions and saved learning records intact.
function learningSupport(s,m){
 if(!m)return {concepts:[],prerequisites:[]};
 const baseId=m.agent?.sourceId||(/^pg5-s1-[me]\d{2}$/.test(m.program||'')?m.program:m.id);
 const legacyMath=m.program==='fraction'||baseId==='mat-m12',legacyEnglish=m.program==='daily'||baseId==='mat-e10';
 const parts=text=>(String(text||'').match(/[^。.!?]+[。.!?]?(?:\s|$)/g)||[String(text||'')]).map(t=>t.trim()).filter(Boolean);
 const concepts=legacyMath?[
  '분자와 분모에 0이 아닌 같은 수를 곱하거나 나누어도 분수의 크기는 같아요.',
  '2/5=6/15, 1/3=5/15처럼 분모를 같게 만드는 것을 통분이라고 해요.',
  '통분한 뒤 분자가 큰 쪽이 더 큰 분수예요. 위 예에서는 6/15가 5/15보다 크므로 2/5가 더 커요.'
 ]:legacyEnglish?[
  'get up은 일어나다, go to school은 학교에 가다, eat lunch는 점심을 먹다예요.',
  'I get up at seven.은 나는 7시에 일어나요, I go to school at eight.은 나는 8시에 학교에 가요라는 뜻이에요.',
  '시각 앞에는 at을 써요. I eat lunch at twelve.는 나는 12시에 점심을 먹어요라는 뜻이에요.'
 ]:parts(m.explanation).slice(0,m.agent?.scopeExpanded?2:3);
 const mathPrevious={2:[1],3:[2],5:[4],6:[4],8:[7],9:[8],10:[5],11:[6,10],12:[11],13:[10,11],14:[13],15:[13,14],17:[16],18:[17,3,13]};
 const englishPrevious={4:[3],8:[7],12:[11],14:[13],16:[15],17:[3,4],18:[5,15,17]};
 const match=String(baseId||'').match(/^pg5-s1-([me])(\d{2})$/),ids=legacyMath?['pg5-s1-m10','pg5-s1-m11']:legacyEnglish?['pg5-s1-e06']:match?(match[1]==='m'?mathPrevious:englishPrevious)[Number(match[2])]?.map(n=>`pg5-s1-${match[1]}${String(n).padStart(2,'0')}`)||[]:[];
 for(const q of m.questions||[]){const extra=q.provenance?.sourceId;if(m.agent&&extra&&extra!==baseId&&!ids.includes(extra))ids.push(extra);}
 const prerequisites=ids.map(id=>s?.materials?.find(item=>item.status==='published'&&(item.id===id||item.program===id))||null).filter(Boolean).map(item=>({id:item.id,title:item.title}));
 if(m.agent?.scopeExpanded)for(const item of prerequisites.filter(item=>m.questions.some(q=>q.provenance?.sourceId===item.id))){
  const source=s.materials.find(source=>source.id===item.id);for(const sentence of parts(source?.explanation).slice(0,2))if(!concepts.includes(sentence))concepts.push(sentence);
 }
 return {concepts:concepts.slice(0,4),prerequisites};
}
const api={matchSlots,needs,styles,matchProblems,candidates,validateDocument,seed,apply,load,save,learningSupport,KEY,lessons,material,catalogId,sources,MaterialAgent};if(typeof module!=='undefined'&&module.exports)module.exports=api;root.Pogeun=api;
})(typeof window!=='undefined'?window:globalThis);
