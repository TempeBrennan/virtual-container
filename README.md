Virtual Container is trying to solve large data grid

## Background:

<b>Create grid in browser:</b>

```javascript
for (var i = 1; i <= 10000; i++) {
    var row = document.createElement('div');
    for (var j = 1; j <= 10000; j++) {
        var cell = document.createElement('div');
        // ...
        row.appendChild(cell);
    }
    div.appendChild(row);
}
document.body.appendChild(div);
```

<b>Effect:</b>

![grid](https://github.com/TempeBrennan/virtual-container/blob/master/res/grid.gif?raw=true)

<b>When data increase, huge quantity DOM slowed browser performance</b>

![effect1](https://github.com/TempeBrennan/virtual-container/blob/master/res/effect1.gif?raw=true)
![effect2](https://github.com/TempeBrennan/virtual-container/blob/master/res/effect2.png?raw=true)

<b>You can use virtual container to solve this issue</b>

![virtual-container](https://github.com/TempeBrennan/virtual-container/blob/master/res/virtual-grid.gif?raw=true)

## Easy to start:

example:
```javascript
var virtualContainer = new VirtualContainer(document.querySelector('#container'),
{
    rowCount: 5000,
    colCount: 5000,
    rowHeight: 30,
    colWidth: 80
});

virtualContainer.addEventListener('update', function (s, e) {
    e.cellList.forEach(c => {
        c.element.innerHTML = getData(c.rowIndex, c.columnIndex);
    });
});

virtualContainer.init();
function getData(rowIndex, columnIndex) {
    return `(${rowIndex + 1},${columnIndex + 1})`;
}
```

clone from here:

https://github.com/TempeBrennan/VirtualContainerExample

## API

```javascript
virtualContainer.resizeRow(3, 80);
```

![resizeRow](https://github.com/TempeBrennan/virtual-container/blob/master/res/api1.gif?raw=true)

```javascript
virtualContainer.resizeColumn(4, 300);
```

![resizeColumn](https://github.com/TempeBrennan/virtual-container/blob/master/res/api2.gif?raw=true)

```javascript
virtualContainer.scroll('vertical', 200);
```

![scroll1](https://github.com/TempeBrennan/virtual-container/blob/master/res/api3.gif?raw=true)

```javascript
virtualContainer.scroll('horizontal', 800);
```

![scroll2](https://github.com/TempeBrennan/virtual-container/blob/master/res/api4.gif?raw=true)

## Advantages
* Light
* More Usage (eg: ListBox ListView SpreadSheet)
* Continue Update

## Hoping your suggestion
Any bug or suggestion please write here

https://github.com/TempeBrennan/virtual-container/issues