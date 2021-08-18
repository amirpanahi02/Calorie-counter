const StorageCtrl = (function(){
    return{
        getItemsFromStorage:function(){
            let items;
            if(localStorage.getItem('items') == null){z
                items = []
            } else {
                items = JSON.parse(localStorage.getItem("items"))
            }
            return items
        },
        storeItem:function(item){
            let items ;
            if(localStorage.getItem('items') == null){
                items = []
            } else {
                items = JSON.parse(localStorage.getItem("items"))
            }
            items.push(item)
            localStorage.setItem('items', JSON.stringify(items))
        },
        updateItem:function(updatedItem){
            let items = JSON.parse(localStorage.getItem('items'))
            items.forEach((item, index) => {
                if(item.id === updatedItem.id){
                    items.splice(index, 1 , updatedItem)
                }
            })
            localStorage.setItem('items', JSON.stringify(items))
        },
        deleteItem:function(id){
            let items = JSON.parse(localStorage.getItem('items'))
            items.forEach((item, index) => {
                if(item.id === id) {
                    items.splice(index, 1)
                }
            })
            localStorage.setItem('items', JSON.stringify(items))
        },
        clearItems:function(){
            localStorage.removeItem('items')
        }
    }
})()
const ItemCtrl = (function() {
    const Item = function(id, name, calorie) {
        this.id = id 
        this.name = name 
        this.calorie = calorie
    }

    const data = {
        items:StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    }

    return {
        getItems:function(){
            return data.items
        },
        logData:function(){
            return data
        },
        getCurrentItem: function(){
            return data.currentItem
        },
        getTotalCalorires: function(){
            let total = 0;
            data.items.forEach(item => {
                total += item.calorie
            })

            data.totalCalories = total
            return data.totalCalories
        },
        addItem: function(name,calorie) {
            let ID;
            if(data.items.length > 0){
                ID = data.items[data.items.length - 1].id + 1
            }else {
                ID = 0
            }
            newItem = new Item(ID, name, parseInt(calorie))
            data.items.push(newItem)

            return newItem
        },
        updatedItem:function(name, calorie){
            let found = null
            data.items.forEach(item => {
                if(data.currentItem.id === item.id){
                    item.name = name
                    item.calorie = calorie
                    found = item
                }
                
            })
            return found
        },
        deleteItem:function(id){
            const ids = data.items.map(item => item.id)
            const index = ids.indexOf(id)
            data.items.splice(index, 1)

        },
        clearItems:function(){
            data.items = []
        },
        setCurrentItem: function (item){
            data.currentItem = item
        },
        getItemByID: function(id) {
            let found = null;
            data.items.forEach(item => {
                if(item.id === id){
                    found = item
                }
            })
            return found
        }
    }
})()

