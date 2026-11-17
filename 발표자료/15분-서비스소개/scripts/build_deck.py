"""Build a self-contained Korean HTML presentation from verified sources."""
from pathlib import Path
import base64
import html
import json
import re
import shutil

ROOT = Path(__file__).resolve().parents[1]
PROJECT = ROOT.parents[1]
VENDOR = Path('/opt/homebrew/lib/node_modules/hyperframes/dist')
GSAP = Path('/Users/beomjun/.agents/skills/talking-head-recut/assets/vendor/gsap.min.js')
URL = 'https://pogeun-donghaeng-demo.svbrbmssyf.chatgpt.site'
SOURCES = {
    'stats': ('국가데이터처·교육부, 2025년 초중고 사교육비조사', 'https://www.mods.go.kr/board.es?act=view&bid=245&list_no=443953&mid=a10301070100'),
    'table': ('지역별 통계 · 조사 본문 p.13 표15', 'https://mods.go.kr/boardDownload.es?bid=245&list_no=443953&seq=1'),
    'moe': ('교육부 · 2024/2025 비교 수치', 'https://www.moe.go.kr/boardCnts/viewRenew.do?boardID=340&boardSeq=106117&lev=0&m=020501&opType=N&page=7&s=moe'),
    'dong': ('서울동행 기존 참여 안내', 'https://www.donghaeng.seoul.kr/help/info.do'),
    'transition': ('서울시자원봉사센터 전환 안내 · 안양대 게재', 'https://www.anyang.ac.kr/main/communication/notice.do?article.offset=0&articleLimit=15&articleNo=35385&mode=view'),
    'ddm': ('동대문구 · 2026 하반기 공지 · 이화여대 게재', 'https://ewha.kr/ewha/news/notice.do?article.offset=30&articleLimit=10&articleNo=366893&mode=view&no=380'),
    'cheonan': ('천안시청소년재단 · 2026 멘토링 장학사업', 'https://cayf.or.kr/bbs/board.php?bo_table=notice&page=1&wr_id=40'),
    'gimpo': ('김포시 · 2026 진로진학 멘토링', 'https://www.gimpo.go.kr/news/selectBbsNttView.do?bbsNo=466&key=9377&nttNo=980443'),
    'learn': ('서울시 · 2026 서울런 멘토링', 'https://www.seoul.go.kr/news/news_report.do?nttNo=455454&srchCtgry=475'),
    'busan': ('국립부경대 · 2026 대학생 학습지원 튜터링', 'https://lms.pknu.ac.kr/ilos/community/notice_view_form.acl?ARTL_NUM=9337478&SCH_KEY=T&SCH_TARGET=&SCH_VALUE=&display=20&start=1'),
    'suwon': ('수원 영통구 · 2026 하반기 학습·정서 멘토링', 'https://yt.suwon.go.kr/_bbsplus/view.asp?bd_gubn=1&code=tbl_bbs_sub080301&dong_cn=1&dong_div=1+&dong_gubun=&no=MTIzMyAg&page=1'),
}

def esc(s):
    return html.escape(str(s), quote=True)

def data_image(path):
    path = Path(path)
    mime = 'image/png' if path.suffix == '.png' else 'image/jpeg' if path.suffix in ('.jpg', '.jpeg') else 'image/svg+xml'
    return f'data:{mime};base64,' + base64.b64encode(path.read_bytes()).decode()

def capture(name, alt):
    p = Path('/tmp/pogeun-captures') / name
    dest = ROOT / 'assets' / name
    dest.parent.mkdir(exist_ok=True)
    if not dest.exists() and p.exists():
        shutil.copyfile(p, dest)
    return f'<img class="capture" src="{data_image(dest)}" alt="{esc(alt)}">'

def source(*keys, extra=''):
    links = ' · '.join(f'<a href="{SOURCES[k][1]}" target="_blank" rel="noopener">{SOURCES[k][0]}</a>' for k in keys)
    return f'<div class="source">{links}{(" · " + extra) if extra else ""}</div>'

def steps(items):
    return '<ol class="steps">' + ''.join(f'<li><b>{esc(a)}</b><span>{esc(b)}</span></li>' for a, b in items) + '</ol>'

def nodes(items, cls=''):
    return '<div class="nodes '+cls+'">' + ''.join(f'<div class="node"><span class="node-num">0{i+1}</span><b>{a}</b><p>{b}</p></div>' for i,(a,b) in enumerate(items)) + '</div>'

slides = []
def add(id, chapter, title, seconds, body, notes, cls='', refs=''):
    slides.append(dict(id=id, chapter=chapter, title=title, seconds=seconds, body=body, notes=notes.strip(), cls=cls, refs=refs))

add('cover','01 소개','배움이 다음 수업까지 이어지도록',40,
    '''<div class="cover-grid"><div><div class="wordmark"><span class="brand-symbol">동</span>포근동행</div>
    <h1>배움이<br>다음 수업까지<br><em>이어지도록.</em></h1><p class="cover-sub">지역의 학생과 대학생 튜터를 잇는<br>학습지원·운영 서비스</p></div>
    <div class="cover-art"><img class="cover-product" src="__COVER_PRODUCT__" alt="학생이 막힌 문항에서 질문을 보내는 실제 모바일 화면"><div class="cover-caption">막힌 문제에서 바로 질문할 수 있습니다.</div></div></div>''',
    '''안녕하세요. 지역의 학생과 대학생 튜터를 연결하는 학습지원 서비스, 포근동행을 소개하겠습니다. 저희가 생각하는 동행은 튜터를 한 번 배정하는 데서 끝나지 않습니다. 학생이 수업에서 배운 내용을 혼자 다시 풀어 보고, 막힌 문제를 질문하고, 다음 수업에서 다시 도움을 받는 과정까지 이어지는 것입니다. 오늘은 왜 이런 서비스가 필요한지, 기존 멘토링 프로그램과 어떤 방향에서 차별화하려는지, 그리고 배포된 프로토타입에서 네 역할이 어떻게 연결되는지 순서대로 말씀드리겠습니다.''', 'cover')

add('promise','01 소개','지역에서 만난 튜터와 수업 밖 배움까지 함께합니다',35,
    '''<div class="statement"><p>초등 5학년 <b>수학·영어</b>부터 시작합니다.</p><div class="big-connection"><span>학생</span><i>↔</i><span class="blue">대학생 튜터</span></div><div class="under-line">전국 지역 기관의 매칭·수업·복습을 하나의 플랫폼에서</div></div>
    <div class="bottom-band">수업 전 준비 → 수업 → 복습 → 질문·답변 → 다음 수업</div>''',
    '''포근동행은 전국 각지에서 운영되는 대학생 멘토링을 하나의 플랫폼에서 이어가려는 서비스입니다. 학생과 튜터의 매칭부터 공통 자료, 수업, 복습과 질문까지 같은 흐름으로 연결합니다. 이번 프로토타입은 초등학교 5학년 수학과 영어부터 시작합니다. 지역 기관은 학생과 튜터의 상황을 살펴 배정을 확정하고, 중앙기관은 공통 자료와 여러 지역의 운영 현황을 관리합니다. 각 지역의 현장 운영을 살리면서 공통으로 필요한 기반을 함께 쓰는 것이 핵심입니다.''')

add('total','02 문제 현황','학생 수와 사교육비 총액은 함께 줄었습니다',55,
    '''<div class="two-metrics"><div><p class="metric-label">초중고 학생 수</p><div class="metric-pair"><span>513<small>만 명</small></span><i>→</i><strong>502<small>만 명</small></strong></div><div class="delta">−2.3%</div></div><div><p class="metric-label">연간 사교육비 총액</p><div class="metric-pair"><span>29.2<small>조 원</small></span><i>→</i><strong>27.5<small>조 원</small></strong></div><div class="delta">−5.7%</div></div></div><div class="chart-years">2024년 → 2025년</div><p class="takeaway">총액 감소만으로 교육비 부담이 해소됐다고 볼 수는 없습니다.</p>''',
    '''문제 현황은 가장 최근에 공표된 2025년 초중고 사교육비조사를 기준으로 보겠습니다. 2024년과 비교하면 조사에 사용한 학생 수는 약 513만 명에서 502만 명으로 2.3% 줄었고, 연간 사교육비 총액도 29.2조 원에서 27.5조 원으로 5.7% 감소했습니다. 여기서 전체 교육비가 아니라 가계가 부담한 사교육비 총액이라는 점을 구분해야 합니다. 학생 수 감소와 함께 사교육 참여율, 참여 시간도 감소했기 때문에 인구 감소 하나만을 원인으로 단정하지 않았습니다. 중요한 질문은 총액이 줄어든 상황에서 실제 학생 한 명에게 돌아가는 부담과 기회가 어떻게 달라졌는가입니다.''',refs=source('stats','moe',extra='2026.03.12 공표 · 학생 수는 반올림 수치'))

add('participant','02 문제 현황','사교육 참여 학생의 월평균 지출은 오히려 늘었습니다',55,
    '''<div class="expense-layout"><div class="expense-main"><div class="metric-label">참여학생 1인당 월평균 사교육비</div><div class="huge">60.4<span>만 원</span></div><div class="expense-previous">2024년 59.2만 원 → 2025년 60.4만 원</div></div><div class="expense-side"><strong>+2.0<small>%</small></strong><p>참여하는 학생 한 명의<br>지출은 증가</p></div></div><div class="clarification"><b>기준을 구분해야 합니다.</b><span>전체학생 평균은 47.4 → 45.8만 원으로 감소했습니다.</span></div>''',
    '''참여학생을 기준으로 보면 다른 모습이 나타납니다. 사교육에 참여한 학생 한 명의 월평균 지출은 59.2만 원에서 60.4만 원으로 2% 늘었습니다. 반면 사교육을 받지 않은 학생까지 포함하는 전체학생 평균은 47.4만 원에서 45.8만 원으로 줄었습니다. 따라서 모든 학생의 일인당 지출이 늘었다고 말하면 정확하지 않습니다. 저희가 전달하고 싶은 문제는 총액 감소와 별개로, 참여학생 1인당 평균 지출은 늘고 있다는 것입니다. 이 수치만으로 특정 가정이 사교육을 포기했다고 판단할 수는 없지만, 비용 부담을 줄이면서도 필요한 보충학습을 지속할 수 있는 경로를 살펴볼 필요가 있습니다.''',refs=source('stats','moe'))

add('region','02 문제 현황','서울과 읍면지역의 월 지출 차이는 33.1만 원입니다',55,
    '''<div class="region-layout"><div class="bars"><div class="bar-unit">2025년 · 참여학생 1인당 월평균 · 만 원</div><div class="bar-row"><b>서울</b><div class="bar-track"><div class="bar bluebar" style="width:89.22%">80.3</div></div></div><div class="bar-row"><b>중소도시</b><div class="bar-track"><div class="bar" style="width:65.22%">58.7</div></div></div><div class="bar-row"><b>광역시</b><div class="bar-track"><div class="bar" style="width:64.56%">58.1</div></div></div><div class="bar-row"><b>읍면지역</b><div class="bar-track"><div class="bar mintbar" style="width:52.44%">47.2</div></div></div><div class="axis"><span>0</span><span>30</span><span>60</span><span>90</span></div></div><div class="region-callout"><span>서울 − 읍면지역</span><strong>33.1<small>만 원</small></strong><p>2024년 차이 32.8만 원<br>→ 2025년 33.1만 원</p></div></div><p class="takeaway small-takeaway">지출 격차는 여전히 큽니다. 지역의 보충학습 경로를 넓히려 합니다.</p>''',
    '''지역별로도 차이가 큽니다. 같은 참여학생 기준으로 2025년 서울은 월 80.3만 원, 읍면지역은 47.2만 원입니다. 한 달에 33.1만 원의 차이가 납니다. 절대금액 차이는 전년의 32.8만 원보다 소폭 커졌지만, 비율로 보면 약 1.72배에서 1.70배로 조금 줄었습니다. 전체학생 기준의 절대금액 차이도 줄었기 때문에 지역 격차가 모든 기준에서 심해졌다고 설명하지는 않겠습니다. 분명한 점은 지역에 따른 큰 지출 차이가 계속 존재한다는 것입니다. 또한 지출이 곧 성적이나 교육의 질을 뜻하지는 않습니다. 저희는 이 차이를 출발점으로 지역에서도 꾸준히 이용할 수 있는 보충학습 경로를 제안합니다.''',refs=source('table',extra='차이·비율은 공표값으로 계산 · 지출액이 학업성취도를 뜻하지 않음'))

