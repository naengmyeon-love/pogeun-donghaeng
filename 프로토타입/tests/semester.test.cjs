'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const E = require('../dist/engine.js');

const CATALOG_ID = 'grade5-semester1-2022-v1';
const idsFor = prefix => Array.from({ length: 18 }, (_, index) => `pg5-s1-${prefix}${String(index + 1).padStart(2, '0')}`);
const EXPECTED_IDS = [...idsFor('m'), ...idsFor('e')];
const mathCodes = new Set(['6수01-01', '6수01-04', '6수01-05', '6수01-06', '6수01-07', '6수01-08', '6수02-01', '6수03-11', '6수03-12', '6수03-13', '6수03-14']);
const englishCode = /^6영0[12]-(?:0[1-9]|10)$/;
const clone = value => JSON.parse(JSON.stringify(value));
const catalog = state => state.materials.filter(material => material.catalogId === CATALOG_ID);
const codeOf = standard => typeof standard === 'string' ? standard : standard.code;
const nonempty = (value, context) => assert.ok(typeof value === 'string' && value.trim().length > 0, context);

function memoryStorage(value) {
  const entries = new Map(value === undefined ? [] : [[E.KEY, value]]);
  return {
    getItem(key) { return entries.has(key) ? entries.get(key) : null; },
    setItem(key, next) { entries.set(key, String(next)); }
  };
}

function assertCompleteCatalog(state) {
  const materials = catalog(state);
  assert.equal(E.catalogId, CATALOG_ID);
  assert.equal(materials.length, 36);
  assert.deepEqual(materials.map(material => material.id).sort(), [...EXPECTED_IDS].sort());
  assert.equal(new Set(state.materials.map(material => material.id)).size, state.materials.length, '자료 ID가 중복되지 않는다.');
  for (const institution of state.institutions) {
    for (const material of materials) {
      const deliveries = state.deliveries.filter(delivery => delivery.institution === institution.id && delivery.materialId === material.id);
      assert.equal(deliveries.length, 1, `${institution.id}/${material.id} 기관 수신은 한 번만 기록된다.`);
      assert.equal(deliveries[0].received, true);
    }
  }
}

