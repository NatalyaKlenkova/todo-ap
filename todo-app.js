(function () {
    let todoStorage = [];
    let userName = '';

    // функция для генерации id
    function createID(array) {
        let max = 0;
        for (let i = 0; i < array.length; i++) {
            if (array[i].id > max) {
                max = array[i].id;
            }
        }
        return max += 1;
    }

    // создаем и возвращаем заголовок приложения
    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }

    // создаем и возвращаем форму для создания дела
    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'введите название нового дела';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.textContent = 'Добавить дело';
        button.disabled = true;


        input.addEventListener('keyup', function () {
            if (input.value !== '') {
                button.removeAttribute('disabled');
            } else {
                button.disabled = true;
            }
        })

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        return {
            form,
            input,
            button
        };
    }

    // создаем и возвращаем список элементов
    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }

    // создаем элемент в списке дел
    function createTodoItem(object) {
        let item = document.createElement('li');
        // кнопки помещаем в элемент, который красиво покажет их в одной группе
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        // устанавливаем стили для элемента списка, а также для размещения кнопок в его правой части с помощью flex
        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-utems-center');
        item.textContent = object.name;

        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';

        // вкладываем кнопки в отдельный элемент, чтобы они объединились в один блок
        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);

        // приложению нужен доступ к самому элементу и кнопкам, чтобы обработать события нажатия
        return {
            item,
            doneButton,
            deleteButton,
        };
    }


    function createTodoApp(container, title = 'Список дел', defaultArray, user) {
        let todoAddTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();
        userName = user;

        container.append(todoAddTitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        // функция для создания дела из объекта хранилища
        function createStorageTodoItem(object, array) {
            array.push(object);
            let todoItem = createTodoItem(object);
            todoList.append(todoItem.item);

            if (object.done === true) {
                todoItem.item.classList.add('list-group-item-success')
            };

            todoItem.doneButton.addEventListener('click', function () {
                object.done = !object.done;
                todoItem.item.classList.toggle('list-group-item-success');
                saveTodos(array, userName);
            });
            todoItem.deleteButton.addEventListener('click', function () {
                if (confirm('Вы уверены?')) {
                    for (let i = 0; i < array.length; i++) {
                        if (array[i].id === object.id) {
                            array.splice(i, 1);
                            break
                        }
                    };
                    todoItem.item.remove();
                    saveTodos(array, userName);
                }
            });
        };
        
        // получаем объекты из локального хранилища браузера и перезаписываем в дефолтный массив
        let localData = localStorage.getItem(userName);
        if (localData !=='' && localData !== null) {
            defaultArray = JSON.parse(localData);
        }

        // добавляем объекты из дефолтного в хранилище и создаем из них дела
        if (defaultArray) {
            for (let defaultObject of defaultArray) {
                defaultObject.id = createID(todoStorage);
                createStorageTodoItem(defaultObject, todoStorage);
                saveTodos(todoStorage, userName);
            }
        }

        // браузер создает событие submit на форме по нажатию на Enter или на кнопку создания дела
        todoItemForm.form.addEventListener('submit', function (evt) {
            // эта строчка необходима, чтобы предотвратить стандартное действие браузера
            // в данном случае мы не хотим, чтобы страница перезагружалась после отправки формы
            evt.preventDefault();

            // игнорируем создание элемента, если пользователь ничего не ввел в поле
            if (!todoItemForm.input.value) {
                return;
            }

            // создаем новый объект из формы для ввода и добавляем его в хранилище
            let newTodoObject = {
                name: todoItemForm.input.value,
                done: false,
                id: createID(todoStorage),
            };

            createStorageTodoItem(newTodoObject, todoStorage);  
            saveTodos(todoStorage, userName);

            // обнуляем значение в поле, чтобы не пришлось стирать его вручную
            todoItemForm.input.value = '';
        });
    }

    // функция для сохранения списка дел в локальном хранилище браузера
    function saveTodos(array, listName) {
        localStorage.setItem(listName, JSON.stringify(array));
    }

    window.createTodoApp = createTodoApp;
})();