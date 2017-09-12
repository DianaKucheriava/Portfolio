var testSystem;

/**
 * Проверка доступности localStorage
 * @returns {boolean} true - браузер поддерживает LocalStorage
 */
function checkLocalStorage()
{
    try {
        return 'localStorage' in window && window['localStorage'] !== null && localStorage != undefined;
    } catch (e) {
        return false;
    }
}

/**
 *  Загрузка тестов (пунктов меню) существующих в localStorage тестов
 */
function loadItemsFromLocalStorage()
{
    if (!checkLocalStorage())
    {
        return;
    }
    var template = '<div class="b-page-test-switch__item b-page border-radius" index="{1}">{0}</div>';
    var target = $(".b-page-test-switch");

    for (var i = 0; localStorage["ExpertSys" + i]; i++)
    {
        target.html(target.html() + template.replace("{1}","ExpertSys" + i).replace("{0}",JSON.parse(localStorage["ExpertSys" + i]).title));

    }
}

/**
 * Загрузка теста с localStorage
 * @param localStorageIndex - индекс теста
 * @returns {Test} тест (база знаний) для экспертной системы
 */
function loadFromLocalStorage(localStorageIndex)
{
    return new Test(JSON.parse(localStorage[localStorageIndex]));
}

/**
 * Сохранение теста (базы знаний) в localStorage (при условии поддержки оного браузером)
 * @param test - сохраняемый тест (база знаний)
 */
function saveToLocalStorage(test)
{
    if (!checkLocalStorage())
    {
        return;
    }
    for (var i = 0; localStorage[i]; i++)
    {
        if (localStorage["ExpertSys"+i].match(test.title))
        {
            localStorage.setItem("ExpertSys" + i,test.stringify());
            return;
        }
    }
    localStorage.setItem("ExpertSys" + i,test.stringify());
}

/**
 * Реакция нажатия кнопки "далее". реакция на ввод данных и переход к следующему вопросу
 */
function step()
{
    var ans = parseFloat($("#current-answer").attr("value"));
    if (ans < 0 || ans > 100) {
        alert("Неверный ввод!");
        return;
    }
    testSystem.processAnswer(ans);
    testSystem.nextStep();
}

/**
 * Инициализация. Реакция на кнопки  и т.п.
 */
