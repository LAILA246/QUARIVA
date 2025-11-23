// PRODUCTS
const products = [
  {id:1,name:'Magic Tee',price:20},
  {id:2,name:'Enchanted Cap',price:15},
  {id:3,name:'Art Print',price:35},
  {id:4,name:'Sticker Pack',price:8},
];
let cart = JSON.parse(localStorage.getItem('cart')||'[]');
let user = localStorage.getItem('user')||null;

// DOM
const productGrid = document.getElementById('productGrid');
const cartBtn = document.getElementById('cartBtn');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const clickSound = document.getElementById('clickSound');
const addSound = document.getElementById('addSound');

// RENDER PRODUCTS
function renderProducts(){
  productGrid.innerHTML = '';
  products.forEach(p=>{
    const div = document.createElement('div');
    div.className='product-card';
    div.innerHTML=`<div class="placeholder-img">${p.name}</div>
                   <h4>${p.name}</h4><p>$${p.price}</p>
                   <button class="add-cart">Add to Treasure Chest</button>`;
    productGrid.appendChild(div);

    div.querySelector('button').addEventListener('click',()=>{
      cart.push(p);
      localStorage.setItem('cart',JSON.stringify(cart));
      cartBtn.innerText=`Cart (${cart.length})`;
      addSound.play();
      alert(`${p.name} added to cart! ✨`);
    });
  });
}
renderProducts();
cartBtn.innerText=`Cart (${cart.length})`;

// LOGIN / LOGOUT DEMO
loginBtn.addEventListener('click',()=>{
  const email = prompt('Enter your email to login:');
  if(email){user=email;localStorage.setItem('user',email);alert(`Welcome, ${email}! ✨`);loginBtn.classList.add('hidden');logoutBtn.classList.remove('hidden');}
});
logoutBtn.addEventListener('click',()=>{
  user=null;localStorage.removeItem('user');alert('Logged out ✨');loginBtn.classList.remove('hidden');logoutBtn.classList.add('hidden');
});

// COMMISSIONS
const commissionGrid=document.getElementById('commissionGrid');
['Art 1','Art 2','Art 3'].forEach(a=>{
  const div=document.createElement('div');
  div.className='commission-card';
  div.innerHTML=`<div class="placeholder-img">${a}</div>`;
  commissionGrid.appendChild(div);
});
document.getElementById('commissionForm').addEventListener('submit',e=>{
  e.preventDefault();
  alert('Commission request submitted! ✨');
});

// REVIEWS
const reviewList=document.getElementById('reviewList');
const reviewInput=document.getElementById('reviewInput');
document.getElementById('submitReview').addEventListener('click',()=>{
  if(reviewInput.value.trim()==='') return;
  const div=document.createElement('div'); div.className='review-card';
  div.innerText=`${user||'Guest'}: ${reviewInput.value}`;
  reviewList.appendChild(div);
  reviewInput.value='';
});

// NEWSLETTER
document.getElementById('subscribeBtn').addEventListener('click',()=>{
  const email=document.getElementById('newsletterEmail').value;
  if(email){alert(`Subscribed ${email}! ✨`);}
});

// SIDE NAV HIGHLIGHT
const sections=document.querySelectorAll('section');
const sideLinks=document.querySelectorAll('#sideNav a');
window.addEventListener('scroll',()=>{
  let current='';
  sections.forEach(s=>{
    if(pageYOffset >= s.offsetTop - 100){current=s.id;}
  });
  sideLinks.forEach(link=>link.classList.remove('active'));
  sideLinks.forEach(link=>{if(link.getAttribute('href')==='#'+current){link.classList.add('active');}});
});

// SIDE NAV SMOOTH SCROLL
sideLinks.forEach(link=>{
  link.addEventListener('click',e=>{
    e.preventDefault();
    document.querySelector(link.getAttribute('href')).scrollIntoView({behavior:'smooth'});
  });
});
