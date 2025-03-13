// Hansen Bar Telegram Mini App
// This is the main JavaScript file that powers the Telegram mini app for Hansen Bar
// It allows users to browse the menu, add items to cart, and place takeout orders

const telegramWebApp = window.Telegram.WebApp;

// Initialize the WebApp
telegramWebApp.expand();
telegramWebApp.ready();

// Main app container
const appContainer = document.createElement('div');
appContainer.className = 'app-container';
document.body.appendChild(appContainer);

// Menu data structure based on the image
const menuData = {
  "ЗАКУСКА К ПИВУ": [
    { id: 1, name: "Пивная тарелка №1", description: "фри, луковые кольца, охотничьи колбаски, арахис", weight: "450г", price: 800 },
    { id: 2, name: "Пивная тарелка №2", description: "охотничьи колбаски, сырные палочки, куриные крылья BBQ, картофель фри, арахис", weight: "650г", price: 1200 },
    { id: 3, name: "Картофель фри с кетчупом", description: "", weight: "120г", price: 180 },
    { id: 4, name: "Попкорн из креветок с соусом сладкий чили", description: "", weight: "120г", price: 450 },
    { id: 5, name: "Охотничьи колбаски на гриле с кетчупом", description: "", weight: "130г", price: 350 },
    { id: 6, name: "Сырные палочки с тар-таром", description: "", weight: "150г", price: 380 },
    { id: 7, name: "Попкорн куриный с кетчупом", description: "", weight: "120г", price: 350 },
    { id: 8, name: "Луковые кольца с тар-таром", description: "", weight: "150г", price: 300 },
    { id: 9, name: "Крылья куриные BBQ (3шт)", description: "", weight: "", price: 250 },
    { id: 10, name: "Крылья куриные BBQ (6шт)", description: "", weight: "", price: 400 },
    { id: 11, name: "Крылья куриные BBQ (9шт)", description: "", weight: "", price: 550 },
    { id: 12, name: "Арахис жареный соленый", description: "", weight: "100г", price: 120 }
  ],
  "СОУСЫ": [
    { id: 13, name: "Кетчуп", description: "", weight: "50г", price: 30 },
    { id: 14, name: "Спайси", description: "", weight: "50г", price: 60 },
    { id: 15, name: "Горчичный", description: "", weight: "50г", price: 60 },
    { id: 16, name: "Барбекю", description: "", weight: "50г", price: 60 },
    { id: 17, name: "Сырный", description: "", weight: "50г", price: 60 },
    { id: 18, name: "Тар-тар", description: "", weight: "50г", price: 60 }
  ],
  "НАПИТКИ БЕЗАЛКОГОЛЬНЫЕ": [
    { id: 19, name: "Чай в чайнике (черный/зеленый)", description: "", weight: "900мл", price: 150 },
    { id: 20, name: "Чай в чайнике авторский", description: "", weight: "900мл", price: 250 },
    { id: 21, name: "Сок в ассортименте", description: "", weight: "250мл", price: 120 },
    { id: 22, name: "Газвода в ассортименте", description: "", weight: "250мл", price: 100 }
  ],
  "БУРГЕРЫ И ХОТ-ДОГ": [
    { id: 23, name: "Гамбургер", description: "говяжья котлета, американская булочка, салат, фирменный соус, томат, красный лук, бекон, лук фри", weight: "", price: 550 },
    { id: 24, name: "Чизбургер", description: "говяжья котлета, американская булочка, салат, фирменный и сырный соус, томат, красный лук, бекон, лук фри, сыр Чеддер", weight: "", price: 590 },
    { id: 25, name: "Чикенбургер", description: "куриная котлета, американская булочка, салат, фирменный соус, томат, красный лук, бекон, лук фри", weight: "", price: 450 },
    { id: 26, name: "Вегетарианбургер", description: "американская булочка, салат, фирменный соус, томат, красный лук, лук фри, вегетарианская котлета на выбор", weight: "", price: 400 },
    { id: 27, name: "Хот-дог", description: "сосиска, американская булочка, салат, фирменный соус, томат, лук фри, кетчуп, горчица", weight: "", price: 400 },
    { id: 28, name: "Сэндвич с тунцом", description: "хлеб тостовый, салат, огурец маринованный, соус тар-тар, тунец в собственном соку", weight: "", price: 380 }
  ],
  "ДОБАВКИ К БУРГЕРАМ": [
    { id: 29, name: "Сыр Чеддер", description: "", weight: "", price: 50 },
    { id: 30, name: "Халапеньо", description: "", weight: "", price: 50 },
    { id: 31, name: "Драник картофельный", description: "", weight: "", price: 100 }
  ]
};