function init()
{
    loadItemsFromLocalStorage();
    /**
     * Выбор теста. Его загрузка с localStorage, либо парсинг с textarea
     */
    $("#start-test").bind("click keypress",function()
    {

        if ($(".b-page-test-switch__selected") && $(".b-page-test-switch__selected").length > 0)
        {
            testSystem = loadFromLocalStorage($(".b-page-test-switch__selected").attr("index"));
        }
        else
        {
            testSystem = new Test();
            if (!testSystem.parseData($("#test").val()))
            {
                alert("Ви зробили помилку. Перевірте данні що ввели, більш за все Ви десь забули відступити.")
                return;
            }
            saveToLocalStorage(testSystem);
        }

        $("#test").addClass("hide");
        $(".b-page-test").removeClass("hide");
        $(".b-page-main").add("#start-test,#data-format").addClass("hide");
        $("#test-title").html(testSystem.title);

        testSystem.nextStep();
    });

    /**
     * Enter == кнопки далее при вводе вероятности
     */
    $("#current-answer").bind('keydown ',function(e)
    {
        if (e.keyCode == 13) step();
    });
    $("#complete-answer").bind("click keypress", step);

    /**
     * визуализация выбора теста
     */
    $(".b-page-test-switch__item").live("click keypress", function()
    {
        if ($(this).hasClass("b-page-test-switch__selected"))
        {
            $(this).removeClass("b-page-test-switch__selected");
            return;
        }
        $(".b-page-test-switch__selected").removeClass("b-page-test-switch__selected");
        $(this).addClass("b-page-test-switch__selected");
    });

    $("#data-format").bind("click keypress",function()
    {
        $("#test").val(
            
                "Визначення полу\n" +
                "\n" +
                "Ви хлопчик?\n"+
                "Ви дівчинка?\n"+
                "\n"   +
                "Хлопчик\n" +
                "0.5 1) 1 0 2) 0 1\n" +
                "Дівчинка\n"+
                "0.5 2) 1 0 1) 0 1" 
              );


    })  ;
     $(".test2").bind("click keypress",function()
    {
        $("#test").val(
            
                "Вибір спеціальності\n" +
                "\n" +
               "Ви маєте здатність міркувати в строго логічній послідовності?\n" +
"У Вас добре виходить будувати креслення?\n" +
"Ви відноситесь до будь-якої роботи старанно і ретельно?\n" + 
"Ви організована людина?\n" + 
"Ви комунікабельна людина і любите працювати в команді?\n" + 
"У Вас є бажання працювати з великим обсягом інформації?\n" +
"Ви завжди приходите на зустріч вчасно?\n" +
"У Вас є талант креативного мислення?\n" + 
"Ви вільно володієте або прагнете володіти англійською мовою?\n" + 
"Ви здатні сприймати без агресії думки які відрізняються від Ваших?\n" +
"Ви дбайливо і уважно ставитесь до намірів людей?\n" +
"Ви відкриті до спілкування?\n" +
"Ви вмієте добре слухати і спокійно пояснювати?\n" + 
"Ви цікавить машинобудівна галузь?\n" + 
"Вас цікавить електронний процес в напівпровідниках і їх використання в цілях перетворення і передачі інформації?\n" +
"Вас цікавить розробка програм які керують виробничим?\n" +
"Ви хотіли б вивчати мови програмування С/C++/C#(.NET)?\n" +
"Ви б хотіли навчитись створювати 2D/3D графіку?\n" + 
"Чи знайомі Ви з організацією баз даних?\n" +
"Вам подобається проводити аналіз?\n" + 
"Ви б хотіли навчитись будувати інформаційні системи?\n" +
"Ви б хотіли займатись розробкою програмних бібліотек?\n" +
"Чи хотіли б Ви займатись розробкою баз даних?\n" +
"Чи хотіли б Ви займатись моделюванням та програмуванням ігор?\n" + 
"Чи б хотіли Ви займатись розробкою веб-додатків?\n" + 
"Чи хотіли б ви писати ігри та додатки для Android?\n" + 
"Ви хотіли б займатись комп’ютерною графікою?\n" + 
"Ви досить спокійна і терпелива людина?\n" +
"Ви можете досить швидко переключатись з однієї роботи на іншу?\n" + 
"Ви однаково добре виконуєте рутинну роботу і креативну?\n" + 
"У вас відсутні математичні здібності?\n" + 
"Ви досить швидко втомлюєтесь?\n" + 
"Ви відповідальна і наполеглива особистість?\n" + 
"Ви вмієте проводити опитування і задавати питання?\n" + 
"Ви стресостійка людина ?\n" + 
"Ви постійно прагнете вивчити щось нове?\n" + 
"Ви працюєте над собою, ставите правильні цілі і досягаєте їх?\n" +
"Чи хотіли б Ви навчитись створювати системне програмне забезпечення?\n" +
"Чи цікавились Ви архітектурою комп’ютера?\n" + 
"Чи хотіли б Ви проводити діагностику, конструювання та ремонт електронного устаткування?\n" +
"Вам подобається фізика?\n" + 
"Ви врівноважена людина?\n" + 
"Ви дуже точна до дрібниць, і надзвичайно ретельна людина?\n" + 
 "\n" +
 "КІС\n" +
"0.9 1) 0.95 0 2) 0.95 0.05 3) 0.95 0.05 38) 0.9 0.1 39) 0.9 0.1 40) 0.9 0.1 41) 0.9 0.1 42) 0.9 0.1 43) 0.9 0.1\n" +
"ІВМ_ПМА\n" +
"0.8 1) 0.85 0.15 13) 0.95 0.05 34) 0.9 0.1 35) 0.9 0.1 5) 0.95 0.05 36) 0.9 0.1 37) 0.9 0.1 6) 0.8 0.2 7) 0.8 0.2 8) 0.8 0.2 9) 0.8 0.2\n" +
"ІВМ_СОІ\n" +
"0.7 1) 0.8 0 27) 0.9 0.1 28) 0.9 0.1 29) 0.9 0.1 30) 0.9 0.1 10) 0.8 0.2 11) 0.8 0.2 12) 0.8 0.2 13) 0.8 0.2 31) 0.1 0.9 32) 0.1 0.9 33) 0.9 0.1\n" +
"ЕА\n" +
"0.9 1) 0.9 0.1 2) 0.9 0.1 3) 0.9 0.1 4) 0.9 0.1 5) 0.9 0.1 6) 0.9 0.1 7) 0.9 0.1 8) 0.9 0.1 9) 0.9 0.1 10) 0.9 0.1 11) 0.9 0.1 12) 0.9 0.1 13) 0.9 0.1\n" +
"ІУС_КН\n" +
"0.8 1) 0.85 0 20) 0.9 0.1 21) 0.9 0.1 22) 0.9 0.1 23) 0.9 0.1 24) 0.9 0.1 25) 0.9 0.1 26) 0.9 0.1\n" +
"ІУС_АК\n" +
"0.9 1) 0.95 0.05 14) 0.9 0.1 15) 0.9 0.1 16) 0.9 0.1 17) 0.9 0.1 18) 0.9 0.1 19) 0.9 0.1" 

              );


    })  ;
      $(".test3").bind("click keypress",function()
    {
        $("#test").val(
            
                "Вибір мови програмування\n" +
                "\n" +
                "Ви бажаєте працювати з программи для операційної системи?\n" +
"Ви бажаєте писати драйвери пристроїв?\n" +
"Ви бажаєте писати корисні і цікаві програми для операційної системи?\n" +
"Ви бажаєте писати корисні програми для мобільних пристроїв?\n" +
"Ви бажаєте писати web-сайти і отримувати за це прибуток?\n" +
"Чи хотіли б ви займатися системним програмуванням?\n" +
"Чи готові ві вивчати стандартні бібліотеки для програмування?\n" +
"Чи готові ви вивчати високорівневі мови програмування?\n" +
"Чи хотіли б ви писати ігри, віконні програми, програми – сервіси, серверні програми, спеціалізовані редактори,  унікальні віджети тощо?\n" +
"Чи хотіли б ви вивчати мову без якої важку уявити інтернет?\n" + 
"Ви бажаєте вивчати мову яка не потребує багато зусиль?\n" +
"Ви хочете вивчати найвідомішу і сучаснішу мову програмування?\n" +
"Вам подобається 3D графіка?\n" +
"Ви взахваті від інтернет ігор?\n" +
"Вам подобається користуватись програмами на Аndroid і ви хочете розроблювати власні?\n" +
"Ви б хотіли створювати інтернет-блоги, інтернет-сайти чи магазини?\n" +
"Ви б хотіли далі працювати в галузі бізнесу?\n" +
"Ви б хотіли створювати програмне забезпечення для взаємодії з іншими комп'ютерами у мережі?\n" +
"Ви прагнете вже через 1-2 місяці вільно створювати власні программи?\n" +
"Ви прагнете бути досить цінним спеціалістом?\n" +
"Ви прагнете вивчати мову яка входить у 10 найкращих?\n" +
"Ви б хотіли писати невеличкі программи що виконуються за запитом користувача?\n" +
"Ви б хотіли вивчати просту і популярну мову на ринку?\n" + 
"Ви б хотіли писати коди як легко читати?\n" +
"Ви б хотіли вивчати мову яку можуть вивчити навіть діти?\n" +
"Ви хочете вберегти нерви і час маючи досить велику бібліотеку?\n" +
"Ви хотіли б вивчати мову яка дітям буде даватися трохи складніше?\n" +
"Ви вже не новачок у програмуванні?\n" +
"Ви б хотіли вивчити універсальну мову програмування?\n" +
"Ви б хотіли вивати мінімалістичну мову програмування?\n" + 
                "\n"   +
                "Java\n" +
"0.463 3) 0.9 0.01 4) 1 0 8) 1 0 9) 1 0 10) 0.9 0.01 11) 0.3 0.7 12) 1 0 13) 0.9 0.1 15) 1 0 17) 1 0 18) 0.9 0.01 21) 1 0 27) 1 0 28) 1 0\n" +
"Python\n" +
"0.333 3) 0.8 0.01 11) 0.2 0.8 16) 1 0 18) 1 0 20) 1 0 21) 1 0 23) 1 0 24) 1 0 25) 1 0 26) 1 0 28) 1 0\n" +
"PHP\n" +
"0.35 5) 1 0 10) 1 0 11) 1 0 12) 0.9 0.01 19) 1 0 20) 0.9 0.01 21) 1 0 22) 1 0 24) 0.9 1 26) 0.8 1, 28) 1 0\n" +
"C\n" +
"0.276 1) 0.9 0.01 2) 0.8 0.01 6) 0.9 0.01 7) 0.8 0.01 9) 1 0 14) 0.1 0.01 20) 0.8 0.2 21) 1 0 28) 0 1 29) 1 0 30) 1 0\n" +
"С++\n" +
"0.393 1) 1 0.01 2) 0.9 0.01 5) 1 0 6) 1 0.01 7) 1 0 8) 1 0 9) 1 0 12) 1 0.01 13) 1 0 14) 0.9 0.1 15) 0.9 0.01 18) 1 0.01 21) 1 0 28) 0 1"

              );


    })  ;
}

