


## Extension commands

* `extension.StartApp` calld by `Module: New Project"` - it's to create the necessary folders and files for selected board by template project

### 0.1.0

Реализовано создание проекта для плыта MC121.01 для ядер fixed или float.

Работа с расширением начинается с вызова окна создания проекта Ctrl+Shift+P -> "Module: New Project" ![VsCode MasterProjects](./images/mp-screen1.png) ![VsCode MasterProjects](./images/mp-screen2.png)

После появления окна создания проекта введите необходимые параметры ![VsCode MasterProjects](./images/mp-screen3.png)

Далее необходимо нажать кнопку "Создать проект". ![VsCode MasterProjects](./images/mp-screen4.png)

Созданный проект откроется в новом окне VS Code и попросит выбрать набор компиляторов: ![VsCode MasterProjects](./images/mp-screen5.png)  

Обратите внимание, что в созданном проекте, необходимо будет открыть файл ./.vscode/lounch.json и указать номер COM порта, соответствующий подключенной плате: ![VsCode MasterProjects](./images/mp-screen6.png)

-----------------------------------------------------------------------------------------------------------


**Enjoy!**
