const {test}=require('node:test');
const assert=require('node:assert/strict');
const E=require('../dist/engine.js');
const A=require('../dist/material-agent.js');
const copy=value=>JSON.parse(JSON.stringify(value));

test('기존 브라우저에 저장된 예시도 통분과 lunch를 복습하며 원본·버전·기록을 보존한다',()=>{
 const state=E.seed();
 state.materials.find(m=>m.id==='mat-m12').explanation='예전에 저장된 짧은 설명';
 state.materials.find(m=>m.id==='mat-e10').explanation='I get up at seven.';
 state.attempts.push({student:'s1',materialId:'mat-e10',item:2,choice:0,correct:false});
 const saved=JSON.stringify(state),storage={getItem:()=>saved},loaded=E.load(storage),before=copy(loaded);
 const math=E.learningSupport(loaded,E.material(loaded,'mat-m12'));
 const english=E.learningSupport(loaded,E.material(loaded,'mat-e10'));
 assert.match(math.concepts.join(' '),/2\/5=6\/15/);
 assert.match(math.concepts.join(' '),/통분/);
 assert.match(english.concepts.join(' '),/eat lunch는 점심/);
 assert.ok(math.prerequisites.some(m=>m.id==='pg5-s1-m11'));
 assert.deepEqual(loaded,before);
 assert.equal(E.material(loaded,'mat-m12').explanation,'예전에 저장된 짧은 설명');
 assert.deepEqual(loaded.attempts,state.attempts);
 assert.match(E.seed().materials.find(m=>m.id==='mat-e10').explanation,/lunch는 점심/);
 assert.match(E.seed().materials.find(m=>m.id==='mat-m12').explanation,/분자와 분모에 4를 곱하면 8\/12/);
});

test('모든 학기 차시에 짧은 복습을 제공하고 선행 차시는 실제 공개 자료로 연결한다',()=>{
 const state=E.seed(),before=copy(state);
 for(const material of state.materials.filter(m=>m.catalogId===E.catalogId)){
  const support=E.learningSupport(state,material);
  assert.ok(support.concepts.length>0&&support.concepts.length<=3,material.id);
  assert.ok(support.concepts.every(s=>typeof s==='string'&&s.trim()),material.id);
  for(const prerequisite of support.prerequisites){
   const target=E.material(state,prerequisite.id);
   assert.equal(target.status,'published');
   assert.equal(target.key,material.key);
   assert.equal(prerequisite.title,target.title);
   assert.ok(target.week<material.week,material.id+' 선행 차시');
  }
 }
 assert.deepEqual(E.learningSupport(state,null),{concepts:[],prerequisites:[]});
 assert.deepEqual(state,before);
});

test('8문항에 다른 차시를 포함하면 해당 개념과 예제를 함께 제공하고 누락을 검출한다',()=>{
 const state=E.seed(),source=E.material(state,'pg5-s1-e06'),before=copy(state);
 const material=A.generate({grade:5,subject:'english',sourceId:source.id,goal:source.goal,duration:40,level:'기본',questionCount:8,variant:1},state.materials);
 assert.equal(material.agent.scopeExpanded,true);
 assert.ok(material.agent.supplementary.length>0);
 for(const part of material.agent.supplementary){
  assert.ok(material.explanation.includes(part.explanation));
  assert.ok(material.explanation.includes(part.workedExample.prompt));
  assert.ok(material.explanation.includes(part.workedExample.steps[0]));
 }
 assert.equal(A.inspect(material).errors,0);
 const support=E.learningSupport(state,material);
 assert.ok(support.prerequisites.some(m=>material.agent.supplementary.some(part=>part.sourceId===m.id)));
 assert.ok(support.concepts.length<=4);
 const incomplete=copy(material);incomplete.explanation=source.explanation;
 assert.equal(A.inspect(incomplete).checks.find(c=>c.id==='scope').status,'error');
 assert.deepEqual(state,before);
});

test('크기가 같은 분수 선택지가 있으면 답 표현 조건 누락을 검출한다',()=>{
 const state=E.seed(),source=E.material(state,'pg5-s1-m10');
 const material=A.generate({grade:5,subject:'math',sourceId:source.id,goal:source.goal,duration:40,level:'기본',questionCount:5,variant:1},state.materials);
 material.questions[0]={...material.questions[0],text:'8/12의 크기를 나타낸 분수는 무엇인가요?',options:['2/3','4/6','4/3'],answer:0};
 assert.equal(A.inspect(material).checks.find(c=>c.id==='q1-representation').status,'error');
 material.questions[0].text='8/12를 기약분수로 나타낸 것은 무엇인가요?';
 assert.equal(A.inspect(material).checks.find(c=>c.id==='q1-representation').status,'pass');
});
