/* Browser-local prototype accounts; production authentication requires a server. */
(function(root){'use strict';
const encoder=new TextEncoder(),hex=b=>Array.from(new Uint8Array(b),x=>x.toString(16).padStart(2,'0')).join('');
async function digest(password,salt){const key=await crypto.subtle.importKey('raw',encoder.encode(password),'PBKDF2',false,['deriveBits']);return hex(await crypto.subtle.deriveBits({name:'PBKDF2',salt:encoder.encode(salt),iterations:120000,hash:'SHA-256'},key,256));}
function emailOf(value){return String(value||'').trim().toLowerCase();}
async function createAccount(accounts,p){const email=emailOf(p.email);if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw Error('이메일 주소를 확인해 주세요.');if(accounts.some(a=>a.email===email))throw Error('이미 가입한 이메일입니다. 로그인해 주세요.');if(!['student','tutor'].includes(p.role))throw Error('가입 유형을 선택해 주세요.');if(typeof p.password!=='string'||p.password.length<8||p.password.length>128)throw Error('비밀번호는 8~128자로 입력해 주세요.');if(p.password!==p.confirmPassword)throw Error('비밀번호가 일치하지 않습니다.');const salt=hex(crypto.getRandomValues(new Uint8Array(16)));return {email,role:p.role,salt,passwordHash:await digest(p.password,salt),createdAt:new Date().toISOString()};}
async function login(accounts,email,password){const a=accounts.find(a=>a.email===emailOf(email));if(!a||await digest(password,a.salt)!==a.passwordHash)throw Error('이메일 또는 비밀번호를 확인해 주세요.');return a;}
const api={createAccount,login};root.PogeunAuth=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
