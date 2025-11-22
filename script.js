
/* cached refs */
const card = document.getElementById('card');
const principal = document.getElementById('principal');
const rate = document.getElementById('rate');
const tenure = document.getElementById('tenure');
const unit = document.getElementById('unit');

const output = document.getElementById('output');
const outputInner = document.getElementById('outputInner');
const backdrop = document.getElementById('backdrop');

const btnSI = document.getElementById('btn-si');
const btnEMI = document.getElementById('btn-emi');
const btnReset = document.getElementById('btn-reset');

function format(n){
  if (!isFinite(n)) return "0";
  return Number(n).toLocaleString("en-IN",{maximumFractionDigits:2});
}

/* show modal & hide inputs */
function showOutput(html){
  // set content
  outputInner.innerHTML = html;

  // hide input card (keeps in DOM so values stay)
  card.style.opacity = '0';
  card.style.transform = 'scale(.995)';
  card.style.pointerEvents = 'none';

  // show backdrop + modal (adding classes so CSS transitions run)
  backdrop.classList.add('visible');
  output.classList.add('visible');

  // focus the close button for accessibility
  const closeBtn = output.querySelector('.close');
  if (closeBtn) closeBtn.focus();
}

/* hide modal & show inputs */
function hideOutput(){
  // hide modal + backdrop
  output.classList.remove('visible');
  backdrop.classList.remove('visible');

  // restore input card after animation delay so transitions look smooth
  // a small timeout matches the CSS transition (220ms)
  setTimeout(() => {
    card.style.opacity = '';
    card.style.transform = '';
    card.style.pointerEvents = '';
  }, 220);
}

/* ============== SIMPLE INTEREST =================== */
function calcSI(){
  const P = +principal.value;
  const R = +rate.value;
  let T = +tenure.value;

  if (P <= 0 || T <= 0) return showError();

  if(unit.value === "months") T = T/12;
  
  const SI = P * R * T / 100;
  const total = P + SI;

  const html = `
    <div class="sms-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
    <h3 id="resultTitle">✔ सरल ब्याजको नतिजा</h3>
    <button class="close" onclick="hideOutput()">X</button>
    </div>
    <div class="sms">
    तपाईंले <span class="number">रु ${format(P)}</span> रकममा 
    <span class="number">${R}%</span> दरले 
    <span class="number">${tenure.value} ${unit.value==="years"?"वर्ष":"महिना"}</span> को लागि
    जम्मा <span class="number">रु ${format(SI)}</span> ब्याज तिर्नुपर्छ।<br><br>
    कुल फर्छ्यौट रकम: <span class="number">रु ${format(total)}</span>
    </div>

     <div style="margin-top:14px; display:flex; gap:10px;">
    <button onclick="hideOutput()" style="flex:1;border-radius:10px;padding:10px;font-weight:700;">बन्द गर्नुहोस्</button>
    <button onclick="resetAll()" style="flex:1;border-radius:10px;padding:10px;background:rgba(255,255,255,0.08);">रिलोड</button>
  </div>
    `;
    showOutput(html);
    }

/* ============== EMI CALCULATION =================== */
function calcEMI(){
  const P = +principal.value;
  const R = +rate.value;
  let n = +tenure.value;

  if (P <= 0 || n <= 0) return showError();

  if(unit.value === "years") n = n * 12;

  const r = R / 12 / 100;

  const emi = r === 0 ? P/n : (P*r*Math.pow(1+r,n)) / (Math.pow(1+r,n)-1);

  const totalPaid = emi * n;
  const totalInterest = totalPaid - P;

  const html = `
  <div class="sms">
    <h3 id="resultTitle">✔ EMI (मासिक किस्ता) नतिजा</h3>
    मासिक किस्ता: <span class="number">रु ${format(emi)}</span><br>
    कुल अवधि: <span class="number">${n} महिना</span><br><br>
    कुल भुक्तानी: <span class="number">रु ${format(totalPaid)}</span><br>
    कुल ब्याज: <span class="number">रु ${format(totalInterest)}</span>
  </div>
  <div style="margin-top:14px; display:flex; gap:10px;">
    <button onclick="hideOutput()" style="flex:1;border-radius:10px;padding:10px;font-weight:700;">बन्द गर्नुहोस्</button>
    <button onclick="resetAll()" style="flex:1;border-radius:10px;padding:10px;background:rgba(255,255,255,0.08);">रिलोड</button>
  </div>
  `;
  showOutput(html);
}

/* ============== RESET =================== */
function resetAll(){
  principal.value = "";
  tenure.value = "";
  rate.value = "15";
  unit.value = "years";
  hideOutput();
}

/* error message */
function showError(){
  const html = `
    <div class="sms">
      ❗ <b>कृपया मान्य विवरण भर्नुहोस्।</b><br>
      रकम वा अवधि खाली हुन हुँदैन।
    </div>
    <div style="margin-top:14px; display:flex;">
      <button onclick="hideOutput()" style="flex:1;border-radius:10px;padding:10px;font-weight:700;">ठीक छ</button>
    </div>
  `;
  showOutput(html);
}

/* Wire up buttons */
btnSI.addEventListener('click', calcSI);
btnEMI.addEventListener('click', calcEMI);
btnReset.addEventListener('click', resetAll);

/* Close modal when user presses Escape */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') hideOutput();
});

/* click on backdrop closes modal */
backdrop.addEventListener('click', hideOutput);