add('programs','03 해결방식과 차별점','지역마다 멘토링의 대상과 운영 방식이 다릅니다',40,
    '''<div class="program-table regional-programs"><div class="program-row"><b>서울런 멘토링<small>서울시 · 2026 확대 운영</small></b><p>온라인 콘텐츠와 1:1 학습관리</p><span>매칭 표준화 이미 운영</span></div><div class="program-row"><b>동대문구 학습 멘토링<small>학교·지역아동센터·키움센터</small></b><p>초중고 학생 1~2명 지도</p><span>2026.10~2027.2</span></div><div class="program-row"><b>천안 멘토링 장학사업<small>2026년 공고상 운영 사례</small></b><p>중고생 학습·진로·정서 지원</p><span>8~10월 · 총 40시간</span></div><div class="program-row"><b>김포 진로진학 멘토링<small>2026년 공고상 운영 사례</small></b><p>고1~2 진로·진학 설계</p><span>9~10월 · 8주</span></div></div><p class="regional-program-note">공통으로 쓸 자료와 기록은 함께 준비하고, 대상과 운영 규칙은 지역에 맞춥니다.</p>''',
    '지역마다 멘토링의 대상과 운영 방식이 다릅니다. 서울런은 이미 플랫폼으로 매칭을 표준화했습니다. 동대문구는 학교와 센터에서 초중고생을 지도하고, 천안은 중고생의 학습과 진로·정서를, 김포는 고등학생 진로진학을 지원합니다. 천안과 김포는 올해 공고상 운영 사례입니다. 포근동행은 공통으로 쓸 교재와 기록을 연결하되 지역별 운영 규칙을 반영하는 방향입니다. 현재 교재를 적용할 범위는 초등 오학년 수학·영어입니다.',
    cls='programs-slide',refs=source('learn','ddm','cheonan','gimpo',extra='2026 공식 공지 사례 · 전국 전수조사 아님'))

add('difference','03 해결방식과 차별점','지역 기관이 공통 자료와 학습 기록을 함께 활용합니다',50,
    '''<div class="platform-diagram"><div class="platform-regions"><span class="diagram-label">전국 각지의 지역 기관</span><div>지역 기관 A</div><div>지역 기관 B</div><div>지역 기관 C</div></div><span class="platform-arrow">↔</span><div class="platform-core"><span class="diagram-label">함께 쓰는 운영 기반</span><b>포근동행<br>공통 플랫폼</b><p>공통 교재·학습 기록</p></div><span class="platform-arrow">↔</span><div class="platform-duties"><div><b>중앙기관의 공통 관리</b><p>자료·버전·전국 운영 현황</p></div><div><b>지역 기관의 현장 운영</b><p>매칭 최종 승인·일정·지원</p></div></div></div><div class="platform-takeaway">공통 교재는 함께 준비하고, 학생 배정과 현장 지원은 지역 기관이 결정합니다.</div>''',
    '''포근동행의 차별화 방향은 전국 곳곳의 멘토링을 하나의 플랫폼에서 운영하도록 연결하는 것입니다. 각 지역 기관이 같은 플랫폼 안에서 참여자를 확인하고, 매칭과 수업, 복습과 질문을 이어갑니다. 중앙기관은 공통 자료와 버전을 관리하고 여러 지역의 운영 현황을 함께 봅니다. 지역 기관은 학생과 튜터의 사정을 살펴 매칭을 최종 승인하고 일정과 지원을 결정합니다. 지역의 운영 판단과 공통으로 준비할 일을 나누는 구조입니다. 기존 프로그램의 운영 경험을 바탕으로, 기관마다 필요한 공통 자료와 운영 흐름을 함께 쓰고 전국으로 확장할 수 있는 모델을 제안합니다.''',refs='<div class="source">전국 확장을 위한 운영 구상 · 기관 A/B/C는 예시 · 실제 전국 연동은 기관 협력과 실증을 통해 추진</div>')

add('learning-program','03 해결방식과 차별점','한 학기 보충학습을 수업과 복습으로 나눠 준비했습니다',40,
    '''<div class="semester-grid"><div class="semester-title"><strong>18<span>주</span></strong><p>과목별 주 1회 · 40분<br>초등 5학년 1학기 예시</p></div><div class="semester-content"><div><b>수학 18차시</b><p>혼합 계산 · 약수와 배수 · 분수 · 둘레와 넓이</p></div><div><b>영어 18차시</b><p>생활 주제 중심 이해·표현 활동</p></div><div class="total-questions"><b>36차시 · 180문항</b><span>학생 자료 + 튜터 지도안 + 힌트·해설</span></div></div></div>''',
    '''프로그램 내용은 한 학기 동안 이어갈 수 있는 보충학습 예시로 준비했습니다. 과목별로 주 한 번, 사십 분씩 십팔 주를 가정합니다. 수학 십팔 차시와 영어 십팔 차시, 차시마다 다섯 문제로 총 백팔십 문항이 있습니다. 각 차시는 학생이 읽을 개념 설명과 예제, 활동, 튜터 지도안, 힌트와 정답 해설을 포함합니다. 정규 교과의 전체 수업 시수를 대신하는 구성은 아닙니다. 영어는 학교와 교과서의 단원 순서에 맞춰 조정해야 하고, 듣기 활동은 튜터가 예제 대본을 읽어 주는 방식입니다. 학교수업을 따라가는 데 필요한 보충을 지속하는 출발안입니다.''',refs='<div class="source">배포 프로토타입의 학기 자료 기준 · 검토용 자체 구성 예시 · 실제 교사 검수·교육부 인증을 뜻하지 않음</div>')

add('roles','04 역할별 흐름','네 역할이 하나의 배움 과정을 나눠 맡습니다',45,
    '''<div class="role-map"><div class="role-map-row"><div class="role-map-label">학습의 흐름</div><div class="role-map-cell"><b>학생</b><p>복습·질문·이해 확인</p></div><span class="between-arrow">↔</span><div class="role-map-cell"><b>튜터</b><p>준비·수업·답변</p></div></div><div class="role-map-row"><div class="role-map-label">운영의 흐름</div><div class="role-map-cell"><b>지역 기관</b><p>자격 확인·매칭·일정·지원</p></div><span class="between-arrow">↔</span><div class="role-map-cell"><b>중앙기관</b><p>공통 자료·전국 운영 현황</p></div></div></div><div class="bottom-band">하나의 플랫폼에서 중앙은 공통 관리, 지역 기관은 현장 운영을 맡습니다.</div>''',
    '''이제 역할별 흐름을 보겠습니다. 먼저 학생과 튜터가 학습의 흐름을 만듭니다. 학생은 자료를 보고 복습하고 질문하며 이해했는지 표시합니다. 튜터는 같은 자료로 수업을 준비하고 진행한 뒤 질문에 답합니다. 이 과정을 지역 기관과 중앙기관이 뒷받침합니다. 지역 기관은 튜터 자격과 학생의 참여 조건을 확인하고 매칭과 일정을 결정합니다. 중앙기관은 공통 자료를 만들고 검토하고 배포하며 기관별 활용 현황을 봅니다. 중앙이 개별 매칭을 다시 승인하는 단계는 없습니다. 현장 판단은 기관에 두고, 여러 지역에서 공통으로 준비할 일은 중앙이 맡는 구조입니다.''')

add('student','04 역할별 흐름 · 학생','학생은 복습하다 막힌 문항에서 바로 질문합니다',60,
    '<div class="screen-layout"><div>'+steps([('내 배움방 확인','튜터·시간·학습실과 수업 자료'),('문제를 다시 풀기','힌트·재시도·해설로 복습'),('문항에서 질문','어느 문제인지 함께 전달'),('답변 후 이해 확인','이해했어요 또는 재질문')])+'</div><figure>'+capture('student-today.png','공개 배포본의 학생 오늘의 학습 화면')+'<figcaption>실제 배포 화면 · 학생 / 오늘의 학습</figcaption></figure></div>',
    '''학생은 가입할 때 기관, 희망 과목, 가능한 시간과 학습 목표를 입력합니다. 기관이 배정을 확정하면 내 배움방에서 튜터와 수업 시간, 장소를 확인할 수 있습니다. 수업이 끝난 뒤에는 연결된 자료로 문제를 다시 풉니다. 틀렸다면 힌트를 보고 재시도하거나 해설을 확인합니다. 그래도 막히면 해당 문제에서 질문을 남깁니다. 학생이 자료 이름과 문제 번호를 다시 설명하지 않아도 튜터는 같은 문항을 볼 수 있습니다. 답변을 받은 뒤에는 이해했어요를 선택하거나 다시 질문합니다. 답변 도착을 학습 완료로 간주하지 않고 학생의 이해 확인을 별도로 남기는 것이 중요합니다. 화면의 학습 기록에서는 복습 시도와 질문 흐름을 돌아볼 수 있습니다.''',refs='<div class="source">2026.11.03 공개 배포본 캡처 · 예시 학생과 학습 기록</div>')

add('tutor','04 역할별 흐름 · 튜터','튜터는 공통 지도안으로 준비하고 학생의 질문을 이어받습니다',60,
    '<div class="screen-layout"><div>'+steps([('참여 신청·서류 확인','기관 검토를 거쳐 활동 준비'),('수업 준비','학생 자료·지도안·복습 확인'),('수업 진행·마무리','출석·메모·복습 배정'),('질문 답변·보충','원래 문항과 질문을 함께 확인')])+'</div><figure>'+capture('tutor-today.png','공개 배포본의 튜터 오늘의 수업과 질문 화면')+'<figcaption>실제 배포 화면 · 튜터 / 오늘의 수업과 질문</figcaption></figure></div>',
    '''튜터는 활동 과목과 가능 시간 등의 정보를 입력하고 기관의 서류 확인을 거칩니다. 파일을 첨부하는 것만으로 활동 자격이 승인되는 것은 아닙니다. 배정을 받은 뒤에는 담당 수업에서 학생 자료와 튜터 지도안, 복습 문제를 함께 확인합니다. 현장 수업에서는 수업을 시작하고 출석을 확인한 뒤, 메모를 남기고 수업을 마치며 복습을 배정합니다. 이후 질문함에서 학생이 어떤 문제를 보고 어디서 막혔는지 확인하고 답변할 수 있습니다. 학생이 다시 물으면 그 내용을 다음 수업의 보충 설명으로 이어갈 수 있습니다. 자료 오류나 개선 의견도 전달할 수 있어 공통 자료가 현장 경험을 바탕으로 개선되는 통로를 마련했습니다.''',refs='<div class="source">2026.11.03 공개 배포본 캡처 · 파일 첨부·서류 확인은 가상 정보로 체험</div>')

