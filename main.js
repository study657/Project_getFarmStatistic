$(function () {
    $(window).on('load', function () {
        $('.preloader').delay(500).fadeOut('slow', function () {
            $(this).attr('style', 'display: none !important');
        });
    });
});

var actual_price_onBOTkeyTf2 = 132; // Актуальная цена на ключ из игры TF2 у бота в стиме
let drops = document.querySelector('.drops'); // Получили наш div из index.html с классом drops
let dropsArr_rusNameItem = drops.textContent.match(/[а-яА-Я].+(?=\])/g); // Создали регулярное выражение, которое будет во всем содержимом контейнера div производить поиск только имен кейсов и возвращать это в виде массива с именами всех кейсов
let dropsArr_idItem = drops.textContent.match(/[0-9]{4}(?=\|)/g); // Создали регулярное выражение, которое будет во всем содержимом контейнера div производить поиск только уникальных айдишников кейсов и возвращать это в виде массива с айдишниками всех кейсов

let cases = {}; // Создали пустой объект, для будущего заполнения, который предполагает вид: {'id': {ru_name: "", eng_name: "", quantity: 1, price: 1}, ...}

for (let i = 0; i < dropsArr_idItem.length; i++) { // Проходимся по всем элементам, с айдишниками и далее если нет совпадения по id внутри объекта cases, тогда создаем такой ключ и в этом ключе объект, а если совпадение есть, то тогда к ключу quantity прибавляем 1
    if (cases[dropsArr_idItem[i]] == undefined) {
        cases[dropsArr_idItem[i]] = {
            'ru_name': dropsArr_rusNameItem[i],
            'eng_name': '',
            'quantity': 1,
            'price': 0
        }
    } else {
        cases[dropsArr_idItem[i]]['quantity']++;
    }
}

var proxy = 'https://cors-anywhere.herokuapp.com/'; // FIX CORS policy: No 'Access-Control-Allow-Origin' Необходимо, чтобы обойти ошибку с сервером
var steam_items = 'https://api.steampowered.com/IEconItems_730/GetSchema/v2/?key=2A88B4C4D2914C700C62D8D204415626&language=en'; // Данная ссылка ведет на сайт, на котором собственно находится сам объект со всеми вещами и предметами из игры

var xhr_steam_items = new XMLHttpRequest(); // Создаём новый объект XMLHttpRequest
xhr_steam_items.open('GET', proxy + steam_items, false); // Производим его конфигурацию его: GET-запрос на URL steam_items, но вместе с proxy, чтобы обойти ошибку, далее async - т.е. выбрали false, что соответствует тому, что запрос производится синхронно
xhr_steam_items.send(); // Отсылаем запрос

if (xhr_steam_items.status != 200) { // Проверяем, что наш статус запроса равен 200, что соответсвует норме
    console.log('Ошибка'); // Если получаем статус не 200, тогда выдаем ошибку
} else {
    var resporse_steam_items = JSON.parse(xhr_steam_items.responseText)['result']['items']; // если получаем статус 200, что соответствует норме, в таком случае мы делаем парс всего того, что есть на сайте: https://api.steampowered.com/IEconItems_730/GetSchema/v2/?key=2A88B4C4D2914C700C62D8D204415626&language=en, и получаем весь объект с того сайта. Но весь нам не нужен, поэтому мы берем по ключу result и по ключу items и соответвтвенно все это парсим (превращаем) в json объект, а не в строку
}

let needSteamItem = resporse_steam_items.filter(function (item) { // Создаем новую переменную в которой будем хранить совпадения, которые были найдены при проходке через наш объект cases и через объект json с сайта. И если есть совпадение по ключу, тогда просим вернуть нам этот массив целиком. Иными словами находим все совпадения по нашим айди и берем их с сайта
    for (let key in cases) {
        if (key == item['defindex']) {
            return true;
        }
    }
    return false;
});

for (let i = 0; i < needSteamItem.length; i++) { // Далее проходимся по всем элементам, которые получили выше. И проверяем, что если есть совпадение с айди в нашем объекте cases, тогда мы в наш обхект по ключу айди в объект по ключу eng_name записываем название на английском, которое находится по ключу item_name на сайте
    for (let key in cases) {
        if (needSteamItem[i]['defindex'] == key) {
            cases[key]['eng_name'] = needSteamItem[i]['item_name'];
        }
    }
}


var steam_casesPrice = 'https://steamcommunity.com/market/priceoverview/?country=RU&currency=5&appid=730&market_hash_name='; // Данная ссылка ведет на сайт, на котором находится объект с кенами. Однако в поле name= должно стоять название предмета на английском. Собственно для этого мы вверху их получали и записывали в наш cases

var xhr_casesPrice = new XMLHttpRequest(); // Создаём новый объект XMLHttpRequest

