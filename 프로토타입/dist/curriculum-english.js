(function(root){
'use strict';
// 독창적으로 작성한 18주 보충학습 자료. 학교·교과서에 맞게 순서를 조정합니다.
// 2022 개정 5~6학년군: 이해(01)·표현(02), 충북교육청 각론 원문 p.137 대조.
const standardsBySession={
1:['6영01-04','6영02-04','6영02-07'],2:['6영01-04','6영02-04','6영02-07'],
3:['6영01-04','6영02-06','6영02-07'],4:['6영01-04','6영02-07'],
5:['6영01-04','6영02-07'],6:['6영01-04','6영02-07'],
7:['6영01-04','6영02-07','6영02-10'],8:['6영01-04','6영02-07','6영02-10'],
9:['6영01-04','6영02-04','6영02-07'],10:['6영01-04','6영02-07'],
11:['6영01-04','6영02-05','6영02-07'],12:['6영01-04','6영02-05','6영02-07'],
13:['6영01-04','6영02-07','6영02-10'],14:['6영01-04','6영02-06','6영02-07'],
15:['6영01-04','6영02-06','6영02-07'],16:['6영01-04','6영02-06','6영02-07'],
17:['6영01-04','6영02-07'],18:['6영01-04','6영02-05','6영02-07','6영02-08']
};
const criterionBySession={
1:'친숙한 주제의 세부 정보를 이해하고 사람을 소개하며 이름·출신 정보를 묻고 답하기',
2:'친구 소개 글의 세부 정보를 이해하고 사람의 관심사를 소개하며 묻고 답하기',
3:'친숙한 교과 정보를 이해하고 자신의 선호를 표현하며 묻고 답하기',
7:'교실의 허락 표현을 이해하고 정보를 묻고 답하며 예절을 지켜 소통하기',
8:'도움 요청의 세부 정보를 이해하고 필요한 정보를 묻고 답하며 협력적으로 소통하기',
9:'옷차림 설명의 세부 정보를 이해하고 사람을 소개·묘사하며 묻고 답하기',
13:'생활 대화의 세부 정보를 이해하고 원하는 음식을 묻고 답하며 예절을 지켜 소통하기',
14:'음식 선호의 세부 정보를 이해하고 자신의 의견을 표현하며 묻고 답하기',
15:'주말 활동의 세부 정보를 이해하고 자신의 계획을 표현하며 묻고 답하기',
16:'초대 대화의 세부 정보를 이해하고 함께할 활동 계획을 표현하며 묻고 답하기'
};
function lesson(n, data){const id='pg5-s1-e'+String(n).padStart(2,'0');return {id,program:id,version:'1.0',key:'english',subject:'영어',grade:5,semester:1,week:n,session:n,duration:40,standards:standardsBySession[n],criterion:criterionBySession[n]||'일상생활의 담화·글에서 세부 정보를 이해하고 필요한 정보를 묻고 답하기',...data,questions:data.questions.map((q,i)=>({id:id+'-q'+(i+1),text:q[0],options:q[1],answer:q[2],hint:q[3],feedback:q[4]}))};}
const materials=[
lesson(1,{
unit:'친구와 첫인사',title:'이름과 출신 나라를 물어봐요',
goal:'친구의 이름과 출신 나라를 묻고 내 정보를 짧게 답할 수 있어요.',
explanation:'처음 만난 친구에게 What is your name?으로 이름을 물어요. My name is Mina.는 내 이름이 미나라는 뜻이에요. Where are you from?은 출신 나라를 묻는 말이고, I am from Korea.처럼 from 뒤에 나라 이름을 넣어 답해요. 이름과 나라는 서로 다른 정보이므로 질문을 끝까지 듣고 답해요.',
guide:'도입 5분: 한국어로 첫인사 상황을 떠올립니다. 이해 12분: 예제 대본을 튜터가 자연스러운 속도로 두 번 읽습니다. 첫 번째에는 글을 가리고 이름과 나라를 듣고, 두 번째에는 글과 뜻을 확인합니다. 연습 15분: 이름·나라 카드로 짝 대화를 하고 다섯 문항을 풉니다. 정리 8분: 카드 없이 질문 두 개와 응답을 말합니다. 학생이 나라를 말하기 어려워하면 Korea/Canada 두 낱말 카드를 보여 주고 문장 틀 I am from ___.을 제공합니다.',
workedExample:{prompt:'새 친구 Alex와 Mina가 처음 인사해요.',steps:['Alex: Hello! What is your name?','Mina: My name is Mina. What is your name?','Alex: My name is Alex. Where are you from?','Mina: I am from Korea.','Alex: I am from Canada. Nice to meet you.'],answer:'Mina는 한국에서, Alex는 캐나다에서 왔어요. 이름과 출신 나라를 나누어 확인해요.'},
activity:{title:'새 친구 이름표 만들기',materials:'빈 이름표 종이, 연필, Korea·Canada·Australia 낱말 카드',steps:['내 이름과 내가 소개하고 싶은 나라를 이름표에 써요. 실제 정보 대신 역할 이름을 사용해도 돼요.','튜터가 예제 대본을 읽을 때 Mina와 Alex의 이름·나라를 각각 적어요.','짝에게 What is your name?과 Where are you from?을 묻고 들은 정보를 이름표 뒷면에 적어요.','이름표를 서로 확인한 뒤 역할을 바꾸어 다시 인사해요.']},
extension:'인형이나 이야기 속 인물의 이름표를 만들고 이름·나라를 묻고 답하는 두 줄 대화를 써 보세요.',selfCheck:['이름을 묻는 질문과 나라를 묻는 질문을 구별할 수 있어요.','I am from ___.에 나라 이름을 넣어 말할 수 있어요.'],
questions:[
['What is your name?은 무엇을 묻는 말일까요?',['이름','출신 나라','좋아하는 음식'],0,'name의 뜻을 떠올려 보세요.','name은 이름이에요. What is your name?은 이름을 묻는 말이에요.'],
['Where are you from?에 출신 나라를 답한 문장은?',['My name is Jina.','I am from Korea.','I like apples.'],1,'from 뒤에 나라 이름을 넣어요.','I am from Korea.는 나는 한국에서 왔다는 뜻으로 출신 나라를 답해요.'],
['글을 읽고 Alex의 출신 나라를 고르세요. “My name is Alex. I am from Canada.”',['Korea','Australia','Canada'],2,'두 번째 문장에서 from 뒤를 살펴보세요.','Alex가 I am from Canada.라고 말했으므로 캐나다에서 왔어요.'],
['“내 이름은 유나야.”를 영어로 쓰려 해요. 알맞은 문장은?',['My name is Yuna.','My from is Yuna.','I name from Yuna.'],0,'이름을 말하는 문장 틀은 My name is ___.이에요.','My name is Yuna.가 내 이름은 유나라는 뜻이에요.'],
['처음 만난 친구에게 “만나서 반가워.”라고 인사하는 말은?',['See you tomorrow.','Nice to meet you.','Good night.'],1,'처음 만나 인사하는 상황이에요.','Nice to meet you.는 처음 만난 상대에게 만나서 반갑다는 뜻으로 말해요.']
]}),
lesson(2,{
unit:'친구와 첫인사',title:'친구의 관심사를 소개해요',
goal:'친구 소개 글에서 이름·나라·좋아하는 것을 찾고 관심사를 물을 수 있어요.',
explanation:'What do you like?는 좋아하는 것을 묻는 질문이에요. I like soccer.처럼 I like 뒤에 관심사를 넣어 답할 수 있어요. This is my friend, Ben.은 친구를 다른 사람에게 소개할 때 쓰는 말이에요. 짧은 소개 글을 읽을 때는 이름·나라·관심사를 나누어 찾아보세요.',
guide:'도입 5분: 지난 시간의 이름·나라 질문으로 인사합니다. 이해 12분: 튜터가 예제 소개 글과 대화를 두 번 읽고 학생이 이름·나라·관심사를 말하게 합니다. 연습 15분: 관심사 카드로 인터뷰하고 친구 소개 한 줄을 씁니다. 정리 8분: 다섯 문항을 확인하고 친구가 좋아하는 것을 한국어나 영어 낱말로 설명합니다. soccer와 music을 혼동하면 동작이나 그림을 함께 사용합니다. He/She를 반복해 외우게 하기보다 This is my friend와 직접 인용한 I like 문장으로 의미 전달을 먼저 확인합니다.',
workedExample:{prompt:'Yuna가 새 친구 Ben을 소개하고 Ben에게 질문해요.',steps:['Yuna: This is my friend, Ben.','Ben: Hi! I am from Australia.','Yuna: What do you like?','Ben: I like music. What do you like?','Yuna: I like soccer.'],answer:'Ben은 호주에서 왔고 음악을 좋아해요. Yuna는 축구를 좋아해요.'},
activity:{title:'관심사 인터뷰',materials:'soccer·music·drawing 카드, 이름·나라·관심사 세 칸 표',steps:['세 칸 표에 나를 소개할 정보를 한 가지씩 써요.','튜터가 예제 대본을 읽으면 Ben의 나라와 관심사를 해당 칸에 적어요.','짝에게 What do you like?를 묻고 I like ___.로 답해요.','짝의 이름을 This is my friend, ___.로 소개하고 짝이 자기 관심사를 말하도록 이어 줘요.']},
extension:'가상 친구의 짧은 소개 글 세 문장을 만들고 다른 사람이 이름·나라·관심사를 찾게 해 보세요.',selfCheck:['소개 글에서 이름·나라·관심사를 따로 찾을 수 있어요.','친구에게 What do you like?를 묻고 답할 수 있어요.'],
questions:[
['What do you like?에 알맞은 대답은?',['I am from Korea.','My name is Ben.','I like music.'],2,'like는 좋아한다는 뜻이에요.','I like music.은 나는 음악을 좋아한다는 뜻으로 관심사를 답해요.'],
['글을 읽고 Mina가 좋아하는 것을 고르세요. “I am Mina. I am from Korea. I like drawing.”',['그림 그리기','축구','음악'],0,'I like 뒤의 drawing을 확인해요.','drawing은 그림 그리기예요. Mina는 그림 그리기를 좋아해요.'],
['“이 아이는 내 친구 Ben이야.”에 알맞은 문장은?',['I am from Ben.','This is my friend, Ben.','What is your Ben?'],1,'친구 소개는 This is my friend로 시작해요.','This is my friend, Ben.으로 다른 사람에게 친구 Ben을 소개해요.'],
['소개 카드 “Name: Leo / From: Canada / Likes: soccer”와 맞는 문장은?',['Leo is from Australia.','Leo likes music.','Leo is from Canada.'],2,'From 칸의 정보를 확인해요.','카드의 From은 Canada이므로 Leo는 캐나다에서 왔어요.'],
['두 사람이 좋아하는 것이 다른 대화는?',['A: I like music. B: I like drawing.','A: I like soccer. B: I like soccer.','A: I like drawing. B: I like drawing.'],0,'각 대화의 like 뒤 낱말을 비교해요.','music과 drawing은 다른 관심사예요. 첫 번째 대화에서 두 사람의 관심사가 달라요.']
]}),
lesson(3,{
unit:'학교생활',title:'좋아하는 교과를 물어봐요',
goal:'교과 이름을 읽고 좋아하는 교과를 묻고 답할 수 있어요.',
explanation:'English는 영어, math는 수학, science는 과학, art는 미술, P.E.는 체육이에요. What is your favorite subject?는 가장 좋아하는 교과를 묻는 말이에요. My favorite subject is art.처럼 답하거나 I like art.로 간단히 말할 수 있어요. 교과 이름과 요일 이름을 구별하며 읽어 보세요.',
guide:'도입 5분: 교실에서 사용하는 물건과 교과를 연결합니다. 이해 12분: 교과 낱말을 읽고 튜터가 예제 대화를 두 번 읽어 줍니다. 학생은 대화 속 두 사람의 선호 교과를 고릅니다. 연습 15분: 교과 카드 투표와 짝 인터뷰 후 문항을 풉니다. 정리 8분: 한 문장으로 좋아하는 교과를 쓰고 읽습니다. favorite이 길어 어려우면 What subject do you like?와 I like ___.부터 연습하고 원래 질문으로 돌아옵니다.',
workedExample:{prompt:'교실에서 좋아하는 교과에 대해 이야기해요.',steps:['Sora: What is your favorite subject?','Jun: My favorite subject is science.','Jun: What is your favorite subject?','Sora: My favorite subject is art.'],answer:'Jun은 과학을, Sora는 미술을 가장 좋아해요.'},
activity:{title:'우리 반 교과 투표',materials:'교과 낱말 카드, 빈 막대 그림 또는 스티커 투표판',steps:['교과 이름 다섯 개를 읽고 한국어 뜻과 짝지어요.','튜터가 예제 대화를 읽으면 Jun과 Sora의 선택을 카드로 들어 보여요.','짝에게 What is your favorite subject?를 묻고 선택한 카드에 스티커를 붙여요.','My favorite subject is ___. 문장을 완성하고 투표판 옆에 붙여요.']},
extension:'내가 좋아하는 교과에서 하는 활동을 그림으로 그리고 교과 이름을 영어로 써 보세요.',selfCheck:['English·math·science·art·P.E.의 뜻을 구별할 수 있어요.','좋아하는 교과를 질문하고 한 문장으로 답할 수 있어요.'],
questions:[
['과학을 뜻하는 낱말은?',['science','Tuesday','Canada'],0,'교과 이름을 찾아요.','science는 과학, Tuesday는 화요일, Canada는 나라 이름이에요.'],
['What is your favorite subject?에 교과를 답한 문장은?',['It is Monday.','My favorite subject is art.','I am from Korea.'],1,'subject는 교과를 뜻해요.','My favorite subject is art.는 가장 좋아하는 교과가 미술이라는 뜻이에요.'],
['“My favorite subject is P.E.”에서 좋아하는 교과는?',['영어','수학','체육'],2,'P.E.는 몸을 움직이는 교과예요.','P.E.는 체육이에요. 문장은 체육을 가장 좋아한다는 뜻이에요.'],
['글을 읽고 Jisu가 좋아하는 교과를 고르세요. “I have math today. My favorite subject is English.”',['English','math','science'],0,'오늘 배우는 교과와 좋아하는 교과가 같다고 단정하지 말아요.','좋아하는 교과는 My favorite subject is English.에 나와 있어요.'],
['“내가 가장 좋아하는 교과는 수학이야.”에 알맞은 문장은?',['My favorite country is math.','My favorite subject is math.','My name is math.'],1,'교과를 나타내는 subject를 넣어요.','My favorite subject is math.가 가장 좋아하는 교과가 수학이라는 뜻이에요.']
]}),
lesson(4,{
unit:'학교생활',title:'요일별 시간표를 읽어요',
goal:'요일과 시간표를 읽고 어느 요일에 어떤 교과를 배우는지 묻고 답할 수 있어요.',
explanation:'Monday부터 Friday까지는 월요일부터 금요일이에요. What do you have on Tuesday?는 화요일에 어떤 수업이 있는지 묻는 말이에요. I have English on Tuesday.처럼 on 뒤에 요일을 붙여 답해요. 시간표를 읽을 때 요일 제목을 먼저 찾고 그 칸의 교과를 확인해요.',
guide:'도입 5분: 요일 카드를 월~금 순서로 놓습니다. 이해 12분: 예제 시간표를 읽은 뒤 튜터가 예제 대화를 두 번 읽고 요일·교과를 찾게 합니다. 연습 15분: 서로 빈칸이 다른 시간표로 묻고 답하며 채운 다음 다섯 문항을 풉니다. 정리 8분: Tuesday/Thursday의 차이를 다시 듣고 한 문장을 씁니다. 학생이 요일을 혼동하면 카드의 첫 두 글자와 소리를 함께 비교하고 실제 학교 시간표와 이 활동의 예시 시간표를 구분합니다.',
workedExample:{prompt:'예시 시간표: Monday—math, Tuesday—English, Wednesday—art, Thursday—science, Friday—P.E.',steps:['A: What do you have on Tuesday?','B: I have English on Tuesday.','A: What do you have on Thursday?','B: I have science on Thursday.'],answer:'이 예시 시간표에서는 화요일에 영어, 목요일에 과학 수업이 있어요.'},
activity:{title:'빈칸 시간표 완성',materials:'요일 5개가 적힌 표 두 장, 교과 카드',steps:['예제 시간표를 보고 내 표에 월·수·금 교과만 써요. 짝은 화·목 교과만 써요.','튜터가 Tuesday와 Thursday가 들어간 예제 질문을 읽으면 해당 요일 칸을 짚어요.','What do you have on ___?으로 짝에게 물어 빈칸을 채워요.','완성한 두 표를 비교하고 요일과 교과를 한 문장으로 적어요.']},
extension:'내가 만들고 싶은 하루 시간표를 그리고 I have ___ on Friday. 문장 두 개로 소개해 보세요.',selfCheck:['Tuesday와 Thursday를 구별할 수 있어요.','시간표에서 요일을 찾아 교과를 말할 수 있어요.'],
questions:[
['Thursday는 무슨 요일일까요?',['화요일','목요일','금요일'],1,'Tuesday와 철자가 비슷하지만 다른 요일이에요.','Thursday는 목요일이에요. Tuesday는 화요일이에요.'],
['시간표 “Monday—art / Tuesday—math / Friday—English”에서 영어 수업이 있는 요일은?',['Monday','Tuesday','Friday'],2,'English 앞의 요일을 찾아요.','Friday—English이므로 영어 수업은 금요일에 있어요.'],
['What do you have on Wednesday?에 수요일의 교과를 답한 문장은?',['I have science on Wednesday.','I am from Canada.','It is in the box.'],0,'질문은 수요일에 배우는 것을 묻고 있어요.','I have science on Wednesday.는 수요일에 과학 수업이 있다는 뜻이에요.'],
['“나는 월요일에 수학 수업이 있어.”의 빈칸에 알맞은 말은? “I have math ___ Monday.”',['at','on','from'],1,'요일 앞에 사용하는 말을 찾아요.','요일 앞에는 on을 써서 on Monday라고 말해요.'],
['글을 읽고 맞는 것을 고르세요. “I have art on Tuesday. I have P.E. on Thursday.”',['화요일에 체육이 있어요.','목요일에 미술이 있어요.','목요일에 체육이 있어요.'],2,'Thursday가 있는 문장의 교과를 확인해요.','I have P.E. on Thursday.라고 했으므로 목요일에 체육 수업이 있어요.']
]}),
lesson(5,{
unit:'날짜와 일과',title:'생일 날짜를 물어봐요',
goal:'달과 날짜가 적힌 카드를 읽고 생일이 언제인지 묻고 답할 수 있어요.',
explanation:'When is your birthday?는 생일이 언제인지 묻는 질문이에요. My birthday is on May 3rd.는 생일이 5월 3일이라는 뜻이에요. 날짜의 1st·2nd·3rd는 first·second·third로 읽고 5th는 fifth로 읽어요. 달 이름과 날짜를 함께 확인하면 다른 사람의 생일 정보를 정확히 찾을 수 있어요.',
guide:'도입 5분: March·May·June·July의 달 카드를 봅니다. 이해 12분: 활동에서 사용하는 날짜만 1st/2nd/3rd/5th로 읽어 보고, 튜터가 예제 대화를 두 번 읽습니다. 연습 15분: 실제 개인정보 대신 가상 생일 카드로 묻고 답하고 다섯 문항을 풉니다. 정리 8분: 카드의 달과 날짜를 각각 짚으며 문장을 읽습니다. 처음부터 모든 달·서수를 암기시키지 않고 카드에 한글 독음 대신 뜻·숫자를 함께 제시하여 의미를 확인합니다.',
workedExample:{prompt:'가상 인물의 생일 카드: Mina—May 3rd, Ben—June 1st.',steps:['Ben: When is your birthday?','Mina: My birthday is on May 3rd.','Mina: When is your birthday?','Ben: My birthday is on June 1st.'],answer:'Mina의 생일은 5월 3일, Ben의 생일은 6월 1일이에요.'},
activity:{title:'가상 생일 달력',materials:'March·May·June·July 달력 종이, 가상 생일 카드',steps:['가상 생일 카드에서 달과 날짜를 서로 다른 색으로 표시해요.','튜터가 예제 대화를 읽으면 Mina와 Ben의 생일을 달력에 표시해요.','짝에게 When is your birthday?를 묻고 가상 카드의 날짜로 답해요.','짝이 말한 날짜를 종이에 적고 카드를 비교해 정확히 들었는지 확인해요.']},
extension:'좋아하는 이야기 속 인물의 가상 생일 초대장에 달과 날짜를 영어로 적어 보세요.',selfCheck:['생일 카드에서 달과 날짜를 찾아 읽을 수 있어요.','When is your birthday?를 묻고 카드의 날짜로 답할 수 있어요.'],
questions:[
['When is your birthday?는 무엇을 묻는 말일까요?',['좋아하는 교과','이름','생일 날짜'],2,'birthday는 생일이라는 뜻이에요.','When is your birthday?는 생일이 언제인지 날짜를 묻는 질문이에요.'],
['생일 카드 “May 3rd”가 뜻하는 날짜는?',['5월 3일','3월 5일','6월 3일'],0,'May는 5월이에요. 달을 먼저 확인해요.','May는 5월이고 3rd는 3일이므로 5월 3일이에요.'],
['카드 “Birthday: June 1st”에 맞는 대답은?',['My birthday is on July 1st.','My birthday is on June 1st.','My birthday is on June 3rd.'],1,'June과 1st를 모두 확인해요.','카드의 달과 날짜가 모두 같은 My birthday is on June 1st.가 맞아요.'],
['날짜를 읽을 때 2nd에 맞는 낱말은?',['first','third','second'],2,'첫째·둘째·셋째 중 둘째를 찾아요.','2nd는 second로 읽어요. 1st는 first, 3rd는 third예요.'],
['글을 읽고 파티 날짜를 고르세요. “My birthday is on March 2nd. My party is on March 5th.”',['3월 5일','3월 2일','5월 3일'],0,'생일과 파티 날짜가 다르니 party 문장을 찾아요.','My party is on March 5th.라고 했으므로 파티는 3월 5일이에요.']
]}),
lesson(6,{
unit:'날짜와 일과',title:'하루 일과와 시간을 말해요',
goal:'하루 일과의 시간을 읽고 몇 시에 무엇을 하는지 묻고 답할 수 있어요.',
explanation:'What time do you get up?은 몇 시에 일어나는지 묻는 말이에요. I get up at seven.처럼 at 뒤에 시간을 넣어 답해요. get up은 일어나다, eat breakfast는 아침을 먹다, go to school은 학교에 가다, go to bed는 잠자리에 들다예요. 이 자료의 시각은 seven thirty처럼 시와 분을 순서대로 읽어요.',
guide:'도입 5분: 아침부터 밤까지 일과 그림을 순서대로 놓습니다. 이해 12분: 튜터가 예제 대화를 두 번 읽고 학생은 활동과 시간을 연결합니다. 연습 15분: 역할 일과표로 시각을 묻고 답하며 다섯 문항을 풉니다. 정리 8분: 내 일과 또는 가상 일과 두 문장을 씁니다. seven과 eleven을 혼동하면 숫자를 함께 보여 주고, thirty가 어렵다면 7:00·8:00 정각으로 먼저 연습한 뒤 7:30으로 확장합니다.',
workedExample:{prompt:'가상 일과표: get up—7:00, eat breakfast—7:30, go to school—8:00.',steps:['A: What time do you get up?','B: I get up at seven.','A: What time do you eat breakfast?','B: I eat breakfast at seven thirty.','A: What time do you go to school?','B: I go to school at eight.'],answer:'7시에 일어나고, 7시 30분에 아침을 먹고, 8시에 학교에 가요.'},
activity:{title:'나의 하루 시간 카드',materials:'활동 그림 카드, 시계 그림 또는 시각 숫자 카드',steps:['활동 카드 get up·eat breakfast·go to school·go to bed를 시간 흐름대로 놓아요.','튜터가 예제 대화를 읽으면 알맞은 시각 카드를 각 활동 옆에 놓아요.','짝에게 What time do you ___?를 묻고 역할 카드의 시각으로 답해요.','내가 선택한 두 일과를 I ___ at ___.로 적고 읽어요.']},
extension:'주말의 가상 일과표를 만들고 평일과 시간이 다른 활동 하나를 영어로 소개해 보세요.',selfCheck:['get up과 go to bed의 뜻을 구별할 수 있어요.','활동을 하는 시각을 at과 함께 말할 수 있어요.'],
questions:[
['“I get up at seven.”의 뜻은?',['나는 7시에 일어나요.','나는 7시에 잠자리에 들어요.','나는 7시에 점심을 먹어요.'],0,'get up은 일어나다라는 뜻이에요.','get up은 일어나다, at seven은 7시에라는 뜻이에요.'],
['What time do you go to school?에 알맞은 대답은?',['My favorite subject is art.','I go to school at eight.','I am from Korea.'],1,'언제 학교에 가는지 답해야 해요.','I go to school at eight.는 8시에 학교에 간다는 뜻이에요.'],
['일과표 “eat breakfast—7:30”와 맞는 문장은?',['I eat breakfast at seven.','I eat breakfast at eight thirty.','I eat breakfast at seven thirty.'],2,'7시와 30분을 모두 나타낸 말을 찾아요.','seven thirty는 7시 30분이에요.'],
['시간 앞 빈칸에 알맞은 말은? “I go to bed ___ nine.”',['at','on','from'],0,'요일 앞 on과 시각 앞에 쓰는 말을 구별해요.','시각 앞에는 at을 써서 at nine이라고 해요.'],
['글을 읽고 먼저 하는 활동을 고르세요. “I get up at seven. I eat breakfast at seven thirty.”',['아침 먹기','일어나기','두 활동을 동시에 하기'],1,'7시와 7시 30분 중 먼저인 시각을 찾아요.','7시에 일어난 뒤 7시 30분에 아침을 먹으므로 일어나기가 먼저예요.']
]}),
lesson(7,{
unit:'허락과 도움',title:'정중하게 허락을 구해요',
goal:'교실에서 May I를 사용해 허락을 구하고 허락 여부를 이해할 수 있어요.',
explanation:'May I use your pencil?은 상대의 연필을 사용해도 되는지 정중하게 묻는 말이에요. 허락할 때는 Yes, you may. 또는 Sure.라고 답할 수 있어요. Sorry, you cannot.은 미안하지만 허락할 수 없다는 뜻이에요. 상대가 허락했는지 먼저 확인한 뒤 물건을 사용해요.',
guide:'도입 5분: 다른 사람의 물건을 빌릴 때 먼저 묻는 이유를 이야기합니다. 이해 12분: 튜터가 예제 대화를 읽고 학생은 허락/거절 카드를 들어 보입니다. 연습 15분: pencil·eraser·ruler 카드로 허락을 묻고 답한 뒤 다섯 문항을 풉니다. 정리 8분: May I ___? 한 문장을 쓰고 거절도 존중하며 마무리합니다. 문장을 길게 말하기 어려우면 May I use your ___? 틀을 제공하고 대답의 의미를 분명히 구별하는지 관찰합니다.',
workedExample:{prompt:'수업 중 짝에게 연필을 빌려도 되는지 물어요.',steps:['A: May I use your pencil?','B: Yes, you may.','A: Thank you.','B: You are welcome.'],answer:'A는 연필 사용 허락을 구했고 B가 허락했어요. 빌린 뒤에는 감사 인사를 해요.'},
activity:{title:'허락을 먼저 묻는 교실',materials:'pencil·eraser·ruler 카드, Yes/No 역할 카드',steps:['물건 카드를 놓고 짝의 물건을 가리키며 May I use your ___?를 말해요.','튜터가 예제 대화와 추가 대사 “Sorry, you cannot.”을 읽으면 허락/거절 카드로 의미를 표시해요.','짝은 뽑은 역할 카드에 따라 허락하거나 거절해요.','허락받으면 감사 인사를 하고, 거절받으면 Okay.라고 답하며 다른 물건을 선택해요.']},
extension:'교실에서 허락을 구해야 하는 상황 하나를 그리고 May I use your ___?를 써 보세요.',selfCheck:['May I를 사용해 물건 사용 허락을 구할 수 있어요.','허락과 거절을 구별하고 상대의 대답에 맞게 행동할 수 있어요.'],
questions:[
['“May I use your pencil?”의 뜻은?',['네 연필은 어디에 있니?','네 연필을 써도 될까?','나는 연필을 좋아해.'],1,'May I는 내가 해도 되는지 묻는 표현이에요.','May I use your pencil?은 상대의 연필 사용 허락을 구하는 말이에요.'],
['May I use your eraser?에 허락하는 대답은?',['Sorry, you cannot.','It is on the desk.','Yes, you may.'],2,'허락할 때 쓰는 말을 찾아요.','Yes, you may.는 그래, 사용해도 돼라는 허락의 말이에요.'],
['대화 “A: May I use your ruler? B: Sorry, you cannot.”를 읽고 맞는 행동을 고르세요.',['다른 자를 찾아봐요.','허락받았으니 바로 사용해요.','B의 자를 몰래 가져가요.'],0,'B는 허락했을까요, 거절했을까요?','Sorry, you cannot.은 거절이에요. 상대의 대답을 존중하고 다른 자를 찾아봐요.'],
['빈칸에 알맞은 말은? “May I ___ your pencil?”',['from','use','birthday'],1,'연필을 사용한다는 뜻의 동사를 찾아요.','use는 사용하다예요. May I use your pencil?로 허락을 구해요.'],
['연필을 빌려준 친구에게 감사하는 말은?',['Where are you from?','What time is it?','Thank you.'],2,'고맙다는 뜻의 표현이에요.','Thank you.는 고마워라는 말로 도움을 받았을 때 감사 인사를 해요.']
]}),
lesson(8,{
unit:'허락과 도움',title:'필요한 도움을 부탁해요',
goal:'이해하지 못한 내용을 다시 말해 달라고 부탁하고 간단한 도움 요청에 응답할 수 있어요.',
explanation:'Can you help me, please?는 도와줄 수 있는지 정중하게 부탁하는 말이에요. 잘 듣지 못했을 때는 Say that again, please.로 한 번 더 말해 달라고 할 수 있어요. 뜻을 모르면 What does this mean?으로 의미를 물어요. 도움을 받을 때는 필요한 것을 구체적으로 말하고 마지막에 Thank you.로 고마움을 전해요.',
guide:'도입 5분: 모르는 것이 있을 때 사용할 말을 떠올립니다. 이해 12분: 튜터가 예제 대화를 두 번 읽고 다시 말해 달라는 요청을 찾게 합니다. 연습 15분: 도움 상황 카드를 보고 알맞은 요청을 말하며 다섯 문항을 풉니다. 정리 8분: 각자 다음 수업에서 쓰고 싶은 도움 요청 하나를 골라 씁니다. 학생이 침묵해도 먼저 기다리고 Can you help me, please? 문장 카드를 가리켜 말할 기회를 줍니다. 부탁의 종류를 문법 용어로 설명하기보다 실제 필요한 도움과 연결합니다.',
workedExample:{prompt:'튜터가 말한 낱말을 학생이 다시 듣고 뜻을 확인해요.',steps:['Tutor: Please write “ruler.”','Student: Say that again, please.','Tutor: Ruler.','Student: What does this mean?','Tutor: It means “자.”','Student: Thank you.'],answer:'학생은 소리를 다시 듣고, ruler의 뜻이 자라는 것도 확인했어요.'},
activity:{title:'도움 요청 신호 카드',materials:'다시 듣기·뜻 묻기·함께하기 상황 카드, 종이',steps:['세 상황 카드에 알맞은 영어 요청을 연결해요.','튜터가 예제 대본을 읽으면 학생의 요청 두 가지를 손으로 표시해요.','짝이 낱말 하나를 읽으면 Say that again, please.를 사용해 다시 들어요.','새로운 낱말 뜻을 What does this mean?으로 묻고, 들은 뜻을 그림이나 한국어로 적어요.']},
extension:'책갈피에 내가 사용할 도움 요청 두 문장을 써서 다음 수업에 가져오세요.',selfCheck:['잘 듣지 못했을 때 다시 말해 달라고 부탁할 수 있어요.','도움이 필요할 때 정중하게 요청하고 감사할 수 있어요.'],
questions:[
['친구의 말을 잘 듣지 못했어요. 알맞은 요청은?',['What is your favorite subject?','I am from Canada.','Say that again, please.'],2,'한 번 더 말해 달라고 부탁해요.','Say that again, please.는 방금 한 말을 다시 말해 달라는 요청이에요.'],
['“Can you help me, please?”의 뜻은?',['나를 도와줄 수 있니?','네 생일은 언제니?','지금 몇 시니?'],0,'help는 돕다라는 뜻이에요.','Can you help me, please?는 나를 도와줄 수 있니라는 정중한 부탁이에요.'],
['“What does this mean?”이 알맞은 상황은?',['친구의 나라를 알고 싶어요.','낱말의 뜻을 알고 싶어요.','학교에 가는 시각을 알고 싶어요.'],1,'mean은 뜻하다라는 의미예요.','What does this mean?은 낱말이나 표현의 뜻을 물을 때 사용해요.'],
['Can you help me, please?에 도와주겠다고 답하는 말은?',['My name is Jun.','It is Monday.','Sure.'],2,'상대의 도움 요청을 받아들이는 응답이에요.','Sure.는 물론이지라는 뜻으로 도와주겠다고 응답할 수 있어요.'],
['대화 “A: Say that again, please. B: Science. A: Thank you.”에서 B가 한 일은?',['낱말을 한 번 더 말했어요.','도움을 거절했어요.','자기 생일을 말했어요.'],0,'A의 요청 뒤 B의 응답을 확인해요.','A가 다시 말해 달라고 했고 B가 Science.를 한 번 더 말했어요.']
]}),
lesson(9,{
unit:'사람과 물건',title:'옷차림으로 친구를 찾아요',
goal:'간단한 옷차림 설명을 읽고 누구인지 찾아 말할 수 있어요.',
explanation:'Who is that?은 저 사람이 누구인지 묻는 말이에요. The boy in a blue shirt is Tom.은 파란 셔츠를 입은 남자아이가 Tom이라는 뜻이에요. shirt는 셔츠, hat은 모자, jacket은 재킷이에요. 사람을 찾을 때는 옷의 종류와 색을 함께 확인하고, 다른 사람의 외모를 평가하는 말보다 관찰 가능한 특징으로 설명해요.',
guide:'도입 5분: 색·옷 낱말을 카드와 연결합니다. 이해 12분: 튜터가 예제 대화를 두 번 읽고 학생이 옷차림 정보를 표시합니다. 연습 15분: 가상 인물 카드 세 장 중 설명에 맞는 사람을 찾고 다섯 문항을 풉니다. 정리 8분: 인물 하나의 이름과 옷을 한 문장으로 소개합니다. 그림을 준비하기 어렵다면 이름·옷·색을 적은 표를 사용합니다. in a blue shirt를 한 덩어리로 제시하고 피부색·체형 등 평가적인 표현 없이 인물 식별에 필요한 옷차림만 다룹니다.',
workedExample:{prompt:'가상 인물 카드: Tom—blue shirt, Mina—red hat, Ben—green jacket.',steps:['A: Who is that?','B: The boy in a blue shirt is Tom.','A: Is Mina in a red hat?','B: Yes, she is.'],answer:'파란 셔츠를 입은 아이는 Tom이고 빨간 모자를 쓴 아이는 Mina예요.'},
activity:{title:'옷차림 단서 탐정',materials:'이름·옷·색을 적은 가상 인물 카드 3~4장',steps:['인물 카드의 옷 이름과 색을 읽어요.','튜터가 예제 대화를 읽으면 Tom과 Mina 카드를 순서대로 골라요.','짝이 카드 하나를 골라 The boy/girl in a ___ is ___.로 설명해요.','듣는 사람은 해당 카드를 찾아 이름을 확인하고 역할을 바꿔요.']},
extension:'가상 친구를 그리고 The ___ in a ___ is ___. 문장 틀로 소개해 보세요.',selfCheck:['옷 종류와 색을 함께 읽고 인물을 찾을 수 있어요.','옷차림을 단서로 친구를 소개할 수 있어요.'],
questions:[
['“a blue shirt”의 뜻은?',['파란 셔츠','빨간 모자','초록 재킷'],0,'blue는 색, shirt는 옷 이름이에요.','blue는 파란색, shirt는 셔츠이므로 파란 셔츠예요.'],
['Who is that?은 무엇을 묻는 질문일까요?',['현재 시각','저 사람이 누구인지','좋아하는 음식'],1,'who는 누구를 뜻해요.','Who is that?은 저 사람이 누구인지 묻는 말이에요.'],
['인물 표 “Tom—blue shirt / Ben—green jacket / Leo—red hat”에서 초록 재킷을 입은 사람은?',['Tom','Leo','Ben'],2,'green jacket이 있는 줄을 찾아요.','Ben—green jacket이므로 초록 재킷을 입은 사람은 Ben이에요.'],
['글과 맞는 문장은? “The girl in a red hat is Mina.”',['Mina는 빨간 모자를 쓰고 있어요.','Mina는 파란 셔츠를 입고 있어요.','Mina는 초록 재킷을 입고 있어요.'],0,'in a red hat을 옷차림 정보로 읽어요.','a red hat은 빨간 모자예요. 글은 빨간 모자를 쓴 여자아이가 Mina라고 설명해요.'],
['설명 “Tom은 노란 셔츠를 입었어요.”에 맞는 영어는?',['Tom is in a yellow hat.','Tom is in a yellow shirt.','Tom is in a blue shirt.'],1,'색과 옷 종류를 둘 다 확인해요.','yellow shirt는 노란 셔츠예요. 두 정보가 모두 맞는 문장을 골라야 해요.']
]}),
lesson(10,{
unit:'사람과 물건',title:'물건의 주인을 찾아요',
goal:'물건이 누구의 것인지 묻고 소유자를 확인할 수 있어요.',
explanation:'Whose bag is this?는 이 가방이 누구의 것인지 묻는 말이에요. It is Mina’s bag.처럼 이름에 ’s를 붙여 그 사람의 물건이라고 답할 수 있어요. It is mine.은 내 것이고 It is yours.는 네 것이라는 뜻이에요. 물건의 위치를 묻는 Where와 주인을 묻는 Whose를 구별해요.',
guide:'도입 5분: 이름표가 붙은 가방·연필 카드를 봅니다. 이해 12분: 튜터가 예제 대화를 두 번 읽고 누구의 물건인지 확인합니다. 연습 15분: 분실물 카드에서 이름을 확인해 묻고 답한 뒤 문항을 풉니다. 정리 8분: Whose와 Where의 뜻을 비교하고 소유자를 쓰는 한 문장을 완성합니다. mine/yours는 화자가 바뀌면 가리키는 사람이 바뀌므로 손짓으로 말하는 사람과 듣는 사람을 확인합니다.',
workedExample:{prompt:'분실물 표: bag—Mina, pencil—Ben.',steps:['A: Whose bag is this?','B: It is Mina’s bag.','Mina: Yes, it is mine. Thank you.','A: Whose pencil is this?','B: It is Ben’s pencil.'],answer:'가방 주인은 Mina이고 연필 주인은 Ben이에요. Mina가 말한 mine은 Mina의 것을 가리켜요.'},
activity:{title:'분실물 주인 찾기',materials:'가방·연필·책 카드, 가상 이름표',steps:['물건 카드에 가상 이름표를 붙여 분실물 상자를 만들어요.','튜터가 예제 대화를 읽으면 물건과 주인의 이름표를 연결해요.','카드를 한 장씩 뽑아 Whose ___ is this?로 묻고 이름표를 보고 답해요.','주인 역할의 학생은 It is mine.을 말하고 물건 카드를 받아요.']},
extension:'가상 분실물 세 개의 목록을 만들고 It is ___’s ___. 문장을 써 보세요.',selfCheck:['Whose 질문이 물건의 주인을 묻는다는 것을 알아요.','이름에 ’s를 붙여 누구의 물건인지 말할 수 있어요.'],
questions:[
['“Whose bag is this?”의 뜻은?',['이 가방은 어디에 있니?','이 가방은 누구의 것이니?','이 가방은 무슨 색이니?'],1,'Whose는 누구의 것인지 물어요.','Whose bag is this?는 이 가방의 주인이 누구인지 묻는 말이에요.'],
['분실물 표 “book—Yuna / pencil—Jun”에서 책 주인을 답한 문장은?',['It is Jun’s book.','It is Yuna’s pencil.','It is Yuna’s book.'],2,'book 줄의 이름과 물건이 모두 맞는지 봐요.','표에서 book의 주인은 Yuna이므로 It is Yuna’s book.이 맞아요.'],
['Mina가 자기 가방을 가리키며 “It is mine.”이라고 말했어요. mine은 누구의 것일까요?',['Mina의 것','듣고 있는 Ben의 것','튜터의 것'],0,'mine은 지금 말하는 사람의 것이에요.','Mina가 말했으므로 mine은 Mina의 것을 뜻해요.'],
['물건의 위치가 아니라 주인을 묻는 질문은?',['Where is my bag?','Whose bag is this?','What color is the bag?'],1,'누구의 것인지를 묻는 낱말을 찾아요.','Whose가 들어간 질문은 소유자를 물어요. Where는 위치를, What color는 색을 물어요.'],
['“이것은 Ben의 연필이야.”에 맞는 문장은?',['It is Ben bag.','It is pencil’s Ben.','It is Ben’s pencil.'],2,'주인 이름 뒤에 ’s를 붙이고 물건 이름을 말해요.','Ben’s pencil은 Ben의 연필이라는 뜻이에요.']
]}),
lesson(11,{
unit:'위치와 길',title:'장소가 어디 있는지 설명해요',standards:['6영01-04','6영02-05','6영02-07'],criterion:'장소·위치에 관한 세부 정보를 이해하고 간단히 설명하며 묻고 답하기',
goal:'장소의 위치를 묻고 next to와 between으로 설명할 수 있어요.',
explanation:'Where is the library?는 도서관이 어디 있는지 묻는 말이에요. It is next to the park.는 공원 옆에 있다는 뜻이에요. between A and B는 A와 B 사이를 뜻하므로 두 장소를 모두 확인해요. 그림 지도가 없어도 왼쪽부터 차례로 적힌 장소 목록을 읽으며 위치를 설명할 수 있어요.',
guide:'도입 5분: library·park·school·bank 낱말 카드를 읽습니다. 이해 12분: 예제의 일렬 배치를 실제 카드로 놓고 튜터가 예제 대화를 두 번 읽습니다. 연습 15분: 카드를 바꾸어 next to와 between으로 위치를 묻고 답하며 다섯 문항을 풉니다. 정리 8분: 두 장소 사이에 있는 곳을 한 문장으로 씁니다. next to가 왼쪽만을 뜻한다고 오해하지 않도록 좌우 양쪽 인접 사례를 보여 주고 between은 두 기준 장소가 필요함을 확인합니다.',
workedExample:{prompt:'장소 카드가 왼쪽부터 park → library → school 순서로 붙어 있어요.',steps:['A: Where is the library?','B: It is between the park and the school.','A: Where is the park?','B: It is next to the library.'],answer:'도서관은 공원과 학교 사이에 있어요. 공원과 도서관은 서로 바로 옆에 있어요.'},
activity:{title:'카드로 만드는 우리 동네',materials:'park·library·school·bank 장소 카드, 종이',steps:['장소 카드 세 장을 일렬로 놓고 순서를 적어요.','튜터가 예제 대화를 읽으면 카드 배치를 말에 맞게 놓아요.','짝에게 Where is the ___?를 묻고 next to 또는 between으로 답해요.','카드 하나를 옮긴 뒤 위치 설명이 어떻게 달라지는지 한 문장을 고쳐 써요.']},
extension:'장소 세 개가 나란히 있는 가상 동네를 그리고 가운데 장소의 위치를 영어로 써 보세요.',selfCheck:['next to와 between의 차이를 설명할 수 있어요.','두 기준 장소를 사용해 가운데 장소의 위치를 말할 수 있어요.'],
questions:[
['“next to the park”의 뜻은?',['공원 옆에','공원 안에','공원에서 멀리'],0,'바로 가까운 이웃 위치를 뜻해요.','next to는 옆에라는 뜻이에요.'],
['왼쪽부터 “school → library → park” 순서예요. 가운데 있는 장소는?',['school','library','park'],1,'두 끝의 장소 사이를 찾아요.','library가 school과 park 사이에 있어요.'],
['위 배치 “school → library → park”와 맞는 설명은?',['The park is between the school and the library.','The school is between the library and the park.','The library is between the school and the park.'],2,'between 앞 장소가 가운데에 있는지 봐요.','가운데는 library이므로 The library is between the school and the park.가 맞아요.'],
['Where is the bank?는 무엇을 묻는 말일까요?',['은행의 위치','은행의 주인','은행의 색'],0,'Where는 어디를 뜻해요.','Where is the bank?는 은행이 어디 있는지 위치를 묻는 질문이에요.'],
['왼쪽부터 “bank → park → school” 순서예요. 공원 바로 옆에 있는 학교를 설명한 문장은?',['The school is between the bank and the park.','The school is next to the park.','The school is in the bank.'],1,'school은 park의 바로 오른쪽에 있어요.','school은 park 바로 옆에 있으므로 next to the park로 설명해요.']
]}),
lesson(12,{
unit:'위치와 길',title:'짧은 길 안내를 따라가요',standards:['6영01-04','6영02-05','6영02-07'],criterion:'장소·순서·방법에 관한 간단한 안내를 이해하고 설명하며 묻고 답하기',
goal:'Go straight·Turn left·Turn right를 이해하고 간단한 길을 안내할 수 있어요.',
explanation:'Go straight.는 곧장 가세요, Turn left.는 왼쪽으로 도세요, Turn right.는 오른쪽으로 도세요라는 뜻이에요. How can I get to the library?는 도서관에 어떻게 가는지 묻는 말이에요. 안내는 들은 순서대로 따라가고, 왼쪽과 오른쪽은 움직이는 사람이 향한 방향을 기준으로 생각해요. 길을 묻기 전 Excuse me.로 정중하게 말을 걸 수 있어요.',
guide:'도입 5분: 몸으로 곧장·왼쪽·오른쪽 동작을 구별합니다. 이해 12분: 예제의 출발 방향을 북쪽으로 정하고 튜터가 대화를 두 번 읽어 줍니다. 연습 15분: 바닥 화살표 또는 종이 격자로 움직이며 다섯 문항을 풉니다. 정리 8분: 두 단계 안내를 써서 짝이 따라가게 합니다. 도로 안전 훈련과 혼동하지 않도록 교실의 가상 지도 활동으로 진행합니다. 회전 후에도 왼쪽을 종이의 왼쪽으로 고정하는지 관찰하며 말하는 사람의 진행 방향을 손가락으로 표시합니다.',
workedExample:{prompt:'가상 길: 출발점에서 북쪽을 보고 서 있어요. 곧장 한 칸 간 뒤 오른쪽으로 돌면 도서관이 보여요.',steps:['A: Excuse me. How can I get to the library?','B: Go straight. Turn right.','A: Thank you.','B: You are welcome.'],answer:'먼저 곧장 간 뒤 오른쪽으로 돌아요. 이 활동에서는 출발할 때 북쪽을 바라보므로 오른쪽은 동쪽이에요.'},
activity:{title:'화살표 안내 게임',materials:'직진·좌회전·우회전 화살표 카드, 종이 격자와 말',steps:['격자 위에 출발점을 표시하고 말이 북쪽을 향하도록 놓아요.','튜터가 예제 안내를 읽으면 직진 뒤 오른쪽 회전 카드를 순서대로 놓아요.','짝이 Go straight. Turn left/right. 두 단계로 안내하면 말을 움직여요.','도착한 곳을 확인하고 역할을 바꾸어 새 안내를 말해요.']},
extension:'가상 지도에 출발 방향과 목적지를 적고 두 단계의 길 안내를 영어로 써 보세요.',selfCheck:['직진·왼쪽 회전·오른쪽 회전 지시를 구별할 수 있어요.','상대가 따라갈 수 있도록 안내 순서를 말할 수 있어요.'],
questions:[
['“Turn left.”의 뜻은?',['곧장 가세요.','왼쪽으로 도세요.','오른쪽으로 도세요.'],1,'left와 right를 구별해요.','left는 왼쪽이에요. Turn left.는 왼쪽으로 도세요라는 뜻이에요.'],
['길 안내가 “Go straight. Turn right.”예요. 먼저 할 일은?',['오른쪽으로 돌기','왼쪽으로 돌기','곧장 가기'],2,'첫 번째 문장부터 순서대로 따라가요.','첫 문장이 Go straight.이므로 먼저 곧장 가요.'],
['How can I get to the library?에 길을 안내하는 응답은?',['Go straight. Turn left.','My birthday is on May 3rd.','It is mine.'],0,'목적지까지 가는 방법을 답해요.','Go straight. Turn left.는 곧장 가서 왼쪽으로 돌라는 길 안내예요.'],
['북쪽을 보고 서 있어요. “Turn right.”를 따르면 어느 쪽을 보게 될까요?',['서쪽','동쪽','남쪽'],1,'북쪽을 향할 때 오른손 쪽을 생각해요.','북쪽을 보고 있을 때 오른쪽으로 돌면 동쪽을 보게 돼요.'],
['지나가는 사람에게 길을 정중하게 묻기 전에 할 말은?',['Good night.','It is yours.','Excuse me.'],2,'모르는 사람에게 조심스럽게 말을 거는 표현이에요.','Excuse me.는 실례합니다라는 뜻으로 정중하게 말을 걸 때 사용해요.']
]}),
lesson(13,{
unit:'음식과 선택',title:'먹고 싶은 음식을 주문해요',
goal:'음식 이름과 원하는 수량을 읽고 정중하게 주문할 수 있어요.',
explanation:'What would you like?는 무엇을 원하는지 정중하게 묻는 말이에요. I would like a sandwich, please.처럼 원하는 음식을 답할 수 있어요. a sandwich는 샌드위치 하나, two sandwiches는 샌드위치 두 개예요. 부탁하는 문장 끝의 please와 음식을 받은 뒤의 Thank you.를 함께 사용해요.',
guide:'도입 5분: sandwich·salad·milk·water 메뉴 카드를 읽습니다. 이해 12분: 튜터가 예제 주문 대화를 두 번 읽고 주문한 음식과 음료를 고르게 합니다. 연습 15분: 손님·직원 역할로 주문하고 다섯 문항을 풉니다. 정리 8분: 내가 주문할 음식 하나를 한 문장으로 씁니다. 수량은 셀 수 있는 음식만 a/two로 연습하고 물·우유는 water/milk 그대로 제시해 a water 같은 형태를 정답으로 요구하지 않습니다.',
workedExample:{prompt:'가상 간식 가게 메뉴: a sandwich, salad, milk, water.',steps:['Clerk: What would you like?','Customer: I would like a sandwich, please.','Clerk: Would you like milk?','Customer: No, thank you. Water, please.','Clerk: Here you are.','Customer: Thank you.'],answer:'손님은 샌드위치 하나와 물을 원해요. 우유는 정중하게 거절했어요.'},
activity:{title:'작은 메뉴 가게',materials:'메뉴 카드, 주문 메모지, 연필',steps:['메뉴의 음식·음료 이름을 읽고 그림이나 한국어 뜻과 연결해요.','튜터가 예제 대화를 읽으면 손님이 주문한 것만 메모해요.','손님은 I would like ___, please.로 주문하고 직원은 메뉴 카드를 건네요.','직원은 주문을 확인하고 손님은 Thank you.로 마무리한 뒤 역할을 바꿔요.']},
extension:'세 가지 메뉴가 있는 가상 가게 메뉴판을 만들고 주문 대화 두 줄을 써 보세요.',selfCheck:['What would you like?를 듣고 원하는 음식을 답할 수 있어요.','please와 Thank you를 사용해 정중하게 주문할 수 있어요.'],
questions:[
['What would you like?에 음식 주문으로 답한 문장은?',['I would like a sandwich, please.','I am from Canada.','My name is Mina.'],0,'무엇을 원하는지 답해요.','I would like a sandwich, please.는 샌드위치 하나를 원하는 주문이에요.'],
['“two sandwiches”가 뜻하는 것은?',['샌드위치 한 개','샌드위치 두 개','샐러드 두 개'],1,'two는 수량, sandwiches는 음식 이름이에요.','two는 둘이고 sandwiches는 샌드위치의 복수형이므로 샌드위치 두 개예요.'],
['대화 “Clerk: Would you like milk? Customer: No, thank you. Water, please.”에서 손님이 원하는 음료는?',['우유','주스','물'],2,'No로 거절한 것과 please로 요청한 것을 구별해요.','손님은 우유를 거절하고 Water, please.로 물을 요청했어요.'],
['정중한 주문을 완성하는 말은? “I would like salad, ___.”',['please','from','Monday'],0,'정중하게 부탁할 때 덧붙이는 표현이에요.','please를 붙이면 정중하게 부탁하는 말이 돼요.'],
['주문 메모 “sandwich × 1 / milk × 1”과 맞는 문장은?',['A sandwich and water, please.','A sandwich and milk, please.','Two sandwiches and milk, please.'],1,'음식 종류·음료·수량이 모두 같은지 살펴요.','메모는 샌드위치 하나와 우유이므로 A sandwich and milk, please.가 맞아요.']
]}),
lesson(14,{
unit:'음식과 선택',title:'좋아하는 음식과 이유를 나눠요',
goal:'음식에 대한 선호와 간단한 이유를 읽고 내 선택을 말할 수 있어요.',
explanation:'Do you like carrots?는 당근을 좋아하는지 묻는 말이에요. Yes, I do. 또는 No, I do not.으로 답할 수 있어요. I like apples. They are sweet.처럼 좋아하는 것과 쉬운 이유를 두 문장으로 말해요. sweet는 달콤한, fresh는 신선한이라는 뜻이며 사람마다 좋아하는 음식이 다를 수 있어요.',
guide:'도입 5분: 음식 카드에서 내가 먹어 본 것을 고릅니다. 이해 12분: 튜터가 예제 대화를 두 번 읽고 선호·이유를 각각 찾게 합니다. 연습 15분: 선호 조사표를 채우고 읽기 문항을 풉니다. 정리 8분: 선택한 음식과 이유를 두 문장으로 씁니다. 특정 음식을 좋아한다고 더 좋은 사람으로 평가하지 않고 개인 취향을 존중합니다. sweet/fresh를 낱말 카드로 제공하며 건강 정보 자체를 평가하는 수업으로 확장하지 않습니다.',
workedExample:{prompt:'두 친구가 간식으로 먹고 싶은 과일을 골라요.',steps:['A: Do you like apples?','B: Yes, I do. I like apples. They are sweet.','A: Do you like bananas?','B: No, I do not. What do you like?','A: I like oranges.'],answer:'B는 사과가 달콤해서 좋아하고 바나나는 좋아하지 않아요. A는 오렌지를 좋아해요.'},
activity:{title:'서로 다른 간식 취향',materials:'apples·bananas·oranges·carrots 카드, 좋아요/아니요 표',steps:['내 선호를 음식별로 표에 표시하고 이유 낱말 sweet 또는 fresh를 골라요.','튜터가 예제 대본을 읽으면 B가 좋아하는 음식과 좋아하지 않는 음식을 나누어 적어요.','짝에게 Do you like ___?를 묻고 Yes, I do./No, I do not.으로 답해요.','좋아하는 음식 하나를 골라 I like ___. They are ___. 두 문장으로 소개해요.']},
extension:'가상의 간식 접시를 그리고 좋아하는 과일 두 가지를 영어 낱말로 표시해 보세요.',selfCheck:['음식 선호 질문에 긍정과 부정으로 답할 수 있어요.','좋아하는 음식과 쉬운 이유를 두 문장으로 말할 수 있어요.'],
questions:[
['Do you like carrots?에 좋아하지 않는다고 답하는 말은?',['Yes, I do.','No, I do not.','My name is Jun.'],1,'부정하는 대답을 찾아요.','No, I do not.은 아니, 좋아하지 않아라는 뜻이에요.'],
['“They are sweet.”에서 sweet의 뜻은?',['짭짤한','차가운','달콤한'],2,'과일의 단맛을 표현하는 낱말이에요.','sweet는 달콤한이라는 뜻이에요.'],
['글을 읽고 사과를 좋아하는 이유를 고르세요. “I like apples. They are sweet.”',['달콤해서','파란색이라서','학교에 있어서'],0,'두 번째 문장이 이유를 알려 줘요.','They are sweet.라고 했으므로 달콤해서 사과를 좋아해요.'],
['대화 “A: Do you like bananas? B: Yes, I do.”와 맞는 설명은?',['B는 바나나를 싫어해요.','B는 바나나를 좋아해요.','B는 생일을 말했어요.'],1,'Yes, I do.는 앞의 질문을 긍정해요.','B는 바나나를 좋아하느냐는 질문에 그렇다고 답했어요.'],
['글에서 Mina와 Jun이 모두 좋아하는 것은? “Mina: I like apples and oranges. Jun: I like oranges and bananas.”',['apples','bananas','oranges'],2,'두 사람의 문장에 공통으로 나온 음식을 찾아요.','Mina와 Jun의 목록에 모두 oranges가 있으므로 두 사람 다 오렌지를 좋아해요.']
]}),
lesson(15,{
unit:'주말 계획',title:'이번 주말 할 일을 말해요',
goal:'주말 계획을 읽고 무엇을 할 예정인지 묻고 답할 수 있어요.',
explanation:'What are you going to do this weekend?는 이번 주말에 무엇을 할 예정인지 묻는 말이에요. I am going to read a book.처럼 am going to 뒤에 할 일을 넣어 계획을 말해요. read a book은 책을 읽다, visit my grandma는 할머니를 방문하다, play soccer는 축구를 하다예요. 지금 하는 일과 앞으로 할 계획을 상황에 맞게 구별해요.',
guide:'도입 5분: 이번 주말이 앞으로 올 시간임을 달력에서 확인합니다. 이해 12분: 튜터가 예제 대화를 두 번 읽고 토요일·일요일의 활동을 연결합니다. 연습 15분: 가상 계획 카드를 골라 묻고 답하고 다섯 문항을 풉니다. 정리 8분: 주말 계획 한 문장을 씁니다. 실제 가정 일정 공개 대신 가상 계획도 허용하고 I am going to ___. 문장 틀을 제공합니다. 동사 형태를 길게 설명하기보다 앞으로 하려는 계획이라는 의미를 먼저 확인합니다.',
workedExample:{prompt:'가상 주말 계획표: Saturday—read a book, Sunday—play soccer.',steps:['A: What are you going to do this weekend?','B: I am going to read a book on Saturday.','A: What are you going to do on Sunday?','B: I am going to play soccer.'],answer:'토요일에는 책을 읽고 일요일에는 축구를 할 계획이에요.'},
activity:{title:'주말 계획 두 칸 달력',materials:'Saturday·Sunday 두 칸 달력, 활동 낱말 카드',steps:['주말 달력 두 칸에 할 일을 하나씩 골라 놓아요.','튜터가 예제 대본을 읽으면 예제 계획의 토요일·일요일 활동을 적어요.','짝에게 What are you going to do on Saturday?를 묻고 카드의 계획으로 답해요.','짝이 말한 계획과 내 계획 중 같은 활동이 있는지 찾아보아요.']},
extension:'비가 오는 가상 토요일 계획을 정하고 I am going to ___. 한 문장으로 써 보세요.',selfCheck:['주말 계획 문장에서 언제 무엇을 하는지 찾을 수 있어요.','I am going to를 사용해 앞으로 할 일을 말할 수 있어요.'],
questions:[
['“I am going to read a book.”의 뜻은?',['나는 책을 읽을 예정이에요.','나는 책을 잃어버렸어요.','나는 책의 주인을 물어요.'],0,'am going to는 앞으로 할 계획을 나타내요.','read a book은 책을 읽다이고 am going to가 있어 책을 읽을 계획이라는 뜻이에요.'],
['What are you going to do this weekend?에 주말 계획을 답한 문장은?',['My favorite subject is math.','I am going to play soccer.','It is next to the bank.'],1,'앞으로 할 활동을 나타낸 문장을 찾아요.','I am going to play soccer.는 축구를 할 계획이라고 답하는 문장이에요.'],
['계획표 “Saturday—read a book / Sunday—visit my grandma”에서 할머니를 방문하는 날은?',['Friday','Saturday','Sunday'],2,'visit my grandma가 있는 날을 확인해요.','할머니를 방문하는 활동은 Sunday에 있으므로 일요일이에요.'],
['빈칸에 알맞은 말은? “I am going to ___ soccer.”',['play','from','birthday'],0,'축구를 하다는 play soccer예요.','play soccer는 축구를 하다예요. I am going to play soccer.로 계획을 말해요.'],
['글과 맞는 설명은? “I am going to draw on Saturday. I am going to read a book on Sunday.”',['일요일에 그림을 그릴 계획이에요.','토요일에 그림을 그릴 계획이에요.','토요일에 책을 읽을 계획이에요.'],1,'draw와 Saturday가 같은 문장에 있어요.','첫 문장에서 토요일에 그림을 그릴 계획이라고 말했어요.']
]}),
lesson(16,{
unit:'주말 계획',title:'친구를 초대하고 약속을 정해요',
goal:'함께 하자는 제안에 응답하고 만날 요일과 시간을 확인할 수 있어요.',
explanation:'Let us play soccer.는 함께 축구를 하자는 제안이에요. 좋아서 함께하겠다면 Sounds good.으로 답할 수 있어요. 시간이 맞지 않으면 Sorry, I cannot.으로 정중하게 거절해요. 약속을 정할 때는 활동뿐 아니라 요일과 시각을 함께 확인해요.',
guide:'도입 5분: 친구와 약속할 때 필요한 정보 세 가지를 찾습니다. 이해 12분: 튜터가 예제 대화를 두 번 읽고 활동·요일·시각을 표에 적게 합니다. 연습 15분: 가능한 시간이 다른 역할 카드로 제안하고 응답한 뒤 문항을 풉니다. 정리 8분: 약속 메모 한 줄을 완성합니다. 거절을 무례함으로 판단하지 않고 상대의 일정을 존중하는 표현으로 다룹니다. let us는 let’s와 같은 뜻임을 알려 주되 표기는 한 형태로 먼저 연습합니다.',
workedExample:{prompt:'두 친구가 토요일 축구 약속을 정해요.',steps:['A: Let us play soccer on Saturday.','B: Sounds good. What time?','A: At ten.','B: Okay. See you at ten on Saturday.'],answer:'토요일 10시에 함께 축구를 하기로 했어요. 활동·요일·시각이 모두 정해졌어요.'},
activity:{title:'맞는 시간 찾아 약속하기',materials:'활동 카드, 가능한 요일·시각이 적힌 역할 카드',steps:['각자 카드의 가능한 요일과 시각을 확인해요.','튜터가 예제 대본을 읽으면 약속의 활동·요일·시각을 세 칸에 적어요.','한 사람은 Let us ___ on ___.으로 제안하고 상대는 카드에 맞춰 수락하거나 거절해요.','함께 가능한 때를 찾으면 What time?으로 시각까지 확인하고 약속 메모를 써요.']},
extension:'함께 그림을 그리는 가상 모임 초대 문구와 요일·시각을 영어로 적어 보세요.',selfCheck:['함께 하자는 제안을 이해하고 수락 또는 거절할 수 있어요.','약속의 활동·요일·시각을 빠짐없이 확인할 수 있어요.'],
questions:[
['“Let us play soccer.”의 뜻은?',['나는 축구공의 주인이야.','함께 축구를 하자.','축구장은 어디에 있니?'],1,'Let us는 함께 하자는 제안이에요.','Let us play soccer.는 함께 축구를 하자는 뜻이에요.'],
['친구의 제안을 받아들이는 말은?',['Sorry, I cannot.','Where is the library?','Sounds good.'],2,'좋다고 수락하는 응답을 찾아요.','Sounds good.는 좋겠다는 뜻으로 제안을 받아들이는 말이에요.'],
['대화 “A: Let us draw on Sunday. B: Sounds good. What time? A: At two.”의 약속은?',['일요일 2시에 그림 그리기','토요일 2시에 그림 그리기','일요일 10시에 축구하기'],0,'활동·요일·시각 세 정보를 모아요.','draw, Sunday, at two를 함께 읽으면 일요일 2시에 그림 그리는 약속이에요.'],
['초대를 받았지만 그 시간에 갈 수 없어요. 알맞은 응답은?',['Yes, you may.','Sorry, I cannot.','I am from Korea.'],1,'갈 수 없음을 정중하게 전해요.','Sorry, I cannot.은 미안하지만 할 수 없다고 정중하게 거절하는 말이에요.'],
['약속 메모 “Saturday / ten / soccer”와 맞는 문장은?',['See you at two on Saturday.','Let us read on Sunday.','Let us play soccer at ten on Saturday.'],2,'요일·시각·활동이 모두 같은 문장을 찾아요.','play soccer, at ten, on Saturday가 메모의 세 정보와 모두 일치해요.']
]}),
lesson(17,{
unit:'함께 쓰는 영어',title:'동아리 안내문에서 필요한 정보를 찾아요',criterion:'짧은 생활 안내문의 세부 정보를 이해하고 활동의 장소·시간·준비물에 관해 묻고 답하기',
goal:'짧은 동아리 안내문에서 활동·요일·시간·장소·준비물을 찾을 수 있어요.',
explanation:'안내문을 읽을 때는 제목을 보고 어떤 활동인지 먼저 알아보아요. Day는 요일, Time은 시각, Place는 장소를 뜻해요. Bring a pencil.은 연필을 가져오라는 안내예요. 모든 낱말을 한 번에 외우기보다 내가 필요한 정보가 있는 줄을 찾아 다시 읽어요.',
guide:'도입 5분: 안내문에서 찾을 정보 다섯 가지를 한국어로 말합니다. 이해 12분: 예제 안내문을 함께 읽은 뒤 튜터가 그대로 두 번 읽어 줍니다. 학생은 처음에는 듣고 칸을 고르고 두 번째에는 글로 확인합니다. 연습 15분: 정보 찾기 표와 짝 질문을 진행하고 문항을 풉니다. 정리 8분: 장소·시간·준비물 중 빠진 정보를 확인합니다. 문장 하나씩 번역만 하기보다 실제로 참여하려면 무엇을 알아야 하는지 묻고 필요한 줄을 학생이 짚도록 기다립니다.',
workedExample:{prompt:'동아리 안내문: “Art Club / Day: Friday / Time: three / Place: art room / Bring a pencil.”',steps:['A: What do we do at the club?','B: We draw.','A: What day is the club?','B: Friday.','A: What time?','B: At three.','A: What do we bring?','B: A pencil.'],answer:'미술 동아리는 금요일 3시 미술실에서 해요. 연필을 가져가요.'},
activity:{title:'안내문 정보 탐색',materials:'예제 안내문 출력물, 활동·요일·시간·장소·준비물 다섯 칸 표',steps:['안내문에서 Day·Time·Place에 각각 밑줄을 그어요.','튜터가 안내문과 예제 대화를 읽으면 다섯 칸 표를 채워요.','짝이 What time? 또는 Where?를 물으면 안내문에서 근거 줄을 짚고 답해요.','짝의 표와 비교하고 다르게 적은 칸은 안내문을 다시 읽어 고쳐요.']},
extension:'독서 동아리의 가상 안내문을 만들고 Day·Time·Place·Bring 정보를 한 줄씩 적어 보세요.',selfCheck:['안내문에서 요일·시각·장소·준비물을 찾아낼 수 있어요.','내가 고른 답의 근거가 되는 줄을 짚을 수 있어요.'],
questions:[
['안내문 “Art Club / Day: Friday / Time: three / Place: art room / Bring a pencil.”에서 모이는 날은?',['Friday','Monday','Sunday'],0,'Day 뒤에 오는 정보를 읽어요.','Day: Friday이므로 모이는 날은 금요일이에요.'],
['안내문 “Art Club / Day: Friday / Time: three / Place: art room / Bring a pencil.”에서 모이는 시각은?',['2시','3시','10시'],1,'Time: three를 확인해요.','Time은 시각이고 three는 3이므로 3시에 모여요.'],
['안내문 “Art Club / Day: Friday / Time: three / Place: art room / Bring a pencil.”에서 가져올 물건은?',['가방','공','연필'],2,'Bring 다음에 오는 물건을 찾아요.','Bring a pencil.은 연필을 가져오라는 뜻이에요.'],
['“Place: library”가 알려 주는 것은?',['장소가 도서관이라는 것','좋아하는 음식이 사과라는 것','준비물이 연필이라는 것'],0,'Place는 장소를 뜻해요.','Place: library는 모이는 장소가 도서관이라는 정보예요.'],
['새 안내문 “Book Club / Day: Tuesday / Time: four / Place: library / Bring a book.”와 맞는 설명은?',['금요일 4시에 미술실에서 만나요.','화요일 4시에 도서관에서 만나요.','화요일 3시에 도서관에서 만나요.'],1,'Day·Time·Place 세 줄을 함께 확인해요.','Tuesday는 화요일, four는 4시, library는 도서관이므로 화요일 4시에 도서관에서 만나요.']
]}),
lesson(18,{
unit:'함께 쓰는 영어',title:'우리 모임 초대장을 완성해요',criterion:'생활 주제의 세부 정보를 이해하고 모임 정보를 묻고 답하며 위치를 설명하고 예시를 참고하여 초대장 쓰기',
goal:'한 학기 동안 배운 표현으로 친구를 소개하고 모임의 활동·시간·장소를 알릴 수 있어요.',
explanation:'친구와 모임을 소개할 때는 사람·활동·요일·시각·장소를 차례로 정리해요. This is my friend, ___.로 친구를 소개하고 Let us ___.로 함께할 활동을 제안할 수 있어요. At ten on Saturday.처럼 시각과 요일을 함께 말하고 The park is next to the library.처럼 장소 단서를 덧붙여요. 배운 문장을 상황에 맞게 고르고 서로 이해했는지 질문해요.',
guide:'도입 5분: 학기 동안 만든 이름표·시간표·지도·계획표를 떠올립니다. 이해 12분: 튜터가 예제 초대문과 대화를 두 번 읽고 학생이 다섯 정보를 찾습니다. 연습 15분: 가상 모임 초대장을 만들고 짝 인터뷰·다섯 문항을 진행합니다. 정리 8분: 내 초대장을 읽고 짝이 시간·장소를 맞게 이해했는지 확인합니다. 문법 오류 개수보다 정보가 빠짐없이 전달되는지 관찰하고 어려운 학생은 이미 배운 문장 카드에서 골라 연결하도록 지원합니다. 다음 학기 보충할 표현 하나를 함께 정합니다.',
workedExample:{prompt:'초대문: “This is my friend, Mina. Let us draw at ten on Saturday. Place: park. The park is next to the library. Bring a pencil.”',steps:['A: What are we going to do?','B: We are going to draw.','A: What time?','B: At ten on Saturday.','A: Where is the park?','B: It is next to the library.','A: What do we bring?','B: A pencil.'],answer:'Mina와 함께 토요일 10시에 공원에서 그림을 그려요. 공원은 도서관 옆에 있고 연필을 가져가요.'},
activity:{title:'내가 만드는 모임 초대장',materials:'초대장 종이, 활동·요일·시각·장소 낱말 카드, 연필',steps:['가상 친구 이름과 모임의 활동·요일·시각·장소·준비물을 정해요.','튜터가 예제 초대문을 읽으면 초대문에서 정보를 찾는 질문에 답해요.','문장 틀을 골라 내 초대장을 쓰고 짝에게 소리 내어 소개해요.','짝이 What time?·Where?·What do we bring?를 물으면 답하고, 빠진 정보가 있으면 초대장을 고쳐요.']},
extension:'초대장을 다른 가상 장소로 바꾸고 위치 설명과 필요한 준비물을 알맞게 고쳐 보세요.',selfCheck:['모임의 활동·요일·시간·장소를 빠짐없이 알릴 수 있어요.','친구의 질문에 답하고 내 초대장에서 부족한 정보를 고칠 수 있어요.'],
questions:[
['초대문 “Let us draw at ten on Saturday. Place: park.”의 활동은?',['축구하기','그림 그리기','책 읽기'],1,'draw의 뜻을 떠올려요.','draw는 그림을 그리다이므로 함께 그림을 그리는 모임이에요.'],
['같은 초대문 “Let us draw at ten on Saturday. Place: park.”의 요일과 시각은?',['일요일 10시','토요일 2시','토요일 10시'],2,'at 뒤 시각과 on 뒤 요일을 확인해요.','at ten은 10시에, on Saturday는 토요일에라는 뜻이에요.'],
['초대문 “The park is next to the library. Bring a pencil.”과 맞는 설명은?',['공원은 도서관 옆에 있고 연필을 가져가요.','공원은 학교 안에 있고 책을 가져가요.','공원은 은행 옆에 있고 공을 가져가요.'],0,'next to 뒤 장소와 Bring 뒤 준비물을 함께 읽어요.','next to the library는 도서관 옆, Bring a pencil.은 연필을 가져오라는 뜻이에요.'],
['초대장에 “Let us read on Sunday. Place: library.”만 적혀 있어요. 만날 시각을 확인할 질문은?',['Whose book is this?','What time?','Where are you from?'],1,'시각을 묻는 말을 골라요.','What time?은 몇 시인지 묻는 말이에요. 초대장에는 아직 시각 정보가 없어요.'],
['초대문 “This is my friend, Ben. Let us play soccer at two on Sunday. Place: school.”과 맞는 메모는?',['친구 Mina / 일요일 2시 / 학교 / 축구','친구 Ben / 토요일 2시 / 학교 / 축구','친구 Ben / 일요일 2시 / 학교 / 축구'],2,'친구 이름부터 활동까지 네 정보를 차례로 대조해요.','Ben, at two, on Sunday, school, play soccer가 초대문의 정보와 모두 일치해요.']
]})
];
if(typeof module!=='undefined'&&module.exports)module.exports=materials;
root.PogeunEnglishSemester=materials;
})(typeof window!=='undefined'?window:globalThis);