add('institution','04 역할별 흐름 · 기관','기관은 자동추천을 검토하고 매칭을 최종 승인합니다',65,
    '<div class="screen-layout"><div>'+steps([('참여 조건 확인','학생 상태·튜터 자격·서류'),('자동매칭안 검토','과목·시간·기간·담당 여력'),('의사 확인 후 승인','일정·정원·장소 충돌 재검사'),('수업 운영·지원','자료 연결·변경·보강·지원 조치')])+'</div><figure>'+capture('institution-matching.png','공개 배포본 기관의 자동매칭 후보와 기관 최종 승인 화면')+'<figcaption>실제 배포 화면 · 기관 / 튜터·매칭</figcaption></figure></div>',
    '''기관은 학생과 튜터를 실제 수업으로 연결하는 운영 주체입니다. 먼저 학생의 참여 상태와 튜터의 과목, 자격과 서류 확인 상태를 살펴봅니다. 자동매칭안 만들기를 누르면 미배정 학생의 과목별 후보가 추천됩니다. 가능한 시간과 활동 기간, 학습 필요와 담당 여력 등을 살펴보도록 했습니다. 다만 추천 점수는 성공 확률이나 교육효과를 검증한 수치가 아닙니다. 기관이 양측의 의사를 확인하고 최종 승인해야 클래스가 만들어집니다. 승인 시에는 시간과 정원, 학생·튜터·학습실의 일정 충돌을 다시 확인합니다. 이후 중앙 자료를 수신해 예정 수업에 연결하고, 일정 변경과 보강, 학습 기기 등 지원 요청의 처리 내용도 기록합니다. 추천을 만든 상태와 실제 배정된 상태를 분명하게 나눴습니다.''',refs='<div class="source">2026.11.03 공개 배포본 캡처 · 자동추천은 학생별 1명 안 · 직접 구성은 1~4명 그룹 지원</div>')

add('central','04 역할별 흐름 · 중앙기관','중앙기관은 여러 지역의 자료와 운영 현황을 함께 봅니다',65,
    '<div class="screen-layout"><div>'+steps([('자료 초안·편집','목표·개념·지도안·성취기준 메모'),('내부 검토','내용·수준·정답·자료 간 일치'),('기관에 배포','수신과 클래스 사용을 구분'),('전국·지역 현황 확인','기관별 자료 활용·지원 상태')])+'</div><figure>'+capture('central-materials.png','공개 배포본 중앙 운영자의 자료 제작 화면')+'<figcaption>실제 배포 화면 · 중앙 운영자 / 자료 제작</figcaption></figure></div>',
    '''중앙기관은 하나의 플랫폼에서 여러 지역의 공통 자료와 기관별 운영 현황을 관리합니다. 준비된 초안을 불러와 제목과 목표, 개념 설명과 지도안, 성취기준 메모를 편집하고 내부 검토를 거쳐 배포합니다. 검토 항목은 교육과정 근거와 내용·정답·해설, 학년 수준의 표현, 학생 자료와 지도안·복습의 일치입니다. 배포 이후에는 기관이 받았는지와 실제 클래스에 연결했는지를 구분합니다. 전국·지역별 화면에서는 기관별 자료 활용과 지원 상태를 함께 확인합니다. 자료를 수정할 때는 새 버전을 만들어 기존 수업과 질문의 원문을 보존합니다. 현재 전국 현황과 자료 초안은 예시 데이터이며, 실제 AI 생성이나 교사 검수를 완료한 자료를 뜻하지는 않습니다.''',refs='<div class="source">2026.11.03 공개 배포본 캡처 · AI 초안·전국 현황은 예시 데이터 · 화면 명칭은 ‘중앙 운영자’</div>')

add('continuity','04 역할별 흐름','질문에는 학생이 풀던 문제와 자료 버전이 함께 남습니다',45,
    '''<div class="version-flow"><div class="version-heading"><span>수학 A반</span><b>자료 v1.2 · 같은 문항</b></div><div class="version-stages"><div><span>수업</span><p>같은 자료로 설명</p></div><i>→</i><div><span>복습</span><p>문제 풀기·힌트</p></div><i>→</i><div><span>질문</span><p>문항·버전 보존</p></div><i>→</i><div><span>답변</span><p>이해 확인·재질문</p></div></div><div class="version-next"><b>새 자료 v1.3 배포</b><span>예정 수업에 연결 · 이전 질문은 v1.2 유지</span></div></div><p class="takeaway">튜터가 “어떤 문제였지?”부터 다시 확인하는 부담을 줄입니다.</p>''',
    '''앞선 네 역할이 연결될 때 중요한 것은 자료의 맥락을 잃지 않는 것입니다. 예를 들어 학생이 수학 자료 일점이 버전으로 수업을 듣고 복습하다 질문했다면, 튜터는 그 버전의 같은 문항을 보고 답변합니다. 이후 중앙에서 일점삼 버전을 배포해도 이미 진행한 수업과 과거 질문의 원문이 바뀌지 않습니다. 기관은 새 자료를 예정 수업에 연결합니다. 이렇게 수업과 복습, 질문과 답변이 같은 자료를 기준으로 이어져야 학생의 질문을 정확히 이해할 수 있습니다. 이것이 저희가 단순한 참여자 연결과 함께 학습의 연결도 다루려는 이유입니다.''')

slides[0]['body'] = slides[0]['body'].replace('__COVER_PRODUCT__', data_image(PROJECT/'프로토타입'/'미리보기'/'모바일-문항질문.jpg'))
qr = data_image(PROJECT / '공개배포' / '포근동행-체험-QR.png')
add('demo','04 역할별 흐름 · 연결 시연','한 번의 질문이 학생과 튜터 화면을 오갑니다',75,
    f'''<div class="demo-layout"><div><div class="demo-time">75초 연결 시연</div><div class="demo-rail"><div><b>학생</b><p>복습 문제에서 질문</p></div><span>↓</span><div><b>튜터</b><p>원래 문항을 보고 답변</p></div><span>↓</span><div><b>학생</b><p>답변 확인 → 이해했어요</p></div></div></div><div class="qr-area"><a href="{URL}" target="_blank" rel="noopener"><img src="{qr}" alt="포근동행 공개 프로토타입 체험 QR"><b>프로토타입 열기 ↗</b></a><p>가입 없이 예시 화면 체험하기 → 학생</p><small>같은 브라우저에서 역할을 바꾸면<br>질문과 답변이 이어집니다.</small></div></div>''',
    '''[시연 안내 · 75초 안에 진행. 미리 열어 둔 배포본으로 전환합니다.]
    먼저 가입 없이 예시 화면 체험하기에서 학생을 선택했습니다. 이지우 학생의 수학 복습에서 여기서 막혔어요를 누르고, “분모를 왜 같게 해야 하나요?”라고 질문을 남기겠습니다. 이제 위쪽에서 튜터 역할로 바꾸고 김민서 튜터의 질문함을 엽니다. 학생이 본 문제와 질문을 함께 확인할 수 있습니다. “같은 크기의 조각으로 바꿔 분자의 수를 비교하려고 분모를 같게 하는 거예요.”라고 답변을 남깁니다. 다시 학생으로 돌아가 답변을 확인하고 이해했어요를 선택합니다.
    [발표자료로 복귀합니다.]
    지금 보신 것이 수업 뒤 배움을 잇는 가장 짧은 연결입니다. QR로 각자 체험할 수 있으며, 체험 기록은 각자의 브라우저에 저장됩니다. 서로 다른 기기 사이에서 기록이 공유되는 방식은 아닙니다. 네트워크가 원활하지 않으면 앞서 보여드린 화면과 이 흐름 설명으로 넘어가겠습니다.''',refs='<div class="source">공개 체험: pogeun-donghaeng-demo.svbrbmssyf.chatgpt.site · 가상 데이터 사용 · 화면 내 링크 또는 QR로 접속</div>')

add('pilot','05 마무리','실증에서는 학습 지속과 운영 부담의 변화를 확인하겠습니다',35,
    nodes([('학생의 지속','복습 참여와 질문 후 이해 확인<br>수업 참여가 이어지는지'),('튜터의 준비','자료 준비에 드는 시간<br>질문 답변에 드는 시간'),('기관의 운영','배정·변경에 드는 시간<br>중단·지원 요청 처리')])+'''<div class="plain-note">소규모 기관·한 학기 실증 제안 · 시작 전과 종료 후를 비교하고 현장 인터뷰로 보완</div>''',
    '''다음 단계에서는 소규모 기관에서 한 학기를 운영하며 세 가지를 확인하려 합니다. 학생의 복습과 질문 이후 이해 확인이 이어지는지, 튜터의 준비 시간이 어떻게 달라지는지, 기관의 배정과 지원 업무가 얼마나 줄어드는지입니다. 시작 전후의 기록과 현장 인터뷰를 함께 보겠습니다. 아직 교육효과를 입증한 단계는 아닙니다. 참여 횟수를 성적 향상으로 해석하지 않고, 현장에서 지속 가능한지부터 검증하겠습니다.''')

add('scope','05 마무리','현재는 연결 흐름을 검증하는 배포 프로토타입입니다',30,
    '''<div class="scope-layout"><div><span class="scope-label">지금 체험할 수 있는 것</span><h3>추천·승인부터<br>수업·질문·자료 배포까지</h3><p>가상 데이터 기반 · 브라우저 저장</p></div><div><span class="scope-label">운영 서비스로 연결할 것</span><h3>서버 인증·권한과<br>다중 사용자 데이터 연결</h3><p>실제 AI 생성·교과 검수·알림</p></div></div>''',
    '''현재 공개된 프로토타입에서는 매칭과 기관 승인, 수업과 질문, 자료 검토와 배포의 연결을 체험할 수 있습니다. 이름과 기관은 가상이고 데이터는 브라우저에 저장되며, 초안은 준비된 예시입니다. 실제 운영을 위해서는 서버 인증과 권한, 사용자 간 데이터 연결, 비공개 저장과 동의 처리, 실제 인공지능과 교과 검수 등을 연결해야 합니다. 이 경계를 분명히 두고 현장 검증을 준비하겠습니다.''')

add('close','05 마무리','전국의 배움을 하나의 플랫폼으로 연결하겠습니다',35,
    f'''<div class="closing"><div><div class="wordmark"><span class="brand-symbol">동</span>포근동행</div><h1>전국의 배움을<br><em>하나의 플랫폼으로.</em></h1><p>지역별 멘토링을 함께 잇고, 현장 운영은 각 기관에서</p><strong>감사합니다.</strong></div><a class="closing-qr" href="{URL}" target="_blank" rel="noopener"><img src="{qr}" alt="포근동행 체험 QR"><span>직접 체험하기 ↗</span></a></div>''',
    '''포근동행은 전국 각지의 멘토링을 하나의 플랫폼에서 이어가는 운영 모델을 제안합니다. 중앙은 공통 자료와 여러 지역의 현황을 관리하고, 지역 기관은 현장에서 매칭과 수업을 운영합니다. 튜터의 도움과 학생의 복습·질문도 같은 흐름으로 연결합니다. 각 지역이 쌓아 온 경험을 살리면서 필요한 운영 기반을 함께 쓰고, 지역이 달라도 배움을 꾸준히 이어갈 수 있도록 하겠습니다. 현장 기관과 학생, 튜터의 경험으로 검증하고 다듬겠습니다. 전국의 배움을 하나의 플랫폼으로, 포근동행이었습니다. 감사합니다.''','closing-slide')

# Additions preserve the existing deck's design and 15-minute main line.
SOURCES.update({
    'tutoring': ('Nickow·Oreopoulos·Quan, AERJ 2024', 'https://journals.sagepub.com/doi/10.3102/00028312231208687'),
    'eef': ('EEF · Small group tuition', 'https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit/small-group-tuition'),
})

by_id = {s['id']: s for s in slides}
by_id['central'].update(
    body='<div class="screen-layout"><div>'+steps([('교재 자동 구성·편집','단원·목표·분량에 맞춘 꾸러미'),('자동 점검과 내부 검토','정답·중복·시간·교육 내용 확인'),('기관에 배포','수신과 클래스 사용을 구분'),('전국·지역 현황 확인','기관별 자료 활용·지원 상태')])+'</div><figure>'+capture('central-agent-input.png','교재 에이전트의 단원·목표·시간·문항 수 입력 화면')+'<figcaption>교재 에이전트 · 2026.11.03 업데이트</figcaption></figure></div>',
    notes='중앙기관은 공통 자료와 여러 지역의 운영 현황을 관리합니다. 이번 업데이트에서는 단원과 학습목표, 수업 시간과 문항 수를 고르면 교재 꾸러미를 자동 구성하도록 했습니다. 점검 결과를 보고 사람이 내용을 검토한 뒤 기관에 배포합니다. 기관 수신과 클래스 사용은 각각 확인하며, 배포된 자료를 바꿀 때는 새 버전을 만들어 이전 수업과 질문의 원문을 보존합니다. 전국 현황은 가상 예시입니다.',
    refs='<div class="source">공개 배포 버전 2 · 수록 자료 기반 자동 구성 · 외부 생성형 AI 미연결 · 전국 현황은 가상 예시</div>')