test('5학년 1학기 카탈로그는 수학·영어 각 18주, 총 36개 자료·180문항을 제공한다', () => {
  const state = E.seed();
  assertCompleteCatalog(state);
  const allQuestionIds = [];
  for (const [key, prefix, subject] of [['math', 'm', '수학'], ['english', 'e', '영어']]) {
    const materials = catalog(state).filter(material => material.key === key);
    assert.equal(materials.length, 18);
    assert.deepEqual(materials.map(material => material.week).sort((a, b) => a - b), Array.from({ length: 18 }, (_, index) => index + 1));
    const coveredCodes = new Set();
    for (const material of materials) {
      const context = material.id;
      assert.equal(material.id, `pg5-s1-${prefix}${String(material.week).padStart(2, '0')}`);
      assert.equal(material.subject, subject);
      assert.equal(material.grade, 5);
      assert.equal(material.semester, 1);
      assert.equal(material.duration, 40);
      assert.equal(material.status, 'published');
      assert.equal(material.reviewed, true);
      assert.deepEqual(material.checks, [true, true, true, true]);
      for (const field of ['title', 'unit', 'goal', 'explanation', 'guide', 'extension']) nonempty(material[field], `${context}.${field}`);
      assert.ok(Array.isArray(material.standards) && material.standards.length > 0, `${context}.standards`);
      for (const standard of material.standards) {
        const code = codeOf(standard);
        assert.ok(key === 'math' ? mathCodes.has(code) : englishCode.test(code), `${context}: 2022 개정 ${key} 코드 ${code}`);
        coveredCodes.add(code);
      }
      assert.match(material.curriculum, /2022/);
      assert.match(material.curriculumChecked, /^\d{4}-\d{2}-\d{2}$/);
      assert.ok(Array.isArray(material.sources) && material.sources.length >= 1, `${context}: 교육과정 출처`);
      for (const source of material.sources) {
        nonempty(source.title, `${context}: 출처 제목`);
        const url = new URL(source.url);
        assert.equal(url.protocol, 'https:');
        assert.ok(/(?:^|\.)(?:moe\.go\.kr|ncic\.re\.kr|cbe\.go\.kr|goe\.go\.kr|gwe\.go\.kr)$/.test(url.hostname), `${context}: 공식 교육기관 출처 ${url.hostname}`);
      }
      nonempty(material.workedExample?.prompt, `${context}: 예제 문제`);
      nonempty(material.workedExample?.answer, `${context}: 예제 정답`);
      assert.ok(Array.isArray(material.workedExample?.steps) && material.workedExample.steps.length >= 2, `${context}: 예제 풀이 단계`);
      material.workedExample.steps.forEach(step => nonempty(step, `${context}: 예제 풀이`));
      nonempty(material.activity?.title, `${context}: 활동 제목`);
      assert.ok(Array.isArray(material.activity?.steps) && material.activity.steps.length >= 2, `${context}: 활동 단계`);
      material.activity.steps.forEach(step => nonempty(step, `${context}: 활동 방법`));
      assert.ok(material.activity.materials, `${context}: 활동 준비물`);
      assert.ok(material.selfCheck, `${context}: 스스로 점검`);
      assert.equal(material.questions.length, 5, `${context}: 회차별 5문항`);
      for (const question of material.questions) {
        allQuestionIds.push(question.id);
        for (const field of ['id', 'text', 'hint', 'feedback']) nonempty(question[field], `${context}: 문항 ${field}`);
        assert.ok(question.options.length >= 2, `${context}/${question.id}: 복수 선택지`);
        question.options.forEach(option => nonempty(option, `${context}/${question.id}: 선택지`));
        assert.equal(new Set(question.options.map(option => option.trim())).size, question.options.length, `${context}/${question.id}: 중복 선택지 없음`);
        assert.ok(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < question.options.length, `${context}/${question.id}: 정답 인덱스`);
      }
    }
    if (key === 'math') assert.deepEqual([...coveredCodes].sort(), [...mathCodes].sort(), '수학 5-1의 모든 목표 코드에 학습 자료가 연결된다.');
  }
  assert.equal(allQuestionIds.length, 180);
  assert.equal(new Set(allQuestionIds).size, 180, '180개 문항 ID가 서로 다르다.');
});

test('학기 자료를 과목별 클래스에 연결하고 수업 완료·복습·문항 질문까지 이어간다', () => {
  for (const [classId, materialId] of [['cl-m', 'pg5-s1-m18'], ['cl-e', 'pg5-s1-e18']]) {
    let state = E.seed();
    const existingQuestions = clone(state.questions);
    state = E.apply(state, 'assignMaterial', { institution: 'ga', classId, materialId }).state;
    const selected = E.material(state, materialId);
    assert.equal(state.classes.find(item => item.id === classId).materialId, materialId);
    assert.deepEqual(state.questions, existingQuestions, '클래스 자료 교체가 기존 질문의 자료 연결을 바꾸지 않는다.');
    state = E.apply(state, 'lesson', { classId, tutor: 't1', status: 'active' }).state;
    state = E.apply(state, 'lesson', { classId, tutor: 't1', status: 'completed', notes: '학기 마지막 회차 복습' }).state;
    assert.equal(state.classes.find(item => item.id === classId).reviewAssigned, true);
    const question = selected.questions[4];
    let applied = E.apply(state, 'attempt', { classId, materialId, student: 's1', item: 4, choice: question.answer });
    assert.equal(applied.result, true);
    state = applied.state;
    assert.equal(state.attempts.at(-1).classId, classId);
    assert.equal(state.attempts.at(-1).materialId, materialId);
    applied = E.apply(state, 'question', { classId, materialId, student: 's1', item: 4, category: '풀이가 헷갈려요', text: '마지막 문제의 풀이를 설명해 주세요.' });
    state = applied.state;
    const questionId = applied.result;
    const submitted = state.questions.find(item => item.id === questionId);
    assert.equal(submitted.materialId, materialId);
    assert.equal(submitted.item, 4);
    assert.equal(submitted.status, 'waiting');
    state = E.apply(state, 'answer', { questionId, tutor: 't1', text: question.feedback }).state;
    state = E.apply(state, 'understood', { questionId, student: 's1' }).state;
    assert.equal(state.questions.find(item => item.id === questionId).status, 'understood');
    for (const existing of existingQuestions) assert.deepEqual(state.questions.find(item => item.id === existing.id), existing);
    if (classId === 'cl-m') {
      const old = E.material(state, 'mat-m12').questions[0];
      const retry = E.apply(state, 'attempt', { classId, materialId: 'mat-m12', student: 's1', item: 0, choice: old.answer });
      assert.equal(retry.result, true, '자료 교체 뒤에도 과거 질문에 연결된 문항을 다시 풀 수 있다.');
    }
  }
});

