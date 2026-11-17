const {test}=require('node:test');
const assert=require('node:assert/strict');
const E=require('../dist/engine.js');
const A=require('../dist/material-agent.js');

const copy=value=>JSON.parse(JSON.stringify(value));
function fixture(overrides={}){
  const state=E.seed(),source=state.materials.find(m=>m.id==='pg5-s1-m11');
  return {state,source,input:{grade:'5',subject:'math',sourceId:source.id,goal:source.goal,duration:40,level:'기본',questionCount:5,variant:1,...overrides}};
}
function generated(overrides={}){
  const f=fixture(overrides),out=E.apply(f.state,'generateMaterial',{role:'central',...f.input});
  return {...f,...out,material:E.material(out.state,out.result)};
}
function approve(state,id){
  state=E.apply(state,'reviewMaterial',{materialId:id}).state;
  return E.apply(state,'approveMaterial',{materialId:id,checks:[true,true,true,true]}).state;
}

test('교재 생성은 원본·학습기록을 보존하고 독립된 검토 전 초안을 만든다',()=>{
  const {state,source,input}=fixture(),before=copy(state);
  const out=E.apply(state,'generateMaterial',{role:'central',...input}),m=E.material(out.state,out.result);
  assert.deepEqual(state,before);
  assert.deepEqual(E.material(out.state,source.id),source);
  assert.deepEqual(out.state.classes,before.classes);
  assert.deepEqual(out.state.questions,before.questions);
  assert.deepEqual(out.state.attempts,before.attempts);
  assert.notEqual(m.id,source.id);
  assert.equal(m.catalogId,undefined);
  assert.equal(m.status,'draft');
  assert.equal(m.reviewed,false);
  assert.deepEqual(m.checks,[false,false,false,false]);
  assert.equal(m.agent.mode,'reference');
  assert.equal(m.agent.sourceId,source.id);
  assert.equal(m.agent.sourceVersion,source.version);
  assert.equal(m.agent.sourceTitle,source.title);
  assert.equal(m.questions.length,5);
  assert.ok(m.agent.inspection);
  assert.equal(m.agent.inspection.errors,0);
  for(const q of m.questions){
    assert.ok(q.text.trim()&&q.hint.trim()&&q.feedback.trim());
    assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<q.options.length);
    assert.equal(new Set(q.options).size,q.options.length);
  }
});

test('선택한 수업 시간의 합과 생성 문항 수가 실제 자료에 반영된다',()=>{
  for(const duration of [20,40,60])for(const questionCount of [3,5,8]){
    const {state,input}=fixture({duration,questionCount}),m=A.generate(input,state.materials);
    assert.equal(m.duration,duration);
    assert.equal(m.agent.plan.phases.reduce((sum,p)=>sum+p.minutes,0),duration);
    assert.ok(m.agent.plan.phases.every(p=>Number.isFinite(p.minutes)&&p.minutes>0));
    assert.equal(m.questions.length,questionCount);
    assert.equal(A.inspect(m).errors,0);
  }
});

test('통분 문제는 재구성 회차에 따라 달라지고 모든 원본은 변경하지 않는다',()=>{
  const {state,input}=fixture(),before=copy(state.materials);
  const first=A.generate({...input,variant:1},state.materials),second=A.generate({...input,variant:2},state.materials);
  assert.notDeepEqual(first.questions.map(q=>q.text),second.questions.map(q=>q.text));
  assert.deepEqual(state.materials,before);
  assert.equal(A.inspect(first).errors,0);
  assert.equal(A.inspect(second).errors,0);
});

