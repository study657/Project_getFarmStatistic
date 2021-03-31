$(function(){
	$(window).on('load', function(){
        $('.preloader').delay(500).fadeOut('slow', function(){
        	$(this).attr('style', 'display: none !important');
        });
    });
});

let drops           = document.querySelector('.drops');
let dropsArr        = drops.textContent.match(/\[[0-9]+\|[а-яА-Я].+\]/g);
drops.style.display = 'none';

let cases = {
    // Кейсы, которые выпадают на ПЛАТНЫЕ аккаунты
    '[4698|Кейс «Разлом»]': {
        'price': 40,                 // Цена кейсов соответсвующая ценам STEAM на 30.03.2021
        'quantity': 0                // Служебный конфиг, его не трогать и не изменять
    },
    '[4695|Кейс «Призма 2»]': {
        'price': 3,
        'quantity': 0
    },
    '[4669|Кейс «CS20»]': {
        'price': 8,
        'quantity': 0
    },
    '[4598|Кейс «Призма»]': {
        'price': 2.5,
        'quantity': 0
    },
    '[4548|Кейс «Запретная зона»]': {
        'price': 4.5,
        'quantity': 0
    },
    '[4471|Кейс «Решающий момент»]': {
        'price': 21,
        'quantity': 0
    },
    '[4089|Хромированный кейс #2]': {
        'price': 20.2,
        'quantity': 0
    },
    '[4352|Кейс операции «Гидра»]': {
        'price': 600,
        'quantity': 0
    },
    '[4029|Оружейный кейс операции «Авангард»]': {
        'price': 57,
        'quantity': 0
    },
    '[4011|Оружейный кейс операции «Феникс»]': {
        'price': 65,
        'quantity': 0
    },
    '[4016|Капсула с наклейкой сообщества 1]': {
        'price': 260,
        'quantity': 0
    },


    // Кейсы, которые выпадают на БЕСПЛАТНЫЕ аккаунты
    '[4669|Кейс «CS20»]': {
        'price': 8,
        'quantity': 0
    },
    '[4482|Кейс «Горизонт»]': {
        'price': 5.3,
        'quantity': 0
    },
    '[4351|Кейс «Спектр»]': {
        'price': 41,
        'quantity': 0
    },
    '[4403|Кейс «Спектр 2»]': {
        'price': 11.5,
        'quantity': 0
    },
    '[4281|Гамма-кейс #2]': {
        'price': 26,
        'quantity': 0
    },
    '[4233|Хромированный кейс #3]': {
        'price': 5,
        'quantity': 0
    },
    '[4186|Револьверный кейс]': {
        'price': 5,
        'quantity': 0
    },
};

while(dropsArr.length > 0){
    let res1 = dropsArr.splice(0, 1)[0];

    for(let key in cases){
        if(key == res1){
            cases[key]['quantity']++;
        }
    }
}

for(let key in cases){
    if(cases[key]['quantity'] == 0){
        delete cases[key];
    }
}

let table   = document.createElement('table');
table.classList.add('table', 'table-bordered', 'border-info');
document.body.append(table);
let thead   = document.createElement('thead');
thead.classList.add('border-3');
table.append(thead);
let tr      = document.createElement('tr');
thead.append(tr);

let namesCols  = ['Наименование кейса', 'Кол-во кейсов с фарма', 'Цена в STEAM', 'Общее (по цене STEAM)', 'Общее (с учетом комиссии)', 'ЧП Бори(30%)', 'ЧП Насти(70%)'];

for(let i = 0; i < namesCols.length; i++){
    let th  = document.createElement('th');
    th.classList.add('text-center');
    th.innerHTML = namesCols[i];
    tr.append(th);
}

let tbody   = document.createElement('tbody');
table.append(tbody);

for(let key in cases){                                                 // Генерация ячеек таблицы и заполнение
    let trContent   = document.createElement('tr');
    tbody.append(trContent);

    let thName                      = document.createElement('th');
    thName.innerHTML                = key;
    thName.classList.add('text-center');
    trContent.append(thName);

    let thQuantity                  = document.createElement('th');
    thQuantity.innerHTML            = cases[key]['quantity'];
    thQuantity.classList.add('text-center', 'cases');
    trContent.append(thQuantity);

    let thPrice                     = document.createElement('th');
    thPrice.innerHTML               = cases[key]['price'] + ' руб.';
    thPrice.classList.add('text-center');
    trContent.append(thPrice);

    let generalSteam                = document.createElement('th');
    generalSteam.innerHTML          = (parseInt(thQuantity.innerHTML) * parseInt(thPrice.innerHTML)).toFixed(2) + ' руб.';
    generalSteam.classList.add('text-center');
    trContent.append(generalSteam);

    let generalWithCommission       = document.createElement('th');
    generalWithCommission.innerHTML = ((parseInt(thPrice.innerHTML) - (parseInt(thPrice.innerHTML) * 0.15)) * parseInt(thQuantity.innerHTML)).toFixed(2) + ' руб.';
    generalWithCommission.classList.add('text-center', 'com');
    trContent.append(generalWithCommission);

    let moneyBori                   = document.createElement('th');
    moneyBori.innerHTML             = (parseInt(generalWithCommission.innerHTML) * 0.3).toFixed(2) + ' руб.';
    moneyBori.classList.add('text-center', 'moneyBori');
    trContent.append(moneyBori);

    let moneyNasty                  = document.createElement('th');
    moneyNasty.innerHTML            = (parseInt(generalWithCommission.innerHTML) * 0.7).toFixed(2) + ' руб.';
    moneyNasty.classList.add('text-center', 'moneyNasty');
    trContent.append(moneyNasty);
}

let moneyBori           = document.querySelectorAll('.moneyBori');
let moneyNasty          = document.querySelectorAll('.moneyNasty');
let generalCases        = document.querySelectorAll('.cases');


let divContainer        = document.createElement('div');
divContainer.classList.add('container');
document.body.append(divContainer);

let divRow              = document.createElement('div');
divRow.classList.add('row');
divContainer.append(divRow);

let divCol              = document.createElement('div');
divCol.classList.add('col-md-12', 'text-center');
divRow.append(divCol);

let generalBori         = document.createElement('p');
generalBori.innerHTML   = 'Итого Чистая Прибыль Бори: ' + getSumBori(moneyBori) + ' рублей';
generalBori.classList.add('gb');
divCol.append(generalBori);

let generalNasty        = document.createElement('p');
generalNasty.innerHTML  = 'Итого Чистая Прибыль Насти: ' + getSumBori(moneyNasty) + ' рублей';
generalNasty.classList.add('gn');
divCol.append(generalNasty);

let generalCase         = document.createElement('p');
generalCase.innerHTML  = 'Итого общее количество кейсов с данного фарма: ' + getCases(generalCases);
generalCase.classList.add('gc');
divCol.append(generalCase);





function getSumBori(moneyBori){
    let sum = 0;
    for(let i = 0; i < moneyBori.length; i++){
        sum += parseInt(moneyBori[i].innerHTML);
    }

    return sum.toFixed(2);
};

function getSumBori(moneyNasty){
    let sum = 0;
    for(let i = 0; i < moneyNasty.length; i++){
        sum += parseInt(moneyNasty[i].innerHTML);
    }

    return sum.toFixed(2);
};

function getCases(generalCases){
    let sum = 0;
    for(let i = 0; i < generalCases.length; i++){
        sum += parseInt(generalCases[i].innerHTML);
    }

    return sum;
};