by_id['pilot'].update(
    title='18주 실증에서 준비 시간과 학습 변화를 함께 측정합니다',
    body='''<div class="pilot-evaluation"><div><span>제작 효율</span><b>분 / 꾸러미</b><p>구성·수정과 사람 검토를<br>각각 타이머로 측정</p></div><div><span>학습 변화</span><b>사전·사후 평가</b><p>같은 범위·유사 난이도<br>가능하면 비교집단 확보</p></div><div><span>학습 지속</span><b>완료율·응답률</b><p>7일 내 복습 완료율<br>48시간 내 첫 답변율</p></div></div><div class="evidence-boundary">기준선 2주와 18주 운영을 비교합니다. 시나리오의 가정을 실제 측정값으로 교체합니다.</div>''',
    notes='기대효과는 소규모 기관의 십팔 주 운영으로 확인하겠습니다. 먼저 이 주 동안 현재 방식을 기록해 기준선을 만듭니다. 중앙의 꾸러미당 구성·수정시간과 검토시간을 나누어 재고, 오류와 재작업이 늘지 않았는지도 보겠습니다. 학생은 같은 범위의 사전·사후 평가를 시행하고 가능하면 비교집단의 변화와 함께 보겠습니다. 칠 일 안의 복습 완료율과 사십팔 시간 안의 첫 답변율도 기록합니다. 단순한 정답 시도나 질문 수를 학습효과로 대신하지 않겠습니다.',
    refs='<div class="source">파일럿 측정안 · 현재 실측 성과 없음 · 완료율·응답률의 분모와 제외 기준은 기대효과-근거와-계산.md에 기록</div>')

by_id['scope'].update(
    body='''<div class="scope-layout"><div><span class="scope-label">지금 체험할 수 있는 것</span><h3>교재 자동 구성·검수<br>매칭·수업·질문·배포</h3><p>수록 자료 기반 · 가상 데이터 · 브라우저 저장</p></div><div><span class="scope-label">운영 서비스로 연결할 것</span><h3>서버 인증·권한과<br>다중 사용자 데이터 연결</h3><p>생성형 AI 연결·현장 교과 검수·알림</p></div></div>''',
    notes='현재 공개 프로토타입에서는 교재의 자동 구성·점검·수정과 중앙 승인, 기관 배포를 체험할 수 있습니다. 수록 자료를 활용하며 외부 생성형 AI를 호출하지는 않습니다. 매칭과 수업·질문도 연결됩니다. 실제 운영에는 서버 인증과 권한, 여러 사용자의 데이터 연결, 비공개 저장, 현장 교과 검수와 알림을 더해야 합니다. 학습효과와 운영 시간 절감은 앞으로 측정할 항목입니다.')

add('agent','04 역할별 흐름 · 교재 에이전트','교재·복습·지도안을 한 번에 구성하고 검토합니다',55,
    '<div class="screen-layout"><div>'+steps([('수업 조건 입력','5학년 수학·영어 · 단원·학습목표'),('교재 꾸러미 생성','학생 교재·문항·튜터 지도안'),('점검·수정 후 중앙 승인','검토가 끝난 버전만 기관 배포')])+'''<div class="agent-options"><b>20 / 40 / 60분</b><span>복습 3 / 5 / 8문항</span></div></div><figure>'''+capture('central-agent-result.png','교재 에이전트의 학생 교재·튜터 지도안·검토 결과 세 패널')+'<figcaption>학생용 교재 · 튜터 지도안 · 검토 결과</figcaption></figure></div>',
    '새로 추가한 교재 에이전트입니다. 수록된 서른여섯 차시에서 단원과 참고 차시를 고르고 목표, 수업 시간과 복습 문항 수를 정합니다. 그러면 학생 교재와 문제, 튜터 지도안이 한 꾸러미로 구성됩니다. 일부 수학 차시는 새 수치 문항을 만들고 계산으로 검산합니다. 나머지는 원본문항을 재구성합니다. 자동 점검은 빈 항목과 중복 선택지, 정답 범위와 시간 합계 등을 확인합니다. 목표를 바꾸거나 문제를 편집한 부분은 사람이 다시 확인하도록 표시합니다. 오류가 남으면 검토·배포를 막고, 내용 검토와 최종 승인은 중앙 담당자가 맡습니다.',
    refs='<div class="source">공개 배포 버전 2의 구현 기능 · 수학 7차시는 수치 변형·검산 · 수록 자료 기반이며 외부 생성형 AI는 미연결</div>')

add('efficiency','05 기대효과 · 업무별 계산','반복 준비와 기록 업무의 절감 가정을 계산했습니다',65,
    '''<table class="work-efficiency"><thead><tr><th>업무</th><th>사람의 작업시간 가정</th><th>해당 범위의 차이</th></tr></thead><tbody><tr><th>중앙 교재 구성·검토<small>36꾸러미 기준</small></th><td><b>60분에서 45분</b><span>구성 30→15분 · 검토 30분 유지</span></td><td><strong>9시간</strong><span>36시간에서 27시간 · 25%</span></td></tr><tr><th>튜터 수업 준비<small>주당 20개 수업 · 18주</small></th><td><b>25분에서 15분</b><span>자료 탐색·문항·지도안 정리</span></td><td><strong>60시간</strong><span>360회 × 회당 10분</span></td></tr><tr><th>출석·수업·복습 기록<small>360회 수업 기준</small></th><td><b>10분에서 6분</b><span>여러 기록의 중복 입력 감소</span></td><td><strong>24시간</strong><span>360회 × 회당 4분</span></td></tr></tbody></table>''',
    '효율화 가능성은 업무별로 가정을 드러내어 계산했습니다. 중앙에서 교재 한 꾸러미의 구성·편집을 삼십 분에서 십오 분으로 줄이고, 사람 검토 삼십 분은 유지한다고 가정합니다. 서른여섯 꾸러미를 구성·검토하면 서른여섯 시간에서 스물일곱 시간으로 아홉 시간, 이십오 퍼센트 줄어듭니다. 튜터 준비를 회당 이십오 분에서 십오 분으로 줄인다면 주당 스무 개 수업을 십팔 주 운영할 때 육십 시간을 아낍니다. 출석·수업·복습 기록을 십 분에서 육 분으로 줄인다면 같은 삼백육십 회에서 스물네 시간입니다. 모두 현장 실측이 없는 가정입니다. 기존에 자료와 기록을 잘 공유하는 기관은 절감 폭이 작을 수 있고 공식 양식 재입력이 남을 수도 있습니다. 이 수치를 합산해 전체 운영이나 예산 절감률로 쓰지는 않겠습니다.',
    cls='efficiency-slide',refs='<div class="source">자체 계산 가정 · 실제 수업·학생별 지도와 추가 품질확보·개발·유지관리 비용은 제외 · 분모와 제외 업무는 계산 부록에 제시</div>')

add('regional-contribution','05 기대효과 · 지자체 기여','공통 자료와 학습 기록이 지역 멘토링의 운영을 돕습니다',65,
    '''<div class="regional-benefits"><div><span>공통 교재·지도안</span><b>기관별 반복 준비 감소</b><p>같은 학년·과목의 자료를 재사용하고<br>현장 진도에 맞춰 수업에 연결</p></div><div><span>복습·문항 질문</span><b>수업 사이의 피드백 연결</b><p>학생이 막힌 문제를 기록하고<br>담당 튜터의 다음 지도에 활용</p></div><div><span>기관별 운영 상태</span><b>후속 지원 대상 확인</b><p>매칭 필요·자료 수신·지원 요청을<br>구분해 기관의 확인 업무를 지원</p></div></div><div class="regional-start"><b>첫 적용 후보</b><span>초5 수학·영어 보충학습 기관 3~5곳<br>기존 시스템이 있는 사업에는 필요한 기능부터 연결</span></div>''',
    '지역 멘토링에는 세 가지로 기여할 수 있습니다. 첫째, 같은 학년·과목의 교재와 지도안을 함께 준비해 기관별 반복 작업을 줄이는 것입니다. 둘째, 학생이 수업 뒤 복습하다 막힌 문제를 기록하고 튜터가 다음 지도에 활용하는 것입니다. 셋째, 매칭이 필요한 학생과 자료 수신, 지원 요청을 구분해 기관이 후속 확인할 대상을 찾도록 돕는 것입니다. 이미 매칭 플랫폼이 있는 서울런에는 교재와 수업 후 학습을 보완하는 기능으로 검토하는 것이 타당합니다. 초중고 학생을 지도하는 동대문구 같은 현장 중 초등 오학년 수학·영어를 지도하는 기관 세 곳에서 다섯 곳을 첫 적용 후보로 제안합니다. 현재 기관 간 멘토 공동 배정과 실제 전국 연동은 구현하지 않았습니다.',
    cls='regional-benefits-slide',refs=source('learn','ddm',extra='공식 사업 구조를 바탕으로 한 적용 제안 · 도입·연동 합의 및 효과 실측 없음'))

# Reorder the added scenes into the existing story and keep the 15-minute brief.
by_id = {s['id']: s for s in slides}
order = ['cover','promise','total','participant','region','programs','difference','learning-program','roles','student','tutor','institution','central','agent','continuity','demo','efficiency','regional-contribution','pilot','scope','close']
durations = [30,25,40,40,40,40,40,35,35,45,45,50,45,55,35,60,65,65,45,30,35]
slides[:] = [by_id[sid] for sid in order]
for slide, seconds in zip(slides,durations):
    slide['seconds'] = seconds
for sid in ['pilot','scope','close']:
    by_id[sid]['chapter']='06 실증과 마무리'
by_id['demo']['body']=by_id['demo']['body'].replace('75초','60초')
by_id['demo']['notes']=by_id['demo']['notes'].replace('75초','60초')



