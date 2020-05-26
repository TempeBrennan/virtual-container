# VirtualContainer

## Background:

<b>Big Data Grid:</b>

Normally, we can create a grid view easily in browser. 

```javascript
        var div = document.createElement('div');
        div.style.width = "600px";
        div.style.height = "300px";
        div.style.border = "1px solid #F3F3F3";
        div.style.overflow = 'scroll';

        for (var i = 1; i <= 10000; i++) {
            var row = document.createElement('div');
            row.style.whiteSpace = 'nowrap';
            for (var j = 1; j <= 10000; j++) {
                var cell = document.createElement('div');
                cell.style.width = '100px';
                cell.style.display = 'inline-block';
                cell.style.borderRight = '1px solid #F3F3F3';
                cell.style.borderBottom = '1px solid #F3F3F3';
                cell.innerHTML = '(' + i + ',' + j +')';
                cell.style.textAlign = 'center';
                cell.style.fontSize = '10px';
                cell.fontFamily = '- apple - system, BlinkMacSystemFont, Roboto, Oxygen, Ubuntu, Cantarell';
                row.appendChild(cell);
            }
            div.appendChild(row);
        }
        document.body.appendChild(div);
```

<b>Effect:</b>

![code](grid.gif)

<b>When data become large</b>

![code](change-code.png)

Browser crash

![big data grid](big-data.gif)

## Usage:

You can use virtual container to solve this issue
```javascript
        var virtualContainer = new Cyz.VirtualContainer(document.querySelector('#container'), {
            rowCount: 50000,
            colCount: 50000,
            rowHeight: 30,
            colWidth: 80,
            width: document.querySelector('#container').offsetWidth,
            height: document.querySelector('#container').offsetHeight
        });

        virtualContainer.addEventListener('update', function (s, e) {
            e.cellList.forEach(c => {
                c.element.innerHTML = this.getData(c.rowIndex, c.columnIndex);
            });
        });

        virtualContainer.init();

        function getData(rowIndex, columnIndex) {
            return '(' + rowIndex + ',' + columnIndex +')';
        }
```

<b>Effect:</b>

![code](virtual-grid.gif)