// Shopping cart
let cart = [];

// Current view state
let currentView = 'categories';
let currentCategory = null;

// Render functions
function renderApp() {
  appContainer.innerHTML = '';
  
  const header = document.createElement('header');
  header.className = 'app-header';
  
  const title = document.createElement('h1');
  title.textContent = 'Hansen Bar';
  header.appendChild(title);
  
  const cartButton = document.createElement('button');
  cartButton.className = 'cart-button';
  cartButton.innerHTML = `🛒 ${cart.reduce((sum, item) => sum + item.quantity, 0)}`;
  cartButton.addEventListener('click', () => {
    currentView = 'cart';
    renderApp();
  });
  header.appendChild(cartButton);
  
  appContainer.appendChild(header);
  
  const content = document.createElement('div');
  content.className = 'content';
  
  if (currentView === 'categories') {
    renderCategories(content);
  } else if (currentView === 'category') {
    renderCategoryItems(content);
  } else if (currentView === 'cart') {
    renderCart(content);
  } else if (currentView === 'checkout') {
    renderCheckout(content);
  } else if (currentView === 'confirmation') {
    renderConfirmation(content);
  }
  
  appContainer.appendChild(content);
  
  const footer = document.createElement('footer');
  footer.className = 'app-footer';
  footer.textContent = '© Hansen Bar';
  appContainer.appendChild(footer);
}

function renderCategories(container) {
  const heading = document.createElement('h2');
  heading.textContent = 'Меню';
  container.appendChild(heading);
  
  const categoriesList = document.createElement('div');
  categoriesList.className = 'categories-list';
  
  Object.keys(menuData).forEach(category => {
    const categoryItem = document.createElement('div');
    categoryItem.className = 'category-item';
    categoryItem.textContent = category;
    categoryItem.addEventListener('click', () => {
      currentCategory = category;
      currentView = 'category';
      renderApp();
    });
    categoriesList.appendChild(categoryItem);
  });
  
  container.appendChild(categoriesList);
}

function renderCategoryItems(container) {
  const backButton = document.createElement('button');
  backButton.className = 'back-button';
  backButton.textContent = '← Назад к категориям';
  backButton.addEventListener('click', () => {
    currentView = 'categories';
    renderApp();
  });
  container.appendChild(backButton);
  
  const heading = document.createElement('h2');
  heading.textContent = currentCategory;
  container.appendChild(heading);
  
  const itemsList = document.createElement('div');
  itemsList.className = 'items-list';
  
  menuData[currentCategory].forEach(item => {
    const itemCard = document.createElement('div');
    itemCard.className = 'item-card';
    
    const itemName = document.createElement('h3');
    itemName.textContent = item.name;
    itemCard.appendChild(itemName);
    
    if (item.description) {
      const itemDesc = document.createElement('p');
      itemDesc.className = 'item-description';
      itemDesc.textContent = item.description;
      itemCard.appendChild(itemDesc);
    }
    
    const itemDetails = document.createElement('div');
    itemDetails.className = 'item-details';
    
    if (item.weight) {
      const itemWeight = document.createElement('span');
      itemWeight.className = 'item-weight';
      itemWeight.textContent = item.weight;
      itemDetails.appendChild(itemWeight);
    }
    
    const itemPrice = document.createElement('span');
    itemPrice.className = 'item-price';
    itemPrice.textContent = `${item.price}₽`;
    itemDetails.appendChild(itemPrice);
    
    itemCard.appendChild(itemDetails);
    
    const addButton = document.createElement('button');
    addButton.className = 'add-to-cart';
    addButton.textContent = 'Добавить';
    addButton.addEventListener('click', () => {
      addToCart(item);
    });
    itemCard.appendChild(addButton);
    
    itemsList.appendChild(itemCard);
  });
  
  container.appendChild(itemsList);
}