window.onload = init;

/**
 *  Сортировка вероятностей. Сравнение двух items
 * @returns {number} сравнение
 */
function sortItems(a,b)
{
    if (a.points > b.points || (a.points == b.points && a.title > b.title)) return 1;
    if (a.points == b.points && a.title == b.title) return 0;
    return -1;
}


/**
 * сравнение двух объектов - вопросов
 */
function sortQuestion(a,b)
{

    var aPoints = 0, bPoints = 0;
    for (var i = 0; i < a.items.length; i++)
    {

        aPoints += a.items[i].questionPoints[a.index].min + a.items[i].questionPoints[a.index].max + a.items[i].points;
    }
    for (var i = 0; i < b.items.length; i++)
    {
        bPoints += b.items[i].questionPoints[b.index].min + b.items[i].questionPoints[b.index].max + b.items[i].points;
    }

    if (aPoints > bPoints) return -1;
    if (aPoints == bPoints)
    {
        if (a.items.length > b.items.length) return -1;
        if (a.items.length == b.items.length) return 0;
    }
    return 1;
}

/**
 * База знаний или тест.
 * @param testObject - конструктор с уже введенных названий, вариантов и вопросов
 * @constructor
 */
function Test(testObject)
{

    this.title = "";
    this.items = [];
    this.questions = [];
    this.currentQuestion = -1;
    this.complete = false;
    if (testObject)
    {
        this.title = testObject.title;
        this.items = testObject.items;
        this.questions = testObject.questions;
    }
}