test('통분의 표시된 정답은 원래 두 분수와 동치이며 가장 작은 공통 분모를 쓴다',()=>{
  const {state,input}=fixture();
  const fractions=text=>[...text.matchAll(/(\d+)\/(\d+)/g)].map(match=>[Number(match[1]),Number(match[2])]);
  for(const level of ['기초','기본','도전'])for(let variant=1;variant<=8;variant++){
    const m=A.generate({...input,level,variant,questionCount:8},state.materials);
    for(const q of m.questions){
      const original=fractions(q.text);
      assert.equal(original.length,2);
      let smallest=1;
      while(smallest%original[0][1]!==0||smallest%original[1][1]!==0)smallest++;
      const valid=option=>{
        if(q.text.includes('공통 분모는'))return Number(option)===smallest;
        const answer=fractions(option);
        return answer.length===2&&answer.every(([numerator,denominator],i)=>denominator===smallest&&numerator*original[i][1]===original[i][0]*denominator);
      };
      assert.ok(valid(q.options[q.answer]),q.text);
      assert.equal(q.options.filter(valid).length,1,'수학적으로 맞는 선택지가 정확히 하나여야 한다');
    }
  }
});

test('영어는 수록 차시의 대화·활동과 문항을 연결하고 검토 전 상태를 유지한다',()=>{
  const {state}=fixture(),source=state.materials.find(m=>m.id==='pg5-s1-e06');
  const out=E.apply(state,'generateMaterial',{role:'central',grade:'5',subject:'english',sourceId:source.id,goal:source.goal,duration:20,level:'기초',questionCount:3,variant:1});
  const m=E.material(out.state,out.result);
  assert.equal(m.key,'english');
  assert.equal(m.questions.length,3);
  assert.ok(m.workedExample.steps.length&&m.activity.steps.length);
  assert.equal(m.agent.sourceId,source.id);
  assert.equal(m.agent.inspection.errors,0);
  assert.ok(m.agent.inspection.warnings>0,'자동 검수만으로 교육과정·영어 활동 적합성을 확정하지 않는다');
  assert.equal(m.reviewed,false);
});

test('지원하지 않는 입력·다른 과목의 근거·비중앙 생성 요청은 거부한다',()=>{
  const {state,input}=fixture();
  for(const change of [{grade:'4'},{subject:'science'},{sourceId:'missing-source'},{sourceId:'pg5-s1-e06'},{goal:''},{duration:35},{level:'최상'},{questionCount:4}]){
    assert.throws(()=>A.generate({...input,...change},state.materials),JSON.stringify(change));
  }
  assert.throws(()=>E.apply(state,'generateMaterial',{role:'tutor',...input}));
  assert.throws(()=>E.apply(state,'generateMaterial',input));
});

test('자동 검수는 범위 밖 정답·중복 선택지·빈 해설을 실제 결함으로 표시한다',()=>{
  const {state,input}=fixture(),m=A.generate(input,state.materials),broken=copy(m);
  broken.questions[0].answer=99;
  broken.questions[1].options[1]=broken.questions[1].options[0];
  broken.questions[2].feedback='';
  const report=A.inspect(broken);
  assert.ok(report.errors>=3);
  assert.ok(report.checks.some(c=>c.status==='error'));
  assert.equal(A.inspect(m).errors,0);
  assert.notEqual(m.questions[0].answer,99);
});

test('자동 점검과 안전 수정은 담당자의 승인·배포를 대신하지 않는다',()=>{
  let {state,result:id}=generated();
  state=E.apply(state,'inspectMaterial',{role:'central',materialId:id}).state;
  assert.equal(E.material(state,id).status,'draft');
  assert.equal(E.material(state,id).reviewed,false);
  state=E.apply(state,'repairMaterial',{role:'central',materialId:id}).state;
  assert.equal(E.material(state,id).status,'draft');
  assert.equal(E.material(state,id).reviewed,false);
  assert.throws(()=>E.apply(state,'publish',{materialId:id,institutions:['ga']}));
  assert.throws(()=>E.apply(state,'approveMaterial',{materialId:id,checks:[true,true,true,true]}));
  assert.throws(()=>E.apply(state,'inspectMaterial',{role:'student',materialId:id}));
  assert.throws(()=>E.apply(state,'repairMaterial',{role:'tutor',materialId:id}));
});