function renderCart(container) {
  const backButton = document.createElement('button');
  backButton.className = 'back-button';
  backButton.textContent = '← Продолжить покупки';
  backButton.addEventListener('click', () => {
    currentView = 'categories';
    renderApp();
  });
  container.appendChild(backButton);
  
  const heading = document.createElement('h2');
  heading.textContent = 'Корзина';
  container.appendChild(heading);
  
  if (cart.length === 0) {
    const emptyCart = document.createElement('p');
    emptyCart.className = 'empty-cart';
    emptyCart.textContent = 'Ваша корзина пуста';
    container.appendChild(emptyCart);
    return;
  }
  
  const cartItems = document.createElement('div');
  cartItems.className = 'cart-items';
  
  cart.forEach((item, index) => {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    
    const itemInfo = document.createElement('div');
    itemInfo.className = 'item-info';
    
    const itemName = document.createElement('h3');
    itemName.textContent = item.name;
    itemInfo.appendChild(itemName);
    
    const itemPrice = document.createElement('p');
    itemPrice.textContent = `${item.price}₽ x ${item.quantity} = ${item.price * item.quantity}₽`;
    itemInfo.appendChild(itemPrice);
    
    cartItem.appendChild(itemInfo);
    
    const itemControls = document.createElement('div');
    itemControls.className = 'item-controls';
    
    const decreaseBtn = document.createElement('button');
    decreaseBtn.textContent = '-';
    decreaseBtn.addEventListener('click', () => {
      updateCartItemQuantity(index, item.quantity - 1);
    });
    itemControls.appendChild(decreaseBtn);
    
    const quantityDisplay = document.createElement('span');
    quantityDisplay.className = 'quantity';
    quantityDisplay.textContent = item.quantity;
    itemControls.appendChild(quantityDisplay);
    
    const increaseBtn = document.createElement('button');
    increaseBtn.textContent = '+';
    increaseBtn.addEventListener('click', () => {
      updateCartItemQuantity(index, item.quantity + 1);
    });
    itemControls.appendChild(increaseBtn);
    
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.textContent = '🗑️';
    removeBtn.addEventListener('click', () => {
      removeFromCart(index);
    });
    itemControls.appendChild(removeBtn);
    
    cartItem.appendChild(itemControls);
    
    cartItems.appendChild(cartItem);
  });
  
  container.appendChild(cartItems);
  
  const totalSection = document.createElement('div');
  totalSection.className = 'total-section';
  
  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalText = document.createElement('h3');
  totalText.textContent = `Итого: ${totalAmount}₽`;
  totalSection.appendChild(totalText);
  
  const checkoutButton = document.createElement('button');
  checkoutButton.className = 'checkout-button';
  checkoutButton.textContent = 'Оформить заказ';
  checkoutButton.addEventListener('click', () => {
    currentView = 'checkout';
    renderApp();
  });
  totalSection.appendChild(checkoutButton);
  
  container.appendChild(totalSection);
}

