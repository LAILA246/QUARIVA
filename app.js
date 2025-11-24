/* Magical Boutique — frontend-only full demo */
/* WARNING: OAuth and payments are stubs (need backend). This is a fully interactive frontend demo. */

// Sounds
const sClick = document.getElementById('sClick');
const sAdd = document.getElementById('sAdd');
const sSpark = document.getElementById('sSpark');

// Simple utility
function play(sound){ try{ sound.currentTime = 0; sound.play(); } catch(e){} }

// HERO SLIDER (auto + manual)
const slides = Array.from(document.querySelectorAll('.slide'));
const dotsEl = document.getElementById('heroDots');
let current = 0;
let slideTimer = null;

// create dots
slides.forEach((_,i)=>{
  const b = document.createElement('button');
  if(i===0) b.style.background='var(--accent)';
  b.addEventListener('click',()=>goTo(i));
  dotsEl.appendChild(b);
});
const dots = Array.from(dotsEl.children);

function show(i){
  slides.forEach(s=>s.classList.remove('active'));
  dots.forEach(d=>d.classList.remove('active'));
  slides[i].classList.add('active');
  dots[i].classList.add('active');
}
function goTo(i){
  current = i;
  show(current);
  resetTimer();
  play(sClick);
}
function next(){
  current = (current+1) % slides.length;
  show(current);
}
function resetTimer(){ if(slideTimer) clearInterval(slideTimer); slideTimer = setInterval(next,5000); }
document.getElementById('slideNext').addEventListener('click',()=>{ next(); resetTimer(); play(sClick);});
document.getElementById('slidePrev').addEventListener('click',()=>{ current = (current-1+slides.length)%slides.length; show(current); resetTimer(); play(sClick);});
show(0); resetTimer();

// PRODUCTS (data + render)
const products = [
  {id:1,name:'Layla Tee',price:22,desc:'Soft pastel tee'},
  {id:2,name:'Celestial Cap',price:18,desc:'Round and comfy'},
  {id:3,name:'A4 Art Print',price:30,desc:'High quality print'},
  {id:4,name:'Sticker Set',price:9,desc:'8 adorable stickers'},
  {id:5,name:'Mystic Hoodie',price:48,desc:'Cozy & magical'}
];
const productGrid = document.getElementById('productGrid');
let cart = JSON.parse(localStorage.getItem('cart')||'[]');
function renderProducts(){
  productGrid.innerHTML='';
  products.forEach(p=>{
    const el = document.createElement('div');
    el.className='product-card';
    el.innerHTML = `
      <div class="placeholder">${p.name}</div>
      <h4>${p.name}</h4>
      <p>$${p.price}</p>
      <button data-id="${p.id}" class="addBtn">Add to Cart</button>
    `;
    productGrid.appendChild(el);
  });
  document.querySelectorAll('.addBtn').forEach(b=>{
    b.addEventListener('click',e=>{
      const id = Number(e.currentTarget.dataset.id);
      const prod = products.find(x=>x.id===id);
      cart.push(prod);
      localStorage.setItem('cart',JSON.stringify(cart));
      updateCartCount();
      play(sAdd);
      // little sparkle
      play(sSpark);
      alert(`${prod.name} added to your treasure chest ✨`);
    });
  });
}
function updateCartCount(){ document.getElementById('cartCount').innerText = cart.length; }
renderProducts(); updateCartCount();

// ARTWORK CARDS + RECENT SEARCH (demo)
const artCards = document.getElementById('artCards') || document.createElement('div');
const sampleArts = ['Layla Art','Ascension','Sumeru Scene','Akademiya Study'];
function renderArts(){
  if(!document.getElementById('artCards')) return;
  sampleArts.slice(0,4).forEach(a=>{
    const c = document.createElement('div'); c.className='card'; c.innerText = a;
    artCards.appendChild(c);
  });
}
renderArts();

// COMMISSIONS
const commissionForm = document.getElementById('commissionForm');
commissionForm.addEventListener('submit',e=>{
  e.preventDefault();
  const fd = new FormData(commissionForm);
  // frontend demo: store to localStorage
  const list = JSON.parse(localStorage.getItem('commissions')||'[]');
  list.push(Object.fromEntries(fd.entries()));
  localStorage.setItem('commissions',JSON.stringify(list));
  play(sSpark);
  alert('Commission request received! We will reach out ✨');
  commissionForm.reset();
});

// REVIEWS
const reviewList = document.getElementById('reviewList');
function loadReviews(){
  const r = JSON.parse(localStorage.getItem('reviews')||'[]');
  reviewList.innerHTML = '';
  r.forEach(rr=>{
    const d = document.createElement('div'); d.className='review-card'; d.innerText = `${rr.name}: ${rr.text}`;
    reviewList.appendChild(d);
  });
}
document.getElementById('postReview').addEventListener('click',()=>{
  const name = document.getElementById('reviewAuthor').value||'Guest';
  const text = document.getElementById('reviewText').value||'';
  if(!text) return alert('Write something first!');
  const r = JSON.parse(localStorage.getItem('reviews')||'[]');
  r.push({name,text});
  localStorage.setItem('reviews',JSON.stringify(r));
  loadReviews();
  play(sClick);
});
loadReviews();

// SIGNUP/NEWSLETTER
document.getElementById('signupForm').addEventListener('submit',e=>{
  e.preventDefault();
  const email = document.getElementById('signupEmail').value;
  play(sSpark);
  alert(`Thank you! ${email} has been subscribed ✨`);
  e.target.reset();
});

// LOGIN modal (frontend demo)
const loginModal = document.getElementById('loginModal');
document.getElementById('loginBtn').addEventListener('click',()=>{ loginModal.showModal(); });
document.getElementById('closeLogin').addEventListener('click',()=>loginModal.close());
document.getElementById('loginForm').addEventListener('submit',e=>{
  e.preventDefault();
  const email = new FormData(e.target).get('email');
  localStorage.setItem('user',email);
  alert(`Signed in as ${email} ✨`);
  loginModal.close();
  play(sClick);
});

// side nav highlight + smooth scroll
const sideLinks = document.querySelectorAll('.side-nav a');
sideLinks.forEach(a=>{
  a.addEventListener('click',e=>{
    e.preventDefault();
    document.querySelector(a.getAttribute('href')).scrollIntoView({behavior:'smooth'});
    play(sClick);
  });
});
window.addEventListener('scroll',()=>{
  let id = '';
  document.querySelectorAll('section').forEach(sec=>{
    if(pageYOffset >= sec.offsetTop - 200) id = sec.id;
  });
  sideLinks.forEach(a=>a.classList.toggle('active', a.getAttribute('href') === '#' + id));
});

// small helpers
document.getElementById('shopBtn')?.addEventListener('click',()=>{ document.querySelector('#products').scrollIntoView({behavior:'smooth'}); play(sClick);});
document.getElementById('cartBtn')?.addEventListener('click',()=>{ alert('Open cart demo — items in local storage'); play(sClick);});
