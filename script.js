let items = JSON.parse(localStorage.getItem('myTechData')) || [];
let editIndex = null; // Кайсы техника оңдолуп жатканын көзөмөлдөө үчүн

// 1. Пароль текшерүү
if (window.location.pathname.includes('admin.html')) {
    let pass = prompt("Пароль жазыңыз:");
    if (pass === "1111") {
        document.getElementById('admin-body').style.display = "block";
        renderAdminList();
    } else {
        alert("Пароль ката!");
        window.location.href = "index.html";
    }
}

// 2. Техника кошуу же өзгөртүүнү сактоо
function addItem() {
    const name = document.getElementById('name').value;
    const loc = document.getElementById('loc').value;
    const phone = document.getElementById('phone').value;
    const fileInput = document.getElementById('techImageFile');
    const file = fileInput.files[0];

    if (!name || !loc || !phone) {
        alert("Сураныч, бардык жерди толтуруңуз!");
        return;
    }

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            saveProcess(name, loc, phone, e.target.result);
        };
        reader.readAsDataURL(file);
    } else if (editIndex !== null) {
        // Оңдоп жатканда сүрөт тандалбаса, эскисин калтырат
        saveProcess(name, loc, phone, items[editIndex].img);
    } else {
        alert("Сүрөт тандаңыз!");
    }
}

function saveProcess(name, loc, phone, imgData) {
    const newItem = { name, loc, phone, img: imgData };

    if (editIndex !== null) {
        items[editIndex] = newItem; // Маалыматты алмаштыруу
        alert("Маалымат жаңыртылды!");
    } else {
        items.push(newItem); // Жаңы кошуу
        alert("Кошулду!");
    }

    localStorage.setItem('myTechData', JSON.stringify(items));
    resetForm();
    location.reload();
}

// 3. Оңдоо режимине өтүү
function editItem(index) {
    editIndex = index;
    const item = items[index];

    document.getElementById('name').value = item.name;
    document.getElementById('loc').value = item.loc;
    document.getElementById('phone').value = item.phone;

    document.getElementById('form-title').innerText = "Маалыматты оңдоо";
    document.getElementById('submit-btn').innerText = "ӨЗГӨРТҮҮНҮ САКТОО";
    document.getElementById('submit-btn').style.background = "#ffcc00";
    document.getElementById('submit-btn').style.color = "black";
    document.getElementById('cancel-btn').style.display = "block";
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetForm() {
    editIndex = null;
    document.getElementById('name').value = "";
    document.getElementById('loc').value = "";
    document.getElementById('phone').value = "";
    document.getElementById('techImageFile').value = "";
    document.getElementById('form-title').innerText = "Жаңы техника кошуу";
    document.getElementById('submit-btn').innerText = "САЙТКА ЧЫГАРУУ";
    document.getElementById('submit-btn').style.background = "#25d366";
    document.getElementById('submit-btn').style.color = "white";
    document.getElementById('cancel-btn').style.display = "none";
}

// 4. Башкы бетке чыгаруу
function renderItems() {
    const container = document.getElementById('product-container');
    if (!container) return;
    
    container.innerHTML = "";
    items.forEach(item => {
        container.innerHTML += `
            <div class="card">
                <img src="${item.img}">
                <div class="card-body">
                    <h3 class="notranslate">${item.name}</h3>
                    <p class="loc">${item.loc}</p>
                    <a href="https://wa.me/${item.phone}" class="btn btn-wa">
                        <i class="fab fa-whatsapp"></i> WhatsApp аркылуу жазуу
                    </a>
                </div>
            </div>
        `;
    });
}

// 5. Админ тизмесин чыгаруу (Оңдоо жана Өчүрүү баскычтары менен)
function renderAdminList() {
    const list = document.getElementById('admin-product-list');
    if (!list) return;
    
    list.innerHTML = "";
    items.forEach((item, index) => {
        list.innerHTML += `
            <div style="background:white; padding:15px; margin-top:10px; border-radius:10px; color: black; display:flex; justify-content:space-between; align-items:center; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                <span class="notranslate" style="font-weight:bold;">${item.name}</span>
                <div style="display:flex; gap:10px;">
                    <button onclick="editItem(${index})" style="background:#ffcc00; border:none; padding:8px 12px; border-radius:5px; cursor:pointer; font-weight:bold;">Оңдоо</button>
                    <button onclick="deleteItem(${index})" style="background:#ff4444; color:white; border:none; padding:8px 12px; border-radius:5px; cursor:pointer; font-weight:bold;">Өчүрүү</button>
                </div>
            </div>
        `;
    });
}

// 6. Өчүрүү функциясы
function deleteItem(index) {
    if (confirm("Өчүрөсүзбү?")) {
        items.splice(index, 1);
        localStorage.setItem('myTechData', JSON.stringify(items));
        location.reload();
    }
}

window.onload = renderItems;