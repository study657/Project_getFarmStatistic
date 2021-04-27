let drops_index = document.querySelector('.drops'); // Получили наш div из index.html с классом drops
let drops_file = document.querySelector('.drops_file'); // Получили наш div, который будет необходим для записи всего содержимого из подгруженного файла в этот div
let login_pass = document.querySelector('.login_pass'); // Получаем div, в который потом запишутся все имеющиеся аккаунты в формате логин:пароль
let arrowUp = document.querySelector('.arrow-up'); // Стрелочка для того, чтобы быстро проскочить вверх
let arrowBottom = document.querySelector('.arrow-bottom'); // Стрелочка для того, чтобы быстро проскочить вниз
let mainBlock = document.querySelector('.main'); // Стартовая страница сайта
let buttonGetStatFromIndex = document.querySelector('.drops_stat'); // Получаем кнопку, которая при нажатии отвечает за вывод статистики из div с классом drops
let buttonAddFiles = document.querySelector('.file_stat'); // Получаем кнопочку, которая позволяет добавить файлы
let getFileStats = document.querySelector('.get_fileStats'); // Получаем кнопочку, которая позволяет при нажатии вывести результат фарма, который загружен из файла

buttonGetStatFromIndex.addEventListener('click', function () { // При нажатии на кнопку идет рассчет статистики, которая была загружена вручную пользователем в файл index.html
    getStatistic(drops_index);
});

buttonAddFiles.addEventListener('change', function () { // Кнопка, по нажатию на которую мы получаем все содержимое загружаемых файлов и записываем их в общий div
    let files = buttonAddFiles.files; // Получили массив с нашими файлами, которые загрузили

    for (let i = 0; i < files.length; i++) { // Прошлись по каждому файлу этого массива
        let reader = new FileReader(); // Создали объект для работы с файлами и последующим чтением их

        reader.readAsText(files[i]); // С помощью этого метода получили текстовое содержимое каждого загруженного файла

        reader.addEventListener('load', function () { // Далее если файл был успешно загружен, то тогда записываем каждое содержимое нашего файла в нужный нам div
            drops_file.innerHTML += reader.result;
        });
    }
});

getFileStats.addEventListener('click', function () { // Кнопка, по нажатию на которую загружается статистика из фалов, которые были загружены извне
    getStatistic(drops_file);
});