function renderCheckout(container) {
  const backButton = document.createElement('button');
  backButton.className = 'back-button';
  backButton.textContent = '← Вернуться к корзине';
  backButton.addEventListener('click', () => {
    currentView = 'cart';
    renderApp();
  });
  container.appendChild(backButton);
  
  const heading = document.createElement('h2');
  heading.textContent = 'Оформление заказа';
  container.appendChild(heading);
  
  const form = document.createElement('form');
  form.className = 'checkout-form';
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    currentView = 'confirmation';
    renderApp();
  });
  
  const nameGroup = document.createElement('div');
  nameGroup.className = 'form-group';
  
  const nameLabel = document.createElement('label');
  nameLabel.setAttribute('for', 'name');
  nameLabel.textContent = 'Имя:';
  nameGroup.appendChild(nameLabel);
  
  const nameInput = document.createElement('input');
  nameInput.setAttribute('type', 'text');
  nameInput.setAttribute('id', 'name');
  nameInput.setAttribute('required', true);
  nameGroup.appendChild(nameInput);
  
  form.appendChild(nameGroup);
  
  const phoneGroup = document.createElement('div');
  phoneGroup.className = 'form-group';
  
  const phoneLabel = document.createElement('label');
  phoneLabel.setAttribute('for', 'phone');
  phoneLabel.textContent = 'Телефон:';
  phoneGroup.appendChild(phoneLabel);
  
  const phoneInput = document.createElement('input');
  phoneInput.setAttribute('type', 'tel');
  phoneInput.setAttribute('id', 'phone');
  phoneInput.setAttribute('required', true);
  phoneGroup.appendChild(phoneInput);
  
  form.appendChild(phoneGroup);
  
  const commentGroup = document.createElement('div');
  commentGroup.className = 'form-group';
  
  const commentLabel = document.createElement('label');
  commentLabel.setAttribute('for', 'comment');
  commentLabel.textContent = 'Комментарий к заказу:';
  commentGroup.appendChild(commentLabel);
  
  const commentInput = document.createElement('textarea');
  commentInput.setAttribute('id', 'comment');
  commentInput.setAttribute('rows', '3');
  commentGroup.appendChild(commentInput);
  
  form.appendChild(commentGroup);
  
  const submitButton = document.createElement('button');
  submitButton.setAttribute('type', 'submit');
  submitButton.className = 'submit-order';
  submitButton.textContent = 'Подтвердить заказ';
  form.appendChild(submitButton);
  
  container.appendChild(form);
}

function renderConfirmation(container) {
  const heading = document.createElement('h2');
  heading.textContent = 'Заказ оформлен!';
  container.appendChild(heading);
  
  const message = document.createElement('p');
  message.className = 'confirmation-message';
  message.textContent = 'Спасибо за ваш заказ! Мы свяжемся с вами в ближайшее время для подтверждения.';
  container.appendChild(message);
  
  const orderSummary = document.createElement('div');
  orderSummary.className = 'order-summary';
  
  const summaryHeading = document.createElement('h3');
  summaryHeading.textContent = 'Детали заказа:';
  orderSummary.appendChild(summaryHeading);
  
  const orderItems = document.createElement('ul');
  cart.forEach(item => {
    const listItem = document.createElement('li');
    listItem.textContent = `${item.name} x ${item.quantity} = ${item.price * item.quantity}₽`;
    orderItems.appendChild(listItem);
  });
  orderSummary.appendChild(orderItems);
  
  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalText = document.createElement('p');
  totalText.className = 'total-text';
  totalText.textContent = `Итого: ${totalAmount}₽`;
  orderSummary.appendChild(totalText);
  
  container.appendChild(orderSummary);
  
  const returnButton = document.createElement('button');
  returnButton.className = 'return-to-menu';
  returnButton.textContent = 'Вернуться в меню';
  returnButton.addEventListener('click', () => {
    cart = [];
    currentView = 'categories';
    renderApp();
  });
  container.appendChild(returnButton);
  
  // Send data to Telegram
  sendDataToTelegram();
}

// Cart management functions
function addToCart(item) {
  const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);
  
  if (existingItemIndex !== -1) {
    cart[existingItemIndex].quantity += 1;
  } else {
    cart.push({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1
    });
  }
  
  renderApp();
}