# Shortened narration follows the updated 15-minute pacing.
for sid, note in {'cover': '안녕하세요. 지역의 학생과 대학생 튜터를 연결하는 포근동행입니다. 수업에서 배운 내용을 혼자 다시 풀고, 막힌 문제를 질문하며, 다음 수업에서 도움받는 과정까지 연결하려 합니다. 오늘은 서비스가 필요한 이유, 네 역할의 운영 흐름, 새 교재 에이전트와 기대효과를 소개하겠습니다.', 'promise': '포근동행은 지역별 대학생 멘토링을 하나의 플랫폼에서 운영하는 구상입니다. 초등 오학년 수학·영어부터 시작합니다. 기관이 현장에서 매칭과 수업을 운영하고 중앙이 공통 자료를 관리해, 학생의 복습과 질문까지 이어 줍니다.', 'total': '최신 공식 연간 자료인 이천이십오 년 초중고 사교육비조사입니다. 학생 수는 약 오백십삼만 명에서 오백이만 명으로, 사교육비 총액은 이십구 점 이조 원에서 이십칠 점 오조 원으로 줄었습니다. 여기서 말하는 금액은 전체 교육비가 아닌 사교육비입니다. 학생 수와 참여율, 참여 시간이 함께 달라졌으므로 총액 감소를 한 가지 원인으로 설명하지는 않겠습니다.', 'participant': '참여학생을 기준으로 보면 다른 모습입니다. 한 명의 월평균 지출은 오십구 점 이만 원에서 육십 점 사만 원으로 이 퍼센트 늘었습니다. 사교육을 받지 않는 학생까지 포함한 전체학생 평균은 반대로 줄었습니다. 따라서 모든 학생의 지출이 늘었다는 뜻은 아닙니다. 비용을 크게 들이지 않고도 필요한 보충학습을 지속할 경로를 살펴보려 합니다.', 'region': '같은 참여학생 기준으로 서울의 월평균 지출은 팔십 점 삼만 원, 읍면지역은 사십칠 점 이만 원입니다. 차이는 삼십삼 점 일만 원입니다. 절대 차이는 전년보다 소폭 커졌지만 비율은 줄어, 모든 기준에서 격차가 확대됐다고 말하지는 않겠습니다. 지출이 곧 학업성취도도 아닙니다. 다만 지역에 따른 차이가 여전하다는 점에서 보충학습의 접근 경로를 넓힐 필요가 있습니다.', 'programs': '대학생 멘토링은 이미 여러 지역에 있습니다. 서울동행의 기존 초중고 멘토링은 이천이십오 년에 종료·전환됐으므로 선행 사례로 소개합니다. 현재 서울런은 온라인 콘텐츠와 일대일 학습관리를 결합하고, 부산과 수원도 대학생 학습지원을 운영합니다. 포근동행은 이런 현장 경험을 바탕으로 자료와 수업 이후의 학습·운영 흐름을 공통 플랫폼에서 연결하려 합니다.', 'difference': '포근동행이 제안하는 방향은 전국의 여러 기관이 공통 운영 기반을 함께 쓰는 것입니다. 중앙은 교재와 버전, 기관별 현황을 관리합니다. 지역 기관은 학생과 튜터의 상황을 살펴 매칭을 최종 승인하고 일정과 지원을 결정합니다. 현장 판단과 공통 업무의 책임을 나누면서 수업과 복습, 질문 기록이 이어지도록 합니다. 실제 전국 확장은 기관 협력과 실증이 필요한 구상입니다.', 'learning-program': '한 학기 보충학습 예시는 과목별 주 일 회, 사십 분씩 십팔 주입니다. 수학과 영어 각 십팔 차시, 총 서른여섯 차시와 백팔십 문항을 준비했습니다. 개념·예제·활동과 지도안, 힌트·정답·해설을 함께 제공합니다. 정규수업 전체 시수를 대체하는 자료는 아닙니다. 영어 주제 순서는 학교에 맞춰 조정하고, 듣기는 튜터가 대본을 읽어 주는 방식입니다.', 'roles': '학생과 튜터는 학습의 흐름을 만듭니다. 학생은 복습하고 질문하며 이해 여부를 표시하고, 튜터는 수업하고 답변합니다. 기관은 참여 조건과 자격을 확인해 매칭·일정·지원을 맡습니다. 중앙은 공통 교재와 여러 기관의 현황을 관리합니다. 중앙이 개별 매칭을 다시 승인하는 단계는 없습니다.', 'student': '학생은 배정된 배움방에서 튜터와 시간, 수업 자료를 확인합니다. 수업 뒤에는 같은 자료로 문제를 다시 풀고 힌트와 해설을 볼 수 있습니다. 그래도 막히면 그 문항에서 질문합니다. 튜터에게 자료 버전과 문제 문맥이 함께 전달돼, 학생이 어느 문제였는지 다시 설명할 부담을 줄입니다. 답변을 받은 뒤에는 이해했어요 또는 재질문을 선택합니다. 답변 도착과 이해 확인을 별도로 남깁니다.', 'tutor': '튜터는 활동 정보와 서류를 제출하고 기관 확인을 거칩니다. 첨부만으로 자격이 승인되지는 않습니다. 배정 후에는 공통 학생 자료·지도안·복습 문제로 수업을 준비하고, 출석과 수업 메모를 남긴 뒤 복습을 배정합니다. 질문함에서는 원래 문항과 학생 설명을 함께 보고 답변합니다. 반복해서 막힌 내용은 다음 수업의 보충으로 이어가고, 자료 오류나 개선 의견도 중앙에 전달할 수 있습니다.', 'institution': '기관은 소속 학생과 튜터의 참여·자격·서류를 확인합니다. 자동매칭은 가능한 시간과 과목, 활동 기간 등을 보고 후보를 추천합니다. 추천만으로 클래스가 생기지는 않습니다. 기관이 양측 의사를 확인하고 최종 승인할 때 일정·정원·장소 충돌을 다시 검사합니다. 추천 점수는 성공 확률이나 교육효과를 뜻하지 않습니다. 이후 자료를 수신해 수업에 연결하고 취소·보강·지원 요청을 관리합니다.', 'continuity': '학습 연결에서 중요한 것은 자료의 맥락입니다. 학생이 일점이 버전의 문제를 풀다 질문했다면 튜터도 그 버전의 문항을 봅니다. 이후 일점삼 버전이 나와도 과거 수업과 질문의 원문은 바뀌지 않습니다. 기관은 새 자료를 예정 수업에 연결합니다. 이 구조로 질문의 문맥을 다시 확인하는 부담을 줄이고 다음 수업에 필요한 보충을 이어가려 합니다.', 'close': '포근동행은 지역 기관의 현장 운영과 중앙의 공통 교재·운영 기반을 연결합니다. 새 교재 에이전트도 구성과 점검을 돕고, 최종 내용 판단은 담당자가 맡습니다. 외부 연구에서 가능성을 확인하되 우리의 효과는 현장에서 측정하겠습니다. 기관과 튜터의 준비 부담을 줄이고 학생의 배움이 다음 수업까지 이어지도록 다듬겠습니다. 감사합니다.'}.items():
    by_id[sid]['notes']=note

# The 2026 operations research now anchors the regional proposal and measurement plan.
by_id['programs']['notes']='지역마다 멘토링의 대상과 운영 방식이 다릅니다. 서울런은 이미 플랫폼으로 매칭을 표준화했습니다. 동대문구는 학교와 센터에서 초중고생을 지도하고, 천안은 중고생의 학습과 진로·정서를, 김포는 고등학생 진로진학을 지원합니다. 천안과 김포는 올해 공고상 운영 사례입니다. 포근동행은 공통으로 쓸 교재와 기록을 연결하되 지역별 운영 규칙을 반영하는 방향입니다. 현재 교재를 적용할 범위는 초등 오학년 수학·영어입니다.'
by_id['cover']['notes']='안녕하세요. 지역의 학생과 대학생 튜터를 연결하는 포근동행입니다. 수업 뒤 복습과 질문을 다음 지도까지 이어가고, 기관과 튜터가 반복하는 준비·기록 업무를 줄이려 합니다. 서비스가 필요한 이유와 네 역할의 흐름, 업무별 효율화 가정과 지역 멘토링 기여를 소개하겠습니다.'
by_id['difference']['notes']='지역 기관이 공통 자료와 학습 기록을 함께 활용하는 구조입니다. 중앙은 공통 교재와 버전을 관리하고 기관별 자료 활용·지원 상태를 봅니다. 지역 기관은 학생과 튜터의 상황에 따라 매칭을 최종 승인하고 일정과 지원을 결정합니다. 기존 사업마다 대상과 운영 규칙이 다르므로 현장 판단을 유지하며 공통 업무를 함께 준비합니다. 실제 전국 확장과 기관 간 데이터 연결은 후속 협력과 구현이 필요합니다.'
by_id['pilot'].update(
    title='소규모 현장에서 업무시간과 학습 지속을 검증합니다',
    body='''<p class="pilot-plan">초5 수학·영어 기관 3~5곳 · 서버 연결 후 기준선 2주와 6~8주 파일럿</p><div class="pilot-evaluation"><div><span>업무시간</span><b>준비·검토·배정</b><p>중앙·튜터·기관을 분리<br>수정·중복 입력까지 기록</p></div><div><span>운영 품질</span><b>오류·재작업</b><p>교재 오류와 수정 요청<br>재매칭·일정 충돌 확인</p></div><div><span>학습 지속</span><b>복습·질문 응답</b><p>7일 내 복습 완료율<br>48시간 내 첫 답변율</p></div></div><p class="pilot-boundary">검증 후 18주 확대 운영을 검토합니다. 성취 변화는 별도의 사전·사후 평가로 확인합니다.</p>''',
    notes='초등 오학년 수학·영어 기관 세 곳에서 다섯 곳을 첫 적용 후보로 제안합니다. 실제 운영을 위한 서버와 권한을 연결한 뒤, 이 주간 현재 업무의 기준선을 기록하고 육 주에서 팔 주 동안 비교합니다. 중앙과 튜터, 기관의 준비·검토·배정 시간을 나누어 재고 수정과 중복 입력도 포함합니다. 교재 오류와 재작업이 늘지 않는지 함께 확인합니다. 칠 일 내 복습 완료율과 사십팔 시간 내 첫 답변율도 측정하되 응답률은 현재 보장 수준이 아닙니다. 결과를 보고 십팔 주 확대 운영을 검토하며 학습효과는 별도 평가로 확인하겠습니다.',
    refs='<div class="source">파일럿 제안 · 현장 실측 없음 · 관찰기간을 확보한 배정·질문만 집계 · 성취도·이탈률 개선은 아직 확인하지 않음</div>')
by_id['scope'].update(
    title='현장 공동 운영에는 서버·권한·동기화를 연결해야 합니다',
    body='''<div class="scope-layout"><div><span class="scope-label">지금 체험할 수 있는 것</span><h3>교재 자동 구성·점검<br>매칭·수업·복습·질문</h3><p>수록 자료 기반 · 가상 데이터 · 브라우저 저장</p></div><div><span class="scope-label">현장 파일럿 전 필요한 것</span><h3>기관별 권한·서버 저장<br>사용자 간 동기화·알림</h3><p>참여 동의·서류 관리 · 현장 교과 검수</p></div></div><p class="scope-boundary">기관 간 멘토 공동 배정과 실제 전국 연동은 후속 개발·협의 범위입니다.</p>''',
    notes='현재 프로토타입은 수록 자료 기반 교재 자동 구성과 점검, 기관의 매칭 승인, 수업과 복습·질문의 연결을 체험하는 단계입니다. 외부 생성형 인공지능은 연결하지 않았고 정보는 가상이며 브라우저에 저장됩니다. 실제 현장 파일럿에는 기관별 권한과 서버 저장, 여러 사용자 사이의 동기화, 참여 동의와 서류 관리, 교과 검수와 알림을 먼저 연결해야 합니다. 현재 추천은 같은 기관 안에서 동작하므로 기관 간 멘토 공동 배정과 실제 전국 연동도 후속 범위입니다.')
by_id['close']['notes']='포근동행은 중앙의 공통 교재와 지역 기관의 현장 운영을 연결합니다. 공통 자료로 반복 준비를 줄이고 수업 뒤 복습과 질문을 다음 지도에 활용하려 합니다. 업무시간 절감은 가정과 분모를 구분했고 실제 성과는 소규모 현장에서 품질과 함께 측정하겠습니다. 기관과 튜터가 확보한 시간을 학생별 설명과 관계 형성에 쓸 수 있도록 다듬겠습니다. 감사합니다.'

assert len(slides)==21 and sum(s['seconds'] for s in slides)==900