const UICtrl = (function() {
    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
    }
    return {
        populateItemList: function(items){
            let html = '';
            items.forEach(item => {
                html += `
                <li class="collection-item" id="item-${item.id}">
                    <strong>${item.name}: </strong> <em>${item.calorie} Calories</em>
                    <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                    </a>
                </li>`

                document.querySelector(UISelectors.itemList).innerHTML = html
            });
        },
        getItemInput: function(){
            return {
                name:document.querySelector(UISelectors.itemNameInput).value,
                calorie:document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        getUISelectors: function(){
            return UISelectors
        },
        addListItem: function(item){
            document.querySelector(UISelectors.itemList).style.display = 'block';
            const listItem = document.createElement('li')
            listItem.className = "collection-item"
            listItem.id = `item-${item.id}`
            listItem.innerHTML = `
                <strong>${item.name}: </strong> <em>${item.calorie} Calories</em>
                <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i>
                </a>`
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', listItem)
        },
        updateItem:function(item) {
            let listItems = document.querySelectorAll(UISelectors.listItems)
            listItems = Array.from(listItems)
            listItems.forEach(listItem => {
                const itemID = listItem.getAttribute('id')
                if(itemID === `item-${item.id}`){
                    document.querySelector(`#item-${item.id}`).innerHTML =  `
                    <strong>${item.name}: </strong> <em>${item.calorie} Calories</em>
                    <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                    </a>
                    `
                }
            })
        },
        deleteItem:function(id){
            document.querySelector(`#item-${id}`).remove()
        },
        showTotalCalories: function(totalCalories){
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories
        },
        clearInputItems:function(){
            document.querySelector(UISelectors.itemNameInput).value = ''
            document.querySelector(UISelectors.itemCaloriesInput).value = ''
        },
        hideList:function(){
            document.querySelector(UISelectors.itemList).style.display = 'none'
        },
        removeAllItems:function(){
            let listItems = document.querySelectorAll(UISelectors.listItems)
            listItems = Array.from(listItems)
            listItems.forEach(item =>{
                item.remove()
            })
        },
        showEditState: function(){
            document.querySelector(UISelectors.addBtn).style.display = 'none'
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
        },
        clearEditState: function(){
            UICtrl.clearInputItems();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        addItemToForm: function(){
            UICtrl.showEditState()
            currentItem = ItemCtrl.getCurrentItem()
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calorie
        },
    }
})()

const app = (function(ItemCtrl, UICtrl, StorageCtrl) {
    const loadEventListeners = function() {
        const UISelectors = UICtrl.getUISelectors()
        document.addEventListener('keypress', function(e){
            if(e.keyCode === 13 || e.which === 13){
              e.preventDefault();
              return false;
            }
          });      
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit)
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearItems)
        document.querySelector(UISelectors.itemList).addEventListener('click', editState)
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit)
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit)
        document.querySelector(UISelectors.backBtn).addEventListener('click', backSubmit)
    }

    const itemAddSubmit = function(e){
        const input = UICtrl.getItemInput()
        if(input.name !== '' && input.calorie !== ''){
            const newItem = ItemCtrl.addItem(input.name, input.calorie)
            UICtrl.addListItem(newItem)
            StorageCtrl.storeItem(newItem)
            const totalCalories = ItemCtrl.getTotalCalorires()
            UICtrl.showTotalCalories(totalCalories)
            UICtrl.clearInputItems()
        }
        e.preventDefault()
    }

    const editState = function(e) {
        if(e.target.classList.contains('edit-item')){
            const LiID = e.target.parentNode.parentNode.id
            const LiIDArr = LiID.split('-')
            ItemCtrl.setCurrentItem(ItemCtrl.getItemByID(parseInt(LiIDArr[1])))
            UICtrl.addItemToForm()
        }
        e.preventDefault()
    }
    const itemUpdateSubmit = function(e){
        const input = UICtrl.getItemInput()
        console.log(input.name)
        const updatedItem = ItemCtrl.updatedItem(input.name, parseInt(input.calorie))
        UICtrl.updateItem(updatedItem)
        StorageCtrl.updateItem(updatedItem)
        const totalCalories = ItemCtrl.getTotalCalorires();
        UICtrl.showTotalCalories(totalCalories)
        UICtrl.clearEditState()
        e.preventDefault()
    }
    const itemDeleteSubmit = function(e){
        const currentItem = ItemCtrl.getCurrentItem()
        ItemCtrl.deleteItem(currentItem.id)
        UICtrl.deleteItem(currentItem.id)
        StorageCtrl.deleteItem(currentItem.id)
        const totalCalories = ItemCtrl.getTotalCalorires();
        UICtrl.showTotalCalories(totalCalories)
        UICtrl.clearEditState()
        e.preventDefault()
    };
    const backSubmit = function(e){
        UICtrl.clearEditState()
        e.preventDefault()
    }
    const clearItems = function(e){
        ItemCtrl.clearItems()
        StorageCtrl.clearItems()
        UICtrl.removeAllItems()
        UICtrl.clearEditState()
        const totalCalories = ItemCtrl.getTotalCalorires();
        UICtrl.showTotalCalories(totalCalories)
        UICtrl.hideList()
        e.preventDefault()
    }
    return {
        innit:function(){
            UICtrl.clearEditState()
            const items = ItemCtrl.getItems()
            const totalCalories = ItemCtrl.getTotalCalorires()
            UICtrl.showTotalCalories(totalCalories)
            if (items.length > 0 ){
                UICtrl.populateItemList(items)
            }else {
                UICtrl.hideList()
            }
            loadEventListeners()
        }
    }
})(ItemCtrl, UICtrl, StorageCtrl)

app.innit()