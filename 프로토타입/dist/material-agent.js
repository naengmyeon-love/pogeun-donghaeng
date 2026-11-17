(function(root){
'use strict';
// A local reference-based assembler. It does not call an AI model or certify a curriculum.
const clone=value=>JSON.parse(JSON.stringify(value));
const clean=value=>typeof value==='string'?value.trim():'';
const norm=value=>clean(value).replace(/\s+/g,' ').toLowerCase();
const originalId=/^pg5-s1-[me]\d{2}$/;
const fail=(condition,message)=>{if(!condition)throw new Error(message);};
const sum=values=>values.reduce((a,b)=>a+b,0);
const gcd=(a,b)=>{while(b){const next=a%b;a=b;b=next;}return a;};
const lcm=(a,b)=>a/gcd(a,b)*b;
const divisors=n=>{const out=[];for(let i=1;i<=n;i++)if(n%i===0)out.push(i);return out;};
function hash(value){let n=2166136261;for(const c of String(value)){n^=c.charCodeAt(0);n=Math.imul(n,16777619);}return n>>>0;}
function originals(materials){return (Array.isArray(materials)?materials:[]).filter(m=>m&&originalId.test(m.id)&&Number(m.grade)===5&&['math','english'].includes(m.key));}
function catalog(materials){return originals(materials).map(m=>({id:m.id,sourceId:m.id,title:m.title,unit:m.unit,subject:m.key,subjectLabel:m.subject,grade:5,goal:m.goal,version:m.version,questionCount:Array.isArray(m.questions)?m.questions.length:0,standards:clone(m.standards||[])}));}
function safeInput(input,materials){
 const p=input||{};
 fail(String(p.grade)==='5','현재는 초등학교 5학년 수록 자료만 지원해요.');
 fail(['math','english'].includes(p.subject),'수학 또는 영어를 선택해 주세요.');
 const source=originals(materials).find(m=>m.id===p.sourceId&&m.key===p.subject);
 fail(source,'과목에 맞는 수록 36차시 원본을 선택해 주세요.');
 const goal=clean(p.goal);fail(goal&&goal.length<=600,'학습목표를 1~600자로 입력해 주세요.');
 const duration=Number(p.duration),questionCount=Number(p.questionCount);
 fail([20,40,60].includes(duration),'수업 시간은 20·40·60분 중 선택해 주세요.');
 fail(['기초','기본','도전'].includes(p.level),'기초·기본·도전 중 하나를 선택해 주세요.');
 fail([3,5,8].includes(questionCount),'복습 문항은 3·5·8개 중 선택해 주세요.');
 const variant=clean(String(p.variant==null?1:p.variant)).slice(0,80)||'1';
 return {source,input:{grade:'5',subject:p.subject,sourceId:p.sourceId,goal,duration,level:p.level,questionCount,variant}};
}
function expected(meta){
 if(!meta||!meta.params)return null;
 const p=meta.params,ints=Object.values(p);
 if(!ints.every(v=>Number.isSafeInteger(v)&&v>0&&v<=1000000))return null;
 const fields={addSub:['a','b','c'],parentheses:['a','b','c'],precedence:['a','b','c'],divisionThenMultiply:['a','b','c'],story:['a','b','c','d'],divisorCount:['n'],gcd:['a','b'],lcm:['a','b'],denominator:['b','d'],commonDenominator:['a','b','c','d']}[meta.kind];
 if(!fields||!fields.every(k=>Number.isSafeInteger(p[k])&&p[k]>0&&p[k]<=1000000))return null;
 switch(meta.kind){
 case 'addSub':return String(p.a-p.b+p.c);
 case 'parentheses':return String(p.a-(p.b+p.c));
 case 'precedence':return String(p.a+p.b*p.c);
 case 'divisionThenMultiply':return p.a%p.b===0?String(p.a/p.b*p.c):null;
 case 'story':return (p.a*p.b+p.c)%p.d===0?String((p.a*p.b+p.c)/p.d):null;
 case 'divisorCount':return String(divisors(p.n).length);
 case 'gcd':return String(gcd(p.a,p.b));
 case 'lcm':return String(lcm(p.a,p.b));
 case 'denominator':return String(lcm(p.b,p.d));
 case 'commonDenominator':{
   const den=lcm(p.b,p.d);
   return p.a<p.b&&p.c<p.d?`${p.a*(den/p.b)}/${den}, ${p.c*(den/p.d)}/${den}`:null;
 }
 default:return null;
 }
}
function choices(answer,index,alternatives){
 const values=[String(answer),...(alternatives||[Number(answer)+1,Math.max(0,Number(answer)-1),Number(answer)+2]).map(String)];
 const unique=[...new Set(values)].slice(0,3);fail(unique.length===3,'서로 다른 선택지를 구성하지 못했어요.');
 const position=index%3,options=unique.slice();options.splice(position,0,options.shift());
 return {options,answer:position};
}
function createQuestion(text,meta,index,hint,feedback,source,alternatives){
 const correct=expected(meta);fail(correct!==null,'안전하게 계산할 수 없는 문항이에요.');
 return {id:`agent-q${index+1}`,text,...choices(correct,index,alternatives),hint,feedback,
  agentValidation:{...meta,referenceText:text,referenceHint:hint,referenceFeedback:feedback},provenance:{mode:'template',sourceId:source.id,sourceTitle:source.title,sourceVersion:String(source.version||'1.0')}};
}
function templateQuestions(source,input){
 if(source.key!=='math')return null;
 const family=source.id.slice(-3),supported=['m01','m02','m03','m04','m05','m06','m11'];
 if(!supported.includes(family))return null;
 const numericVariant=Number(input.variant),offset=(Number.isSafeInteger(numericVariant)&&numericVariant>=0?numericVariant:hash(input.variant))%127,scale=input.level==='기초'?1:input.level==='도전'?3:2,questions=[];
 for(let i=0;i<input.questionCount;i++){
  const t=offset+i+1,n=t*scale;let q;
  if(family==='m01'){
   const b=4+n,c=2+(t%7),a=b+c+15+n,kind=i%2?'parentheses':'addSub';
   const text=kind==='parentheses'?`${a}-(${b}+${c})`:`${a}-${b}+${c}`;
   const meta={kind,params:{a,b,c}},answer=expected(meta);
   q=createQuestion(`${text}의 값은 얼마인가요?`,meta,i,kind==='parentheses'?'괄호 안의 덧셈을 먼저 계산해요.':'덧셈과 뺄셈만 있으면 왼쪽부터 계산해요.',kind==='parentheses'?`${b}+${c}=${b+c}을 먼저 계산해요. ${a}-(${b}+${c})=${a}-${b+c}=${answer}예요.`:`${a}-${b}=${a-b}, ${a-b}+${c}=${answer}예요.`,source);
  }else if(family==='m02'){
   const a=5+n,b=2+(t%7),c=2+((t+3)%6);
   if(i%2){const dividend=b*(3+n),meta={kind:'divisionThenMultiply',params:{a:dividend,b,c}};
    q=createQuestion(`${dividend}÷${b}×${c}의 값은 얼마인가요?`,meta,i,'나눗셈과 곱셈은 왼쪽부터 계산해요.',`${dividend}÷${b}=${dividend/b}, ${dividend/b}×${c}=${expected(meta)}예요.`,source);
   }else{const meta={kind:'precedence',params:{a,b,c}};
    q=createQuestion(`${a}+${b}×${c}의 값은 얼마인가요?`,meta,i,'곱셈을 덧셈보다 먼저 계산해요.',`${b}×${c}=${b*c}을 먼저 계산해요. ${a}+${b*c}=${expected(meta)}예요.`,source);}
  }else if(family==='m03'){
   const d=2+(t%4),a=d*(2+scale),b=3+(t%5),c=d*(1+n),meta={kind:'story',params:{a,b,c,d}};
   q=createQuestion(`한 봉지에 연필 ${a}자루가 든 봉지 ${b}개와 낱개 연필 ${c}자루를 ${d}명에게 똑같이 나누면 한 명이 몇 자루씩 받나요?`,meta,i,'봉지 속 연필과 낱개 연필을 모두 더한 다음 사람 수로 나누어요.',`전체는 ${a}×${b}+${c}=${a*b+c}자루예요. (${a}×${b}+${c})÷${d}=${expected(meta)}이므로 한 명이 ${expected(meta)}자루씩 받아요.`,source);
  }else if(family==='m04'){
   const value=8+((t*7+scale*3)%85),meta={kind:'divisorCount',params:{n:value}},list=divisors(value);
   q=createQuestion(`${value}의 약수는 모두 몇 개인가요?`,meta,i,'곱해서 주어진 수가 되는 두 수를 짝지어요. 같은 약수는 한 번만 세어요.',`${value}의 약수는 ${list.join(', ')}이에요. 모두 ${list.length}개예요.`,source);
  }else if(family==='m05'){
   const factor=2+(t%9),a=factor*(2+scale),b=factor*(3+scale),meta={kind:'gcd',params:{a,b}};
   q=createQuestion(`${a}와 ${b}의 최대공약수는 무엇인가요?`,meta,i,'두 수를 모두 나누어떨어지게 하는 수 중 가장 큰 수를 찾아요.',`${a}의 약수는 ${divisors(a).join(', ')}이고, ${b}의 약수는 ${divisors(b).join(', ')}예요. 공통인 약수 중 가장 큰 수는 ${expected(meta)}예요.`,source);
  }else if(family==='m06'){
   const a=2+((t*3)%11),b=a+1+(t%5),meta={kind:'lcm',params:{a,b}};
   q=createQuestion(`${a}와 ${b}의 최소공배수는 무엇인가요?`,meta,i,'두 수의 배수 중 가장 작은 공통 수를 찾아요.',`두 수의 최대공약수는 ${gcd(a,b)}예요. ${a}×${b}÷${gcd(a,b)}=${expected(meta)}이므로 최소공배수는 ${expected(meta)}예요. ${expected(meta)}은 두 수로 모두 나누어떨어져요.`,source);
  }else if(family==='m11'){
   const pairs=input.level==='기초'?[[2,3],[3,4],[2,5],[3,6],[4,6],[2,7],[3,5],[4,8]]:[[4,6],[6,8],[3,9],[5,10],[8,12],[6,9],[4,10],[9,12]];
   const pair=pairs[(offset+i)%pairs.length],b=pair[0],d=pair[1],a=1+((t+scale)%(b-1)),c=1+((t*2+scale)%(d-1)),den=lcm(b,d);
   if(i%3===2){const meta={kind:'denominator',params:{b,d}};
    q=createQuestion(`${a}/${b}와 ${c}/${d}를 통분할 때 사용할 수 있는 가장 작은 공통 분모는 무엇인가요?`,meta,i,'두 분모의 최소공배수를 찾아요.',`${b}와 ${d}의 최소공배수는 ${den}이에요. 두 분수를 분모가 ${den}인 분수로 바꿀 수 있어요.`,source);
   }else{const meta={kind:'commonDenominator',params:{a,b,c,d}},left=a*(den/b),right=c*(den/d);
    q=createQuestion(`${a}/${b}와 ${c}/${d}를 가장 작은 공통 분모로 통분한 결과는 무엇인가요? (주어진 분수 순서대로 고르세요.)`,meta,i,'두 분모의 최소공배수를 구하고, 각 분수의 분자와 분모에 같은 수를 곱해요.',`공통 분모는 ${den}이에요. ${a}/${b}의 분자와 분모에 ${den/b}을 곱하면 ${left}/${den}, ${c}/${d}의 분자와 분모에 ${den/d}을 곱하면 ${right}/${den}이에요.`,source,[`${left+1}/${den}, ${right}/${den}`,`${left}/${den}, ${right+1}/${den}`]);}
  }
  questions.push(q);
 }
 return questions;
}
function fromBank(source,input,materials){
 const ordered=[source,...originals(materials).filter(m=>m.id!==source.id&&m.key===source.key&&m.unit===source.unit)];
 const bank=[],seen=new Set();
 for(const m of ordered)for(const q of m.questions||[]){const key=norm(q.text);if(key&&!seen.has(key)){seen.add(key);bank.push({question:q,source:m});}}
 fail(bank.length>=input.questionCount,`선택한 차시와 같은 단원에 서로 다른 문항이 ${bank.length}개 있어요. 3개 또는 5개로 줄여 주세요.`);
 const primary=bank.filter(q=>q.source.id===source.id),extra=bank.filter(q=>q.source.id!==source.id);
 const rotate=(arr,seed)=>arr.length?arr.slice(seed%arr.length).concat(arr.slice(0,seed%arr.length)):arr;
 const seed=hash(input.variant),selected=[...rotate(primary,seed),...rotate(extra,seed)].slice(0,input.questionCount);
 return selected.map(({question:q,source:m},i)=>({...clone(q),id:`agent-q${i+1}`,provenance:{mode:'bank',sourceId:m.id,sourceTitle:m.title,sourceVersion:String(m.version||'1.0'),sourceQuestionId:q.id||''}}));
}
function planFor(source,input,expanded){
 const timing={20:[3,6,8,3],40:[5,12,18,5],60:[8,18,27,7]}[input.duration];
 const support=input.level==='기초'?'예제의 각 단계를 함께 읽고 필요하면 수 모형·문장 틀을 제공해요.':input.level==='도전'?'답의 이유를 설명하고 원본의 추가 과제로 다른 방법을 비교해요.':'예제를 함께 확인한 뒤 학생이 스스로 풀고 풀이 이유를 말해요.';
 const prerequisites={'자연수의 혼합 계산':'덧셈·뺄셈·곱셈·나눗셈의 뜻과 기본 계산을 확인해요.','약수와 배수':'곱셈식과 나눗셈식의 관계, 나머지가 0이라는 뜻을 확인해요.','대응 관계':'표에서 짝지어진 두 값과 각각의 단위를 읽는지 확인해요.','약분과 통분':'분자·분모의 뜻과 같은 크기의 분수를 만드는 곱셈·나눗셈을 확인해요.','분수의 덧셈과 뺄셈':'같은 크기의 분수와 통분, 분모가 같은 분수의 계산을 확인해요.','다각형의 둘레와 넓이':'길이·둘레·넓이의 단위와 직사각형의 넓이 구하기를 확인해요.'};
 return {prerequisites:[`원본 「${source.title}」의 설명과 예제를 읽을 수 있는지 시작 질문으로 확인해요.`,source.key==='math'?(prerequisites[source.unit]||'계산에 필요한 이전 개념은 튜터가 학생의 설명을 듣고 확인해요.'):'예제에 쓰인 낱말의 뜻을 확인하고 튜터와 대화를 읽어요.'],focus:input.goal,
  phases:[{title:'도입·출발점 확인',minutes:timing[0],activity:`학습목표를 읽고 자기 말로 설명해요. ${support}`},{title:'개념·예제 탐구',minutes:timing[1],activity:`원본 개념 설명과 풀이 예제 또는 대화를 차례로 확인해요. ${support}`},{title:'활동·복습 연습',minutes:timing[2],activity:`「${source.activity?.title||'원본 활동'}」을 진행하고 복습 ${input.questionCount}문항 중 시간 안에 풀 수 있는 만큼 풀어요. 남은 문항은 복습으로 배정해요.`},{title:'자기 확인·다음 안내',minutes:timing[3],activity:'자기 확인 항목을 읽고 어려운 부분을 튜터에게 말해요. 원본의 추가 과제는 학생 상태와 남은 시간에 맞춰 사용해요.'}],
  coverageNote:expanded?'복습 문항 일부는 같은 단원의 다른 차시에서 가져왔어요. 학생 설명에 해당 차시의 핵심 개념을 함께 넣었어요. 수업 전 학생의 진도를 확인해 주세요.':'선택한 원본 차시의 개념·예제·활동 범위를 유지했어요. 수치 변형 문항의 교육적 적합성은 사람이 확인해야 해요.'};
}
function generate(input,materials){
 const prepared=safeInput(input,materials),source=prepared.source,p=prepared.input;
 const material=clone(source);for(const k of ['id','catalogId','status','version','reviewed','checks','contentRevision','publicationNote','agent'])delete material[k];
 const generated=templateQuestions(source,p),questions=generated||fromBank(source,p,materials),expanded=questions.some(q=>q.provenance.sourceId!==source.id),plan=planFor(source,p,expanded);
 const extraIds=[...new Set(questions.map(q=>q.provenance.sourceId).filter(id=>id!==source.id))];
 const supplementary=extraIds.map(id=>materials.find(m=>m.id===id)).filter(Boolean).map(m=>({sourceId:m.id,title:m.title,explanation:m.explanation,workedExample:clone(m.workedExample)}));
 if(supplementary.length)material.explanation=[material.explanation,...supplementary.map(m=>`함께 복습할 개념 · ${m.title}\n${m.explanation}\n예제: ${m.workedExample.prompt}\n${m.workedExample.steps.join('\n')}\n${m.workedExample.answer}`)].join('\n\n');
 Object.assign(material,{grade:5,key:p.subject,subject:p.subject==='math'?'수학':'영어',goal:p.goal,duration:p.duration,questions,
  guide:plan.phases.map(phase=>`${phase.title} ${phase.minutes}분: ${phase.activity}`).join('\n'),
  agent:{mode:'reference',input:p,sourceId:source.id,sourceTitle:source.title,sourceVersion:String(source.version||'1.0'),sourceGoal:source.goal,createdAt:new Date().toISOString(),plan,
   questionMode:generated?'validated-templates':'reference-bank',scopeExpanded:expanded,supplementary,
   sourceGuide:source.guide,sourceNote:'포근동행 수록 자체 제작 자료를 참조하여 자동 구성했어요. 외부 AI 호출·교사 검수·교육부 인증을 뜻하지 않아요.',
   coverageNote:plan.coverageNote}});
 return material;
}
function inspect(material){
 const m=material||{},checks=[];
 const add=(id,label,status,detail)=>checks.push({id,label,status,detail});
 const required=['title','unit','goal','explanation','guide','criterion'];
 const missing=required.filter(k=>!clean(m[k]));add('required','기본 내용',missing.length?'error':'pass',missing.length?'비어 있는 항목: '+missing.join(', '):'제목·단원·목표·개념 설명·지도안·성취기준 설명을 확인했어요.');
 const example=m.workedExample,exampleOK=clean(example?.prompt)&&clean(example?.answer)&&Array.isArray(example?.steps)&&example.steps.length>0&&example.steps.every(s=>clean(s));
 add('example','예제·풀이 단계',exampleOK?'pass':'error',exampleOK?'예제 질문·풀이 단계·답이 있어요.':'예제 질문·답·풀이 단계에 빠진 내용이 있어요.');
 const act=m.activity,actOK=clean(act?.title)&&clean(act?.materials)&&Array.isArray(act?.steps)&&act.steps.length>0&&act.steps.every(s=>clean(s));
 add('activity','활동 구성',actOK?'pass':'error',actOK?'활동 제목·준비물·단계가 있어요.':'활동 제목·준비물·단계에 빠진 내용이 있어요.');
 const selfOK=Array.isArray(m.selfCheck)&&m.selfCheck.length>0&&m.selfCheck.every(s=>clean(s));
 add('self-check','추가 과제·자기 확인',clean(m.extension)&&selfOK?'pass':'error',clean(m.extension)&&selfOK?'추가 과제와 자기 확인 항목이 있어요.':'추가 과제 또는 자기 확인 항목을 채워 주세요.');
 const standardOK=Array.isArray(m.standards)&&m.standards.length>0&&m.standards.every(s=>/^6[수영]\d{2}-\d{2}$/.test(s));
 add('standards','성취기준 표기',standardOK?'pass':'error',standardOK?'5~6학년군 코드 형식을 확인했어요. 원문 적합성을 판정한 결과는 아니에요.':'원본의 성취기준 코드와 표기를 확인해 주세요.');
 const questions=Array.isArray(m.questions)?m.questions:[];
 add('question-count','복습 문항 수',[3,5,8].includes(questions.length)&&questions.length===Number(m.agent?.input?.questionCount)?'pass':'error',`복습 문항 ${questions.length}개 / 요청 ${m.agent?.input?.questionCount??'미확인'}개`);
 const duplicates=new Set(),seen=new Set();
 for(let i=0;i<questions.length;i++){
  const q=questions[i]||{},name=`${i+1}번 문항`,opts=Array.isArray(q.options)?q.options:[],key=norm(q.text);
  const blanks=!clean(q.text)||!clean(q.hint)||!clean(q.feedback)||opts.length<2||opts.some(o=>!clean(o));
  add(`q${i+1}-structure`,name+' 구성',blanks?'error':'pass',blanks?'문제·선택지(2개 이상)·힌트·해설을 모두 채워 주세요.':'문제·선택지·힌트·해설이 있어요.');
  const range=Number.isInteger(q.answer)&&q.answer>=0&&q.answer<opts.length;
  add(`q${i+1}-answer`,name+' 정답 범위',range?'pass':'error',range?'정답이 유효한 선택지를 가리켜요.':'정답이 선택지 범위를 벗어났어요.');
  const optionsDuplicate=new Set(opts.map(norm)).size!==opts.length;
  add(`q${i+1}-options`,name+' 선택지 중복',optionsDuplicate?'error':'pass',optionsDuplicate?'공백을 제외하면 같은 선택지가 있어요.':'서로 다른 선택지예요.');
  const fractionValues=opts.map(value=>{const match=clean(value).match(/^(?:(\d+)\s*(?:과|와)\s*)?(\d+)\s*\/\s*(\d+)$/);return match&&Number(match[3])>0?Number(match[1]||0)+Number(match[2])/Number(match[3]):null;});
  const equivalent=fractionValues.some((value,index)=>value!==null&&fractionValues.slice(index+1).some(other=>other!==null&&Math.abs(other-value)<1e-10));
  const representationSpecified=/기약분수|대분수|가분수|가장 작은 공통 분모|분모가\s*\d+/.test(q.text||'');
  if(equivalent)add(`q${i+1}-representation`,name+' 답 표현 조건',representationSpecified?'pass':'error',representationSpecified?'크기가 같은 분수 선택지가 있어 답의 표현 조건을 확인했어요. 조건에 맞는 답이 하나인지 검토해 주세요.':'크기가 같은 분수 선택지가 있어요. 기약분수·대분수 등의 조건을 문제에 쓰거나 선택지를 고쳐 정답을 하나로 정해 주세요.');
  if(key&&seen.has(key))duplicates.add(i+1);if(key)seen.add(key);
  if(q.agentValidation){const answer=expected(q.agentValidation),valid=answer!==null&&range&&clean(opts[q.answer])===answer;
   const originalText=norm(q.text)===norm(q.agentValidation.referenceText);
   if(!originalText)add(`q${i+1}-calculation`,name+' 수치 검산','warning','문제 문장이 자동 구성 당시와 달라졌어요. 기존 수식 메타데이터로 현재 문장의 정답을 판정하지 않아요. 사람이 다시 검산해 주세요.');
   else add(`q${i+1}-calculation`,name+' 수치 검산',valid?'pass':'error',valid?'수식 메타데이터를 다시 계산한 값과 정답 선택지가 같아요. 해설의 모든 문장을 검증한 결과는 아니에요.':'수식 메타데이터 또는 정답 선택지를 확인해 주세요.');
   if(norm(q.hint)!==norm(q.agentValidation.referenceHint)||norm(q.feedback)!==norm(q.agentValidation.referenceFeedback))add(`q${i+1}-edited-explanation`,name+' 편집한 힌트·해설','warning','힌트 또는 해설을 편집했어요. 계산 결과와 설명이 일치하는지 사람이 확인해 주세요.');
  }else add(`q${i+1}-calculation`,name+' 내용 검수','warning','원본 문항 은행에서 가져온 내용이에요. 정답·해설의 의미는 사람이 확인해야 해요.');
  const provenance=q.provenance,provenanceOK=provenance&&originalId.test(provenance.sourceId||'')&&clean(provenance.sourceTitle)&&clean(provenance.sourceVersion);
  add(`q${i+1}-source`,name+' 출처 추적',provenanceOK?'pass':'error',provenanceOK?`${provenance.sourceTitle} v${provenance.sourceVersion}${provenance.mode==='template'?' · 수치 변형':' · 원본 문항'}`:'원본 차시·버전을 추적할 수 없어요.');
 }
 add('duplicate-questions','문항 중복',duplicates.size?'error':'pass',duplicates.size?'같은 문제 문장: '+[...duplicates].join(', ')+'번':'문제 문장이 서로 달라요.');
 const agent=m.agent,plan=agent?.plan,phases=Array.isArray(plan?.phases)?plan.phases:[],phaseOK=phases.length>0&&phases.every(p=>clean(p.title)&&clean(p.activity)&&Number.isInteger(p.minutes)&&p.minutes>0)&&sum(phases.map(p=>Number(p.minutes)||0))===Number(m.duration);
 add('plan','수업 시간·단계',phaseOK?'pass':'error',phaseOK?`단계별 시간 합계가 ${m.duration}분이에요.`:'지도 단계·활동 또는 시간 합계가 맞지 않아요.');
 const agentOK=agent?.mode==='reference'&&originalId.test(agent.sourceId||'')&&clean(agent.sourceTitle)&&clean(agent.sourceVersion)&&clean(agent.sourceGoal);
 add('provenance','교재 원본·구성 방식',agentOK?'pass':'error',agentOK?`${agent.sourceTitle} v${agent.sourceVersion}을 참조한 자동 구성본이에요.`:'교재 원본과 참조 방식을 확인할 수 없어요.');
 const inputOK=String(agent?.input?.grade)==='5'&&['math','english'].includes(agent?.input?.subject)&&agent.input.subject===m.key&&Number(m.grade)===5&&[20,40,60].includes(Number(m.duration))&&[3,5,8].includes(Number(agent?.input?.questionCount))&&['기초','기본','도전'].includes(agent?.input?.level)&&clean(m.goal).length<=600;
 add('input','지원 범위',inputOK?'pass':'error',inputOK?'5학년·선택한 과목·시간·난이도·문항 수의 지원 범위 안에 있어요.':'학년·과목·시간·난이도·문항 수·목표 길이를 확인해 주세요.');
 const goalSame=norm(m.goal)===norm(agent?.sourceGoal);
 add('goal-alignment','입력 목표와 원본 목표',goalSame?'pass':'warning',goalSame?'원본 목표와 같은 목표를 사용했어요. 교육적 적합성 확인은 별도예요.':'입력 목표가 원본 목표와 달라요. 보존한 설명·예제·활동·문항이 새 목표를 충족하는지 사람이 확인해야 해요.');
 if(agent?.scopeExpanded){
  const extraIds=[...new Set(questions.map(q=>q.provenance?.sourceId).filter(id=>id&&id!==agent.sourceId))];
  const covered=extraIds.length>0&&extraIds.every(id=>agent.supplementary?.some(part=>part.sourceId===id&&clean(part.explanation)&&m.explanation.includes(part.explanation)));
  add('scope','복습 문항 범위',covered?'warning':'error',covered?'다른 차시의 개념 설명·예제를 함께 넣었어요. 학생의 선행 학습과 수업 분량을 확인해 주세요.':'다른 차시의 문항에 필요한 개념 설명이 빠졌어요. 해당 개념·예제를 추가하거나 같은 차시 문항으로 조정해 주세요.');
 }
 if(m.key==='english')add('english-observation','영어 이해·표현 관찰','warning','선택형 점수로 듣기·말하기 성취를 판단하지 않아요. 대화·쓰기 활동은 튜터가 관찰해야 해요.');
 add('human-review','교육 내용·근거 최종 확인','warning','형식과 일부 수치만 자동 점검했어요. 성취기준 원문·학년 적합성·해설·난이도와 수업 분량은 중앙 담당자가 검토한 뒤 승인해야 해요.');
 return {checks,errors:checks.filter(c=>c.status==='error').length,warnings:checks.filter(c=>c.status==='warning').length,passed:checks.filter(c=>c.status==='pass').length,inspectedAt:new Date().toISOString()};
}
function repair(material){
 const m=clone(material||{}),fixes=[];
 const trimField=(o,k,label)=>{if(typeof o[k]==='string'&&o[k]!==o[k].trim()){o[k]=o[k].trim();fixes.push(label+' 앞뒤 공백 정리');}};
 for(const k of ['title','unit','goal','explanation','guide','criterion','extension'])trimField(m,k,k);
 if(m.workedExample){for(const k of ['prompt','answer'])trimField(m.workedExample,k,'예제 '+k);if(Array.isArray(m.workedExample.steps))m.workedExample.steps=m.workedExample.steps.map(s=>typeof s==='string'?s.trim():s);}
 if(m.activity){for(const k of ['title','materials'])trimField(m.activity,k,'활동 '+k);if(Array.isArray(m.activity.steps))m.activity.steps=m.activity.steps.map(s=>typeof s==='string'?s.trim():s);}
 if(Array.isArray(m.selfCheck))m.selfCheck=m.selfCheck.map(s=>typeof s==='string'?s.trim():s);
 if(Array.isArray(m.questions))m.questions.forEach((q,index)=>{
  if(!q||typeof q!=='object')return;
  const label=`${index+1}번 문항`;for(const k of ['text','hint','feedback'])trimField(q,k,label+' '+k);
  if(Array.isArray(q.options)){
   const old=q.options,correct=Number.isInteger(q.answer)&&q.answer>=0&&q.answer<old.length?clean(old[q.answer]):'',unique=[],seen=new Set();
   for(const value of old){const text=clean(value),key=norm(text);if(text&&!seen.has(key)){unique.push(text);seen.add(key);}}
   if(JSON.stringify(old)!==JSON.stringify(unique)){q.options=unique;if(correct)q.answer=unique.findIndex(value=>norm(value)===norm(correct));else q.answer=-1;fixes.push(label+' 선택지 공백·빈 항목·중복 정리');}
  }
  if(q.agentValidation&&norm(q.text)===norm(q.agentValidation.referenceText)){const answer=expected(q.agentValidation),opts=Array.isArray(q.options)?q.options:[],matching=opts.reduce((out,v,i)=>clean(v)===answer?[...out,i]:out,[]);
   if(answer!==null&&matching.length===1&&q.answer!==matching[0]){q.answer=matching[0];fixes.push(label+' 수식 메타데이터로 정답 위치 복원');}}
 });
 return {material:m,fixes};
}
const api={generate,inspect,repair,catalog};
if(typeof module!=='undefined'&&module.exports)module.exports=api;
root.PogeunMaterialAgent=api;
})(typeof window!=='undefined'?window:globalThis);