CSS = '''
.cover-product{height:720px;max-width:100%;object-fit:contain;display:block;margin:0 auto;border-radius:16px;box-shadow:0 15px 35px #1b31561a}.cover-caption{font-size:27px;color:#5b687b;text-align:center;margin-top:23px}

*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#f5f3ee;color:#182740;font-family:system-ui,sans-serif}a{color:inherit;text-underline-offset:5px}h1,h2,h3,p,figure{margin:0}button,a{-webkit-tap-highlight-color:transparent}em{font-style:normal;color:#3158d5}.scene-frame{position:absolute;inset:0;width:100%;height:100%;overflow:hidden;background:#f5f3ee;padding:78px 112px 100px;opacity:0;visibility:hidden;pointer-events:none}.scene-frame:first-of-type{opacity:1;visibility:visible;pointer-events:auto}.chapter{font-size:28px;letter-spacing:.04em;color:#577084;font-weight:700;margin-bottom:27px}.headline{font-size:66px;line-height:1.27;letter-spacing:-.052em;font-weight:760;max-width:1696px;word-break:keep-all}.slide-body{margin-top:66px}.footer{position:absolute;left:112px;right:112px;bottom:33px;display:flex;align-items:flex-end;gap:24px;color:#5b687b;font-size:24px}.footer .brand{margin-left:auto;white-space:nowrap;font-size:25px;font-weight:750;color:#3158d5}.source{font-size:21px;line-height:1.55;max-width:1490px;color:#5b687b}.source a{text-decoration-thickness:1px}.pagenum{font-size:22px;min-width:30px}.wordmark{display:flex;align-items:center;gap:16px;font-size:43px;font-weight:780;letter-spacing:-.045em;color:#3158d5}.brand-symbol{display:grid;place-items:center;width:60px;height:60px;border:3px solid #3158d5;border-radius:20px;font-size:33px}.cover{padding-top:100px}.cover .chapter,.cover .headline{display:none}.cover .slide-body{margin:0}.cover-grid{display:grid;grid-template-columns:1.1fr 1fr;align-items:center;gap:70px}.cover h1{font-size:106px;letter-spacing:-.065em;line-height:1.2;margin-top:55px;font-weight:800}.cover-sub{font-size:38px;line-height:1.65;margin-top:35px;color:#5b687b}.cover-art{position:relative;height:760px}.arc{position:absolute;border:2px solid #c9d2e7;border-radius:50%;left:60px;top:110px;width:600px;height:600px}.arc2{width:440px;height:440px;left:140px;top:190px;border-style:dashed}.art-core{position:absolute;left:168px;top:300px;text-align:center;width:385px;font-size:46px;line-height:1.5;letter-spacing:-.045em}.art-core b{color:#3158d5}.orbit{position:absolute;display:grid;place-items:center;font-size:40px;font-weight:700;width:180px;height:112px;background:#dfe7fb;border-radius:56px;color:#3158d5}.o1{left:90px;top:80px}.o2{right:0;top:270px;background:#e0f0e9;color:#0b7461}.o3{left:20px;top:490px;background:#f2e5d8;color:#89521d}.o4{right:60px;bottom:25px;background:#e6e0f6;color:#7153a9;width:230px}.art-caption{position:absolute;font-size:26px;left:130px;bottom:0;color:#65758d}.statement{padding-top:55px}.statement>p{font-size:43px;color:#5b687b}.big-connection{display:flex;align-items:center;gap:75px;font-size:88px;font-weight:750;letter-spacing:-.055em;margin-top:50px}.big-connection i{font-style:normal;font-size:80px;color:#a0abc0}.blue{color:#3158d5}.under-line{margin-top:48px;font-size:39px;color:#5b687b}.bottom-band{background:#e3eafb;border-radius:16px;padding:30px 40px;color:#294ca5;font-size:40px;font-weight:650;margin-top:80px;letter-spacing:-.025em}.two-metrics{display:grid;grid-template-columns:1fr 1fr;gap:100px;margin-top:95px}.two-metrics>div+div{border-left:2px solid #d6dce6;padding-left:90px}.metric-label{font-size:39px;color:#5b687b;font-weight:600}.metric-pair{display:flex;gap:29px;align-items:baseline;margin-top:32px;font-variant-numeric:tabular-nums;letter-spacing:-.04em}.metric-pair>span{font-size:64px;color:#78869b}.metric-pair i{font-style:normal;color:#96a1b5;font-size:52px}.metric-pair strong{font-size:87px;color:#3158d5}.metric-pair small{font-size:32px;font-weight:550;margin-left:7px}.delta{font-size:46px;color:#3158d5;margin-top:20px;font-weight:700}.chart-years{font-size:28px;color:#65758d;margin-top:38px}.takeaway{border-top:2px solid #d8dde7;padding-top:32px;margin-top:45px;font-size:42px;letter-spacing:-.025em;font-weight:630}.expense-layout{display:grid;grid-template-columns:1.5fr 1fr;gap:90px;align-items:center;margin-top:85px}.huge{font-size:185px;letter-spacing:-.06em;font-weight:780;line-height:1.35;color:#3158d5}.huge span{font-size:50px;margin-left:20px}.expense-previous{font-size:34px;color:#5b687b}.expense-side{border-left:2px solid #d6dce6;padding-left:90px}.expense-side>strong{font-size:113px;color:#0b7461;letter-spacing:-.045em}.expense-side small{font-size:55px}.expense-side p{font-size:39px;line-height:1.55;margin-top:20px}.clarification{margin-top:66px;border-top:2px solid #d6dce6;padding-top:28px;font-size:32px;display:flex;gap:35px}.clarification span{color:#5b687b}.region-layout{display:grid;grid-template-columns:1.6fr 1fr;gap:90px;align-items:center;margin-top:35px}.bar-unit{font-size:30px;color:#5b687b;margin-bottom:37px}.bar-row{display:grid;grid-template-columns:180px 1fr;align-items:center;gap:20px;margin-bottom:25px}.bar-row>b{font-size:34px}.bar-track{height:64px;border-left:2px solid #b8c5d9;background:repeating-linear-gradient(90deg,transparent 0,transparent calc(33.333% - 1px),#d9dfe9 calc(33.333% - 1px),#d9dfe9 33.333%)}.bar{height:64px;background:#bdcbe4;color:#213755;display:flex;align-items:center;justify-content:flex-end;padding-right:22px;font-size:36px;font-weight:700;border-radius:0 5px 5px 0}.bluebar{background:#3158d5;color:#fff}.mintbar{background:#0b7461;color:#fff}.axis{margin-left:200px;display:flex;justify-content:space-between;font-size:25px;color:#65758d}.region-callout{border-left:2px solid #d6dce6;padding-left:65px}.region-callout>span{font-size:34px;color:#5b687b}.region-callout strong{display:block;font-size:115px;letter-spacing:-.06em;color:#3158d5;white-space:nowrap}.region-callout small{font-size:38px;margin-left:10px}.region-callout p{font-size:31px;line-height:1.7;margin-top:20px;color:#5b687b}.small-takeaway{font-size:36px;margin-top:50px}.program-table{margin-top:-10px;border-top:2px solid #b7c4d9}.program-row{display:grid;grid-template-columns:470px 1fr 470px;align-items:center;gap:24px;min-height:136px;border-bottom:1px solid #cfd7e3}.program-row>b{font-size:40px;color:#234baa;letter-spacing:-.04em}.program-row small{display:block;font-size:23px;color:#5b687b;font-weight:500;margin-top:6px}.program-row p,.program-row>span{font-size:36px;line-height:1.5;letter-spacing:-.035em}.program-row>span{color:#5b687b}.nodes{display:grid;grid-template-columns:repeat(3,1fr);gap:70px;margin-top:110px}.node{border-top:3px solid #3158d5;padding-top:30px}.node-num{font-size:30px;color:#3158d5;display:block;margin-bottom:37px}.node>b{font-size:46px;letter-spacing:-.035em}.node p{font-size:40px;line-height:1.7;color:#5b687b;margin-top:35px;letter-spacing:-.03em}.plain-note{font-size:32px;margin-top:65px;color:#5b687b;line-height:1.6}.semester-grid{display:grid;grid-template-columns:.7fr 1.6fr;gap:100px;margin-top:90px}.semester-title>strong{font-size:188px;letter-spacing:-.06em;color:#3158d5;line-height:1.2}.semester-title>strong span{font-size:58px}.semester-title p{font-size:34px;color:#5b687b;line-height:1.8;margin-top:28px}.semester-content>div{padding-bottom:30px;margin-bottom:26px;border-bottom:1px solid #cfd7e3}.semester-content b{font-size:42px}.semester-content p{font-size:33px;color:#5b687b;margin-top:18px;line-height:1.5}.semester-content .total-questions{border-bottom:0;display:grid;gap:15px;color:#3158d5}.total-questions span{font-size:31px;color:#5b687b}.role-map{display:grid;gap:48px;margin-top:75px}.role-map-row{display:grid;grid-template-columns:230px 1fr 100px 1fr;align-items:center;gap:20px}.role-map-label{font-size:29px;color:#5b687b}.role-map-cell{padding:28px 0;border-top:3px solid #3158d5}.role-map-cell b{font-size:49px;color:#3158d5}.role-map-cell p{font-size:40px;margin-top:19px;color:#5b687b}.between-arrow{font-size:55px;color:#8c9ab2}.role-map+.bottom-band{margin-top:58px}.screen-layout{display:grid;grid-template-columns:560px 1fr;gap:60px;align-items:start;margin-top:2px}.steps{list-style:none;padding:0;margin:0;counter-reset:step}.steps li{counter-increment:step;position:relative;padding-left:62px;margin-bottom:31px}.steps li:before{content:counter(step);position:absolute;left:0;top:1px;width:39px;height:39px;border:2px solid #94a7d0;border-radius:50%;display:grid;place-items:center;color:#3158d5;font-size:24px;font-weight:700}.steps b{font-size:42px;line-height:1.35;display:block;letter-spacing:-.025em}.steps span{font-size:28px;line-height:1.55;color:#5b687b;display:block;margin-top:10px;word-break:keep-all}.screen-layout figure{min-width:0}.capture{display:block;width:100%;height:620px;object-fit:contain;object-position:top;background:#fff;border:1px solid #c9d3e4;border-radius:10px;box-shadow:0 16px 40px #152c4c12}.screen-layout figcaption{font-size:24px;color:#5b687b;margin-top:17px}.version-flow{margin-top:70px}.version-heading{display:flex;align-items:center;gap:45px;font-size:38px}.version-heading span{background:#e4eafb;padding:13px 25px;border-radius:8px;color:#3158d5}.version-heading b{font-size:39px}.version-stages{display:flex;align-items:center;justify-content:space-between;margin-top:65px}.version-stages>div{border-top:3px solid #3158d5;padding-top:27px;flex:1}.version-stages>i{font-size:50px;font-style:normal;color:#91a0b9;margin:0 25px}.version-stages span{font-size:48px;font-weight:700}.version-stages p{font-size:30px;color:#5b687b;margin-top:25px;white-space:nowrap}.version-next{margin-top:55px;padding:25px 32px;border:1px dashed #91a3c5;display:flex;gap:55px;font-size:32px}.version-next b{color:#3158d5}.version-next span{color:#5b687b}.version-flow+.takeaway{font-size:37px;margin-top:45px}.demo-layout{display:grid;grid-template-columns:1.15fr 1fr;gap:90px;margin-top:25px}.demo-time{font-size:28px;color:#5b687b;margin-bottom:30px}.demo-rail{border-left:3px solid #9aafd5;padding-left:42px}.demo-rail>div{display:flex;gap:40px;align-items:center}.demo-rail b{font-size:43px;color:#3158d5;width:115px}.demo-rail p{font-size:40px}.demo-rail>span{display:block;font-size:38px;color:#93a3bd;padding:15px 0 15px 160px}.qr-area{text-align:center}.qr-area a{display:flex;flex-direction:column;align-items:center;gap:19px;text-decoration:none}.qr-area img{width:305px;height:305px;background:#fff;border-radius:8px}.qr-area b{font-size:36px;color:#3158d5}.qr-area p{font-size:29px;margin-top:25px}.qr-area small{display:block;font-size:26px;color:#5b687b;line-height:1.65;margin-top:18px}.scope-layout{display:grid;grid-template-columns:1fr 1fr;gap:100px;margin-top:120px}.scope-layout>div{border-top:3px solid #3158d5;padding-top:32px}.scope-layout>div+div{border-top-color:#8aa89c}.scope-label{font-size:29px;color:#5b687b}.scope-layout h3{font-size:55px;letter-spacing:-.045em;line-height:1.5;margin-top:35px}.scope-layout p{font-size:33px;color:#5b687b;margin-top:35px}.closing-slide{background:#e9eefb}.closing-slide>.chapter,.closing-slide>.headline{display:none}.closing-slide .slide-body{margin-top:70px}.closing{display:grid;grid-template-columns:1fr 340px;gap:80px;align-items:center}.closing h1{font-size:103px;line-height:1.35;letter-spacing:-.06em;margin-top:75px}.closing p{font-size:31px;color:#5b687b;margin-top:50px}.closing strong{display:block;margin-top:65px;font-size:39px}.closing-qr{text-decoration:none;display:grid;gap:30px;text-align:center;font-size:31px;color:#3158d5;margin-top:155px}.closing-qr img{width:310px;height:310px}.refs .headline{font-size:64px}.ref-list{display:grid;gap:25px;margin-top:50px}.ref-item{font-size:31px;line-height:1.55}.ref-item small{display:block;font-size:24px;color:#5b687b;margin-top:4px}.refs .slide-body{margin-top:15px}
'''