test('사용자가 수치 문항을 바꾼 뒤에는 예전 수식으로 검산 성공을 표시하거나 정답을 복구하지 않는다',()=>{
  const {state,input}=fixture(),m=A.generate(input,state.materials),edited=copy(m);
  edited.questions[0].text='3/5와 2/7을 통분한 결과는 무엇인가요?';
  edited.questions[0].answer=99;
  const report=A.inspect(edited),calculation=report.checks.find(c=>c.id==='q1-calculation');
  assert.ok(calculation);
  assert.notEqual(calculation.status,'pass');
  const repaired=A.repair(edited).material;
  assert.equal(repaired.questions[0].answer,99);
  assert.ok(A.inspect(repaired).errors>0);
});

test('문항 편집 뒤 검수가 갱신되고 오류가 남은 교재는 내부 검토·승인·배포할 수 없다',()=>{
  let {state,result:id}=generated();
  state=E.apply(state,'reviewMaterial',{materialId:id}).state;
  const m=E.material(state,id),questions=copy(m.questions);
  questions[0].answer=99;
  state=E.apply(state,'editMaterial',{materialId:id,title:m.title,goal:m.goal,explanation:m.explanation,questions}).state;
  assert.equal(E.material(state,id).status,'draft');
  assert.equal(E.material(state,id).reviewed,false);
  assert.deepEqual(E.material(state,id).checks,[false,false,false,false]);
  assert.ok(E.material(state,id).agent.inspection.errors>0);
  assert.throws(()=>E.apply(state,'reviewMaterial',{materialId:id}));
  const manuallyStaged=copy(state);
  E.material(manuallyStaged,id).status='review';
  assert.throws(()=>E.apply(manuallyStaged,'approveMaterial',{materialId:id,checks:[true,true,true,true]}));
  E.material(manuallyStaged,id).status='approved';E.material(manuallyStaged,id).reviewed=true;
  assert.throws(()=>E.apply(manuallyStaged,'publish',{materialId:id,institutions:['ga']}));
});

test('검토한 교재가 기관 수신·수업·학생 복습·튜터 질문 흐름으로 이어진다',()=>{
  let {state,result:id}=generated();
  state=approve(state,id);
  state=E.apply(state,'publish',{materialId:id,institutions:['ga']}).state;
  assert.throws(()=>E.apply(state,'assignMaterial',{institution:'ga',classId:'cl-m',materialId:id}));
  state=E.apply(state,'receive',{institution:'ga',materialId:id}).state;
  state=E.apply(state,'assignMaterial',{institution:'ga',classId:'cl-m',materialId:id}).state;
  state=E.apply(state,'lesson',{tutor:'t1',classId:'cl-m',status:'active'}).state;
  state=E.apply(state,'lesson',{tutor:'t1',classId:'cl-m',status:'completed'}).state;
  const m=E.material(state,id),answer=m.questions[0].answer;
  const attempt=E.apply(state,'attempt',{student:'s1',classId:'cl-m',materialId:id,item:0,choice:answer});
  assert.equal(attempt.result,true);state=attempt.state;
  const question=E.apply(state,'question',{student:'s1',classId:'cl-m',materialId:id,item:0,category:'풀이가 헷갈려요',text:'분모를 왜 같게 하나요?'});state=question.state;
  state=E.apply(state,'answer',{tutor:'t1',questionId:question.result,text:'같은 크기의 조각으로 나타내기 위해서예요.'}).state;
  assert.equal(state.questions.find(q=>q.id===question.result).materialId,id);
  assert.equal(state.questions.find(q=>q.id===question.result).status,'answered');
  assert.equal(state.questions.find(q=>q.id==='q1').materialId,'mat-m12');
  assert.equal(state.attempts.at(-1).materialId,id);
  assert.throws(()=>E.apply(state,'editMaterial',{materialId:id,title:m.title,goal:m.goal,explanation:'배포 뒤 변경'}));
});
