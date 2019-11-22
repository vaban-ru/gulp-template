# Пустой шаблон для сайта

## Подготовка к работе

Для начала работы необходимо наличие Node.js в системе. А так же должен быть глобально установлен `gulp-cli`.
Затем устанавливаем все зависимости `npm i --save-dev` или `yarn install`

## Структура проекта

### CSS
В папке `css` изначально лежит сброс стилей и сетка от Bootstrap 4. Туда же можно закидывать остальные CSS библиотеки, они будут подключаться сами. 

### SCSS
В папке лежит `app.scss` для кастомного кода. И несколько вспомогательных файлов: `_variables.scss` для переменных, `_responsive.scss` для адаптивки, `_mixins.scss` для миксинов.

### JS
В папке `js` лежит `app.js` для кастомного кода, и `ofi.min.js` - полифил для CSS-свойства `object-fit`. Туда так же можно закидывать JS библиотеки и они будут подключаться автоматически.

jQuery последней версии автоматически добавляется в билд.

### Fonts
Папка для шрифтов, закидываем и они переносятся в прод-версию.

### Img
Папка для изображений, при работе графика оптимизируется и переносится в прод. Так же автоматически создаются WebP

### HTML
В корне лежит `index.html` для основного кода, и в папке `templates` другие части проекта.

## Миксины и прочее
Изначально есть пара полезных миксинов:
 - `@include font-face("FuturaPT", "/fonts/FuturaPT-Book", 300);` - позволяет подключать шрифты в 1 строку.
 - `@include object-fit(cover)` - используется для полифила CSS-свойства object-fit
 - На тег `html` автоматически вешается класс `is-mac` или `is-ios` для определения устройства
 
 ## Верстка
Команды для сборки:
 - `gulp` запускает сборку и локальный сервер с Hot Reloading
 - `gulp dev` запускает сборку и на выходе получаем не минифицированные  файлы app.js и app.css
 - `gulp build` запускает сборку и на выходе получаем минифицированные файлы app.js и app.css
  