CSS += '''
.platform-diagram{display:grid;grid-template-columns:325px 85px 500px 85px 1fr;align-items:center;gap:22px;margin-top:78px}
.diagram-label{display:block;font-size:29px;color:#5b687b;margin-bottom:26px}
.platform-regions>div{padding:20px 0;border-bottom:1px solid #bdcbe1;font-size:40px;font-weight:650}
.platform-arrow{font-size:54px;color:#8c9cba;text-align:center}
.platform-core{padding:37px 34px;background:#e3eafb;border-top:4px solid #3158d5;border-bottom:4px solid #3158d5;text-align:center}
.platform-core .diagram-label{margin-bottom:23px;color:#4b6396}
.platform-core b{font-size:60px;line-height:1.4;letter-spacing:-.045em;color:#3158d5}
.platform-core p{font-size:35px;margin-top:29px;letter-spacing:-.03em}
.platform-duties>div{padding:24px 0;border-top:2px solid #aabbd9}
.platform-duties>div+div{margin-top:24px}
.platform-duties b{font-size:38px;letter-spacing:-.035em}
.platform-duties p{font-size:33px;line-height:1.5;color:#5b687b;margin-top:17px;letter-spacing:-.04em}
.platform-takeaway{font-size:37px;line-height:1.6;margin-top:53px;letter-spacing:-.035em;font-weight:600}
'''


CSS += '''
.agent-options{margin-top:40px;border-top:2px solid #c5d0e4;padding-top:23px;display:grid;gap:14px;color:#3158d5}.agent-options b{font-size:41px}.agent-options span{font-size:35px;color:#5b687b}
.research-results{display:grid;grid-template-columns:1fr 1fr;gap:90px;margin-top:55px}.research-results>div+div{border-left:2px solid #ccd6e5;padding-left:80px}.research-results .metric-label{font-size:35px;letter-spacing:-.035em}.research-results strong{display:block;font-size:156px;letter-spacing:-.06em;line-height:1.45;color:#3158d5}.research-results>div+div strong{color:#0b7461}.research-results strong small{font-size:45px;font-weight:650;margin-left:12px;letter-spacing:-.035em}.research-results p{font-size:34px;line-height:1.65;color:#5b687b;letter-spacing:-.02em}.evidence-boundary{margin-top:60px;padding-top:28px;border-top:2px solid #cfd7e3;font-size:35px;line-height:1.65;letter-spacing:-.025em}.evidence-boundary>b{display:block;color:#3158d5;margin-bottom:8px}.evidence-boundary>span{color:#5b687b}
.scenario-label{font-size:31px;font-weight:650;color:#8a571d;background:#f0e7d8;display:inline-block;padding:13px 22px;border-radius:6px}.efficiency-results{display:grid;grid-template-columns:1fr 1fr;gap:75px;margin-top:38px}.efficiency-results>div+div{border-left:2px solid #ccd6e5;padding-left:70px}.efficiency-results .metric-label{font-size:34px}.scenario-count{display:flex;align-items:baseline;gap:22px;margin:15px 0;font-variant-numeric:tabular-nums}.scenario-count>span{font-size:97px;color:#7a889e;letter-spacing:-.05em}.scenario-count>i{font-size:53px;color:#95a6c1;font-style:normal}.scenario-count>b{font-size:128px;color:#3158d5;letter-spacing:-.06em;white-space:nowrap}.scenario-count small{font-size:34px;margin-left:10px;letter-spacing:-.02em}.efficiency-results p{font-size:33px;line-height:1.65;letter-spacing:-.03em;color:#5b687b}.efficiency-results p b{color:#3158d5}.scenario-detail{margin-top:24px;font-size:29px;line-height:1.7;color:#5b687b;letter-spacing:-.025em}.scenario-detail>b{color:#0b7461;font-size:35px}.scenario-formula{margin-top:38px;border-top:2px solid #cfd7e3;padding-top:24px;font-size:30px;line-height:1.8;color:#5b687b;letter-spacing:-.025em}
.pilot-evaluation{display:grid;grid-template-columns:repeat(3,1fr);gap:65px;margin-top:95px}.pilot-evaluation>div{padding-top:26px;border-top:3px solid #3158d5}.pilot-evaluation span{display:block;font-size:31px;color:#5b687b;margin-bottom:30px}.pilot-evaluation b{display:block;font-size:47px;letter-spacing:-.04em;color:#3158d5}.pilot-evaluation p{font-size:35px;line-height:1.75;letter-spacing:-.03em;margin-top:28px;color:#5b687b}.pilot-evaluation+.evidence-boundary{margin-top:70px}
'''



CSS += '''
.programs-slide .program-row{min-height:126px;grid-template-columns:465px 1fr 450px}.programs-slide .program-row p,.programs-slide .program-row>span{font-size:35px}.regional-program-note{font-size:36px;line-height:1.55;margin-top:32px;color:#3158d5;font-weight:620;letter-spacing:-.035em}
.efficiency-slide .slide-body,.regional-benefits-slide .slide-body{margin-top:48px}.assumption-line{font-size:36px;line-height:1.5;color:#82531b;margin-bottom:26px;font-weight:650;letter-spacing:-.025em}.work-efficiency{width:100%;border-collapse:collapse;table-layout:fixed}.work-efficiency th,.work-efficiency td{text-align:left;border-bottom:1px solid #c8d2e1;padding:21px 22px 21px 0;vertical-align:middle;letter-spacing:-.03em}.work-efficiency thead th{font-size:29px;color:#5b687b;font-weight:600;border-top:2px solid #a9b9d3;padding-top:15px;padding-bottom:15px}.work-efficiency thead th:first-child{width:34%}.work-efficiency thead th:nth-child(2){width:39%}.work-efficiency tbody th{font-size:38px;line-height:1.4;font-weight:680}.work-efficiency small{font-size:27px;color:#5b687b;display:block;margin-top:8px;font-weight:500}.work-efficiency td b{font-size:42px;color:#3158d5;font-weight:750;display:block}.work-efficiency td strong{font-size:53px;color:#0b7461;display:block;line-height:1.15}.work-efficiency td span{display:block;font-size:28px;color:#5b687b;margin-top:11px;line-height:1.5}.efficiency-boundary{font-size:34px;line-height:1.6;color:#3158d5;letter-spacing:-.035em;margin-top:30px;font-weight:600}
.regional-benefits{margin-top:0;border-top:2px solid #a9b9d3}.regional-benefits>div{display:grid;grid-template-columns:345px 500px 1fr;gap:30px;align-items:center;padding:28px 0;border-bottom:1px solid #c8d2e1}.regional-benefits span{font-size:35px;color:#5b687b;letter-spacing:-.03em}.regional-benefits b{font-size:40px;color:#3158d5;letter-spacing:-.04em}.regional-benefits p{font-size:32px;color:#5b687b;line-height:1.65;letter-spacing:-.025em}.regional-start{display:flex;gap:45px;align-items:baseline;margin-top:36px;padding-top:25px;border-top:3px solid #3158d5}.regional-start>b{font-size:36px;color:#3158d5;white-space:nowrap}.regional-start>span{font-size:35px;line-height:1.7;color:#182740;letter-spacing:-.03em}
.pilot-plan{font-size:35px;color:#5b687b;line-height:1.6;letter-spacing:-.025em}.pilot-plan+.pilot-evaluation{margin-top:45px}.pilot-plan+.pilot-evaluation b{font-size:44px}.pilot-boundary,.scope-boundary{font-size:33px;line-height:1.6;color:#3158d5;letter-spacing:-.03em;border-top:2px solid #c8d2e1;margin-top:45px;padding-top:25px}.scope-boundary{font-size:32px;margin-top:50px}.scope-layout:has(+.scope-boundary){margin-top:90px}.scope-layout:has(+.scope-boundary) h3{font-size:51px}
.scope-math{display:grid;grid-template-columns:1fr 1fr;gap:65px;margin-top:45px}.scope-math>div{border-top:3px solid #3158d5;padding-top:25px}.scope-math>div+div{border-top-color:#0b7461}.scope-math span{font-size:35px;color:#5b687b;display:block}.scope-math strong{display:block;font-size:109px;color:#3158d5;line-height:1.5;letter-spacing:-.06em}.scope-math>div+div strong{color:#0b7461}.scope-math p{font-size:33px;color:#5b687b;line-height:1.7;letter-spacing:-.025em}.appendix-warning{margin-top:45px;padding-top:25px;border-top:2px solid #c8d2e1;font-size:35px;color:#3158d5;line-height:1.65;letter-spacing:-.025em}
.appendix-table{width:100%;border-collapse:collapse;table-layout:fixed;margin-top:28px}.appendix-table th,.appendix-table td{padding:23px 16px 23px 0;border-bottom:1px solid #c8d2e1;text-align:left;font-size:32px;line-height:1.5;letter-spacing:-.025em}.appendix-table th{font-size:29px;color:#5b687b}.appendix-table td:first-child{font-weight:650;color:#3158d5}.appendix-table th:first-child{width:25%}.appendix-table th:nth-child(2){width:43%}.appendix-table+p{font-size:32px;line-height:1.7;margin-top:30px;color:#5b687b}.refs .research-results{margin-top:40px}.refs .research-results strong{font-size:140px}.refs .research-results+.evidence-boundary{margin-top:30px}
'''

def render_slide(s, number, start, duration=None):
    d = s['seconds'] if duration is None else duration
    return f'''<section id="scene-{s['id']}" class="scene-frame {s['cls']}" data-composition-id="{s['id']}" data-label="{esc(s['title'])}" data-start="{start}" data-duration="{d}" data-width="1920" data-height="1080"><div class="chapter">{s['chapter']}</div><h2 class="headline">{s['title']}</h2><div class="slide-body">{s['body']}</div><footer class="footer"><div>{s['refs']}</div><span class="brand">포근동행</span><span class="pagenum">{number}</span></footer></section>'''

refs = []
for sid, title, keys, notes in [
    ('sources-data','통계의 비교 기준과 출처입니다',['stats','moe','table'], '참여학생 평균과 전체학생 평균을 구분합니다. 서울–읍면지역의 절대 차이는 소폭 커졌지만 비율은 축소됐습니다. 지출액 자체가 성취도나 튜터링 효과를 증명하지 않습니다.'),
    ('sources-programs','지역 사례는 공식 공지에서 확인한 범위로 비교했습니다',['learn','ddm','cheonan','gimpo'], '서울런은 이미 매칭을 표준화했습니다. 천안·김포는 공고상 2026년 운영 사례이며 현재 모집 안내가 아닙니다. 공개 공지에 없는 기능의 부재를 단정하지 않았습니다. 초5 수학·영어 이외의 적용에는 콘텐츠·운영 규칙 확장이 필요합니다.')]:
    entries=''.join(f'<div class="ref-item"><a href="{SOURCES[k][1]}" target="_blank" rel="noopener">{SOURCES[k][0]} ↗</a></div>' for k in keys)
    refs.append(dict(id=sid,chapter='부록 · 출처',title=title,seconds=10,body=f'<div class="ref-list">{entries}</div><div class="plain-note">{notes}</div>',notes=notes,cls='refs',refs='<div class="source">자료 확인일 2026.11.03 · 외부 공개자료는 사업 구조의 근거이며 업무시간 절감 수치의 출처가 아님</div>'))