test('기존 schema 1 저장본에 학기 자료·기관 수신만 추가하며 질문·수업·시도를 보존한다', () => {
  let previous = E.seed();
  previous.materials = previous.materials.filter(material => material.catalogId !== CATALOG_ID);
  previous.deliveries = previous.deliveries.filter(delivery => !EXPECTED_IDS.includes(delivery.materialId));
  previous = E.apply(previous, 'attempt', { classId: 'cl-m', materialId: 'mat-m12', student: 's1', item: 0, choice: 1 }).state;
  previous = E.apply(previous, 'question', { classId: 'cl-m', materialId: 'mat-m12', student: 's1', item: 2, category: '도움이 필요해요', text: '저장되어 있던 질문' }).state;
  previous.classes[0].notes = '기존 사용자의 수업 메모';
  previous.supports[0].log.push('이전에 기록한 지원 조치');
  previous.materials[0].title = '기관에 저장되어 있던 자료 제목';
  const snapshot = clone(previous);
  const storage = memoryStorage(JSON.stringify(previous));
  const migrated = E.load(storage);
  assertCompleteCatalog(migrated);
  for (const field of ['schema', 'institutions', 'students', 'tutors', 'classes', 'questions', 'attempts', 'supports', 'audit']) assert.deepEqual(migrated[field], snapshot[field], `${field} 보존`);
  assert.deepEqual(migrated.materials.filter(material => material.catalogId !== CATALOG_ID), snapshot.materials);
  assert.deepEqual(migrated.deliveries.filter(delivery => !EXPECTED_IDS.includes(delivery.materialId)), snapshot.deliveries);
  E.save(storage, migrated);
  const secondLoad = E.load(storage);
  assert.deepEqual(secondLoad, migrated, '저장 후 다시 불러와도 자료나 수신 기록이 중복되지 않는다.');
  E.save(storage, secondLoad);
  assert.deepEqual(E.load(storage), secondLoad);
});

test('일부만 추가된 학기 저장본을 복구하고 이미 있는 자료·학습기록은 유지한다', () => {
  let previous = E.seed();
  previous = E.apply(previous, 'practice', { student: 's1', materialId: 'pg5-s1-m01', item: 0, choice: E.material(previous, 'pg5-s1-m01').questions[0].answer }).state;
  E.material(previous, 'pg5-s1-m01').title = '기존 학기 자료의 보존 확인 제목';
  previous.materials = previous.materials.filter(material => !['pg5-s1-m18', 'pg5-s1-e18'].includes(material.id));
  previous.deliveries = previous.deliveries.filter(delivery => !(delivery.materialId === 'pg5-s1-e01' && delivery.institution === 'nu'));
  const storage = memoryStorage(JSON.stringify(previous));
  const recovered = E.load(storage);
  assertCompleteCatalog(recovered);
  assert.equal(E.material(recovered, 'pg5-s1-m01').title, '기존 학기 자료의 보존 확인 제목');
  assert.deepEqual(recovered.attempts, previous.attempts);
  assert.deepEqual(recovered.classes, previous.classes);
  assert.deepEqual(recovered.questions, previous.questions);
  E.save(storage, recovered);
  assert.deepEqual(E.load(storage), recovered);
});

