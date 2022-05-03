## Привет, меня зовут Илья и это доработка моего решения для Crypton!

##### В данном задании я реализовал простой контракт с динамическим добавлением одновременно выполняющихся голосований.

##### Немного пройдемся по заданию подробнее.

---

>___В папке contracts создан .sol файл, который содержит код контракта___

\> [Voting.sol](https://github.com/ilkatel/Voting/blob/47ef5501b2ee203e3da626c9501448e97e45a471/contracts/Voting.sol#L1)

>___В контракте имеется функция создания голосования___

\> [function addVoting](https://github.com/ilkatel/Voting/blob/47ef5501b2ee203e3da626c9501448e97e45a471/contracts/Voting.sol#L57)

>___В контракте имеется функция голосования___

\> [function vote](https://github.com/ilkatel/Voting/blob/47ef5501b2ee203e3da626c9501448e97e45a471/contracts/Voting.sol#L72)

>___В контракте имеется функция завершения голосования___

\> [function finishVoting](https://github.com/ilkatel/Voting/blob/47ef5501b2ee203e3da626c9501448e97e45a471/contracts/Voting.sol#L92)
Помимо этого, данная функция сразу отправляет средства победителю.

>___В контракте имеется функция вывода комиссии___

\> [function withdraw](https://github.com/ilkatel/Voting/blob/47ef5501b2ee203e3da626c9501448e97e45a471/contracts/Voting.sol#L107)

>___В контракте имеются дополнительные view функции для вывода информации о голосовании и участниках___

\> [function getCandidates](https://github.com/ilkatel/Voting/blob/47ef5501b2ee203e3da626c9501448e97e45a471/contracts/Voting.sol#L115) возвращает адреса всех участников голосования;

\> [function getVotes](https://github.com/ilkatel/Voting/blob/47ef5501b2ee203e3da626c9501448e97e45a471/contracts/Voting.sol#L119) возвращает количество голосов за конкретного кандидата;

\> [function getWinner](https://github.com/ilkatel/Voting/blob/47ef5501b2ee203e3da626c9501448e97e45a471/contracts/Voting.sol#L123) возвращает адрес лидирующего кандидата;

\> [function getBalance](https://github.com/ilkatel/Voting/blob/47ef5501b2ee203e3da626c9501448e97e45a471/contracts/Voting.sol#L127) возвращает баланс контракта;

\> [function getTimeLeft](https://github.com/ilkatel/Voting/blob/47ef5501b2ee203e3da626c9501448e97e45a471/contracts/Voting.sol#L131) возвращает оставшееся время указанного голосования в Unix формате.

> ___В проекте утсановлен solidity-coverage и имеются тесты, обеспечивающие полное покрытие по всем показателям___

\> Все тесты располагаются в папке [test](https://github.com/ilkatel/Voting/blob/47ef5501b2ee203e3da626c9501448e97e45a471/test/tests.js#L1);

\> Для удобства тесты запускаются в сети hardhat с помощью [скрипта](https://github.com/ilkatel/Voting/blob/47ef5501b2ee203e3da626c9501448e97e45a471/package.json#L8);

\> Реализовано полное покрытие;

\* Некоторые тесты показывают большое время выполнения (около трех секунд) из-за функции засыпания, реализованной для возможности завершения голосования по истечению его времени.

![Покрытие тестов](images/img_coverage.jpg)

> ___В папке scripts имеется скрипт для публикации контракта в одну из тестовых сетей___

\> [Скрипт](https://github.com/ilkatel/Voting/blob/47ef5501b2ee203e3da626c9501448e97e45a471/scripts/deploy.js#L1) публикует контракт в сеть Rinkeby, которая [установлена по умолчанию](https://github.com/ilkatel/Voting/blob/47ef5501b2ee203e3da626c9501448e97e45a471/hardhat.config.js#L19).

> ___В папке tasks имеются hardhat task'и, позволяющие взаимодействовать с опубликованным контрактом___

\> Для примера [все task'и](https://github.com/ilkatel/Voting/blob/47ef5501b2ee203e3da626c9501448e97e45a471/tasks/tasks.js#L11) выполняются от лица владельца контракта.

\> Рассмотрим несколько примеров
* [Добавление голосования](https://github.com/ilkatel/Voting/blob/47ef5501b2ee203e3da626c9501448e97e45a471/tasks/tasks.js#L94)

![Добавление голосования](images/img_addVoting.jpg)

* [Участие в голосовании](https://github.com/ilkatel/Voting/blob/47ef5501b2ee203e3da626c9501448e97e45a471/tasks/tasks.js#L144):

![Участие в голосовании](images/img_vote.jpg)

* [Завершение голосования](https://github.com/ilkatel/Voting/blob/47ef5501b2ee203e3da626c9501448e97e45a471/tasks/tasks.js#L160):

Пример откаченной транзакции (голосование еще идет)
![Завершение голосования](images/img_finishVoting.jpg)

* [Получение списка участников](https://github.com/ilkatel/Voting/blob/47ef5501b2ee203e3da626c9501448e97e45a471/tasks/tasks.js#L112):

![Получение списка участников](images/img_getCandidates.jpg)

* [Получение голосов участника](https://github.com/ilkatel/Voting/blob/47ef5501b2ee203e3da626c9501448e97e45a471/tasks/tasks.js#L121):

![Получение голосов участника](images/img_getVotes.jpg)

* [Получение текущего лидера](https://github.com/ilkatel/Voting/blob/47ef5501b2ee203e3da626c9501448e97e45a471/tasks/tasks.js#L132):

![Получение текущего лидера](images/img_getWinner.jpg)

* [Получение оставшегося времени](https://github.com/ilkatel/Voting/blob/47ef5501b2ee203e3da626c9501448e97e45a471/tasks/tasks.js#L85):

![Получение оставшегося времени](images/img_getTimeLeft.jpg)

Время возвращается в Unix формате

* [И некоторые другие функции](https://github.com/ilkatel/Voting/blob/47ef5501b2ee203e3da626c9501448e97e45a471/tasks/tasks.js#L54)

* Также написаны [вспомогательные функции](https://github.com/ilkatel/Voting/blob/47ef5501b2ee203e3da626c9501448e97e45a471/tasks/tasks.js#L7), в том числе для [читабельного вывода ошибок](https://github.com/ilkatel/Voting/blob/47ef5501b2ee203e3da626c9501448e97e45a471/tasks/tasks.js#L46)

---
### Немного подробнее

Контракт служит для проведения голосований, для участия в которых необходимо внести 0.01 ETH и указать адрес кандидата. По истечению времени, отведенного на голосование, завершить его сможет любой пользователь, а все вырученные средства, за исключением комиссии в 10%, отправятся победителю. Комиссия же останется на котнракте и вывести ее сможет в любой моммент владелец контракта.

Победитель может быть только один, а занимает лидерство кандидат, первым набравший максимальное количество голосов. Определение текущего победителя происходит при каждом отданном голосе.

Голосования могут быть добавлены динамически владельцем контракта, а обращаться к существующим голосованиям можно по индексу.

_Помимо этого, важно отметить, что далеко не всю информацию можно получить путем view функций, поскольку обратиться к большинству значений можно напрямую, а большая часть существующих view функций созданы исключительно по заданию._

---

Текущий адрес развернутого контракта [0x0Fb063EfA85288732dc4a5606a4c44c083eEEcdc](https://rinkeby.etherscan.io/address/0x0Fb063EfA85288732dc4a5606a4c44c083eEEcdc)
```diff
@@ by ilkatel @@
```