refs.insert(1,dict(id='efficiency-scope',chapter='부록 · 계산의 분모',title='중앙과 기관을 함께 보면 같은 9시간은 5.8%입니다',seconds=10,
    body='''<p class="assumption-line">조건부 계산 예시 · 중앙·기관의 사람 작업시간 가정</p><div class="scope-math"><div><span>중앙 구성·검토만 비교</span><strong>25%</strong><p>36시간에서 27시간<br>36꾸러미 × (구성 30분 + 검토 30분)<br>구성만 15분으로 단축</p></div><div><span>기관 10곳의 현장 적용까지 포함</span><strong>5.8%</strong><p>156시간에서 147시간<br>기관 적용은 전후 120시간 유지<br>10곳 × 36꾸러미 × 20분 ÷ 60</p></div></div><p class="appendix-warning">절약한 시간은 모두 9시간입니다. 실제 수업·개발·유지관리 등 전체 비용은 제외했습니다.</p>''',
    notes='중앙 구성·검토는 삼십육 시간에서 이십칠 시간으로 아홉 시간, 이십오 퍼센트 줄어드는 가정입니다. 기관 열 곳이 각 꾸러미 적용에 이십 분씩 쓰면 기관 업무는 백이십 시간입니다. 이를 포함하면 백오십육 시간에서 백사십칠 시간으로 줄어 같은 아홉 시간이 약 오 점 팔 퍼센트가 됩니다. 전체 운영시간 이십오 퍼센트 절감으로 표현하지 않습니다. 이 분모에도 실제 수업, 개발과 유지관리 등은 빠져 있습니다.',cls='refs',refs='<div class="source">자체 시나리오 · 사람 검토 30분과 기관 적용 20분은 전후 동일 · 총비용 절감률 아님</div>'))
refs.insert(2,dict(id='efficiency-detail',chapter='부록 · 추가 계산',title='중복 제작 건수와 사람의 업무시간은 구분합니다',seconds=10,
    body='''<p class="assumption-line">조건부 계산 예시 · 기존 운영 방식에 따라 절감이 없을 수도 있습니다.</p><table class="appendix-table"><thead><tr><th>비교 업무</th><th>가정과 계산</th><th>해당 범위의 차이</th></tr></thead><tbody><tr><td>공통 원고 제작</td><td>10기관 × 동일 36차시<br>기관별 독립 제작에서 중앙 공유로</td><td>360건에서 36건<br>제작 건수 90% 감소</td></tr><tr><td>최초 배정 검토</td><td>학생–과목 배정 20건<br>건당 30분에서 20분</td><td>3시간 20분<br>해당 업무 약 33%</td></tr><tr><td>질문 문맥 확인</td><td>질문 180건 × 건당 2분 절약<br>자료·문항을 다시 찾는 시간</td><td>6시간<br>답변 작성시간 제외</td></tr></tbody></table><p>이미 공유 교재·단일 기록 시스템을 쓰는 현장에서는 출발 가정이 달라집니다.<br>제작 건수 감소를 전체 업무시간·인건비 감소율로 환산하지 않습니다.</p>''',
    notes='공통 원고 구십 퍼센트 감소는 열 기관이 동일한 서른여섯 차시를 각각 새로 만드는 상황의 건수 비교입니다. 이미 공유 교재를 쓰는 곳에는 해당하지 않을 수 있습니다. 최초 배정 스무 건에서 건당 십 분을 줄이면 세 시간 이십 분입니다. 질문 백팔십 건에서 문맥 확인을 이 분 줄이면 육 시간이며 실제 답변 시간은 제외했습니다. 모두 가정이며 공식 양식 자동 작성이나 기관 간 공동 매칭을 구현했다는 뜻은 아닙니다.',cls='refs',refs='<div class="source">자체 시나리오 · 질문 180건은 콘텐츠 180문항과 별도의 발생량 가정 · 서로 다른 분모의 비율은 합산하지 않음</div>'))
refs.append(dict(id='sources-evidence',chapter='부록 · 외부 학습 연구',title='외부 튜터링 연구와 포근동행의 효과는 구분합니다',seconds=10,
    body='''<div class="research-results"><div><span class="metric-label">튜터링 실험연구 메타분석</span><strong>0.29<small>표준편차</small></strong><p>비교집단 대비 평균 학습효과<br>Nickow 외, AERJ 2024 · 원값 0.288</p></div><div><span class="metric-label">2~5명 소그룹 튜터링</span><strong>+4<small>개월</small></strong><p>연간 추가 학습 진전으로 환산<br>EEF Toolkit · 62개 연구 종합</p></div></div><div class="evidence-boundary"><b>포근동행의 실측 성과나 보장치가 아닙니다.</b><span>현재 구상은 과목별 주 1회 40분입니다.<br>연구와 운영 강도가 달라 학습효과는 별도 실증이 필요합니다.</span></div>''',
    notes='외부 연구는 구조화된 튜터링을 설계하는 근거입니다. 영 점 이팔팔 표준편차를 이십팔 점 팔 퍼센트 향상으로 해석하지 않습니다. EEF의 추가 사 개월은 학습 진전 환산값이며 포근동행의 효과나 학습시간 단축 보장치가 아닙니다. 운영 빈도와 튜터 역량 등이 달라 별도 현장 평가가 필요합니다. 출처: https://journals.sagepub.com/doi/10.3102/00028312231208687 및 https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit/small-group-tuition',cls='refs',refs=source('tutoring','eef',extra='외부 연구의 평균 · 0.288은 28.8%를 뜻하지 않음')))


manifest={'slides':[], 'slideSequences':[{'id':'references','label':'출처·계산 근거','slides':[]}]}
scene_html=[]
start=0
for i,s in enumerate(slides):
    if s['refs']:
        s['notes'] += '\n\n[근거·범위] ' + re.sub('<[^>]+>', ' ', s['refs']).strip()
        for key, (label, url) in SOURCES.items():
            if url in s['refs']:
                s['notes'] += '\n' + label + ': ' + url
    s['start']=start
    ref={'sceneId':s['id'],'startTime':start,'endTime':start+s['seconds'],'notes':f"[{start//60:02d}:{start%60:02d}–{(start+s['seconds'])//60:02d}:{(start+s['seconds'])%60:02d} / {s['seconds']}초]\n\n"+s['notes']}
    if s['id']=='close':
        ref['hotspots']=[{'id':'references-link','label':'출처·계산 근거','target':'references','region':{'x':5.8,'y':89,'w':23,'h':5.4}}]
    manifest['slides'].append(ref)
    scene_html.append(render_slide(s,f'{i+1:02d}',start))
    start+=s['seconds']
for i,s in enumerate(refs):
    s['start']=start
    manifest['slideSequences'][0]['slides'].append({'sceneId':s['id'],'startTime':start,'endTime':start+s['seconds'],'notes':s['notes']})
    scene_html.append(render_slide(s,f'R{i+1}',start))
    start+=s['seconds']

all_scenes=[dict(id=s['id'],start=s['start'],end=s['start']+s['seconds']) for s in slides+refs]
island=json.dumps(manifest,ensure_ascii=False).replace('</','<\\/')
gsap=GSAP.read_text()
timeline_js=f'''
window.__timelines=window.__timelines||{{}};
const root=gsap.timeline({{paused:true}});root.to({{}},{{duration:{start}}});window.__timelines.root=root;
const scenes={json.dumps(all_scenes)};
function updateVisibility(t){{for(const s of scenes){{const el=document.getElementById('scene-'+s.id);const active=t>=s.start&&t<s.end;el.style.opacity=active?'1':'0';el.style.visibility=active?'visible':'hidden';el.style.pointerEvents=active?'auto':'none';}}}}
root.eventCallback('onUpdate',()=>updateVisibility(root.time()));window.__hfSetTime=updateVisibility;updateVisibility(0);
'''
composition=f'''<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>포근동행 · 15분 발표 본문</title><style>{CSS}</style><script>{gsap}</script></head><body><script type="application/hyperframes-slideshow+json">{island}</script>{''.join(scene_html)}<script>{timeline_js}</script></body></html>'''
(ROOT/'composition'/'index.html').write_text(composition)

player=(VENDOR/'hyperframes-player.global.js').read_text()
# Reusable standalone harness: srcdoc already contains its seekable GSAP timeline.
# The upstream player unconditionally injects a CDN runtime into srcdoc. Skip that
# injection only for this explicit standalone flag; keep shared navigation/notes.
upstream_srcdoc='function U(r,e){return Je(Yt(e,le(r.getAttribute(w)),D(r)),Xt(r))}'
standalone_srcdoc='function U(r,e){return r.hasAttribute("data-standalone-harness")?Yt(e,le(r.getAttribute(w)),D(r)):Je(Yt(e,le(r.getAttribute(w)),D(r)),Xt(r))}'
assert player.count(upstream_srcdoc)==1, 'Review standalone player adapter after vendor upgrade'
player=player.replace(upstream_srcdoc,standalone_srcdoc).replace('</script','<\\/script')
slideshow=(VENDOR/'hyperframes-slideshow.global.js').read_text().replace('</script', '<\\/script')
embedded=json.dumps(composition,ensure_ascii=False).replace('</','<\\/')
wrapper=f'''<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>포근동행 · 15분 서비스 소개</title><style>*{{box-sizing:border-box}}html,body{{margin:0;width:100%;height:100%;overflow:hidden;background:#f5f3ee;font-family:system-ui,sans-serif}}hyperframes-slideshow{{display:block;position:relative;width:100vw;height:100vh}}hyperframes-player{{position:absolute;inset:0}}.fallback{{position:fixed;inset:0;display:grid;place-items:center;background:#f5f3ee;z-index:-1}}</style><script>{player}</script><script>{slideshow}</script></head><body><div class="fallback">포근동행 발표자료를 준비하고 있습니다.</div><hyperframes-slideshow tabindex="0" notes-storage-key="pogeun-15min-20261103-v3-operations"><hyperframes-player interactive width="1920" height="1080"></hyperframes-player><script type="application/hyperframes-slideshow+json">{island}</script></hyperframes-slideshow><script type="application/json" id="composition-data">{embedded}</script><script>const player=document.querySelector('hyperframes-player');player.setAttribute('srcdoc',JSON.parse(document.getElementById('composition-data').textContent));document.querySelector('hyperframes-slideshow').focus();</script></body></html>'''
wrapper=wrapper.replace('<hyperframes-player interactive ', '<hyperframes-player data-standalone-harness interactive ')
(ROOT/'포근동행-15분-발표.html').write_text(wrapper)
(ROOT/'index.html').write_text(wrapper)
(ROOT/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
script=['# 포근동행 · 15분 발표 대본','', '본편 21장 · 총 15:00. 16번은 60초 연결 시연을 포함합니다. 참고 부록 5장은 질의응답용이며 본편 시간에 포함하지 않습니다.','']
for i,s in enumerate(slides):
    t=s['start'];e=t+s['seconds']
    script += [f"## {i+1:02d}. {s['title']}",'',f"{t//60:02d}:{t%60:02d}–{e//60:02d}:{e%60:02d} · {s['seconds']}초",'',s['notes'],'']
(ROOT/'발표대본.md').write_text('\n'.join(script))
print(json.dumps({'main_slides':len(slides),'main_duration_seconds':900,'appendix_slides':len(refs),'html_bytes':len(wrapper.encode())},ensure_ascii=False))