test('개별 학습은 잘못된 학생·자료·문항·선택지를 거부하고 원본 상태를 바꾸지 않는다', () => {
  const state = E.seed();
  const before = clone(state);
  const valid = { student: 's1', materialId: 'pg5-s1-m01', item: 0, choice: 0 };
  const optionsLength = E.material(state, valid.materialId).questions[0].options.length;
  for (const override of [
    { student: 'unknown' }, { materialId: 'missing' }, { materialId: 'mat-m12' },
    { item: -1 }, { item: 5 }, { item: 0.5 }, { item: undefined },
    { choice: -1 }, { choice: optionsLength }, { choice: 0.5 }, { choice: '0' },
    { choice: null }, { choice: undefined }, { choice: NaN }
  ]) assert.throws(() => E.apply(state, 'practice', { ...valid, ...override }), undefined, JSON.stringify(override));
  const unpublished = clone(state);
  E.material(unpublished, valid.materialId).status = 'draft';
  assert.throws(() => E.apply(unpublished, 'practice', valid));
  assert.deepEqual(state, before);
  assert.equal(unpublished.attempts.length, 0);
});

test('180개 문항의 정답·오답을 채점하고 개별 학습을 클래스 복습과 구분해 기록한다', () => {
  let state = E.seed();
  const beforeClasses = clone(state.classes);
  const beforeQuestions = clone(state.questions);
  const materials = catalog(state);
  let expectedAttempts = 0;
  for (const material of materials) {
    for (const [item, question] of material.questions.entries()) {
      const wrongChoice = (question.answer + 1) % question.options.length;
      for (const [choice, correct] of [[wrongChoice, false], [question.answer, true]]) {
        const previous = state;
        const applied = E.apply(previous, 'practice', { student: 's1', materialId: material.id, item, choice });
        expectedAttempts += 1;
        assert.equal(applied.result, correct, `${material.id}/${question.id}: ${choice}`);
        assert.equal(previous.attempts.length, expectedAttempts - 1, 'apply는 입력 상태를 변경하지 않는다.');
        state = applied.state;
        const attempt = state.attempts.at(-1);
        assert.equal(attempt.student, 's1');
        assert.equal(attempt.materialId, material.id);
        assert.equal(attempt.item, item);
        assert.equal(attempt.choice, choice);
        assert.equal(attempt.correct, correct);
        assert.equal(attempt.classId, null);
        assert.equal(attempt.mode, 'selfStudy');
        assert.ok(Number.isFinite(Date.parse(attempt.at)));
      }
    }
  }
  assert.equal(state.attempts.length, 360);
  assert.equal(state.attempts.filter(attempt => attempt.correct).length, 180);
  assert.deepEqual(state.classes, beforeClasses, '개별 학습이 배정 수업을 변경하지 않는다.');
  assert.deepEqual(state.questions, beforeQuestions, '개별 학습이 기존 질문 상태를 변경하지 않는다.');
});

test('미사용 사전 미리보기 자료만 최종본으로 보완하고 참조된 자료는 보존한다', () => {
  const state=E.seed();
  for(const id of ['pg5-s1-e17','pg5-s1-m01']) {
    const material=E.material(state,id);
    delete material.contentRevision;
    material.explanation='사전 미리보기 설명';
  }
  state.attempts.push({student:'s1',classId:null,mode:'selfStudy',materialId:'pg5-s1-m01',item:0,choice:0,correct:false});
  const upgraded=E.load(memoryStorage(JSON.stringify(state)));
  assert.notEqual(E.material(upgraded,'pg5-s1-e17').explanation,'사전 미리보기 설명');
  assert.equal(E.material(upgraded,'pg5-s1-m01').explanation,'사전 미리보기 설명');
  assert.deepEqual(upgraded.attempts,state.attempts);
});
