const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const E=require('../dist/engine.js');

// Exercise the shipped UI's state selectors without browser automation or a copied implementation.
const source=fs.readFileSync(path.join(__dirname,'../dist/app.js'),'utf8');
function extract(name){
  const start=source.indexOf('function '+name+'(');
  assert.ok(start>=0,'UI helper exists: '+name);
  const rest=source.slice(start),next=rest.slice(1).search(/\nfunction /);
  return next<0?rest:rest.slice(0,next+1);
}
function harness(kind='learning'){
  const state=E.seed();
  const context=vm.createContext({state,scope:'ga',route:{params:{}},guidedTour:{kind,questions:state.questions.map(q=>q.id),materials:state.materials.map(m=>m.id),classes:state.classes.map(c=>c.id),attemptCount:state.attempts.length}});
  vm.runInContext(extract('tourSteps')+'\n'+extract('materialFilterData'),context);
  context.apply=(action,p)=>{const out=E.apply(context.state,action,p);context.state=out.state;return out.result;};
  context.done=()=>Array.from(context.tourSteps(),step=>!!step.done);
  context.ids=(items,institutionMode=false)=>Array.from(context.materialFilterData(items,institutionMode).list,m=>m.id);
  return context;
}

test('학습 체험은 기존 질문·다른 학생 기록을 완료로 세지 않고 실제 새 복습·질문·답변·이해 기록을 따른다',()=>{
  const h=harness();
  assert.deepEqual(h.done(),[false,false,false,false]);
  h.apply('attempt',{classId:'cl-m',materialId:'mat-m12',student:'s2',item:0,choice:0});
  assert.deepEqual(h.done(),[false,false,false,false]);
  h.apply('attempt',{classId:'cl-m',materialId:'mat-m12',student:'s1',item:0,choice:0});
  assert.deepEqual(h.done(),[true,false,false,false]);
  const q=h.apply('question',{classId:'cl-m',materialId:'mat-m12',student:'s1',item:0,text:'통분을 다시 설명해 주세요.'});
  assert.deepEqual(h.done(),[true,true,false,false]);
  h.apply('answer',{questionId:q,tutor:'t1',text:'분모를 같은 수로 만들어 비교해요.'});
  assert.deepEqual(h.done(),[true,true,true,false]);
  h.apply('understood',{questionId:q,student:'s1'});
  assert.deepEqual(h.done(),[true,true,true,true]);
});

test('운영 체험은 실제 클래스·초안·중앙 승인·해당 기관 배포·수신·연결을 각각 확인한다',()=>{
  const h=harness('operations');
  assert.deepEqual(h.done(),[false,false,false,false,false,false]);
  h.apply('generateMatches',{role:'institution',institution:'ga'});
  assert.deepEqual(h.done(),[false,false,false,false,false,false]);
  const proposal=h.state.proposals.find(p=>p.student==='s3');
  h.apply('reviewMatch',{role:'institution',institution:'ga',id:proposal.id,decision:'approved',selected:0,checked:true});
  assert.deepEqual(h.done(),[true,false,false,false,false,false]);
  const source=E.material(h.state,'pg5-s1-m11');
  const id=h.apply('generateMaterial',{role:'central',grade:'5',subject:'math',sourceId:source.id,goal:source.goal,duration:40,level:'기본',questionCount:5});
  assert.deepEqual(h.done(),[true,true,false,false,false,false]);
  h.apply('reviewMaterial',{materialId:id});
  assert.deepEqual(h.done(),[true,true,false,false,false,false]);
  h.apply('approveMaterial',{materialId:id,checks:[true,true,true,true]});
  assert.deepEqual(h.done(),[true,true,true,false,false,false]);
  h.apply('publish',{materialId:id,institutions:['nu']});
  h.apply('receive',{materialId:id,institution:'nu'});
  assert.deepEqual(h.done(),[true,true,true,false,false,false],'다른 기관 배포·수신은 가온센터의 완료가 아님');
  h.apply('publish',{materialId:id,institutions:['ga']});
  assert.deepEqual(h.done(),[true,true,true,true,false,false]);
  h.apply('receive',{materialId:id,institution:'ga'});
  assert.deepEqual(h.done(),[true,true,true,true,true,false]);
  const created=h.state.classes.find(c=>!h.guidedTour.classes.includes(c.id));
  h.apply('assignMaterial',{classId:created.id,materialId:id,institution:'ga'});
  assert.deepEqual(h.done(),[true,true,true,true,true,true]);
});

test('중앙 자료 필터는 과목·단원·상태의 교집합과 빈 결과를 반환하며 원본을 보존한다',()=>{
  const h=harness(),items=h.state.materials;
  const m=E.material(h.state,'pg5-s1-m11'),before=JSON.stringify(items);
  h.route.params={filterSubject:'math',filterUnit:m.unit,filterStatus:'published'};
  const ids=h.ids(items);
  assert.ok(ids.includes(m.id));
  assert.ok(ids.every(id=>{const item=E.material(h.state,id);return item.key==='math'&&item.unit===m.unit&&item.status==='published';}));
  h.route.params={filterSubject:'english',filterUnit:m.unit,filterStatus:'draft'};
  assert.deepEqual(h.ids(items),[]);
  h.route.params={};
  assert.equal(h.ids(items).length,items.length);
  assert.equal(JSON.stringify(items),before);
});

test('기관 자료 필터는 현재 기관의 수신·클래스 연결 상태만 사용한다',()=>{
  const h=harness();
  h.route.params={filterStatus:'new'};
  assert.ok(!h.ids(h.state.materials,true).includes('mat-e10'),'가온센터에는 수신된 자료');
  h.scope='nu';
  assert.ok(h.ids(h.state.materials,true).includes('mat-e10'),'누리센터에는 미수신 자료');
  h.route.params={filterStatus:'connected'};
  assert.ok(!h.ids(h.state.materials,true).includes('mat-m12'),'타 기관의 클래스 연결은 제외');
  h.scope='ga';
  assert.ok(h.ids(h.state.materials,true).includes('mat-m12'));
  h.route.params={filterSubject:'english',filterStatus:'connected'};
  assert.deepEqual(h.ids(h.state.materials,true),['mat-e10']);
});

test('관련 차시의 복귀 주소는 원래 클래스와 과거 자료 버전을 함께 유지한다',()=>{
  const h=harness();
  Object.assign(h,{URLSearchParams,menus:{student:[]},location:{hash:''}});
  vm.runInContext(extract('path')+'\n'+extract('getRoute'),h);
  const resume=h.path('student','review',{id:'cl-m',material:'mat-m12'});
  h.location.hash='#'+h.path('student','material',{id:'pg5-s1-m11',resume});
  const related=h.getRoute();
  assert.equal(related.params.id,'pg5-s1-m11');
  assert.equal(related.params.resume,resume);
  h.location.hash='#'+related.params.resume;
  const restored=h.getRoute();
  assert.equal(restored.role,'student');
  assert.equal(restored.view,'review');
  assert.equal(restored.params.id,'cl-m');
  assert.equal(restored.params.material,'mat-m12');
});