function getStatistic(drops) { // Главная функция, которая целиком отвечает за рассчет таблицы и вывод профиля участников фарма
    if (drops.innerHTML !== '') { // Проверка на то, что массив с элементами не пустая строчка и есть вообще что считать
        mainBlock.style.display = 'none';
        var actual_price_onBOTkeyTf2 = 132; // Актуальная цена на ключ из игры TF2 у бота в стиме
        let template_link_item = 'https://steamcommunity.com/market/listings/730/'; // Ссылка на сам предмет на торговой площадке, необходимо только после / добавить название кейса на английском
        let dropsArr_rusNameItem = drops.textContent.match(/[а-яА-Я].+(?=\])/g); // Создали регулярное выражение, которое будет во всем содержимом контейнера div производить поиск только имен кейсов и возвращать это в виде массива с именами всех кейсов
        let dropsArr_idItem = drops.textContent.match(/[0-9]{4}(?=\|)/g); // Создали регулярное выражение, которое будет во всем содержимом контейнера div производить поиск только уникальных айдишников кейсов и возвращать это в виде массива с айдишниками всех кейсов
        let accauntsArr_logins = drops.textContent.match(/[_A-Za-z0-9]{1,}(?=\')/g); // Создали регулярное выражение, которое ищет логины каждого аккаунта с нашего текущего фарма

        let cases = {}; // Создали пустой объект, для будущего заполнения, который предполагает вид: {'id': {ru_name: "", eng_name: "", quantity: 1, price: 1}, ...}
        let cases_onLogins = {}; // Создали пустой объект, который в дальнейшем будет заполнен и будет иметь вид: {'Название кейса': [{'login': Логин аккаунта, 'quantity': Количество кейсов на аккаунте}, {}, {}]}

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

        for (let i = 0; i < dropsArr_rusNameItem.length; i++) { // Проходимся по каждому элементу с русским названием кейсов
            if (cases_onLogins[dropsArr_rusNameItem[i]] == undefined) { // Далее если в объекте нет ключа с русским названием, то создаем шаблон
                cases_onLogins[dropsArr_rusNameItem[i]] = [{
                    'login': accauntsArr_logins[i],
                    'quantity': 1
                }]
            } else { // А если ключ в объекте с таким названием уже имеется, тогда
                let check = cases_onLogins[dropsArr_rusNameItem[i]].some(function (object) { // Создаем проверяющий чекспот, задача которого пройтись по каждому массиву, который есть по определенному ключу
                    if (object['login'] == accauntsArr_logins[i]) { // и если хотя бы для одного элемента с текущим логином будет хоть одно совпадение в нашем массиве, то тогда возвращаем true, это значит, что совпадение есть и нам необходимо делать дальнешие действия
                        return true;
                    } else {
                        return false;
                    }
                });

                if (check) { // Делаем проверку по переменной чекспота, который сформировали выше
                    for (let k = 0; k < cases_onLogins[dropsArr_rusNameItem[i]].length; k++) { // Снова проходимся по всем элементам с ключом по русскому названию кейсов
                        if (cases_onLogins[dropsArr_rusNameItem[i]][k]['login'] == accauntsArr_logins[i]) { // Далее если имеется такой кейс и логин с ним и совпадение, то тогда добавляем +1 в параметр количества кейсов на данном логине и останавливаем цикл, т.к. смысла проходить по всем элементам просто нет
                            cases_onLogins[dropsArr_rusNameItem[i]][k]['quantity']++;
                            break;
                        }
                    }
                } else { // В противном случае, если совпадений никаких по логину нет, то мы просто создаем новый объект в массиве исходя из нашего шаблона
                    cases_onLogins[dropsArr_rusNameItem[i]].push({
                        'login': accauntsArr_logins[i],
                        'quantity': 1
                    });
                }
            }
        }

        var proxy = 'https://cors-anywhere.herokuapp.com/'; // FIX CORS policy: No 'Access-Control-Allow-Origin' Необходимо, чтобы обойти ошибку с сервером
        var steam_items = 'https://api.steampowered.com/IEconItems_730/GetSchema/v2/?key=2A88B4C4D2914C700C62D8D204415626&language=en'; // Данная ссылка ведет на сайт, на котором собственно находится сам объект со всеми вещами и предметами из игры

        var xhr_steam_items = new XMLHttpRequest(); // Создаём новый объект XMLHttpRequest
        xhr_steam_items.open('GET', proxy + steam_items, false); // Производим его конфигурацию его: GET-запрос на URL steam_items, но вместе с proxy, чтобы обойти ошибку, далее async - т.е. выбрали false, что соответствует тому, что запрос производится синхронно
        xhr_steam_items.send(); // Отсылаем запрос

        if (xhr_steam_items.status != 200) { // Проверяем, что наш статус запроса равен 200, что соответсвует норме
            alert('Ошибка получения данных, попробуйте позднее!'); // Если получаем статус не 200, тогда выдаем ошибку
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



        let table = createNewElement('table', document.body, ['table', 'table-bordered', 'border-info']); // Работа с html (создание блоков и их заполнение) Создаем главную таблицу, в которую будем заполнять статистику по фарму
        let thead = createNewElement('thead', table, ['border-3']);
        let tr = createNewElement('tr', thead);

        let namesCols = ['Наименование кейса', 'Кол-во кейсов', 'Статистика выпадения кейса', 'Цена в STEAM', 'Общее (по цене STEAM)', 'Общее (с учетом комиссии)', 'ЧП Бори(30%)', 'ЧП Насти(70%)']; // Создаем массив, в котором перечисляем все элементы, которые должны находиться в шапке таблицы

        for (let i = 0; i < namesCols.length; i++) { // Длеаем цикл, который позволяет нам заполнить названия главных колонок
            let th = createNewElement('th', tr, ['text-center']);
            th.innerHTML = namesCols[i];
        }


        let tbody = createNewElement('tbody', table); // Создали оболочку tbody для нашей будущей таблицы по выводу статистики дропа

        for (let key in cases) { // Генерация ячеек таблицы и заполнение
            let trContent = document.createElement('tr');
            if (cases[key]['price'] > 20) {
                trContent.classList.add('max');
            }
            tbody.append(trContent);


            let thName = createNewElement('th', trContent, ['text-center', 'ru_name']); // Создаем колонку с названиями кейсов

            let linksItem = createNewElement('a', thName); // Внутри колонки с названиями кейсов создаем ссылку с названием кейса, которая ведет на предмет в ТП стима
            linksItem.innerHTML = cases[key]['ru_name'];
            linksItem.href = template_link_item + cases[key]['eng_name'];
            linksItem.target = 'blank';

            let input_showAccaunts = createNewElement('input', thName, ['form-check-input'], 'flexCheckDefault'); // Создаем чекбокс, который при нажатии будет показывать аккаунты с данными кейсами
            input_showAccaunts.type = 'checkbox';
            input_showAccaunts.setAttribute('data-bs-toggle', 'tooltip');
            input_showAccaunts.setAttribute('data-bs-placement', 'bottom');
            input_showAccaunts.setAttribute('title', 'При нажатии на кнопочку Вы можете узнать на каких аккаунтах имеются данные кейсы');
            let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]')); // bootstrap фишка, которая позволяет показывать подсказки
            tooltipTriggerList.map(function (tooltipTriggerEl) { // bootstrap фишка, которая позволяет показывать подсказки
                return new bootstrap.Tooltip(tooltipTriggerEl);
            });

            input_showAccaunts.addEventListener('click', function () { // При клике на чекбокс делаем так, чтобы показывались аккаунты с этими кейсами
                let self = this.previousElementSibling.innerHTML;
                cases_onLogins[this.previousElementSibling.innerHTML].sort(function (a, b) { // Немного меняем наш изначальный объект с логинами аккаунтов, сортируя их по количеству. Причем сортировка идет от большего к меньшему
                    if (a['quantity'] < b['quantity']) return 1;
                    if (a['quantity'] == b['quantity']) return 0;
                    if (a['quantity'] > b['quantity']) return -1;
                });

                let blockWithaccounts = profileDivContainer.querySelectorAll('.show_accounts'); // Получаем блок, в котором есть аккаунты и удаляем их, чтобы не было дублирования новых блоков при нажатии на кнопку
                for (let i = 0; i < blockWithaccounts.length; i++) {
                    blockWithaccounts[i].remove();
                    login_pass.innerHTML = '';
                    arrowUp.style.display = 'none';
                    arrowBottom.style.display = 'none';
                }

                let checkboxes = tbody.querySelectorAll('.form-check-input'); // Получаем все наши чекбоксы, которые выводят блоки с аккаунтами, где лежат эти кейсы
                for (let i = 0; i < checkboxes.length; i++) {
                    if (this != checkboxes[i]) { // Если текущий чекбокс не равен проходящему, тогда удаляем с него класс show и делаем его не активным
                        checkboxes[i].classList.remove('show');
                        checkboxes[i].checked = false;
                    }
                }

                this.classList.toggle('show');

                if (this.classList.contains('show')) {
                    arrowUp.style.display = 'inline-block';
                    arrowBottom.style.display = 'inline-block';
                    let divRowForAccaunts = document.createElement('div'); // Создание аккордиона, чтобы в него поместить таблицу с нашими аккаунтами
                    divRowForAccaunts.classList.add('row', 'show_accounts');
                    goMainPage.before(divRowForAccaunts);

                    let divColForDivRowForAccaunts = createNewElement('div', divRowForAccaunts, ['col-md-6', 'offset-3']);
                    let accordion = createNewElement('div', divColForDivRowForAccaunts, ['accordion'], 'accordionExample');
                    let accordionItem = createNewElement('div', accordion, ['accordion-item', 'mb-3']);
                    let h2Accordion = createNewElement('h2', accordionItem, ['accordion-header'], 'headingTwo');

                    let buttonAccordion = createNewElement('button', h2Accordion, ['accordion-button', 'collapsed']);
                    buttonAccordion.setAttribute('type', 'button');
                    buttonAccordion.setAttribute('data-bs-toggle', 'collapse');
                    buttonAccordion.setAttribute('data-bs-target', '#collapseTwo');
                    buttonAccordion.setAttribute('aria-expanded', 'false');
                    buttonAccordion.setAttribute('aria-controls', 'collapseTwo');
                    buttonAccordion.innerHTML = 'Показать аккаунты с предметом: ' + '"' + this.previousElementSibling.innerHTML + '"';

                    let divAccordionCollapse = createNewElement('div', accordionItem, ['accordion-collapse', 'collapse'], 'collapseTwo');
                    divAccordionCollapse.setAttribute('aria-labelledby', 'headingTwo');
                    divAccordionCollapse.setAttribute('data-bs-parent', '#accordionExample');

                    let accordionBody = createNewElement('div', divAccordionCollapse, ['accordion-body']);



                    let tableForAccounts = createNewElement('table', accordionBody, ['table', 'table-dark', 'table-hover', 'table-bordered', 'text-center']); // Генерация самой таблицы внутри нашего аккордиона
                    let theadForAccounts = createNewElement('thead', tableForAccounts);
                    let trFortheadForAccounts = createNewElement('tr', theadForAccounts);

                    let thFortrFortheadForAccounts1 = createNewElement('th', trFortheadForAccounts);
                    thFortrFortheadForAccounts1.setAttribute('scope', 'col');
                    thFortrFortheadForAccounts1.innerHTML = 'Логин аккаунта';

                    let thFortrFortheadForAccounts2 = createNewElement('th', trFortheadForAccounts);
                    thFortrFortheadForAccounts2.setAttribute('scope', 'col');
                    thFortrFortheadForAccounts2.innerHTML = 'Количество';



                    let tbody = createNewElement('tbody', tableForAccounts); // Создаем самую важную таблицу для аккаунтов

                    for (let i = 0; i < cases_onLogins[this.previousElementSibling.innerHTML].length; i++) { // В самой важной таблицы заполняем ее создав в ней логины и количество кейсов
                        let tr = createNewElement('tr', tbody);

                        let td_login = createNewElement('td', tr);
                        td_login.innerHTML = cases_onLogins[this.previousElementSibling.innerHTML][i]['login'];

                        let td_quantity = createNewElement('td', tr);
                        td_quantity.innerHTML = cases_onLogins[this.previousElementSibling.innerHTML][i]['quantity'];
                    }




                    let infoGetPassForAcs = createNewElement('h4', accordionBody, ['text-center', 'mb-3']); // Создаем тег h4 с текстом информации о том, как использовать сервервис по подгрузке пароля к логину аккаунта
                    infoGetPassForAcs.innerHTML = 'Вы можете получить аккаунты с данными кейсами в формате логин:пароль, но для этого Вам необходимо загрузить общий файл со всеми аккаунтами и после чего нажать на кнопку "Показать пароли"';

                    let wrapDivForButtons = createNewElement('div', accordionBody, ['mt-2', 'd-flex', 'justify-content-around']); // Создаем обертку для наших будущих кнопочек

                    let getAccounts = createNewElement('input', wrapDivForButtons, ['btn', 'btn-primary', 'file_accounts']); // Создаем кнопочку, которая получает наш загруженный файл
                    getAccounts.type = 'file';

                    let getPassForAccounts = createNewElement('input', wrapDivForButtons, ['btn', 'btn-primary', 'get_pass']); // Создаем кнопку, которая позволяет при нажатии показать все пароли к логинам аккаунтов
                    getPassForAccounts.type = 'submit';
                    getPassForAccounts.value = 'Показать пароли';

                    getAccounts.addEventListener('change', function () { // Получаем наш файл, считываем его и записываем все содержимое файла в div с классом login_pass
                        let file = getAccounts.files[0];

                        let read = new FileReader();

                        read.readAsText(file);

                        read.addEventListener('load', function () {
                            login_pass.innerHTML = read.result;
                        });
                    });

                    getPassForAccounts.addEventListener('click', function () { // Вешаем на нашу кнопочку событие, которое при нажатии позволяет показать нам все аккаунты с данными кейсами в формате логин:пароль
                        let logins = login_pass.textContent.match(/[A-Za-z0-9]{1,}(?=\:)/g); // Считываем все логины с подгружаемого файла
                        let pass = login_pass.textContent.match(/\:[A-Za-z0-9]{1,}/g); // Считываем все пароли с подгружаемого файла
                        let wrapperDivForAccounts = createNewElement('div', accordionBody, ['wrapper-for-accounts', 'mt-3']); // Создаем оболочный див, в который запишем все наши аккаунты

                        let obj = { // Создаем пустой объект, в который потом запишем все наши аккаунты в нужном нам виде
                            'Аккаунты': []
                        };

                        for (let i = 0; i < logins.length; i++) { // Проходим по всем полученным аккаунтам из файла и добавляем в массив объект вида ниже
                            obj['Аккаунты'].push({
                                'login': logins[i],
                                'pass': pass[i]
                            })
                        }


                        for (let i = 0; i < cases_onLogins[self].length; i++) { // Пробегаемся по всем нашим аккаунтам, которые имеют данный кейс
                            let elemForAccountsWithPass = createNewElement('div', wrapperDivForAccounts, ['text-center']); // Создаем нужное кол-во тегов, чтобы затем в него поместить наши новые аккаунты уже с паролем

                            let needAccountsWithPass = obj['Аккаунты'].filter(function (object) { // Проходимя фильтром по всем абсолютно полученным из файла аккаунтам, после чего если есть совпадение с текущим аккаунтом, то получаем этот объект
                                if (object['login'] == cases_onLogins[self][i]['login']) {
                                    return true;
                                } else {
                                    return false;
                                }
                            });

                            elemForAccountsWithPass.innerHTML = needAccountsWithPass[0]['login'] + needAccountsWithPass[0]['pass']; // Записываем полученные данные в наш div в формате логин:пароль
                        }
                    });
                }
            });



            let thQuantity = createNewElement('th', trContent, ['text-center', 'cases']);
            thQuantity.innerHTML = cases[key]['quantity'];

            let statisticCase = createNewElement('th', trContent, ['text-center']);
            statisticCase.innerHTML = ((100 * Number(thQuantity.innerHTML)) / getAllCases(cases)).toFixed(2) + '%';

            let thPrice = createNewElement('th', trContent, ['text-center']);
            thPrice.innerHTML = cases[key]['price'] + ' руб.';

            let totalPriceSteam = createNewElement('th', trContent, ['text-center']);
            totalPriceSteam.innerHTML = (parseInt(thQuantity.innerHTML) * parseFloat(thPrice.innerHTML)).toFixed(2) + ' руб.';

            let totalPriceWithComission = createNewElement('th', trContent, ['totalPriceWithComission']);
            totalPriceWithComission.innerHTML = ((parseFloat(thPrice.innerHTML) - (parseFloat(thPrice.innerHTML) * 0.15)) * parseInt(thQuantity.innerHTML)).toFixed(2) + ' руб.';

            let moneyBori = createNewElement('th', trContent, ['text-center', 'moneyBori']);
            moneyBori.innerHTML = (parseFloat(totalPriceWithComission.innerHTML) * 0.3).toFixed(2) + ' руб.';

            let moneyNasty = createNewElement('th', trContent, ['text-center', 'moneyNasty']);
            moneyNasty.innerHTML = (parseFloat(totalPriceWithComission.innerHTML) * 0.7).toFixed(2) + ' руб.';
        }



        let moneyBoriArr = document.querySelectorAll('.moneyBori'); // Получаем все ячейки с ЧП Бори
        let moneyNastyArr = document.querySelectorAll('.moneyNasty'); // Получаем все ячейки с ЧП Насти

        var profileDivContainer = createNewElement('div', document.body, ['container', 'info']); // Создаем основном div, в котором будут храниться профили участников фарма
        let profileDivContainerDivRow = createNewElement('div', profileDivContainer, ['row']);

        profile(profileDivContainerDivRow, 'Борис', 'images/unknown0.png', moneyBoriArr);
        profile(profileDivContainerDivRow, 'Анастасия', 'images/fox 1.jpg', moneyNastyArr, 'offset-md-2');


        let totalCases = createNewElement('p', profileDivContainerDivRow, ['gc', 'text-center', 'mt-5']); // Создаем строчку с общем кол-вом кейсов
        totalCases.innerHTML = 'Итого общее количество кейсов: ' + getAllCases(cases);


        let totalProfitAll = document.querySelectorAll('.totalPriceWithComission'); // Получаем массив элементов, в котором написана общая прибыль
        let totalProfit = createNewElement('p', profileDivContainerDivRow, ['gc', 'text-center']); // Создаем строчку с общей прибылью
        totalProfit.innerHTML = 'Суммарно общая прибыль: ' + getSum(totalProfitAll) + ' руб.';


        var goMainPage = createNewElement('button', profileDivContainerDivRow, ['btn', 'btn-danger', 'text-center', 'mainPage'], 'bottom'); // Создаем кнопку, для возврата на главную страницу
        goMainPage.innerHTML = 'Вернуться на главную страницу';

        goMainPage.addEventListener('click', function () { // При нажатии на кнопку возвращаемся в главное меню
            table.remove();
            profileDivContainer.remove();
            mainBlock.style.display = 'block';
            drops_file.innerHTML = '';
            buttonAddFiles.value = '';
            arrowUp.style.display = 'none';
            arrowBottom.style.display = 'none';
        });




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

        function createNewElement(selectorElem, parentElement, classNames = undefined, idValue = undefined) { // Функция, которая позволяет создать новый тег на страницу и добавить его в нужное место, при этом с добавлением нужных классов и id
            let newElem = document.createElement(selectorElem);
            if (classNames !== undefined) {
                newElem.classList.add(...classNames);
            }
            if (idValue !== undefined) {
                newElem.id = idValue;
            }
            parentElement.append(newElem);

            return newElem;
        };

        function profile(selector, name, photo, money, offset = undefined) { // Функция, для генерации профиля человека, участвующего в долевом фарме
            let profile = createNewElement('div', selector, ['col-md-5', 'text-center', 'profile']);
            if (offset !== undefined) {
                profile.classList.add(offset);
            }

            let namePerson = createNewElement('h2', profile);
            namePerson.innerHTML = name;

            let photoPerson = createNewElement('img', profile, ['img-fluid']);
            photoPerson.src = photo;

            let cleanMoney = createNewElement('p', profile);
            cleanMoney.innerHTML = 'Чистая Прибыль: ' + getSum(money) + ' руб.';

            let genDiv = createNewElement('div', profile, ['block']);

            let span = createNewElement('span', genDiv);
            span.innerHTML = 'Рассчитать вывод в реальные деньги';

            let div = createNewElement('div', genDiv, ['form-check', 'form-switch']);

            let input = createNewElement('input', div, ['form-check-input'], 'flexSwitchCheckDefault');
            input.type = 'checkbox';


            let quantity_key_tf2 = Math.floor(Number(getSum(money)) / price_key_tf2); // Три строчки рассчета для вывода денег из стима
            let conclusion_real_money = quantity_key_tf2 * actual_price_onBOTkeyTf2;
            let remains_moneyOnSteam = (Number(getSum(money)) - (quantity_key_tf2 * price_key_tf2)).toFixed(2);


            let real_moneyDiv = createNewElement('div', profile, ['real_money']); // Для подсчета вывода виртуально полученных денег из игры в реальные
            real_moneyDiv.style.display = 'none';

            let real_moneyH3 = createNewElement('h3', real_moneyDiv);
            real_moneyH3.innerHTML = 'Qiwi Wallet: ' + conclusion_real_money + ' руб.';

            let real_moneyH4 = createNewElement('h4', real_moneyDiv);
            real_moneyH4.innerHTML = 'Остаток денег на балансе STEAM после вывода: ' + remains_moneyOnSteam + ' руб.';

            let real_moneyP = createNewElement('p', real_moneyDiv);
            real_moneyP.innerHTML = '*Вывод происходится с помощью бота по продаже ключей из игры Team Fortes 2. Цена ключа на данный момент составляет ' + actual_price_onBOTkeyTf2 + ' рубля/штука';

            input.addEventListener('click', function () { // Логика переключателя. Если включен, то будет выводить информацию о выводе денег в реал, если выключен, то не будет
                this.classList.toggle('active');

                if (input.classList.contains('active')) {
                    real_moneyDiv.style.display = 'block';
                } else {
                    real_moneyDiv.style.display = 'none';
                }
            });
        };
    } else {
        alert('Пожалуйста, выберите файлы для отображения статистики');
    }
};