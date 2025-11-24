/* Layla Boutique — Full Frontend + Firebase Auth */

// -------------------- FIREBASE SETUP --------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, RecaptchaVerifier, signInWithPhoneNumber } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js";

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyB6xuO0ysrPeQPWzbQ7L2tydBZpUB3smsk",
    authDomain: "quariva-4db17.firebaseapp.com",
    projectId: "quariva-4db17",
    storageBucket: "quariva-4db17.firebasestorage.app",
    messagingSenderId: "366589279750",
    appId: "1:366589279750:web:963d008197a7db8f728d87",
    measurementId: "G-87ZYEHPNC8"
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// -------------------- AUTH MODALS --------------------
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');

// Open/close modals
document.getElementById('loginBtn').addEventListener('click', () => loginModal.showModal());
document.getElementById('closeLogin').addEventListener('click', () => loginModal.close());
document.getElementById('signupBtn').addEventListener('click', () => signupModal.showModal());
document.getElementById('closeSignup')?.addEventListener('click', () => signupModal.close());

// -------------------- EMAIL/PASSWORD LOGIN --------------------
document.getElementById('loginForm').addEventListener('submit', e => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    signInWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            alert(`Logged in as ${userCredential.user.email} ✨`);
            loginModal.close();
        })
        .catch(err => alert(err.message));
});

// -------------------- EMAIL/PASSWORD SIGNUP --------------------
document.getElementById('signupFormModal').addEventListener('submit', e => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    createUserWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            alert(`Account created! Logged in as ${userCredential.user.email} ✨`);
            signupModal.close();
        })
        .catch(err => alert(err.message));
});

// -------------------- GOOGLE LOGIN --------------------
document.querySelectorAll('[data-provider="google"]').forEach(btn => {
    btn.addEventListener('click', () => {
        signInWithPopup(auth, googleProvider)
            .then(result => {
                const user = result.user;
                alert(`Signed in as ${user.displayName || user.email} via Google ✨`);
                loginModal.close();
            })
            .catch(err => alert(err.message));
    });
});

// -------------------- PHONE LOGIN --------------------
document.getElementById('phoneBtn')?.addEventListener('click', () => {
    const phone = prompt("Enter your phone number (+1234567890):");
    if (!phone) return;

    window.recaptchaVerifier = new RecaptchaVerifier('phoneBtn', { size: 'invisible' }, auth);
    signInWithPhoneNumber(auth, phone, window.recaptchaVerifier)
        .then(confirmationResult => {
            const code = prompt("Enter the verification code sent to your phone:");
            return confirmationResult.confirm(code);
        })
        .then(result => {
            alert(`Signed in as ${result.user.phoneNumber} ✨`);
            loginModal.close();
        })
        .catch(err => alert(err.message));
});

// -------------------- AUTH STATE --------------------
onAuthStateChanged(auth, user => {
    if (user) {
        document.getElementById('loginBtn').style.display = 'none';
        document.getElementById('signupBtn').style.display = 'none';
        console.log("User logged in:", user.email || user.phoneNumber);
    } else {
        document.getElementById('loginBtn').style.display = 'inline-block';
        document.getElementById('signupBtn').style.display = 'inline-block';
        console.log("No user logged in");
    }
});

// -------------------- SOUNDS --------------------
const sClick = document.getElementById('sClick');
const sAdd = document.getElementById('sAdd');
const sSpark = document.getElementById('sSpark');
function play(sound) { try { sound.currentTime = 0; sound.play(); } catch(e) {} }

// -------------------- HERO SLIDER --------------------
const slides = Array.from(document.querySelectorAll('.slide'));
const dotsEl = document.getElementById('heroDots');
let current = 0;
let slideTimer = null;