/**
 * сериализация в строку, формата JSON
 * @returns {String} JSON
 */
Test.prototype.stringify = function()
{
    return JSON.stringify({
        title       : this.title,
        items       : this.items,
        questions   : this.questions
    });
}

/**
 * Вывод "вероятностей" ответов по заданному шаблону
 */
Test.prototype.printData = function()
{
    this.items.sort(sortItems);
    var template = '<div title="{0}: {1}" class="b-page-test-items__item border-radius"><span class="b-page-test-items__item-title">{0}</span><span class="b-page-test-items__item-percent">{1}</span></div>';
    var t = $(".b-page-test-items");
    t.html("");
    for (var i = this.items.length-1; i >= 0; i--)
    {
        var res = this.items[i].points > 1? 1 : this.items[i].points;
        t.html(t.html() + template.replace("{0}",this.items[i].title).replace("{0}",this.items[i].title).replace("{1}",res).replace("{1}",res));
        if (res == 1)
        {
            this.complete = true;
        }
    }
}

/**
 * Переход к следующему вопросу
 */
Test.prototype.nextStep = function()
{

    this.printData();
    this.questions.sort(sortQuestion);
    if (this.questions.length == 0 || this.complete)
    {
        $("#current-question").html("Ознайомтесь з результатами системи. Питання закінчені.");
        $("#complete-answer").add("#current-answer").addClass("hide");
        return;
    }
    $("#current-question").html(this.questions[0].q);
    $("#current-answer").attr("value",'');
};

/**
 * обработка ответа. Измненение вероятности события по ответу
 * @param ans  - ответ (вероятность, от 0 до 100)
 */
Test.prototype.processAnswer = function(ans)
{
    for (var i = 0 ; i < this.items.length; i++)
    {
        var point = this.items[i].questionPoints[this.questions[0].index];
        if (point)
        {
            var up = ((2*point.max - 1)*ans/100 + 1 - point.max) * this.items[i].points;
            var down = ((2*point.max - 1)*ans/100 + 1 - point.max) * this.items[i].points + ((2*point.min - 1)*ans/100 + 1 - point.min)*(1 - this.items[i].points);
            this.items[i].points = down != 0? up/down : this.items[i].points;
        }
    }
    var template = '<div class="b-page-questions__answers-item">{0}</div>'
    $("#answers").html($("#answers").html() + template.replace("{0}", this.questions[0].q))
    this.questions.shift();
}

/**
 * Получение вопросов, событий и вероятностей с строки
 * @param data - строка, содержащая данные
 * @returns {boolean} успех обработки строки
 */
Test.prototype.parseData = function(data)
{
    try
    {
        //Пропуск лишних, пустых строк
        var passEmptyStrings = function() {
            while (position < items.length && items[position] == "" ) { position++; }
        }

        var items = data.split("\n");
        var position = 0;
        passEmptyStrings();
        this.title = items[position++];
        passEmptyStrings();
        //Ввод вопросов
        while (items.length > position && items[position] != "")
        {
            this.questions.push({
                q    :items[position++],
                items: [],
                index:this.questions.length
            });
        }
        if (items.length <= position) throw "Invalid data format";

        passEmptyStrings();

        var index = 0;
        //Ввод событий
        while (items.length > position && items[position] != "")
        {
            var  pointItems = items[position + 1].split(" ");
            var newItem = {
                title          : items[position],
                points         : parseFloat(pointItems[0]),
                index          : index,
                questionPoints : []
            };
            //Вероятности событий при 100 и 0% вероятностях ответа на вопрос
            for (var i = 1; i < pointItems.length; i+= 3)
            {
                while (pointItems[i] == "") i++;
                var questionIndex = parseFloat(pointItems[i]) - 1;
                var questionPoint = {
                    max : parseFloat(pointItems[i+1]),
                    min : parseFloat(pointItems[i+2])
                };
                newItem.questionPoints[questionIndex] = questionPoint;

                this.questions[questionIndex].items.push(newItem);


            }

            this.items.push(newItem);
            index++;
            position += 2;
        }
        return true;
    }
    catch(e)
    {
        console.log(e);
        return false;
    }
}