function updateCartItemQuantity(index, quantity) {
  if (quantity <= 0) {
    removeFromCart(index);
    return;
  }
  
  cart[index].quantity = quantity;
  renderApp();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  renderApp();
}

// Telegram integration
function sendDataToTelegram() {
  const orderText = cart.map(item => `${item.name} x ${item.quantity}`).join(', ');
  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Get form data
  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  const comment = document.getElementById('comment').value;
  
  const messageText = `Новый заказ на вынос:
Имя: ${name}
Телефон: ${phone}
Заказ: ${orderText}
Итого: ${totalAmount}₽
${comment ? `Комментарий: ${comment}` : ''}`;
  
  // Use the Telegram WebApp API to send data back to the bot
  telegramWebApp.sendData(messageText);
}

// CSS styles
const styles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Roboto', sans-serif;
  }
  
  body {
    background-color: #f5f5f5;
  }
  
  .app-container {
    max-width: 600px;
    margin: 0 auto;
    background-color: white;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  .app-header {
    background-color: #333;
    color: white;
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 10;
  }
  
  .app-header h1 {
    font-size: 1.5rem;
  }
  
  .cart-button {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .content {
    flex: 1;
    padding: 15px;
  }
  
  .content h2 {
    margin-bottom: 15px;
    color: #333;
  }
  
  .categories-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .category-item {
    background-color: #f1f1f1;
    padding: 15px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .category-item:hover {
    background-color: #e0e0e0;
  }
  
  .back-button {
    background-color: transparent;
    border: none;
    color: #333;
    padding: 5px 0;
    margin-bottom: 15px;
    cursor: pointer;
    display: flex;
    align-items: center;
    font-size: 0.9rem;
  }
  
  .items-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .item-card {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 15px;
    position: relative;
  }
  
  .item-card h3 {
    margin-bottom: 8px;
  }
  
  .item-description {
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 10px;
  }
  
  .item-details {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  
  .item-weight {
    color: #666;
    font-size: 0.9rem;
  }
  
  .item-price {
    font-weight: bold;
  }
  
  .add-to-cart {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;
    width: 100%;
  }
  
  .cart-items {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-bottom: 20px;
  }
  
  .cart-item {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .item-controls {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .item-controls button {
    background-color: #f1f1f1;
    border: none;
    width: 30px;
    height: 30px;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .quantity {
    min-width: 30px;
    text-align: center;
  }
  
  .remove-btn {
    color: #ff0000;
  }
  
  .total-section {
    border-top: 1px solid #ddd;
    padding-top: 15px;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .checkout-button {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
  }
  
  .empty-cart {
    text-align: center;
    color: #666;
    margin: 30px 0;
  }
  
  .checkout-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  
  .form-group label {
    font-weight: bold;
  }
  
  .form-group input, .form-group textarea {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .submit-order {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    margin-top: 10px;
  }
  
  .confirmation-message {
    text-align: center;
    margin: 20px 0;
  }
  
  .order-summary {
    background-color: #f9f9f9;
    border-radius: 4px;
    padding: 15px;
    margin: 20px 0;
  }
  
  .order-summary h3 {
    margin-bottom: 10px;
  }
  
  .order-summary ul {
    list-style-type: none;
    margin-left: 10px;
  }
  
  .order-summary li {
    margin-bottom: 5px;
  }
  
  .total-text {
    font-weight: bold;
    margin-top: 10px;
  }
  
  .return-to-menu {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    margin-top: 20px;
  }
  
  .app-footer {
    background-color: #333;
    color: white;
    text-align: center;
    padding: 15px;
    font-size: 0.8rem;
  }
`;

// Add styles to head
const styleElement = document.createElement('style');
styleElement.textContent = styles;
document.head.appendChild(styleElement);

// Add links for fonts
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap';
document.head.appendChild(fontLink);

// Initialize app
renderApp();