slides.forEach((_,i)=>{
    const b=document.createElement('button');
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
function goTo(i){ current=i; show(current); resetTimer(); play(sClick); }
function next(){ current=(current+1)%slides.length; show(current); }
function resetTimer(){ if(slideTimer) clearInterval(slideTimer); slideTimer=setInterval(next,5000); }

document.getElementById('slideNext')?.addEventListener('click', ()=>{ next(); resetTimer(); play(sClick); });
document.getElementById('slidePrev')?.addEventListener('click', ()=>{ current=(current-1+slides.length)%slides.length; show(current); resetTimer(); play(sClick); });

show(0); resetTimer();

// -------------------- PRODUCTS / CART --------------------
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
        const el=document.createElement('div');
        el.className='product-card';
        el.innerHTML=`
            <div class="placeholder">${p.name}</div>
            <h4>${p.name}</h4>
            <p>$${p.price}</p>
            <button data-id="${p.id}" class="addBtn">Add to Cart</button>
        `;
        productGrid.appendChild(el);
    });

    document.querySelectorAll('.addBtn').forEach(b=>{
        b.addEventListener('click', e=>{
            const id=Number(e.currentTarget.dataset.id);
            const prod=products.find(x=>x.id===id);
            cart.push(prod);
            localStorage.setItem('cart',JSON.stringify(cart));
            updateCartCount();
            play(sAdd); play(sSpark);
            alert(`${prod.name} added to your treasure chest ✨`);
        });
    });
}

function updateCartCount(){ document.getElementById('cartCount').innerText=cart.length; }

renderProducts(); updateCartCount();

// -------------------- ARTWORK --------------------
const artCards = document.getElementById('artCards') || document.createElement('div');
const sampleArts = ['Layla Art','Ascension','Sumeru Scene','Akademiya Study'];

function renderArts(){
    if(!document.getElementById('artCards')) return;
    sampleArts.slice(0,4).forEach(a=>{
        const c=document.createElement('div'); c.className='art-card'; c.innerText=a;
        artCards.appendChild(c);
    });
}
renderArts();

// -------------------- COMMISSIONS --------------------
const commissionForm = document.getElementById('commissionForm');
commissionForm?.addEventListener('submit', e=>{
    e.preventDefault();
    const fd = new FormData(commissionForm);
    const list = JSON.parse(localStorage.getItem('commissions')||'[]');
    list.push(Object.fromEntries(fd.entries()));
    localStorage.setItem('commissions',JSON.stringify(list));
    play(sSpark); alert('Commission request received! We will reach out ✨'); commissionForm.reset();
});

// -------------------- REVIEWS --------------------
const reviewList = document.getElementById('reviewList');
function loadReviews(){
    const r = JSON.parse(localStorage.getItem('reviews')||'[]');
    reviewList.innerHTML='';
    r.forEach(rr=>{
        const d=document.createElement('div'); d.className='review-card'; d.innerText=`${rr.name}: ${rr.text}`;
        reviewList.appendChild(d);
    });
}

document.getElementById('postReview')?.addEventListener('click', ()=>{
    const name=document.getElementById('reviewAuthor').value||'Guest';
    const text=document.getElementById('reviewText').value||'';
    if(!text) return alert('Write something first!');
    const r=JSON.parse(localStorage.getItem('reviews')||'[]');
    r.push({name,text});
    localStorage.setItem('reviews',JSON.stringify(r));
    loadReviews(); play(sClick);
});
loadReviews();

// -------------------- NEWSLETTER --------------------
document.getElementById('signupForm')?.addEventListener('submit', e=>{
    e.preventDefault();
    const email=document.getElementById('signupEmail').value;
    play(sSpark); alert(`Thank you! ${email} has been subscribed ✨`);
    e.target.reset();
});

// -------------------- SIDE NAV + SCROLL --------------------
const sideLinks = document.querySelectorAll('.side-nav a');
sideLinks.forEach(a=>{
    a.addEventListener('click', e=>{
        e.preventDefault();
        document.querySelector(a.getAttribute('href')).scrollIntoView({behavior:'smooth'});
        play(sClick);
    });
});

window.addEventListener('scroll', ()=>{
    let id='';
    document.querySelectorAll('section').forEach(sec=>{
        if(pageYOffset>=sec.offsetTop-200) id=sec.id;
    });
    sideLinks.forEach(a=>a.classList.toggle('active', a.getAttribute('href')=='#'+id));
});

// -------------------- BUTTON HELPERS --------------------
document.getElementById('shopBtn')?.addEventListener('click', ()=>{ document.querySelector('#products').scrollIntoView({behavior:'smooth'}); play(sClick); });
document.getElementById('cartBtn')?.addEventListener('click', ()=>{ alert('Open cart demo — items in local storage'); play(sClick); });