for (let key in cases) { // Проходимся по нашему объекту cases для получения каждого названия на английском для получения в дальнейшем актуальной цены по каждому предмету
    xhr_casesPrice.open('GET', proxy + steam_casesPrice + cases[key]['eng_name'], false); // Производим его конфигурацию его: GET-запрос на URL steam_casesPrice и естественно добавляем в конц название кейса на английском, чтобы переход на сайт был примерно таким: https://steamcommunity.com/market/priceoverview/?country=RU&currency=5&appid=730&market_hash_name=Danger%20Zone%20Case , а так же вместе с proxy, чтобы обойти ошибку, далее async - т.е. выбрали false, что соответствует тому, что запрос производится синхронно
    xhr_casesPrice.send(); // Отсылаем запрос

    if (xhr_casesPrice.status == 200) { // Проверяем, что наш статус запроса равен 200, что соответсвует норме
        var response_casesPrice = JSON.parse(xhr_casesPrice.responseText); // Создаем переменную в которую ложим спарсенный обхект json, который мы получили с сайта по нужной ссылке

        if (response_casesPrice['success'] == true) { // Далее проверка, если в полученном объекте по ключу success статус true, что соответствует работе, тогда мы
            let price = parseFloat(response_casesPrice['lowest_price'].replace(',', '.')); // Создаем переменную price, в которую ложим цену предмета, которую получили по ключу lowest_price в объекте с сайта по указанной ссылке
            cases[key]['price'] = price; // Записали в наш объект cases актуальную цену предмета с сайта
        }
    }
}


var steam_key_tf2 = 'https://steamcommunity.com/market/priceoverview/?country=RU&currency=5&appid=440&market_hash_name=Mann%20Co.%20Supply%20Crate%20Key'; // Получение цены ключа из стима на игру TF2

var xhr_steam_key_tf2 = new XMLHttpRequest();
xhr_steam_key_tf2.open('GET', proxy + steam_key_tf2, false);
xhr_steam_key_tf2.send();

if (xhr_steam_key_tf2.status != 200) {
    console.log('Ошибка');
} else {
    var price_key_tf2 = parseFloat((JSON.parse(xhr_steam_key_tf2.responseText)['lowest_price']).replace(',', '.')); // Актуальная цена на ключ из игры TF2
}



let table = document.createElement('table'); // Работа с html (создание блоков и их заполнение)
table.classList.add('table', 'table-bordered', 'border-info');
document.body.append(table);
let thead = document.createElement('thead');
thead.classList.add('border-3');
table.append(thead);
let tr = document.createElement('tr');
thead.append(tr);

let namesCols = ['Наименование кейса', 'Кол-во кейсов', 'Статистика выпадения кейса', 'Цена в STEAM', 'Общее (по цене STEAM)', 'Общее (с учетом комиссии)', 'ЧП Бори(30%)', 'ЧП Насти(70%)'];

for (let i = 0; i < namesCols.length; i++) {
    let th = document.createElement('th');
    th.classList.add('text-center');
    th.innerHTML = namesCols[i];
    tr.append(th);
}

let tbody = document.createElement('tbody');
table.append(tbody);

for (let key in cases) { // Генерация ячеек таблицы и заполнение
    let trContent = document.createElement('tr');
    tbody.append(trContent);

    let thName = document.createElement('th');
    thName.innerHTML = cases[key]['ru_name'];
    thName.classList.add('text-center');
    trContent.append(thName);

    let thQuantity = document.createElement('th');
    thQuantity.innerHTML = cases[key]['quantity'];
    thQuantity.classList.add('text-center', 'cases');
    trContent.append(thQuantity);

    let statisticCase = document.createElement('th');
    statisticCase.innerHTML = ((100 * Number(thQuantity.innerHTML)) / getAllCases(cases)).toFixed(2) + '%';
    statisticCase.classList.add('text-center');
    trContent.append(statisticCase);

    let thPrice = document.createElement('th');
    thPrice.innerHTML = cases[key]['price'] + ' руб.';
    thPrice.classList.add('text-center');
    trContent.append(thPrice);

    let generalSteam = document.createElement('th');
    generalSteam.innerHTML = (parseInt(thQuantity.innerHTML) * parseFloat(thPrice.innerHTML)).toFixed(2) + ' руб.';
    generalSteam.classList.add('text-center');
    trContent.append(generalSteam);

    let generalWithCommission = document.createElement('th');
    generalWithCommission.innerHTML = ((parseFloat(thPrice.innerHTML) - (parseFloat(thPrice.innerHTML) * 0.15)) * parseInt(thQuantity.innerHTML)).toFixed(2) + ' руб.';
    generalWithCommission.classList.add('text-center', 'com');
    trContent.append(generalWithCommission);

    let moneyBori = document.createElement('th');
    moneyBori.innerHTML = (parseFloat(generalWithCommission.innerHTML) * 0.3).toFixed(2) + ' руб.';
    moneyBori.classList.add('text-center', 'moneyBori');
    trContent.append(moneyBori);

    let moneyNasty = document.createElement('th');
    moneyNasty.innerHTML = (parseFloat(generalWithCommission.innerHTML) * 0.7).toFixed(2) + ' руб.';
    moneyNasty.classList.add('text-center', 'moneyNasty');
    trContent.append(moneyNasty);
}


let moneyBoriArr = document.querySelectorAll('.moneyBori');
let moneyNastyArr = document.querySelectorAll('.moneyNasty');

let profileDivContainer = document.createElement('div');
profileDivContainer.classList.add('container');
document.body.append(profileDivContainer);

let profileDivContainerDivRow = document.createElement('div');
profileDivContainerDivRow.classList.add('row');
profileDivContainer.append(profileDivContainerDivRow);


profile(profileDivContainerDivRow, 'Борис', 'images/unknown0.png', moneyBoriArr);
profile(profileDivContainerDivRow, 'Анастасия', 'images/fox 1.jpg', moneyNastyArr, 'offset-md-2');


let generalCases = document.querySelectorAll('.cases');
let generalCase = document.createElement('p');
generalCase.innerHTML = 'Итого общее количество кейсов: ' + getAllCases(cases);
generalCase.classList.add('gc', 'text-center', 'mt-5');
profileDivContainerDivRow.append(generalCase);










function getSum(money) { // Функция для подсчета общего кол-ва денег с фарма, человека, который в доле
    let sum = 0;
    for (let i = 0; i < money.length; i++) {
        sum += parseFloat(money[i].innerHTML);
    }

    return sum.toFixed(2);
};

function getAllCases(cases) { // Функция для подсчета общего кол-ва кейсов с фарма
    let sum = 0;
    for (let key in cases) {
        sum += cases[key]['quantity'];
    }

    return sum;
};

function profile(selector, name, photo, money, offset = undefined) { // Функция, для генерации профиля человека, участвующего в долевом фарме
    let profile = document.createElement('div');
    profile.classList.add('col-md-5', 'text-center', 'profile');
    if (offset !== undefined) {
        profile.classList.add(offset);
    }
    selector.append(profile);

    let namePerson = document.createElement('h2');
    namePerson.innerHTML = name;
    profile.append(namePerson);

    let photoPerson = document.createElement('img');
    photoPerson.src = photo;
    photoPerson.classList.add('img-fluid');
    profile.append(photoPerson);

    let cleanMoney = document.createElement('p');
    cleanMoney.innerHTML = 'Чистая Прибыль: ' + getSum(money) + ' руб.';
    profile.append(cleanMoney);

    let genDiv = document.createElement('div');
    genDiv.classList.add('block');
    profile.append(genDiv);

    let span = document.createElement('span');
    span.innerHTML = 'Рассчитать вывод в реальные деньги';
    genDiv.append(span);

    let div = document.createElement('div');
    div.classList.add('form-check', 'form-switch');
    genDiv.append(div);

    let input = document.createElement('input');
    input.classList.add('form-check-input');
    input.type = 'checkbox';
    input.id = 'flexSwitchCheckDefault';
    div.append(input);


    let quantity_key_tf2 = Math.floor(Number(getSum(money)) / price_key_tf2); // Три строчки рассчета для вывода денег из стима
    let conclusion_real_money = quantity_key_tf2 * actual_price_onBOTkeyTf2;
    let remains_moneyOnSteam = (Number(getSum(money)) - (quantity_key_tf2 * price_key_tf2)).toFixed(2);


    let real_moneyDiv = document.createElement('div');
    real_moneyDiv.classList.add('real_money');
    real_moneyDiv.style.display = 'none';
    profile.append(real_moneyDiv);

    let real_moneyH3 = document.createElement('h3');
    real_moneyH3.innerHTML = 'Qiwi Wallet: ' + conclusion_real_money + ' руб.';
    real_moneyDiv.append(real_moneyH3);

    let real_moneyH4 = document.createElement('h4');
    real_moneyH4.innerHTML = 'Остаток денег на балансе STEAM после вывода: ' + remains_moneyOnSteam + ' руб.';
    real_moneyDiv.append(real_moneyH4);

    let real_moneyP = document.createElement('p');
    real_moneyP.innerHTML = '*Вывод происходится с помощью бота по продаже ключей из игры Team Fortes 2. Цена ключа на данный момент составляет ' + actual_price_onBOTkeyTf2 + ' рубля/штука';
    real_moneyDiv.append(real_moneyP);

    input.addEventListener('click', function () { // Логика переключателя. Если включен, то будет выводить информацию о выводе денег в реал, если выключен, то не будет
        this.classList.toggle('active');

        if (input.classList.contains('active')) {
            real_moneyDiv.style.display = 'block';
        } else {
            real_moneyDiv.style.display = 'none';
        }
    });
};